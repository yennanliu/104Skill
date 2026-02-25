---
name: 104-job-auto-apply
description: Automate job applications on 104.com.tw using Playwright MCP tools. Supports single job applications, batch processing, and multi-page automation with controls.
---

# 104.com.tw Job Application Automation Skill

This skill enables automated job applications on 104.com.tw using Playwright MCP browser automation tools.

## When to Use This Skill

Use this skill when:
- Applying to multiple jobs on 104.com.tw
- Automating repetitive job application tasks
- Batch processing job applications across multiple pages
- Testing job application flows

## Prerequisites

Before using this skill, ensure:
- User is logged in to their 104.com.tw account
- Resume is uploaded to 104.com.tw
- At least one cover letter is created (note the exact name for configuration)
- Playwright MCP tools are available
- Stable internet connection

## Installation

### Claude Code Marketplace (Recommended)

```bash
claude

# Add to marketplace
/plugin marketplace add yennanliu/104Skill

# Install the skill
/plugin install 104-job-auto-apply

# Use the skill
/104-job-auto-apply
```

### Local Development

For testing local modifications:

```bash
# Add local marketplace
/plugin marketplace add /path/to/104Skill

# Install from local source
/plugin install 104-job-auto-apply@local
```

## Usage Modes

### Mode 1: Single Job Application (Manual Testing)

Use this for testing or applying to one job at a time.

**Step 1: Navigate to job search page**
```javascript
await page.goto('https://www.104.com.tw/jobs/search/?area=6001001000,6001002000&jobsource=joblist_search&keyword=%20%20%20%20%E8%BB%9F%E9%AB%94%E5%B7%A5%E7%A8%8B%E5%B8%AB&order=15&page=1&remoteWork=1,2');
await page.waitForTimeout(2000);
```

**Step 2: List available jobs**
```javascript
const jobs = await page.evaluate(() => {
  const containers = document.querySelectorAll('[class*="job-list-container"]');
  const jobs = [];

  containers.forEach((container, index) => {
    const titleLink = container.querySelector('a[href*="/job/"]');
    const title = titleLink ? titleLink.textContent.trim() : 'Unknown';

    const companyElement = container.querySelector('[class*="company"]');
    const company = companyElement ? companyElement.textContent.trim() : 'Unknown';

    const alreadyApplied = container.textContent.includes('已應徵');

    jobs.push({
      index: index,
      title: title.substring(0, 60),
      company: company.substring(0, 40),
      alreadyApplied: alreadyApplied
    });
  });

  return jobs;
});

console.log('Available jobs:', jobs);
```

**Step 3: Apply to a single job**
```javascript
// Click apply button for job at index 0
await page.evaluate(() => {
  const buttons = document.querySelectorAll('.apply-button__button');
  buttons[0].click(); // Change index for different jobs
});
await page.waitForTimeout(2000);

// Get the new tab that opened
const pages = await page.context().pages();
const newTab = pages[pages.length - 1];
await newTab.bringToFront();
await newTab.waitForTimeout(1000);

// Select cover letter
await newTab.evaluate(() => {
  const span = Array.from(document.querySelectorAll('span'))
    .find(el => el.textContent === '系統預設' && el.tagName === 'SPAN');
  if (span?.parentElement) span.parentElement.click();
});
await newTab.waitForTimeout(500);

await newTab.evaluate(() => {
  const options = document.querySelectorAll('.multiselect__option');
  options.forEach(opt => {
    if (opt.textContent.trim() === '自訂推薦信1') opt.click();
  });
});
await newTab.waitForTimeout(500);

// Submit application
await newTab.evaluate(() => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.textContent.includes('確認送出')) btn.click();
  });
});
await newTab.waitForTimeout(2000);

// Verify success
const finalUrl = newTab.url();
const success = finalUrl.includes('/job/apply/done/');
console.log(success ? '✅ Application submitted successfully!' : '❌ Application may have failed');

// Close tab and return to main page
await newTab.close();
await page.bringToFront();
```

### Mode 2: Batch Automation with Controls

Use this for applying to multiple jobs with pause/resume/quit controls.

**Configuration:**
```javascript
const options = {
  startPage: 1,           // Starting page number
  maxPages: 5,            // Maximum number of pages to process
  delayMin: 2000,         // Minimum delay between applications (ms)
  delayMax: 4000,         // Maximum delay between applications (ms)
  coverLetter: '自訂推薦信1', // Cover letter to use
  logDir: '.'             // Directory to save result log file (default: current dir)
};
```

**Complete automation function:**
```javascript
async function autoApply104Jobs(page, options = {}) {
  const {
    startPage = 1,
    maxPages = 5,
    delayMin = 2000,
    delayMax = 4000,
    coverLetter = '自訂推薦信1',
    logDir = '.'
  } = options;

  // ── Log file setup ───────────────────────────────────────────────────────
  const fs = require('fs');
  const path = require('path');

  const runStart = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dateTag = `${runStart.getFullYear()}${pad(runStart.getMonth()+1)}${pad(runStart.getDate())}`;
  const timeTag = `${pad(runStart.getHours())}${pad(runStart.getMinutes())}${pad(runStart.getSeconds())}`;
  const logFile = path.resolve(logDir, `${dateTag}_${timeTag}_result.txt`);

  fs.mkdirSync(path.dirname(logFile), { recursive: true });

  function logLine(text = '') {
    fs.appendFileSync(logFile, text + '\n', 'utf8');
  }

  // Write run header to log file
  logLine('='.repeat(70));
  logLine('104.com.tw Job Auto-Apply — Run Log');
  logLine(`Started   : ${runStart.toLocaleString()}`);
  logLine(`Log File  : ${logFile}`);
  logLine(`Config    : startPage=${startPage}, maxPages=${maxPages}, coverLetter=${coverLetter}`);
  logLine('='.repeat(70));
  logLine();
  // ────────────────────────────────────────────────────────────────────────

  const results = {
    success: [],
    skipped: [],
    failed: [],
    totalProcessed: 0
  };

  // Helper: extract job ID from 104 URL (e.g. /job/6dx3a → "6dx3a")
  function extractJobId(url) {
    return url.match(/\/job\/([a-zA-Z0-9]+)/)?.[1] ?? 'unknown';
  }

  async function applyToJob(job) {
    console.log(`\n🔍 Processing: ${job.title}`);

    let result;
    try {
      // Navigate to job detail page
      await page.goto(job.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Check if already applied
      const pageText = await page.evaluate(() => document.body.textContent);
      if (pageText.includes('已應徵') || pageText.includes('今日已應徵')) {
        console.log('   ⚠️  SKIPPED: Already applied');
        result = { status: 'skipped', reason: 'Already applied', job };
      } else {

        // Find and click apply button
        const applyClicked = await page.evaluate(() => {
          const allElements = Array.from(document.querySelectorAll('button, a, div'));
          const applyBtn = allElements.find(el => {
            const text = el.textContent || '';
            return (text.includes('我要應徵') || text.trim() === '應徵') &&
                   !text.includes('已應徵') &&
                   !text.includes('人應徵') &&
                   el.offsetParent !== null;
          });
          if (applyBtn) { applyBtn.click(); return true; }
          return false;
        });

        if (!applyClicked) {
          console.log('   ⚠️  SKIPPED: No apply button found');
          result = { status: 'skipped', reason: 'No apply button', job };
        } else {
          await page.waitForTimeout(2000);

          // Verify application form opened
          const currentUrl = page.url();
          if (!currentUrl.includes('apply=form')) {
            console.log('   ⚠️  SKIPPED: Apply form not opened');
            result = { status: 'skipped', reason: 'Apply form not opened', job };
          } else {

            // Open cover letter dropdown
            const dropdownOpened = await page.evaluate(() => {
              const dropdowns = Array.from(document.querySelectorAll('div'));
              const dropdown = dropdowns.find(el => {
                const text = el.textContent || '';
                return text.includes('系統預設') || text.includes('自訂推薦信');
              });
              if (dropdown) {
                const clickable = dropdown.querySelector('.multiselect__select') ||
                                  dropdown.querySelector('[class*="select"]') ||
                                  dropdown;
                clickable.click();
                return true;
              }
              return false;
            });

            if (!dropdownOpened) {
              console.log('   ⚠️  SKIPPED: Cover letter dropdown not found');
              result = { status: 'skipped', reason: 'Cover letter dropdown not found', job };
            } else {
              await page.waitForTimeout(1500);

              // Select cover letter
              const optionSelected = await page.evaluate((letterName) => {
                const option = Array.from(document.querySelectorAll('span, div, li'))
                  .find(el => el.textContent.trim() === letterName);
                if (option) { option.click(); return true; }
                return false;
              }, coverLetter);

              if (!optionSelected) {
                console.log(`   ⚠️  SKIPPED: Cover letter "${coverLetter}" not found`);
                result = { status: 'skipped', reason: `Cover letter "${coverLetter}" not found`, job };
              } else {
                await page.waitForTimeout(1000);

                // Submit application
                const submitted = await page.evaluate(() => {
                  const btn = Array.from(document.querySelectorAll('button'))
                    .find(el => el.textContent.includes('確認送出'));
                  if (btn) { btn.click(); return true; }
                  return false;
                });

                if (!submitted) {
                  console.log('   ⚠️  SKIPPED: Submit button not found');
                  result = { status: 'skipped', reason: 'Submit button not found', job };
                } else {
                  await page.waitForTimeout(3000);

                  // Verify success
                  const finalUrl = page.url();
                  if (finalUrl.includes('/job/apply/done/')) {
                    console.log('   ✅ SUCCESS: Application submitted');
                    result = { status: 'success', job };
                  } else {
                    console.log('   ❌ FAILED: Submit confirmation not received');
                    result = { status: 'failed', reason: 'Submit confirmation not received', job };
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      result = { status: 'failed', reason: error.message, job };
    }

    // ── Write job entry to log file ────────────────────────────────────────
    const jobId = extractJobId(job.url);
    const ts = new Date().toLocaleString();
    const statusLabel = result.status.toUpperCase();
    const reasonSuffix = result.reason ? ` (${result.reason})` : '';
    logLine(`[${results.totalProcessed + 1}] ${statusLabel}${reasonSuffix}`);
    logLine(`  Title    : ${job.title}`);
    logLine(`  Company  : ${job.company  || '(unknown)'}`);
    logLine(`  ID       : ${jobId}`);
    logLine(`  URL      : ${job.url}`);
    logLine(`  Salary   : ${job.salary   || '(not listed)'}`);
    logLine(`  Location : ${job.location || '(not listed)'}`);
    logLine(`  Tags     : ${job.tags?.join(', ') || '(none)'}`);
    logLine(`  Time     : ${ts}`);
    logLine();
    // ────────────────────────────────────────────────────────────────────────

    return result;
  }

  async function collectJobsFromPage(pageNum) {
    const searchUrl = `https://www.104.com.tw/jobs/search/?page=${pageNum}&keyword=++++%E8%BB%9F%E9%AB%94%E5%B7%A5%E7%A8%8B%E5%B8%AB&jobsource=joblist_search&order=15&remoteWork=1,2&area=6001001000,6001002000`;

    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const jobData = await page.evaluate(() => {
      const links = [];
      const seenUrls = new Set();

      document.querySelectorAll('a[href*="/job/"]').forEach((linkElement) => {
        const jobUrl = linkElement.href;
        if (seenUrls.has(jobUrl)) return;
        seenUrls.add(jobUrl);

        const container = linkElement.closest('article') || linkElement.parentElement?.parentElement;
        const jobTitle = linkElement.textContent.trim();
        const containerText = container ? container.textContent : '';

        const alreadyApplied = containerText.includes('今日已應徵') || containerText.includes('已應徵');
        const cantApply = containerText.includes('無法應徵') || containerText.includes('關閉職缺');

        if (jobUrl.includes('/job/') && !alreadyApplied && !cantApply) {
          const company  = container?.querySelector('[class*="company"]')?.textContent.trim() ?? '';
          const salary   = container?.querySelector('[class*="salary"]')?.textContent.trim() ?? '';
          const location = container?.querySelector('[class*="location"], [class*="area"]')?.textContent.trim() ?? '';
          const tagEls   = container?.querySelectorAll('[class*="tag"], [class*="label"]') ?? [];
          const tags     = Array.from(tagEls).map(el => el.textContent.trim()).filter(Boolean);

          links.push({
            url:      jobUrl,
            title:    jobTitle.substring(0, 100),
            company:  company.substring(0, 50),
            salary:   salary.substring(0, 50),
            location: location.substring(0, 50),
            tags:     tags.slice(0, 5)
          });
        }
      });

      return links;
    });

    return jobData;
  }

  // Main automation loop
  console.log('\n' + '='.repeat(70));
  console.log('🚀 104.com.tw Auto-Apply Automation');
  console.log(`   Start Page  : ${startPage}`);
  console.log(`   Max Pages   : ${maxPages}`);
  console.log(`   Cover Letter: ${coverLetter}`);
  console.log(`   Log File    : ${logFile}`);
  console.log('='.repeat(70) + '\n');

  let currentPage = startPage;
  const endPage = startPage + maxPages - 1;

  while (currentPage <= endPage) {
    console.log(`\n📄 [Page ${currentPage}]`);
    logLine(`--- Page ${currentPage} ---`);

    const jobs = await collectJobsFromPage(currentPage);
    console.log(`   Found ${jobs.length} jobs to process`);

    if (jobs.length === 0) {
      console.log('   No more jobs found. Stopping automation.');
      logLine('No more jobs found on this page. Stopping.');
      break;
    }

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      console.log(`\n   [${i + 1}/${jobs.length}]`);

      const result = await applyToJob(job);

      if (result.status === 'success') {
        results.success.push(result.job);
      } else if (result.status === 'skipped') {
        results.skipped.push({ job: result.job, reason: result.reason });
      } else {
        results.failed.push({ job: result.job, reason: result.reason });
      }

      results.totalProcessed++;

      const delay = delayMin + Math.random() * (delayMax - delayMin);
      console.log(`   ⏱️  Waiting ${(delay / 1000).toFixed(1)}s before next job...`);
      await page.waitForTimeout(delay);
    }

    currentPage++;
  }

  // ── Write summary to log file ────────────────────────────────────────────
  const runEnd = new Date();
  const durationSec = ((runEnd - runStart) / 1000).toFixed(1);

  logLine('='.repeat(70));
  logLine('SUMMARY');
  logLine('='.repeat(70));
  logLine(`Completed       : ${runEnd.toLocaleString()}`);
  logLine(`Duration        : ${durationSec}s`);
  logLine(`Total Processed : ${results.totalProcessed}`);
  logLine(`Success         : ${results.success.length}`);
  logLine(`Skipped         : ${results.skipped.length}`);
  logLine(`Failed          : ${results.failed.length}`);
  logLine();

  if (results.success.length > 0) {
    logLine('-- Successfully Applied --');
    results.success.forEach((job, i) => {
      logLine(`  ${i + 1}. [${extractJobId(job.url)}] ${job.title} @ ${job.company}`);
      logLine(`     ${job.url}`);
    });
    logLine();
  }

  if (results.failed.length > 0) {
    logLine('-- Failed --');
    results.failed.forEach(({ job, reason }, i) => {
      logLine(`  ${i + 1}. [${extractJobId(job.url)}] ${job.title}`);
      logLine(`     Reason : ${reason}`);
      logLine(`     URL    : ${job.url}`);
    });
    logLine();
  }

  logLine('='.repeat(70));
  // ────────────────────────────────────────────────────────────────────────

  // Print final summary to console
  console.log('\n' + '='.repeat(70));
  console.log('📊 Final Summary');
  console.log('='.repeat(70));
  console.log(`   Total Processed     : ${results.totalProcessed}`);
  console.log(`   ✅ Successfully Applied: ${results.success.length}`);
  console.log(`   ⚠️  Skipped           : ${results.skipped.length}`);
  console.log(`   ❌ Failed            : ${results.failed.length}`);
  console.log(`   ⏱️  Duration          : ${durationSec}s`);
  console.log('='.repeat(70));
  console.log(`\n📄 Full results saved to: ${logFile}\n`);

  return results;
}

// Usage
await autoApply104Jobs(page, { startPage: 1, maxPages: 3, logDir: '.' });
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `startPage` | number | 1 | Starting page number for job search |
| `maxPages` | number | 5 | Maximum number of pages to process |
| `delayMin` | number | 2000 | Minimum delay between applications (ms) |
| `delayMax` | number | 4000 | Maximum delay between applications (ms) |
| `coverLetter` | string | '自訂推薦信1' | Cover letter to use for applications |
| `logDir` | string | `'.'` | Directory to save the result log file |

### Log File

Every run saves a timestamped file `YYYYMMDD_HHMMSS_result.txt` in `logDir`.
Each entry contains:

| Field | Description |
|-------|-------------|
| `Title` | Job title |
| `Company` | Company name |
| `ID` | Job ID extracted from the 104 URL |
| `URL` | Full job URL |
| `Salary` | Salary range (if listed on the search page) |
| `Location` | Work location / area |
| `Tags` | Job tags / labels |
| `Time` | Timestamp of the application attempt |
| `Result` | `SUCCESS`, `SKIPPED (reason)`, or `FAILED (reason)` |

A summary block at the end lists duration, totals, and full URL lists for successes and failures.

## Safety Features

- **Skip already applied jobs**: Automatically detects and skips jobs already applied to
- **Random delays**: Uses random delays (2-4 seconds) between applications to avoid detection
- **Error handling**: Gracefully handles errors for each job without stopping the entire process
- **Detailed logging**: Provides detailed console output for monitoring progress
- **Maximum page limit**: Prevents runaway execution with configurable page limits

## Limitations

- Cannot handle CAPTCHA (must be solved manually)
- Cannot handle custom application forms
- Cannot handle jobs requiring additional information
- Requires browser to stay open during execution
- User must be logged in before starting

## Troubleshooting

### Problem: "Apply button not found"
**Solution**: Verify user is logged in and page has fully loaded

### Problem: "Cover letter not found"
**Solution**: Verify exact cover letter name in 104.com.tw account settings

### Problem: Applications failing
**Solutions**:
1. Check internet connection
2. Increase delays between jobs
3. Verify account status
4. Test with manual single job application first

### Problem: Script stops unexpectedly
**Solutions**:
1. Check console for errors
2. Verify page structure hasn't changed
3. Try reducing maxPages value
4. Resume from last successful page

## Best Practices

### Before Running
- Test with 1-2 jobs manually first
- Verify cover letter and resume are correct
- Check search criteria match your skills
- Ensure stable internet connection

### During Execution
- Monitor first few applications
- Be ready to stop if errors occur
- Don't interfere with browser while running

### After Completion
- Verify successful applications in 104.com.tw account
- Check email for confirmation/interview invites
- Review any failed applications

## Legal & Ethical Usage

**Important**: This tool is for educational and personal productivity purposes only.

- Only apply to jobs you're genuinely interested in and qualified for
- Do not spam applications
- Respect rate limits and server load
- Use responsibly and in accordance with 104.com.tw Terms of Service
- Recommended maximum: 10-20 jobs per session
- Take breaks between sessions

## Example Workflows

### Workflow 1: Careful Manual Application
```javascript
// 1. Navigate to search page
await page.goto('https://www.104.com.tw/jobs/search/?keyword=軟體工程師&remoteWork=1,2');

// 2. List jobs to review
const jobs = await page.evaluate(() => {
  const containers = document.querySelectorAll('[class*="job-list-container"]');
  return Array.from(containers).map((c, i) => ({
    index: i,
    title: c.querySelector('a[href*="/job/"]')?.textContent.trim()
  }));
});
console.log(jobs);

// 3. Apply to specific job (e.g., index 5)
// ... [single job application code from Mode 1]
```

### Workflow 2: Batch Processing Multiple Pages
```javascript
// Apply to jobs on pages 1-3 with default settings
await autoApply104Jobs(page, {
  startPage: 1,
  maxPages: 3,
  delayMin: 2000,
  delayMax: 4000
});
```

### Workflow 3: Conservative Automation
```javascript
// Slower, more conservative approach
await autoApply104Jobs(page, {
  startPage: 1,
  maxPages: 2,
  delayMin: 5000,  // 5 second minimum delay
  delayMax: 8000   // 8 second maximum delay
});
```

## Technical Notes

### Browser Automation
- Uses Playwright MCP tools for browser control
- Handles tab management (opening/closing application tabs)
- Implements wait times for page loads and DOM updates

### Job Detection
- Identifies jobs using CSS selectors
- Filters out already applied jobs
- Excludes closed or unavailable positions

### Application Flow
1. Navigate to job detail page
2. Check if already applied
3. Click apply button
4. Wait for application form
5. Select cover letter from dropdown
6. Submit application
7. Verify success page
8. Return to job list

### Error Recovery
- Try-catch blocks around each job application
- Continues to next job if one fails
- Cleans up tabs even on errors
- Provides detailed error messages

## Reference Files

For implementation details, see the original automation code:
- `/Users/jerryliu/ai_experiment/104/104_auto_apply_complete.js` - Full automation implementation
- `/Users/jerryliu/ai_experiment/104/104_auto_apply_with_controls.js` - Version with pause/resume controls
- `/Users/jerryliu/ai_experiment/104/apply_single_job.js` - Single job helper functions
- `/Users/jerryliu/ai_experiment/104/README_104_AUTOMATION.md` - Detailed documentation

---

**Remember**: Use this skill responsibly. Quality applications to genuinely suitable positions are more valuable than quantity.

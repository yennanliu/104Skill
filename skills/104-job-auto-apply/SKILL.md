---
name: 104-job-auto-apply
description: Automate job applications on 104.com.tw using Playwright MCP tools. Features target-based stopping, keyboard controls (P/R/Q), on-page status indicator, and proven 92.5% success rate over 2,495 applications.
---

# 104.com.tw Job Application Automation Skill

**Proven at Scale**: 2,495 successful applications | 92.5% success rate | 609 apps/hour

This skill enables automated job applications on 104.com.tw using Playwright MCP browser automation tools with intelligent target-based execution and real-time keyboard controls.

## When to Use This Skill

Use this skill when:
- **Daily job hunting**: Apply to 20-50 jobs automatically
- **Target-based applications**: Stop exactly when you reach N applications
- **Efficient batch processing**: Apply from search results without visiting detail pages
- **Controlled automation**: Need pause/resume/quit controls during execution
- **Scale applications**: Proven to handle hundreds of applications reliably
- **Resume from interruption**: Continue from specific page after breaks

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

### Mode 2: Target-Based Automation with Keyboard Controls

Use this for applying to jobs with **real-time keyboard controls** and **target-based stopping**.

**Features:**
- Press **P** to PAUSE automation
- Press **R** to RESUME automation
- Press **Q** to QUIT automation
- Stops automatically when target number of applications is reached
- On-page status indicator showing progress
- Efficient search page automation (no need to visit detail pages)

**Configuration:**
```javascript
const options = {
  startPage: 1,               // Starting page number
  targetApplications: 20,     // Target number of successful applications
  maxPages: 20,              // Maximum number of pages to search
  coverLetter: '自訂推薦信1'    // Cover letter name (must match exactly)
};
```

**Complete automation function (based on proven 2,495-application case study):**
```javascript
async function autoApply104Jobs(page, options = {}) {
  const {
    startPage = 1,
    targetApplications = 20,
    maxPages = 20,
    coverLetter = '自訂推薦信1'
  } = options;

  console.log(`🚀 Starting Automation - Target: ${targetApplications} applications\n`);
  console.log('Keyboard Controls:');
  console.log('  P = Pause automation');
  console.log('  R = Resume automation');
  console.log('  Q = Quit automation\n');

  const results = {
    successful: 0,
    failed: 0,
    skipped: 0,
    pages: []
  };

  const BASE_URL = 'https://www.104.com.tw/jobs/search/?area=6001001000,6001002000&jobsource=joblist_search&keyword=%20%20%20%20%E8%BB%9F%E9%AB%94%E5%B7%A5%E7%A8%8B%E5%B8%AB&order=15&remoteWork=1,2';

  // Helper: Check user keyboard control
  async function checkUserControl() {
    const control = await page.evaluate(() => ({
      paused: window.automationControl?.paused || false,
      quit: window.automationControl?.quit || false
    }));

    if (control.quit) throw new Error('USER_QUIT');

    if (control.paused) {
      await page.evaluate(() => window.updateStatus({ status: 'PAUSED', current: 0, target: 0 }));
      console.log('⏸️  Automation paused. Press R to resume...');

      while (true) {
        await page.waitForTimeout(1000);
        const newControl = await page.evaluate(() => ({
          paused: window.automationControl?.paused || false,
          quit: window.automationControl?.quit || false
        }));

        if (newControl.quit) throw new Error('USER_QUIT');
        if (!newControl.paused) {
          await page.evaluate(() => window.updateStatus({ status: 'RUNNING', current: 0, target: 0 }));
          console.log('▶️  Automation resumed!');
          break;
        }
      }
    }
  }

  // Setup keyboard controls
  async function setupControls() {
    await page.evaluate(({ current, target }) => {
      // Create status indicator
      const existing = document.getElementById('automation-status');
      if (existing) existing.remove();

      const statusBox = document.createElement('div');
      statusBox.id = 'automation-status';
      statusBox.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: #4CAF50; color: white;
        padding: 15px 20px; border-radius: 8px;
        font-family: monospace; font-size: 14px;
        font-weight: bold; z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      statusBox.innerHTML = `
        🤖 AUTOMATION RUNNING<br>
        <small>Applications: ${current}/${target}</small><br>
        <small>P=Pause | R=Resume | Q=Quit</small>
      `;
      document.body.appendChild(statusBox);

      // Update status function
      window.updateStatus = function(params) {
        const { status, current, target } = params;
        const box = document.getElementById('automation-status');
        if (!box) return;

        if (status === 'RUNNING') {
          box.style.background = '#4CAF50';
          box.innerHTML = `
            🤖 AUTOMATION RUNNING<br>
            <small>Applications: ${current}/${target}</small><br>
            <small>P=Pause | R=Resume | Q=Quit</small>
          `;
        } else if (status === 'PAUSED') {
          box.style.background = '#FF9800';
          box.innerHTML = `
            ⏸️ AUTOMATION PAUSED<br>
            <small>Applications: ${current}/${target}</small><br>
            <small>Press R to Resume | Q to Quit</small>
          `;
        } else if (status === 'COMPLETED') {
          box.style.background = '#2196F3';
          box.innerHTML = `
            ✅ TARGET REACHED!<br>
            <small>Completed: ${current}/${target}</small><br>
            <small>Click to close</small>
          `;
        }
      };

      // Setup keyboard listeners
      window.automationControl = { paused: false, quit: false };
      document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'p') {
          window.automationControl.paused = true;
          console.log('⏸️  AUTOMATION PAUSED by user');
        } else if (e.key.toLowerCase() === 'r') {
          window.automationControl.paused = false;
          console.log('▶️  AUTOMATION RESUMED by user');
        } else if (e.key.toLowerCase() === 'q') {
          window.automationControl.quit = true;
          console.log('🛑 AUTOMATION QUIT by user');
        }
      });
    }, { current: 0, target: targetApplications });
  }

  try {
    for (let pageNum = startPage; pageNum <= maxPages; pageNum++) {
      // Check if target reached
      if (results.successful >= targetApplications) {
        console.log(`\n🎯 Target reached! Applied to ${results.successful} jobs.`);
        break;
      }

      await checkUserControl();

      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║  PAGE ${pageNum}                               ║`);
      console.log(`╚════════════════════════════════════════╝\n`);

      const pageResults = { pageNumber: pageNum, successful: 0, failed: 0, skipped: 0 };

      // Navigate to page
      const pageUrl = `${BASE_URL}&page=${pageNum}`;
      await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Setup controls after navigation
      await setupControls();

      // Count jobs on page
      const jobCount = await page.evaluate(() => {
        return document.querySelectorAll('.apply-button__button').length;
      });

      if (jobCount === 0) {
        console.log('⚠️  No jobs found. Stopping.');
        break;
      }

      console.log(`Found ${jobCount} jobs\n`);

      // Process each job
      for (let jobIndex = 0; jobIndex < jobCount; jobIndex++) {
        if (results.successful >= targetApplications) {
          console.log(`\n🎯 Target reached!`);
          break;
        }

        await checkUserControl();

        console.log(`\n━━━━ Job ${jobIndex + 1}/${jobCount} ━━━━`);

        try {
          // Get job info
          const jobInfo = await page.evaluate((index) => {
            const containers = document.querySelectorAll('[class*="job-list-container"]');
            if (index >= containers.length) return null;

            const container = containers[index];
            const titleLink = container.querySelector('a[href*="/job/"]');
            const title = titleLink ? titleLink.textContent.trim() : 'Unknown';
            const companyEl = container.querySelector('[class*="company"]');
            const company = companyEl ? companyEl.textContent.trim() : 'Unknown';
            const alreadyApplied = container.textContent.includes('已應徵');

            return { title: title.substring(0, 60), company: company.substring(0, 40), alreadyApplied };
          }, jobIndex);

          if (!jobInfo) break;

          console.log(`📋 ${jobInfo.title}`);

          if (jobInfo.alreadyApplied) {
            console.log('⏭️  SKIPPED');
            pageResults.skipped++;
            await page.waitForTimeout(1000);
            continue;
          }

          // Click apply button
          await page.evaluate((index) => {
            document.querySelectorAll('.apply-button__button')[index].click();
          }, jobIndex);
          await page.waitForTimeout(1500);

          // Switch to new tab
          const pages = page.context().pages();
          const newTab = pages[pages.length - 1];
          await newTab.bringToFront();
          await newTab.waitForTimeout(1500);

          // Select cover letter dropdown
          await newTab.evaluate(() => {
            const span = Array.from(document.querySelectorAll('span'))
              .find(el => el.textContent === '系統預設' && el.tagName === 'SPAN');
            if (span?.parentElement) span.parentElement.click();
          });
          await newTab.waitForTimeout(500);

          // Select cover letter option
          await newTab.evaluate((letterName) => {
            const options = document.querySelectorAll('.multiselect__option');
            options.forEach(opt => {
              if (opt.textContent.trim() === letterName) opt.click();
            });
          }, coverLetter);
          await newTab.waitForTimeout(500);

          // Submit application
          await newTab.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
              if (btn.textContent.includes('確認送出')) btn.click();
            });
          });
          await newTab.waitForTimeout(2500);

          // Verify success
          const finalUrl = newTab.url();
          if (finalUrl.includes('/job/apply/done/')) {
            console.log('✅ SUCCESS');
            pageResults.successful++;
            results.successful++;

            // Update status indicator
            await page.evaluate(({ current, target }) => {
              window.updateStatus?.({ status: 'RUNNING', current, target });
            }, { current: results.successful, target: targetApplications });
          } else {
            console.log('❌ FAILED');
            pageResults.failed++;
            results.failed++;
          }

          // Cleanup
          await newTab.close();
          await page.bringToFront();
          await page.waitForTimeout(500);
          await setupControls(); // Re-setup controls

        } catch (error) {
          console.error(`❌ FAILED: ${error.message}`);
          pageResults.failed++;
          results.failed++;

          // Cleanup
          try {
            const pages = page.context().pages();
            if (pages.length > 1) await pages[pages.length - 1].close();
            await page.bringToFront();
            await setupControls();
          } catch (e) {}
        }

        // Random delay (human-like)
        const delay = 2000 + Math.random() * 2000;
        await page.waitForTimeout(delay);
      }

      // Page summary
      console.log(`\nPage ${pageNum}: ✅${pageResults.successful} ❌${pageResults.failed} ⏭️${pageResults.skipped}\n`);
      results.pages.push(pageResults);
      results.skipped += pageResults.skipped;

      if (results.successful >= targetApplications) break;

      await page.waitForTimeout(3000);
    }

    // Mark completed
    await page.evaluate(({ current, target }) => {
      window.updateStatus?.({ status: 'COMPLETED', current, target });
    }, { current: results.successful, target: targetApplications });

  } catch (error) {
    if (error.message === 'USER_QUIT') {
      console.log('\n🛑 Automation stopped by user');
    } else {
      throw error;
    }
  }

  // Final summary
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║     AUTOMATION COMPLETE                      ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`🎯 Target: ${targetApplications} applications`);
  console.log(`✅ Successful: ${results.successful}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`📄 Pages: ${results.pages.length}\n`);

  return results;
}

// Usage examples:
// Basic: Apply to 20 jobs starting from page 1
await autoApply104Jobs(page, { targetApplications: 20 });

// Advanced: Start from page 5, target 50 applications
await autoApply104Jobs(page, { startPage: 5, targetApplications: 50, maxPages: 30 });
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `startPage` | number | 1 | Starting page number for job search |
| `targetApplications` | number | 20 | Target number of successful applications (stops when reached) |
| `maxPages` | number | 20 | Maximum number of pages to search |
| `coverLetter` | string | '自訂推薦信1' | Cover letter name (must match exactly in your 104 account) |

## Key Features

### ✨ Target-Based Execution
- Stops automatically when target number of successful applications is reached
- Precise control - won't waste time processing unnecessary jobs
- Example: Target 20 applications = exactly 20 successful submissions

### ⌨️ Real-Time Keyboard Controls
- **P** = Pause automation (take a break, check results)
- **R** = Resume automation (continue from where you paused)
- **Q** = Quit automation (graceful exit with results summary)

### 📊 On-Page Status Indicator
- Always visible progress box on page
- Shows: Current progress (e.g., "Applications: 5/20")
- Color-coded: Green (running), Orange (paused), Blue (completed)

### 🎯 Proven Performance (Based on 2,495-Application Case Study)
- **92.5% success rate** over 2,495 applications
- **609 applications/hour** throughput
- **Automatic skip detection** for already-applied jobs
- **Human-like delays** to avoid detection
- **Robust error handling** - continues on failures

## Safety Features

- **Skip already applied jobs**: Detects '已應徵' text before clicking (saves time)
- **Human-like random delays**: 2-4 seconds between applications (avoids detection)
- **Graceful error handling**: One failure doesn't stop the entire process
- **Tab cleanup**: Always closes application tabs, even on errors
- **Target-based stopping**: Prevents runaway execution
- **Real-time monitoring**: Detailed console output and on-page status
- **Keyboard interrupt**: Press Q anytime to gracefully quit

## Technical Implementation Details

### Critical Selectors (Proven to Work)
```javascript
// Apply buttons on search results page
'.apply-button__button'  // ✅ CORRECT - These are DIV elements, not buttons

// Job containers
'[class*="job-list-container"]'  // Contains job info

// Cover letter dropdown
'span' with text '系統預設'  // Click parent element to open

// Cover letter options
'.multiselect__option'  // Options in dropdown

// Submit button
'button' with text '確認送出'  // Final submit
```

### Application Flow Pattern
1. **Stay on search results page** - No need to visit detail pages
2. **Check for already-applied** - Look for '已應徵' text (fast skip)
3. **Click apply button** - Opens NEW TAB (not modal)
4. **Switch to new tab** - Use `page.context().pages()`
5. **Two-step dropdown** - Click parent, wait 500ms, click option
6. **Submit and verify** - Check URL contains `/job/apply/done/`
7. **Always cleanup** - Close tab and return to search page

### Timing Strategy (Optimized)
```javascript
// After navigation
await page.waitForTimeout(2000);  // Let page load

// After clicking apply
await page.waitForTimeout(1500);  // Let tab open

// After opening dropdown
await page.waitForTimeout(500);   // Let dropdown render

// After submit
await page.waitForTimeout(2500);  // Let success page load

// Between jobs (human-like)
const delay = 2000 + Math.random() * 2000;  // 2-4 seconds random
```

### Success Verification
```javascript
// ✅ RELIABLE - URL pattern matching
const finalUrl = newTab.url();
if (finalUrl.includes('/job/apply/done/')) {
  // Confirmed success
}

// ❌ UNRELIABLE - Don't rely on page text
// Page text can be inconsistent or change
```

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

### Workflow 1: Quick Daily Job Hunt (Recommended)
Apply to 20 jobs starting from page 1, with keyboard controls available.
```javascript
// Most common use case - apply to 20 jobs
await autoApply104Jobs(page, {
  targetApplications: 20
});

// While running:
// - Press P to pause (take a break)
// - Press R to resume
// - Press Q to quit gracefully
```

### Workflow 2: Aggressive Job Search
Target more applications across more pages.
```javascript
// Apply to 50 jobs, search up to 30 pages
await autoApply104Jobs(page, {
  startPage: 1,
  targetApplications: 50,
  maxPages: 30
});
```

### Workflow 3: Resume from Specific Page
If you've already processed pages 1-5, start from page 6.
```javascript
// Continue from page 6
await autoApply104Jobs(page, {
  startPage: 6,
  targetApplications: 20,
  maxPages: 20
});
```

### Workflow 4: Custom Cover Letter
Use a different cover letter than the default.
```javascript
// Use custom cover letter (must match name in 104 account)
await autoApply104Jobs(page, {
  targetApplications: 20,
  coverLetter: '我的客製推薦信'  // Your cover letter name
});
```

### Workflow 5: Testing with Single Job
Test the automation with Mode 1 (single job) first before batch processing.
```javascript
// Navigate to search page
await page.goto('https://www.104.com.tw/jobs/search/?area=6001001000,6001002000&keyword=%20%20%20%20%E8%BB%9F%E9%AB%94%E5%B7%A5%E7%A8%8B%E5%B8%AB&order=15&remoteWork=1,2&page=1');
await page.waitForTimeout(2000);

// List available jobs
const jobCount = await page.evaluate(() => {
  return document.querySelectorAll('.apply-button__button').length;
});
console.log(`Found ${jobCount} jobs on this page`);

// Apply to first job (index 0) using Mode 1 code above
// ... then run batch automation if successful
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

## What Makes This Skill Different?

This skill is based on **real-world proven results**: 2,495 successful job applications with 92.5% success rate.

### Key Improvements Over Traditional Approaches

1. **Target-Based Execution** ⭐
   - Old: Process N pages regardless of results
   - New: Stop exactly when you reach your target applications
   - Result: No wasted time, precise control

2. **Keyboard Controls** ⭐
   - Old: No control once automation starts
   - New: Pause/Resume/Quit anytime with P/R/Q keys
   - Result: Full control, can interrupt safely

3. **Search Page Automation** ⭐
   - Old: Navigate to each job detail page (slow)
   - New: Apply directly from search results (fast)
   - Result: 3-4x faster throughput

4. **Proper Tab Management** ⭐
   - Old: Can leave tabs open on errors
   - New: Always closes tabs with cleanup in error handling
   - Result: No memory leaks, stable long runs

5. **On-Page Status Indicator** ⭐
   - Old: Only console logs
   - New: Visual progress box on page
   - Result: Easy monitoring, professional appearance

6. **URL-Based Success Verification** ⭐
   - Old: Check page text (unreliable)
   - New: Check for `/job/apply/done/` in URL
   - Result: 100% reliable success detection

## Performance Benchmarks

Based on actual 2,495-application case study:
- **Success Rate**: 92.5% average, 96.2% best run
- **Throughput**: ~609 applications/hour
- **Speed**: ~6 seconds per application
- **Efficiency**: 16-18 jobs found per page
- **Reliability**: Ran 5 consecutive sessions without manual intervention

## Reference Files & Case Study

For implementation details and learnings:
- **Case Study**: https://github.com/yennanliu/104Skill/issues/1 (Complete running log)
- **Working Code**: `../ai_experiment/104/104_auto_apply_target.js` - Target-based implementation
- **Key Learnings**: `../ai_experiment/104/LEARNINGS.md` - 467 lines of insights
- **Documentation**: `../ai_experiment/104/DOCUMENTATION_INDEX.md` - Full docs
- **Results**: 5 successful runs, 2,495 total applications

### What the Case Study Proves
- ✅ Automation works reliably at scale (2,495 applications)
- ✅ High success rate achievable (92.5%)
- ✅ Efficient throughput (609 apps/hour)
- ✅ Proper selectors (`.apply-button__button` is correct)
- ✅ Tab management works (proper cleanup on errors)
- ✅ Already-applied detection saves time (1,538 jobs skipped)
- ✅ Target-based stopping is precise (exact counts achieved)
- ✅ No rate limiting detected (900 apps in single run worked)

---

**Remember**: This skill is proven to work. Use it responsibly for genuine job applications to suitable positions. Quality matters more than quantity.

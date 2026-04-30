/**
 * 104.com.tw Job Application Automation - Target-Based with Keyboard Controls
 *
 * Features:
 * - Target-based stopping (stops when N applications reached)
 * - Keyboard controls: P=Pause, R=Resume, Q=Quit
 * - On-page status indicator
 * - Confirmed working selectors and timing from ai_experiment/104/claude/104_auto_apply_with_controls.js
 *
 * @param {Page} page - Playwright page object
 * @param {Object} options - Configuration options
 * @param {number} options.startPage - Starting page number (default: 2)
 * @param {number} options.targetApplications - Target number of applications (default: 20)
 * @param {number} options.maxPages - Maximum pages to search (default: 20)
 * @param {string} options.coverLetter - Cover letter name (default: '自訂推薦信1')
 * @returns {Object} Results summary
 */
async function autoApply104Jobs(page, options = {}) {
  const {
    startPage = 2,
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

  // Create on-page status indicator (called once at start)
  async function createStatusIndicator() {
    await page.evaluate(() => {
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
        cursor: pointer; user-select: none;
      `;
      statusBox.innerHTML = `
        🤖 AUTOMATION RUNNING<br>
        <small style="font-size: 11px;">Press P=Pause | R=Resume | Q=Quit</small>
      `;
      document.body.appendChild(statusBox);
    });
  }

  // Update the status indicator
  async function updateStatus(status, current, target) {
    await page.evaluate(({ status, current, target }) => {
      const box = document.getElementById('automation-status');
      if (!box) return;

      if (status === 'RUNNING') {
        box.style.background = '#4CAF50';
        box.innerHTML = `
          🤖 AUTOMATION RUNNING<br>
          <small style="font-size: 11px;">Applications: ${current}/${target} | P=Pause | R=Resume | Q=Quit</small>
        `;
      } else if (status === 'PAUSED') {
        box.style.background = '#FF9800';
        box.innerHTML = `
          ⏸️ AUTOMATION PAUSED<br>
          <small style="font-size: 11px;">Applications: ${current}/${target} | Press R to Resume | Q to Quit</small>
        `;
      } else if (status === 'COMPLETED') {
        box.style.background = '#2196F3';
        box.innerHTML = `
          ✅ TARGET REACHED!<br>
          <small style="font-size: 11px;">Completed: ${current}/${target} | Click to close</small>
        `;
      }
    }, { status, current, target });
  }

  // Setup keyboard controls (re-called after each navigation to re-register listeners)
  async function setupKeyboardControls() {
    await page.evaluate(() => {
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
    });
  }

  // Check user pause/quit state
  async function checkUserControl() {
    const control = await page.evaluate(() => ({
      paused: window.automationControl?.paused || false,
      quit: window.automationControl?.quit || false
    }));

    if (control.quit) throw new Error('USER_QUIT');

    if (control.paused) {
      await updateStatus('PAUSED', results.successful, targetApplications);
      console.log('⏸️  Automation paused. Press R to resume...');

      while (true) {
        await page.waitForTimeout(1000);
        const newControl = await page.evaluate(() => ({
          paused: window.automationControl?.paused || false,
          quit: window.automationControl?.quit || false
        }));

        if (newControl.quit) throw new Error('USER_QUIT');
        if (!newControl.paused) {
          await updateStatus('RUNNING', results.successful, targetApplications);
          console.log('▶️  Automation resumed!');
          break;
        }
      }
    }
  }

  try {
    // Initialize status indicator and keyboard controls
    await createStatusIndicator();
    await setupKeyboardControls();
    await updateStatus('RUNNING', 0, targetApplications);

    for (let pageNum = startPage; pageNum <= maxPages; pageNum++) {
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

      // Re-setup controls after navigation (re-registers keyboard listener)
      await setupKeyboardControls();

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

          // Click apply button → opens new tab
          await page.evaluate((index) => {
            document.querySelectorAll('.apply-button__button')[index].click();
          }, jobIndex);
          await page.waitForTimeout(1000);

          // Switch to new tab
          const pages = page.context().pages();
          const newTab = pages[pages.length - 1];
          await newTab.bringToFront();
          await newTab.waitForTimeout(1000);

          // Select cover letter - click parent of '系統預設' span to open dropdown
          await newTab.evaluate(() => {
            const span = Array.from(document.querySelectorAll('span'))
              .find(el => el.textContent === '系統預設' && el.tagName === 'SPAN');
            if (span?.parentElement) span.parentElement.click();
          });
          await newTab.waitForTimeout(500);

          // Select cover letter option from dropdown
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
          await newTab.waitForTimeout(2000);

          // Verify success via URL pattern
          const finalUrl = newTab.url();
          if (finalUrl.includes('/job/apply/done/')) {
            console.log('✅ SUCCESS');
            pageResults.successful++;
            results.successful++;
            await updateStatus('RUNNING', results.successful, targetApplications);
          } else {
            throw new Error('Not successful - URL: ' + finalUrl);
          }

          // Cleanup: close tab, return to search page
          await newTab.close();
          await page.bringToFront();
          await page.waitForTimeout(500);
          await setupKeyboardControls();

        } catch (error) {
          console.error(`❌ FAILED: ${error.message}`);
          pageResults.failed++;
          results.failed++;

          try {
            const pages = page.context().pages();
            if (pages.length > 1) await pages[pages.length - 1].close();
            await page.bringToFront();
            await setupKeyboardControls();
          } catch (e) {}
        }

        // Random delay (human-like: 2-4 seconds)
        const delay = 2000 + Math.random() * 2000;
        await page.waitForTimeout(delay);
      }

      // Page summary
      console.log(`\nPage ${pageNum}: ✅${pageResults.successful} ❌${pageResults.failed} ⏭️${pageResults.skipped}\n`);
      results.pages.push(pageResults);
      results.skipped += pageResults.skipped;

      if (results.successful >= targetApplications) break;

      await page.waitForTimeout(5000);
    }

    await updateStatus('COMPLETED', results.successful, targetApplications);

  } catch (error) {
    if (error.message === 'USER_QUIT') {
      console.log('\n🛑 Automation stopped by user');
      await updateStatus('COMPLETED', results.successful, targetApplications);
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

// Export for use with Playwright MCP
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { autoApply104Jobs };
}

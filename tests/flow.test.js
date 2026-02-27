/**
 * Application Flow Tests
 *
 * Tests the complete application flow without actually submitting.
 * Validates that all steps can be executed correctly.
 *
 * Usage:
 * const { testApplicationFlow } = require('./flow.test.js');
 * await testApplicationFlow(page);
 */

/**
 * Test complete application flow (dry-run style)
 *
 * @param {Page} page - Playwright page object (must be on search results page)
 * @param {string} coverLetter - Cover letter name to test
 * @returns {Object} Test results
 */
async function testApplicationFlow(page, coverLetter = '自訂推薦信1') {
  console.log('\n🧪 TESTING APPLICATION FLOW\n');
  console.log('═'.repeat(70));
  console.log('This test will open an application form but NOT submit it.\n');

  const results = {
    steps: [],
    passed: true,
    error: null
  };

  const step = (name, success, details = '') => {
    const status = success ? '✅' : '❌';
    console.log(`${status} ${name}`);
    if (details) console.log(`   ${details}`);
    results.steps.push({ name, success, details });
    if (!success) results.passed = false;
  };

  try {
    // Step 1: Find first non-applied job
    step('Step 1', true, 'Finding first available job...');

    const jobIndex = await page.evaluate(() => {
      const containers = document.querySelectorAll('[class*="job-list-container"]');
      for (let i = 0; i < containers.length; i++) {
        if (!containers[i].textContent.includes('已應徵')) {
          return i;
        }
      }
      return -1;
    });

    if (jobIndex === -1) {
      step('Find available job', false, 'No unapplied jobs found');
      return results;
    }
    step('Find available job', true, `Found job at index ${jobIndex}`);

    // Step 2: Get job info
    step('Step 2', true, 'Reading job information...');

    const jobInfo = await page.evaluate((index) => {
      const containers = document.querySelectorAll('[class*="job-list-container"]');
      const container = containers[index];
      const titleLink = container.querySelector('a[href*="/job/"]');
      const title = titleLink ? titleLink.textContent.trim() : 'Unknown';
      return { title: title.substring(0, 60) };
    }, jobIndex);

    step('Read job info', true, `Job: ${jobInfo.title}`);

    // Step 3: Click apply button
    step('Step 3', true, 'Clicking apply button...');

    const initialTabCount = page.context().pages().length;

    await page.evaluate((index) => {
      const buttons = document.querySelectorAll('.apply-button__button');
      if (buttons[index]) buttons[index].click();
    }, jobIndex);
    await page.waitForTimeout(2000);

    const newTabCount = page.context().pages().length;
    const tabOpened = newTabCount > initialTabCount;

    step('Apply button click', tabOpened, tabOpened ? 'New tab opened' : 'No new tab opened');

    if (!tabOpened) {
      results.error = 'New tab did not open';
      return results;
    }

    // Step 4: Switch to new tab
    step('Step 4', true, 'Switching to application form tab...');

    const pages = page.context().pages();
    const newTab = pages[pages.length - 1];
    await newTab.bringToFront();
    await newTab.waitForTimeout(1500);

    const formUrl = newTab.url();
    step('Switch to new tab', true, `URL: ${formUrl}`);

    // Step 5: Find cover letter dropdown
    step('Step 5', true, 'Finding cover letter dropdown...');

    const dropdownFound = await newTab.evaluate(() => {
      const span = Array.from(document.querySelectorAll('span'))
        .find(el => el.textContent === '系統預設' && el.tagName === 'SPAN');
      return !!span;
    });

    step('Find dropdown', dropdownFound, dropdownFound ? 'Dropdown found' : 'Dropdown not found');

    if (!dropdownFound) {
      await newTab.close();
      await page.bringToFront();
      results.error = 'Cover letter dropdown not found';
      return results;
    }

    // Step 6: Open dropdown (but don't select)
    step('Step 6', true, 'Opening cover letter dropdown...');

    await newTab.evaluate(() => {
      const span = Array.from(document.querySelectorAll('span'))
        .find(el => el.textContent === '系統預設' && el.tagName === 'SPAN');
      if (span?.parentElement) span.parentElement.click();
    });
    await newTab.waitForTimeout(500);

    const optionsVisible = await newTab.evaluate(() => {
      const options = document.querySelectorAll('.multiselect__option');
      return options.length > 0;
    });

    step('Open dropdown', optionsVisible, optionsVisible ? 'Options visible' : 'Options not visible');

    // Step 7: Check if cover letter exists
    step('Step 7', true, `Checking for cover letter "${coverLetter}"...`);

    const coverLetterExists = await newTab.evaluate((letterName) => {
      const options = document.querySelectorAll('.multiselect__option');
      return Array.from(options).some(opt => opt.textContent.trim() === letterName);
    }, coverLetter);

    step('Cover letter exists', coverLetterExists,
      coverLetterExists ? `"${coverLetter}" found` : `"${coverLetter}" NOT found`);

    if (!coverLetterExists) {
      const availableLetters = await newTab.evaluate(() => {
        const options = document.querySelectorAll('.multiselect__option');
        return Array.from(options).map(opt => opt.textContent.trim());
      });
      console.log(`   Available cover letters: ${availableLetters.join(', ')}`);
    }

    // Step 8: Check submit button (don't click)
    step('Step 8', true, 'Checking for submit button...');

    const submitButtonExists = await newTab.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      return Array.from(buttons).some(btn => btn.textContent.includes('確認送出'));
    });

    step('Submit button exists', submitButtonExists,
      submitButtonExists ? 'Submit button found' : 'Submit button NOT found');

    // Cleanup: Close the application tab
    step('Cleanup', true, 'Closing application form...');
    await newTab.close();
    await page.bringToFront();
    step('Close tab', true, 'Returned to search page');

  } catch (error) {
    step('Error', false, error.message);
    results.error = error.message;
    results.passed = false;

    // Emergency cleanup
    try {
      const pages = page.context().pages();
      if (pages.length > 1) await pages[pages.length - 1].close();
      await page.bringToFront();
    } catch (e) {}
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('FLOW TEST SUMMARY');
  console.log('═'.repeat(70));

  const passedSteps = results.steps.filter(s => s.success).length;
  const totalSteps = results.steps.length;

  console.log(`Steps completed: ${passedSteps}/${totalSteps}`);

  if (results.passed) {
    console.log('\n✅ APPLICATION FLOW TEST PASSED\n');
    console.log('All steps completed successfully. Ready to run automation!\n');
  } else {
    console.log('\n❌ APPLICATION FLOW TEST FAILED\n');
    if (results.error) {
      console.log(`Error: ${results.error}\n`);
    }
  }

  return results;
}

/**
 * Quick smoke test
 *
 * @param {Page} page - Playwright page object
 * @returns {boolean} True if basic functionality works
 */
async function smokeTest(page) {
  console.log('\n🔥 SMOKE TEST\n');

  try {
    const checks = await page.evaluate(() => {
      return {
        hasJobs: document.querySelectorAll('[class*="job-list-container"]').length > 0,
        hasApplyButtons: document.querySelectorAll('.apply-button__button').length > 0,
        isLoggedIn: !document.querySelector('a[href*="login"]')
      };
    });

    console.log(checks.isLoggedIn ? '✅ Logged in' : '❌ Not logged in');
    console.log(checks.hasJobs ? '✅ Jobs found' : '❌ No jobs');
    console.log(checks.hasApplyButtons ? '✅ Apply buttons found' : '❌ No apply buttons');

    const passed = checks.isLoggedIn && checks.hasJobs && checks.hasApplyButtons;
    console.log(passed ? '\n✅ Smoke test PASSED\n' : '\n❌ Smoke test FAILED\n');

    return passed;

  } catch (error) {
    console.log(`❌ Smoke test FAILED: ${error.message}\n`);
    return false;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testApplicationFlow, smokeTest };
}

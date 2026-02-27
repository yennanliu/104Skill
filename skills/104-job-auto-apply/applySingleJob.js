/**
 * Apply to a Single Job on 104.com.tw
 *
 * Use this for testing or applying to one job at a time from search results page.
 *
 * @param {Page} page - Playwright page object (should be on search results page)
 * @param {number} jobIndex - Index of job to apply to (0-based)
 * @param {string} coverLetter - Cover letter name (default: '自訂推薦信1')
 * @returns {Object} Result object with status and details
 */
async function applySingleJob(page, jobIndex = 0, coverLetter = '自訂推薦信1') {
  console.log(`\n🎯 Applying to job at index ${jobIndex}...`);

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

      return {
        title: title.substring(0, 60),
        company: company.substring(0, 40),
        alreadyApplied
      };
    }, jobIndex);

    if (!jobInfo) {
      return { status: 'error', message: 'Job not found at index ' + jobIndex };
    }

    console.log(`📋 ${jobInfo.title}`);
    console.log(`🏢 ${jobInfo.company}`);

    if (jobInfo.alreadyApplied) {
      console.log('⚠️  Already applied to this job');
      return { status: 'skipped', reason: 'Already applied', job: jobInfo };
    }

    // Click apply button
    await page.evaluate((index) => {
      const buttons = document.querySelectorAll('.apply-button__button');
      if (buttons[index]) buttons[index].click();
    }, jobIndex);
    await page.waitForTimeout(2000);

    // Get the new tab that opened
    const pages = page.context().pages();
    const newTab = pages[pages.length - 1];
    await newTab.bringToFront();
    await newTab.waitForTimeout(1000);

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
    await newTab.waitForTimeout(2000);

    // Verify success
    const finalUrl = newTab.url();
    const success = finalUrl.includes('/job/apply/done/');

    if (success) {
      console.log('✅ Application submitted successfully!');
    } else {
      console.log('❌ Application may have failed');
      console.log(`   Final URL: ${finalUrl}`);
    }

    // Close tab and return to main page
    await newTab.close();
    await page.bringToFront();

    return {
      status: success ? 'success' : 'failed',
      job: jobInfo,
      finalUrl: finalUrl
    };

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);

    // Cleanup - try to close any open tabs
    try {
      const pages = page.context().pages();
      if (pages.length > 1) await pages[pages.length - 1].close();
      await page.bringToFront();
    } catch (e) {}

    return {
      status: 'error',
      message: error.message
    };
  }
}

/**
 * List all jobs on current search results page
 *
 * @param {Page} page - Playwright page object (should be on search results page)
 * @returns {Array} Array of job objects
 */
async function listJobs(page) {
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

  return jobs;
}

// Export for use with Playwright MCP
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { applySingleJob, listJobs };
}

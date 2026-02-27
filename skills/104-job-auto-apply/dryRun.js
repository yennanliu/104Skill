/**
 * Dry-Run Mode - Simulate automation without actually applying
 *
 * Use this to:
 * - Test search criteria without applying
 * - Preview which jobs would be applied to
 * - Count available jobs and estimate time
 * - Verify selectors still work after 104.com.tw updates
 *
 * @param {Page} page - Playwright page object
 * @param {Object} options - Configuration options
 * @param {number} options.startPage - Starting page number (default: 1)
 * @param {number} options.targetApplications - Target number of applications (default: 20)
 * @param {number} options.maxPages - Maximum pages to search (default: 20)
 * @param {boolean} options.verbose - Show detailed job info (default: true)
 * @returns {Object} Dry-run results
 */
async function dryRun(page, options = {}) {
  const {
    startPage = 1,
    targetApplications = 20,
    maxPages = 20,
    verbose = true
  } = options;

  console.log('\n🧪 DRY-RUN MODE - No applications will be submitted\n');
  console.log('═'.repeat(70));
  console.log(`Target: ${targetApplications} applications`);
  console.log(`Search: Pages ${startPage} to ${maxPages}`);
  console.log('═'.repeat(70) + '\n');

  const results = {
    wouldApply: [],
    wouldSkip: [],
    totalFound: 0,
    estimatedTime: 0,
    pageStats: []
  };

  const BASE_URL = 'https://www.104.com.tw/jobs/search/?area=6001001000,6001002000&jobsource=joblist_search&keyword=%20%20%20%20%E8%BB%9F%E9%AB%94%E5%B7%A5%E7%A8%8B%E5%B8%AB&order=15&remoteWork=1,2';

  let applicationsCount = 0;

  for (let pageNum = startPage; pageNum <= maxPages; pageNum++) {
    // Check if target would be reached
    if (applicationsCount >= targetApplications) {
      console.log(`\n🎯 Target would be reached! Stopping at ${applicationsCount} applications.`);
      break;
    }

    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  PAGE ${pageNum} (DRY-RUN)                     ║`);
    console.log(`╚════════════════════════════════════════╝\n`);

    const pageStats = {
      pageNumber: pageNum,
      wouldApply: 0,
      wouldSkip: 0,
      errors: []
    };

    try {
      // Navigate to page
      const pageUrl = `${BASE_URL}&page=${pageNum}`;
      await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Count jobs on page
      const jobsData = await page.evaluate(() => {
        const jobs = [];
        const containers = document.querySelectorAll('[class*="job-list-container"]');

        containers.forEach((container, index) => {
          const titleLink = container.querySelector('a[href*="/job/"]');
          const title = titleLink ? titleLink.textContent.trim() : 'Unknown';

          const companyEl = container.querySelector('[class*="company"]');
          const company = companyEl ? companyEl.textContent.trim() : 'Unknown';

          const salaryEl = container.querySelector('[class*="salary"]');
          const salary = salaryEl ? salaryEl.textContent.trim() : 'Not listed';

          const locationEl = container.querySelector('[class*="location"]');
          const location = locationEl ? locationEl.textContent.trim() : 'Not listed';

          const alreadyApplied = container.textContent.includes('已應徵');
          const hasApplyButton = document.querySelectorAll('.apply-button__button').length > index;

          jobs.push({
            index,
            title: title.substring(0, 80),
            company: company.substring(0, 50),
            salary: salary.substring(0, 50),
            location: location.substring(0, 50),
            alreadyApplied,
            hasApplyButton
          });
        });

        return jobs;
      });

      if (jobsData.length === 0) {
        console.log('⚠️  No jobs found. Would stop here.\n');
        break;
      }

      console.log(`Found ${jobsData.length} jobs\n`);
      results.totalFound += jobsData.length;

      // Analyze each job
      for (const job of jobsData) {
        if (applicationsCount >= targetApplications) {
          break;
        }

        const status = job.alreadyApplied ? 'SKIP' : job.hasApplyButton ? 'APPLY' : 'SKIP (No button)';
        const symbol = job.alreadyApplied ? '⏭️' : job.hasApplyButton ? '✅' : '⚠️';

        if (verbose) {
          console.log(`${symbol} [${status}] ${job.title}`);
          if (verbose && status === 'APPLY') {
            console.log(`   🏢 ${job.company}`);
            console.log(`   💰 ${job.salary}`);
            console.log(`   📍 ${job.location}`);
          }
        }

        if (!job.alreadyApplied && job.hasApplyButton) {
          results.wouldApply.push(job);
          pageStats.wouldApply++;
          applicationsCount++;
        } else {
          const reason = job.alreadyApplied ? 'Already applied' : 'No apply button';
          results.wouldSkip.push({ ...job, reason });
          pageStats.wouldSkip++;
        }

        if (!verbose && status === 'APPLY') {
          console.log(`✅ Would apply to: ${job.title} @ ${job.company}`);
        }
      }

      // Page summary
      console.log(`\nPage ${pageNum}: ✅ ${pageStats.wouldApply} would apply | ⏭️ ${pageStats.wouldSkip} would skip\n`);
      results.pageStats.push(pageStats);

      // Delay between pages
      await page.waitForTimeout(1000);

    } catch (error) {
      console.error(`❌ Error on page ${pageNum}: ${error.message}`);
      pageStats.errors.push(error.message);
      results.pageStats.push(pageStats);
    }
  }

  // Calculate time estimate
  const avgTimePerJob = 6; // seconds (from case study)
  results.estimatedTime = results.wouldApply.length * avgTimePerJob;
  const estimatedMinutes = Math.ceil(results.estimatedTime / 60);

  // Final summary
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║     DRY-RUN COMPLETE                         ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`\n📊 Summary:`);
  console.log(`   Total jobs found: ${results.totalFound}`);
  console.log(`   ✅ Would apply to: ${results.wouldApply.length} jobs`);
  console.log(`   ⏭️  Would skip: ${results.wouldSkip.length} jobs`);
  console.log(`   📄 Pages scanned: ${results.pageStats.length}`);
  console.log(`   ⏱️  Estimated time: ~${estimatedMinutes} minutes (${results.estimatedTime}s)`);

  if (results.wouldApply.length < targetApplications) {
    const shortage = targetApplications - results.wouldApply.length;
    console.log(`\n⚠️  Warning: Only ${results.wouldApply.length} jobs available (target: ${targetApplications})`);
    console.log(`   Short by ${shortage} jobs. Consider:`);
    console.log(`   - Expanding search criteria`);
    console.log(`   - Increasing maxPages`);
    console.log(`   - Trying different keywords`);
  }

  console.log(`\n💡 Tip: If this looks good, run with dryRun: false to actually apply!\n`);

  return results;
}

/**
 * Quick validation check before running automation
 *
 * @param {Page} page - Playwright page object
 * @returns {Object} Validation results
 */
async function quickValidation(page) {
  console.log('\n🔍 Quick Validation Check...\n');

  const checks = {
    isLoggedIn: false,
    hasApplyButtons: false,
    hasJobs: false,
    applyButtonCount: 0,
    jobCount: 0
  };

  try {
    // Check if on 104.com.tw
    const currentUrl = page.url();
    if (!currentUrl.includes('104.com.tw')) {
      console.log('❌ Not on 104.com.tw');
      return { ...checks, error: 'Not on 104.com.tw' };
    }

    // Check login status
    const loginCheck = await page.evaluate(() => {
      const userInfo = document.querySelector('[class*="user"]');
      const loginButton = document.querySelector('a[href*="login"]');
      return {
        hasUserInfo: !!userInfo,
        hasLoginButton: !!loginButton
      };
    });

    checks.isLoggedIn = loginCheck.hasUserInfo && !loginCheck.hasLoginButton;
    console.log(checks.isLoggedIn ? '✅ Logged in' : '❌ Not logged in');

    // Check for jobs and apply buttons
    const jobsCheck = await page.evaluate(() => {
      const applyButtons = document.querySelectorAll('.apply-button__button');
      const jobContainers = document.querySelectorAll('[class*="job-list-container"]');

      return {
        applyButtonCount: applyButtons.length,
        jobCount: jobContainers.length
      };
    });

    checks.applyButtonCount = jobsCheck.applyButtonCount;
    checks.jobCount = jobsCheck.jobCount;
    checks.hasApplyButtons = jobsCheck.applyButtonCount > 0;
    checks.hasJobs = jobsCheck.jobCount > 0;

    console.log(checks.hasJobs ? `✅ Found ${checks.jobCount} jobs` : '❌ No jobs found');
    console.log(checks.hasApplyButtons ? `✅ Found ${checks.applyButtonCount} apply buttons` : '❌ No apply buttons found');

    const allGood = checks.isLoggedIn && checks.hasApplyButtons && checks.hasJobs;
    console.log(allGood ? '\n✅ All checks passed! Ready to run.\n' : '\n⚠️  Some checks failed. Please review.\n');

    return checks;

  } catch (error) {
    console.error(`❌ Validation error: ${error.message}`);
    return { ...checks, error: error.message };
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { dryRun, quickValidation };
}

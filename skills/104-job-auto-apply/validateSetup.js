/**
 * Pre-flight Setup Validation
 *
 * Run this before automation to ensure everything is configured correctly.
 * Prevents common errors and saves time.
 *
 * @param {Page} page - Playwright page object
 * @param {Object} config - Configuration to validate
 * @param {string} config.coverLetter - Cover letter name to verify
 * @returns {Object} Validation results with recommendations
 */
async function validateSetup(page, config = {}) {
  const { coverLetter = '自訂推薦信1' } = config;

  console.log('\n🔧 PRE-FLIGHT SETUP VALIDATION\n');
  console.log('═'.repeat(70));

  const results = {
    passed: [],
    warnings: [],
    errors: [],
    recommendations: [],
    overallStatus: 'unknown'
  };

  // ─── Check 1: Login Status ─────────────────────────────────────────────
  console.log('\n1️⃣  Checking login status...');
  try {
    const loginStatus = await page.evaluate(() => {
      // Look for user profile indicators
      const userMenu = document.querySelector('[class*="user-menu"]');
      const userName = document.querySelector('[class*="user-name"]');
      const loginLink = document.querySelector('a[href*="login"]');

      return {
        hasUserMenu: !!userMenu,
        hasUserName: !!userName,
        hasLoginLink: !!loginLink,
        userName: userName ? userName.textContent.trim() : null
      };
    });

    if (loginStatus.hasUserMenu || loginStatus.hasUserName) {
      const name = loginStatus.userName ? ` (${loginStatus.userName})` : '';
      results.passed.push(`✅ Logged in to 104.com.tw${name}`);
      console.log(`   ✅ Logged in${name}`);
    } else {
      results.errors.push('❌ Not logged in to 104.com.tw');
      console.log('   ❌ Not logged in - Please log in first');
      results.recommendations.push('→ Open 104.com.tw and log in before running automation');
    }
  } catch (error) {
    results.warnings.push(`⚠️  Could not verify login: ${error.message}`);
    console.log(`   ⚠️  Could not verify: ${error.message}`);
  }

  // ─── Check 2: Page Content ─────────────────────────────────────────────
  console.log('\n2️⃣  Checking page content...');
  try {
    const currentUrl = page.url();
    const isSearchPage = currentUrl.includes('/jobs/search/');
    const isJobListPage = currentUrl.includes('104.com.tw/jobs');

    if (isSearchPage) {
      results.passed.push('✅ On job search page');
      console.log('   ✅ On job search page');
    } else if (isJobListPage) {
      results.warnings.push('⚠️  On jobs page but not search results');
      console.log('   ⚠️  On jobs page but might not be search results');
      results.recommendations.push('→ Navigate to search page with your criteria first');
    } else {
      results.errors.push('❌ Not on 104.com.tw job search page');
      console.log('   ❌ Not on job search page');
      results.recommendations.push('→ Navigate to: https://www.104.com.tw/jobs/search/');
    }
  } catch (error) {
    results.warnings.push(`⚠️  Could not verify page: ${error.message}`);
    console.log(`   ⚠️  Error: ${error.message}`);
  }

  // ─── Check 3: Jobs Available ────────────────────────────────────────────
  console.log('\n3️⃣  Checking for jobs...');
  try {
    const jobsData = await page.evaluate(() => {
      const containers = document.querySelectorAll('[class*="job-list-container"]');
      const applyButtons = document.querySelectorAll('.apply-button__button');

      return {
        jobCount: containers.length,
        applyButtonCount: applyButtons.length
      };
    });

    if (jobsData.jobCount > 0) {
      results.passed.push(`✅ Found ${jobsData.jobCount} jobs on current page`);
      console.log(`   ✅ Found ${jobsData.jobCount} jobs`);
    } else {
      results.errors.push('❌ No jobs found on current page');
      console.log('   ❌ No jobs found');
      results.recommendations.push('→ Check search criteria - no results returned');
    }

    if (jobsData.applyButtonCount > 0) {
      results.passed.push(`✅ Found ${jobsData.applyButtonCount} apply buttons`);
      console.log(`   ✅ Found ${jobsData.applyButtonCount} apply buttons`);
    } else {
      results.warnings.push('⚠️  No apply buttons found (all jobs may be already applied)');
      console.log('   ⚠️  No apply buttons found');
      results.recommendations.push('→ You may have already applied to all jobs on this page');
    }
  } catch (error) {
    results.errors.push(`❌ Could not check jobs: ${error.message}`);
    console.log(`   ❌ Error: ${error.message}`);
  }

  // ─── Check 4: DOM Selectors ─────────────────────────────────────────────
  console.log('\n4️⃣  Verifying critical selectors...');
  try {
    const selectorCheck = await page.evaluate(() => {
      const checks = {
        applyButton: !!document.querySelector('.apply-button__button'),
        jobContainer: !!document.querySelector('[class*="job-list-container"]'),
        jobTitle: !!document.querySelector('a[href*="/job/"]')
      };

      return checks;
    });

    if (selectorCheck.applyButton) {
      results.passed.push('✅ Apply button selector works');
      console.log('   ✅ .apply-button__button selector works');
    } else {
      results.warnings.push('⚠️  Apply button selector may have changed');
      console.log('   ⚠️  .apply-button__button not found');
    }

    if (selectorCheck.jobContainer && selectorCheck.jobTitle) {
      results.passed.push('✅ Job container selectors work');
      console.log('   ✅ Job container selectors work');
    } else {
      results.errors.push('❌ Job container selectors may have changed');
      console.log('   ❌ Job container selectors not working');
      results.recommendations.push('→ 104.com.tw may have updated their UI - selectors need updating');
    }
  } catch (error) {
    results.warnings.push(`⚠️  Selector check failed: ${error.message}`);
    console.log(`   ⚠️  Error: ${error.message}`);
  }

  // ─── Check 5: Cover Letter (requires test application) ─────────────────
  console.log('\n5️⃣  Cover letter verification (optional test)...');
  console.log(`   ℹ️  Configured cover letter: "${coverLetter}"`);
  results.warnings.push(`⚠️  Cover letter "${coverLetter}" not verified (requires test application)`);
  results.recommendations.push(`→ Run a single test application to verify cover letter "${coverLetter}" exists`);

  // ─── Check 6: Browser & Network ────────────────────────────────────────
  console.log('\n6️⃣  Checking browser & network...');
  try {
    const networkCheck = await page.evaluate(() => {
      return {
        online: navigator.onLine,
        userAgent: navigator.userAgent,
        language: navigator.language
      };
    });

    if (networkCheck.online) {
      results.passed.push('✅ Network connection active');
      console.log('   ✅ Network online');
    } else {
      results.errors.push('❌ No network connection');
      console.log('   ❌ Offline');
    }

    console.log(`   ℹ️  Browser: ${networkCheck.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}`);
    console.log(`   ℹ️  Language: ${networkCheck.language}`);
  } catch (error) {
    results.warnings.push(`⚠️  Browser check failed: ${error.message}`);
    console.log(`   ⚠️  Error: ${error.message}`);
  }

  // ─── Check 7: Tab Management ────────────────────────────────────────────
  console.log('\n7️⃣  Checking tab/context...');
  try {
    const pages = page.context().pages();
    if (pages.length === 1) {
      results.passed.push('✅ Clean browser context (1 tab)');
      console.log('   ✅ Single tab open (clean start)');
    } else {
      results.warnings.push(`⚠️  ${pages.length} tabs open`);
      console.log(`   ⚠️  ${pages.length} tabs open - consider closing extras`);
      results.recommendations.push('→ Close extra tabs for cleaner automation');
    }
  } catch (error) {
    results.warnings.push(`⚠️  Tab check failed: ${error.message}`);
    console.log(`   ⚠️  Error: ${error.message}`);
  }

  // ─── Final Assessment ───────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(70));
  console.log('VALIDATION SUMMARY');
  console.log('═'.repeat(70));

  if (results.errors.length === 0 && results.warnings.length <= 2) {
    results.overallStatus = 'ready';
    console.log('\n✅ READY TO RUN - All critical checks passed!');
  } else if (results.errors.length === 0) {
    results.overallStatus = 'ready-with-warnings';
    console.log('\n⚠️  READY WITH WARNINGS - Can proceed but review warnings');
  } else {
    results.overallStatus = 'not-ready';
    console.log('\n❌ NOT READY - Please fix errors before running');
  }

  console.log(`\n✅ Passed: ${results.passed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);

  if (results.recommendations.length > 0) {
    console.log('\n📋 RECOMMENDATIONS:');
    results.recommendations.forEach(rec => console.log(`   ${rec}`));
  }

  console.log('\n' + '═'.repeat(70) + '\n');

  return results;
}

/**
 * Estimate automation metrics
 *
 * @param {Page} page - Playwright page object
 * @param {number} targetApplications - Target number of applications
 * @returns {Object} Estimates
 */
async function estimateMetrics(page, targetApplications = 20) {
  console.log('\n📊 ESTIMATING AUTOMATION METRICS\n');

  const estimates = {
    targetApplications,
    estimatedTime: 0,
    estimatedPages: 0,
    avgJobsPerPage: 18, // From case study
    avgTimePerJob: 6 // seconds, from case study
  };

  try {
    // Check current page for actual jobs/page
    const currentPageData = await page.evaluate(() => {
      return {
        jobCount: document.querySelectorAll('[class*="job-list-container"]').length,
        applyButtonCount: document.querySelectorAll('.apply-button__button').length
      };
    });

    if (currentPageData.jobCount > 0) {
      estimates.avgJobsPerPage = currentPageData.jobCount;
    }

    // Calculate estimates
    estimates.estimatedPages = Math.ceil(targetApplications / estimates.avgJobsPerPage);
    estimates.estimatedTime = targetApplications * estimates.avgTimePerJob;
    const minutes = Math.ceil(estimates.estimatedTime / 60);

    console.log(`Target applications: ${targetApplications}`);
    console.log(`Estimated pages needed: ${estimates.estimatedPages}`);
    console.log(`Estimated time: ~${minutes} minutes (${estimates.estimatedTime}s)`);
    console.log(`Average jobs per page: ${estimates.avgJobsPerPage}`);
    console.log(`Average time per job: ${estimates.avgTimePerJob}s\n`);

    return estimates;

  } catch (error) {
    console.error(`Error estimating metrics: ${error.message}`);
    return estimates;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateSetup, estimateMetrics };
}

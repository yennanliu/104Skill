/**
 * Configuration Templates
 *
 * Pre-configured options for common automation scenarios.
 * Copy and customize these for your use case.
 */

// ═══════════════════════════════════════════════════════════════════════════
// BASIC CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Quick Daily Job Hunt
 * Apply to 20 jobs, default settings
 */
const quickDailyConfig = {
  startPage: 1,
  targetApplications: 20,
  maxPages: 20,
  coverLetter: '自訂推薦信1'
};

/**
 * Conservative Approach
 * Fewer applications, start slow
 */
const conservativeConfig = {
  startPage: 1,
  targetApplications: 10,
  maxPages: 10,
  coverLetter: '自訂推薦信1'
};

/**
 * Aggressive Job Search
 * Apply to many jobs, search extensively
 */
const aggressiveConfig = {
  startPage: 1,
  targetApplications: 50,
  maxPages: 40,
  coverLetter: '自訂推薦信1'
};

// ═══════════════════════════════════════════════════════════════════════════
// SCENARIO-BASED CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Weekend Batch Processing
 * More time available, apply to more jobs
 */
const weekendBatchConfig = {
  startPage: 1,
  targetApplications: 100,
  maxPages: 60,
  coverLetter: '自訂推薦信1'
};

/**
 * Fresh Graduate / Career Change
 * Cast wide net, apply to many positions
 */
const freshGradConfig = {
  startPage: 1,
  targetApplications: 50,
  maxPages: 40,
  coverLetter: '新鮮人推薦信' // Customize to your cover letter name
};

/**
 * Senior/Experienced Professional
 * More selective, fewer but targeted applications
 */
const seniorProfessionalConfig = {
  startPage: 1,
  targetApplications: 15,
  maxPages: 15,
  coverLetter: '資深工程師推薦信' // Customize to your cover letter name
};

/**
 * Career Pivot
 * Different cover letter, moderate volume
 */
const careerPivotConfig = {
  startPage: 1,
  targetApplications: 30,
  maxPages: 25,
  coverLetter: '轉職推薦信' // Customize to your cover letter name
};

// ═══════════════════════════════════════════════════════════════════════════
// RESUME-FROM-INTERRUPTION CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Resume from Page 10
 * If you stopped at page 10, continue from there
 */
const resumeFromPage10Config = {
  startPage: 10,
  targetApplications: 20,
  maxPages: 30,
  coverLetter: '自訂推薦信1'
};

/**
 * Fill Remaining Quota
 * Applied to 30, need 20 more to reach 50 target
 */
const fillRemainingConfig = {
  startPage: 1,
  targetApplications: 20, // Remaining quota
  maxPages: 20,
  coverLetter: '自訂推薦信1'
};

// ═══════════════════════════════════════════════════════════════════════════
// TESTING CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Test Run
 * Small test before full automation
 */
const testRunConfig = {
  startPage: 1,
  targetApplications: 3,
  maxPages: 2,
  coverLetter: '自訂推薦信1'
};

/**
 * Dry Run Check
 * Preview what would happen (use with dryRun.js)
 */
const dryRunCheckConfig = {
  startPage: 1,
  targetApplications: 20,
  maxPages: 20,
  verbose: true
};

// ═══════════════════════════════════════════════════════════════════════════
// SPECIAL CASES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Multiple Cover Letters
 * Different configs for different job types
 */
const frontendConfig = {
  startPage: 1,
  targetApplications: 20,
  maxPages: 20,
  coverLetter: 'Frontend推薦信'
};

const backendConfig = {
  startPage: 1,
  targetApplications: 20,
  maxPages: 20,
  coverLetter: 'Backend推薦信'
};

const fullStackConfig = {
  startPage: 1,
  targetApplications: 20,
  maxPages: 20,
  coverLetter: 'FullStack推薦信'
};

/**
 * Time-Limited Session
 * Estimate: ~6 seconds per job
 * 30 minutes = ~300 jobs (but consider 20-30 for safety)
 */
const thirtyMinuteConfig = {
  startPage: 1,
  targetApplications: 25,
  maxPages: 20,
  coverLetter: '自訂推薦信1'
};

const oneHourConfig = {
  startPage: 1,
  targetApplications: 50,
  maxPages: 40,
  coverLetter: '自訂推薦信1'
};

// ═══════════════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * How to use these configs:
 */

// Example 1: Daily morning routine
async function morningRoutine(page) {
  await page.goto('YOUR_SEARCH_URL');
  await autoApply104Jobs(page, quickDailyConfig);
}

// Example 2: Weekend batch processing
async function weekendBatch(page) {
  await page.goto('YOUR_SEARCH_URL');
  await autoApply104Jobs(page, weekendBatchConfig);
}

// Example 3: Multi-cover-letter approach
async function multiCoverLetterApproach(page) {
  // Frontend jobs
  await page.goto('FRONTEND_SEARCH_URL');
  await autoApply104Jobs(page, frontendConfig);

  // Backend jobs
  await page.goto('BACKEND_SEARCH_URL');
  await autoApply104Jobs(page, backendConfig);

  // Full stack jobs
  await page.goto('FULLSTACK_SEARCH_URL');
  await autoApply104Jobs(page, fullStackConfig);
}

// Example 4: Safe test before full run
async function safeTest(page) {
  // Step 1: Dry run to see what would happen
  const { dryRun } = require('../skills/104-job-auto-apply/dryRun.js');
  await page.goto('YOUR_SEARCH_URL');
  const dryRunResults = await dryRun(page, dryRunCheckConfig);

  console.log(`Would apply to ${dryRunResults.wouldApply.length} jobs`);

  // Step 2: Test with 3 jobs
  const testResults = await autoApply104Jobs(page, testRunConfig);

  console.log(`Test: ${testResults.successful} successful`);

  // Step 3: If test passed, run full automation
  if (testResults.successful >= 2) {
    await autoApply104Jobs(page, quickDailyConfig);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Basic
    quickDailyConfig,
    conservativeConfig,
    aggressiveConfig,

    // Scenario-based
    weekendBatchConfig,
    freshGradConfig,
    seniorProfessionalConfig,
    careerPivotConfig,

    // Resume/Continue
    resumeFromPage10Config,
    fillRemainingConfig,

    // Testing
    testRunConfig,
    dryRunCheckConfig,

    // Special
    frontendConfig,
    backendConfig,
    fullStackConfig,
    thirtyMinuteConfig,
    oneHourConfig
  };
}

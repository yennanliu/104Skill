/**
 * Test Runner - Run all tests
 *
 * Executes all available tests in sequence and provides summary.
 *
 * Usage with Playwright MCP:
 * const { runAllTests } = require('./tests/runAllTests.js');
 * await runAllTests(page);
 */

const { testSelectors } = require('./selectors.test.js');
const { testApplicationFlow, smokeTest } = require('./flow.test.js');
const { testEdgeCases, testErrorRecovery } = require('./edge-cases.test.js');

/**
 * Run all tests
 *
 * @param {Page} page - Playwright page object (should be on search results page)
 * @param {Object} options - Test options
 * @param {string} options.coverLetter - Cover letter name to test (default: '自訂推薦信1')
 * @param {boolean} options.quick - Run only quick tests (default: false)
 * @returns {Object} Overall test results
 */
async function runAllTests(page, options = {}) {
  const {
    coverLetter = '自訂推薦信1',
    quick = false
  } = options;

  console.log('\n' + '═'.repeat(70));
  console.log('║' + ' '.repeat(20) + 'RUNNING ALL TESTS' + ' '.repeat(21) + '║');
  console.log('═'.repeat(70));
  console.log(`\nCover Letter: ${coverLetter}`);
  console.log(`Mode: ${quick ? 'Quick' : 'Full'}\n`);

  const results = {
    smokeTest: null,
    selectorTest: null,
    flowTest: null,
    edgeCaseTest: null,
    errorRecoveryTest: null,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    }
  };

  const startTime = Date.now();

  try {
    // 1. Smoke Test (always run)
    console.log('\n' + '═'.repeat(70));
    console.log('TEST 1: SMOKE TEST');
    console.log('═'.repeat(70));
    results.smokeTest = await smokeTest(page);

    if (!results.smokeTest) {
      console.log('\n⚠️  Smoke test failed - basic requirements not met');
      console.log('Please ensure:');
      console.log('  - You are logged in to 104.com.tw');
      console.log('  - You are on a job search results page');
      console.log('  - There are jobs available to apply to\n');

      if (quick) {
        console.log('Stopping tests due to smoke test failure.\n');
        return results;
      }
    }

    // 2. Selector Tests
    console.log('\n' + '═'.repeat(70));
    console.log('TEST 2: SELECTOR VALIDATION');
    console.log('═'.repeat(70));
    results.selectorTest = await testSelectors(page);

    // 3. Edge Case Tests (quick test only runs to here)
    if (!quick) {
      console.log('\n' + '═'.repeat(70));
      console.log('TEST 3: EDGE CASES');
      console.log('═'.repeat(70));
      results.edgeCaseTest = await testEdgeCases(page);

      // 4. Error Recovery Tests
      console.log('\n' + '═'.repeat(70));
      console.log('TEST 4: ERROR RECOVERY');
      console.log('═'.repeat(70));
      results.errorRecoveryTest = await testErrorRecovery(page);

      // 5. Application Flow Test (most comprehensive, runs last)
      console.log('\n' + '═'.repeat(70));
      console.log('TEST 5: APPLICATION FLOW (INTERACTIVE)');
      console.log('═'.repeat(70));
      console.log('⚠️  This test will open an application form but NOT submit it.\n');

      results.flowTest = await testApplicationFlow(page, coverLetter);
    }

    // Calculate summary
    results.summary.total = 1; // Smoke test
    results.summary.passed = results.smokeTest ? 1 : 0;
    results.summary.failed = results.smokeTest ? 0 : 1;

    if (results.selectorTest) {
      results.summary.total += results.selectorTest.totalTests;
      results.summary.passed += results.selectorTest.passedTests;
      results.summary.failed += results.selectorTest.failedTests;
      results.summary.warnings += results.selectorTest.warnings.length;
    }

    if (results.edgeCaseTest) {
      results.summary.total += results.edgeCaseTest.tests.length;
      results.summary.passed += results.edgeCaseTest.passed;
      results.summary.failed += results.edgeCaseTest.failed;
    }

    if (results.flowTest) {
      results.summary.total += results.flowTest.steps.length;
      results.summary.passed += results.flowTest.steps.filter(s => s.success).length;
      results.summary.failed += results.flowTest.steps.filter(s => !s.success).length;
    }

  } catch (error) {
    console.error(`\n❌ Test suite error: ${error.message}\n`);
    results.error = error.message;
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);

  // Final Summary
  console.log('\n' + '═'.repeat(70));
  console.log('║' + ' '.repeat(22) + 'FINAL SUMMARY' + ' '.repeat(23) + '║');
  console.log('═'.repeat(70));
  console.log(`\nTotal Tests: ${results.summary.total}`);
  console.log(`✅ Passed: ${results.summary.passed}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log(`⚠️  Warnings: ${results.summary.warnings}`);
  console.log(`⏱️  Duration: ${duration}s`);

  const successRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);
  console.log(`\n📊 Success Rate: ${successRate}%`);

  if (results.summary.failed === 0) {
    console.log('\n✅ ALL TESTS PASSED!\n');
    console.log('You are ready to run the automation. 🚀\n');
  } else if (results.summary.failed < 3) {
    console.log('\n⚠️  SOME TESTS FAILED\n');
    console.log('Review the failures above. You may still be able to run automation.\n');
  } else {
    console.log('\n❌ MULTIPLE TESTS FAILED\n');
    console.log('Please fix issues before running automation.\n');
  }

  console.log('═'.repeat(70) + '\n');

  return results;
}

/**
 * Quick health check
 *
 * @param {Page} page - Playwright page object
 * @returns {boolean} True if healthy
 */
async function quickCheck(page) {
  console.log('\n🏥 QUICK HEALTH CHECK\n');

  const smoke = await smokeTest(page);
  if (!smoke) return false;

  const selectors = await testSelectors(page);
  return selectors.failedTests === 0;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, quickCheck };
}

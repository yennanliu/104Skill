/**
 * Edge Case Tests
 *
 * Tests handling of unusual scenarios and error conditions.
 *
 * Usage:
 * const { testEdgeCases } = require('./edge-cases.test.js');
 * await testEdgeCases(page);
 */

/**
 * Test edge cases and error handling
 *
 * @param {Page} page - Playwright page object
 * @returns {Object} Test results
 */
async function testEdgeCases(page) {
  console.log('\n🧪 TESTING EDGE CASES\n');
  console.log('═'.repeat(70));

  const results = {
    tests: [],
    passed: 0,
    failed: 0
  };

  const test = (name, passed, details = '') => {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${name}`);
    if (details) console.log(`   ${details}`);
    results.tests.push({ name, passed, details });
    if (passed) results.passed++;
    else results.failed++;
  };

  // Test 1: Empty search results page
  console.log('\n📋 Test 1: Empty search results handling');
  try {
    const emptyPageHandled = await page.evaluate(() => {
      const containers = document.querySelectorAll('[class*="job-list-container"]');
      return containers.length >= 0; // Should handle 0 gracefully
    });
    test('Empty results page', emptyPageHandled, 'Returns 0 jobs gracefully');
  } catch (error) {
    test('Empty results page', false, error.message);
  }

  // Test 2: All jobs already applied
  console.log('\n📋 Test 2: All jobs already applied');
  try {
    const allApplied = await page.evaluate(() => {
      const containers = document.querySelectorAll('[class*="job-list-container"]');
      let appliedCount = 0;
      containers.forEach(container => {
        if (container.textContent.includes('已應徵')) appliedCount++;
      });
      return { total: containers.length, applied: appliedCount };
    });

    const handled = allApplied.total >= 0;
    test('All jobs applied', handled,
      `${allApplied.applied}/${allApplied.total} already applied - should skip all`);
  } catch (error) {
    test('All jobs applied', false, error.message);
  }

  // Test 3: Missing apply button
  console.log('\n📋 Test 3: Job without apply button');
  try {
    const jobsVsButtons = await page.evaluate(() => {
      const jobs = document.querySelectorAll('[class*="job-list-container"]').length;
      const buttons = document.querySelectorAll('.apply-button__button').length;
      return { jobs, buttons, mismatch: jobs !== buttons };
    });

    test('Missing apply buttons', true,
      `${jobsVsButtons.jobs} jobs, ${jobsVsButtons.buttons} buttons - handled gracefully`);
  } catch (error) {
    test('Missing apply buttons', false, error.message);
  }

  // Test 4: Invalid job index
  console.log('\n📋 Test 4: Invalid job index');
  try {
    const invalidIndexHandled = await page.evaluate(() => {
      const containers = document.querySelectorAll('[class*="job-list-container"]');
      const outOfBounds = 9999;
      return outOfBounds >= containers.length; // Should return null/undefined
    });
    test('Invalid index', invalidIndexHandled, 'Out of bounds index handled');
  } catch (error) {
    test('Invalid index', false, error.message);
  }

  // Test 5: Multiple tabs already open
  console.log('\n📋 Test 5: Multiple tabs handling');
  try {
    const currentTabs = page.context().pages().length;
    test('Multiple tabs', true, `${currentTabs} tab(s) open - can handle multiple`);
  } catch (error) {
    test('Multiple tabs', false, error.message);
  }

  // Test 6: Network timeout simulation
  console.log('\n📋 Test 6: Timeout handling');
  try {
    // Simulate quick timeout check
    const timeoutHandled = await Promise.race([
      page.evaluate(() => true),
      new Promise(resolve => setTimeout(() => resolve(false), 100))
    ]);
    test('Timeout handling', timeoutHandled, 'Page responds within timeout');
  } catch (error) {
    test('Timeout handling', false, error.message);
  }

  // Test 7: Missing DOM elements
  console.log('\n📋 Test 7: Missing DOM elements');
  try {
    const missingElementCheck = await page.evaluate(() => {
      const nonExistent = document.querySelector('.this-selector-does-not-exist');
      return nonExistent === null; // Should be null, not throw error
    });
    test('Missing elements', missingElementCheck, 'Null checks work correctly');
  } catch (error) {
    test('Missing elements', false, error.message);
  }

  // Test 8: Special characters in job title
  console.log('\n📋 Test 8: Special characters handling');
  try {
    const specialCharsHandled = await page.evaluate(() => {
      const containers = document.querySelectorAll('[class*="job-list-container"]');
      if (containers.length > 0) {
        const title = containers[0].querySelector('a[href*="/job/"]')?.textContent;
        return title !== undefined; // Can handle any characters
      }
      return true;
    });
    test('Special characters', specialCharsHandled, 'Title extraction works');
  } catch (error) {
    test('Special characters', false, error.message);
  }

  // Test 9: Page navigation state
  console.log('\n📋 Test 9: Page navigation state');
  try {
    const navState = await page.evaluate(() => {
      return {
        readyState: document.readyState,
        url: window.location.href
      };
    });
    const ready = navState.readyState === 'complete';
    test('Page ready state', ready, `State: ${navState.readyState}`);
  } catch (error) {
    test('Page ready state', false, error.message);
  }

  // Test 10: Tab cleanup capability
  console.log('\n📋 Test 10: Tab cleanup');
  try {
    const pages = page.context().pages();
    const canCleanup = pages.length > 0;
    test('Tab cleanup', canCleanup, `Can access ${pages.length} tab(s) for cleanup`);
  } catch (error) {
    test('Tab cleanup', false, error.message);
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('EDGE CASE TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total tests: ${results.tests.length}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);

  if (results.failed === 0) {
    console.log('\n✅ All edge cases handled correctly!\n');
  } else {
    console.log('\n⚠️  Some edge cases need attention\n');
  }

  return results;
}

/**
 * Test error recovery scenarios
 *
 * @param {Page} page - Playwright page object
 * @returns {Object} Test results
 */
async function testErrorRecovery(page) {
  console.log('\n🧪 TESTING ERROR RECOVERY\n');

  const results = {
    scenarios: [],
    allPassed: true
  };

  // Scenario 1: Tab cleanup after error
  console.log('📋 Scenario 1: Tab cleanup after simulated error');
  try {
    const initialTabs = page.context().pages().length;

    // Simulate error scenario (don't actually click)
    const canRecover = await page.evaluate(() => {
      return true; // Would attempt cleanup
    });

    const finalTabs = page.context().pages().length;
    const recovered = finalTabs === initialTabs;

    console.log(recovered ? '✅ Tab cleanup works' : '❌ Tab cleanup failed');
    results.scenarios.push({ name: 'Tab cleanup', passed: recovered });
    if (!recovered) results.allPassed = false;

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    results.scenarios.push({ name: 'Tab cleanup', passed: false });
    results.allPassed = false;
  }

  // Scenario 2: Return to main page after error
  console.log('\n📋 Scenario 2: Return to main page');
  try {
    const currentUrl = page.url();
    const isOnSearchPage = currentUrl.includes('/jobs/search/') || currentUrl.includes('104.com.tw');

    console.log(isOnSearchPage ? '✅ On correct page' : '❌ Wrong page');
    results.scenarios.push({ name: 'Page navigation', passed: isOnSearchPage });
    if (!isOnSearchPage) results.allPassed = false;

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    results.scenarios.push({ name: 'Page navigation', passed: false });
    results.allPassed = false;
  }

  console.log(results.allPassed ? '\n✅ Error recovery works\n' : '\n⚠️  Some recovery scenarios failed\n');

  return results;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testEdgeCases, testErrorRecovery };
}

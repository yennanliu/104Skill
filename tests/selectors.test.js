/**
 * Selector Tests
 *
 * Validates that critical DOM selectors still work.
 * Run this periodically to detect if 104.com.tw updated their UI.
 *
 * Usage:
 * const { testSelectors } = require('./selectors.test.js');
 * await testSelectors(page);
 */

/**
 * Test all critical selectors
 *
 * @param {Page} page - Playwright page object (must be on search results page)
 * @returns {Object} Test results
 */
async function testSelectors(page) {
  console.log('\n🧪 TESTING SELECTORS\n');
  console.log('═'.repeat(70));

  const results = {
    passed: [],
    failed: [],
    warnings: [],
    totalTests: 0,
    passedTests: 0,
    failedTests: 0
  };

  const tests = [
    {
      name: 'Apply button selector',
      selector: '.apply-button__button',
      critical: true,
      shouldExist: true,
      minCount: 1
    },
    {
      name: 'Job container selector',
      selector: '[class*="job-list-container"]',
      critical: true,
      shouldExist: true,
      minCount: 1
    },
    {
      name: 'Job title link selector',
      selector: 'a[href*="/job/"]',
      critical: true,
      shouldExist: true,
      minCount: 1
    },
    {
      name: 'Company name selector',
      selector: '[class*="company"]',
      critical: false,
      shouldExist: true,
      minCount: 1
    },
    {
      name: 'Already applied indicator',
      selector: 'text=已應徵',
      critical: false,
      shouldExist: false, // May or may not exist
      minCount: 0
    }
  ];

  for (const test of tests) {
    results.totalTests++;

    try {
      const elements = await page.locator(test.selector).all();
      const count = elements.length;

      const passed = test.shouldExist ? count >= test.minCount : true;

      if (passed) {
        results.passedTests++;
        results.passed.push({
          name: test.name,
          selector: test.selector,
          count
        });
        console.log(`✅ ${test.name}`);
        console.log(`   Selector: ${test.selector}`);
        console.log(`   Found: ${count} elements`);
      } else {
        if (test.critical) {
          results.failedTests++;
          results.failed.push({
            name: test.name,
            selector: test.selector,
            expected: test.minCount,
            found: count
          });
          console.log(`❌ ${test.name} [CRITICAL]`);
          console.log(`   Selector: ${test.selector}`);
          console.log(`   Expected: ${test.minCount}+, Found: ${count}`);
        } else {
          results.warnings.push({
            name: test.name,
            selector: test.selector,
            count
          });
          console.log(`⚠️  ${test.name} [WARNING]`);
          console.log(`   Selector: ${test.selector}`);
          console.log(`   Found: ${count} elements`);
        }
      }
    } catch (error) {
      results.failedTests++;
      results.failed.push({
        name: test.name,
        selector: test.selector,
        error: error.message
      });
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
    }

    console.log('');
  }

  // Summary
  console.log('═'.repeat(70));
  console.log('SELECTOR TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total: ${results.totalTests}`);
  console.log(`✅ Passed: ${results.passedTests}`);
  console.log(`❌ Failed: ${results.failedTests}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);

  if (results.failedTests === 0) {
    console.log('\n✅ All critical selectors working!\n');
  } else {
    console.log('\n❌ Some selectors failed - 104.com.tw may have updated their UI\n');
    console.log('Failed selectors:');
    results.failed.forEach(f => {
      console.log(`  - ${f.name}: ${f.selector}`);
    });
    console.log('');
  }

  return results;
}

/**
 * Test dropdown interaction selectors (requires application form page)
 *
 * @param {Page} page - Playwright page object (must be on application form)
 * @returns {Object} Test results
 */
async function testFormSelectors(page) {
  console.log('\n🧪 TESTING FORM SELECTORS\n');

  const results = {
    passed: [],
    failed: [],
    totalTests: 0
  };

  const tests = [
    {
      name: 'Cover letter dropdown trigger',
      selector: 'span:has-text("系統預設")',
      critical: true
    },
    {
      name: 'Multiselect option container',
      selector: '.multiselect__option',
      critical: true
    },
    {
      name: 'Submit button',
      selector: 'button:has-text("確認送出")',
      critical: true
    }
  ];

  for (const test of tests) {
    results.totalTests++;

    try {
      const element = await page.locator(test.selector).first();
      const exists = await element.count() > 0;

      if (exists) {
        results.passed.push(test.name);
        console.log(`✅ ${test.name}`);
      } else {
        results.failed.push(test.name);
        console.log(`❌ ${test.name}`);
      }
    } catch (error) {
      results.failed.push(test.name);
      console.log(`❌ ${test.name}: ${error.message}`);
    }
  }

  console.log(`\nForm Selectors: ${results.passed.length}/${results.totalTests} passed\n`);

  return results;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testSelectors, testFormSelectors };
}

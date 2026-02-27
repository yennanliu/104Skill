# Test Suite

Comprehensive testing for 104 job automation.

## Quick Start

```javascript
// In Playwright MCP, navigate to 104 search page first, then:

// Option 1: Quick health check
const { quickCheck } = require('./tests/runAllTests.js');
const healthy = await quickCheck(page);

// Option 2: Run all tests
const { runAllTests } = require('./tests/runAllTests.js');
const results = await runAllTests(page, {
  coverLetter: '自訂推薦信1',
  quick: false  // Set true for faster tests
});

// Option 3: Individual tests
const { testSelectors } = require('./tests/selectors.test.js');
await testSelectors(page);
```

## Test Files

### `selectors.test.js`
Validates that DOM selectors still work.

**When to run:**
- Before automation runs
- After 104.com.tw updates
- Monthly maintenance

**What it tests:**
- Apply button selector (`.apply-button__button`)
- Job container selector
- Job title selector
- Company name selector
- Already-applied indicator

**Usage:**
```javascript
const { testSelectors, testFormSelectors } = require('./tests/selectors.test.js');

// Test search page selectors
await testSelectors(page);

// Test application form selectors (requires being on form page)
await testFormSelectors(applicationFormPage);
```

### `flow.test.js`
Tests the complete application flow without submitting.

**When to run:**
- Before first automation run
- After code changes
- To verify cover letter exists

**What it tests:**
- Finding available jobs
- Reading job information
- Clicking apply button
- Tab management
- Cover letter dropdown
- Cover letter selection
- Submit button presence

**Usage:**
```javascript
const { testApplicationFlow, smokeTest } = require('./tests/flow.test.js');

// Quick smoke test
const passed = await smokeTest(page);

// Full flow test (opens application form but doesn't submit)
const results = await testApplicationFlow(page, '自訂推薦信1');
```

### `edge-cases.test.js`
Tests unusual scenarios and error handling.

**When to run:**
- Before production use
- After major changes
- Regression testing

**What it tests:**
- Empty search results
- All jobs already applied
- Missing apply buttons
- Invalid job indexes
- Multiple tabs handling
- Network timeouts
- Missing DOM elements
- Special characters
- Page navigation state
- Tab cleanup

**Usage:**
```javascript
const { testEdgeCases, testErrorRecovery } = require('./tests/edge-cases.test.js');

// Test edge cases
await testEdgeCases(page);

// Test error recovery
await testErrorRecovery(page);
```

### `runAllTests.js`
Runs all tests in sequence.

**When to run:**
- Before deploying changes
- Regular health checks
- Full validation

**Usage:**
```javascript
const { runAllTests, quickCheck } = require('./tests/runAllTests.js');

// Full test suite
const results = await runAllTests(page, {
  coverLetter: '自訂推薦信1',
  quick: false
});

// Quick test (smoke + selectors only)
const results = await runAllTests(page, { quick: true });

// Health check
const healthy = await quickCheck(page);
```

## Test Workflow

### Before First Run
```javascript
// 1. Navigate to 104 search page
await page.goto('https://www.104.com.tw/jobs/search/?...');

// 2. Run smoke test
const { smokeTest } = require('./tests/flow.test.js');
await smokeTest(page);

// 3. Run selector tests
const { testSelectors } = require('./tests/selectors.test.js');
await testSelectors(page);

// 4. Run flow test
const { testApplicationFlow } = require('./tests/flow.test.js');
await testApplicationFlow(page, 'YOUR_COVER_LETTER_NAME');

// 5. If all pass, run automation
```

### Regular Maintenance
```javascript
// Quick check before automation
const { quickCheck } = require('./tests/runAllTests.js');
if (await quickCheck(page)) {
  console.log('Ready to run automation!');
} else {
  console.log('Please fix issues first');
}
```

### After 104.com.tw Updates
```javascript
// Full test suite to detect UI changes
const { runAllTests } = require('./tests/runAllTests.js');
const results = await runAllTests(page);

// Check results.selectorTest for any failed selectors
if (results.selectorTest.failedTests > 0) {
  console.log('Selectors need updating!');
  console.log(results.selectorTest.failed);
}
```

## Test Output

All tests provide clear console output:

```
═══════════════════════════════════════════════════════════════════
🧪 TESTING SELECTORS
═══════════════════════════════════════════════════════════════════

✅ Apply button selector
   Selector: .apply-button__button
   Found: 18 elements

✅ Job container selector
   Selector: [class*="job-list-container"]
   Found: 18 elements

...

═══════════════════════════════════════════════════════════════════
SELECTOR TEST SUMMARY
═══════════════════════════════════════════════════════════════════
Total: 5
✅ Passed: 5
❌ Failed: 0
⚠️  Warnings: 0

✅ All critical selectors working!
```

## Interpreting Results

### ✅ All Tests Pass
- Ready to run automation
- Selectors are valid
- Flow works correctly
- Error handling is robust

### ⚠️  Warnings Only
- Generally safe to proceed
- Review warnings for potential issues
- Consider fixing for optimal performance

### ❌ Critical Failures
- DO NOT run automation
- Fix issues first
- Common causes:
  - Not logged in
  - Wrong page
  - Selectors outdated (104 UI changed)
  - Cover letter doesn't exist

## Continuous Testing

### Daily
```javascript
// Quick health check before automation
await quickCheck(page);
```

### Weekly
```javascript
// Full selector validation
await testSelectors(page);
```

### Monthly
```javascript
// Complete test suite
await runAllTests(page);
```

### After 104 Updates
```javascript
// Full test suite + manual verification
await runAllTests(page);
// Then manually verify one application
```

## Test Development

### Adding New Tests

1. **Selector Tests** - Add to `selectors.test.js`:
```javascript
{
  name: 'New selector',
  selector: '.new-class',
  critical: true,
  shouldExist: true,
  minCount: 1
}
```

2. **Flow Tests** - Add step to `flow.test.js`:
```javascript
step('New step', true, 'Testing new feature...');
// ... test logic ...
step('New feature', success, details);
```

3. **Edge Cases** - Add to `edge-cases.test.js`:
```javascript
console.log('\n📋 Test N: New edge case');
try {
  // ... test logic ...
  test('New edge case', passed, details);
} catch (error) {
  test('New edge case', false, error.message);
}
```

## Troubleshooting

### Tests Timeout
- Increase page load timeouts
- Check network connection
- Verify page is fully loaded

### Selectors Not Found
- 104.com.tw UI may have changed
- Update selectors in scripts
- Run tests to verify new selectors

### Flow Test Fails at Cover Letter
- Cover letter name doesn't match
- Check exact name in 104 account
- Try test with different letter name

## Best Practices

1. **Always run tests before automation**
2. **Test after any code changes**
3. **Monitor test results for patterns**
4. **Update tests when adding features**
5. **Keep test suite up to date with 104 changes**

## License

MIT

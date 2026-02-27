# Examples

Practical examples and templates for 104 job automation.

## Files in This Directory

### `search-urls.md`
Pre-configured search URLs for different job types and scenarios.

**Use it for:**
- Finding the right search URL for your job hunt
- Understanding URL parameters
- Building custom searches
- Quick reference for area codes and filters

### `config-templates.js`
Ready-to-use configuration templates for various scenarios.

**Includes configs for:**
- Daily job hunt (20 apps)
- Weekend batch (100 apps)
- Fresh graduate approach (50 apps)
- Senior professional (15 apps)
- Resume from interruption
- Testing and dry-runs

### `sample-results.json`
Example output format showing what a successful run looks like.

**Shows:**
- Summary statistics
- Per-page breakdown
- Applied/failed/skipped jobs
- Performance metrics
- Recommendations

## Quick Start Examples

### Example 1: Simple Daily Run
```javascript
// Navigate to search page
await page.goto('https://www.104.com.tw/jobs/search/?area=6001001000&keyword=軟體工程師&order=15&page=1');

// Load config
const { quickDailyConfig } = require('./examples/config-templates.js');

// Run automation
await autoApply104Jobs(page, quickDailyConfig);
```

### Example 2: Safe Test First
```javascript
// Step 1: Dry run
const { dryRun } = require('./skills/104-job-auto-apply/dryRun.js');
await page.goto('YOUR_SEARCH_URL');
const preview = await dryRun(page, { targetApplications: 20 });

console.log(`Would apply to ${preview.wouldApply.length} jobs`);

// Step 2: If preview looks good, run for real
if (preview.wouldApply.length >= 10) {
  await autoApply104Jobs(page, { targetApplications: 20 });
}
```

### Example 3: Multi-Cover-Letter Strategy
```javascript
const { frontendConfig, backendConfig } = require('./examples/config-templates.js');

// Morning: Frontend positions
await page.goto('https://www.104.com.tw/jobs/search/?keyword=Frontend&...');
await autoApply104Jobs(page, frontendConfig);

// Afternoon: Backend positions
await page.goto('https://www.104.com.tw/jobs/search/?keyword=Backend&...');
await autoApply104Jobs(page, backendConfig);
```

### Example 4: Weekend Batch with Validation
```javascript
const { validateSetup } = require('./skills/104-job-auto-apply/validateSetup.js');
const { weekendBatchConfig } = require('./examples/config-templates.js');

// Validate setup
await page.goto('YOUR_SEARCH_URL');
const validation = await validateSetup(page, { coverLetter: '自訂推薦信1' });

if (validation.overallStatus === 'ready') {
  // Run large batch
  await autoApply104Jobs(page, weekendBatchConfig);
} else {
  console.log('Setup validation failed. Please fix issues first.');
}
```

## Common Workflows

### New User First-Time Setup
```javascript
// 1. Validate setup
const { validateSetup } = require('./skills/104-job-auto-apply/validateSetup.js');
await validateSetup(page, { coverLetter: 'YOUR_COVER_LETTER' });

// 2. Test selectors
const { testSelectors } = require('./tests/selectors.test.js');
await testSelectors(page);

// 3. Dry run
const { dryRun } = require('./skills/104-job-auto-apply/dryRun.js');
await dryRun(page, { targetApplications: 20 });

// 4. Test with 3 jobs
await autoApply104Jobs(page, { targetApplications: 3 });

// 5. Full run
await autoApply104Jobs(page, { targetApplications: 20 });
```

### Daily Routine
```javascript
// Quick validation + automation
const { quickCheck } = require('./tests/runAllTests.js');

await page.goto('YOUR_DAILY_SEARCH_URL');

if (await quickCheck(page)) {
  await autoApply104Jobs(page, { targetApplications: 20 });
}
```

### Weekly Deep Search
```javascript
const { weekendBatchConfig } = require('./examples/config-templates.js');

// Cast wider net on weekends
const wideSearchUrl = 'https://www.104.com.tw/jobs/search/?keyword=軟體工程師&remoteWork=1,2&order=15&page=1';

await page.goto(wideSearchUrl);
await autoApply104Jobs(page, weekendBatchConfig);
```

## Tips

### Building Your Search URL
1. Go to 104.com.tw in your browser
2. Use the search UI to set filters:
   - Location (Taipei, New Taipei, etc.)
   - Remote work options
   - Salary range
   - Keywords
3. Copy the URL from address bar
4. Use it in automation

### Choosing the Right Config
- **First time?** Start with `testRunConfig` (3 jobs)
- **Daily hunt?** Use `quickDailyConfig` (20 jobs)
- **Weekend?** Use `weekendBatchConfig` (100 jobs)
- **Fresh grad?** Use `freshGradConfig` (50 jobs, wider net)
- **Senior role?** Use `seniorProfessionalConfig` (15 jobs, selective)

### Optimizing Your Automation
1. **Run dry-run first** - See what would happen
2. **Validate setup** - Catch errors before starting
3. **Test with 3 jobs** - Verify everything works
4. **Monitor first page** - Watch console output
5. **Use keyboard controls** - P to pause and check results

## Need Help?

- See `search-urls.md` for URL building
- See `config-templates.js` for pre-made configs
- See `sample-results.json` for expected output format
- Check main `README.md` for full documentation
- Review `SKILL.md` for detailed usage guide

## Contributing

Have a useful template or example? Submit a PR!

Guidelines:
- Add clear comments
- Test before submitting
- Follow existing format
- Include use case description

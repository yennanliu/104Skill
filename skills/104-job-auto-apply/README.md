# 104 Job Auto-Apply Scripts

This directory contains the automation scripts for 104.com.tw job applications.

## Files

### `autoApply104Jobs.js`
Main automation script with target-based execution and keyboard controls.

**Features:**
- Target-based stopping (e.g., stop after 20 successful applications)
- Keyboard controls: P=Pause, R=Resume, Q=Quit
- On-page status indicator
- Proven 92.5% success rate

**Usage:**
```javascript
// Load the script (in Claude Code with Playwright MCP)
const { autoApply104Jobs } = require('./autoApply104Jobs.js');

// Basic usage - apply to 20 jobs
await autoApply104Jobs(page, { targetApplications: 20 });

// Advanced usage
await autoApply104Jobs(page, {
  startPage: 1,
  targetApplications: 50,
  maxPages: 30,
  coverLetter: '自訂推薦信1'
});
```

### `applySingleJob.js`
Helper functions for single job application and job listing.

**Functions:**
- `applySingleJob(page, jobIndex, coverLetter)` - Apply to a single job
- `listJobs(page)` - List all jobs on current page

**Usage:**
```javascript
const { applySingleJob, listJobs } = require('./applySingleJob.js');

// Navigate to search page first
await page.goto('https://www.104.com.tw/jobs/search/?...');

// List available jobs
const jobs = await listJobs(page);
console.log(jobs);

// Apply to first job (index 0)
const result = await applySingleJob(page, 0, '自訂推薦信1');
console.log(result);
```

## Prerequisites

Before using these scripts:
1. Login to 104.com.tw in your browser
2. Create and name your cover letter (e.g., '自訂推薦信1')
3. Have Playwright MCP tools available in Claude Code

## Quick Start

### Method 1: Direct Code Execution
Copy the function code and paste directly into Claude Code's Playwright MCP code block.

### Method 2: Require/Import (if supported)
```javascript
// Load the script
const { autoApply104Jobs } = require('./skills/104-job-auto-apply/autoApply104Jobs.js');

// Navigate to search page
await page.goto('https://www.104.com.tw/jobs/search/?area=6001001000,6001002000&keyword=%E8%BB%9F%E9%AB%94%E5%B7%A5%E7%A8%8B%E5%B8%AB&order=15&remoteWork=1,2&page=1');

// Run automation
await autoApply104Jobs(page, { targetApplications: 20 });
```

## Configuration

Both scripts accept options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `startPage` | number | 1 | Starting page number |
| `targetApplications` | number | 20 | Target successful applications |
| `maxPages` | number | 20 | Maximum pages to search |
| `coverLetter` | string | '自訂推薦信1' | Cover letter name |

## Returns

Both functions return result objects:

```javascript
{
  status: 'success' | 'failed' | 'skipped' | 'error',
  successful: 15,      // Number of successful applications
  failed: 2,           // Number of failed applications
  skipped: 10,         // Number of skipped (already applied)
  pages: [...]         // Per-page results
}
```

## Best Practices

1. **Test first**: Use `applySingleJob.js` to test with 1-2 jobs
2. **Start small**: Begin with `targetApplications: 10`
3. **Monitor**: Watch first few applications to ensure working correctly
4. **Use controls**: Press P to pause if needed
5. **Verify**: Check 104.com.tw account after run

## Troubleshooting

**Script not loading?**
- Copy/paste the function directly instead of using require()
- Playwright MCP may not support file system require()

**Application failing?**
- Verify you're logged in to 104.com.tw
- Check cover letter name matches exactly
- Test with single job first

**No jobs found?**
- Verify search URL is correct
- Check you're on the search results page
- Try navigating to page manually first

## Performance

Based on 2,495-application case study:
- **Success Rate**: 92.5%
- **Throughput**: 609 applications/hour
- **Speed**: ~6 seconds per job
- **Reliability**: 5 consecutive successful runs

## License

MIT

# 104 Job Auto-Apply - Usage Examples

Quick reference guide for using the 104 job automation skill with Claude Code.

## Installation

### Quick Install (Recommended)
```bash
# Create Claude Code skills directory if it doesn't exist
mkdir -p ~/.claude/skills/104-job-auto-apply

# Copy the skill file
cp SKILL.md ~/.claude/skills/104-job-auto-apply/

# Verify installation
ls ~/.claude/skills/104-job-auto-apply/
```

The skill will now be available globally in Claude Code as `/104-job-auto-apply`.

## Example 1: First Time Setup & Test

**What to say to Claude:**
```
I want to test the 104 job automation skill.
Can you help me apply to one software engineering job as a test?

My 104.com.tw account is: f339339@hotmail.com
My cover letter name is: 自訂推薦信1
```

**What Claude will do:**
1. Navigate to 104.com.tw job search
2. List available jobs
3. Apply to one job with your cover letter
4. Verify success and show results

## Example 2: Batch Apply to Multiple Jobs

**What to say to Claude:**
```
Use the 104-job-auto-apply skill to apply to remote software engineering jobs.
Search parameters:
- Location: Taipei
- Job type: Software Engineer
- Work type: Remote or hybrid
- Process 3 pages
- Use 3-5 second delays
```

**Configuration Claude will use:**
```javascript
{
  startPage: 1,
  maxPages: 3,
  delayMin: 3000,
  delayMax: 5000,
  coverLetter: '自訂推薦信1'
}
```

## Example 3: Conservative Approach

**What to say to Claude:**
```
I want to carefully apply to backend developer jobs on 104.
Use conservative settings:
- Start from page 1
- Only process 2 pages
- Use 6-10 second delays between applications
- Skip any jobs I've already applied to
```

**Configuration:**
```javascript
{
  startPage: 1,
  maxPages: 2,
  delayMin: 6000,
  delayMax: 10000,
  coverLetter: '自訂推薦信1'
}
```

## Example 4: Resume from Specific Page

**What to say to Claude:**
```
Continue my 104 job applications from page 5.
Process 3 more pages with standard delays.
```

**Configuration:**
```javascript
{
  startPage: 5,
  maxPages: 3,
  delayMin: 2000,
  delayMax: 4000,
  coverLetter: '自訂推薦信1'
}
```

## Example 5: Single Job Application (Manual Control)

**What to say to Claude:**
```
I'm on a 104 job search page.
Help me apply to the 3rd job in the list (index 2).
```

**What Claude will do:**
1. List all jobs on current page
2. Apply to job at index 2
3. Select cover letter
4. Submit application
5. Verify success

## Example 6: Custom Search Query

**What to say to Claude:**
```
Search for "React Developer" jobs in New Taipei City on 104.
Apply to jobs on first 2 pages.
Use my custom cover letter: "React專用推薦信"
```

**Custom configuration:**
```javascript
{
  startPage: 1,
  maxPages: 2,
  delayMin: 2000,
  delayMax: 4000,
  coverLetter: 'React專用推薦信'
}
```

## Example 7: Different Cover Letters for Different Job Types

**Scenario 1: Frontend Jobs**
```
Apply to frontend developer jobs using cover letter "前端工程師推薦信"
Process 2 pages
```

**Scenario 2: Backend Jobs**
```
Apply to backend developer jobs using cover letter "後端工程師推薦信"
Process 2 pages
```

**Scenario 3: Full Stack Jobs**
```
Apply to full-stack developer jobs using cover letter "全端工程師推薦信"
Process 2 pages
```

## Invoking the Skill

### Method 1: Direct Skill Invocation
```
/104-job-auto-apply
```

### Method 2: Natural Language
```
Help me apply to jobs on 104.com.tw
```

### Method 3: Specific Request
```
Use the 104 automation skill to batch apply to software jobs
```

## Common Workflows

### Workflow A: Daily Job Hunt
```
Morning: Apply to 10 new jobs (2 pages, standard delays)
Afternoon: Check results and respond to emails
Evening: Apply to 10 more jobs if needed
```

### Workflow B: Targeted Application
```
1. Search for specific role (e.g., "Senior Backend Engineer")
2. Review job list
3. Apply to top 5 matches manually (using single job mode)
4. Track applications in spreadsheet
```

### Workflow C: Wide Net Approach
```
1. Define broad search (e.g., "Software Engineer")
2. Batch apply to 5 pages (conservative delays)
3. Review all applications next day
4. Follow up on interesting opportunities
```

## Tips for Best Results

### Before Starting
- [ ] Log in to 104.com.tw in browser
- [ ] Verify resume is up to date
- [ ] Check cover letters are ready
- [ ] Test with 1-2 jobs first

### During Automation
- [ ] Monitor console output
- [ ] Watch for errors or skipped jobs
- [ ] Don't close or switch browser tabs
- [ ] Keep internet connection stable

### After Completion
- [ ] Check 104.com.tw account for confirmations
- [ ] Review email for interview invites
- [ ] Note any failed applications
- [ ] Plan follow-ups

## Troubleshooting Examples

### Issue: Can't Find Apply Button
```
Claude, the apply button isn't being found.
Can you:
1. Take a screenshot of the current page
2. List all buttons on the page
3. Help me identify the correct selector
```

### Issue: Wrong Cover Letter Selected
```
Claude, I need to change my default cover letter.
My new cover letter is called "軟體工程師推薦信2"
Update the configuration and try again.
```

### Issue: Too Many Failures
```
Claude, I'm seeing too many failed applications.
Let's:
1. Slow down (use 8-12 second delays)
2. Process only 1 page at a time
3. Test with a single job first
```

## Sample Output

### Successful Run
```
======================================================================
🚀 104.com.tw Auto-Apply Automation
   Start Page: 1
   Max Pages: 3
   Cover Letter: 自訂推薦信1
======================================================================

📄 [Page 1]
   Found 20 jobs to process

   [1/20]
🔍 Processing: Senior Software Engineer - Backend
   ✅ SUCCESS: Application submitted
   ⏱️  Waiting 3.2s before next job...

   [2/20]
🔍 Processing: Full Stack Developer
   ⚠️  SKIPPED: Already applied
   ⏱️  Waiting 2.8s before next job...

...

======================================================================
📊 Final Summary
======================================================================
   Total Processed: 60
   ✅ Successfully Applied: 45
   ⚠️  Skipped: 10
   ❌ Failed: 5
======================================================================
```

## Advanced Usage

### Custom Search URL
```
Claude, use this custom search URL for 104 jobs:
https://www.104.com.tw/jobs/search/?keyword=Python&area=6001001000

Apply to first 2 pages.
```

### Multiple Sessions
```
Session 1 (Morning): Pages 1-3
Session 2 (Afternoon): Pages 4-6
Session 3 (Evening): Pages 7-9
```

### A/B Testing Cover Letters
```
Week 1: Use "傳統推薦信" for 50 jobs
Week 2: Use "創意推薦信" for 50 jobs
Compare response rates
```

## Quick Reference

| Task | Command |
|------|---------|
| Install skill | `cp SKILL.md ~/.claude/skills/104-job-auto-apply/` |
| Invoke skill | `/104-job-auto-apply` or ask naturally |
| Test single job | "Apply to one job as a test" |
| Batch apply | "Apply to 3 pages of software jobs" |
| Change cover letter | "Use cover letter: [name]" |
| Adjust delays | "Use 5-8 second delays" |
| Resume from page | "Continue from page 5" |

## Safety Reminders

1. **Daily Limit**: Don't exceed 20-30 applications per day
2. **Quality Over Quantity**: Apply to genuinely suitable positions
3. **Monitor First Run**: Watch the first page carefully
4. **Increase Delays**: If seeing errors, use longer delays
5. **Take Breaks**: Don't run continuously for hours
6. **Respect ToS**: Follow 104.com.tw Terms of Service

## Getting Help

If you encounter issues:

1. **Check Prerequisites**: Logged in? Resume uploaded? Cover letter exists?
2. **Test Single Job**: Try manual mode first
3. **Review Logs**: Look for specific error messages
4. **Adjust Settings**: Try slower delays or fewer pages
5. **Ask Claude**: "Help me debug this 104 automation issue"

---

Happy job hunting! Remember to apply thoughtfully and ethically.

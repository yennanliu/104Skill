# Quick Start Guide - 104 Job Auto-Apply

Get started with the 104 job automation skill in under 5 minutes.

## 🚀 Installation (30 seconds)

### Option A: Automatic Install (Recommended)
```bash
cd 104Skill
./install.sh
```

### Option B: Manual Install
```bash
mkdir -p ~/.claude/skills/104-job-auto-apply
cp SKILL.md ~/.claude/skills/104-job-auto-apply/
```

## ✅ Prerequisites Checklist

Before using the skill, make sure you have:

- [ ] 104.com.tw account
- [ ] Logged in to 104.com.tw in your browser
- [ ] Resume uploaded to your account
- [ ] At least one cover letter created (note the exact name)
- [ ] Playwright MCP tools configured in Claude Code
- [ ] Stable internet connection

## 🎯 First Test (2 minutes)

### Step 1: Start Claude Code
```bash
claude
```

### Step 2: Test with a Single Job
Type this in Claude Code:
```
Use the 104 job automation skill to apply to one software engineering job as a test.

My cover letter is called: 自訂推薦信1
```

### Step 3: Verify Success
Claude will:
1. Navigate to 104.com.tw
2. Find software engineering jobs
3. Apply to one job
4. Show you the result

You should see:
```
✅ Application submitted successfully!
```

## 📊 Batch Application (5 minutes)

Once the single job test works, try batch processing:

```
Apply to remote software engineering jobs on 104.com.tw
Search in Taipei area
Process 2 pages
Use 3-5 second delays between applications
```

Expected output:
```
======================================================================
🚀 104.com.tw Auto-Apply Automation
   Start Page: 1
   Max Pages: 2
   Cover Letter: 自訂推薦信1
======================================================================

📄 [Page 1]
   Found 20 jobs to process

   [1/20]
🔍 Processing: Backend Developer
   ✅ SUCCESS: Application submitted
   ⏱️  Waiting 3.2s before next job...

...

📊 Final Summary
   Total Processed: 40
   ✅ Successfully Applied: 32
   ⚠️  Skipped: 5
   ❌ Failed: 3
======================================================================
```

## 🎓 Common Use Cases

### Use Case 1: Daily Job Search
```
Morning routine: Apply to 10 new software jobs on 104
Process first 2 pages with standard delays
```

### Use Case 2: Specific Role
```
Apply to "Senior Backend Engineer" positions
Remote work only
Process 3 pages
Use my cover letter: Backend專用推薦信
```

### Use Case 3: Multiple Sessions
```
Session 1: "Apply to frontend jobs, 2 pages"
Session 2: "Apply to backend jobs, 2 pages"
Session 3: "Apply to full-stack jobs, 2 pages"
```

## ⚙️ Configuration Quick Reference

| Setting | Default | When to Change |
|---------|---------|----------------|
| `startPage` | 1 | Resume from specific page |
| `maxPages` | 5 | Limit job applications |
| `delayMin` | 2000ms | Seeing errors? Increase to 4000-5000ms |
| `delayMax` | 4000ms | Want slower pace? Increase to 8000-10000ms |
| `coverLetter` | '自訂推薦信1' | Using different cover letter |

## 🔧 Troubleshooting

### Problem: Skill not found
**Solution:**
```bash
# Verify installation
ls ~/.claude/skills/104-job-auto-apply/

# Should show: SKILL.md

# If empty, run install script again
cd 104Skill
./install.sh
```

### Problem: Not logged in to 104
**Solution:**
1. Open browser
2. Go to https://www.104.com.tw
3. Log in with your account
4. Keep browser open
5. Try automation again

### Problem: Cover letter not found
**Solution:**
1. Log in to 104.com.tw
2. Go to your profile settings
3. Find "推薦信" (cover letters) section
4. Note the EXACT name of your cover letter
5. Tell Claude: "Use cover letter: [exact name]"

### Problem: Too many failures
**Solution:**
```
Claude, I'm getting too many failures.
Let's slow down:
- Use 5-8 second delays
- Process only 1 page
- Show me what's happening
```

## 📝 Best Practices

### Daily Limits
- **Maximum applications per day**: 20-30 jobs
- **Recommended sessions**: 2-3 times per day
- **Break between sessions**: At least 2-3 hours

### Quality Over Quantity
- Only apply to genuinely suitable positions
- Review job requirements before batch applying
- Customize cover letters for different job types
- Follow up on applications you're excited about

### Safety First
- Start with 1-2 test applications
- Monitor the first page of batch processing
- Increase delays if seeing errors
- Don't spam applications

## 🎉 Success Checklist

After successful automation, you should:

- [ ] See confirmation in Claude Code console
- [ ] Verify applications in your 104.com.tw account
- [ ] Check email for application confirmations
- [ ] Track applied positions in a spreadsheet
- [ ] Set reminders to follow up

## 📞 Getting Help

### Check Documentation
1. **SKILL.md** - Complete implementation guide
2. **USAGE_EXAMPLES.md** - More detailed examples
3. **README.md** - Overview and installation
4. **CHANGELOG.md** - Version history

### Ask Claude
```
Claude, I need help with the 104 automation skill.
[Describe your issue]
```

### Common Questions

**Q: Can I use different cover letters for different jobs?**
A: Yes! Specify the cover letter name for each session:
```
Use cover letter: Frontend推薦信
```

**Q: How do I know which jobs were applied to?**
A: Check the console output for the list, or log in to 104.com.tw and view your application history.

**Q: Can I pause and resume later?**
A: Yes! Note which page you stopped at, then:
```
Continue from page 5, process 3 more pages
```

**Q: What if I want to apply to different cities?**
A: Specify in your search:
```
Apply to jobs in Taichung, process 2 pages
```

## 🎯 Next Steps

1. **Master the basics**: Practice with single jobs and small batches
2. **Optimize your approach**: Find the right delay settings and page limits
3. **Track results**: Keep a spreadsheet of applications and responses
4. **Refine strategy**: Adjust based on response rates
5. **Stay organized**: Follow up on interesting opportunities

---

## Ready to Start?

Run this command to begin:
```bash
cd 104Skill
./install.sh
```

Then in Claude Code:
```
/104-job-auto-apply
```

Good luck with your job search! 🚀

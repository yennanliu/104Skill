# Installation Guide - 104 Auto-Apply

Complete installation guide for all methods of installing the 104 job automation skill.

## Method 1: Claude Code Marketplace (Recommended)

The easiest way to install. Works directly in Claude Code CLI.

**Prerequisites**: The repository must be pushed to GitHub with the `.claude-plugin/` directory.

### Step 1: Start Claude Code

```bash
claude
```

### Step 2: Add Marketplace

```bash
/plugin marketplace add yennanliu/104Skill
```

This adds the GitHub repository to your Claude Code marketplace.

**Note**: If you get an error about `marketplace.json` not found, ensure the latest version is pushed to GitHub.

### Step 3: Install the Skill

```bash
/plugin install 104-job-auto-apply
```

### Step 4: Verify Installation

```bash
/plugin list
```

You should see `104-job-auto-apply` in the list.

### Step 5: Use the Skill

```bash
/104-job-auto-apply
```

Or simply ask Claude:
```
Help me apply to jobs on 104.com.tw
```

---

## Method 2: Quick Install Script

Use the provided installation script.

### Step 1: Clone Repository

```bash
git clone https://github.com/yennanliu/104Skill.git
cd 104Skill
```

### Step 2: Run Installer

```bash
./install.sh
```

The script will:
- Create `~/.claude/skills/104-job-auto-apply/` directory
- Copy `SKILL.md` to the skills directory
- Copy documentation files
- Display success message

### Step 3: Verify Installation

```bash
ls ~/.claude/skills/104-job-auto-apply/
```

Should show:
- SKILL.md
- README.md
- USAGE_EXAMPLES.md

### Step 4: Use the Skill

In Claude Code:
```bash
/104-job-auto-apply
```

---

## Method 3: Local Development

For developers who want to modify the skill or test local changes.

### Step 1: Clone Repository

```bash
git clone https://github.com/yennanliu/104Skill.git
cd 104Skill
```

### Step 2: Start Claude Code

```bash
claude
```

### Step 3: Add Local Marketplace

Replace `/path/to` with your actual path:

```bash
/plugin marketplace add /Users/yourusername/104Skill
```

Or use the full path where you cloned it.

### Step 4: Install from Local

```bash
/plugin install 104-job-auto-apply@local
```

### Step 5: Make Changes

Edit `SKILL.md` in your local directory. Changes will be reflected immediately (may need to restart Claude Code).

### Step 6: Test Changes

```bash
/104-job-auto-apply
```

---

## Method 4: Project-Specific Installation

Install for a specific project only (not globally).

### Step 1: Clone Repository

```bash
git clone https://github.com/yennanliu/104Skill.git
```

### Step 2: Create CLAUDE.md in Your Project

In your project root:

```bash
touch CLAUDE.md
```

### Step 3: Add Skill Reference

Edit `CLAUDE.md`:

```markdown
# Project Skills

Load the 104 job automation skill:
@skill /path/to/104Skill/SKILL.md
```

Replace `/path/to/104Skill` with the actual path.

### Step 4: Start Claude Code in Project

```bash
cd your-project
claude
```

The skill will be automatically loaded for this project.

---

## Verification

### Check Installed Skills

```bash
claude

/plugin list
```

Should show:
```
104-job-auto-apply - Automate job applications on 104.com.tw
```

### Test the Skill

```bash
/104-job-auto-apply
```

Claude should respond with guidance on using the skill.

---

## Troubleshooting

### Issue: Skill Not Found

**Solution 1: Check marketplace**
```bash
/plugin marketplace list
```

Ensure `yennanliu/104Skill` is in the list.

**Solution 2: Re-add marketplace**
```bash
/plugin marketplace remove yennanliu/104Skill
/plugin marketplace add yennanliu/104Skill
/plugin install 104-job-auto-apply
```

### Issue: Permission Denied

**Solution: Check file permissions**
```bash
ls -la ~/.claude/skills/104-job-auto-apply/
```

Fix permissions:
```bash
chmod -R 755 ~/.claude/skills/104-job-auto-apply/
```

### Issue: Local Install Not Working

**Solution 1: Use absolute path**
```bash
/plugin marketplace add /Users/yourusername/path/to/104Skill
```

**Solution 2: Check directory structure**
Ensure `SKILL.md` exists in the root of your local directory:
```bash
ls 104Skill/SKILL.md
```

### Issue: Skill Not Updating

**Solution: Reinstall**
```bash
/plugin uninstall 104-job-auto-apply
/plugin install 104-job-auto-apply
```

For local development:
```bash
# Restart Claude Code after making changes
exit
claude
```

---

## Updating the Skill

### Marketplace Installation

```bash
/plugin update 104-job-auto-apply
```

Or reinstall:
```bash
/plugin uninstall 104-job-auto-apply
/plugin install 104-job-auto-apply
```

### Script Installation

```bash
cd 104Skill
git pull origin main
./install.sh
```

### Local Development

```bash
cd 104Skill
git pull origin main
# Changes are automatically available (restart Claude Code if needed)
```

---

## Uninstallation

### Remove from Marketplace

```bash
/plugin uninstall 104-job-auto-apply
```

### Remove Script Installation

```bash
rm -rf ~/.claude/skills/104-job-auto-apply/
```

### Remove Local Marketplace

```bash
/plugin marketplace remove yennanliu/104Skill
```

---

## Configuration

After installation, the skill supports these configuration options:

| Option | Default | Description |
|--------|---------|-------------|
| `startPage` | 1 | Starting page number |
| `maxPages` | 5 | Maximum pages to process |
| `delayMin` | 2000 | Minimum delay (ms) |
| `delayMax` | 4000 | Maximum delay (ms) |
| `coverLetter` | User provided | Cover letter name |

Configure when invoking the skill:
```
Apply to jobs starting from page 2, process 3 pages, use 3-5 second delays
```

---

## Next Steps

After installation:

1. ✅ Read [QUICKSTART.md](QUICKSTART.md) for first-time setup
2. ✅ Review [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) for practical scenarios
3. ✅ Check [SKILL.md](SKILL.md) for complete documentation
4. ✅ Test with a single job application first
5. ✅ Configure your preferences
6. ✅ Start automating!

---

## Support

- **Issues**: https://github.com/yennanliu/104Skill/issues
- **Documentation**: https://yennanliu.github.io/104Skill/
- **Repository**: https://github.com/yennanliu/104Skill

---

**Happy job hunting!** 🚀

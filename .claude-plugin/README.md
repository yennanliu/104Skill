# 104 Auto-Apply Claude Code Plugin

This directory contains the Claude Code plugin configuration files.

## Files

- `marketplace.json` - Marketplace metadata for plugin discovery
- `plugin.json` - Plugin configuration and metadata

## Installation

### Via Marketplace

```bash
claude

# Add marketplace
/plugin marketplace add yennanliu/104Skill

# Install plugin
/plugin install 104-job-auto-apply
```

### Local Development

```bash
# Add local marketplace
/plugin marketplace add /Users/yourusername/104Skill

# Install from local
/plugin install 104-job-auto-apply@local
```

## Usage

After installation, invoke the skill:

```bash
/104-job-auto-apply
```

Or ask Claude naturally:
```
Help me apply to jobs on 104.com.tw
```

## Documentation

- [Quick Start](../QUICKSTART.md)
- [Full Documentation](../SKILL.md)
- [Installation Guide](../INSTALLATION.md)
- [Usage Examples](../USAGE_EXAMPLES.md)

## Support

- Issues: https://github.com/yennanliu/104Skill/issues
- Website: https://yennanliu.github.io/104Skill/

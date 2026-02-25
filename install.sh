#!/bin/bash

# Installation script for 104 Job Auto-Apply Claude Code Skill

set -e  # Exit on error

echo "==========================================="
echo "104 Job Auto-Apply Skill Installer"
echo "==========================================="
echo ""

# Define paths
SKILL_NAME="104-job-auto-apply"
SKILLS_DIR="$HOME/.claude/skills/$SKILL_NAME"
CURRENT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if SKILL.md exists in current directory
if [ ! -f "$CURRENT_DIR/SKILL.md" ]; then
    echo "Error: SKILL.md not found in current directory"
    echo "Please run this script from the 104Skill directory"
    exit 1
fi

echo "Current directory: $CURRENT_DIR"
echo "Target directory: $SKILLS_DIR"
echo ""

# -----------------------------------------------
# Auto-install Playwright MCP (global) if missing
# -----------------------------------------------
echo "==========================================="
echo "Checking Playwright MCP..."
echo "==========================================="

if ! command -v node &>/dev/null; then
    echo "Warning: Node.js not found."
    echo "  Playwright MCP requires Node.js. Install it from: https://nodejs.org"
    echo "  Skipping Playwright MCP installation."
elif ! command -v npm &>/dev/null; then
    echo "Warning: npm not found. Skipping Playwright MCP installation."
else
    if npm list -g @playwright/mcp --depth=0 2>/dev/null | grep -q "@playwright/mcp"; then
        echo "Playwright MCP is already installed globally."
    else
        echo "Playwright MCP not found. Installing globally..."
        if npm install -g @playwright/mcp; then
            echo "Playwright MCP installed successfully."
        else
            echo "Warning: Failed to install Playwright MCP automatically."
            echo "  If you need sudo, run: sudo npm install -g @playwright/mcp"
            echo "  Or configure an alternative MCP browser provider."
        fi
    fi
fi
echo ""

# Create skills directory if it doesn't exist
echo "Creating skills directory..."
mkdir -p "$SKILLS_DIR"

# Copy SKILL.md to skills directory
echo "📄 Installing SKILL.md..."
cp "$CURRENT_DIR/SKILL.md" "$SKILLS_DIR/"

# Optional: Copy other documentation
if [ -f "$CURRENT_DIR/README.md" ]; then
    echo "📄 Installing README.md..."
    cp "$CURRENT_DIR/README.md" "$SKILLS_DIR/"
fi

if [ -f "$CURRENT_DIR/USAGE_EXAMPLES.md" ]; then
    echo "📄 Installing USAGE_EXAMPLES.md..."
    cp "$CURRENT_DIR/USAGE_EXAMPLES.md" "$SKILLS_DIR/"
fi

echo ""
echo "==========================================="
echo "✅ Installation Complete!"
echo "==========================================="
echo ""
echo "Skill installed to: $SKILLS_DIR"
echo ""
echo "📖 How to use:"
echo "   1. Start Claude Code in your terminal"
echo "   2. Type: /104-job-auto-apply"
echo "   3. Or ask: 'Help me apply to jobs on 104.com.tw'"
echo ""
echo "📚 Documentation:"
echo "   - Skill guide: $SKILLS_DIR/SKILL.md"
echo "   - Usage examples: $SKILLS_DIR/USAGE_EXAMPLES.md"
echo "   - README: $SKILLS_DIR/README.md"
echo ""
echo "⚠️  Prerequisites:"
echo "   - 104.com.tw account (logged in)"
echo "   - Resume uploaded"
echo "   - Cover letter created (e.g., '自訂推薦信1')"
echo "   - Playwright MCP tools configured"
echo ""
echo "🎉 Ready to use! Start applying to jobs on 104.com.tw"
echo "==========================================="

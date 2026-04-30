#!/bin/bash

# Installation script for 104 Job Auto-Apply Skill
# Installs for: Claude Code and Gemini CLI

set -e  # Exit on error

echo "==========================================="
echo "104 Job Auto-Apply Skill Installer"
echo "==========================================="
echo ""

# Define paths
SKILL_NAME="104-job-auto-apply"
SKILLS_DIR="$HOME/.claude/skills/$SKILL_NAME"
GEMINI_SKILLS_DIR="$HOME/.gemini/skills/$SKILL_NAME"
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

# -----------------------------------------------
# Install for Claude Code
# -----------------------------------------------
echo "==========================================="
echo "Installing for Claude Code..."
echo "==========================================="
mkdir -p "$SKILLS_DIR"

echo "📄 Installing SKILL.md..."
cp "$CURRENT_DIR/SKILL.md" "$SKILLS_DIR/"

if [ -f "$CURRENT_DIR/README.md" ]; then
    echo "📄 Installing README.md..."
    cp "$CURRENT_DIR/README.md" "$SKILLS_DIR/"
fi

if [ -f "$CURRENT_DIR/USAGE_EXAMPLES.md" ]; then
    echo "📄 Installing USAGE_EXAMPLES.md..."
    cp "$CURRENT_DIR/USAGE_EXAMPLES.md" "$SKILLS_DIR/"
fi

echo "✅ Claude Code: installed to $SKILLS_DIR"
echo ""

# -----------------------------------------------
# Install for Gemini CLI
# -----------------------------------------------
echo "==========================================="
echo "Installing for Gemini CLI..."
echo "==========================================="
mkdir -p "$GEMINI_SKILLS_DIR"

echo "📄 Installing SKILL.md..."
cp "$CURRENT_DIR/SKILL.md" "$GEMINI_SKILLS_DIR/"

if [ -f "$CURRENT_DIR/README.md" ]; then
    echo "📄 Installing README.md..."
    cp "$CURRENT_DIR/README.md" "$GEMINI_SKILLS_DIR/"
fi

# Copy JS scripts so Gemini CLI can reference them directly
SKILL_JS_DIR="$CURRENT_DIR/skills/104-job-auto-apply"
if [ -d "$SKILL_JS_DIR" ]; then
    echo "📄 Installing automation scripts..."
    cp "$SKILL_JS_DIR/autoApply104Jobs.js"  "$GEMINI_SKILLS_DIR/"
    cp "$SKILL_JS_DIR/applySingleJob.js"    "$GEMINI_SKILLS_DIR/" 2>/dev/null || true
fi

echo "✅ Gemini CLI: installed to $GEMINI_SKILLS_DIR"
echo ""

echo "==========================================="
echo "✅ Installation Complete!"
echo "==========================================="
echo ""
echo "📖 Claude Code:"
echo "   1. Start Claude Code in your terminal"
echo "   2. Type: /104-job-auto-apply"
echo "   3. Or ask: 'Help me apply to jobs on 104.com.tw'"
echo ""
echo "📖 Gemini CLI:"
echo "   1. Start Gemini CLI"
echo "   2. Ask: 'Read ~/.gemini/skills/104-job-auto-apply/SKILL.md and help me apply to jobs'"
echo "   3. Or: gemini --skill 104-job-auto-apply (if supported by your version)"
echo ""
echo "⚠️  Prerequisites:"
echo "   - 104.com.tw account (logged in)"
echo "   - Resume uploaded"
echo "   - Cover letter created (e.g., '自訂推薦信1')"
echo "   - Playwright MCP tools configured"
echo ""
echo "🎉 Ready to use! Start applying to jobs on 104.com.tw"
echo "==========================================="

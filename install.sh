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
    echo "❌ Error: SKILL.md not found in current directory"
    echo "Please run this script from the 104Skill directory"
    exit 1
fi

echo "📁 Current directory: $CURRENT_DIR"
echo "📁 Target directory: $SKILLS_DIR"
echo ""

# Create skills directory if it doesn't exist
echo "📂 Creating skills directory..."
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

#!/bin/bash
# Git Configuration Script for DataRoom Enterprise
# This script configures Git settings for optimal cross-platform development

echo "🔧 Configuring Git for DataRoom Enterprise..."

# Configure line endings for cross-platform compatibility
echo "📝 Setting up line ending configuration..."
git config core.autocrlf false
git config core.eol lf
git config core.safecrlf true

# Configure user settings (replace with your information)
echo "👤 Configuring user settings..."
# Uncomment and modify these lines with your information:
# git config user.name "Your Name"
# git config user.email "your.email@example.com"

# Configure Git behavior for better collaboration
echo "🤝 Setting up collaboration settings..."
git config pull.rebase false
git config init.defaultBranch main
git config core.ignorecase false

# Configure commit template and hooks
echo "📋 Setting up commit standards..."
git config commit.template .gitmessage

# Configure merge and diff tools
echo "🔀 Setting up merge and diff configuration..."
git config merge.tool vscode
git config mergetool.vscode.cmd 'code --wait $MERGED'
git config diff.tool vscode
git config difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'

# Configure push behavior
echo "📤 Setting up push configuration..."
git config push.default simple
git config push.followTags true

# Configure branch and status settings
echo "🌿 Setting up branch configuration..."
git config branch.autosetupmerge always
git config branch.autosetuprebase always
git config status.showUntrackedFiles all

# Configure performance settings
echo "⚡ Optimizing Git performance..."
git config core.preloadindex true
git config core.fscache true
git config gc.auto 256

# Configure security settings
echo "🔐 Setting up security configurations..."
git config transfer.fsckobjects true
git config fetch.fsckobjects true
git config receive.fsckObjects true

echo "✅ Git configuration completed successfully!"
echo ""
echo "📋 Summary of applied configurations:"
echo "  • Line endings: LF (Unix-style) for cross-platform compatibility"
echo "  • Default branch: main"
echo "  • Merge strategy: merge commits (not rebase)"
echo "  • Push behavior: simple (current branch only)"
echo "  • Performance optimizations enabled"
echo "  • Security settings configured"
echo ""
echo "🎯 Next steps:"
echo "  1. Configure your user name: git config user.name 'Your Name'"
echo "  2. Configure your email: git config user.email 'your.email@example.com'"
echo "  3. Run: git add . && git commit -m 'feat: initial production-ready release'"
echo "  4. Add remote: git remote add origin https://github.com/username/repo.git"
echo "  5. Push to GitHub: git push -u origin main"
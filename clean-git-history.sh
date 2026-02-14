#!/bin/bash

# Script to clean sensitive data from Git history
# USE WITH CAUTION - This rewrites Git history!

echo "🚨 GIT HISTORY CLEANUP SCRIPT 🚨"
echo "================================"
echo ""
echo "This script will remove sensitive files from Git history."
echo "This is DESTRUCTIVE and will rewrite history!"
echo ""
echo "Files to remove:"
echo "  - RENDER_DEPLOYMENT_GUIDE.md"
echo "  - RENDER_QUICK_FIX.md"
echo "  - PRE_DEPLOYMENT_CHECKLIST.md"
echo "  - SECURITY_AUDIT_SUMMARY.txt"
echo "  - Any other .md files with credentials"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Step 1: Creating backup..."
git branch backup-before-cleanup

echo ""
echo "Step 2: Removing sensitive files from history..."

# Remove specific files from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch \
    RENDER_DEPLOYMENT_GUIDE.md \
    RENDER_QUICK_FIX.md \
    PRE_DEPLOYMENT_CHECKLIST.md \
    SECURITY_AUDIT_SUMMARY.txt \
    CLOUDINARY_*.md" \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "Step 3: Cleaning up..."
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Git history cleaned!"
echo ""
echo "Next steps:"
echo "1. Review changes: git log --oneline"
echo "2. Force push: git push --force origin master"
echo "3. Notify team members to re-clone repository"
echo ""
echo "⚠️  WARNING: All team members must re-clone the repository!"
echo "    Old clones will have the compromised history."
echo ""

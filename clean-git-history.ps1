# PowerShell Script to clean sensitive data from Git history
# USE WITH CAUTION - This rewrites Git history!

Write-Host "🚨 GIT HISTORY CLEANUP SCRIPT 🚨" -ForegroundColor Red
Write-Host "================================" -ForegroundColor Red
Write-Host ""
Write-Host "This script will remove sensitive files from Git history."
Write-Host "This is DESTRUCTIVE and will rewrite history!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Files to remove:"
Write-Host "  - RENDER_DEPLOYMENT_GUIDE.md"
Write-Host "  - RENDER_QUICK_FIX.md"
Write-Host "  - PRE_DEPLOYMENT_CHECKLIST.md"
Write-Host "  - SECURITY_AUDIT_SUMMARY.txt"
Write-Host ""

$confirm = Read-Host "Are you sure you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 1: Creating backup branch..." -ForegroundColor Cyan
git branch backup-before-cleanup

Write-Host ""
Write-Host "Step 2: Installing git-filter-repo (if needed)..." -ForegroundColor Cyan
Write-Host "You need git-filter-repo installed."
Write-Host "Install with: pip install git-filter-repo"
Write-Host ""

$hasFilterRepo = Read-Host "Do you have git-filter-repo installed? (yes/no)"

if ($hasFilterRepo -ne "yes") {
    Write-Host ""
    Write-Host "Please install git-filter-repo first:" -ForegroundColor Yellow
    Write-Host "  1. Install Python: https://www.python.org/downloads/"
    Write-Host "  2. Run: pip install git-filter-repo"
    Write-Host "  3. Run this script again"
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Step 3: Removing sensitive files from history..." -ForegroundColor Cyan

# Create paths file for git-filter-repo
$pathsToRemove = @(
    "RENDER_DEPLOYMENT_GUIDE.md",
    "RENDER_QUICK_FIX.md",
    "PRE_DEPLOYMENT_CHECKLIST.md",
    "SECURITY_AUDIT_SUMMARY.txt",
    "CLOUDINARY_SETUP_COMPLETE.md",
    "CLOUDINARY_QUICK_START.md",
    "CLOUDINARY_COMPLETE_SUMMARY.md"
)

$pathsToRemove | Out-File -FilePath "paths-to-remove.txt" -Encoding UTF8

# Run git-filter-repo
git filter-repo --invert-paths --paths-from-file paths-to-remove.txt --force

# Clean up
Remove-Item "paths-to-remove.txt"

Write-Host ""
Write-Host "✅ Git history cleaned!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review changes: git log --oneline"
Write-Host "2. Add remote back: git remote add origin <your-repo-url>"
Write-Host "3. Force push: git push --force origin master"
Write-Host "4. Notify team members to re-clone repository"
Write-Host ""
Write-Host "⚠️  WARNING: All team members must re-clone the repository!" -ForegroundColor Yellow
Write-Host "    Old clones will have the compromised history."
Write-Host ""

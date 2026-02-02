$files = git ls-files --others --exclude-standard
$count = 0
foreach ($file in $files) {
    git add "$file"
    git commit -m "Add $file"
    Write-Output "Committed $file"
    $count++
}
Write-Output "Total files committed: $count"

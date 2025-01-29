# combine-files.ps1
# ------------------

# Where we will store the combined output
$masterFile = "master.txt"

# Remove existing master file if it exists
if (Test-Path $masterFile) {
    Remove-Item $masterFile
}

# Get *all* files recursively, then filter by extension
$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $_.Extension -in ('.js', '.jsx', '.css')
}

# Group them by their directory (folder)
$filesByDir = $files | Group-Object DirectoryName

foreach ($group in $filesByDir) {
    # Get just the leaf folder name
    $folderName = Split-Path $group.Name -Leaf

    # Write "Name of folderX:"
    Add-Content $masterFile "$($folderName):"

    # Loop over each file in this folder group
    foreach ($file in $group.Group) {
        Add-Content $masterFile ($file.Name + ":")
        
        # Write the file contents surrounded by quotes
        Add-Content $masterFile '"'
        Add-Content $masterFile (Get-Content $file.FullName)
        Add-Content $masterFile '"'
        
        # Blank line for readability
        Add-Content $masterFile ""
    }

    # Extra blank line after each folder block
    Add-Content $masterFile ""
}

Write-Host "Combined file created: $masterFile"

Add-Type -AssemblyName System.Drawing
$imgPath = "C:\Users\ajom7\.gemini\antigravity\brain\d4755013-1434-4938-8116-d1b6a02bbf20\afr_earning_banner_1790528029996.jpg"
$img = [System.Drawing.Image]::FromFile($imgPath)
Write-Output "Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()

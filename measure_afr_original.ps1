Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ajom7\.gemini\antigravity\brain\d4755013-1434-4938-8116-d1b6a02bbf20\afr_earning_banner_1790528029996.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Source image: $($bmp.Width) x $($bmp.Height)"

# In this image, the content is inside the horizontal banner banner.
# Let's find minX, maxX, minY, maxY of the content elements:
# We know the banner sits roughly between Y=180 and Y=620
$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

# Check pixel colors
for ($y = 190; $y -lt 620; $y += 3) {
    for ($x = 40; $x -lt $bmp.Width - 40; $x += 3) {
        $c = $bmp.GetPixel($x, $y)
        # Anything not pure white / very light gray background of the capsule (R < 240 or G < 240 or B < 240)
        # Note: the capsule background is around R=215, G=215, B=215
        # The content has colored/dark pixels
        if ($c.R -lt 190 -or $c.G -lt 190 -or $c.B -lt 190) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Content bounds in afr_earning_banner_1790528029996.jpg:"
Write-Host "X: $minX to $maxX (Width = $($maxX - $minX))"
Write-Host "Y: $minY to $maxY (Height = $($maxY - $minY))"

$bmp.Dispose()

Add-Type -AssemblyName System.Drawing
$imgPath = "C:\Users\ajom7\.gemini\antigravity\brain\d4755013-1434-4938-8116-d1b6a02bbf20\afr_earning_banner_1790528029996.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

Write-Host "Image size: $($bmp.Width) x $($bmp.Height)"
# Sample some pixels along vertical center line X = 200
for ($y = 0; $y -lt $bmp.Height; $y += 40) {
    $c = $bmp.GetPixel(200, $y)
    Write-Host "Y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$bmp.Dispose()

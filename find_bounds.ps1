Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\ajom7\.gemini\antigravity\brain\d4755013-1434-4938-8116-d1b6a02bbf20\afr_yt_banner_safe_area_1790528912304.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)

# Content area is roughly between Y=250 and Y=550
# Let's find minX, maxX, minY, maxY where pixels deviate from pure white
$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 230; $y -lt 550; $y += 5) {
    for ($x = 50; $x -lt $bmp.Width - 50; $x += 5) {
        $c = $bmp.GetPixel($x, $y)
        # Check if not background white/light-gray (R < 240 or G < 240 or B < 240)
        if ($c.R -lt 235 -or $c.G -lt 235 -or $c.B -lt 235) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Content bounds in 1376x768: X=$minX to $maxX (Width=$($maxX - $minX)), Y=$minY to $maxY (Height=$($maxY - $minY))"
$bmp.Dispose()

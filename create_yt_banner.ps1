Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\ajom7\.gemini\antigravity\brain\d4755013-1434-4938-8116-d1b6a02bbf20\afr_earning_banner_1790528029996.jpg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Let's crop the banner capsule:
# Looking at the image, the capsule starts around X=50, Y=195 and ends around X=1330, Y=600
# Height = 405, Width = 1280
$cropRect = [System.Drawing.Rectangle]::new(35, 190, 1310, 420)
$cropped = $src.Clone($cropRect, $src.PixelFormat)

# Now create the exact YouTube canvas: 2560 x 1440
$canvas = [System.Drawing.Bitmap]::new(2560, 1440, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Fill the entire canvas with the studio background color (very light gray / off-white #F5F5F7)
$bgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(245, 245, 247))
$g.FillRectangle($bgBrush, 0, 0, 2560, 1440)

# Also let's draw subtle studio wall columns/lighting on top and bottom so it looks like a real 3D room
# Let's see what the top 190px of $src looks like: we can tile or stretch the top and bottom backgrounds!
$topBgRect = [System.Drawing.Rectangle]::new(0, 0, $src.Width, 190)
$topBg = $src.Clone($topBgRect, $src.PixelFormat)
# Draw top background scaled to full width and top 508px
$g.DrawImage($topBg, 0, 0, 2560, 510)

$bottomBgRect = [System.Drawing.Rectangle]::new(0, 610, $src.Width, 158)
$bottomBg = $src.Clone($bottomBgRect, $src.PixelFormat)
# Draw bottom background scaled to full width and bottom 510px
$g.DrawImage($bottomBg, 0, 930, 2560, 510)

# Now target size for the cropped banner inside the Safe Area:
# Safe area: 1546 x 423 centered at X=507, Y=508
# Let's fit the cropped banner (1310 x 420) to width ~1480, height ~415
$targetW = 1480
$targetH = [int](($cropped.Height / $cropped.Width) * $targetW)
if ($targetH -gt 415) {
    $targetH = 415
    $targetW = [int](($cropped.Width / $cropped.Height) * $targetH)
}

$destX = [int](507 + (1546 - $targetW) / 2)
$destY = [int](508 + (423 - $targetH) / 2)

Write-Host "Placing cropped banner at X=$destX, Y=$destY, W=$targetW, H=$targetH"
# Extend the horizontal desktop sides (from 0 to destX and from destX+targetW to 2560)
# We can sample the left and right edges of the capsule
$leftEdge = [System.Drawing.Rectangle]::new(35, 190, 50, 420)
$leftEdgeImg = $src.Clone($leftEdge, $src.PixelFormat)
$g.DrawImage($leftEdgeImg, 0, $destY, $destX, $targetH)

$rightEdge = [System.Drawing.Rectangle]::new(1295, 190, 50, 420)
$rightEdgeImg = $src.Clone($rightEdge, $src.PixelFormat)
$g.DrawImage($rightEdgeImg, ($destX + $targetW), $destY, (2560 - ($destX + $targetW)), $targetH)

# Draw the main banner
$g.DrawImage($cropped, $destX, $destY, $targetW, $targetH)

$outPath1 = "C:\Users\ajom7\Downloads\AFR_Earning_YouTube_Banner_2560x1440.png"
$canvas.Save($outPath1, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved 2560x1440 banner to $outPath1"

# Also save JPG version
$outPath2 = "C:\Users\ajom7\Downloads\AFR_Earning_YouTube_Banner_2560x1440.jpg"
$canvas.Save($outPath2, [System.Drawing.Imaging.ImageFormat]::Jpeg)
Write-Host "Saved JPG banner to $outPath2"

$g.Dispose()
$canvas.Dispose()
$cropped.Dispose()
$src.Dispose()

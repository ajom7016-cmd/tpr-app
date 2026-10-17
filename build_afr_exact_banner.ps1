Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ajom7\.gemini\antigravity\brain\d4755013-1434-4938-8116-d1b6a02bbf20\afr_earning_banner_1790528029996.jpg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Content rectangle in source:
# X: 40 to 1333 (width 1293), Y: 200 to 620 (height 420)
$cropRect = [System.Drawing.Rectangle]::new(40, 200, 1293, 420)
$content = $src.Clone($cropRect, $src.PixelFormat)

# Target YouTube canvas: 2560 x 1440
$destW = 2560
$destH = 1440
$canvas = [System.Drawing.Bitmap]::new($destW, $destH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Background color of the studio room: clean off-white
$bgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(246, 246, 248))
$g.FillRectangle($bgBrush, 0, 0, $destW, $destH)

# Take the top architecture from $src (Y=0 to 200) and draw across top 510px
$topRect = [System.Drawing.Rectangle]::new(0, 0, $src.Width, 200)
$topImg = $src.Clone($topRect, $src.PixelFormat)
$g.DrawImage($topImg, 0, 0, $destW, 510)

# Take the bottom floor from $src (Y=620 to 768) and draw across bottom 510px
$bottomRect = [System.Drawing.Rectangle]::new(0, 620, $src.Width, 148)
$bottomImg = $src.Clone($bottomRect, $src.PixelFormat)
$g.DrawImage($bottomImg, 0, 930, $destW, 510)

# Target size inside Safe Area (Safe Area: 1546 x 423, from X=507 to 2053, Y=508 to 931)
# With content height = 405, width = 405 * (1293/420) = 1247
$targetH = 405
$targetW = [int](($content.Width / $content.Height) * $targetH)

$destX = [int](507 + (1546 - $targetW) / 2)
$destY = [int](508 + (423 - $targetH) / 2)

Write-Host "Safe Area Content Position: X=$destX, Y=$destY, W=$targetW, H=$targetH"

# Paint the middle strip background (X=0 to 2560, Y=508 to 931) with the matching clean white
$midBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(246, 246, 248))
$g.FillRectangle($midBrush, 0, 508, $destW, 423)

# Draw the banner content perfectly centered in the Safe Area
$g.DrawImage($content, $destX, $destY, $targetW, $targetH)

# Save to Downloads folder
$downloadsDir = [System.IO.Path]::Combine($env:USERPROFILE, "Downloads")
$finalPng = [System.IO.Path]::Combine($downloadsDir, "AFR_Earning_YouTube_Banner_2560x1440.png")
$finalJpg = [System.IO.Path]::Combine($downloadsDir, "AFR_Earning_YouTube_Banner_2560x1440.jpg")

$canvas.Save($finalPng, [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Save($finalJpg, [System.Drawing.Imaging.ImageFormat]::Jpeg)

Write-Host "Successfully generated and saved to:"
Write-Host "PNG: $finalPng"
Write-Host "JPG: $finalJpg"

$content.Dispose()
$topImg.Dispose()
$bottomImg.Dispose()
$bgBrush.Dispose()
$midBrush.Dispose()
$g.Dispose()
$canvas.Dispose()
$src.Dispose()

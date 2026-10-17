Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ajom7\.gemini\antigravity\brain\d4755013-1434-4938-8116-d1b6a02bbf20\afr_yt_banner_safe_area_1790528912304.jpg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Step 1: Create 2560 x 1440 canvas
$destW = 2560
$destH = 1440
$canvas = [System.Drawing.Bitmap]::new($destW, $destH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Step 2: Draw the full background scaled to 2560 x 1440
$g.DrawImage($src, 0, 0, $destW, $destH)

# In the background scaled to 2560x1440, the middle band was stretched across 2560.
# Let's paint the central horizontal strip (Y=495 to 945) with the matching clean white/light studio color
# so the previous stretched text is cleanly covered!
$brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(254, 254, 254))
$g.FillRectangle($brush, 0, 490, $destW, 460)

# Step 3: Crop the exact content from $src
# Content bounds: X=45 to 1320 (width=1275), Y=225 to 555 (height=330)
$cropRect = [System.Drawing.Rectangle]::new(45, 220, 1275, 335)
$content = $src.Clone($cropRect, $src.PixelFormat)

# Step 4: Scale content to fit comfortably inside the 1546 x 423 Safe Area (X: 507 to 2053, Y: 508 to 931)
# With breathing room: Width = 1460, Height = 384
$targetW = 1460
$targetH = [int](($content.Height / $content.Width) * $targetW)

$destX = [int](507 + (1546 - $targetW) / 2)
$destY = [int](508 + (423 - $targetH) / 2)

Write-Host "Drawing content at: X=$destX, Y=$destY, W=$targetW, H=$targetH"
$g.DrawImage($content, $destX, $destY, $targetW, $targetH)

# Also let's save this image directly into the user's Downloads folder as requested!
$downloadsDir = [System.IO.Path]::Combine($env:USERPROFILE, "Downloads")
$finalPng = [System.IO.Path]::Combine($downloadsDir, "AFR_Earning_YouTube_Banner_2560x1440.png")
$finalJpg = [System.IO.Path]::Combine($downloadsDir, "AFR_Earning_YouTube_Banner_2560x1440.jpg")

$canvas.Save($finalPng, [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Save($finalJpg, [System.Drawing.Imaging.ImageFormat]::Jpeg)

Write-Host "SUCCESS! Saved to:"
Write-Host "PNG: $finalPng"
Write-Host "JPG: $finalJpg"

$content.Dispose()
$brush.Dispose()
$g.Dispose()
$canvas.Dispose()
$src.Dispose()

Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\ajom7\.gemini\antigravity\brain\d4755013-1434-4938-8116-d1b6a02bbf20\afr_yt_banner_safe_area_1790528912304.jpg"
$src = [System.Drawing.Bitmap]::FromFile($inputPath)

Write-Host "Source: $($src.Width) x $($src.Height)"

# Create high-res 2560 x 1440 canvas
$destW = 2560
$destH = 1440
$canvas = [System.Drawing.Bitmap]::new($destW, $destH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Draw the image scaled to 2560 x 1440
$g.DrawImage($src, 0, 0, $destW, $destH)

# Also let's inspect where the safe area is:
# YouTube Safe Area:
# X: 507 to 2053 (Width = 1546)
# Y: 508 to 931 (Height = 423)
Write-Host "Safe Area: X=507 to 2053, Y=508 to 931"

# In the 1376x768 image:
# The white horizontal strip is from Y = 260 to 525 (height = 265 in 768px, which scales to 265 * 1440/768 = 496px)
# Let's check if the text and phones fit inside X: 507 to 2053:
# In 1376px, X=507 corresponds to 507 * 1376 / 2560 = 272px
# In 1376px, X=2053 corresponds to 2053 * 1376 / 2560 = 1103px
# Let's check where 'AFR' starts in the 1376px source:
# It starts around X=130!
# If AFR starts at X=130 in 1376px, in 2560px that is X = 130 * 2560 / 1376 = 241px!
# 241px is to the left of 507px, which means on mobile (507px), 'AFR' would get cut off!
Write-Host "Checking if horizontal squeeze/fit into 1546px is needed..."

$canvas.Dispose()
$g.Dispose()
$src.Dispose()

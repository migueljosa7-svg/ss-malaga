# Genera app/favicon.ico (PNG-compressed ICO) y app/apple-icon.png
# para la Metadata API de Next.js (App Router).
Add-Type -AssemblyName System.Drawing

function New-CofradeBitmap([int]$size) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.PixelOffsetMode = 'HighQuality'
  $g.Clear([System.Drawing.Color]::Transparent)

  # Lienzo de diseño a 512 y reescalado (antialiasing de alta calidad)
  $src = New-Object System.Drawing.Bitmap(512, 512)
  $sg = [System.Drawing.Graphics]::FromImage($src)
  $sg.SmoothingMode = 'AntiAlias'
  $sg.PixelOffsetMode = 'HighQuality'
  $sg.Clear([System.Drawing.Color]::Transparent)

  # Fondo púrpura nazareno con esquinas redondeadas
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $rad = 110
  $r = New-Object System.Drawing.RectangleF(0, 0, 512, 512)
  $path.AddArc($r.X, $r.Y, 2*$rad, 2*$rad, 180, 90)
  $path.AddArc($r.Right-2*$rad, $r.Y, 2*$rad, 2*$rad, 270, 90)
  $path.AddArc($r.Right-2*$rad, $r.Bottom-2*$rad, 2*$rad, 2*$rad, 0, 90)
  $path.AddArc($r.X, $r.Bottom-2*$rad, 2*$rad, 2*$rad, 90, 90)
  $path.CloseFigure()
  $purple = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 74, 21, 75))
  $sg.FillPath($purple, $path)

  # Halo interior
  $haloPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(64, 212, 175, 55), 8)
  $sg.DrawEllipse($haloPen, 76, 76, 360, 360)

  # Cruz de guía dorada con remates circulares (estilo nazareno)
  $gold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 212, 175, 55))
  $sg.FillRectangle($gold, 224, 72, 64, 368)
  $sg.FillRectangle($gold, 72, 224, 368, 64)
  $sg.FillEllipse($gold, 214, 62, 84, 84)
  $sg.FillEllipse($gold, 214, 366, 84, 84)
  $sg.FillEllipse($gold, 62, 214, 84, 84)
  $sg.FillEllipse($gold, 366, 214, 84, 84)
  # Chatón central púrpura
  $sg.FillEllipse($purple, 226, 226, 60, 60)
  $sg.FillEllipse($gold, 240, 240, 32, 32)

  $sg.Dispose()
  $g.DrawImage($src, 0, 0, $size, $size)
  $g.Dispose()
  $src.Dispose()
  return $bmp
}

$root = Split-Path -Parent $PSScriptRoot
$appDir = Join-Path $root "app"
if (-not (Test-Path $appDir)) { New-Item -ItemType Directory -Path $appDir | Out-Null }

# --- apple-icon.png (180x180) ---
$apple = New-CofradeBitmap 180
$applePath = Join-Path $appDir "apple-icon.png"
$apple.Save($applePath, [System.Drawing.Imaging.ImageFormat]::Png)
$apple.Dispose()

# --- favicon.ico (entrada PNG-compressed 32x32 + 16x16) ---
$ico32bmp = New-CofradeBitmap 32
$ms32 = New-Object System.IO.MemoryStream
$ico32bmp.Save($ms32, [System.Drawing.Imaging.ImageFormat]::Png)
$ico32 = $ms32.ToArray()
$ico32bmp.Dispose(); $ms32.Dispose()

$ico16bmp = New-CofradeBitmap 16
$ms16 = New-Object System.IO.MemoryStream
$ico16bmp.Save($ms16, [System.Drawing.Imaging.ImageFormat]::Png)
$ico16 = $ms16.ToArray()
$ico16bmp.Dispose(); $ms16.Dispose()

$fs = New-Object System.IO.FileStream((Join-Path $appDir "favicon.ico"), [System.IO.FileMode]::Create)
$bw = New-Object System.IO.BinaryWriter($fs)
$bw.Write([uint16]0)          # reserved
$bw.Write([uint16]1)          # type: icon
$bw.Write([uint16]2)          # count: 2 entries
# entry 1: 32x32
$bw.Write([byte]32); $bw.Write([byte]32); $bw.Write([byte]0); $bw.Write([byte]0)
$bw.Write([uint16]1); $bw.Write([uint16]32)
$bw.Write([uint32]$ico32.Length)
$bw.Write([uint32]22)         # offset = 6 + 2*16
# entry 2: 16x16
$bw.Write([byte]16); $bw.Write([byte]16); $bw.Write([byte]0); $bw.Write([byte]0)
$bw.Write([uint16]1); $bw.Write([uint16]32)
$bw.Write([uint32]$ico16.Length)
$bw.Write([uint32](22 + $ico32.Length))
$bw.Write($ico32)
$bw.Write($ico16)
$bw.Flush(); $fs.Close()

Write-Host "OK: apple-icon.png y favicon.ico generados en app/"
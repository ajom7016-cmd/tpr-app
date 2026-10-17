$ws = New-Object -ComObject WScript.Shell
$s = $ws.CreateShortcut("C:\Users\ajom7\Desktop\OBS Studio.lnk")
$s.TargetPath = "C:\Users\ajom7\OBS-Studio\bin\64bit\obs64.exe"
$s.WorkingDirectory = "C:\Users\ajom7\OBS-Studio\bin\64bit"
$s.Description = "OBS Studio 60 FPS Recorder"
$s.Save()
Write-Output "Shortcut created successfully!"

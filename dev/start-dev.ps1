Set-Location dev
$a = Start-Job -FilePath .\nginx.ps1 -ArgumentList $pwd
Write-Host "NGINX running..."

[console]::TreatControlCAsInput = $true
while ($true) {
  Start-Sleep -Seconds 1
  if ([console]::KeyAvailable) {
    $key = [System.Console]::ReadKey($true)
    if (($key.modifiers -band [System.ConsoleModifiers]"control") -and ($key.key -eq "C")) {
      "Terminating"
      break
    }
  }
}

[console]::TreatControlCAsInput = $false
nginx.exe -s stop -c nginx.conf
Stop-Job -Id $a.Id

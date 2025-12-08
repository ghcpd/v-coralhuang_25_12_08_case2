# Start the app and run a smoke test (Windows Powershell helper)
Write-Host "Installing dependencies..."
npm install

Write-Host "Starting server in background (looks for PORT env, default 3000)"
Start-Process -NoNewWindow -FilePath npm -ArgumentList 'start'

Start-Sleep -Seconds 2
Write-Host "Running smoke test against http://localhost:3000"
node test/smoke.js

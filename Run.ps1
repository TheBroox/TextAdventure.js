param(
    [switch] $NoBuild,
    [switch] $NoInstall,
    [switch] $Debug,
    [switch] $Devmode,
    [switch] $DeleteSave
)

$ErrorActionPreference = "Stop"

Write-Host ""

if (!$NoInstall) {
    npm ci
} else {
    Write-Warning "Make sure to run 'npm ci' before running this script"
}

if (!$NoBuild) {
    npm run build
} else {
    Write-Warning "Make sure to run 'npm run build' before running this script"
}

$SaveFile = Join-Path $PSScriptRoot "savefile.json"

if ($DeleteSave -and (Test-Path $SaveFile)) {
    Write-Warning "Deleting old save file: $SaveFile"
    Remove-Item -Path $SaveFile -Force | Out-Null
}

$ENV:NECRO_SAVEFILE = $SaveFile
$ENV:NECRO_DEBUG = if ($Debug) { "true" } else { "false" }
$ENV:NECRO_DEVMODE = if ($Devmode) { "true" } else { "false" }

npm start

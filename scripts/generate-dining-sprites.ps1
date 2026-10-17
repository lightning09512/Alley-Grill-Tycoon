param(
  [string[]]$CharacterIds,
  [string]$SpriteGenRepo = 'D:\hoc\GITHUB\sprite-gen'
)

$ErrorActionPreference = 'Stop'
$env:PYTHONIOENCODING = 'utf-8'
$gameRoot = Split-Path -Parent $PSScriptRoot
$assetRoot = Join-Path $gameRoot 'assets\characters'
$outputRoot = Join-Path $assetRoot 'sprite-gen-dining'
$workRoot = Join-Path $SpriteGenRepo 'runs\alley-grill-dining-v1'
$exe = Join-Path $SpriteGenRepo '.venv\Scripts\sprite-gen.exe'
$manifest = Get-Content (Join-Path $assetRoot 'sprite-gen-walk\manifest.json') -Raw | ConvertFrom-Json
$template = Get-Content (Join-Path $workRoot 'requests\saigon-schoolgirl.json') -Raw
$entries = @($manifest.files | Where-Object { !$CharacterIds -or $CharacterIds -contains $_.id })
$allStates = @('walk', 'sit', 'seated_idle', 'eat', 'stand')
$actionStateNames = foreach ($direction in @('down', 'side', 'up')) {
  foreach ($state in $allStates) { "${direction}_$state" }
}
$actionStates = $actionStateNames -join ','

New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
foreach ($entry in $entries) {
  $id = [string]$entry.id
  $run = Join-Path $workRoot "runs\$id"
  $requestPath = Join-Path $workRoot "requests\$id.json"
  $target = Join-Path $outputRoot $id
  if ((Test-Path (Join-Path $target 'game-manifest.json')) -and (Test-Path (Join-Path $target 'game-atlas.png'))) {
    Write-Output "[$id] already packed"
    continue
  }
  if ($id -eq 'saigon-schoolgirl') {
    $base = Join-Path $workRoot 'bases\schoolgirl-front\frame0.png'
  } elseif (Test-Path (Join-Path $assetRoot "$id-front-customer.png")) {
    $base = Join-Path $assetRoot "$id-front-customer.png"
  } elseif ($id -eq 'saigon-taphoa-student-boy') {
    $base = Join-Path $workRoot 'bases\taphoa-student-boy\frame0.png'
  } elseif ($id -eq 'saigon-taphoa-college-girl') {
    $base = Join-Path $workRoot 'bases\taphoa-college-girl\frame0.png'
  } else {
    throw "No identity base for $id"
  }
  if (!(Test-Path $base)) { throw "Missing base: $base" }

  $request = $template.Replace("schoolgirl's exact face, hair, white ao dai, black backpack straps and shoes", "person's exact face, hair, clothing, colors, shoes and accessories")
  $request = $request.Replace("same identity and outfit", "same exact identity and outfit")
  $request = $request.Replace("seated with hips fixed", "clearly seated with bent knees and thighs horizontal, hips fixed at a lower seat height than standing")
  $request = $request.Replace("seated on an invisible stool", "clearly seated on an invisible stool with bent knees and a shorter body silhouette than standing")
  $request = $request.Replace("No chair, table, plate or scenery.", "No chair, table, plate or scenery. Keep every part of the body inside each frame with a clear margin.")
  $request = $request.Replace("No dish, bowl, table, chair or food baked into the sprite.", "No dish, bowl, table, chair or food baked into the sprite. Keep every part of the body inside each frame with a clear margin.")
  [System.IO.File]::WriteAllText($requestPath, $request, [System.Text.UTF8Encoding]::new($false))

  Write-Output "[$id] prepare"
  if (!(Test-Path (Join-Path $run 'sprite-request.json'))) {
    & $exe prepare --out-dir $run --character-id $id --base-image $base --description "The exact $id person from the attached Alley Grill Tycoon NPC artwork; preserve unique face, hair, outfit, colors and accessories across all directions and actions." --style 'Match the supplied hand-painted chibi game character, crisp readable silhouette at mobile game scale, consistent body proportions and fixed ground/seat anchor. Transparent RGBA output after chroma extraction.' --cell-width 247 --cell-height 396 --request $requestPath
    if ($LASTEXITCODE -ne 0) { throw "Prepare failed: $id" }
  }

  Write-Output "[$id] direction anchors"
  & $exe gen-set --run-dir $run --states down_idle,side_idle,up_idle --provider codex --concurrency 3
  if ($LASTEXITCODE -ne 0) { throw "Idle generation failed: $id" }
  & $exe extract --run-dir $run --states down_idle,side_idle,up_idle
  if ($LASTEXITCODE -ne 0) { throw "Idle extraction failed: $id" }
  foreach ($direction in @('down', 'side', 'up')) {
    & $exe anchor --run-dir $run --direction $direction
    if ($LASTEXITCODE -ne 0) { throw "Anchor failed: $id/$direction" }
  }

  Write-Output "[$id] action rows"
  & $exe gen-set --run-dir $run --states $actionStates --provider codex --concurrency 2
  if ($LASTEXITCODE -ne 0) { throw "Action generation failed: $id" }
  & $exe extract --run-dir $run --segmentation projection
  if ($LASTEXITCODE -ne 0) { throw "Extraction failed: $id" }
  & $exe compose-atlas --run-dir $run
  if ($LASTEXITCODE -ne 0) { throw "Atlas failed: $id" }
  & $exe inspect --run-dir $run
  if ($LASTEXITCODE -ne 0) { throw "Inspection failed: $id" }
  & $exe preview --run-dir $run
  if ($LASTEXITCODE -ne 0) { throw "Preview failed: $id" }
  & (Join-Path $SpriteGenRepo '.venv\Scripts\python.exe') (Join-Path $PSScriptRoot 'pack-dining-atlas.py') $run $target
  if ($LASTEXITCODE -ne 0) { throw "Runtime atlas pack failed: $id" }
  Copy-Item -LiteralPath (Join-Path $run 'qa\down_eat.gif') -Destination (Join-Path $target 'preview-eat.gif') -Force
  Copy-Item -LiteralPath (Join-Path $run 'qa\side_walk.gif') -Destination (Join-Path $target 'preview-walk.gif') -Force
  Write-Output "[$id] complete"
}

param(
  [Parameter(Mandatory)] [string]$CharacterId,
  [ValidateSet('down','side','up')] [string]$Direction = 'down',
  [string]$SpriteGenRepo = 'D:\hoc\GITHUB\sprite-gen'
)

$ErrorActionPreference = 'Stop'
$env:PYTHONIOENCODING = 'utf-8'
$run = Join-Path $SpriteGenRepo "runs\alley-grill-dining-v1\runs\$CharacterId"
$exe = Join-Path $SpriteGenRepo '.venv\Scripts\sprite-gen.exe'
$python = Join-Path $SpriteGenRepo '.venv\Scripts\python.exe'
$sourcePrompt = Join-Path $run "prompts\$Direction\eat.txt"
$repairPrompt = Join-Path $run "prompts\$Direction\eat-repair.txt"
$out = Join-Path $run "raw\$Direction\eat.png"
$backup = Join-Path $run "qa\${Direction}_eat-before-repair.png"
if (!(Test-Path $backup)) { Copy-Item -LiteralPath $out -Destination $backup }
$prefix = @'
IMPORTANT POSE CORRECTION: The attached seated_idle strip is the exact approved sitting silhouette, not merely inspiration. Copy its bent legs and low, short body into ALL SIX frames. Keep the hips at one fixed seat height, thighs horizontal, knees bent, and feet under the invisible stool. Do not show an upright standing body in any frame. Animate only the forearm and mouth: chopsticks rise from an invisible table edge to the mouth and lower again. The figure remains seated even at the beginning and end of the loop. No food, bowl, plate, table, chair, or floor shadow.

'@
[System.IO.File]::WriteAllText($repairPrompt, $prefix + [System.IO.File]::ReadAllText($sourcePrompt), [System.Text.UTF8Encoding]::new($false))
& $exe gen --provider codex --prompt-file $repairPrompt --out $out --ref (Join-Path $run "references\anchors\${Direction}-anchor-x8.png") --ref (Join-Path $run "raw\$Direction\seated_idle.png") --ref (Join-Path $run "references\layout-guides\$Direction\eat.png")
if ($LASTEXITCODE -ne 0) { throw "Repair generation failed: $CharacterId" }
& $exe extract --run-dir $run --states "${Direction}_eat" --segmentation projection
if ($LASTEXITCODE -ne 0) { throw "Repair extraction failed: $CharacterId" }
& $exe compose-atlas --run-dir $run
if ($LASTEXITCODE -ne 0) { throw "Repair atlas failed: $CharacterId" }
& $exe inspect --run-dir $run
if ($LASTEXITCODE -ne 0) { throw "Repair inspection failed: $CharacterId" }
& $exe preview --run-dir $run
if ($LASTEXITCODE -ne 0) { throw "Repair preview failed: $CharacterId" }
$target = Join-Path (Split-Path -Parent $PSScriptRoot) "assets\characters\sprite-gen-dining\$CharacterId"
& $python (Join-Path $PSScriptRoot 'pack-dining-atlas.py') $run $target
if ($LASTEXITCODE -ne 0) { throw "Repair pack failed: $CharacterId" }
Copy-Item -LiteralPath (Join-Path $run 'qa\down_eat.gif') -Destination (Join-Path $target 'preview-eat.gif') -Force
Write-Output "[$CharacterId] ${Direction}_eat repaired"

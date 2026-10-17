param(
  [Parameter(Mandatory)] [string[]]$CharacterIds,
  [string]$SpriteGenRepo = 'D:\hoc\GITHUB\sprite-gen'
)

$ErrorActionPreference = 'Stop'
$env:PYTHONIOENCODING = 'utf-8'
$exe = Join-Path $SpriteGenRepo '.venv\Scripts\sprite-gen.exe'
$python = Join-Path $SpriteGenRepo '.venv\Scripts\python.exe'
foreach ($characterId in $CharacterIds) {
  $run = Join-Path $SpriteGenRepo "runs\alley-grill-dining-v1\runs\$characterId"
  $sourcePrompt = Join-Path $run 'prompts\down\seated_idle.txt'
  $repairPrompt = Join-Path $run 'prompts\down\seated_idle-repair.txt'
  $out = Join-Path $run 'raw\down\seated_idle.png'
  $backup = Join-Path $run 'qa\down_seated_idle-before-repair.png'
  if (!(Test-Path $backup)) { Copy-Item -LiteralPath $out -Destination $backup }
  $prefix = @'
MANDATORY SEAT POSE: The attached frame-3 seated figure is the EXACT approved final sitting pose. Build all FOUR frames from that seated figure. Keep the same low hips, bent knees, horizontal thighs and short seated silhouette in every frame. Never redraw the standing anchor's legs. Vary only blinking, a tiny breath and a slight shoulder shift; feet and hip do not move. This is a customer already seated at a table, not preparing to sit or stand. No chair, table, stove, bowl, plate, food, or floor shadow.

'@
  [System.IO.File]::WriteAllText($repairPrompt, $prefix + [System.IO.File]::ReadAllText($sourcePrompt), [System.Text.UTF8Encoding]::new($false))
  Write-Output "[$characterId] repair down_seated_idle"
  & $exe gen --provider codex --prompt-file $repairPrompt --out $out --ref (Join-Path $run 'references\anchors\down-anchor-x8.png') --ref (Join-Path $run 'frames\down\sit\frame-3.png') --ref (Join-Path $run 'references\layout-guides\down\seated_idle.png')
  if ($LASTEXITCODE -ne 0) { throw "Idle repair generation failed: $characterId" }
  & $exe extract --run-dir $run --states down_seated_idle --segmentation projection
  if ($LASTEXITCODE -ne 0) { throw "Idle repair extraction failed: $characterId" }
  & $exe compose-atlas --run-dir $run
  if ($LASTEXITCODE -ne 0) { throw "Idle repair atlas failed: $characterId" }
  & $exe inspect --run-dir $run
  if ($LASTEXITCODE -ne 0) { throw "Idle repair inspection failed: $characterId" }
  & $exe preview --run-dir $run
  if ($LASTEXITCODE -ne 0) { throw "Idle repair preview failed: $characterId" }
  $target = Join-Path (Split-Path -Parent $PSScriptRoot) "assets\characters\sprite-gen-dining\$characterId"
  & $python (Join-Path $PSScriptRoot 'pack-dining-atlas.py') $run $target
  if ($LASTEXITCODE -ne 0) { throw "Idle repair pack failed: $characterId" }
  Copy-Item -LiteralPath (Join-Path $run 'qa\down_eat.gif') -Destination (Join-Path $target 'preview-eat.gif') -Force
  Write-Output "[$characterId] down_seated_idle repaired"
}

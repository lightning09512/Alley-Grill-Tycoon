param(
  [Parameter(Mandatory)] [string]$CharacterId,
  [string]$SpriteGenRepo = 'D:\hoc\GITHUB\sprite-gen'
)

$ErrorActionPreference = 'Stop'
$env:PYTHONIOENCODING = 'utf-8'
$run = Join-Path $SpriteGenRepo "runs\alley-grill-dining-v1\runs\$CharacterId"
$exe = Join-Path $SpriteGenRepo '.venv\Scripts\sprite-gen.exe'
$python = Join-Path $SpriteGenRepo '.venv\Scripts\python.exe'
$sourcePrompt = Join-Path $run 'prompts\down\sit.txt'
$repairPrompt = Join-Path $run 'prompts\down\sit-repair.txt'
$out = Join-Path $run 'raw\down\sit.png'
$backup = Join-Path $run 'qa\down_sit-before-repair.png'
if (!(Test-Path $backup)) { Copy-Item -LiteralPath $out -Destination $backup }
$prefix = @'
CRITICAL FINAL POSE CORRECTION: The fourth and final frame MUST be unmistakably seated facing the camera, like the attached side-view seated reference rotated toward the viewer. The hips lower by roughly one third of standing body height; both upper legs project horizontally forward, both knees bend and shoes remain in front of the body. The head is lower in the frame and the whole silhouette is visibly shorter than standing. Frame 1 is standing, frame 2 starts bending, frame 3 lowers, frame 4 is fully seated. Never end with straight standing legs. Keep identity and clothing exactly from the attached front-facing anchor. No chair, table, plate, bowl, food, scene, or floor shadow.

'@
[System.IO.File]::WriteAllText($repairPrompt, $prefix + [System.IO.File]::ReadAllText($sourcePrompt), [System.Text.UTF8Encoding]::new($false))
& $exe gen --provider codex --prompt-file $repairPrompt --out $out --ref (Join-Path $run 'references\anchors\down-anchor-x8.png') --ref (Join-Path $run 'frames\side\seated_idle\frame-2.png') --ref (Join-Path $run 'references\layout-guides\down\sit.png')
if ($LASTEXITCODE -ne 0) { throw "Sit generation failed: $CharacterId" }
& $exe extract --run-dir $run --states down_sit --segmentation projection
if ($LASTEXITCODE -ne 0) { throw "Sit extraction failed: $CharacterId" }
& $exe compose-atlas --run-dir $run
if ($LASTEXITCODE -ne 0) { throw "Sit atlas failed: $CharacterId" }
& $exe inspect --run-dir $run
if ($LASTEXITCODE -ne 0) { throw "Sit inspection failed: $CharacterId" }
& $exe preview --run-dir $run
if ($LASTEXITCODE -ne 0) { throw "Sit preview failed: $CharacterId" }
$target = Join-Path (Split-Path -Parent $PSScriptRoot) "assets\characters\sprite-gen-dining\$CharacterId"
& $python (Join-Path $PSScriptRoot 'pack-dining-atlas.py') $run $target
if ($LASTEXITCODE -ne 0) { throw "Sit pack failed: $CharacterId" }
Write-Output "[$CharacterId] down_sit repaired"

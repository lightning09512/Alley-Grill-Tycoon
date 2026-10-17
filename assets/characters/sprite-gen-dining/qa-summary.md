# Dining sprite QA

All four seat directions use the generated down, side, and up rows; left mirrors side.
Each atlas is loaded only when that character enters the dining room.

| Character | Frames | Alpha | Inspector errors | Inspector warnings |
|---|---:|---|---:|---:|
| `saigon-schoolgirl` | 90/90 ✓ | ✓ | 0 | 2 |
| `saigon-office-man` | 90/90 ✓ | ✓ | 0 | 5 |
| `saigon-market-shopper` | 90/90 ✓ | ✓ | 0 | 1 |
| `saigon-backpacker-tourist` | 90/90 ✓ | ✓ | 0 | 4 |
| `saigon-construction-worker` | 90/90 ✓ | ✓ | 0 | 1 |
| `saigon-delivery-rider` | 90/90 ✓ | ✓ | 0 | 1 |
| `saigon-food-reviewer` | 90/90 ✓ | ✓ | 0 | 0 |
| `saigon-genz-nightowl` | 90/90 ✓ | ✓ | 0 | 0 |
| `saigon-ingredient-supplier` | 90/90 ✓ | ✓ | 0 | 2 |
| `saigon-lottery-vendor` | 90/90 ✓ | ✓ | 0 | 0 |
| `saigon-morning-jogger` | 90/90 ✓ | ✓ | 0 | 3 |
| `saigon-office-woman` | 90/90 ✓ | ✓ | 0 | 3 |
| `saigon-older-regular` | 90/90 ✓ | ✓ | 0 | 1 |
| `saigon-schoolboy` | 90/90 ✓ | ✓ | 0 | 2 |
| `saigon-street-sweeper` | 90/90 ✓ | ✓ | 0 | 1 |
| `saigon-ward-police-officer` | 90/90 ✓ | ✓ | 0 | 5 |
| `saigon-ward-inspector` | 90/90 ✓ | ✓ | 0 | 1 |
| `saigon-young-mother` | 90/90 ✓ | ✓ | 0 | 2 |
| `saigon-taphoa-student-boy` | 90/90 ✓ | ✓ | 0 | 0 |
| `saigon-taphoa-college-girl` | 90/90 ✓ | ✓ | 0 | 3 |

## Needs work

- No missing rows, broken alpha atlases, or inspector errors.

## Visual review

- `qa-contact-sheet.png` and `qa-pose-sheet.png` show samples from all 20 characters at game scale.
- `room-preview.png` and `room-preview.gif` composite the existing modular room assets with four sample guests; they are asset QA previews, not a captured game session.
- Inspector warnings are minor edge pixels or low motion in subtle idle loops; inspect the GIF for any character that needs more art polish.
- A live browser preview was unavailable under the current browser access policy, so in-game animation and collision need a final visual pass.

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
| `saigon-young-father` | 90/90 ✓ | ✓ | 0 | 3 |
| `saigon-grandmother` | 90/90 ✓ | ✓ | 0 | 0 |
| `saigon-preschooler` | 90/90 ✓ | ✓ | 0 | 3 |
| `saigon-primary-teacher` | 90/90 ✓ | ✓ | 0 | 1 |
| `saigon-motorbike-mechanic` | 90/90 ✓ | ✓ | 0 | 2 |
| `saigon-night-shift-nurse` | 90/90 ✓ | ✓ | 0 | 1 |
| `saigon-taxi-driver` | 90/90 ✓ | ✓ | 0 | 3 |
| `saigon-traditional-motorbike-taxi-driver` | 90/90 ✓ | ✓ | 0 | 1 |
| `saigon-cajon-player` | 90/90 ✓ | ✓ | 0 | 0 |

## Remaining roster work

- The 29 dining atlases currently listed above pass the frame/alpha audit with no missing rows or inspector errors.
- The brief says 14 IDs, while its explicit list names 15 when the football friends, street musicians, and newlyweds are each counted as two people. I am tracking every explicitly named ID. Nine are available and integrated: `saigon-young-father`, `saigon-grandmother`, `saigon-preschooler`, `saigon-primary-teacher`, `saigon-motorbike-mechanic`, `saigon-night-shift-nurse`, `saigon-taxi-driver`, `saigon-traditional-motorbike-taxi-driver`, and `saigon-cajon-player`.
- Still pending full generation and QA: `saigon-football-fan-a`, `saigon-football-fan-b`, `saigon-street-guitarist` (repair the failed rows), `saigon-newlywed-husband`, `saigon-newlywed-wife`, and `saigon-neighborhood-guard`. Codex image generation hit its usage limit; do not integrate partial rows or placeholders.

## Visual review

- `qa-contact-sheet.png` and `qa-pose-sheet.png` show samples from the previously completed characters at game scale.
- `room-preview.png` and `room-preview.gif` composite the existing modular room assets with four sample guests; these are asset QA previews, not a captured game session.
- Inspector warnings are minor edge pixels or low motion in subtle idle loops; inspect the GIF for any character that needs more art polish.
- Live game was opened at a 390×844 phone viewport. The street crowd rendered with no visible clipping; in the dining room, guests walked in and sat together at a table, and a customer dialogue bubble appeared anchored beside its speaker. The room and bottom navigation fit the viewport.
- After a fresh reload, no new console errors appeared. One older HMR error was recorded before reload while the market lighting method names were being updated; it did not recur after reload.

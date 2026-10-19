# Player owner 8-direction sprite QA

- 32 animation rows, 160 frames total. Idle base, glance and apron-shift use 4 frames at 4 fps; walk uses 8 frames at 6 fps.
- All frames are 247×396 RGBA, with transparent background. Atlas: 1976×12672; runtime rows are grouped by animation state.
- The 8 direction anchors were reviewed. Facing progression is N, NE, E, SE, S, SW, W, NW; diagonal rows have distinct three-quarter views.
- The sprite-gen inspector reported 0 errors. It warned that `e_idle`, `se_idle`, `s_idle`, and `w_idle` fall just under the generic motion-presence threshold. Visual contact review shows a clear blink in these base-idle rows; the other idle variants add visible head/apron motion.
- All 8 walk rows contain 8 distinct gait phases and passed frame-count/motion inspection. Visual contact review shows alternating foot/arm poses while keeping the character direction consistent. Runtime foot sliding was not assessed because no game integration was requested.
- Compared with the existing front idle sheet, extracted character bounds were initially smaller. The sprite-gen curation transform was baked uniformly (scale 1.16, dy +5) across all 160 frames. In the final atlas visible bottoms align at y=390 of the 396 px cell; the runtime anchor remains bottom-center (123.5, 396).
- The final atlas passed composition QA: 160 cells, no atlas errors, alpha range 0–255, transparent outer edges.
- Existing game sprites and game code were not modified.

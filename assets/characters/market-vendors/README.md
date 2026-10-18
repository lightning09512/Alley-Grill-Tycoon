# Chibi market vendors

These transparent sprite atlases are split into four columns and two rows:

- Top row: idle gestures and short reactions.
- Bottom row: each vendor's work loop.

`WholesaleMarketScene` reads the frame grid from the image dimensions and registers the rows as Phaser animations. It pauses each work loop for a short random interval so all three vendors do not move in sync.

For walk cycles later, add a separate row or atlas with at least four consistent front, back, left, and right poses. Keep the character's feet aligned to the same baseline in every frame; the current atlases are front-facing stall animations and are not suitable for walking between stalls.

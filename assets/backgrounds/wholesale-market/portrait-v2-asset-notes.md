# Portrait market backgrounds

The produce and meat/seafood buying views each have five matched images in
`interior-produce/portrait-v2/` and `interior-seafood/portrait-v2/`:
`morning`, `noon`, `afternoon`, `night`, and `rain`. They are portrait
941 × 1672 px (two generated edits are 1671 px high) and are displayed in a
9:16 phone frame. All ten backgrounds intentionally contain no people.

## Future vendor sprite placement

The clear areas behind the left and right counters are reserved for separate
seller sprites. Suggested starting anchors, expressed as fractions of the
image width and height:

| View | Seller slot | Center x | Feet y |
| --- | --- | ---: | ---: |
| Produce | vegetable seller, left | 0.23 | 0.44 |
| Produce | fruit seller, right | 0.78 | 0.44 |
| Meat/seafood | butcher, left | 0.24 | 0.44 |
| Meat/seafood | fish/seafood seller, right | 0.78 | 0.44 |

Keep the sprite's head below the toolbar and place its feet behind the
countertop. A foreground counter mask may be needed when sellers are added so
their lower body sits behind the merchandise.

## Image generation prompt set

- **Produce morning base:** portrait, stationary first-person Vietnamese
  wholesale-market buying view; vegetable counter left and fruit counter
  right; empty seller spaces behind both; worn roof, tarps, bulbs, crates,
  scuffed walls and damp floor; restrained hand-painted market texture; no
  characters, basket, text, or UI.
- **Meat/seafood morning base:** same camera, roof, and seller spaces; butcher
  counter left; fish, shrimp, and crab counter right. The final base edit moves
  hanging meat to the far left to clear the butcher's standing position.
- **Noon:** edit the morning view to neutral overhead daylight and shorter
  shadows, preserving the layout.
- **Afternoon:** edit to warm side light and longer shadows, preserving the
  layout.
- **Night:** edit to dark blue ambient light and warm practical bulbs, keeping
  all goods readable and preserving the layout.
- **Rain:** edit to overcast light, wet tarps, a few leaks and damp floor,
  preserving the layout.

The transparent first-person basket is
`../../characters/market-player/held-basket.png`. It is a separate screen
overlay and must stay out of the background images.

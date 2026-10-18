# Quán Nhậu Hẻm — Godot project

This is the native Godot 4 version of the game in the repository root. It uses GDScript and Godot scenes; the Phaser/TypeScript version remains in the repository root as the reference implementation.

## Open and run

1. In Godot Project Manager, choose **Import** and select `godot-port/project.godot`.
2. Open the imported project and press **F5** to run the full game from `scenes/main.tscn`.
3. **F6** runs only the currently open scene. Use F5 when you want the game with its interface, save data, and all locations.
4. If Godot says a file changed outside the editor, choose **Reload from disk** before running.

On a new save, enter a shop name to begin. Drag or swipe horizontally to view the street. The bottom navigation opens shop management, staff, recipes, stock, and service. Use **Vào phòng ăn** to switch to table service and the kitchen.

## Included in this project

- All 12 shop upgrade stages and their matching street artwork.
- The four-shop street panorama, day and night transitions, weather, slowly swaying edge trees, additive canopy sunlight, a wind-displaced flag, ambient walkers, seated street diners, shoppers at the grocery, cooking steam, a pausing street cat, walking and flying pigeons, customers, and the shop owner.
- Shop naming, currency, reputation, timed shifts, recipe assembly, tips, ingredients, restocking, upgrades, and staff.
- Dining room with animated character atlases, six tables, guest arrivals and departures, orders, cooking, serving, payment, cleanup, and staff automation.
- Local save data, staff-based offline income, and seven background music tracks with saved audio settings.

The native Godot interface is rebuilt from Godot controls and scripts. It uses the same game art and core systems, but does not include the browser version's HTML/CSS, so its layout and styling are not pixel-identical.

## Codex and AI

Codex can edit this project directly. For an editor workflow, open the project in VS Code and use the Codex extension, or configure Godot's external editor to launch VS Code. This assists while developing; it does not add an AI model to the shipped game.

An in-game AI character can be added through a backend service. Keep API secrets on that server rather than inside an Android build; API usage may have separate billing.

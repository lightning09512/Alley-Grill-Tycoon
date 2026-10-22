# Gameplay research: My Hotpot Story / Tiệm Lẩu Đường Hạnh Phúc

Research date: 2026-10-21

## Verified reference mechanics

The developer's Google Play listing describes a restaurant-management loop where the player develops hotpot dishes, plans daily purchases, serves customers, trains chefs and waiters, buys restaurant equipment/furnishings, and can expand into a chain. The listing also frames the game as flexible restaurant management with decoration and Chinese ingredients. [Google Play listing](https://play.google.com/store/apps/details?id=com.lxqd.myhotpotstroy.abroad)

Apple's editorial feature adds concrete progression details: tapping speeds up order taking and dish delivery; serving more tables helps develop ingredients and raise food rating; a merge mini-game unlocks broths; menu expansion drives restaurant growth. It also emphasizes varied broths, ingredients, and quirky customers/orders. [Apple App Store editorial feature](https://apps.apple.com/ca/iphone/story/id1649270613)

The Vietnamese publisher's official terms identify Tiệm Lẩu Đường Hạnh Phúc as the Vietnamese-localized version of My Hotpot Story, produced by Chengdu Minus Seven Degrees. [Official VNG publisher terms](https://tiemlau.vnggames.com/dieu-khoan)

## Design implications for Banh Mi Pho

The reference is best understood as a light restaurant-management/progression game, rather than a detailed cooking simulator. The player repeatedly serves tables, then uses earnings/progression to widen the menu, improve staff/equipment, and unlock new food systems. This characterization is an inference from the official store description and Apple's editorial summary above.

For this project, a hotpot-focused version could use the following coherent loop:

1. **Plan the shift:** select a small active menu of broths and ingredient platters; preview required stock and expected cost.
2. **Buy for demand:** shop for ingredients that map one-to-one to the same inventory keys used by recipes and tickets.
3. **Seat and take group orders:** each table orders one broth plus several shared ingredient plates. Group identical items into quantities on the ticket.
4. **Serve the hotpot experience:** deliver broth and plates, then let diners cook/eat at the table for a short duration. Player attention goes to prioritizing tables, not tapping every ingredient in an arbitrary sequence.
5. **Earn satisfaction and progress:** shorter waits, complete orders, suitable broth/ingredients, and clean tables improve tips/reputation/food rating. Spend earnings on staff, equipment, table capacity, recipes, and decor.
6. **Unlock through play:** new broths and ingredients expand both menu choice and customer demand. A small merge side activity can be considered later, since the reference's Apple editorial explicitly calls out one, but it should not block the main service loop.

A practical first version should start with 3 broths and 6–8 ingredient plates, one canonical ingredient catalog, a ticket grouped by table/quantity, and three upgrades (server speed, kitchen capacity, table capacity). Keep the current recipe/stock mismatch out of the new design: each recipe should be the sole source for shop quantities, pantry deductions, ticket contents, cost, and sale price.

## Sources and evidence boundaries

- Google Play is the developer/publisher supplied game listing; it confirms the advertised management systems, but not every internal rule or balance value.
- Apple's App Store feature is editorial coverage; it confirms the described high-level progression/minigame framing, but should not be treated as a full mechanics specification.
- No fan wiki or player guide was used as evidence for the recommendations above.

# Bộ prompt sprite nhân viên quán

Các prompt này dùng với pipeline component-row của `sprite-gen`. Đây là gói asset mới, chưa thay sprite đang được game dùng. Giữ mỗi nhân vật ở một run riêng để khoá nhận diện, pivot và bảng màu.

## Prompt chung

Use case: illustration-story  
Asset type: 2D restaurant-management game character sprite  
Style/medium: polished painted chibi game art matching the existing Banh Mi Pho characters; warm natural shading, clean dark outline, expressive face, readable silhouette; never pixel art.  
Composition/framing: one complete character per frame, same 160x300 frame, feet aligned to one shared bottom pivot, full body within safe margins.  
Constraints: preserve the supplied character's face, hair, skin tone, body shape, outfit and accessories in every frame. True transparent output after extraction. Keep the game map and furniture out of character rows. No text, labels, logos, extra people, detached effects, cast shadows or motion blur.  

### Đi bộ 8 hướng

Create a seamless 8-frame walk cycle for the named direction only: north, north-east, east, south-east, south, south-west, west, or north-west. The body, face, feet and gaze must all face that direction. For diagonal rows, turn the torso and feet to a true three-quarter angle; do not approximate them with a front or side view. Show alternating foot contacts, weight transfer, counter-swinging arms, slight head movement and restrained apron/hair bounce. Keep the ground pivot fixed. Frame 8 must join frame 1 without a visible jump. No walking in place with sliding feet. Generate each direction as its own row from its accepted direction anchor; do not flip a generated row to fake an unapproved view.

### Nghỉ và rảnh

`rest_tired`: a gentle four-frame loop at the employee's safe rest point; shoulders lower, one hand wipes sweat with a small towel, a quiet breath, then returns to a relaxed standing pose. This is the visual for a real rest state. Do not walk or serve during this row.

`idle_lazy`: a restrained four-frame loop used only when no work is waiting. Pick up a small phone, glance at it briefly, tap once and lower it; keep feet planted. No phone use during an active task.

### Vai trò và animation làm việc

#### Mai Linh · phục vụ

Identity reference: `assets/characters/restaurant-staff-v1/server-mai-linh.png`. Young Vietnamese woman, large brown eyes, dark hair in a neat low bun with a small warm-colored clip, teal short-sleeve blouse, dark green apron, dark trousers and black work shoes. Preserve her recognizable face, teal-and-green uniform and serving tray.

`work_serve`: four-frame loop, stable facing toward the dining route; balance a dark oval tray with both hands, make a small careful step-in-place only if the layout requires it, then settle. For delivery rows, put one compact dish image on the tray; never invent an order label or table number.

`walk_carry_dish`: create one separate 8-frame walk row per accepted direction anchor (N, NE, E, SE, S, SW, W, NW). Keep the empty oval tray level and steady while she walks; the ground pivot and uniform stay consistent. Do not paint food into the walk sprite: at runtime the game overlays the selected dish PNG by recipe ID at the tray anchor. No customers, tables or map in the row.

#### Quang Tín · thu ngân

Identity reference: `assets/characters/restaurant-staff-v1/cashier-quang-tin.png`. Young Vietnamese man with swept dark hair, white short-sleeve shirt, muted burgundy apron, charcoal trousers and black work shoes. Preserve his friendly face and original outfit.

`work_cashier`: four-frame loop behind the existing cashier position: check a small receipt, accept/count a few banknotes, place them into the till, and return to neutral. No new cash register, readable text or floating money effects.

#### Tấn Huy · phụ bếp

Identity reference: `assets/characters/kitchen-prep-staff-v2/base-source.png`. Stocky middle-aged Vietnamese man, round face, neat salt-and-pepper moustache, tall white toque, white double-breasted chef jacket, paprika-red apron, charcoal trousers and dark kitchen clogs. Keep him clearly different from the player-owner and both cooks.

`chop_vegetables`: four-frame loop at the existing left prep board. Use a visibly broad, full-size kitchen cleaver, not a tiny paring knife. Show the cleaver lift, a clear downward chop, vegetables separating into small cut pieces on the existing board, then a short rebound. The visible produce must be cut scallions, carrot and onion. Keep the ingredient pile attached to the board area and stable; do not draw a second counter or cutting board over the map. Feet stay planted and the ground pivot does not drift.

#### Cô Hạnh · đầu bếp

Identity reference: `assets/characters/restaurant-staff-v1/chef-co-hanh.png`. Vietnamese woman cook with a white chef cap and jacket edged in teal, navy apron, dark trousers and dark kitchen shoes. Preserve her age, face, proportions and spatula.

`work_cook`: four-frame loop facing the assigned existing hotpot/wok station. Stir a pot or wok with her spatula, lift and settle the utensil, check the cooking surface, return to the starting pose. The map already owns the burner, pot and flame; do not add a duplicate stove or detached flame effect.

#### Đầu bếp nam mới · đầu bếp thứ hai

Create a distinct Vietnamese male line cook, average build and cheerful middle-aged face, short tidy hair under a dark navy bandana, round wire-frame glasses, deep navy cook shirt, sand-colored apron, dark trousers and brown kitchen shoes. Do not copy the player-owner's messy hair/teal shirt/olive apron. Do not copy Tấn Huy's moustache/white toque/red apron. Do not copy Cô Hạnh's face or uniform. Keep his face and clothing clearly recognizable from front, side, diagonal and rear views.

`work_cook`: four-frame loop at a different existing burner from Cô Hạnh. Stir a shallow wok with a long spatula, shift the wrist and elbow, check the food and return to the first pose. Do not put both cooks at the same burner, draw a new station or add a standalone fire sprite.

#### An Nhiên · tiếp thị

Identity reference: `assets/characters/restaurant-staff-v1/promoter-an.png`. Young Vietnamese woman with a long dark ponytail and red patterned tie, coral-red short jacket, white blouse, dark teal pencil skirt, dark tights and black flats. Preserve the original face and outfit.

`work_promoter`: four-frame friendly loop near the existing entrance: offer a small blank leaflet with one hand, make a short welcoming gesture and return to neutral. No readable lettering, no logo and no exaggerated arm wave.

## Prompt ảnh món tĩnh trên quầy ra món

Use case: stylized-concept  
Asset type: one static food image for the kitchen pass counter and serving tray  
Primary request: one complete Vietnamese pub dish matching the exact recipe ID and dish name supplied for the generation.  
Style/medium: polished, appetizing painted 2D game food art consistent with the existing Banh Mi Pho food sheets; warm highlights, rich natural colors, clear silhouette.  
Composition/framing: one compact serving centered in a square image, slightly elevated three-quarter tabletop view, fully visible with transparent padding; plate/bowl/pot scaled to fit a small pass-counter slot and a four-seat table.  
Constraints: transparent background, no counter, table, hands, people, words, label, price, logo, frame or watermark. For hotpot, draw only the pot and food; the game map provides the burner. Do not duplicate ingredients or add a second serving.

## Kỹ thuật và QA

- Use 160x300 cells for employee rows, 15 px safe margins and bottom-aligned feet to match the existing prep staff run.
- Use eight separately anchored walk directions, each with eight frames. Mark locomotion experimental until the contact and loop QA pass.
- Use four frames for work, rest and lazy loops. Keep work-facing direction fixed for each workstation.
- Generate direction anchors first. Accept and inspect the anchors before generating action rows. Never attach the original base to an action row after its direction anchor has been accepted.
- Extract through sprite-gen, compose atlas/GIF previews and inspect alpha, frame occupancy, pose changes, identity and foot pivot before handoff.
- Food images are still PNGs, not animated sprites. Their recipe-to-image mapping is by stable recipe ID.

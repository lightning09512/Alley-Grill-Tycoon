extends Node2D

const ROOM_WIDTH := 576.0
const ROOM_HEIGHT := 1280.0
const ROOM_SCALE := 0.75
const ROOM_ORIGIN_X := (540.0 - ROOM_WIDTH * ROOM_SCALE) * 0.5
const WALK_FRAME_SIZE := Vector2i(247, 396)
const DINING_FRAME_SIZE := Vector2(96.0, 154.0)
const DINING_GUEST_SIZE := Vector2(54.0, 87.0)
const DINING_GUEST_SCALE := Vector2(DINING_GUEST_SIZE.x / DINING_FRAME_SIZE.x, DINING_GUEST_SIZE.y / DINING_FRAME_SIZE.y)
const TABLE_ORIGINS := [Vector2(81, 313), Vector2(300, 313), Vector2(81, 513), Vector2(301, 513), Vector2(81, 710), Vector2(303, 711)]
const SEAT_OFFSETS := [Vector2(96, 77), Vector2(162, 133), Vector2(96, 181), Vector2(30, 133)]
const GUEST_SHEETS := {
	"student": "res://assets/characters/walk/saigon-schoolgirl-walk-16f.png",
	"office": "res://assets/characters/walk/saigon-office-man-walk-16f.png",
	"shopper": "res://assets/characters/walk/saigon-market-shopper-walk-16f.png",
	"tourist": "res://assets/characters/walk/saigon-backpacker-tourist-walk-16f.png",
}

var room_root := Node2D.new()
var kitchen_root := Node2D.new()
var guest_sprites: Dictionary = {}
var frame_cache: Dictionary = {}
var atlas_manifest_cache: Dictionary = {}
var guest_motion: Dictionary = {}
var kitchen_view := false
var current_snapshot: Dictionary = {}


func _ready() -> void:
	room_root.name = "DiningRoom"
	kitchen_root.name = "Kitchen"
	add_child(room_root)
	add_child(kitchen_root)
	_build_room()
	_build_kitchen()
	GameState.changed.connect(_on_game_changed)
	_on_game_changed(GameState.get_snapshot())


func set_kitchen_view(value: bool) -> void:
	kitchen_view = value
	_refresh_view()


func _unhandled_input(event: InputEvent) -> void:
	if kitchen_view or current_snapshot.get("service_mode", "street") != "dining":
		return
	var screen_position := Vector2.ZERO
	if event is InputEventScreenTouch and event.pressed:
		screen_position = event.position
	elif event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		screen_position = event.position
	else:
		return
	var local_position := get_global_transform_with_canvas().affine_inverse() * screen_position
	var closest_distance := 34.0
	var closest_table := -1
	var closest_seat := -1
	for table_index in TABLE_ORIGINS.size():
		var table_origin: Vector2 = TABLE_ORIGINS[table_index]
		for seat_index in SEAT_OFFSETS.size():
			var seat_offset: Vector2 = SEAT_OFFSETS[seat_index]
			var seat_position := Vector2(ROOM_ORIGIN_X + (table_origin.x + seat_offset.x) * ROOM_SCALE, (table_origin.y + seat_offset.y) * ROOM_SCALE)
			var distance := local_position.distance_to(seat_position)
			if distance < closest_distance:
				closest_distance = distance
				closest_table = table_index + 1
				closest_seat = seat_index
	if closest_table > 0:
		GameState.select_dining_seat(closest_table, closest_seat)
		get_viewport().set_input_as_handled()


func _build_room() -> void:
	_add_piece("room", "res://assets/interior/room-parts/tavern_room_shell_base.png", 0, 0, 1.0, 0)
	_add_piece("curtain", "res://assets/interior/room-parts/curtain_closed_teal.png", 223, 82, 0.75, 1)
	_add_piece("shelf", "res://assets/interior/room-parts/spice_shelf.png", 4, 20, 1.0, 2)
	_add_piece("staircase", "res://assets/interior/room-parts/staircase_wood.png", 440, 24, 0.85, 2)
	_add_piece("lantern-left", "res://assets/interior/room-parts/lantern_woven_red.png", 179, 61, 0.95, 3)
	_add_piece("lantern-right", "res://assets/interior/room-parts/lantern_woven_red.png", 344, 56, 0.95, 3)
	_add_piece("plant-shelf", "res://assets/interior/room-parts/potted_plant_large.png", 99, 75, 0.72, 3)
	_add_piece("plant-left-wall", "res://assets/interior/room-parts/potted_plant_large.png", -6, 159, 1.0, 3)
	_add_piece("plant-stair-top", "res://assets/interior/room-parts/potted_plant_large.png", 483, -23, 0.75, 3)
	_add_piece("plant-stair-middle", "res://assets/interior/room-parts/potted_plant_large.png", 435, 261, 0.8, 3)
	for index in TABLE_ORIGINS.size():
		var origin: Vector2 = TABLE_ORIGINS[index]
		_add_piece("table-%d" % (index + 1), "res://assets/interior/room-parts/dining_set_table_4stools_stove.png", origin.x, origin.y, 1.0, 4)
	_add_piece("counter", "res://assets/interior/room-parts/reception_counter_clean.png", -7, 903, 0.9, 5)
	_add_piece("register", "res://assets/interior/room-parts/cash_register_compact.png", 55, 896, 1.0, 6)
	_add_piece("ledger", "res://assets/interior/room-parts/order_ledger.png", 133, 926, 1.0, 6)
	_add_piece("counter-lantern", "res://assets/interior/room-parts/lantern_woven_red.png", -10, 902, 0.82, 6)
	_add_piece("plant-bottom-left", "res://assets/interior/room-parts/potted_plant_large.png", -9, 1043, 0.92, 6)
	_add_piece("plant-bottom-right", "res://assets/interior/room-parts/potted_plant_large.png", 494, 1082, 0.92, 6)


func _build_kitchen() -> void:
	var wall := Polygon2D.new()
	wall.name = "KitchenWall"
	wall.polygon = PackedVector2Array([Vector2(0, 0), Vector2(540, 0), Vector2(540, 590), Vector2(0, 590)])
	wall.color = Color("#d9c7a8")
	kitchen_root.add_child(wall)
	var floor := Polygon2D.new()
	floor.name = "KitchenFloor"
	floor.polygon = PackedVector2Array([Vector2(0, 590), Vector2(540, 590), Vector2(540, 960), Vector2(0, 960)])
	floor.color = Color("#907a5c")
	floor.z_index = 1
	kitchen_root.add_child(floor)
	_add_kitchen_piece("shelf", "res://assets/interior/stations/bowl_shelf.png", Vector2(22, 130), Vector2(0.75, 0.75), 2)
	_add_kitchen_piece("hood", "res://assets/interior/stations/exhaust_hood_small.png", Vector2(300, 142), Vector2(0.82, 0.82), 2)
	_add_kitchen_piece("grill", "res://assets/interior/stations/charcoal_grill_t1.png", Vector2(315, 360), Vector2(0.88, 0.88), 3)
	_add_kitchen_piece("prep", "res://assets/interior/stations/prep_counter_short.png", Vector2(38, 480), Vector2(0.88, 0.88), 4)
	_add_kitchen_piece("rice", "res://assets/interior/stations/rice_cooker.png", Vector2(330, 495), Vector2(0.7, 0.7), 4)


func _add_piece(piece_name: String, path: String, x: float, y: float, piece_scale: float, depth: int) -> void:
	var image := Sprite2D.new()
	image.name = piece_name
	image.texture = load(path) as Texture2D
	image.centered = false
	image.position = Vector2(ROOM_ORIGIN_X + x * ROOM_SCALE, y * ROOM_SCALE)
	image.scale = Vector2.ONE * ROOM_SCALE * piece_scale
	image.z_index = depth
	room_root.add_child(image)


func _add_kitchen_piece(node_name: String, path: String, point: Vector2, item_scale: Vector2, depth: int) -> void:
	var image := Sprite2D.new()
	image.name = node_name
	image.texture = load(path) as Texture2D
	image.centered = false
	image.position = point
	image.scale = item_scale
	image.z_index = depth
	kitchen_root.add_child(image)


func _on_game_changed(snapshot: Dictionary) -> void:
	current_snapshot = snapshot
	_refresh_view()
	_sync_guests()
	queue_redraw()


func _process(delta: float) -> void:
	if kitchen_view or current_snapshot.get("service_mode", "street") != "dining":
		return
	for guest in current_snapshot.get("dining", {}).get("guests", []):
		if guest["status"] not in ["entering", "leaving"]:
			continue
		var guest_id := str(guest["id"])
		if not guest_motion.has(guest_id) or not guest_sprites.has(guest_id):
			continue
		var motion: Dictionary = guest_motion[guest_id]
		var duration := float(_travel_seconds(int(guest["table_id"])))
		motion["elapsed"] = minf(duration, float(motion["elapsed"]) + delta)
		var table_origin: Vector2 = TABLE_ORIGINS[int(guest["table_id"]) - 1]
		var seat_offset: Vector2 = SEAT_OFFSETS[int(guest["seat_index"])]
		var seat_position := Vector2(ROOM_ORIGIN_X + (table_origin.x + seat_offset.x) * ROOM_SCALE, (table_origin.y + seat_offset.y) * ROOM_SCALE)
		_animate_guest_transition(guest, guest_sprites[guest_id], seat_position, float(motion["elapsed"]) / duration)


func _refresh_view() -> void:
	var active: bool = str(current_snapshot.get("service_mode", "street")) == "dining"
	visible = active
	room_root.visible = active and not kitchen_view
	kitchen_root.visible = active and kitchen_view


func _sync_guests() -> void:
	if current_snapshot.is_empty():
		return
	var dining: Dictionary = current_snapshot["dining"]
	var living_ids: Array[String] = []
	for guest in dining["guests"]:
		var guest_id := str(guest["id"])
		living_ids.append(guest_id)
		var character_id := str(guest.get("character_id", "saigon-schoolgirl"))
		if not guest_sprites.has(guest_id):
			var sprite := _create_guest_sprite(character_id, guest_id)
			guest_sprites[guest_id] = sprite
			room_root.add_child(sprite)
		var table_index: int = clampi(int(guest["table_id"]) - 1, 0, TABLE_ORIGINS.size() - 1)
		var table_origin: Vector2 = TABLE_ORIGINS[table_index]
		var seat_offset: Vector2 = SEAT_OFFSETS[int(guest["seat_index"])]
		var seat_position := Vector2(ROOM_ORIGIN_X + (table_origin.x + seat_offset.x) * ROOM_SCALE, (table_origin.y + seat_offset.y) * ROOM_SCALE)
		var sprite_node: AnimatedSprite2D = guest_sprites[guest_id]
		# Match the web scene's depth bands around a table: back stool behind the
		# tabletop, side stools above it, and front stool in front of it.
		sprite_node.z_index = [3, 5, 6, 5][int(guest["seat_index"])]
		_sync_guest_motion(guest)
		if guest["status"] in ["entering", "leaving"]:
			var motion: Dictionary = guest_motion[guest_id]
			var duration := float(_travel_seconds(int(guest["table_id"])))
			_animate_guest_transition(guest, sprite_node, seat_position, float(motion["elapsed"]) / duration)
		else:
			var direction: String = ["down", "side", "up", "side"][int(guest["seat_index"])]
			var state := "%s_%s" % [direction, "eat" if guest["status"] == "eating" else "seated_idle"]
			_set_guest_pose(sprite_node, character_id, state, true, seat_position)
	for guest_id in guest_sprites.keys():
		if guest_id not in living_ids:
			guest_sprites[guest_id].queue_free()
			guest_sprites.erase(guest_id)
			guest_motion.erase(guest_id)


func _create_guest_sprite(character_id: String, guest_id: String) -> AnimatedSprite2D:
	var frames: SpriteFrames
	if frame_cache.has(character_id):
		frames = frame_cache[character_id]
	else:
		frames = SpriteFrames.new()
		var atlas_path := "res://assets/characters/sprite-gen-dining/%s/game-atlas.png" % character_id
		var manifest_path := "res://assets/characters/sprite-gen-dining/%s/game-manifest.json" % character_id
		var texture := load(atlas_path) as Texture2D
		var file := FileAccess.open(manifest_path, FileAccess.READ)
		if texture == null or file == null:
			return _create_fallback_guest_sprite(guest_id)
		var manifest_variant: Variant = JSON.parse_string(file.get_as_text())
		if not manifest_variant is Dictionary:
			return _create_fallback_guest_sprite(guest_id)
		var manifest: Dictionary = manifest_variant
		var layout: Dictionary = manifest["frame_layout"]
		var rows: Dictionary = layout["rows"]
		var animation_rows: Dictionary = manifest["animation"]["rows"]
		for state in rows:
			frames.add_animation(state)
			var animation: Dictionary = animation_rows.get(state, {})
			frames.set_animation_speed(state, float(animation.get("fps", 5)))
			frames.set_animation_loop(state, bool(animation.get("loop", true)))
			for rect_data in rows[state]:
				var frame := AtlasTexture.new()
				frame.atlas = texture
				frame.region = Rect2(float(rect_data["x"]), float(rect_data["y"]), float(rect_data["w"]), float(rect_data["h"]))
				frames.add_frame(state, frame)
		frame_cache[character_id] = frames
		atlas_manifest_cache[character_id] = manifest
	var sprite := AnimatedSprite2D.new()
	sprite.name = "Guest_%s" % guest_id
	sprite.sprite_frames = frames
	sprite.animation = "down_seated_idle"
	sprite.scale = DINING_GUEST_SCALE
	sprite.centered = true
	return sprite


func _create_fallback_guest_sprite(guest_id: String) -> AnimatedSprite2D:
	var frames := SpriteFrames.new()
	frames.add_animation("walk")
	frames.set_animation_speed("walk", 6.0)
	frames.set_animation_loop("walk", true)
	var texture := load(GUEST_SHEETS["student"]) as Texture2D
	for index in range(mini(16, int(texture.get_width() / WALK_FRAME_SIZE.x))):
		var frame := AtlasTexture.new()
		frame.atlas = texture
		frame.region = Rect2(index * WALK_FRAME_SIZE.x, 0, WALK_FRAME_SIZE.x, WALK_FRAME_SIZE.y)
		frames.add_frame("walk", frame)
	var sprite := AnimatedSprite2D.new()
	sprite.name = "Guest_%s" % guest_id
	sprite.sprite_frames = frames
	sprite.animation = "walk"
	sprite.scale = Vector2.ONE * 0.22
	return sprite


func _sync_guest_motion(guest: Dictionary) -> void:
	var guest_id := str(guest["id"])
	var state: String = guest["status"]
	var elapsed := maxf(0.0, float(_travel_seconds(int(guest["table_id"]))) - float(guest.get("transition_seconds", 0)))
	if not guest_motion.has(guest_id) or guest_motion[guest_id]["status"] != state:
		guest_motion[guest_id] = {"status": state, "elapsed": elapsed}
	else:
		var motion: Dictionary = guest_motion[guest_id]
		motion["elapsed"] = maxf(float(motion["elapsed"]), elapsed)


func _animate_guest_transition(guest: Dictionary, sprite: AnimatedSprite2D, seat_position: Vector2, progress: float) -> void:
	var table_id := int(guest["table_id"])
	var seat_index := int(guest["seat_index"])
	var direction: String = str(["down", "side", "up", "side"][seat_index])
	var duration := float(_travel_seconds(table_id))
	var pose_fraction := 0.7 / duration
	var path := _guest_path(table_id, seat_index, seat_position)
	var character_id := str(guest.get("character_id", "saigon-schoolgirl"))
	if guest["status"] == "leaving":
		path.reverse()
		if progress < pose_fraction:
			sprite.flip_h = seat_index == 1
			_set_guest_pose(sprite, character_id, "%s_stand" % direction, true, seat_position)
			return
		var step := _position_on_path(path, (progress - pose_fraction) / (1.0 - pose_fraction))
		sprite.flip_h = bool(step["facing_left"]) if step["direction"] == "side" else false
		_set_guest_pose(sprite, character_id, "%s_walk" % step["direction"], false, step["position"])
		return
	if progress < 1.0 - pose_fraction:
		var step := _position_on_path(path, progress / (1.0 - pose_fraction))
		sprite.flip_h = bool(step["facing_left"]) if step["direction"] == "side" else false
		_set_guest_pose(sprite, character_id, "%s_walk" % step["direction"], false, step["position"])
	else:
		sprite.flip_h = seat_index == 1
		_set_guest_pose(sprite, character_id, "%s_sit" % direction, true, seat_position)


func _guest_path(table_id: int, seat_index: int, seat_position: Vector2) -> Array[Vector2]:
	var table_origin: Vector2 = TABLE_ORIGINS[table_id - 1]
	var is_outer := (table_id % 2 == 1 and seat_index == 3) or (table_id % 2 == 0 and seat_index == 1)
	var route_offset := 45.0 if seat_index == 0 or is_outer else 224.0 if seat_index == 2 else 165.0
	var route_y := (table_origin.y + route_offset) * ROOM_SCALE
	var door := Vector2(ROOM_ORIGIN_X + 288.0 * ROOM_SCALE, 1210.0 * ROOM_SCALE)
	return [door, Vector2(door.x, route_y), Vector2(seat_position.x, route_y), Vector2(seat_position.x, seat_position.y + 32.0 * ROOM_SCALE)]


func _position_on_path(path: Array[Vector2], progress: float) -> Dictionary:
	var distances: Array[float] = []
	var total := 0.0
	for index in range(1, path.size()):
		var distance := path[index - 1].distance_to(path[index])
		distances.append(distance)
		total += distance
	var remaining := clampf(progress, 0.0, 1.0) * total
	for index in distances.size():
		var segment: float = distances[index]
		if remaining > segment and index < distances.size() - 1:
			remaining -= segment
			continue
		var from: Vector2 = path[index]
		var to: Vector2 = path[index + 1]
		var amount := minf(1.0, remaining / segment) if segment > 0.0 else 1.0
		var direction := "side" if absf(to.x - from.x) > absf(to.y - from.y) else "down" if to.y > from.y else "up"
		return {"position": from.lerp(to, amount), "direction": direction, "facing_left": to.x < from.x}
	return {"position": path[-1], "direction": "up", "facing_left": false}


func _set_guest_pose(sprite: AnimatedSprite2D, character_id: String, state: String, seated: bool, anchor_position: Vector2) -> void:
	if not atlas_manifest_cache.has(character_id):
		if sprite.sprite_frames.has_animation("walk"):
			sprite.position = anchor_position - Vector2(0, 192.0 * sprite.scale.y)
			sprite.play("walk")
		return
	var manifest: Dictionary = atlas_manifest_cache[character_id]
	var anchors: Dictionary = manifest["anchors"]
	var anchor: Dictionary = anchors["seatedHip"] if seated else anchors["standingFeet"]
	var frame_width := float(manifest["frame_layout"]["cellWidth"])
	var frame_height := float(manifest["frame_layout"]["cellHeight"])
	sprite.offset = Vector2(frame_width * 0.5 - float(anchor["x"]), frame_height * 0.5 - float(anchor["y"]))
	sprite.position = anchor_position
	if sprite.sprite_frames.has_animation(state) and sprite.animation != state:
		sprite.play(state)


func _travel_seconds(table_id: int) -> int:
	return 7 - int(ceil(float(table_id) / 2.0))


func _draw() -> void:
	if current_snapshot.is_empty() or kitchen_view or current_snapshot.get("service_mode", "street") != "dining":
		return
	var dining: Dictionary = current_snapshot["dining"]
	var table_id := int(dining.get("selected_table_id", 1))
	var seat_index := int(dining.get("selected_seat_index", -1))
	if seat_index < 0:
		return
	var table_index := clampi(table_id - 1, 0, TABLE_ORIGINS.size() - 1)
	var origin: Vector2 = TABLE_ORIGINS[table_index]
	var offset: Vector2 = SEAT_OFFSETS[seat_index]
	var point := Vector2(ROOM_ORIGIN_X + (origin.x + offset.x) * ROOM_SCALE, (origin.y + offset.y) * ROOM_SCALE)
	draw_arc(point, 22.0, 0.0, TAU, 32, Color(1.0, 0.79, 0.38, 0.9), 2.5, true)

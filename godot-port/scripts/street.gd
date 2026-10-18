extends Node2D

const MAP_SIZE := Vector2(2172.0, 1280.0)
const DAY_LENGTH_SECONDS := 360.0
const START_DAY_PHASE := 0.42
const SKY_CLOUD_FRAMES := [
	Rect2(47, 122, 123, 59), Rect2(192, 82, 222, 107), Rect2(432, 42, 330, 150),
	Rect2(811, 90, 168, 99), Rect2(992, 95, 144, 89), Rect2(1158, 125, 167, 64), Rect2(1340, 90, 151, 97),
]
const SUN_FRAME := Rect2(327, 117, 128, 136)
const SUNSET_FRAME := Rect2(1305, 163, 145, 73)
const MOON_FRAME := Rect2(195, 505, 100, 127)
const STAR_FRAMES := [
	Rect2(470, 513, 103, 104), Rect2(673, 545, 59, 60), Rect2(846, 517, 101, 106),
	Rect2(1048, 545, 57, 59), Rect2(1274, 525, 93, 93), Rect2(1501, 546, 56, 56),
]
const WALK_FRAME_SIZE := Vector2i(247, 396)
const WALK_FRAME_COUNT := 16
const CAT_FRAME_SIZE := Vector2i(160, 160)
const CAT_SHEET_PATH := "res://assets/characters/ambient/saigon-street-cat-actions.png"
const CONTACT_SHADOW_PATH := "res://assets/effects/character-contact-shadow-soft.png"
const WALK_PATHS := [
	"res://assets/characters/walk/saigon-schoolgirl-walk-16f.png",
	"res://assets/characters/walk/saigon-office-man-walk-16f.png",
	"res://assets/characters/walk/saigon-market-shopper-walk-16f.png",
	"res://assets/characters/walk/saigon-backpacker-tourist-walk-16f.png",
	CAT_SHEET_PATH,
	"res://assets/characters/walk/saigon-construction-worker-walk-16f.png",
	"res://assets/characters/walk/saigon-delivery-rider-walk-16f.png",
	"res://assets/characters/walk/saigon-food-reviewer-walk-16f.png",
	"res://assets/characters/walk/saigon-genz-nightowl-walk-16f.png",
	"res://assets/characters/walk/saigon-ingredient-supplier-walk-16f.png",
	"res://assets/characters/walk/saigon-lottery-vendor-walk-16f.png",
	"res://assets/characters/walk/saigon-morning-jogger-walk-16f.png",
	"res://assets/characters/walk/saigon-office-woman-walk-16f.png",
	"res://assets/characters/walk/saigon-older-regular-walk-16f.png",
	"res://assets/characters/walk/saigon-schoolboy-walk-16f.png",
	"res://assets/characters/walk/saigon-street-sweeper-walk-16f.png",
	"res://assets/characters/walk/saigon-ward-police-officer-walk-16f.png",
	"res://assets/characters/walk/saigon-ward-inspector-walk-16f.png",
	"res://assets/characters/walk/saigon-young-mother-walk-16f.png",
]

const CANOPY_LAYERS := [
	{"side": "left", "x": 0.018, "y": 0.28, "height": 0.13, "phase": 0.35, "period": 3.45},
	{"side": "left", "x": 0.012, "y": 0.15, "height": 0.09, "phase": 0.42, "period": 3.45},
	{"side": "right", "x": 0.992, "y": 0.18, "height": 0.11, "phase": 2.41, "period": 3.72},
	{"side": "right", "x": 0.99, "y": 0.075, "height": 0.085, "phase": 2.48, "period": 3.72},
]

const CUSTOMER_SHEETS := {
	"student": [
		"res://assets/characters/walk/saigon-schoolgirl-walk-16f.png",
		"res://assets/characters/walk/saigon-schoolboy-walk-16f.png",
		"res://assets/characters/walk/saigon-taphoa-student-boy-walk-16f.png",
	],
	"office": [
		"res://assets/characters/walk/saigon-office-man-walk-16f.png",
		"res://assets/characters/walk/saigon-office-woman-walk-16f.png",
	],
	"shopper": [
		"res://assets/characters/walk/saigon-market-shopper-walk-16f.png",
		"res://assets/characters/walk/saigon-older-regular-walk-16f.png",
		"res://assets/characters/walk/saigon-young-mother-walk-16f.png",
		"res://assets/characters/walk/saigon-lottery-vendor-walk-16f.png",
		"res://assets/characters/walk/saigon-ingredient-supplier-walk-16f.png",
		"res://assets/characters/walk/saigon-ward-police-officer-walk-16f.png",
		"res://assets/characters/walk/saigon-ward-inspector-walk-16f.png",
		"res://assets/characters/walk/saigon-street-sweeper-walk-16f.png",
	],
	"tourist": [
		"res://assets/characters/walk/saigon-backpacker-tourist-walk-16f.png",
		"res://assets/characters/walk/saigon-food-reviewer-walk-16f.png",
		"res://assets/characters/walk/saigon-genz-nightowl-walk-16f.png",
	],
}

const STREET_DINER_PROFILES := [
	{"id": "office-man", "walk": "res://assets/characters/walk/saigon-office-man-walk-16f.png", "atlas": "res://assets/characters/sprite-gen-dining/saigon-office-man/game-atlas.png", "venue": "pho"},
	{"id": "office-woman", "walk": "res://assets/characters/walk/saigon-office-woman-walk-16f.png", "atlas": "res://assets/characters/sprite-gen-dining/saigon-office-woman/game-atlas.png", "venue": "coffee"},
	{"id": "construction-worker", "walk": "res://assets/characters/walk/saigon-construction-worker-walk-16f.png", "atlas": "res://assets/characters/sprite-gen-dining/saigon-construction-worker/game-atlas.png", "venue": "com-tam"},
	{"id": "backpacker", "walk": "res://assets/characters/walk/saigon-backpacker-tourist-walk-16f.png", "atlas": "res://assets/characters/sprite-gen-dining/saigon-backpacker-tourist/game-atlas.png", "venue": "coffee"},
	{"id": "older-regular", "walk": "res://assets/characters/walk/saigon-older-regular-walk-16f.png", "atlas": "res://assets/characters/sprite-gen-dining/saigon-older-regular/game-atlas.png", "venue": "com-tam"},
]

const STREET_DINER_SEATS := {
	"coffee": [0.0295, 0.0525, 0.1041, 0.1298],
	"pho": [0.2983, 0.3131],
	"com-tam": [0.7827, 0.8121, 0.8398],
}

const GROCERY_SHOPPER_PROFILES := [
	{
		"id": "student-boy",
		"walk": "res://assets/characters/walk/saigon-taphoa-student-boy-walk-16f.png",
		"browse": "res://assets/characters/shop-idle/saigon-taphoa-student-boy-shop-idle-v1.png",
		"dialogue": "Cô ơi, cho cháu chai Sting!",
	},
	{
		"id": "college-girl",
		"walk": "res://assets/characters/walk/saigon-taphoa-college-girl-walk-16f.png",
		"browse": "res://assets/characters/shop-idle/saigon-taphoa-college-girl-shop-idle-v1.png",
		"dialogue": "Cho cháu hai gói snack nha!",
	},
]

const DINER_GROUND_Y_RATIO := 0.745
const DINER_SEAT_Y_RATIO := 0.67
const DINER_APPROACH_DISTANCE := 132.0
const DINER_WALK_SPEED := 36.0
const DINER_MAX_ACTIVE := 5
const GROCERY_SHOP_X_RATIO := 0.928
const GROCERY_SHOP_Y_RATIO := 0.67
const GROCERY_APPROACH_DISTANCE := 118.0
const GROCERY_WALK_SPEED := 40.0
const GROCERY_SPAWN_MIN := 8.5
const GROCERY_SPAWN_MAX := 12.5
const STREET_COOKING_STEAM_POINTS := [
	{"x": 630.0, "y": 700.0, "size": 0.56, "interval": 2.25},
	{"x": 1555.0, "y": 705.0, "size": 0.48, "interval": 2.7},
]
const SHOP_COOKING_STEAM_POINTS := {
	5: [{"x": 1264.0, "y": 666.0, "size": 0.54, "interval": 2.3}],
	6: [{"x": 1267.0, "y": 727.0, "size": 0.54, "interval": 2.3}],
	7: [{"x": 1268.0, "y": 744.0, "size": 0.54, "interval": 2.3}],
	8: [{"x": 1269.0, "y": 747.0, "size": 0.54, "interval": 2.3}],
	9: [{"x": 1353.0, "y": 750.0, "size": 0.50, "interval": 2.5}],
}

const STAGE_ALPHA_BOUNDS := [
	Rect2(0, 21, 1616, 936), Rect2(0, 23, 1617, 918), Rect2(0, 41, 1617, 913),
	Rect2(0, 33, 1616, 922), Rect2(0, 8, 1617, 965), Rect2(19, 0, 1582, 954),
	Rect2(0, 2, 1253, 1228), Rect2(0, 0, 1616, 959), Rect2(0, 0, 1615, 958),
	Rect2(0, 4, 1268, 1208), Rect2(0, 0, 1254, 1254), Rect2(0, 0, 1254, 1244),
]
const STAGE_TARGET_HEIGHTS := [0.0, 0.0, 0.0, 0.0, 510.0, 560.0, 610.0, 685.0, 685.0, 685.0, 685.0, 685.0]

var street: Sprite2D
var street_transition: Sprite2D
var street_rain: Sprite2D
var stage_art: Sprite2D
var camera: Camera2D
var sun_sprite: Sprite2D
var moon_sprite: Sprite2D
var day_night_atlas: Texture2D
var star_sprites: Array[Sprite2D] = []
var ambient_clouds: Array[Dictionary] = []
var owner_sprite: AnimatedSprite2D
var owner_shadow: Sprite2D
var canopy_pivots: Array[Node2D] = []
var canopy_sunlight_layers: Array[Sprite2D] = []
var ambient_walkers: Array[Dictionary] = []
var pigeons: Array[Dictionary] = []
var rain_drops: Array[Dictionary] = []
var customer_sprites: Dictionary = {}
var frame_cache: Dictionary = {}
var diner_frames_cache: Dictionary = {}
var grocery_browse_frames_cache: Dictionary = {}
var street_diners: Array[Dictionary] = []
var grocery_shoppers: Array[Dictionary] = []
var cooking_steam_emitters: Array[Dictionary] = []
var cooking_steam_puffs: Array[Dictionary] = []
var cooking_steam_texture: Texture2D
var diner_spawn_cooldown := 1.3
var grocery_spawn_cooldown := 3.0
var next_diner_profile_index := 0
var next_grocery_profile_index := 0
var wind_image: Image
var wind_texture: ImageTexture
var wind_samples: Array[Dictionary] = []
var wind_materials: Array[ShaderMaterial] = []
var wind_upload_elapsed := 0.0
var is_dragging := false
var drag_start := Vector2.ZERO
var camera_x_at_drag_start := 0.0
var world_seconds := 0.0
var last_stage := 0


func _ready() -> void:
	_build_background()
	_build_wind_distortion()
	_build_shop()
	_build_cooking_steam_emitters()
	_build_canopies()
	_build_atmosphere()
	_build_camera()
	_build_ambient_walkers()
	_build_pigeons()
	_build_player_owner()
	_build_rain()
	GameState.changed.connect(_on_game_changed)
	_on_game_changed(GameState.get_snapshot())
	get_viewport().size_changed.connect(_sync_camera_bounds)


func _process(delta: float) -> void:
	world_seconds += delta
	_animate_canopies()
	_update_flag_wind(delta)
	_animate_atmosphere(delta)
	_move_ambient_walkers(delta)
	_animate_pigeons(delta)
	_animate_rain(delta)
	_animate_cooking_steam(delta)
	_update_time_of_day()
	_update_street_diners(delta)
	_update_grocery_shoppers(delta)
	_sync_customers(GameState.get_snapshot())


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_begin_drag(event.position)
		else:
			is_dragging = false
	elif event is InputEventScreenDrag:
		_update_drag(event.position)
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			_begin_drag(event.position)
		else:
			is_dragging = false
	elif event is InputEventMouseMotion and is_dragging:
		_update_drag(event.position)


func _build_background() -> void:
	street = Sprite2D.new()
	street.name = "StreetArtwork"
	street.texture = load("res://assets/backgrounds/time-of-day/afternoon.png")
	street.position = MAP_SIZE * 0.5
	street.z_index = -10
	add_child(street)
	street_transition = Sprite2D.new()
	street_transition.name = "StreetTimeOfDayTransition"
	street_transition.texture = street.texture
	street_transition.position = MAP_SIZE * 0.5
	street_transition.z_index = -9
	street_transition.modulate.a = 0.0
	add_child(street_transition)
	street_rain = Sprite2D.new()
	street_rain.name = "StreetRainArtwork"
	street_rain.texture = load("res://assets/backgrounds/time-of-day/rain.png")
	street_rain.position = MAP_SIZE * 0.5
	street_rain.z_index = -8
	street_rain.modulate.a = 0.0
	add_child(street_rain)


func _build_wind_distortion() -> void:
	var map_size := Vector2i(543, 320)
	wind_image = Image.create(map_size.x, map_size.y, false, Image.FORMAT_RGBA8)
	wind_image.fill(Color(0.5, 0.5, 0.0, 1.0))
	var source_texture := load("res://assets/backgrounds/time-of-day/afternoon.png") as Texture2D
	if source_texture == null:
		return
	var source_image := source_texture.get_image()
	var flag_region := PackedVector2Array([
		Vector2(0.916, 0.19), Vector2(0.955, 0.19), Vector2(0.955, 0.269), Vector2(0.916, 0.266),
	])
	var left := int(floor(0.916 * map_size.x))
	var right := int(ceil(0.955 * map_size.x))
	var top := int(floor(0.19 * map_size.y))
	var bottom := int(ceil(0.269 * map_size.y))
	for y in range(top, bottom):
		for x in range(left, right):
			var normalized := Vector2((float(x) + 0.5) / map_size.x, (float(y) + 0.5) / map_size.y)
			if not Geometry2D.is_point_in_polygon(normalized, flag_region):
				continue
			var source_x := clampi(int(normalized.x * source_image.get_width()), 0, source_image.get_width() - 1)
			var source_y := clampi(int(normalized.y * source_image.get_height()), 0, source_image.get_height() - 1)
			var color := source_image.get_pixel(source_x, source_y)
			var hue := color.h
			var is_red_cloth := (hue < 14.0 / 360.0 or hue > 346.0 / 360.0) and color.s > 0.35 and color.r > 0.35
			var is_yellow_star := hue >= 36.0 / 360.0 and hue <= 68.0 / 360.0 and color.s > 0.38 and color.r > 0.51
			if not is_red_cloth and not is_yellow_star:
				continue
			var free_edge := clampf((normalized.x - 0.916) / 0.039, 0.0, 1.0)
			wind_samples.append({
				"point": Vector2i(x, y),
				"x": normalized.x,
				"phase": normalized.y * 15.0 - normalized.x * 8.0,
				"weight": free_edge * free_edge,
			})
	wind_texture = ImageTexture.create_from_image(wind_image)
	var shader := load("res://shaders/street_flag_wind.gdshader") as Shader
	if shader == null:
		return
	for background in [street, street_transition, street_rain]:
		var material := ShaderMaterial.new()
		material.shader = shader
		material.set_shader_parameter("wind_map", wind_texture)
		material.set_shader_parameter("displacement_scale", Vector2(0.005, 0.0025))
		background.material = material
		wind_materials.append(material)


func _update_flag_wind(delta: float) -> void:
	if wind_texture == null:
		return
	var weather := _get_weather_state(world_seconds)
	for material in wind_materials:
		material.set_shader_parameter("displacement_scale", Vector2(
			0.0038 + float(weather["wind"]) * 0.0052,
			0.0018 + float(weather["wind"]) * 0.0022,
		))
	wind_upload_elapsed += delta
	if wind_upload_elapsed < 0.033:
		return
	wind_upload_elapsed = fmod(wind_upload_elapsed, 0.033)
	var amplitude := 0.62 + float(weather["wind"]) * 0.5
	for sample in wind_samples:
		var phase := world_seconds * 3.1 + float(sample["phase"])
		var weight := float(sample["weight"])
		var horizontal := sin(phase) * weight * amplitude
		var vertical := cos(phase * 0.83 + float(sample["x"]) * 5.0) * weight * amplitude * 0.16
		var point: Vector2i = sample["point"]
		wind_image.set_pixel(point.x, point.y, Color(0.5 + horizontal * 0.5, 0.5 + vertical * 0.5, 0.0, 1.0))
	wind_texture.update(wind_image)


func _build_atmosphere() -> void:
	var weather_atlas := load("res://assets/effects/saigon-weather-effects-atlas.png") as Texture2D
	day_night_atlas = load("res://assets/effects/saigon-day-night-transition-atlas.png") as Texture2D
	if weather_atlas == null or day_night_atlas == null:
		return
	sun_sprite = Sprite2D.new()
	sun_sprite.name = "Sun"
	sun_sprite.texture = _atlas_frame(day_night_atlas, SUN_FRAME)
	sun_sprite.z_index = -7
	sun_sprite.modulate.a = 0.0
	add_child(sun_sprite)
	moon_sprite = Sprite2D.new()
	moon_sprite.name = "Moon"
	moon_sprite.texture = _atlas_frame(day_night_atlas, MOON_FRAME)
	moon_sprite.z_index = -7
	moon_sprite.modulate.a = 0.0
	add_child(moon_sprite)
	for index in range(12):
		var star := Sprite2D.new()
		star.name = "NightStar%d" % index
		star.texture = _atlas_frame(day_night_atlas, STAR_FRAMES[index % STAR_FRAMES.size()])
		star.z_index = -7
		star.modulate.a = 0.0
		add_child(star)
		star_sprites.append(star)
	for index in range(5):
		var cloud := Sprite2D.new()
		cloud.name = "SkyCloud%d" % index
		cloud.texture = _atlas_frame(weather_atlas, SKY_CLOUD_FRAMES[(index * 3 + 1) % SKY_CLOUD_FRAMES.size()])
		cloud.z_index = -7
		cloud.position = Vector2(MAP_SIZE.x * (0.05 + index * 0.19), MAP_SIZE.y * (0.085 + index % 3 * 0.035))
		cloud.modulate.a = 0.25
		add_child(cloud)
		ambient_clouds.append({
			"node": cloud,
			"speed": 8.0 + float(index % 3) * 3.0,
			"phase": float(index) * 1.87,
			"width": 90.0 + float(index % 3) * 22.0,
			"height": 45.0 + float(index % 2) * 12.0,
		})


func _atlas_frame(atlas: Texture2D, frame_rect: Rect2) -> AtlasTexture:
	var frame := AtlasTexture.new()
	frame.atlas = atlas
	frame.region = frame_rect
	return frame


func _build_shop() -> void:
	stage_art = Sprite2D.new()
	stage_art.name = "PlayerShop"
	stage_art.centered = true
	stage_art.z_index = 2
	add_child(stage_art)
	_set_shop_stage(1)


func _set_shop_stage(level: int) -> void:
	if stage_art == null or level == last_stage:
		return
	last_stage = level
	var filename := "shop_%02d.png" % level
	if level == 7:
		filename = "shop_07_full.png"
	var texture := load("res://assets/stages/%s" % filename) as Texture2D
	if texture == null:
		return
	stage_art.texture = texture
	var index := level - 1
	var bounds: Rect2 = STAGE_ALPHA_BOUNDS[index]
	var scale_x := 700.0 / bounds.size.x
	var natural_height := bounds.size.y * scale_x
	var target_height: float = STAGE_TARGET_HEIGHTS[index]
	var scale_y := scale_x
	if target_height > 0.0:
		scale_y = min(685.0, target_height) / bounds.size.y
	if level >= 10:
		scale_y = scale_x
	var offset_x := (700.0 - bounds.size.x * scale_x) * 0.5 - bounds.position.x * scale_x
	var offset_y := 685.0 - bounds.size.y * scale_y - bounds.position.y * scale_y
	stage_art.scale = Vector2(scale_x, scale_y)
	stage_art.position = Vector2(
		740.0 + offset_x + texture.get_width() * scale_x * 0.5,
		170.0 + offset_y + texture.get_height() * scale_y * 0.5,
	)
	stage_art.z_index = 2
	if cooking_steam_texture != null:
		_sync_shop_cooking_steam(level)


func _build_cooking_steam_emitters() -> void:
	cooking_steam_texture = _create_cooking_steam_texture()
	for point in STREET_COOKING_STEAM_POINTS:
		_add_cooking_steam_emitter(Vector2(float(point["x"]), float(point["y"])), float(point["size"]), float(point["interval"]), 1)
	_sync_shop_cooking_steam(last_stage)


func _create_cooking_steam_texture() -> ImageTexture:
	var image := Image.create(30, 54, false, Image.FORMAT_RGBA8)
	image.fill(Color.TRANSPARENT)
	var paths := [
		[Vector2(12, 52), Vector2(8, 46), Vector2(16, 40), Vector2(12, 34), Vector2(9, 29), Vector2(16, 25), Vector2(14, 19), Vector2(12, 14), Vector2(18, 10), Vector2(17, 4)],
		[Vector2(18, 53), Vector2(23, 47), Vector2(16, 42), Vector2(20, 36), Vector2(24, 30), Vector2(17, 25), Vector2(21, 20), Vector2(24, 15), Vector2(21, 10), Vector2(24, 6)],
		[Vector2(6, 51), Vector2(3, 46), Vector2(9, 42), Vector2(7, 37), Vector2(5, 32), Vector2(9, 28), Vector2(9, 23)],
	]
	for y in range(54):
		for x in range(30):
			var point := Vector2(float(x) + 0.5, float(y) + 0.5)
			var opacity := 0.0
			for path in paths:
				for segment_index in range(path.size() - 1):
					var distance := _distance_to_segment(point, path[segment_index], path[segment_index + 1])
					var line_opacity := exp(-(distance * distance) / 2.0) * 0.27
					opacity = maxf(opacity, line_opacity)
			if opacity > 0.002:
				image.set_pixel(x, y, Color(0.96, 0.94, 0.88, opacity))
	return ImageTexture.create_from_image(image)


func _distance_to_segment(point: Vector2, start: Vector2, finish: Vector2) -> float:
	var line := finish - start
	var amount := clampf((point - start).dot(line) / maxf(line.length_squared(), 0.001), 0.0, 1.0)
	return point.distance_to(start + line * amount)


func _sync_shop_cooking_steam(level: int) -> void:
	for index in range(cooking_steam_emitters.size() - 1, -1, -1):
		if cooking_steam_emitters[index]["kind"] == "shop":
			cooking_steam_emitters.remove_at(index)
	if not SHOP_COOKING_STEAM_POINTS.has(level) or stage_art.texture == null:
		return
	for point in SHOP_COOKING_STEAM_POINTS[level]:
		var image_center := stage_art.texture.get_size() * 0.5
		var image_point := Vector2(float(point["x"]), float(point["y"]))
		var steam_position := stage_art.position + (image_point - image_center) * stage_art.scale
		_add_cooking_steam_emitter(steam_position, float(point["size"]), float(point["interval"]), 3, "shop")


func _add_cooking_steam_emitter(position: Vector2, size: float, interval: float, depth: int, kind: String = "street") -> void:
	cooking_steam_emitters.append({
		"position": position,
		"size": size,
		"interval": interval,
		"timer": randf_range(0.15, interval),
		"depth": depth,
		"kind": kind,
	})


func _animate_cooking_steam(delta: float) -> void:
	if cooking_steam_texture == null:
		return
	for emitter in cooking_steam_emitters:
		emitter["timer"] = float(emitter["timer"]) - delta
		if float(emitter["timer"]) > 0.0:
			continue
		emitter["timer"] = float(emitter["interval"]) + randf_range(-0.26, 0.26)
		var sprite := Sprite2D.new()
		sprite.name = "CookingSteamPuff"
		sprite.texture = cooking_steam_texture
		sprite.offset = Vector2(0.0, -27.0)
		sprite.position = emitter["position"] + Vector2(randf_range(-1.0, 1.0), 0.0) * float(emitter["size"])
		sprite.scale = Vector2.ONE * float(emitter["size"])
		sprite.z_index = int(emitter["depth"])
		sprite.modulate = Color(1.0, 0.98, 0.9, 0.0)
		add_child(sprite)
		cooking_steam_puffs.append({
			"sprite": sprite,
			"origin": sprite.position,
			"life": 1.45,
			"duration": 1.45,
			"rise": randf_range(22.0, 29.0) * float(emitter["size"]),
			"drift": randf_range(2.0, 5.0) * float(emitter["size"]),
			"phase": randf_range(0.0, TAU),
			"size": float(emitter["size"]),
		})
	for index in range(cooking_steam_puffs.size() - 1, -1, -1):
		var puff: Dictionary = cooking_steam_puffs[index]
		puff["life"] = float(puff["life"]) - delta
		var progress := clampf(1.0 - float(puff["life"]) / float(puff["duration"]), 0.0, 1.0)
		var sprite: Sprite2D = puff["sprite"]
		sprite.position = Vector2(
			Vector2(puff["origin"]).x + sin(progress * 2.8 + float(puff["phase"])) * float(puff["drift"]),
			Vector2(puff["origin"]).y - float(puff["rise"]) * progress,
		)
		sprite.scale = Vector2.ONE * float(puff["size"]) * (0.9 + progress * 0.12)
		sprite.modulate.a = sin(progress * PI) * 0.38
		if float(puff["life"]) <= 0.0:
			sprite.queue_free()
			cooking_steam_puffs.remove_at(index)


func _build_canopies() -> void:
	var texture := load("res://assets/effects/tree-canopy.png") as Texture2D
	for index in CANOPY_LAYERS.size():
		var anchor: Dictionary = CANOPY_LAYERS[index]
		var side: String = anchor["side"]
		var layer_height: float = MAP_SIZE.y * anchor["height"]
		var layer_width := layer_height * float(texture.get_width()) / float(texture.get_height())
		var pivot := Node2D.new()
		pivot.name = "EdgeCanopy%d" % index
		pivot.position = Vector2(MAP_SIZE.x * anchor["x"], MAP_SIZE.y * anchor["y"])
		pivot.set_meta("wind_phase", anchor["phase"])
		pivot.set_meta("wind_period", anchor["period"])
		pivot.z_index = -8
		add_child(pivot)
		var foliage := Sprite2D.new()
		foliage.texture = texture
		foliage.scale = Vector2.ONE * (layer_height / float(texture.get_height()))
		foliage.position = Vector2(layer_width * (0.5 - (0.04 if side == "left" else 0.96)), layer_height * (0.5 - 0.72))
		foliage.flip_h = side == "right"
		foliage.modulate = Color(1.0, 1.0, 1.0, 0.82)
		pivot.add_child(foliage)
		var sunlight := Sprite2D.new()
		sunlight.name = "CanopySunlight"
		sunlight.texture = texture
		sunlight.scale = foliage.scale
		sunlight.position = foliage.position
		sunlight.flip_h = foliage.flip_h
		sunlight.modulate = Color(1.0, 0.78, 0.43, 0.0)
		sunlight.texture_filter = CanvasItem.TEXTURE_FILTER_LINEAR
		var add_blend := CanvasItemMaterial.new()
		add_blend.blend_mode = CanvasItemMaterial.BLEND_MODE_ADD
		sunlight.material = add_blend
		sunlight.z_index = 1
		pivot.add_child(sunlight)
		canopy_sunlight_layers.append(sunlight)
		canopy_pivots.append(pivot)


func _build_camera() -> void:
	camera = Camera2D.new()
	camera.name = "StreetCamera"
	camera.zoom = Vector2(0.75, 0.75)
	camera.position = Vector2(1090.0, MAP_SIZE.y * 0.5)
	add_child(camera)
	camera.make_current()
	_sync_camera_bounds()


func _build_ambient_walkers() -> void:
	var shadow_texture := load(CONTACT_SHADOW_PATH) as Texture2D
	for index in range(WALK_PATHS.size()):
		var path: String = WALK_PATHS[index]
		var is_cat: bool = path == CAT_SHEET_PATH
		var scale_factor := 0.43 if is_cat else 0.17 + float(index % 3) * 0.012
		var sprite := _create_walker(path, "AmbientWalker%d" % index, scale_factor)
		var direction := -1.0 if index % 2 == 0 else 1.0
		var x := MAP_SIZE.x * (float(index) + 0.5) / float(WALK_PATHS.size())
		var lane_y := MAP_SIZE.y * (0.69 if index % 2 == 0 else 0.745)
		var frame_half_height := float(CAT_FRAME_SIZE.y) * 0.5 if is_cat else float(WALK_FRAME_SIZE.y) * 0.5
		sprite.position = Vector2(x, lane_y - frame_half_height * sprite.scale.y)
		sprite.flip_h = direction < 0.0
		sprite.z_index = 50 + int(lane_y / 20.0)
		var shadow := Sprite2D.new()
		shadow.name = "AmbientWalkerShadow%d" % index
		shadow.texture = shadow_texture
		shadow.scale = Vector2(42.0 / shadow_texture.get_width(), 12.0 / shadow_texture.get_height()) if shadow_texture != null else Vector2.ONE
		shadow.position = Vector2(x, lane_y + 1.5)
		shadow.z_index = sprite.z_index - 1
		shadow.modulate.a = 0.72
		add_child(shadow)
		add_child(sprite)
		var speed := (28.0 + float((index * 11) % 5) * 3.0) * 0.8 / 0.75
		ambient_walkers.append({
			"sprite": sprite, "shadow": shadow, "direction": direction, "speed": speed,
			"lane_y": lane_y, "is_cat": is_cat, "paused": false,
			"pause_clock": world_seconds + 4.0 + float(index % 2) * 4.5,
			"pause_until": 0.0,
		})


func _build_pigeons() -> void:
	var frames := SpriteFrames.new()
	for animation_name in ["walk", "eat", "fly"]:
		frames.add_animation(animation_name)
		frames.set_animation_loop(animation_name, true)
	frames.set_animation_speed("walk", 6.0)
	frames.set_animation_speed("eat", 5.0)
	frames.set_animation_speed("fly", 8.0)
	var sheets := {
		"walk": ["res://assets/characters/ambient/pigeon-walking.png", 4],
		"eat": ["res://assets/characters/ambient/pigeon-eating.png", 4],
		"fly": ["res://assets/characters/ambient/pigeon-flying.png", 7],
	}
	for animation_name in sheets:
		var sheet_data: Array = sheets[animation_name]
		var atlas := load(str(sheet_data[0])) as Texture2D
		if atlas == null:
			continue
		for frame_index in int(sheet_data[1]):
			var frame := AtlasTexture.new()
			frame.atlas = atlas
			frame.region = Rect2(frame_index * 32, 0, 32, 32)
			frames.add_frame(animation_name, frame)
	var shadow_texture := load(CONTACT_SHADOW_PATH) as Texture2D
	for index in 2:
		var sprite := AnimatedSprite2D.new()
		sprite.name = "StreetPigeon%d" % index
		sprite.sprite_frames = frames
		sprite.animation = "walk"
		sprite.play("walk")
		sprite.position = Vector2(MAP_SIZE.x * (0.485 if index == 0 else 0.515), MAP_SIZE.y * 0.745 + float(index) * 2.5)
		sprite.scale = Vector2.ONE * (30.0 / 32.0)
		sprite.z_index = 50 + int(sprite.position.y / 20.0)
		add_child(sprite)
		var shadow := Sprite2D.new()
		shadow.name = "StreetPigeonShadow%d" % index
		shadow.texture = shadow_texture
		shadow.scale = Vector2(17.0 / shadow_texture.get_width(), 5.0 / shadow_texture.get_height()) if shadow_texture != null else Vector2.ONE
		shadow.position = sprite.position + Vector2(0.0, 1.5)
		shadow.z_index = sprite.z_index - 1
		shadow.modulate.a = 0.28
		add_child(shadow)
		pigeons.append({
			"sprite": sprite, "shadow": shadow, "x": sprite.position.x, "y": sprite.position.y,
			"home_y": sprite.position.y, "direction": 1.0 if index == 0 else -1.0,
			"speed": 18.0 + float(index) * 3.0, "state": "walking",
			"state_timer": 2.8 + float(index) * 2.7, "peck_count": 0,
			"min_x": MAP_SIZE.x * 0.39, "max_x": MAP_SIZE.x * 0.61,
		})


func _build_player_owner() -> void:
	var sheet := load("res://assets/characters/player-owner/owner_male_idle_8f.png") as Texture2D
	var shadow_texture := load("res://assets/characters/player-owner/owner_ground_shadow.png") as Texture2D
	if sheet == null or shadow_texture == null:
		return
	var frames := SpriteFrames.new()
	frames.add_animation("idle")
	frames.set_animation_speed("idle", 7.0)
	frames.set_animation_loop("idle", true)
	var idle_sequence := [0, 1, 2, 1, 0, 4, 5, 7]
	for _repeat_index in range(5):
		for frame_index in idle_sequence:
			var frame := AtlasTexture.new()
			frame.atlas = sheet
			frame.region = Rect2(frame_index * WALK_FRAME_SIZE.x, 0, WALK_FRAME_SIZE.x, WALK_FRAME_SIZE.y)
			frames.add_frame("idle", frame)
	owner_sprite = AnimatedSprite2D.new()
	owner_sprite.name = "PlayerOwner"
	owner_sprite.sprite_frames = frames
	owner_sprite.animation = "idle"
	owner_sprite.scale = Vector2.ONE * 0.22
	owner_sprite.position = Vector2(1090.0, MAP_SIZE.y * 0.74 - 192.0 * owner_sprite.scale.y)
	owner_sprite.z_index = 50 + int(MAP_SIZE.y * 0.74 / 20.0)
	owner_sprite.play("idle")
	add_child(owner_sprite)
	owner_shadow = Sprite2D.new()
	owner_shadow.name = "PlayerOwnerGroundShadow"
	owner_shadow.texture = shadow_texture
	owner_shadow.scale = Vector2(42.0 / shadow_texture.get_width(), 12.0 / shadow_texture.get_height())
	owner_shadow.position = Vector2(1090.0, MAP_SIZE.y * 0.74 + 1.5)
	owner_shadow.z_index = owner_sprite.z_index - 1
	owner_shadow.modulate.a = 0.72
	add_child(owner_shadow)


func _create_walker(path: String, node_name: String, scale_factor: float) -> AnimatedSprite2D:
	var frames: SpriteFrames
	if frame_cache.has(path):
		frames = frame_cache[path]
	else:
		frames = SpriteFrames.new()
		frames.add_animation("walk")
		frames.set_animation_speed("walk", 5.0 if path == CAT_SHEET_PATH else 6.0)
		frames.set_animation_loop("walk", true)
		var sheet := load(path) as Texture2D
		if sheet != null:
			if path == CAT_SHEET_PATH:
				frames.add_animation("sit")
				frames.set_animation_speed("sit", 2.0)
				frames.set_animation_loop("sit", true)
				for frame_index in [4, 5, 6, 7]:
					var frame := AtlasTexture.new()
					frame.atlas = sheet
					frame.region = Rect2((frame_index % 4) * CAT_FRAME_SIZE.x, int(frame_index / 4) * CAT_FRAME_SIZE.y, CAT_FRAME_SIZE.x, CAT_FRAME_SIZE.y)
					frames.add_frame("walk", frame)
				for frame_index in [16, 17]:
					var frame := AtlasTexture.new()
					frame.atlas = sheet
					frame.region = Rect2((frame_index % 4) * CAT_FRAME_SIZE.x, int(frame_index / 4) * CAT_FRAME_SIZE.y, CAT_FRAME_SIZE.x, CAT_FRAME_SIZE.y)
					frames.add_frame("sit", frame)
			else:
				var count := mini(WALK_FRAME_COUNT, int(sheet.get_width() / WALK_FRAME_SIZE.x))
				for frame_index in range(count):
					var frame := AtlasTexture.new()
					frame.atlas = sheet
					frame.region = Rect2(frame_index * WALK_FRAME_SIZE.x, 0, WALK_FRAME_SIZE.x, WALK_FRAME_SIZE.y)
					frames.add_frame("walk", frame)
		frame_cache[path] = frames
	var sprite := AnimatedSprite2D.new()
	sprite.name = node_name
	sprite.sprite_frames = frames
	sprite.animation = "walk"
	sprite.scale = Vector2.ONE * scale_factor
	sprite.play("walk")
	return sprite


func _get_visible_world_bounds() -> Rect2:
	var half_view := get_viewport_rect().size / camera.zoom * 0.5
	return Rect2(camera.position - half_view, half_view * 2.0)


func _get_viewport_exit_x(direction: float, current_x: float) -> float:
	var bounds := _get_visible_world_bounds()
	return maxf(current_x, bounds.end.x) + 70.0 if direction > 0.0 else minf(current_x, bounds.position.x) - 70.0


func _diner_eat_frames(atlas_path: String) -> SpriteFrames:
	if diner_frames_cache.has(atlas_path):
		return diner_frames_cache[atlas_path]
	var atlas := load(atlas_path) as Texture2D
	if atlas == null:
		return null
	var frames := SpriteFrames.new()
	frames.add_animation("eat")
	frames.set_animation_speed("eat", 6.0)
	frames.set_animation_loop("eat", true)
	for frame_index in range(6):
		var frame := AtlasTexture.new()
		frame.atlas = atlas
		frame.region = Rect2(frame_index * 96, 1540, 96, 154)
		frames.add_frame("eat", frame)
	diner_frames_cache[atlas_path] = frames
	return frames


func _set_diner_walk_pose(diner: Dictionary) -> void:
	var sprite: AnimatedSprite2D = diner["sprite"]
	sprite.sprite_frames = diner["walk_frames"]
	sprite.animation = "walk"
	sprite.scale = Vector2.ONE * 0.17
	sprite.position = Vector2(0.0, -WALK_FRAME_SIZE.y * sprite.scale.y * 0.47)
	sprite.flip_h = float(diner["direction"]) < 0.0
	sprite.play("walk")


func _set_diner_eat_pose(diner: Dictionary) -> void:
	var sprite: AnimatedSprite2D = diner["sprite"]
	sprite.sprite_frames = diner["eat_frames"]
	sprite.animation = "eat"
	sprite.scale = Vector2.ONE * 0.47
	sprite.position = Vector2(0.0, -36.0)
	sprite.flip_h = float(diner["direction"]) < 0.0
	sprite.play("eat")


func _try_spawn_street_diner() -> bool:
	if street_diners.size() >= DINER_MAX_ACTIVE or not is_visible_in_tree():
		return false
	var visible_bounds := _get_visible_world_bounds()
	for profile_offset in range(STREET_DINER_PROFILES.size()):
		var profile_index := posmod(next_diner_profile_index + profile_offset, STREET_DINER_PROFILES.size())
		var profile: Dictionary = STREET_DINER_PROFILES[profile_index]
		var already_on_street := false
		for diner in street_diners:
			if diner["profile_id"] == profile["id"]:
				already_on_street = true
				break
		if already_on_street:
			continue
		var seat_values: Array = STREET_DINER_SEATS[profile["venue"]]
		for seat_index in range(seat_values.size()):
			var seat_id := "%s-%d" % [profile["venue"], seat_index]
			var occupied := false
			for diner in street_diners:
				if diner["seat_id"] == seat_id and diner["phase"] != "walking_out":
					occupied = true
					break
			if occupied:
				continue
			var seat_x := float(seat_values[seat_index]) * MAP_SIZE.x
			if seat_x < visible_bounds.position.x - 36.0 or seat_x > visible_bounds.end.x + 36.0:
				continue
			var direction := 1.0 if seat_x < camera.position.x else -1.0
			var walk_sprite := _create_walker(str(profile["walk"]), "Diner_%s" % profile["id"], 0.17)
			var container := Node2D.new()
			container.name = "StreetDiner_%s" % profile["id"]
			container.position = Vector2(seat_x - direction * DINER_APPROACH_DISTANCE, MAP_SIZE.y * DINER_GROUND_Y_RATIO)
			container.z_index = 50 + int(container.position.y / 20.0)
			add_child(container)
			var shadow_texture := load(CONTACT_SHADOW_PATH) as Texture2D
			var shadow := Sprite2D.new()
			shadow.name = "GroundShadow"
			shadow.texture = shadow_texture
			if shadow_texture != null:
				shadow.scale = Vector2(38.0 / shadow_texture.get_width(), 11.0 / shadow_texture.get_height())
			shadow.position = Vector2(0.0, 1.5)
			shadow.modulate.a = 0.8
			shadow.z_index = -1
			container.add_child(shadow)
			walk_sprite.name = "DinerCharacter"
			walk_sprite.position = Vector2(0.0, -WALK_FRAME_SIZE.y * walk_sprite.scale.y * 0.47)
			walk_sprite.flip_h = direction < 0.0
			walk_sprite.z_index = 1
			container.add_child(walk_sprite)
			var diner := {
				"profile_id": profile["id"], "seat_id": seat_id, "venue": profile["venue"],
				"seat_x": seat_x, "direction": direction, "container": container,
				"sprite": walk_sprite, "walk_frames": walk_sprite.sprite_frames,
				"eat_frames": _diner_eat_frames(str(profile["atlas"])),
				"phase": "walking_in", "timer": 0.0,
				"idle_duration": randf_range(9.0, 15.0), "target_x": seat_x,
			}
			street_diners.append(diner)
			next_diner_profile_index = (profile_index + 1) % STREET_DINER_PROFILES.size()
			return true
	return false


func _update_street_diners(delta: float) -> void:
	if not is_visible_in_tree():
		return
	diner_spawn_cooldown = maxf(0.0, diner_spawn_cooldown - delta)
	var ground_y := MAP_SIZE.y * DINER_GROUND_Y_RATIO
	for index in range(street_diners.size() - 1, -1, -1):
		var diner: Dictionary = street_diners[index]
		var container: Node2D = diner["container"]
		var sprite: AnimatedSprite2D = diner["sprite"]
		var seat_y := MAP_SIZE.y * DINER_SEAT_Y_RATIO
		var phase: String = diner["phase"]
		if phase == "walking_in":
			var distance := float(diner["target_x"]) - container.position.x
			var step := DINER_WALK_SPEED * delta
			if absf(distance) <= step + 0.5:
				container.position.x = float(diner["target_x"])
				container.position.y = seat_y
				diner["phase"] = "sitting_down"
				diner["timer"] = 0.38
				_set_diner_eat_pose(diner)
			else:
				container.position.x += signf(distance) * step
				var approach := clampf(1.0 - absf(distance) / DINER_APPROACH_DISTANCE, 0.0, 1.0)
				var turn := _smooth_step(0.58, 1.0, approach)
				container.position.y = lerpf(ground_y, seat_y, turn)
		elif phase == "sitting_down":
			diner["timer"] = float(diner["timer"]) - delta
			if float(diner["timer"]) <= 0.0:
				diner["phase"] = "eating"
				diner["timer"] = float(diner["idle_duration"])
		elif phase == "eating":
			diner["timer"] = float(diner["timer"]) - delta
			if float(diner["timer"]) <= 0.0:
				diner["phase"] = "standing_up"
				diner["timer"] = 0.42
				_set_diner_walk_pose(diner)
		elif phase == "standing_up":
			diner["timer"] = float(diner["timer"]) - delta
			var progress := clampf(1.0 - float(diner["timer"]) / 0.42, 0.0, 1.0)
			container.position.y = lerpf(seat_y, ground_y, _smooth_step(0.0, 1.0, progress))
			if float(diner["timer"]) <= 0.0:
				diner["phase"] = "walking_out"
				container.position.y = ground_y
				diner["target_x"] = _get_viewport_exit_x(float(diner["direction"]), container.position.x)
		else:
			var distance := float(diner["target_x"]) - container.position.x
			var step := DINER_WALK_SPEED * delta
			if absf(distance) <= step + 0.5:
				container.queue_free()
				street_diners.remove_at(index)
				diner_spawn_cooldown = minf(diner_spawn_cooldown, 0.9)
				continue
			container.position.x += signf(distance) * step
			container.position.y = ground_y
		container.z_index = 50 + int(container.position.y / 20.0)
		var shadow: Sprite2D = container.get_node("GroundShadow")
		shadow.position = Vector2.ZERO
		if diner["phase"] == "eating" or diner["phase"] == "sitting_down":
			sprite.position = Vector2(0.0, -36.0)
		else:
			sprite.position = Vector2(0.0, -WALK_FRAME_SIZE.y * sprite.scale.y * 0.47)
	if diner_spawn_cooldown <= 0.0:
		diner_spawn_cooldown = randf_range(2.2, 3.4) if _try_spawn_street_diner() else 1.1


func _grocery_browse_frames(texture_path: String) -> SpriteFrames:
	if grocery_browse_frames_cache.has(texture_path):
		return grocery_browse_frames_cache[texture_path]
	var atlas := load(texture_path) as Texture2D
	if atlas == null:
		return null
	var frames := SpriteFrames.new()
	frames.add_animation("browse")
	frames.set_animation_speed("browse", 2.0)
	frames.set_animation_loop("browse", false)
	var width := atlas.get_width()
	for frame_index in range(4):
		var left := roundi(float(frame_index) * width / 4.0)
		var right := roundi(float(frame_index + 1) * width / 4.0)
		var frame := AtlasTexture.new()
		frame.atlas = atlas
		frame.region = Rect2(left, 0, right - left, atlas.get_height())
		frames.add_frame("browse", frame)
	grocery_browse_frames_cache[texture_path] = frames
	return frames


func _make_grocery_bubble(message: String) -> PanelContainer:
	var bubble := PanelContainer.new()
	bubble.name = "SpeechBubble"
	bubble.position = Vector2(-74.0, -112.0)
	bubble.size = Vector2(148.0, 34.0)
	bubble.custom_minimum_size = bubble.size
	bubble.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var style := StyleBoxFlat.new()
	style.bg_color = Color(1.0, 0.98, 0.91, 0.98)
	style.border_color = Color(0.39, 0.29, 0.2, 0.95)
	style.set_border_width_all(1)
	style.set_corner_radius_all(8)
	style.content_margin_left = 5.0
	style.content_margin_right = 5.0
	style.content_margin_top = 3.0
	style.content_margin_bottom = 3.0
	bubble.add_theme_stylebox_override("panel", style)
	var label := Label.new()
	label.text = message
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override("font_size", 9)
	label.add_theme_color_override("font_color", Color(0.29, 0.22, 0.16))
	bubble.add_child(label)
	return bubble


func _try_spawn_grocery_shopper() -> bool:
	if not grocery_shoppers.is_empty() or not is_visible_in_tree():
		return false
	var visible_bounds := _get_visible_world_bounds()
	var target_x := MAP_SIZE.x * GROCERY_SHOP_X_RATIO
	if target_x < visible_bounds.position.x - 56.0 or target_x > visible_bounds.end.x + 56.0:
		return false
	for profile_offset in range(GROCERY_SHOPPER_PROFILES.size()):
		var profile_index := posmod(next_grocery_profile_index + profile_offset, GROCERY_SHOPPER_PROFILES.size())
		var profile: Dictionary = GROCERY_SHOPPER_PROFILES[profile_index]
		var direction := 1.0 if target_x < camera.position.x else -1.0
		var walk_sprite := _create_walker(str(profile["walk"]), "GroceryShopper_%s" % profile["id"], 0.17)
		var container := Node2D.new()
		container.name = "GroceryShopper_%s" % profile["id"]
		container.position = Vector2(target_x - direction * GROCERY_APPROACH_DISTANCE, MAP_SIZE.y * DINER_GROUND_Y_RATIO)
		container.z_index = 50 + int(container.position.y / 20.0)
		add_child(container)
		var shadow_texture := load(CONTACT_SHADOW_PATH) as Texture2D
		var shadow := Sprite2D.new()
		shadow.name = "GroundShadow"
		shadow.texture = shadow_texture
		if shadow_texture != null:
			shadow.scale = Vector2(42.0 / shadow_texture.get_width(), 11.0 / shadow_texture.get_height())
		shadow.position = Vector2(0.0, 1.5)
		shadow.modulate.a = 0.8
		shadow.z_index = -1
		container.add_child(shadow)
		walk_sprite.name = "ShopperCharacter"
		walk_sprite.position = Vector2(0.0, -WALK_FRAME_SIZE.y * walk_sprite.scale.y * 0.47)
		walk_sprite.flip_h = direction < 0.0
		walk_sprite.z_index = 1
		container.add_child(walk_sprite)
		var bubble := _make_grocery_bubble(str(profile["dialogue"]))
		bubble.visible = false
		bubble.z_index = 5
		container.add_child(bubble)
		var shopper := {
			"profile_id": profile["id"], "container": container, "sprite": walk_sprite,
			"walk_frames": walk_sprite.sprite_frames,
			"browse_frames": _grocery_browse_frames(str(profile["browse"])),
			"bubble": bubble, "direction": direction, "phase": "walking_in",
			"target_x": target_x, "timer": 0.0, "exit_distance": 0.0,
		}
		grocery_shoppers.append(shopper)
		next_grocery_profile_index = (profile_index + 1) % GROCERY_SHOPPER_PROFILES.size()
		return true
	return false


func _set_grocery_walk_pose(shopper: Dictionary) -> void:
	var sprite: AnimatedSprite2D = shopper["sprite"]
	sprite.sprite_frames = shopper["walk_frames"]
	sprite.animation = "walk"
	sprite.scale = Vector2.ONE * 0.17
	sprite.position = Vector2(0.0, -WALK_FRAME_SIZE.y * sprite.scale.y * 0.47)
	sprite.flip_h = float(shopper["direction"]) < 0.0
	sprite.play("walk")


func _update_grocery_shoppers(delta: float) -> void:
	if not is_visible_in_tree():
		return
	if grocery_shoppers.is_empty():
		grocery_spawn_cooldown = maxf(0.0, grocery_spawn_cooldown - delta)
	var target_y := MAP_SIZE.y * GROCERY_SHOP_Y_RATIO
	var ground_y := MAP_SIZE.y * DINER_GROUND_Y_RATIO
	for index in range(grocery_shoppers.size() - 1, -1, -1):
		var shopper: Dictionary = grocery_shoppers[index]
		var container: Node2D = shopper["container"]
		var sprite: AnimatedSprite2D = shopper["sprite"]
		var phase: String = shopper["phase"]
		if phase == "walking_in":
			var distance := float(shopper["target_x"]) - container.position.x
			var step := GROCERY_WALK_SPEED * delta
			if absf(distance) <= step + 0.5:
				container.position.x = float(shopper["target_x"])
				container.position.y = target_y
				shopper["phase"] = "shopping"
				shopper["timer"] = 2.35
				sprite.sprite_frames = shopper["browse_frames"]
				sprite.animation = "browse"
				sprite.scale = Vector2.ONE * 0.108
				sprite.position = Vector2(0.0, -42.0)
				sprite.play("browse")
				shopper["bubble"].visible = true
			else:
				container.position.x += signf(distance) * step
				var approach := clampf(1.0 - absf(distance) / GROCERY_APPROACH_DISTANCE, 0.0, 1.0)
				container.position.y = lerpf(ground_y, target_y, _smooth_step(0.52, 1.0, approach))
		elif phase == "shopping":
			shopper["timer"] = float(shopper["timer"]) - delta
			if float(shopper["timer"]) <= 0.0:
				shopper["phase"] = "walking_out"
				shopper["bubble"].visible = false
				_set_grocery_walk_pose(shopper)
				shopper["target_x"] = _get_viewport_exit_x(float(shopper["direction"]), container.position.x)
				shopper["exit_distance"] = maxf(absf(float(shopper["target_x"]) - container.position.x), 1.0)
		else:
			var distance := float(shopper["target_x"]) - container.position.x
			var step := GROCERY_WALK_SPEED * delta
			if absf(distance) <= step + 0.5:
				container.queue_free()
				grocery_shoppers.remove_at(index)
				grocery_spawn_cooldown = randf_range(GROCERY_SPAWN_MIN, GROCERY_SPAWN_MAX)
				continue
			container.position.x += signf(distance) * step
			var exit_progress := clampf(1.0 - absf(distance) / float(shopper["exit_distance"]), 0.0, 1.0)
			container.position.y = lerpf(target_y, ground_y, _smooth_step(0.0, 1.0, exit_progress))
		container.z_index = 50 + int(container.position.y / 20.0)
		var shadow: Sprite2D = container.get_node("GroundShadow")
		shadow.position = Vector2.ZERO
		if shopper["phase"] != "shopping":
			sprite.position = Vector2(0.0, -WALK_FRAME_SIZE.y * sprite.scale.y * 0.47)
	if grocery_shoppers.is_empty() and grocery_spawn_cooldown <= 0.0:
		if not _try_spawn_grocery_shopper():
			grocery_spawn_cooldown = 1.1


func _on_game_changed(snapshot: Dictionary) -> void:
	_set_shop_stage(snapshot["cart_level"])
	_sync_customers(snapshot)
	if snapshot["service_mode"] == "street":
		camera.enabled = true
		camera.make_current()
	else:
		camera.enabled = false


func _sync_customers(snapshot: Dictionary) -> void:
	var active_ids: Array[String] = []
	var customer_list: Array = snapshot["customers"]
	for index in customer_list.size():
		var customer: Dictionary = customer_list[index]
		var customer_id := str(customer["id"])
		active_ids.append(customer_id)
		if not customer_sprites.has(customer_id):
			var appearance_options: Array = CUSTOMER_SHEETS[customer["type"]]
			var appearance_index := posmod(int(customer["id"]) - 1, appearance_options.size())
			var path: String = appearance_options[appearance_index]
			var sprite := _create_walker(path, "Customer_%s" % customer_id, 0.205)
			sprite.z_index = 80 + index
			add_child(sprite)
			customer_sprites[customer_id] = sprite
		var walk_progress := clampf(float(customer.get("walk_seconds", 0)) / 3.0, 0.0, 1.0)
		var customer_x := lerpf(795.0, 1035.0 + index * 74.0, walk_progress)
		var sprite_node: AnimatedSprite2D = customer_sprites[customer_id]
		sprite_node.position = Vector2(customer_x, 956.0 + index * 12.0 - 192.0 * sprite_node.scale.y)
		if customer["status"] == "waiting":
			sprite_node.flip_h = false
	for customer_id in customer_sprites.keys():
		if customer_id not in active_ids:
			customer_sprites[customer_id].queue_free()
			customer_sprites.erase(customer_id)


func _animate_canopies() -> void:
	var weather := _get_weather_state(world_seconds)
	var daylight := _daylight_strength(world_seconds)
	for index in canopy_pivots.size():
		var pivot: Node2D = canopy_pivots[index]
		var period: float = pivot.get_meta("wind_period")
		var phase: float = pivot.get_meta("wind_phase")
		var sway := sin(world_seconds / period + phase)
		pivot.rotation = sway * (0.018 + float(weather["wind"]) * 0.026)
		var shimmer := 0.92 + sin(world_seconds / (3.8 + float(index) * 0.26) + phase) * 0.08
		var sunlight_alpha := daylight * (1.0 - float(weather["cloud_cover"]) * 0.72) * (1.0 - float(weather["rain"]) * 0.72) * 0.105 * shimmer
		canopy_sunlight_layers[index].modulate = Color(1.0, 0.79, 0.47, sunlight_alpha) if _twilight_strength(world_seconds) > 0.1 else Color(1.0, 0.9, 0.65, sunlight_alpha)


func _animate_atmosphere(delta: float) -> void:
	if sun_sprite == null or day_night_atlas == null:
		return
	var phase := _get_day_phase(world_seconds)
	var weather := _get_weather_state(world_seconds)
	var daylight := _daylight_strength(world_seconds)
	var night := 1.0 - daylight
	var sun_height := cos((phase - 0.5) * TAU)
	var twilight := clampf(1.0 - absf(sun_height) / 0.34, 0.0, 1.0)
	var is_day_arc := phase >= 0.25 and phase <= 0.75
	var sun_progress := (phase - 0.25) / 0.5 if is_day_arc else 0.0
	var sky_y := MAP_SIZE.y * 0.035
	var sun_x := MAP_SIZE.x * (0.045 + sun_progress * 0.91)
	var sun_opacity := maxf(daylight, twilight * 0.42) * (1.0 - float(weather["cloud_cover"]) * 0.45) if is_day_arc else 0.0
	var desired_sun_frame := SUNSET_FRAME if twilight > 0.24 else SUN_FRAME
	var current_sun_texture := sun_sprite.texture as AtlasTexture
	if current_sun_texture == null or current_sun_texture.region != desired_sun_frame:
		sun_sprite.texture = _atlas_frame(day_night_atlas, desired_sun_frame)
	sun_sprite.position = Vector2(sun_x, sky_y)
	_set_atmosphere_sprite_size(sun_sprite, Vector2(26.0, 28.0) * 0.8)
	sun_sprite.modulate.a = sun_opacity * 0.12
	var moon_progress := fposmod(sun_progress + 0.5, 1.0)
	moon_sprite.position = Vector2(MAP_SIZE.x * (0.045 + moon_progress * 0.91), sky_y)
	_set_atmosphere_sprite_size(moon_sprite, Vector2(22.0, 28.0) * 0.8)
	moon_sprite.modulate.a = clampf((night - 0.58) / 0.42, 0.0, 1.0) * (1.0 - float(weather["cloud_cover"]) * 0.36) * 0.58
	for index in star_sprites.size():
		var star := star_sprites[index]
		star.position = Vector2(MAP_SIZE.x * (0.055 + fposmod(index * 0.173, 0.89)), MAP_SIZE.y * (0.014 + float(index % 4) * 0.011))
		var twinkle := 0.58 + (sin(world_seconds * 1000.0 / (520.0 + index * 19.0) + index) + 1.0) * 0.18
		_set_atmosphere_sprite_size(star, Vector2.ONE * (5.0 + float(index % 3) * 2.0) * 0.8)
		star.modulate.a = night * night * (1.0 - float(weather["cloud_cover"]) * 0.75) * twinkle
	for cloud_data in ambient_clouds:
		var cloud: Sprite2D = cloud_data["node"]
		cloud.position.x += (float(cloud_data["speed"]) + float(weather["wind"]) * 16.0) * delta / 0.75
		if cloud.position.x > MAP_SIZE.x + float(cloud_data["width"]):
			cloud.position.x = -float(cloud_data["width"])
		cloud.position.y = MAP_SIZE.y * 0.038 + sin(world_seconds / 4.7 + float(cloud_data["phase"])) * 3.0 * 0.8 / 0.75
		var cloud_size := Vector2(float(cloud_data["width"]), float(cloud_data["height"])) * 0.8 * 0.56 / 0.75
		_set_atmosphere_sprite_size(cloud, cloud_size)
		cloud.modulate.a = 0.25 + float(weather["cloud_cover"]) * 0.22
		cloud.modulate = Color(0.71, 0.74, 0.85, cloud.modulate.a) if night > 0.55 else Color(1.0, 0.85, 0.69, cloud.modulate.a) if twilight > 0.1 else Color(1, 1, 1, cloud.modulate.a)


func _set_atmosphere_sprite_size(sprite: Sprite2D, screen_size: Vector2) -> void:
	if sprite.texture == null:
		return
	var frame_size := sprite.texture.get_size()
	sprite.scale = Vector2(screen_size.x / 0.75 / frame_size.x, screen_size.y / 0.75 / frame_size.y)


func _build_rain() -> void:
	for index in 48:
		var drop := Line2D.new()
		drop.name = "RainDrop%d" % index
		drop.points = PackedVector2Array([Vector2.ZERO, Vector2(-4.0, 18.0)])
		drop.width = 2.0
		drop.default_color = Color(0.75, 0.88, 0.98, 0.0)
		drop.position = Vector2(randf() * MAP_SIZE.x, randf() * MAP_SIZE.y)
		drop.z_index = 100
		drop.visible = false
		add_child(drop)
		rain_drops.append({"node": drop, "speed": 360.0 + float(index % 5) * 32.0, "drift": 40.0 + float(index % 4) * 12.0})


func _animate_rain(delta: float) -> void:
	var weather := _get_weather_state(world_seconds)
	var rain_amount := float(weather["rain"])
	for drop_data in rain_drops:
		var drop: Line2D = drop_data["node"]
		drop.visible = rain_amount > 0.04
		if not drop.visible:
			continue
		drop.default_color = Color(0.75, 0.88, 0.98, rain_amount * 0.48)
		drop.position.x += float(drop_data["drift"]) * float(weather["wind"]) * delta
		drop.position.y += float(drop_data["speed"]) * delta
		if drop.position.y > MAP_SIZE.y + 20.0:
			drop.position.y = -24.0
			drop.position.x = fposmod(drop.position.x + MAP_SIZE.x * 0.41, MAP_SIZE.x)


func _get_weather_state(seconds: float) -> Dictionary:
	var cycle := fposmod(seconds, 360.0) / 360.0
	var overcast := _smooth_step(0.48, 0.60, cycle) * (1.0 - _smooth_step(0.75, 0.84, cycle))
	var rainy_window := _smooth_step(0.77, 0.82, cycle) * (1.0 - _smooth_step(0.91, 0.96, cycle))
	var gust_window := _smooth_step(0.64, 0.72, cycle) * (1.0 - _smooth_step(0.91, 0.98, cycle))
	var cloud_cover := 0.12 + overcast * 0.66 + rainy_window * 0.18
	var wind := 0.15 + gust_window * 0.5 + rainy_window * 0.28
	return {"cloud_cover": cloud_cover, "rain": rainy_window * 0.86, "wind": wind}


func _daylight_strength(seconds: float) -> float:
	var phase := _get_day_phase(seconds)
	var sun_height := cos((phase - 0.5) * TAU)
	return _smooth_step(-0.12, 0.18, sun_height)


func _twilight_strength(seconds: float) -> float:
	var phase := _get_day_phase(seconds)
	var sun_height := cos((phase - 0.5) * TAU)
	return clampf(1.0 - absf(sun_height) / 0.34, 0.0, 1.0)


func _get_day_phase(seconds: float) -> float:
	return fposmod(START_DAY_PHASE + seconds / DAY_LENGTH_SECONDS, 1.0)


func get_environment_status() -> String:
	var phase := _get_day_phase(world_seconds)
	var clock_hours := floori(phase * 24.0) % 24
	var clock_minutes := floori(fposmod(phase * 24.0 * 60.0, 60.0) / 5.0) * 5
	var weather := _get_weather_state(world_seconds)
	var weather_label := "Mưa rào" if float(weather["rain"]) > 0.08 else "Mây che nắng" if float(weather["cloud_cover"]) > 0.56 else "Gió nhẹ" if float(weather["wind"]) > 0.15 else "Nắng nhẹ"
	return "%02d:%02d · %s · Sài Gòn" % [clock_hours, clock_minutes, weather_label]


func _smooth_step(edge_start: float, edge_end: float, value: float) -> float:
	var amount := clampf((value - edge_start) / (edge_end - edge_start), 0.0, 1.0)
	return amount * amount * (3.0 - 2.0 * amount)


func _move_ambient_walkers(delta: float) -> void:
	for walker in ambient_walkers:
		var sprite: AnimatedSprite2D = walker["sprite"]
		var shadow: Sprite2D = walker["shadow"]
		var direction: float = walker["direction"]
		if bool(walker["is_cat"]):
			if bool(walker["paused"]):
				if world_seconds >= float(walker["pause_until"]):
					walker["paused"] = false
					walker["pause_clock"] = world_seconds + 11.0
					sprite.play("walk")
				else:
					shadow.position.x = sprite.position.x
					continue
			elif world_seconds >= float(walker["pause_clock"]):
				walker["paused"] = true
				walker["pause_until"] = world_seconds + 8.0
				sprite.play("sit")
				shadow.position.x = sprite.position.x
				continue
		sprite.position.x += direction * walker["speed"] * delta
		if sprite.position.x > MAP_SIZE.x + 70.0:
			sprite.position.x = -70.0
		elif sprite.position.x < -70.0:
			sprite.position.x = MAP_SIZE.x + 70.0
		shadow.position.x = sprite.position.x


func _animate_pigeons(delta: float) -> void:
	for pigeon in pigeons:
		var sprite: AnimatedSprite2D = pigeon["sprite"]
		var shadow: Sprite2D = pigeon["shadow"]
		var state: String = str(pigeon["state"])
		var direction: float = float(pigeon["direction"])
		var timer: float = float(pigeon["state_timer"]) - delta
		pigeon["state_timer"] = timer
		if state == "walking":
			pigeon["x"] = float(pigeon["x"]) + direction * float(pigeon["speed"]) * delta
			if float(pigeon["x"]) <= float(pigeon["min_x"]):
				pigeon["direction"] = 1.0
			elif float(pigeon["x"]) >= float(pigeon["max_x"]):
				pigeon["direction"] = -1.0
			if timer <= 0.0:
				pigeon["state"] = "eating"
				pigeon["state_timer"] = 1.3
				sprite.play("eat")
		elif state == "eating" and timer <= 0.0:
			var pecks: int = int(pigeon["peck_count"]) + 1
			pigeon["peck_count"] = pecks
			if pecks >= 3 or (pecks > 0 and randf() < 0.12):
				pigeon["peck_count"] = 0
				pigeon["state"] = "flying"
				pigeon["state_timer"] = 1.5
				pigeon["speed"] = randf_range(78.0, 105.0)
				sprite.play("fly")
			else:
				pigeon["state"] = "walking"
				pigeon["state_timer"] = randf_range(3.2, 6.5)
				sprite.play("walk")
		elif state == "flying":
			pigeon["x"] = float(pigeon["x"]) + direction * float(pigeon["speed"]) * delta
			pigeon["y"] = float(pigeon["y"]) - 23.0 * delta
			if timer <= 0.0:
				pigeon["x"] = clampf(float(pigeon["x"]), float(pigeon["min_x"]), float(pigeon["max_x"]))
				pigeon["y"] = float(pigeon["home_y"])
				pigeon["speed"] = randf_range(16.0, 22.0)
				pigeon["state"] = "walking"
				pigeon["state_timer"] = randf_range(2.0, 4.5)
				sprite.play("walk")
		sprite.flip_h = float(pigeon["direction"]) < 0.0
		sprite.position = Vector2(float(pigeon["x"]), float(pigeon["y"]))
		shadow.position = Vector2(float(pigeon["x"]), float(pigeon["home_y"]) + 1.5)
		shadow.visible = str(pigeon["state"]) != "flying"


func _update_time_of_day() -> void:
	var phase := _get_day_phase(world_seconds)
	var stops := [0.0, 0.25, 0.5, 0.75, 1.0]
	var moods := ["night", "morning", "afternoon", "sunset", "night"]
	var segment := 0
	while segment < stops.size() - 2 and phase >= stops[segment + 1]:
		segment += 1
	var transition := _smooth_step(stops[segment], stops[segment + 1], phase)
	var from_path := "res://assets/backgrounds/time-of-day/%s.png" % moods[segment]
	var to_path := "res://assets/backgrounds/time-of-day/%s.png" % moods[segment + 1]
	if street.texture.resource_path != from_path:
		street.texture = load(from_path)
		street.texture_filter = CanvasItem.TEXTURE_FILTER_LINEAR
	if street_transition.texture.resource_path != to_path:
		street_transition.texture = load(to_path)
		street_transition.texture_filter = CanvasItem.TEXTURE_FILTER_LINEAR
	street_transition.modulate.a = transition
	var weather := _get_weather_state(world_seconds)
	var overcast_amount := _smooth_step(0.08, 0.72, float(weather["rain"])) * _daylight_strength(world_seconds) * 0.95
	street_rain.modulate.a = overcast_amount


func _begin_drag(point: Vector2) -> void:
	if not camera.enabled:
		return
	is_dragging = true
	drag_start = point
	camera_x_at_drag_start = camera.position.x


func _update_drag(point: Vector2) -> void:
	if not is_dragging or not camera.enabled:
		return
	var half_view_width := get_viewport_rect().size.x / camera.zoom.x * 0.5
	camera.position.x = clampf(camera_x_at_drag_start - (point.x - drag_start.x) / camera.zoom.x, half_view_width, MAP_SIZE.x - half_view_width)


func _sync_camera_bounds() -> void:
	if camera == null:
		return
	var half_view_width := get_viewport_rect().size.x / camera.zoom.x * 0.5
	camera.position.x = clampf(camera.position.x, half_view_width, MAP_SIZE.x - half_view_width)
	camera.position.y = MAP_SIZE.y * 0.5


func center_on_shop() -> void:
	if camera != null:
		camera.position.x = 1090.0
		_sync_camera_bounds()

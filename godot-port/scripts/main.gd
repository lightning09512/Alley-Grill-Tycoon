extends Node2D

const STREET_SCENE := preload("res://scenes/street.tscn")
const DINING_SCENE := preload("res://scenes/dining_room.tscn")
const MUSIC_PLAYER_SCRIPT := preload("res://scripts/music_player.gd")

const TAB_LABELS := {
	"outside": "Bên ngoài",
	"shop": "Cửa tiệm",
	"staff": "Nhân viên",
	"menu": "Thực đơn",
	"recipes": "Sổ món",
	"stock": "Cửa hàng",
}

var street_world: Node2D
var dining_canvas: CanvasLayer
var dining_world: Node2D
var ui_layer: CanvasLayer
var ui_root: Control
var header_panel: PanelContainer
var status_panel: PanelContainer
var navigation_panel: PanelContainer
var dining_toolbar: PanelContainer
var header_title: Label
var dining_title_label: Label
var dining_status_label: Label
var wallet_label: Label
var reputation_label: Label
var status_label: Label
var fullscreen_button: Button
var wallet_pill: PanelContainer
var reputation_pill: PanelContainer
var door_button: Button
var sheet: PanelContainer
var sheet_title: Label
var sheet_body: VBoxContainer
var name_overlay: ColorRect
var name_input: LineEdit
var name_error: Label
var music_player: Node
var music_button: Button
var music_popup_button: Button
var music_slider: HSlider
var music_popup: PanelContainer
var active_tab := "outside"
var dining_view := "tables"
var editing_name := false
var status_refresh_accumulator := 0.0


func _ready() -> void:
	music_player = MUSIC_PLAYER_SCRIPT.new()
	music_player.name = "MusicPlayer"
	add_child(music_player)
	music_player.connect("state_changed", _on_music_state_changed)
	_build_worlds()
	_build_interface()
	var music_state: Dictionary = music_player.call("get_state")
	_on_music_state_changed(music_state["enabled"], music_state["volume_percent"], music_state["track_name"])
	GameState.changed.connect(_on_game_changed)
	_on_game_changed(GameState.get_snapshot())
	if GameState.store_name.is_empty():
		_show_name_dialog(false)
	elif not GameState.in_shift:
		GameState.start_shift()


func _process(delta: float) -> void:
	status_refresh_accumulator += delta
	if status_refresh_accumulator < 0.5:
		return
	status_refresh_accumulator = fmod(status_refresh_accumulator, 0.5)
	if status_label != null:
		_update_status_bar(GameState.get_snapshot())


func _build_worlds() -> void:
	street_world = STREET_SCENE.instantiate()
	street_world.name = "StreetWorld"
	add_child(street_world)
	dining_canvas = CanvasLayer.new()
	dining_canvas.name = "DiningWorldCanvas"
	dining_canvas.layer = 1
	add_child(dining_canvas)
	dining_world = DINING_SCENE.instantiate()
	dining_world.name = "DiningRoomWorld"
	dining_canvas.add_child(dining_world)


func _build_interface() -> void:
	ui_layer = CanvasLayer.new()
	ui_layer.name = "GameInterface"
	ui_layer.layer = 10
	add_child(ui_layer)
	ui_root = Control.new()
	ui_root.name = "InterfaceRoot"
	ui_root.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	ui_root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui_layer.add_child(ui_root)
	_build_header()
	_build_status_bar()
	_build_dining_toolbar()
	_build_sheet()
	_build_navigation()
	_build_door_button()
	_build_name_dialog()
	_apply_responsive_header()
	get_viewport().size_changed.connect(_apply_responsive_header)


func _build_header() -> void:
	header_panel = PanelContainer.new()
	var panel := header_panel
	panel.name = "TopBar"
	panel.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	panel.offset_left = 12.0
	panel.offset_right = -12.0
	panel.offset_top = 7.0
	panel.offset_bottom = 54.0
	panel.add_theme_stylebox_override("panel", StyleBoxEmpty.new())
	ui_root.add_child(panel)
	var row := HBoxContainer.new()
	row.name = "HeaderRow"
	row.add_theme_constant_override("separation", 5)
	panel.add_child(row)
	var brand_lockup := HBoxContainer.new()
	brand_lockup.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	brand_lockup.alignment = BoxContainer.ALIGNMENT_CENTER
	brand_lockup.add_theme_constant_override("separation", 6)
	row.add_child(brand_lockup)
	var brand_mark := PanelContainer.new()
	brand_mark.custom_minimum_size = Vector2(36.0, 36.0)
	var brand_style := _panel_style(Color(0.08, 0.27, 0.24, 0.96), Color(0.82, 0.8, 0.65, 0.86), 12)
	brand_style.content_margin_left = 2.0
	brand_style.content_margin_top = 2.0
	brand_style.content_margin_right = 2.0
	brand_style.content_margin_bottom = 2.0
	brand_mark.add_theme_stylebox_override("panel", brand_style)
	brand_lockup.add_child(brand_mark)
	var brand_icon := TextureRect.new()
	brand_icon.texture = load("res://assets/ui/navigation/brand.svg") as Texture2D
	brand_icon.custom_minimum_size = Vector2(30.0, 30.0)
	brand_icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	brand_icon.mouse_filter = Control.MOUSE_FILTER_IGNORE
	brand_mark.add_child(brand_icon)
	var brand := VBoxContainer.new()
	brand.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	brand.add_theme_constant_override("separation", 0)
	brand_lockup.add_child(brand)
	var eyebrow := _label("TYCOON PHỐ SÀI GÒN", 10, Color(0.94, 0.81, 0.55))
	brand.add_child(eyebrow)
	header_title = _label("Quán Nhậu Hẻm", 17, Color(1.0, 0.91, 0.68))
	header_title.autowrap_mode = TextServer.AUTOWRAP_OFF
	header_title.clip_text = true
	header_title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	brand.add_child(header_title)
	var music_controls := VBoxContainer.new()
	music_controls.custom_minimum_size.x = 36.0
	music_controls.alignment = BoxContainer.ALIGNMENT_CENTER
	music_controls.add_theme_constant_override("separation", 0)
	row.add_child(music_controls)
	music_button = Button.new()
	music_button.text = "♫"
	music_button.custom_minimum_size = Vector2(34, 34)
	music_button.add_theme_font_size_override("font_size", 16)
	music_button.add_theme_color_override("font_color", Color.WHITE)
	music_button.add_theme_stylebox_override("normal", _panel_style(Color(0.17, 0.39, 0.53, 1.0), Color(0.49, 0.73, 0.86, 0.9), 10))
	music_button.add_theme_stylebox_override("hover", _panel_style(Color(0.27, 0.52, 0.67, 1.0), Color(0.82, 0.91, 0.97, 1.0), 10))
	music_button.pressed.connect(_toggle_music_popup)
	music_controls.add_child(music_button)
	music_popup = PanelContainer.new()
	music_popup.name = "MusicVolumePopover"
	music_popup.anchor_left = 1.0
	music_popup.anchor_right = 1.0
	music_popup.offset_left = -218.0
	music_popup.offset_right = -12.0
	music_popup.offset_top = 53.0
	music_popup.offset_bottom = 101.0
	music_popup.visible = false
	music_popup.z_index = 30
	music_popup.add_theme_stylebox_override("panel", _panel_style(Color(0.98, 0.96, 0.91, 0.98), Color(0.77, 0.59, 0.34, 0.92), 14))
	ui_root.add_child(music_popup)
	var music_row := HBoxContainer.new()
	music_row.add_theme_constant_override("separation", 7)
	music_popup.add_child(music_row)
	music_popup_button = Button.new()
	music_popup_button.custom_minimum_size = Vector2(34, 30)
	music_popup_button.add_theme_font_size_override("font_size", 15)
	music_popup_button.add_theme_color_override("font_color", Color(0.24, 0.32, 0.27))
	music_popup_button.add_theme_stylebox_override("normal", _panel_style(Color(1.0, 0.99, 0.96), Color(0.88, 0.82, 0.7), 9))
	music_popup_button.pressed.connect(func(): music_player.call("toggle_music"))
	music_row.add_child(music_popup_button)
	music_slider = HSlider.new()
	music_slider.min_value = 0.0
	music_slider.max_value = 40.0
	music_slider.step = 1.0
	music_slider.value = 16.0
	music_slider.custom_minimum_size = Vector2(135, 22)
	music_slider.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	music_slider.value_changed.connect(func(value: float): music_player.call("set_volume_percent", roundi(value)))
	music_row.add_child(music_slider)
	fullscreen_button = Button.new()
	fullscreen_button.text = "⛶"
	fullscreen_button.tooltip_text = "Toàn màn hình"
	fullscreen_button.custom_minimum_size = Vector2(34, 42)
	fullscreen_button.add_theme_font_size_override("font_size", 21)
	fullscreen_button.add_theme_color_override("font_color", Color.WHITE)
	fullscreen_button.add_theme_stylebox_override("normal", _panel_style(Color(0.17, 0.39, 0.53, 1.0), Color(0.49, 0.73, 0.86, 0.9), 10))
	fullscreen_button.add_theme_stylebox_override("hover", _panel_style(Color(0.27, 0.52, 0.67, 1.0), Color(0.82, 0.91, 0.97, 1.0), 10))
	fullscreen_button.pressed.connect(_toggle_fullscreen)
	row.add_child(fullscreen_button)
	var stats := HBoxContainer.new()
	stats.alignment = BoxContainer.ALIGNMENT_CENTER
	stats.add_theme_constant_override("separation", 4)
	row.add_child(stats)
	wallet_pill = PanelContainer.new()
	wallet_pill.add_theme_stylebox_override("panel", _panel_style(Color(1.0, 0.96, 0.84, 0.97), Color(0.94, 0.77, 0.43, 0.95), 12))
	stats.add_child(wallet_pill)
	wallet_label = _label("💰 100 xu", 12, Color(0.2, 0.31, 0.32))
	wallet_label.autowrap_mode = TextServer.AUTOWRAP_OFF
	wallet_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	wallet_pill.add_child(wallet_label)
	reputation_pill = PanelContainer.new()
	reputation_pill.add_theme_stylebox_override("panel", _panel_style(Color(1.0, 0.96, 0.84, 0.97), Color(0.94, 0.77, 0.43, 0.95), 12))
	stats.add_child(reputation_pill)
	reputation_label = _label("★ 0", 12, Color(0.2, 0.31, 0.32))
	reputation_label.autowrap_mode = TextServer.AUTOWRAP_OFF
	reputation_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	reputation_pill.add_child(reputation_label)


func _apply_responsive_header() -> void:
	if header_panel == null or wallet_label == null or reputation_label == null:
		return
	var compact := get_viewport_rect().size.x < 500.0
	header_panel.offset_left = 7.0 if compact else 12.0
	header_panel.offset_right = -7.0 if compact else -12.0
	fullscreen_button.visible = not compact
	fullscreen_button.custom_minimum_size = Vector2(30.0 if compact else 34.0, 34.0 if compact else 42.0)
	music_button.custom_minimum_size = Vector2(30.0 if compact else 34.0, 32.0 if compact else 34.0)
	wallet_pill.custom_minimum_size.x = 78.0 if compact else 92.0
	reputation_pill.custom_minimum_size.x = 42.0 if compact else 50.0
	wallet_label.add_theme_font_size_override("font_size", 10 if compact else 12)
	reputation_label.add_theme_font_size_override("font_size", 10 if compact else 12)
	header_title.add_theme_font_size_override("font_size", 13 if compact else 17)


func _build_status_bar() -> void:
	status_panel = PanelContainer.new()
	var panel := status_panel
	panel.name = "StreetStatus"
	panel.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	panel.offset_left = 14.0
	panel.offset_right = -14.0
	panel.offset_top = 61.0
	panel.offset_bottom = 93.0
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.04, 0.25, 0.21, 0.91), Color(0.42, 0.75, 0.51, 0.75), 14))
	ui_root.add_child(panel)
	status_label = _label("Góc phố thân quen", 10, Color(0.96, 0.98, 0.9))
	status_label.autowrap_mode = TextServer.AUTOWRAP_OFF
	status_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	status_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	panel.add_child(status_label)


func _build_dining_toolbar() -> void:
	dining_toolbar = PanelContainer.new()
	dining_toolbar.name = "DiningToolbar"
	dining_toolbar.set_anchors_and_offsets_preset(Control.PRESET_TOP_LEFT)
	dining_toolbar.offset_left = 10.0
	dining_toolbar.offset_top = 8.0
	dining_toolbar.offset_right = 288.0
	dining_toolbar.offset_bottom = 50.0
	dining_toolbar.visible = false
	dining_toolbar.add_theme_stylebox_override("panel", _panel_style(Color(0.055, 0.16, 0.19, 0.94), Color(0.89, 0.83, 0.69, 0.58), 12))
	ui_root.add_child(dining_toolbar)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 7)
	dining_toolbar.add_child(row)
	var title_box := VBoxContainer.new()
	title_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	title_box.add_theme_constant_override("separation", 0)
	row.add_child(title_box)
	dining_title_label = _label("PHÒNG ĂN", 9, Color(1.0, 0.86, 0.56))
	title_box.add_child(dining_title_label)
	dining_status_label = _label("Khách sẽ tự chọn bàn trống", 8, Color(0.95, 0.9, 0.77))
	title_box.add_child(dining_status_label)
	var exit_button := _button("↩ Phố", _toggle_location, 30)
	exit_button.custom_minimum_size.x = 64.0
	exit_button.add_theme_font_size_override("font_size", 10)
	exit_button.add_theme_color_override("font_color", Color(0.25, 0.35, 0.31))
	row.add_child(exit_button)


func _build_door_button() -> void:
	door_button = _button("🍽  Vào phòng ăn", _toggle_location, 42)
	door_button.add_theme_color_override("font_color", Color(1.0, 0.96, 0.85))
	door_button.add_theme_stylebox_override("normal", _panel_style(Color(0.72, 0.37, 0.2, 0.96), Color(0.98, 0.75, 0.47, 0.94), 14))
	door_button.add_theme_stylebox_override("hover", _panel_style(Color(0.83, 0.46, 0.25, 1.0), Color(1.0, 0.88, 0.66, 1.0), 14))
	door_button.set_anchors_and_offsets_preset(Control.PRESET_TOP_RIGHT)
	door_button.anchor_left = 0.54
	door_button.anchor_right = 0.97
	door_button.offset_left = 0.0
	door_button.offset_right = 0.0
	door_button.offset_top = 101.0
	door_button.offset_bottom = 145.0
	ui_root.add_child(door_button)


func _build_sheet() -> void:
	sheet = PanelContainer.new()
	sheet.name = "ManagementSheet"
	sheet.anchor_left = 0.025
	sheet.anchor_top = 1.0
	sheet.anchor_right = 0.975
	sheet.anchor_bottom = 1.0
	sheet.offset_left = 0.0
	sheet.offset_top = -366.0
	sheet.offset_right = 0.0
	sheet.offset_bottom = -96.0
	sheet.add_theme_stylebox_override("panel", _panel_style(Color(0.98, 0.96, 0.91, 0.98), Color(0.77, 0.59, 0.34, 0.92), 22))
	ui_root.add_child(sheet)
	var content := VBoxContainer.new()
	content.add_theme_constant_override("separation", 4)
	sheet.add_child(content)
	var title_row := HBoxContainer.new()
	content.add_child(title_row)
	sheet_title = _label("Đang phục vụ", 17, Color(0.12, 0.26, 0.39))
	sheet_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	title_row.add_child(sheet_title)
	var close_button := _button("×", func(): select_tab("outside"), 30)
	close_button.custom_minimum_size.x = 36
	close_button.add_theme_font_size_override("font_size", 20)
	title_row.add_child(close_button)
	var separator := HSeparator.new()
	content.add_child(separator)
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	content.add_child(scroll)
	sheet_body = VBoxContainer.new()
	sheet_body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	sheet_body.add_theme_constant_override("separation", 7)
	scroll.add_child(sheet_body)


func _build_navigation() -> void:
	navigation_panel = PanelContainer.new()
	var panel := navigation_panel
	panel.name = "BottomNavigation"
	panel.set_anchors_and_offsets_preset(Control.PRESET_BOTTOM_WIDE)
	panel.offset_left = 8.0
	panel.offset_right = -8.0
	panel.offset_top = -88.0
	panel.offset_bottom = -7.0
	panel.add_theme_stylebox_override("panel", _panel_style(Color(0.035, 0.12, 0.16, 0.3), Color(0.83, 0.75, 0.57, 0.18), 18))
	ui_root.add_child(panel)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 3)
	panel.add_child(row)
	for tab in ["outside", "shop", "staff", "menu", "recipes", "stock"]:
		var button := Button.new()
		button.name = "Tab_%s" % tab
		button.custom_minimum_size.y = 66.0
		button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		button.add_theme_color_override("font_color", Color.TRANSPARENT)
		button.add_theme_stylebox_override("normal", _panel_style(Color(0.07, 0.19, 0.22, 0.16), Color(0.83, 0.75, 0.57, 0.12), 12))
		button.add_theme_stylebox_override("hover", _panel_style(Color(0.11, 0.31, 0.32, 0.48), Color(0.88, 0.75, 0.46, 0.7), 12))
		button.pressed.connect(select_tab.bind(tab))
		row.add_child(button)
		var content := VBoxContainer.new()
		content.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		content.offset_left = 1.0
		content.offset_top = 2.0
		content.offset_right = -1.0
		content.offset_bottom = -1.0
		content.alignment = BoxContainer.ALIGNMENT_CENTER
		content.add_theme_constant_override("separation", 0)
		content.mouse_filter = Control.MOUSE_FILTER_IGNORE
		button.add_child(content)
		var icon := TextureRect.new()
		icon.name = "NavIcon"
		icon.texture = load("res://assets/ui/navigation/%s.svg" % tab) as Texture2D
		icon.custom_minimum_size = Vector2(30.0, 30.0)
		icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		icon.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		icon.mouse_filter = Control.MOUSE_FILTER_IGNORE
		content.add_child(icon)
		var caption := _label(TAB_LABELS[tab], 8, Color(1.0, 0.96, 0.85))
		caption.name = "NavLabel"
		caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		caption.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		caption.mouse_filter = Control.MOUSE_FILTER_IGNORE
		content.add_child(caption)


func _build_name_dialog() -> void:
	name_overlay = ColorRect.new()
	name_overlay.name = "StoreNameDialogBackdrop"
	name_overlay.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	name_overlay.color = Color(0.015, 0.04, 0.07, 0.76)
	name_overlay.mouse_filter = Control.MOUSE_FILTER_STOP
	name_overlay.visible = false
	ui_root.add_child(name_overlay)
	var card := PanelContainer.new()
	card.name = "StoreNameCard"
	card.anchor_left = 0.07
	card.anchor_top = 0.35
	card.anchor_right = 0.93
	card.anchor_bottom = 0.65
	card.add_theme_stylebox_override("panel", _panel_style(Color(0.95, 0.97, 0.97, 1.0), Color(0.95, 0.73, 0.34, 1.0), 22))
	name_overlay.add_child(card)
	var body := VBoxContainer.new()
	body.add_theme_constant_override("separation", 8)
	card.add_child(body)
	body.add_child(_label("BẮT ĐẦU CÂU CHUYỆN CỦA BẠN", 11, Color(0.18, 0.48, 0.52)))
	body.add_child(_label("Đặt tên cho cửa tiệm", 21, Color(0.13, 0.25, 0.34)))
	name_input = LineEdit.new()
	name_input.placeholder_text = "Ví dụ: Quán Nhậu Cô Ba"
	name_input.max_length = 24
	name_input.custom_minimum_size.y = 42.0
	body.add_child(name_input)
	name_error = _label("", 12, Color(0.72, 0.22, 0.18))
	body.add_child(name_error)
	var actions := HBoxContainer.new()
	body.add_child(actions)
	var cancel := _button("Để sau", func(): _cancel_name_dialog(), 42)
	actions.add_child(cancel)
	var save := _button("Bắt đầu ở góc phố", _save_store_name, 42)
	save.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	actions.add_child(save)
	name_input.text_submitted.connect(func(_text: String): _save_store_name())


func _on_game_changed(snapshot: Dictionary) -> void:
	var is_dining: bool = snapshot["service_mode"] == "dining"
	street_world.visible = not is_dining
	if header_title:
		header_panel.visible = not is_dining
		status_panel.visible = not is_dining
		dining_toolbar.visible = is_dining
		door_button.visible = not is_dining
		header_title.text = snapshot["store_name"] if not snapshot["store_name"].is_empty() else "Quán Nhậu Hẻm"
		wallet_label.text = "💰 %s xu" % _format_number(snapshot["coins"])
		reputation_label.text = "★ %s" % _format_number(snapshot["reputation"])
		if dining_status_label != null:
			dining_status_label.text = "Phiếu bếp và nguyên liệu" if dining_view == "kitchen" else "Khách tự chọn bàn trống"
		_update_status_bar(snapshot)
		door_button.text = "🌇  Ra phố" if snapshot["service_mode"] == "dining" else "🍽  Vào phòng ăn"
		_render_tab(snapshot)
		_update_nav_styles()


func _update_status_bar(snapshot: Dictionary) -> void:
	if status_label == null:
		return
	var mode_text := "PHỐ ĐANG NHỘN NHỊP" if snapshot["in_shift"] else "GÓC PHỐ THÂN QUEN"
	var environment_text := str(street_world.call("get_environment_status")) if street_world != null else "Sài Gòn"
	var queue_count: int = snapshot["customers"].size() + snapshot["dining"]["guests"].size()
	status_label.text = "%s  ·  %s  ·  HÀNG %d" % [mode_text, environment_text, queue_count]


func _on_music_state_changed(enabled: bool, volume_percent: int, track_name: String) -> void:
	if music_button != null:
		music_button.tooltip_text = ("Tạm dừng nhạc: " if enabled else "Phát nhạc: ") + track_name
	if music_popup_button != null:
		music_popup_button.text = "♫" if enabled else "♪"
		music_popup_button.tooltip_text = ("Tạm dừng nhạc: " if enabled else "Phát nhạc: ") + track_name
	if music_slider != null and not is_equal_approx(music_slider.value, float(volume_percent)):
		music_slider.set_value_no_signal(float(volume_percent))


func _render_tab(snapshot: Dictionary) -> void:
	sheet.visible = active_tab != "outside"
	if not sheet.visible:
		return
	for child in sheet_body.get_children():
		child.queue_free()
	if snapshot["service_mode"] == "dining" and active_tab == "menu":
		sheet_title.text = "Bàn ăn" if dining_view == "tables" else "Phiếu bếp"
		_render_dining(snapshot)
		return
	match active_tab:
		"menu":
			sheet_title.text = "Đang phục vụ"
			_render_service(snapshot)
		"shop":
			sheet_title.text = "Cửa tiệm"
			_render_shop(snapshot)
		"staff":
			sheet_title.text = "Đội ngũ"
			_render_staff(snapshot)
		"recipes":
			sheet_title.text = "Sổ món"
			_render_recipes(snapshot)
		"stock":
			sheet_title.text = "Kho nguyên liệu"
			_render_stock(snapshot)


func _render_service(snapshot: Dictionary) -> void:
	if snapshot["service_mode"] == "dining":
		_render_dining(snapshot)
		return
	var customer: Dictionary = snapshot["current_customer"]
	var title := "Chưa có khách"
	var hint := "Bắt đầu ca bán để đón vị khách đầu tiên."
	if not customer.is_empty():
		var recipe: Dictionary = snapshot["recipe_names"][customer["recipe"]]
		title = "Khách đang tới…" if customer["status"] == "walking" else recipe["name"]
		hint = "Khách đang đi bộ tới quầy." if customer["status"] == "walking" else "%s đang chờ · còn %d giây" % [customer["type"], customer["patience"]]
	_add_section_title("ĐƠN ĐANG CHỜ")
	sheet_body.add_child(_label(title, 17, Color(0.12, 0.26, 0.39)))
	sheet_body.add_child(_label(hint, 12, Color(0.34, 0.43, 0.5)))
	var progress := ""
	if not customer.is_empty():
		var recipe_data: Dictionary = snapshot["recipe_names"][customer["recipe"]]
		var step_names: Array[String] = []
		for index in recipe_data["ingredients"].size():
			var ingredient_id: String = recipe_data["ingredients"][index]
			var ingredient_name := _ingredient_name(snapshot, ingredient_id)
			step_names.append(("✓ " if index < snapshot["assembly"].size() else "▶ " if index == snapshot["assembly"].size() else "○ ") + ingredient_name)
		progress = "   ·   ".join(PackedStringArray(step_names))
		sheet_body.add_child(_label(progress, 11, Color(0.19, 0.39, 0.51)))
	var ingredient_row := HBoxContainer.new()
	ingredient_row.add_theme_constant_override("separation", 4)
	sheet_body.add_child(ingredient_row)
	for ingredient in GameState.INGREDIENTS:
		var ingredient_id: String = ingredient["id"]
		var stock: int = snapshot["inventory"][ingredient_id]
		var button := _button("%s\n%s\n%d" % [ingredient["icon"], ingredient["name"], stock], GameState.tap_ingredient.bind(ingredient_id), 62)
		button.add_theme_font_size_override("font_size", 10)
		button.disabled = not snapshot["in_shift"] or customer.is_empty() or customer.get("status", "") != "waiting" or stock < 1
		button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		ingredient_row.add_child(button)
	if not snapshot["in_shift"]:
		sheet_body.add_child(_button("Bắt đầu ca bán", GameState.start_shift, 42))
	if not snapshot["feedback"].is_empty():
		sheet_body.add_child(_label(snapshot["offline_notice"] if not snapshot["offline_notice"].is_empty() else snapshot["feedback"], 11, Color(0.25, 0.4, 0.43)))


func _render_shop(snapshot: Dictionary) -> void:
	_add_section_title("MẶT BẰNG HIỆN TẠI")
	sheet_body.add_child(_label("CẤP %d / 12  ·  %s" % [snapshot["cart_level"], snapshot["stage_name"]], 16, Color(0.13, 0.3, 0.42)))
	var cost: int = snapshot["upgrade_cost"]
	var upgrade_text := "Nâng quán lên cấp %d  ·  %s xu" % [snapshot["cart_level"] + 1, _format_number(cost)] if cost > 0 else "Đã đạt cấp cao nhất"
	var upgrade := _button(upgrade_text, GameState.upgrade_shop, 46)
	upgrade.disabled = cost == 0 or snapshot["coins"] < cost
	sheet_body.add_child(upgrade)
	sheet_body.add_child(_button("Đổi tên biển hiệu", func(): _show_name_dialog(true), 40))
	if not snapshot["report"].is_empty():
		sheet_body.add_child(_label("Ca trước: phục vụ %d khách · lãi %s xu." % [snapshot["report"]["served"], _format_number(snapshot["report"]["net"])], 12, Color(0.26, 0.42, 0.43)))


func _render_staff(snapshot: Dictionary) -> void:
	_add_section_title("PHỤ BẾP")
	if snapshot["has_staff"]:
		sheet_body.add_child(_label("Phụ bếp đang đón khách, nấu món và thu tiền. Khi nghỉ, quán vẫn có thu nhập ngoại tuyến.", 13, Color(0.15, 0.34, 0.4)))
		sheet_body.add_child(_label("Lương: 30 xu mỗi ca 2 phút · Thu nhập nghỉ: tối đa 4 giờ", 11, Color(0.35, 0.43, 0.49)))
	else:
		sheet_body.add_child(_label("Thuê phụ bếp để tự phục vụ khách và tích lũy thu nhập khi bạn rời game.", 13, Color(0.15, 0.34, 0.4)))
		var button := _button("Thuê phụ bếp · %s xu" % _format_number(GameState.STAFF_HIRE_COST), GameState.hire_staff, 46)
		button.disabled = snapshot["cart_level"] < 2 or snapshot["coins"] < GameState.STAFF_HIRE_COST
		sheet_body.add_child(button)
		if snapshot["cart_level"] < 2:
			sheet_body.add_child(_label("Cần nâng quán lên cấp 2 trước.", 11, Color(0.46, 0.41, 0.35)))


func _render_recipes(snapshot: Dictionary) -> void:
	_add_section_title("MÓN ĐANG BÁN")
	for recipe_id in GameState.RECIPES:
		var recipe: Dictionary = GameState.RECIPES[recipe_id]
		var unlocked: bool = snapshot["cart_level"] >= recipe["unlock_level"]
		var ingredients: Array[String] = []
		for ingredient_id in recipe["ingredients"]:
			ingredients.append(_ingredient_name(snapshot, ingredient_id))
		var description := " · ".join(PackedStringArray(ingredients)) if unlocked else "Mở khóa ở cấp %d" % recipe["unlock_level"]
		sheet_body.add_child(_label("%s  ·  %d xu\n%s" % [recipe["name"], recipe["sale_price"], description], 12, Color(0.16, 0.32, 0.42) if unlocked else Color(0.48, 0.5, 0.52)))


func _render_stock(snapshot: Dictionary) -> void:
	_add_section_title("NGUYÊN LIỆU TRONG KHO")
	for ingredient in GameState.INGREDIENTS:
		sheet_body.add_child(_label("%s  %s  ·  %d phần" % [ingredient["icon"], ingredient["name"], snapshot["inventory"][ingredient["id"]]], 13, Color(0.17, 0.31, 0.41)))
	var restock_text := "Nhận hàng dự phòng · miễn phí" if snapshot["emergency_restock_available"] else "Nhập chuyến hàng · %d xu" % GameState.RESTOCK_PACK_COST
	var restock_button := _button(restock_text, GameState.restock, 44)
	restock_button.disabled = snapshot["coins"] < GameState.RESTOCK_PACK_COST and not snapshot["emergency_restock_available"]
	sheet_body.add_child(restock_button)


func _render_dining(snapshot: Dictionary) -> void:
	var toggle_row := HBoxContainer.new()
	sheet_body.add_child(toggle_row)
	var tables_toggle := _button("🪑 Bàn ăn", func(): _set_dining_view("tables"), 36)
	tables_toggle.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	toggle_row.add_child(tables_toggle)
	var kitchen_toggle := _button("🔥 Gian bếp", func(): _set_dining_view("kitchen"), 36)
	kitchen_toggle.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	toggle_row.add_child(kitchen_toggle)
	var dining: Dictionary = snapshot["dining"]
	if dining_view == "tables":
		var grid := GridContainer.new()
		grid.columns = 3
		grid.add_theme_constant_override("h_separation", 5)
		grid.add_theme_constant_override("v_separation", 4)
		sheet_body.add_child(grid)
		for table in dining["tables"]:
			var occupied := 0
			var dirty := 0
			for seat in table["seats"]:
				if seat["status"] in ["occupied", "reserved"]:
					occupied += 1
				elif seat["status"] == "dirty":
					dirty += 1
			var text := "BÀN %d\n%d khách · %d bẩn" % [table["id"], occupied, dirty]
			var table_id: int = table["id"]
			var button := _button(text, GameState.select_dining_table.bind(table_id), 44)
			button.disabled = table["id"] > 6
			button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			grid.add_child(button)
		var guest := _find_guest(dining["guests"], dining["selected_guest_id"])
		var order := _find_order(dining["orders"], dining["selected_order_id"])
		if not guest.is_empty():
			sheet_body.add_child(_label("Bàn %d · %s đang chờ %s" % [guest["table_id"], _customer_type_name(guest["type"]), GameState.RECIPES[guest["recipe"]]["name"]], 12, Color(0.13, 0.32, 0.42)))
			if guest["status"] == "waiting-order":
				sheet_body.add_child(_button("Nhận order", GameState.accept_dining_order, 39))
			elif not order.is_empty() and order["status"] == "ready":
				sheet_body.add_child(_button("Bưng món tới bàn", GameState.serve_selected_dining_order, 39))
			elif not order.is_empty() and order["status"] == "delivered" and guest["status"] == "awaiting-payment":
				sheet_body.add_child(_button("Thu tiền", GameState.collect_dining_payment, 39))
		else:
			sheet_body.add_child(_label(dining["feedback"], 12, Color(0.26, 0.41, 0.44)))
		var selected_seat := _selected_seat(dining)
		if not selected_seat.is_empty() and selected_seat["status"] == "dirty":
			sheet_body.add_child(_button("Dọn chỗ ngồi", GameState.clean_dining_table.bind(dining["selected_table_id"], dining["selected_seat_index"]), 38))
	else:
		var selected_order := _find_order(dining["orders"], dining["selected_order_id"])
		for order_item in dining["orders"]:
			var order_id: String = order_item["id"]
			var order_button := _button("BÀN %d  ·  %s" % [order_item["table_id"], GameState.RECIPES[order_item["recipe"]]["name"]], GameState.select_dining_order.bind(order_id), 38)
			sheet_body.add_child(order_button)
		if not selected_order.is_empty() and selected_order["status"] == "queued":
			var ingredient_row := HBoxContainer.new()
			ingredient_row.add_theme_constant_override("separation", 4)
			sheet_body.add_child(ingredient_row)
			for ingredient in GameState.INGREDIENTS:
				var ingredient_button := _button("%s\n%d" % [ingredient["icon"], snapshot["inventory"][ingredient["id"]]], GameState.tap_dining_ingredient.bind(ingredient["id"]), 46)
				ingredient_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
				ingredient_button.add_theme_font_size_override("font_size", 11)
				ingredient_row.add_child(ingredient_button)
		elif not selected_order.is_empty() and selected_order["status"] == "ready":
			sheet_body.add_child(_button("Bưng món tới bàn", GameState.serve_selected_dining_order, 39))
		sheet_body.add_child(_label(dining["feedback"], 11, Color(0.26, 0.41, 0.44)))


func _set_dining_view(value: String) -> void:
	dining_view = value
	dining_world.call("set_kitchen_view", dining_view == "kitchen")
	dining_title_label.text = "GIAN BẾP" if dining_view == "kitchen" else "PHÒNG ĂN"
	dining_status_label.text = "Phiếu bếp và nguyên liệu" if dining_view == "kitchen" else "Khách tự chọn bàn trống"
	_render_tab(GameState.get_snapshot())


func _toggle_location() -> void:
	if GameState.service_mode == "street":
		GameState.set_service_mode("dining")
		dining_view = "tables"
		dining_world.call("set_kitchen_view", false)
	else:
		GameState.set_service_mode("street")
	active_tab = "menu"
	_on_game_changed(GameState.get_snapshot())


func _toggle_fullscreen() -> void:
	var current_mode := DisplayServer.window_get_mode()
	var next_mode := DisplayServer.WINDOW_MODE_WINDOWED if current_mode == DisplayServer.WINDOW_MODE_FULLSCREEN else DisplayServer.WINDOW_MODE_FULLSCREEN
	DisplayServer.window_set_mode(next_mode)


func _toggle_music_popup() -> void:
	if music_popup != null:
		music_popup.visible = not music_popup.visible


func select_tab(tab: String) -> void:
	if tab == "outside" and GameState.service_mode == "dining":
		GameState.set_service_mode("street")
		dining_view = "tables"
		dining_world.call("set_kitchen_view", false)
	active_tab = "outside" if active_tab == tab or tab == "outside" else tab
	if active_tab == "outside" and GameState.service_mode == "street":
		street_world.call("center_on_shop")
	_on_game_changed(GameState.get_snapshot())


func _update_nav_styles() -> void:
	var selected := active_tab
	if selected == "menu" and GameState.service_mode == "dining":
		selected = "menu"
	for tab in TAB_LABELS:
		var button := ui_root.find_child("Tab_%s" % tab, true, false) as Button
		if button != null:
			button.add_theme_stylebox_override("normal", _panel_style(Color(0.17, 0.34, 0.34, 0.64) if selected == tab else Color(0.07, 0.19, 0.22, 0.16), Color(0.93, 0.76, 0.43, 0.72) if selected == tab else Color(0.83, 0.75, 0.57, 0.12), 12))
			var caption := button.find_child("NavLabel", true, false) as Label
			if caption != null:
				caption.add_theme_color_override("font_color", Color(1.0, 0.87, 0.56) if selected == tab else Color(1.0, 0.96, 0.85))


func _show_name_dialog(is_edit: bool) -> void:
	editing_name = is_edit
	name_overlay.visible = true
	name_input.text = GameState.store_name
	name_input.grab_focus()
	name_error.text = ""
	var title_node := name_overlay.find_child("StoreNameCard", true, false).get_child(0).get_child(1) as Label
	title_node.text = "Đổi tên biển hiệu" if is_edit else "Đặt tên cho cửa tiệm"


func _save_store_name() -> void:
	if not GameState.set_store_name(name_input.text):
		name_error.text = "Nhập tên quán trước khi treo bảng hiệu nhé."
		return
	name_overlay.visible = false
	if not editing_name and not GameState.in_shift:
		GameState.start_shift()
	if not editing_name:
		active_tab = "outside"
	_on_game_changed(GameState.get_snapshot())


func _cancel_name_dialog() -> void:
	if GameState.store_name.is_empty():
		return
	name_overlay.visible = false


func _selected_seat(dining: Dictionary) -> Dictionary:
	var table_id := int(dining.get("selected_table_id", 0))
	var seat_index := int(dining.get("selected_seat_index", -1))
	for table in dining["tables"]:
		if table["id"] == table_id and seat_index >= 0 and seat_index < table["seats"].size():
			return table["seats"][seat_index]
	return {}


func _find_guest(guests: Array, guest_id: String) -> Dictionary:
	for guest in guests:
		if guest["id"] == guest_id:
			return guest
	return {}


func _find_order(orders: Array, order_id: String) -> Dictionary:
	for order in orders:
		if order["id"] == order_id:
			return order
	return {}


func _customer_type_name(customer_type: String) -> String:
	var customer_data: Dictionary = GameState.CUSTOMER_TYPES.get(customer_type, {})
	return str(customer_data.get("name", "Khách"))


func _ingredient_name(snapshot: Dictionary, ingredient_id: String) -> String:
	for ingredient in snapshot["ingredients_data"]:
		if ingredient["id"] == ingredient_id:
			return ingredient["name"]
	return ingredient_id


func _add_section_title(text: String) -> void:
	var label := _label(text, 10, Color(0.27, 0.44, 0.52))
	label.add_theme_color_override("font_color", Color(0.27, 0.44, 0.52))
	sheet_body.add_child(label)


func _label(text: String, font_size: int, color: Color) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	return label


func _button(text: String, callback: Callable, height: float = 42.0) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size.y = height
	button.add_theme_font_size_override("font_size", 13)
	button.add_theme_color_override("font_color", Color(0.24, 0.32, 0.27))
	button.add_theme_color_override("font_disabled_color", Color(0.53, 0.52, 0.47))
	button.add_theme_stylebox_override("normal", _panel_style(Color(1.0, 0.99, 0.96), Color(0.88, 0.82, 0.7), 12))
	button.add_theme_stylebox_override("hover", _panel_style(Color(1.0, 0.94, 0.78), Color(0.82, 0.55, 0.29), 12))
	button.add_theme_stylebox_override("pressed", _panel_style(Color(0.96, 0.86, 0.64), Color(0.73, 0.45, 0.27), 12))
	button.add_theme_stylebox_override("disabled", _panel_style(Color(0.91, 0.89, 0.82), Color(0.86, 0.83, 0.75), 12))
	button.pressed.connect(callback)
	return button


func _panel_style(fill: Color, border: Color, radius: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(1)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 10.0
	style.content_margin_top = 7.0
	style.content_margin_right = 10.0
	style.content_margin_bottom = 7.0
	return style


func _format_number(value: int) -> String:
	var digits := str(value)
	var output := ""
	while digits.length() > 3:
		output = "." + digits.substr(digits.length() - 3, 3) + output
		digits = digits.substr(0, digits.length() - 3)
	return digits + output

extends Node

signal state_changed(enabled: bool, volume_percent: int, track_name: String)

const SETTINGS_PATH := "user://banh-mi-pho-music.json"
const DEFAULT_VOLUME := 0.16
const MAX_VOLUME := 0.4
const FADE_SECONDS := 1.2
const TRACKS := [
	{"name": "Autumn Evening", "path": "res://assets/audio/Autumn Evening.mp3"},
	{"name": "Countryside Loop", "path": "res://assets/audio/Countryside Loop.mp3"},
	{"name": "Lantern-lit Tavern", "path": "res://assets/audio/Lantern-lit Tavern.mp3"},
	{"name": "Market Day Melody", "path": "res://assets/audio/Market Day Melody.mp3"},
	{"name": "Countryside Morning", "path": "res://assets/audio/Countryside Morning.mp3"},
	{"name": "Countryside Morning 2", "path": "res://assets/audio/Countryside Morning 2.mp3"},
	{"name": "Countryside Morning 3", "path": "res://assets/audio/Countryside Morning 3.mp3"},
]

var player: AudioStreamPlayer
var enabled := true
var volume := DEFAULT_VOLUME
var track_index := 0
var fade_tween: Tween


func _ready() -> void:
	player = AudioStreamPlayer.new()
	player.name = "BackgroundMusic"
	player.finished.connect(_play_next_track)
	add_child(player)
	_restore_settings()
	if enabled:
		_play_current_track()
	_publish()


func toggle_music() -> void:
	enabled = not enabled
	if enabled:
		_play_current_track()
	else:
		if fade_tween != null and fade_tween.is_running():
			fade_tween.kill()
		player.stop()
	_persist_settings()
	_publish()


func set_volume_percent(value: int) -> void:
	volume = clampf(float(value) / 100.0, 0.0, MAX_VOLUME)
	if player.playing:
		if fade_tween != null and fade_tween.is_running():
			fade_tween.kill()
		player.volume_db = _target_volume_db()
	_persist_settings()
	_publish()


func get_state() -> Dictionary:
	return {
		"enabled": enabled,
		"volume_percent": roundi(volume * 100.0),
		"track_name": str(TRACKS[track_index]["name"]) if not TRACKS.is_empty() else "",
	}


func _play_next_track() -> void:
	if not enabled:
		return
	track_index = (track_index + 1) % TRACKS.size()
	_play_current_track()


func _play_current_track() -> void:
	if not enabled or TRACKS.is_empty():
		return
	var track: Dictionary = TRACKS[track_index]
	var stream := load(track["path"]) as AudioStreamMP3
	if stream == null:
		return
	player.stream = stream
	player.volume_db = -60.0
	player.play()
	if fade_tween != null and fade_tween.is_running():
		fade_tween.kill()
	fade_tween = create_tween()
	fade_tween.tween_property(player, "volume_db", _target_volume_db(), FADE_SECONDS)
	_publish()


func _target_volume_db() -> float:
	return linear_to_db(maxf(volume, 0.0001))


func _restore_settings() -> void:
	if not FileAccess.file_exists(SETTINGS_PATH):
		return
	var file := FileAccess.open(SETTINGS_PATH, FileAccess.READ)
	if file == null:
		return
	var data: Variant = JSON.parse_string(file.get_as_text())
	if not data is Dictionary:
		return
	enabled = bool(data.get("enabled", true))
	volume = clampf(float(data.get("volume", DEFAULT_VOLUME)), 0.0, MAX_VOLUME)


func _persist_settings() -> void:
	var file := FileAccess.open(SETTINGS_PATH, FileAccess.WRITE)
	if file != null:
		file.store_string(JSON.stringify({"enabled": enabled, "volume": volume}))


func _publish() -> void:
	var state := get_state()
	state_changed.emit(state["enabled"], state["volume_percent"], state["track_name"])

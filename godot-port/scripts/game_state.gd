extends Node

signal changed(snapshot: Dictionary)

const SAVE_PATH := "user://banh-mi-pho-save.json"
const SHIFT_SECONDS := 120
const CUSTOMER_ARRIVAL_SECONDS := 10
const CUSTOMER_PATIENCE_SECONDS := 45
const RESTOCK_PACK_SIZE := 5
const RESTOCK_PACK_COST := 75
const STAFF_HIRE_COST := 1200
const STAFF_WAGE_PER_SHIFT := 30
const OFFLINE_CAP_MINUTES := 240
const OFFLINE_COINS_PER_MINUTE := 8
const MAX_STORE_NAME := 24

const INGREDIENTS := [
	{"id": "bread", "name": "Bắp nướng", "icon": "🌽", "unit_cost": 4},
	{"id": "pate", "name": "Sốt ướp", "icon": "🫙", "unit_cost": 2},
	{"id": "cha", "name": "Ba chỉ nướng", "icon": "🍢", "unit_cost": 4},
	{"id": "egg", "name": "Trứng nướng", "icon": "🍳", "unit_cost": 3},
	{"id": "greens", "name": "Rau ăn kèm", "icon": "🥬", "unit_cost": 2},
]

const RECIPES := {
	"cha": {"name": "Xiên ba chỉ nướng", "sale_price": 30, "ingredients": ["bread", "pate", "cha", "greens"], "unlock_level": 1},
	"egg": {"name": "Trứng nướng mỡ hành", "sale_price": 32, "ingredients": ["bread", "pate", "egg", "greens"], "unlock_level": 1},
	"special": {"name": "Mẹt nướng đặc biệt", "sale_price": 42, "ingredients": ["bread", "pate", "cha", "egg", "greens"], "unlock_level": 2},
}

const CUSTOMER_TYPES := {
	"student": {"name": "Học sinh", "tip": 0},
	"office": {"name": "Dân văn phòng", "tip": 1},
	"shopper": {"name": "Khách đi chợ", "tip": 2},
	"tourist": {"name": "Khách du lịch", "tip": 4},
}

const DINING_CHARACTER_IDS := [
	"saigon-schoolgirl", "saigon-office-man", "saigon-market-shopper", "saigon-backpacker-tourist",
	"saigon-construction-worker", "saigon-delivery-rider", "saigon-food-reviewer", "saigon-genz-nightowl",
	"saigon-ingredient-supplier", "saigon-lottery-vendor", "saigon-morning-jogger", "saigon-office-woman",
	"saigon-older-regular", "saigon-schoolboy", "saigon-street-sweeper", "saigon-ward-police-officer",
	"saigon-ward-inspector", "saigon-young-mother", "saigon-taphoa-student-boy", "saigon-taphoa-college-girl",
]

const STAGE_NAMES := [
	"Quán nhậu mái tôn", "Bếp nướng nhỏ", "Quán ngói bình dân", "Quán phố nhỏ",
	"Quán nướng khang trang", "Quán có gác", "Quán hai tầng", "Quán ban công",
	"Quán mái cong", "Nhà hàng ba gian", "Nhà hàng sân thượng", "Thương hiệu Quán Nhậu Hẻm",
]

const UPGRADE_COSTS := [300, 750, 1800, 4200, 9000, 18000, 35000, 65000, 120000, 220000, 400000]

var store_name := ""
var coins := 100
var reputation := 0
var cart_level := 1
var has_staff := false
var inventory := {"bread": 12, "pate": 12, "cha": 8, "egg": 8, "greens": 16}
var in_shift := false
var seconds_remaining := SHIFT_SECONDS
var elapsed_seconds := 0
var customers: Array[Dictionary] = []
var assembly: Array[String] = []
var feedback := "Chào buổi sáng! Khách sẽ tự ghé quán."
var report: Dictionary = {}
var offline_notice := ""
var shift_revenue := 0
var shift_tips := 0
var shift_ingredient_costs := 0
var shift_served := 0
var shift_left := 0
var shift_reputation := 0
var total_served := 0
var service_mode := "street"
var dining: Dictionary = {}

var _tick_accumulator := 0.0
var _arrival_clock := 0
var _staff_clock := 0
var _customer_id := 0
var _dining_guest_id := 0


func _ready() -> void:
	_create_dining_state()
	_load_save()


func _process(delta: float) -> void:
	if not in_shift:
		return
	_tick_accumulator += delta
	while _tick_accumulator >= 1.0:
		_tick_accumulator -= 1.0
		tick()


func get_snapshot() -> Dictionary:
	var current_customer: Dictionary = customers[0].duplicate(true) if not customers.is_empty() else {}
	return {
		"store_name": store_name,
		"coins": coins,
		"reputation": reputation,
		"cart_level": cart_level,
		"stage_name": STAGE_NAMES[cart_level - 1],
		"upgrade_cost": UPGRADE_COSTS[cart_level - 1] if cart_level <= UPGRADE_COSTS.size() else 0,
		"has_staff": has_staff,
		"inventory": inventory.duplicate(true),
		"in_shift": in_shift,
		"seconds_remaining": seconds_remaining,
		"elapsed_seconds": elapsed_seconds,
		"customers": customers.duplicate(true),
		"current_customer": current_customer,
		"assembly": assembly.duplicate(),
		"feedback": feedback,
		"report": report.duplicate(true),
		"offline_notice": offline_notice,
		"shift_revenue": shift_revenue,
		"total_served": total_served,
		"service_mode": service_mode,
		"dining": dining.duplicate(true),
		"emergency_restock_available": coins < RESTOCK_PACK_COST and not _can_make_any_recipe(),
		"recipe_names": RECIPES.duplicate(true),
		"ingredients_data": INGREDIENTS.duplicate(true),
	}


func set_store_name(value: String) -> bool:
	var cleaned := " ".join(value.strip_edges().split(" ", false)).substr(0, MAX_STORE_NAME)
	if cleaned.is_empty():
		return false
	store_name = cleaned
	feedback = "Đã treo biển hiệu “%s”." % store_name
	_persist()
	_publish()
	return true


func start_shift() -> void:
	if in_shift:
		return
	in_shift = true
	seconds_remaining = SHIFT_SECONDS
	elapsed_seconds = 0
	customers.clear()
	assembly.clear()
	_create_dining_state()
	if service_mode == "street":
		customers.append(_make_customer())
	else:
		_arrive_dining_guest()
	shift_revenue = 0
	shift_tips = 0
	shift_ingredient_costs = 0
	shift_served = 0
	shift_left = 0
	shift_reputation = 0
	_arrival_clock = 0
	_staff_clock = 0
	report.clear()
	feedback = "Khách đầu tiên đang đi bộ tới quán." if service_mode == "street" else "Ca bán trong phòng ăn bắt đầu."
	_persist()
	_publish()


func set_service_mode(mode: String) -> void:
	if mode not in ["street", "dining"] or service_mode == mode:
		return
	service_mode = mode
	if mode == "dining" and in_shift and dining["guests"].is_empty():
		_arrive_dining_guest()
	dining["feedback"] = "Khách sẽ tự vào và chọn bàn trống." if mode == "dining" else "Bạn đang ở ngoài phố."
	_publish()


func tap_ingredient(ingredient_id: String) -> void:
	offline_notice = ""
	if service_mode != "street":
		feedback = "Đơn trong phòng ăn được nấu bằng phiếu bếp."
		_publish()
		return
	if not in_shift:
		feedback = "Bắt đầu ca bán trước nhé."
		_publish()
		return
	if customers.is_empty():
		feedback = "Chưa có khách ở quầy, chờ khách kế tiếp nhé."
		_publish()
		return
	var customer: Dictionary = customers[0]
	if customer["status"] != "waiting":
		feedback = "Khách đang đi tới quầy; đợi một chút nhé."
		_publish()
		return
	var recipe: Dictionary = RECIPES[customer["recipe"]]
	if not _has_recipe_stock(customer["recipe"]):
		assembly.clear()
		feedback = "Thiếu nguyên liệu cho món này. Hãy nhập thêm hàng nhé."
		_publish()
		return
	var expected: String = recipe["ingredients"][assembly.size()]
	if ingredient_id != expected:
		feedback = "Khách đang chờ %s. Chọn đúng thứ tự nhé." % _ingredient_name(expected)
		_publish()
		return
	assembly.append(ingredient_id)
	if assembly.size() == recipe["ingredients"].size():
		_complete_street_order(false)
	else:
		feedback = "Đúng rồi! Tiếp theo: %s." % _ingredient_name(recipe["ingredients"][assembly.size()])
		_publish()


func restock() -> void:
	offline_notice = ""
	if coins < RESTOCK_PACK_COST:
		if not _can_make_any_recipe():
			for item in INGREDIENTS:
				inventory[item["id"]] += 4
			feedback = "Quán nhận 4 phần nguyên liệu cơ bản để tiếp tục phục vụ khách."
			_persist()
		else:
			feedback = "Chưa đủ xu nhập hàng; cần %d xu." % RESTOCK_PACK_COST
		_publish()
		return
	coins -= RESTOCK_PACK_COST
	for item in INGREDIENTS:
		inventory[item["id"]] += RESTOCK_PACK_SIZE
	feedback = "Đã nhập hàng: +%d phần mỗi loại." % RESTOCK_PACK_SIZE
	_persist()
	_publish()


func upgrade_shop() -> void:
	offline_notice = ""
	if cart_level > UPGRADE_COSTS.size():
		feedback = "Thương hiệu đã đạt cấp cao nhất."
		_publish()
		return
	var cost: int = UPGRADE_COSTS[cart_level - 1]
	if coins < cost:
		feedback = "Cần thêm %s xu để nâng cấp quán." % _format_number(cost - coins)
		_publish()
		return
	coins -= cost
	cart_level += 1
	feedback = "Quán có bếp nướng mới. Món đặc biệt đã mở!" if cart_level == 2 else "Đã mở khóa %s." % STAGE_NAMES[cart_level - 1]
	_persist()
	_publish()


func hire_staff() -> void:
	offline_notice = ""
	if cart_level < 2:
		feedback = "Cần nâng quán lên cấp 2 trước khi thuê phụ bếp."
	elif has_staff:
		feedback = "Phụ bếp đang phụ mình trông quán rồi!"
	elif coins < STAFF_HIRE_COST:
		feedback = "Cần thêm %s xu để thuê phụ bếp." % _format_number(STAFF_HIRE_COST - coins)
	else:
		coins -= STAFF_HIRE_COST
		has_staff = true
		feedback = "Đã thuê phụ bếp! Bạn ấy sẽ tự phục vụ và giúp quán có thu nhập ngoại tuyến."
		_persist()
	_publish()


func tick() -> void:
	if not in_shift:
		return
	elapsed_seconds += 1
	seconds_remaining = SHIFT_SECONDS - (elapsed_seconds % SHIFT_SECONDS)
	if service_mode == "street":
		_tick_street()
	else:
		_tick_dining()
	if elapsed_seconds % SHIFT_SECONDS == 0:
		_settle_service_period()
	if elapsed_seconds % 10 == 0:
		_persist()
	_publish()


func select_dining_table(table_id: int, seat_index: int = -1) -> void:
	for table in dining["tables"]:
		if table["id"] != table_id:
			continue
		var selected_seat: Dictionary = {}
		if seat_index >= 0 and seat_index < table["seats"].size():
			selected_seat = table["seats"][seat_index]
		else:
			for seat in table["seats"]:
				if seat["guest_id"] != "":
					selected_seat = seat
					break
			if selected_seat.is_empty():
				for seat in table["seats"]:
					if seat["status"] == "dirty":
						selected_seat = seat
						break
			if selected_seat.is_empty():
				selected_seat = table["seats"][0]
		select_dining_seat(table_id, selected_seat["index"])
		return


func select_dining_seat(table_id: int, seat_index: int) -> void:
	var seat := _find_seat(table_id, seat_index)
	if seat.is_empty():
		return
	dining["selected_table_id"] = table_id
	dining["selected_seat_index"] = seat_index
	if seat["status"] == "dirty":
		dining["selected_guest_id"] = ""
		dining["selected_order_id"] = ""
		dining["feedback"] = "Chỗ %d tại bàn %d cần dọn." % [seat_index + 1, table_id]
	elif seat["status"] == "empty":
		dining["selected_guest_id"] = ""
		dining["selected_order_id"] = ""
		dining["feedback"] = "Chỗ này đang trống."
	else:
		dining["selected_guest_id"] = seat["guest_id"]
		var order := _find_order_for_guest(seat["guest_id"])
		dining["selected_order_id"] = order.get("id", "")
		dining["feedback"] = _guest_dialogue(seat["guest_id"])
	_publish()


func accept_dining_order() -> void:
	var guest := _find_guest(dining["selected_guest_id"])
	var order := _find_order(dining["selected_order_id"])
	if not in_shift or guest.is_empty() or order.is_empty() or guest["status"] != "waiting-order" or order["status"] != "called":
		dining["feedback"] = "Chọn khách đang chờ gọi món để nhận phiếu nhé."
	elif not _has_recipe_stock(order["recipe"]):
		dining["feedback"] = "Kho đang thiếu nguyên liệu cho món này."
	else:
		order["status"] = "queued"
		guest["status"] = "waiting-food"
		dining["feedback"] = "Đã nhận %s; phiếu đang chờ ở bếp." % RECIPES[order["recipe"]]["name"].to_lower()
	_publish()


func select_dining_order(order_id: String) -> void:
	var order := _find_order(order_id)
	if order.is_empty() or order["status"] not in ["queued", "cooking", "ready", "delivered", "paid"]:
		return
	if order["status"] == "queued" and dining["active_order_id"] != "" and dining["active_order_id"] != order_id:
		dining["feedback"] = "Bếp đang nấu phiếu khác. Hoàn tất phiếu đó trước nhé."
		_publish()
		return
	dining["selected_order_id"] = order_id
	dining["selected_guest_id"] = order["guest_id"]
	var guest := _find_guest(order["guest_id"])
	if not guest.is_empty():
		dining["selected_table_id"] = guest["table_id"]
		dining["selected_seat_index"] = guest["seat_index"]
	dining["feedback"] = "%s · %s." % [RECIPES[order["recipe"]]["name"], order["status"]]
	_publish()


func tap_dining_ingredient(ingredient_id: String) -> void:
	var order := _find_order(dining["selected_order_id"])
	if not in_shift or order.is_empty() or order["status"] != "queued" or (dining["active_order_id"] != "" and dining["active_order_id"] != order["id"]):
		dining["feedback"] = "Chọn phiếu đang chờ ở bếp trước nhé."
		_publish()
		return
	var recipe: Dictionary = RECIPES[order["recipe"]]
	var expected: String = recipe["ingredients"][order["assembly"].size()]
	if ingredient_id != expected:
		dining["feedback"] = "Bếp cần %s trước. Kho chưa bị trừ." % _ingredient_name(expected)
		_publish()
		return
	order["assembly"].append(ingredient_id)
	dining["active_order_id"] = order["id"]
	if order["assembly"].size() < recipe["ingredients"].size():
		dining["feedback"] = "Đúng rồi! Tiếp theo: %s." % _ingredient_name(recipe["ingredients"][order["assembly"].size()])
		_publish()
		return
	if not _has_recipe_stock(order["recipe"]):
		order["assembly"].clear()
		dining["active_order_id"] = ""
		dining["feedback"] = "Kho không đủ nguyên liệu. Chưa có nguyên liệu nào bị trừ."
		_publish()
		return
	_deduct_recipe_stock(order["recipe"])
	shift_ingredient_costs += _recipe_cost(order["recipe"])
	order["status"] = "cooking"
	order["cook_seconds"] = 3
	dining["feedback"] = "Bếp đang nấu %s…" % recipe["name"].to_lower()
	_persist()
	_publish()


func serve_selected_dining_order() -> void:
	var order := _find_order(dining["selected_order_id"])
	if order.is_empty() or order["status"] != "ready":
		dining["feedback"] = "Chọn phiếu món đã sẵn sàng rồi hãy bưng."
		_publish()
		return
	if order["guest_id"] != dining["selected_guest_id"]:
		dining["feedback"] = "Hãy chọn đúng khách đang chờ món trên phiếu."
		_publish()
		return
	var guest := _find_guest(order["guest_id"])
	if guest.is_empty() or guest["status"] != "waiting-food":
		dining["feedback"] = "Khách này không còn chờ món nữa."
		_publish()
		return
	order["status"] = "delivered"
	guest["status"] = "eating"
	order["eat_seconds"] = 5
	dining["feedback"] = "Đã bưng món tới bàn %d. Khách đang dùng bữa." % guest["table_id"]
	_publish()


func collect_dining_payment() -> void:
	var order := _find_order(dining["selected_order_id"])
	var guest := _find_guest(dining["selected_guest_id"])
	if order.is_empty() or order["status"] != "delivered" or guest.is_empty() or guest["status"] != "awaiting-payment":
		dining["feedback"] = "Khách chưa ăn xong hoặc chưa gọi thanh toán."
		_publish()
		return
	_pay_dining_order(order, guest, false)


func clean_dining_table(table_id: int, seat_index: int) -> void:
	var seat := _find_seat(table_id, seat_index)
	if seat.is_empty() or seat["status"] != "dirty":
		dining["feedback"] = "Bàn này chưa cần dọn hoặc vẫn có khách."
		_publish()
		return
	seat["status"] = "empty"
	seat["guest_id"] = ""
	_sync_table(table_id)
	dining["selected_table_id"] = table_id
	dining["selected_seat_index"] = seat_index
	dining["selected_guest_id"] = ""
	dining["feedback"] = "Đã dọn chỗ %d tại bàn %d." % [seat_index + 1, table_id]
	_publish()


func _tick_street() -> void:
	_arrival_clock += 1
	for customer in customers:
		if customer["status"] == "walking":
			customer["walk_seconds"] += 1
			if customer["walk_seconds"] >= 3:
				customer["status"] = "waiting"
		elif customer["status"] == "waiting":
			customer["patience"] -= 1
	var kept: Array[Dictionary] = []
	for customer in customers:
		if customer["patience"] > 0:
			kept.append(customer)
		else:
			shift_left += 1
			assembly.clear()
			feedback = "Có khách đi mất vì đợi lâu. Hãy phục vụ nhanh hoặc thuê phụ bếp."
	customers = kept
	if _arrival_clock >= CUSTOMER_ARRIVAL_SECONDS:
		_arrival_clock = 0
		if customers.size() < 3:
			customers.append(_make_customer())
	if has_staff:
		_staff_clock += 1
		if _staff_clock >= 8 and not customers.is_empty() and customers[0]["status"] == "waiting" and assembly.is_empty():
			_staff_clock = 0
			_complete_street_order(true)


func _tick_dining() -> void:
	dining["arrival_clock"] += 1
	var kept_guests: Array[Dictionary] = []
	for guest in dining["guests"].duplicate():
		if guest["status"] in ["entering", "leaving"]:
			guest["transition_seconds"] -= 1
			if guest["transition_seconds"] <= 0:
				if guest["status"] == "entering":
					guest["status"] = "waiting-order"
					var entering_seat := _find_seat(guest["table_id"], guest["seat_index"])
					if not entering_seat.is_empty():
						entering_seat["status"] = "occupied"
					_sync_table(guest["table_id"])
					dining["feedback"] = "Khách đã ngồi bàn %d; nhận order nhé." % guest["table_id"]
				else:
					var leaving_seat := _find_seat(guest["table_id"], guest["seat_index"])
					if not leaving_seat.is_empty():
						leaving_seat["status"] = "dirty"
						leaving_seat["guest_id"] = ""
					_sync_table(guest["table_id"])
					if dining["selected_guest_id"] == guest["id"]:
						dining["selected_guest_id"] = ""
					var departed_order := _find_order_for_guest(guest["id"])
					if not departed_order.is_empty():
						if dining["selected_order_id"] == departed_order["id"]:
							dining["selected_order_id"] = ""
						dining["orders"].erase(departed_order)
				continue
		elif guest["status"] == "waiting-order":
			guest["patience"] -= 1
			if guest["patience"] <= 0:
				guest["status"] = "leaving"
				guest["transition_seconds"] = _dining_travel_seconds(int(guest["table_id"]))
				shift_left += 1
				var expired_order := _find_order_for_guest(guest["id"])
				if not expired_order.is_empty():
					if dining["selected_order_id"] == expired_order["id"]:
						dining["selected_order_id"] = ""
					dining["orders"].erase(expired_order)
				dining["feedback"] = "Khách bàn %d rời đi vì chưa nhận order." % guest["table_id"]
		kept_guests.append(guest)
	dining["guests"] = kept_guests
	var active_order := _find_order(dining["active_order_id"])
	if not active_order.is_empty() and active_order["status"] == "cooking":
		active_order["cook_seconds"] -= 1
		if active_order["cook_seconds"] <= 0:
			active_order["status"] = "ready"
			dining["active_order_id"] = ""
			dining["feedback"] = "%s đã sẵn sàng. Chọn đúng khách để bưng." % RECIPES[active_order["recipe"]]["name"]
	for order in dining["orders"]:
		if order["status"] != "delivered":
			continue
		var guest := _find_guest(order["guest_id"])
		if guest.is_empty() or guest["status"] != "eating":
			continue
		order["eat_seconds"] -= 1
		if order["eat_seconds"] <= 0:
			guest["status"] = "awaiting-payment"
			dining["feedback"] = "Khách bàn %d đã ăn xong; thu tiền nhé." % guest["table_id"]
	if dining["arrival_clock"] >= CUSTOMER_ARRIVAL_SECONDS + 4:
		dining["arrival_clock"] = 0
		_arrive_dining_guest()
	if has_staff:
		_staff_clock += 1
		if _staff_clock >= 3:
			_staff_clock = 0
			_help_dining_room()


func _arrive_dining_guest() -> void:
	if not in_shift or service_mode != "dining":
		return
	for table in dining["tables"]:
		for seat in table["seats"]:
			if seat["status"] != "empty":
				continue
			var customer := _make_customer()
			_dining_guest_id += 1
			var guest_id := "dining-guest-%d" % _dining_guest_id
			var order_id := "dining-order-%d" % _dining_guest_id
			seat["status"] = "reserved"
			seat["guest_id"] = guest_id
			var guest := {
				"id": guest_id, "table_id": table["id"], "seat_index": seat["index"],
				"character_id": DINING_CHARACTER_IDS[(int(customer["id"]) - 1) % DINING_CHARACTER_IDS.size()],
				"type": customer["type"], "recipe": customer["recipe"], "status": "entering",
				"patience": CUSTOMER_PATIENCE_SECONDS, "transition_seconds": _dining_travel_seconds(int(table["id"])),
			}
			dining["guests"].append(guest)
			dining["orders"].append({
				"id": order_id, "guest_id": guest_id, "table_id": table["id"],
				"recipe": customer["recipe"], "status": "called", "assembly": [],
				"cook_seconds": 0, "eat_seconds": 0,
			})
			dining["feedback"] = "Khách mới đang vào và chọn bàn %d." % table["id"]
			_sync_table(table["id"])
			return


func _complete_street_order(by_staff: bool) -> void:
	if customers.is_empty():
		return
	var customer: Dictionary = customers[0]
	var recipe: Dictionary = RECIPES[customer["recipe"]]
	if not _has_recipe_stock(customer["recipe"]):
		assembly.clear()
		feedback = "Hết nguyên liệu trong kho! Nhập thêm hàng nhé."
		_publish()
		return
	var tip := 0
	if not by_staff:
		tip = int(CUSTOMER_TYPES[customer["type"]]["tip"])
		if customer["patience"] >= 25:
			tip += 2
	_deduct_recipe_stock(customer["recipe"])
	coins += recipe["sale_price"] + tip
	shift_revenue += recipe["sale_price"]
	shift_tips += tip
	shift_ingredient_costs += _recipe_cost(customer["recipe"])
	shift_served += 1
	total_served += 1
	var rep := 1 if by_staff or customer["patience"] < 25 else 2
	reputation += rep
	shift_reputation += rep
	customers.pop_front()
	assembly.clear()
	feedback = "Phụ bếp vừa giao món: +%d xu." % recipe["sale_price"] if by_staff else "Phục vụ thành công: +%d xu, gồm %d xu boa." % [recipe["sale_price"] + tip, tip]
	_persist()
	_publish()


func _pay_dining_order(order: Dictionary, guest: Dictionary, by_staff: bool) -> void:
	var recipe: Dictionary = RECIPES[order["recipe"]]
	var tip := 0 if by_staff else int(CUSTOMER_TYPES[guest["type"]]["tip"]) + (2 if guest["patience"] >= 25 else 0)
	var rep := 1 if by_staff or guest["patience"] < 25 else 2
	order["status"] = "paid"
	guest["status"] = "leaving"
	guest["transition_seconds"] = _dining_travel_seconds(int(guest["table_id"]))
	coins += recipe["sale_price"] + tip
	shift_revenue += recipe["sale_price"]
	shift_tips += tip
	shift_served += 1
	total_served += 1
	reputation += rep
	shift_reputation += rep
	dining["feedback"] = "Đã thu tiền: +%d xu." % (recipe["sale_price"] + tip)
	_persist()
	_publish()


func _help_dining_room() -> void:
	for guest in dining["guests"]:
		if guest["status"] == "awaiting-payment":
			var order := _find_order_for_guest(guest["id"])
			if not order.is_empty() and order["status"] == "delivered":
				_pay_dining_order(order, guest, true)
				return
	for order in dining["orders"]:
		if order["status"] == "ready":
			var guest := _find_guest(order["guest_id"])
			if not guest.is_empty() and guest["status"] == "waiting-food":
				order["status"] = "delivered"
				order["eat_seconds"] = 5
				guest["status"] = "eating"
				return
	for order in dining["orders"]:
		if order["status"] == "queued" and dining["active_order_id"] in ["", order["id"]] and _has_recipe_stock(order["recipe"]):
			_deduct_recipe_stock(order["recipe"])
			shift_ingredient_costs += _recipe_cost(order["recipe"])
			order["assembly"] = RECIPES[order["recipe"]]["ingredients"].duplicate()
			order["status"] = "cooking"
			order["cook_seconds"] = 3
			dining["active_order_id"] = order["id"]
			_persist()
			return
	for guest in dining["guests"]:
		if guest["status"] == "waiting-order" and _has_recipe_stock(guest["recipe"]):
			var order := _find_order_for_guest(guest["id"])
			if not order.is_empty() and order["status"] == "called":
				order["status"] = "queued"
				guest["status"] = "waiting-food"
				return
	for table in dining["tables"]:
		for seat in table["seats"]:
			if seat["status"] == "dirty":
				seat["status"] = "empty"
				seat["guest_id"] = ""
				_sync_table(table["id"])
				return


func _create_dining_state() -> void:
	var tables: Array[Dictionary] = []
	for table_id in range(1, 7):
		var seats: Array[Dictionary] = []
		for seat_index in range(4):
			seats.append({"index": seat_index, "status": "empty", "guest_id": ""})
		tables.append({"id": table_id, "status": "empty", "seats": seats})
	dining = {
		"tables": tables, "guests": [], "orders": [], "selected_table_id": 1,
		"selected_seat_index": -1, "selected_guest_id": "", "selected_order_id": "",
		"active_order_id": "", "arrival_clock": 0, "feedback": "Chọn bàn để xem khách.",
	}


func _make_customer() -> Dictionary:
	_customer_id += 1
	var roll := randf()
	var customer_type := "student" if roll < 0.32 else "office" if roll < 0.60 else "shopper" if roll < 0.82 else "tourist"
	var recipe_id := "cha"
	if customer_type == "student":
		recipe_id = "cha"
	elif customer_type == "office":
		recipe_id = "egg"
	elif customer_type == "tourist" and cart_level >= 2:
		recipe_id = "special"
	elif customer_type == "shopper" and cart_level >= 2 and randf() < 0.4:
		recipe_id = "special"
	else:
		recipe_id = "cha" if randf() < 0.5 else "egg"
	return {"id": _customer_id, "type": customer_type, "recipe": recipe_id, "patience": CUSTOMER_PATIENCE_SECONDS, "status": "walking", "walk_seconds": 0}


func _has_recipe_stock(recipe_id: String) -> bool:
	for ingredient_id in RECIPES[recipe_id]["ingredients"]:
		if int(inventory.get(ingredient_id, 0)) <= 0:
			return false
	return true


func _can_make_any_recipe() -> bool:
	for recipe_id in RECIPES:
		if RECIPES[recipe_id]["unlock_level"] <= cart_level and _has_recipe_stock(recipe_id):
			return true
	return false


func _deduct_recipe_stock(recipe_id: String) -> void:
	for ingredient_id in RECIPES[recipe_id]["ingredients"]:
		inventory[ingredient_id] -= 1


func _recipe_cost(recipe_id: String) -> int:
	var total := 0
	for ingredient_id in RECIPES[recipe_id]["ingredients"]:
		for item in INGREDIENTS:
			if item["id"] == ingredient_id:
				total += item["unit_cost"]
	return total


func _ingredient_name(ingredient_id: String) -> String:
	for item in INGREDIENTS:
		if item["id"] == ingredient_id:
			return item["name"]
	return ingredient_id


func _settle_service_period() -> void:
	var wages: int = mini(coins, STAFF_WAGE_PER_SHIFT) if has_staff else 0
	coins -= wages
	report = {
		"served": shift_served, "left": shift_left, "revenue": shift_revenue,
		"tips": shift_tips, "ingredient_costs": shift_ingredient_costs, "wages": wages,
		"net": shift_revenue + shift_tips - shift_ingredient_costs - wages,
		"reputation_earned": shift_reputation,
	}
	shift_revenue = 0
	shift_tips = 0
	shift_ingredient_costs = 0
	shift_served = 0
	shift_left = 0
	shift_reputation = 0
	_persist()


func _find_seat(table_id: int, seat_index: int) -> Dictionary:
	for table in dining["tables"]:
		if table["id"] == table_id and seat_index >= 0 and seat_index < table["seats"].size():
			return table["seats"][seat_index]
	return {}


func _dining_travel_seconds(table_id: int) -> int:
	return 7 - int(ceil(float(table_id) / 2.0))


func _find_guest(guest_id: String) -> Dictionary:
	for guest in dining["guests"]:
		if guest["id"] == guest_id:
			return guest
	return {}


func _find_order(order_id: String) -> Dictionary:
	for order in dining["orders"]:
		if order["id"] == order_id:
			return order
	return {}


func _find_order_for_guest(guest_id: String) -> Dictionary:
	for order in dining["orders"]:
		if order["guest_id"] == guest_id:
			return order
	return {}


func _guest_dialogue(guest_id: String) -> String:
	var guest := _find_guest(guest_id)
	if guest.is_empty():
		return "Chạm vào bàn có khách để xem lời gọi món."
	return "Cho mình %s nhé!" % RECIPES[guest["recipe"]]["name"].to_lower()


func _sync_table(table_id: int) -> void:
	for table in dining["tables"]:
		if table["id"] != table_id:
			continue
		if table["seats"].any(func(seat): return seat["status"] == "occupied"):
			table["status"] = "occupied"
		elif table["seats"].any(func(seat): return seat["status"] == "reserved"):
			table["status"] = "reserved"
		elif table["seats"].any(func(seat): return seat["status"] == "dirty"):
			table["status"] = "dirty"
		else:
			table["status"] = "empty"
		return


func _persist() -> void:
	var save_data := {
		"version": 1, "store_name": store_name, "coins": coins, "reputation": reputation,
		"cart_level": cart_level, "has_staff": has_staff, "inventory": inventory,
		"total_served": total_served, "last_saved_at": int(Time.get_unix_time_from_system()),
	}
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file != null:
		file.store_string(JSON.stringify(save_data))


func _load_save() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		_publish()
		return
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return
	var data: Variant = JSON.parse_string(file.get_as_text())
	if not data is Dictionary or int(data.get("version", 0)) != 1:
		return
	store_name = str(data.get("store_name", ""))
	coins = max(0, int(data.get("coins", 100)))
	reputation = max(0, int(data.get("reputation", 0)))
	cart_level = clampi(int(data.get("cart_level", 1)), 1, STAGE_NAMES.size())
	has_staff = bool(data.get("has_staff", false))
	total_served = max(0, int(data.get("total_served", 0)))
	var saved_inventory: Dictionary = data.get("inventory", {})
	for item in INGREDIENTS:
		inventory[item["id"]] = max(0, int(saved_inventory.get(item["id"], inventory[item["id"]])))
	if has_staff:
		var saved_at := int(data.get("last_saved_at", Time.get_unix_time_from_system()))
		var elapsed_minutes := clampi(int((Time.get_unix_time_from_system() - saved_at) / 60), 0, OFFLINE_CAP_MINUTES)
		var offline_coins := elapsed_minutes * OFFLINE_COINS_PER_MINUTE
		if offline_coins > 0:
			coins += offline_coins
			offline_notice = "Phụ bếp bán giúp bạn %d phút, mang về %s xu." % [elapsed_minutes, _format_number(offline_coins)]
	_persist()
	_publish()


func _publish() -> void:
	changed.emit(get_snapshot())


func _format_number(value: int) -> String:
	var text := str(value)
	var output := ""
	while text.length() > 3:
		output = "." + text.substr(text.length() - 3, 3) + output
		text = text.substr(0, text.length() - 3)
	return text + output

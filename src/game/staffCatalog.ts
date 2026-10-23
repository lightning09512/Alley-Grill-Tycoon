export type StaffRoleId = "server" | "cashier" | "prep" | "chef" | "promoter";

export interface StaffRole {
  id: StaffRoleId;
  name: string;
  shortName: string;
  tabLabel: string;
  workstation: string;
  duty: string;
}

export interface StaffCandidate {
  id: string;
  name: string;
  role: StaffRoleId;
  hireCost: number;
  wagePerShift: number;
  unlockLevel: number;
  serviceScore: number;
}

export const STAFF_ROLES: readonly StaffRole[] = [
  { id: "server", name: "Nhân viên phục vụ", shortName: "Phục vụ", tabLabel: "PHỤC VỤ", workstation: "Phòng ăn", duty: "Nhận món, bưng món và tự dọn bàn khi rảnh." },
  { id: "cashier", name: "Thu ngân", shortName: "Thu ngân", tabLabel: "THU NGÂN", workstation: "Quầy thu ngân", duty: "Thanh toán hóa đơn nhanh, giảm thời gian khách chờ." },
  { id: "prep", name: "Phụ bếp", shortName: "Phụ bếp", tabLabel: "PHỤ BẾP", workstation: "Bếp sơ chế", duty: "Sơ chế nguyên liệu và đỡ hàng chờ trong bếp." },
  { id: "chef", name: "Đầu bếp", shortName: "Đầu bếp", tabLabel: "ĐẦU BẾP", workstation: "Bếp nướng", duty: "Nấu nhanh hơn và giúp món giữ chất lượng." },
  { id: "promoter", name: "PG · tiếp thị", shortName: "Tiếp thị", tabLabel: "TIẾP THỊ", workstation: "Trước cửa quán", duty: "Thu hút thêm khách ghé quán trong ca." },
];

export const STAFF_CANDIDATES: readonly StaffCandidate[] = [
  { id: "mai-linh", name: "Mai Linh", role: "server", hireCost: 420, wagePerShift: 10, unlockLevel: 1, serviceScore: 42 },
  { id: "quang-tin", name: "Quang Tín", role: "cashier", hireCost: 520, wagePerShift: 9, unlockLevel: 1, serviceScore: 38 },
  { id: "huy-phu-bep", name: "Tấn Huy", role: "prep", hireCost: 620, wagePerShift: 11, unlockLevel: 1, serviceScore: 46 },
  { id: "co-hanh", name: "Cô Hạnh", role: "chef", hireCost: 860, wagePerShift: 15, unlockLevel: 1, serviceScore: 58 },
  { id: "line-cook", name: "Đầu bếp nam", role: "chef", hireCost: 920, wagePerShift: 14, unlockLevel: 2, serviceScore: 54 },
  { id: "an-nhien", name: "An Nhiên", role: "promoter", hireCost: 720, wagePerShift: 8, unlockLevel: 2, serviceScore: 35 },
];

export const MAX_STAFF_LEVEL = 5;
export const STAFF_TRAINING_COST: Readonly<Record<number, number>> = {
  1: 240,
  2: 420,
  3: 680,
  4: 980,
};

export function getServerTableCleaningSeconds(level: number): number {
  const safeLevel = Math.max(1, Math.min(MAX_STAFF_LEVEL, Math.trunc(level)));
  return 21 - safeLevel * 3;
}

export function getServerCleaningRestSeconds(level: number): number {
  return getServerTableCleaningSeconds(level) * 2;
}

export function getStaffRole(roleId: StaffRoleId): StaffRole {
  return STAFF_ROLES.find((role) => role.id === roleId)!;
}

export function getStaffCandidate(candidateId: string): StaffCandidate | undefined {
  return STAFF_CANDIDATES.find((candidate) => candidate.id === candidateId);
}

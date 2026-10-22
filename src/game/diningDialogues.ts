import type { DiningFamilyContext, DiningPartyType } from "./diningCharacters";

type DialogueTone = "normal" | "funny" | "grumpy" | "cheerful" | "cute";
export type DiningConversationPhase = "waiting-order" | "waiting-food" | "eating" | "awaiting-payment";

type DialoguePersona = "child" | "preschooler" | "mother" | "father" | "grandmother" | "grandfather" | "office" | "student" | "teacher" | "worker" | "tourist" | "creator" | "comic" | "local" | "mechanic" | "traditional-driver" | "taxi-driver" | "nurse" | "musician";

interface ConversationPair {
  text: string;
  reply: string;
  speakerPersona?: DialoguePersona;
  replyPersona?: DialoguePersona;
}

// Only IDs present in the dining party profiles are listed here. These tags
// keep a student's, worker's, or visitor's voice grounded in their character.
const CHARACTER_PERSONAS: Readonly<Record<string, DialoguePersona>> = {
  "saigon-schoolboy": "child",
  "saigon-schoolgirl": "child",
  "saigon-preschooler": "preschooler",
  "saigon-young-mother": "mother",
  "saigon-older-regular": "grandfather",
  "saigon-young-father": "father",
  "saigon-grandmother": "grandmother",
  "saigon-primary-teacher": "teacher",
  "saigon-office-woman": "office",
  "saigon-office-man": "office",
  "saigon-taphoa-college-girl": "student",
  "saigon-taphoa-student-boy": "student",
  "saigon-delivery-rider": "worker",
  "saigon-construction-worker": "worker",
  "saigon-ingredient-supplier": "worker",
  "saigon-street-sweeper": "worker",
  "saigon-lottery-vendor": "worker",
  "saigon-backpacker-tourist": "tourist",
  "saigon-food-reviewer": "creator",
  "saigon-genz-nightowl": "creator",
  "saigon-comic-uncle": "comic",
  "saigon-comic-auntie": "comic",
  "saigon-comic-foodie": "comic",
  "saigon-market-shopper": "local",
  "saigon-ward-inspector": "local",
  "saigon-ward-police-officer": "local",
  "saigon-morning-jogger": "local",
  "saigon-motorbike-mechanic": "mechanic",
  "saigon-traditional-motorbike-taxi-driver": "traditional-driver",
  "saigon-taxi-driver": "taxi-driver",
  "saigon-night-shift-nurse": "nurse",
  "saigon-cajon-player": "musician",
};

const ARRIVAL_TONES: readonly DialogueTone[] = ["normal", "funny", "cheerful", "cute", "grumpy"];

// Keep family dialogue consistent with the people who are actually at the table.
// This deliberately matches kinship phrases, not the dish name "ba chỉ".
const FATHER_REFERENCE = /\bba\s+(?:ơi|bảo|nói|con|kể|cũng|duyệt|bao|còn|nghe|gắp|mời|chụp|nhớ|đang|định|chưa|cảm ơn|muốn|tính)\b|\bba mẹ\b/i;
const MOTHER_REFERENCE = /\bmẹ\b/i;
const GRANDMOTHER_REFERENCE = /\bbà\b/i;
const GRANDFATHER_REFERENCE = /\bông\b/i;
const SPOUSE_REFERENCE = /\b(?:vợ chồng|chồng|vợ)\b/i;
const CHILD_REFERENCE = /\bcon\b|\btrẻ con\b/i;
const CHILD_ADDRESS_REFERENCE = /^\s*(?:mẹ|ba|bà|ông)\s+(?:ơi\b|có thấy\b|còn nhớ\b|kể(?: lại)?\b|cứ\b|nghỉ\b|ăn thêm\b|muốn ăn\b|ngồi\b|chọn\b|gắp\b.*\bgiúp con\b)/i;
const KINSHIP_SELF_REFERENCE = /^\s*(?:mẹ|ba|bà|ông)\s+(?:cũng\b|gọi\b|đồng ý\b|thử\b|thấy\b|để\b|nhớ\b|sẽ\b|thích\b|cảm ơn\b|duyệt\b|bao\b|nghe\b|chụp\b|mời\b|gắp\b|chọn\b)/i;
const SAFE_FAMILY_LINES = ["Ngồi xuống rồi chọn món nhé.", "Mình cứ thong thả, tối nay không vội."] as const;
type OlderCoupleMember = "grandmother" | "grandfather";

interface OlderCoupleExchange {
  speaker: OlderCoupleMember;
  text: string;
  reply: string;
}

const OLDER_COUPLE_ARRIVALS: readonly { speaker: OlderCoupleMember; text: string }[] = [
  { speaker: "grandmother", text: "Ngồi bàn trong kia đi ông, bên đó đỡ ồn." },
  { speaker: "grandfather", text: "Ừ, mình ngồi nghỉ một lát rồi gọi món." },
  { speaker: "grandmother", text: "Ông xem thực đơn đi, món nào cũng được." },
  { speaker: "grandfather", text: "Đi bộ một đoạn cũng hơi mỏi chân." },
  { speaker: "grandmother", text: "Mình gọi món quen trước nhé." },
  { speaker: "grandfather", text: "Bàn này thoáng, ngồi đây đi." },
];

const OLDER_COUPLE_CONVERSATIONS: Readonly<Record<DiningConversationPhase, readonly OlderCoupleExchange[]>> = {
  "waiting-order": [
    { speaker: "grandmother", text: "Ông muốn ăn món nào?", reply: "Món nướng kia được đấy, gọi một phần trước đi." },
    { speaker: "grandfather", text: "Mình gọi món quen nhé?", reply: "Ừ, gọi một phần trước, thiếu thì gọi thêm." },
    { speaker: "grandmother", text: "Ông xem có món nào dễ ăn không?", reply: "Có món này, mình gọi thử nhé." },
  ],
  "waiting-food": [
    { speaker: "grandfather", text: "Đường hôm nay đông thật.", reply: "Ừ, giờ nào đi qua cũng đông." },
    { speaker: "grandmother", text: "Món chắc sắp ra rồi ông nhỉ?", reply: "Chắc vậy, mình đợi thêm chút." },
    { speaker: "grandfather", text: "Lần trước mình gọi món này cũng vừa miệng.", reply: "Ừ, ăn ở đây mấy lần rồi vẫn ổn." },
  ],
  eating: [
    { speaker: "grandmother", text: "Món này nêm vừa miệng đấy.", reply: "Ừ, lần sau mình gọi nữa." },
    { speaker: "grandfather", text: "Ăn chậm thôi, còn nóng.", reply: "Biết rồi, ông cứ ăn đi." },
    { speaker: "grandmother", text: "Ông ăn thêm đi, phần này còn nhiều.", reply: "Ừ, để tôi gắp thêm." },
  ],
  "awaiting-payment": [
    { speaker: "grandfather", text: "No rồi, mình về thôi.", reply: "Ừ, để ông tính tiền rồi mình ra." },
    { speaker: "grandmother", text: "Ăn xong thấy đỡ mệt hẳn.", reply: "Về nhà nghỉ một lát là được." },
    { speaker: "grandfather", text: "Mình đi chợ luôn hay về trước?", reply: "Về trước đi, mai đi cũng được." },
  ],
};

const DEFAULT_FAMILY_CONTEXT: DiningFamilyContext = {
  hasFather: true,
  hasMother: true,
  hasGrandmother: false,
  hasGrandfather: false,
  hasChild: true,
  fatherIndex: 0,
  motherIndex: 1,
  grandmotherIndex: null,
  grandfatherIndex: null,
  childIndices: [2],
};

function isOlderCouple(partyType: DiningPartyType, partySize: number, characterIds: readonly string[]): boolean {
  return partyType === "family"
    && partySize === 2
    && characterIds.length === 2
    && characterIds.includes("saigon-grandmother")
    && characterIds.includes("saigon-older-regular");
}

function olderCoupleIndex(characterIds: readonly string[], member: OlderCoupleMember): number {
  const characterId = member === "grandmother" ? "saigon-grandmother" : "saigon-older-regular";
  return characterIds.indexOf(characterId);
}

function olderCoupleExchange(
  characterIds: readonly string[],
  phase: DiningConversationPhase,
  conversationNumber: number,
): DiningConversationDialogue {
  const exchanges = OLDER_COUPLE_CONVERSATIONS[phase];
  const exchange = exchanges[conversationNumber % exchanges.length]!;
  const speakerIndex = olderCoupleIndex(characterIds, exchange.speaker);
  return {
    text: exchange.text,
    reply: exchange.reply,
    speakerIndex,
    replySpeakerIndex: olderCoupleIndex(characterIds, exchange.speaker === "grandmother" ? "grandfather" : "grandmother"),
  };
}

function familyLineMatchesPeople(line: string, family: DiningFamilyContext): boolean {
  return (family.hasFather || !FATHER_REFERENCE.test(line))
    && (family.hasMother || !MOTHER_REFERENCE.test(line))
    && (family.hasGrandmother || !GRANDMOTHER_REFERENCE.test(line))
    && (family.hasGrandfather || !GRANDFATHER_REFERENCE.test(line))
    && ((family.hasFather && family.hasMother) || !SPOUSE_REFERENCE.test(line))
    && (family.hasChild || (!CHILD_REFERENCE.test(line) && !CHILD_ADDRESS_REFERENCE.test(line) && !KINSHIP_SELF_REFERENCE.test(line)));
}

function dialogueLinesForParty(lines: readonly string[], partyType: DiningPartyType, family: DiningFamilyContext): readonly string[] {
  if (partyType !== "family") return lines;
  const familyFriendlyLines = lines.filter((line) => familyLineMatchesPeople(line, family));
  return familyFriendlyLines.length > 0 ? familyFriendlyLines : SAFE_FAMILY_LINES;
}

function familySpeakerHint(line: string, family: DiningFamilyContext): number | null {
  if (CHILD_ADDRESS_REFERENCE.test(line)) return family.childIndices[0] ?? null;
  if (/\b(?:ba ơi|mẹ ơi|bà ơi|ông ơi)\b|^\s*(?:cho con|cho cháu|con (?:kể|muốn|đói|ngồi|nhớ|giữ|vừa|chưa|còn|thích|được|ăn|rửa|hôm|tới)|cháu (?:kể|muốn|đói|ngồi|nhớ|thích|được|ăn))\b/i.test(line) && family.childIndices.length > 0) {
    return family.childIndices[0] ?? null;
  }
  // Resolve self-references before the broad question rule below. Otherwise a
  // line such as “Ba gọi món con thích nhé?” is incorrectly attached to the
  // child just because it begins with “Ba” and ends with a question mark.
  if (/^\s*mẹ\s+(?:cũng|gọi|đồng ý|thử|thấy|để|nhớ|sẽ|thích|cảm ơn|chọn|gắp|muốn|tính)/i.test(line) && family.motherIndex !== null) {
    return family.motherIndex;
  }
  if (/^\s*ba\s+(?:cũng|gọi|đồng ý|thử|thấy|để|nhớ|sẽ|thích|cảm ơn|duyệt|bao|gắp|nghe theo|đang|chọn|muốn|tính)/i.test(line) && family.fatherIndex !== null) {
    return family.fatherIndex;
  }
  if (/^\s*bà\s+(?:cũng|gọi|đồng ý|thử|thấy|để|nhớ|sẽ|thích|cảm ơn|chọn|gắp|muốn|tính)/i.test(line) && family.grandmotherIndex !== null) {
    return family.grandmotherIndex;
  }
  if (/^\s*ông\s+(?:cũng|gọi|đồng ý|thử|thấy|để|nhớ|sẽ|thích|cảm ơn|chọn|gắp|muốn|tính)/i.test(line) && family.grandfatherIndex !== null) {
    return family.grandfatherIndex;
  }
  if (/^\s*(?:mẹ|ba|bà|ông) .*\?/i.test(line) && family.childIndices.length > 0) return family.childIndices[0] ?? null;
  if (/^\s*mẹ\b/i.test(line) && family.motherIndex !== null) return family.motherIndex;
  if (/^\s*ba\b/i.test(line) && family.fatherIndex !== null) return family.fatherIndex;
  if (/^\s*bà\b/i.test(line) && family.grandmotherIndex !== null) return family.grandmotherIndex;
  if (/^\s*ông\b/i.test(line) && family.grandfatherIndex !== null) return family.grandfatherIndex;
  return null;
}

function dialogueLinesForFamilySpeaker(
  lines: readonly string[],
  family: DiningFamilyContext,
  speakerIndex: number,
): readonly string[] {
  const compatible = dialogueLinesForParty(lines, "family", family);
  const roleMatched = compatible.filter((line) => {
    const suggestedSpeaker = familySpeakerHint(line, family);
    return suggestedSpeaker === null || suggestedSpeaker === speakerIndex;
  });
  if (roleMatched.length > 0) return roleMatched;
  const neutral = compatible.filter((line) => familySpeakerHint(line, family) === null);
  return neutral.length > 0 ? neutral : compatible;
}

function dialogueLineAt(lines: readonly string[], index: number, partyType: DiningPartyType, family: DiningFamilyContext): string {
  const availableLines = dialogueLinesForParty(lines, partyType, family);
  return availableLines[index % availableLines.length] ?? lines[0] ?? "";
}

const ARRIVAL_LINES: Record<DiningPartyType, Record<DialogueTone, readonly string[]>> = {
  family: {
    normal: [
      "Ngồi bàn này nhé, chỗ này nhìn mát mẻ đó.",
      "Cho con ngồi gần mẹ nha.",
      "Đi bộ tới đây hơi mỏi chân, ngồi nghỉ chút đã.",
      "Chọn bàn gần cửa này đi.",
      "Mình xem thực đơn trước nhé.",
      "Mùi đồ nướng thơm quá, gọi thử đi.",
      "Ngồi đây được đó, không chắn lối.",
      "Ba ngồi đây nha, con ngồi bên mẹ.",
    ],
    funny: [
      "Nãy ba nói ăn nhẹ thôi, giờ gọi món gì đây?",
      "Ai xem thực đơn thì chọn nhanh giúp cả nhà.",
      "Con đói rồi, gọi món trước đi mẹ.",
      "Ba nói ăn một món thôi, con nhớ đó nha.",
      "Đừng nhìn nồi lẩu nữa, xem thực đơn đi con.",
      "Đừng gọi cay quá, lát lại uống hết nước.",
      "Chọn món đi, con đói từ lúc trên đường.",
      "Ba giữ chỗ này rồi, ngồi xuống đi.",
    ],
    cheerful: [
      "Cuối tuần cả nhà mới đi ăn được.",
      "Lâu rồi cả nhà mới có dịp ra ngoài.",
      "Gọi món đi, con đói rồi.",
      "Ba mẹ chọn đi, con ăn món nào cũng được.",
      "Món nướng thơm quá.",
      "Hôm nay đông đủ rồi, mình gọi món nhé.",
      "Con thích ngồi bàn này.",
      "Ăn xong mình về cùng nhau nha.",
    ],
    cute: [
      "Mẹ ơi, cho con ngồi cạnh mẹ nha.",
      "Ba giữ chỗ này cho con phải không?",
      "Đèn lồng sáng đẹp quá mẹ ha.",
      "Con ngồi đây được không?",
      "Con kể mẹ nghe chuyện ở lớp nha.",
      "Ba gọi món con thích nhé?",
      "Con tự chọn món được không?",
      "Con đói rồi mẹ ơi.",
      "Để con ngồi gần mọi người.",
    ],
    grumpy: [
      "Mình vào rồi, bàn nào còn trống vậy?",
      "Đông thế này chắc món ra chậm một chút nhỉ?",
      "Quạt bên này chưa mát lắm.",
      "Bàn này còn dính chút nước, lau giúp mình nhé.",
      "Cho mình xin thực đơn với.",
      "Con đói rồi, mình gọi món sớm nha.",
      "Đèn hơi tối, cho mình xem thực đơn gần hơn chút.",
      "Đông thật, mình chờ thêm một lát vậy.",
    ],
  },
  friends: {
    normal: [
      "Tới đủ rồi, chọn món đi.",
      "Đường tới đây kẹt xe thật.",
      "Để túi xuống rồi xem thực đơn nha.",
      "Mọi người gọi trước đi, mình coi thêm.",
      "Bàn này còn chỗ, ngồi đây đi.",
      "Lâu rồi mới hẹn được đông đủ.",
      "Món nướng thơm quá.",
      "Ngồi trong này nói chuyện đỡ ồn hơn.",
    ],
    funny: [
      "Đi ăn thôi mà chọn món lâu ghê.",
      "Nãy bảo ăn nhẹ, giờ gọi mấy món đây?",
      "Chụp tấm hình nhanh đi, đồ ăn sắp nguội rồi.",
      "Nồi lẩu sôi rồi, gọi món đi mọi người.",
      "Nãy ai bảo chỉ gọi một món ấy nhỉ?",
      "Ai chọn quán vậy, chỉ chỗ gửi xe luôn đi.",
      "Mình gọi thêm món này để mọi người thử nhé.",
      "Chưa chọn được à, gọi món quen trước đi.",
    ],
    cheerful: [
      "Cuối cùng cũng đủ mặt, gọi món thôi.",
      "Mùi đồ nướng thơm thật.",
      "Tối nay ngồi thêm chút rồi về nha.",
      "Lâu rồi nhóm mình mới gặp đủ đông thế này.",
      "Chỗ này nhìn cũng ổn, mọi người chọn đi.",
      "Đường đông mà mọi người vẫn tới đủ ha.",
      "Đèn lồng đẹp đó.",
      "Ăn xong ngồi nói chuyện thêm chút nhé.",
    ],
    cute: [
      "Tớ giữ chỗ này cho cậu đó, mau ngồi đi.",
      "Tớ chừa chỗ cho cậu rồi, ngồi đây đi.",
      "Tớ chọn món chính, cậu chọn món tráng miệng nha.",
      "Ngồi sát vào, chừa chỗ cho người tới sau nữa.",
      "Đừng gọi cay nha, lần trước cậu khóc rồi đó.",
      "Thấy đèn lồng là nhớ chuyến đi hôm trước ghê.",
      "Chụp tấm hình nhóm rồi hẵng gọi món nha.",
      "Cậu ăn thử trước đi, rồi nói tớ biết ngon không.",
    ],
    grumpy: [
      "Quán đông quá, mình tự tìm bàn nhé?",
      "Cho mình xin thực đơn với, nãy giờ chưa thấy.",
      "Mình đứng hơi lâu rồi, bàn nào còn trống vậy?",
      "Bàn này hơi chật, có bàn khác không?",
      "Hy vọng món ra sớm, tụi mình đang đói.",
      "Nhạc hơi lớn, nói chuyện khó nghe quá.",
      "Mình gọi món rồi mà chưa biết ai nhận, hỏi giúp nhé.",
      "Đèn hơi tối, cho mình xem thực đơn với.",
    ],
  },
};

// After the authored one-liners, use short, self-contained thoughts so each
// arrival bubble stays readable.
const ARRIVAL_VARIANTS: Record<DialogueTone, { openings: readonly string[]; followups: readonly string[] }> = {
  normal: {
    openings: [
      "Đi một vòng quanh phố rồi ngồi xuống đây thấy dễ chịu ghê.", "Nãy tìm chỗ gửi xe hơi mất thời gian.",
      "Đường tới đây đông hơn mình nghĩ.", "Mọi người tới bằng mấy tuyến đường khác nhau ha.",
      "Chỗ này sáng sủa hơn mình tưởng.", "Cuối cùng cũng ngồi xuống nghỉ chân được rồi.",
      "Để túi gọn vào trong cho khỏi vướng nha.", "Mình nghe chuyện lúc nãy chưa kể xong đó.",
      "Tối nay có dịp ngồi chung một lúc rồi.", "Đầu hẻm dễ tìm hơn mình nghĩ.",
      "Mình vừa định nhắn thì mọi người tới rồi.", "Ngồi gần nhau nói chuyện dễ hơn.",
    ],
    followups: [
      "Mình cứ thong thả, không cần vội.", "Lát nữa kể tiếp chuyện lúc nãy nha.",
      "Ai cần nghỉ chân cứ ngồi thêm chút.", "Cứ để đồ gọn bên cạnh cho đỡ vướng.",
      "Tới đủ rồi, vậy là vui rồi.", "Đợi mọi người ổn định rồi tính tiếp.",
      "Đường ngoài kia đông, ngồi nghỉ chút đã.", "Chuyện công việc để mai tính.",
      "Hôm nay có dịp gặp nhau là tốt rồi.", "Lát về nhắn nhau để biết mọi người tới nhà.",
      "Ngồi gần nhau cho dễ trò chuyện nha.", "Mình giữ chỗ này cho cậu nè.",
    ],
  },
  funny: {
    openings: [
      "Mình tới trễ có một chút thôi, đừng nhìn đồng hồ.", "Tìm chỗ gửi xe lâu hơn mình tưởng.",
      "Mình đi đúng đường, chỉ là đường hơi vòng.", "Đi bộ hơi xa, cho mình ngồi nghỉ chút.",
      "Hẻm này hơi khó tìm, may là tới rồi.", "Mình nhắn ‘đang tới’ từ lúc còn ở nhà.",
      "Đi sát nhau nha, đoạn này hơi đông.", "Mọi người tới đủ rồi, chọn bàn đi.",
      "Mình chọn chỗ này vì gần cửa.", "Mới ngồi xuống mà cái túi đã chiếm ghế rồi.",
      "May là hôm nay không quên chìa khóa.", "Mọi người tới trước, mình tới đúng lúc.",
    ],
    followups: [
      "Tạm cho cái đồng hồ nghỉ, nó gây áp lực quá.", "Lần sau gửi ghim vị trí ngay từ đầu nha.",
      "Mình hứa lần tới chỉ vòng đúng một con hẻm.", "Nếu ai lạc thì cứ gọi, đừng đoán nữa.",
      "May là hôm nay chưa ai quên chìa khóa.", "Mình ngồi nghỉ cho đôi chân hết giận đã.",
      "Cái túi này nặng hơn vẻ ngoài của nó.", "Nhớ đừng ai nhận nhiệm vụ dẫn đường như mình.",
      "Chụp tấm hình chứng minh cả nhóm đã tới đi.", "Mình sẽ giả vờ là vừa tới đúng giờ.",
      "Ai đang giữ áo khoác thì nhận lại giúp nha.", "Tới đây rồi thì khỏi hỏi đường nữa nha.",
    ],
  },
  grumpy: {
    openings: [
      "Bên ngoài đông hơn mình tính.", "Đi bộ một đoạn cũng hơi mỏi chân.",
      "Chỗ này còn chỗ ngồi không nhỉ?", "Tụi mình đang chắn lối rồi, vào trong thôi.",
      "Tìm chỗ gửi xe hơi mất thời gian.", "Đường vòng làm mình tới trễ mất rồi.",
      "Cho mình đặt túi xuống đã nha.", "Không khí ở đây dễ chịu hơn ngoài phố.",
      "May quá, cuối cùng cũng có chỗ nghỉ.", "Nhắn trước là tới trễ thì đỡ phải đợi.",
      "Chỗ này có thể ngồi gần nhau chút không?", "Đường đông, mình không muốn đi vòng thêm nữa.",
    ],
    followups: [
      "Cho mình nghỉ vài phút rồi tính tiếp.", "Nhắn giúp người còn lại để họ khỏi tìm.",
      "Để lối đi thoáng cho mọi người nhé.", "Ngồi yên chút đã, đừng đi thêm vòng nữa.",
      "Biết thế mình gửi xe gần hơn.", "Giờ cứ ngồi nghỉ rồi nói chuyện sau.",
      "May là cả nhóm đã gặp nhau đủ.", "Cho mình xem đường về, khỏi đi lạc lần nữa.",
      "Ngồi chỗ này thấy đỡ ồn hơn ngoài kia.", "Đợi một chút cũng được, mình vừa tới mà.",
      "Lần sau hẹn ở chỗ dễ tìm hơn nha.", "Để điện thoại xuống cho đầu óc nghỉ đã.",
    ],
  },
  cheerful: {
    openings: [
      "Được gặp mọi người ngoài đời vui hơn nhắn tin nhiều.", "Hôm nay cả nhóm tới gần như cùng lúc luôn.",
      "Mọi người tới đủ rồi, gọi món thôi.", "Lâu rồi mới ngồi chung đủ mặt thế này.",
      "Mấy hôm rồi mới có dịp gặp nhau.", "Góc này sáng, ngồi cũng dễ chịu.",
      "Đi một vòng phố rồi, giờ ngồi nghỉ chút.", "Mọi người chọn bàn đi, chỗ nào cũng được.",
      "Mình có chuyện muốn kể cho mọi người nghe.", "Hôm nay tan làm sớm nên ghé được.",
      "Ở trong này đỡ ồn hơn ngoài phố.", "Để túi xuống rồi mình gọi món nhé.",
    ],
    followups: [
      "Cứ kể đi, mọi người đang nghe đây.", "Mình ngồi thêm chút cũng được mà.",
      "Lát nữa chụp tấm hình chung nha.", "Ai tới trễ thì lát kể chuyện bù đó nha.",
      "Hôm nay không cần ai phải vội về đâu.", "Ngồi đây nói chuyện tới lúc nào cũng được.",
      "Ngồi thêm một lát rồi về nha.", "Lát về nhắn nhau một tiếng nha.",
      "Chuyện vui kể trước, chuyện buồn để mai tính.", "Mình kéo ghế sát lại cho đủ chỗ nhé.",
      "Tớ muốn nghe tiếp chuyện chuyến đi hôm trước.", "Mỗi người kể một chuyện, bắt đầu từ người tới trễ nha.",
    ],
  },
  cute: {
    openings: [
      "Mình chừa chỗ này cho mọi người nè.", "Ngồi gần nhau cho dễ nói chuyện nha.",
      "Tớ giữ chỗ cạnh cửa cho cậu.", "Mọi người tới rồi, ngồi thôi.",
      "Mình kéo ghế sát vào cho đủ chỗ nha.", "Cậu đi đường có mệt không, ngồi nghỉ chút nhé.",
      "Chụp tấm hình nhóm rồi cất điện thoại nha.", "Tớ có chuyện muốn kể cho cậu nghe.",
      "Mình ngồi chỗ này cho dễ nói chuyện nha.", "Cậu tới rồi, ngồi nghỉ chút đi.",
      "Ngồi thêm một lúc cũng được mà.", "Tớ đợi mọi người nãy giờ.",
    ],
    followups: [
      "Tớ ngồi cạnh cậu nhé, có chuyện muốn hỏi nè.", "Để tớ cất túi giúp cho gọn nha.",
      "Mình ngồi yên một chút rồi kể tiếp chuyện nha.", "Tấm hình này phải có đủ cả nhóm mới được.",
      "Cậu chọn chỗ ngồi đi, tớ ngồi đâu cũng được.", "Lát ra về mình đi cùng nhau nha.",
      "Cậu cứ kể tiếp đi, tớ đang nghe đây.", "Tớ giữ áo khoác cho cậu nhé.",
      "Có mọi người ở đây là tớ thấy vui rồi.", "Để tớ nhường chỗ cho người tới sau nha.",
      "Mình ngồi thêm chút rồi tính tiếp nhé.", "Tớ gửi ảnh cho cậu sau khi chụp nha.",
    ],
  },
};

const ARRIVAL_PERSONA_LINES: Partial<Record<DialoguePersona, readonly string[]>> = {
  child: ["Con kể chuyện ở lớp cho mọi người nghe nha?", "Con ngồi xuống nghỉ chân một chút đã.", "Hôm nay tan học xong được đi cùng cả nhà vui ghê."],
  preschooler: ["Con ngồi cạnh mẹ nha, con có chuyện mới muốn kể!", "Con vừa vẽ một bức tranh thật to đó!", "Con tới quán rồi, lát con kể chuyện ở lớp mầm non nha."],
  grandmother: ["Bà ngồi nghỉ một chút rồi nghe mấy đứa kể chuyện nha.", "Đi bộ tới đây cũng vui, giờ ngồi thong thả thôi.", "Lâu rồi nhà mình mới có dịp ngồi đông đủ thế này."],
  grandfather: ["Tới nơi rồi, ngồi xuống kể chuyện khu phố cho vui.", "Đường hôm nay đông, cả nhà đi cùng nhau là yên tâm.", "Lâu rồi mới có bữa ngồi đủ mặt thế này."],
  office: ["Tan làm giờ này, đường đông hơn mình tưởng.", "Hôm nay họp hơi dài, ngồi nghỉ một chút đã.", "Mai còn phải dậy sớm, tối nay mình về vừa giờ nha."],
  teacher: ["Tan học xong ghé gặp bạn một chút, mai lại lên lớp sớm rồi.", "Hôm nay mấy bé trong lớp kể chuyện suốt, giờ mình kể chuyện người lớn nha.", "Sổ điểm cất rồi, tối nay cho đầu óc nghỉ một buổi."],
  student: ["Học xong tụi mình ghé đây luôn, ngồi nghỉ chút nha.", "Mai có tiết sớm, tối nay đừng về trễ quá đó.", "Bài nhóm xong rồi, giờ mới được thảnh thơi."],
  worker: ["Xong ca rồi, ngồi nghỉ chân một chút đã.", "Chạy ngoài đường cả buổi, giờ mới được ngồi yên.", "Hôm nay làm xong sớm hơn dự tính, tranh thủ gặp mọi người."],
  tourist: ["Đi dọc con phố này vui thật, mình nghỉ chân một lát nhé.", "Mình muốn ngắm phố thêm sau khi ngồi nghỉ.", "Khu này nhộn nhịp hơn mình nghĩ."],
  creator: ["Góc này có ánh đèn đẹp, lát mình chụp một tấm nha.", "Tối nay mình tạm cất điện thoại, ngồi nói chuyện đã.", "Mình lưu địa chỉ chỗ này để lần sau quay lại."],
  comic: ["Tui đi bộ có một đoạn mà đôi chân tưởng hết ca rồi.", "Tui tới đúng giờ nha, chỉ là đồng hồ hơi hiểu lầm thôi.", "Ngồi xuống cái là hết muốn làm người bận rộn liền."],
  local: ["Hôm nay quanh đây đông hơn mọi hôm ha.", "Đi một vòng khu phố rồi, ngồi nghỉ chút cho khỏe.", "Lâu rồi mới gặp nhau ở gần nhà thế này."],
  mechanic: ["Xưởng vừa khóa cửa, ghé gặp bạn rồi về nghỉ thôi.", "Chú rửa tay mấy lần mới hết mùi dầu đó.", "Tan ca rồi, tối nay chú không nhận thêm xe nữa."],
  "traditional-driver": ["Chạy cuốc cuối xong, chú ghé ngồi nghỉ chân.", "Nãy chú gặp đường đang sửa nên vòng qua hẻm bên.", "Để nón gọn bên cạnh, ngồi nói chuyện chút đã."],
  "taxi-driver": ["Tan ca rồi, chú trả xe xong mới ghé qua đây.", "Ngoài đường đông mà ngồi xuống thấy yên hẳn.", "Chú vừa đưa khách cuối tới nơi rồi mới tới."],
  nurse: ["Ca trực vừa bàn giao, cuối cùng cũng ngồi xuống.", "Hôm nay bệnh viện đông, giờ cô mới được nghỉ một chút.", "Cô tranh thủ gặp bạn trước khi về ngủ bù."],
  musician: ["Tối nay không có buổi diễn, tụi mình gặp nhau nói chuyện thôi.", "Hôm nay cây cajon được nghỉ, còn người chơi thì cần ăn tối.", "Chú ý, tối nay mình kể chuyện chứ không cần giữ nhịp nha."],
};

const ORDER_PERSONA_LINES: Partial<Record<DialoguePersona, readonly string[]>> = {
  child: ["Con muốn thử {dish}, mình chia nhau nha.", "Cho con gọi {dish} nhé, con sẽ ăn gọn phần mình.", "Món {dish} này con chưa thử bao giờ."],
  preschooler: ["Con muốn gọi {dish} để cả nhà chia nhau ạ.", "Cho con chọn {dish} nha, con sẽ ăn cùng mọi người.", "Món {dish} nhìn lạ quá, con muốn thử một chút."],
  grandmother: ["Cho bà xin {dish} nha, món này hợp ngồi ăn chung.", "Mình gọi {dish} trước đi, bà muốn thử xem sao.", "Thêm {dish} vào bàn nhé, bà nghĩ cả nhà sẽ thích."],
  grandfather: ["Cho cả bàn thử {dish} nha, lâu rồi tôi chưa ăn món này.", "Gọi {dish} đi, món này dễ chia cho mọi người.", "Tôi chọn {dish} nhé, hôm nay ngồi lâu một chút."],
  office: ["Cho nhóm mình {dish} trước nhé, hôm nay tan làm muộn quá.", "Mình gọi {dish} nha, ăn xong còn kịp chuyến xe.", "Thêm {dish} vào bàn nhé, nãy giờ mọi người chưa ăn gì."],
  teacher: ["Cho nhóm mình {dish} nhé, mai cô còn phải dậy sớm.", "Mình gọi {dish} nha, hôm nay nói chuyện lớp học đủ rồi.", "Thêm {dish} vào bàn đi, ngồi với bạn cũ phải tranh thủ kể chuyện nữa."],
  student: ["Cho tụi mình một phần {dish} nha, chia đều là vừa.", "Mình gọi {dish} trước nhé, lát còn phải về làm bài.", "Tụi mình thử {dish} đi, phần này vừa túi tiền."],
  worker: ["Cho một phần {dish} trước nha, tụi mình vừa xong ca.", "Gọi {dish} đi, ăn xong còn nghỉ lấy sức.", "Cho nhóm mình {dish} nhé, chia nhau ăn cho tiện."],
  tourist: ["Món {dish} này là món quen ở đây hả? Cho mình thử nhé.", "Cho tụi mình {dish} nha, mình muốn thử món địa phương.", "Mình chưa ăn {dish} bao giờ, gọi một phần để chia nhé."],
  creator: ["Cho mình gọi {dish} nha, món này trông đáng thử đó.", "Mình gọi {dish} nhé, lát nếm xong kể mọi người nghe.", "Thêm {dish} vào bàn đi, món này hợp ăn chung."],
  comic: ["Cho tui {dish} nha, đói từ nãy tới giờ rồi.", "Gọi {dish} đi, tui ăn chung với mọi người.", "Cho một phần {dish} nhé, món này nhìn ngon đó."],
  local: ["Cho nhóm mình {dish} nhé, món này dễ chia.", "Mình gọi {dish} trước nha, ăn xong còn đi tiếp.", "Thử {dish} đi, lâu rồi mình chưa ăn món này."],
  mechanic: ["Cho nhóm mình {dish} nhé, vừa xong ca sửa xe.", "Gọi {dish} nha, hôm nay chú đứng cả buổi rồi.", "Chọn {dish} đi, ăn xong chú kể chuyện cái xe khó sửa nhất."],
  "traditional-driver": ["Cho chú gọi {dish} nhé, chạy ngoài đường nãy giờ đói rồi.", "Thêm {dish} đi, mình ăn xong rồi tính đường về.", "Gọi {dish} nha, món này chia nhau ăn tiện."],
  "taxi-driver": ["Cho nhóm mình {dish} trước nhé, chú vừa hết ca.", "Gọi {dish} nha, ăn xong chú còn tranh thủ về nghỉ.", "Thêm {dish} đi, chú đưa khách cả ngày chưa kịp ăn tử tế."],
  nurse: ["Cho cô gọi {dish} nhé, ca tối nay dài quá rồi.", "Thêm {dish} cho nhóm mình nha, ăn xong cô về ngủ bù.", "Mình gọi {dish} đi, cô vừa bàn giao ca trực xong."],
  musician: ["Cho tụi mình {dish} nha, chơi nhạc xong đói quá rồi.", "Gọi {dish} đi, tối nay không phải canh giờ diễn.", "Thêm {dish} nhé, ăn xong tụi mình đi bộ về."],
};

const ORDER_REPLY_PERSONA_LINES: Partial<Record<DialoguePersona, readonly string[]>> = {
  child: ["Được, nhưng ăn chậm thôi nha.", "Ừ, con chọn đi rồi cả nhà chia nhau.", "Nhớ để dành một miếng cho mọi người đó."],
  preschooler: ["Dạ, con sẽ chờ mọi người ngồi đủ rồi ăn chung.", "Con chọn phần nhỏ thôi, còn chừa bụng ăn món khác.", "Dạ, con ngồi ngoan chờ món nha."],
  grandmother: ["Ừ, gọi thêm đi, bà ăn chung với cả nhà.", "Bà đồng ý, món này nghe hợp đó.", "Cứ gọi vừa đủ thôi, mình còn ngồi trò chuyện nữa."],
  grandfather: ["Ừ, gọi đi, lâu lâu cả nhà mới ngồi đông đủ.", "Được, món này dễ chia mà.", "Tôi đồng ý, gọi thêm một phần nhé."],
  office: ["Ừ, ăn xong mình về nghỉ sớm nhé.", "Được, hôm nay ai cũng cần nạp năng lượng.", "Chốt nha, điện thoại công việc để yên một lúc đi."],
  teacher: ["Ừ, gọi vừa đủ thôi, mai cô vẫn phải lên lớp sớm.", "Được, tối nay mình kể chuyện vui thôi, đừng nhắc sổ điểm nữa nha.", "Chốt, lâu rồi hai đứa mình mới ngồi lâu vậy."],
  student: ["Chốt, lát chia tiền đều nha.", "Được, ăn xong mình về ôn bài cùng nhau.", "Ừ, gọi vừa đủ thôi để còn kịp chuyến xe."],
  worker: ["Ừ, ăn xong mình nghỉ một lát rồi về.", "Chốt, hôm nay ai cũng làm cả ngày rồi.", "Được, ngồi thư giãn chút rồi tính tiếp."],
  tourist: ["Được, mình cũng muốn thử món này.", "Chốt nhé, cảm ơn đã chọn giúp mình.", "Ừ, mình gọi món địa phương là đúng rồi."],
  creator: ["Được, nhưng mình cất máy rồi ăn cho nóng nha.", "Chốt, nếm xong mình nói cảm nhận sau.", "Ừ, để mọi người ăn trước, ảnh chụp sau cũng được."],
  comic: ["Tui đồng ý, món này nghe được đó.", "Ừ, gọi đi, tui cũng muốn ăn.", "Được, lát chia nhau nhé."],
  local: ["Ừ, vừa ăn vừa kể chuyện khu mình nhé.", "Chốt nha, lát mình đi bộ về cho thoáng.", "Được, gặp nhau thế này vui hơn ngồi nhà."],
  mechanic: ["Được, tối nay chú không còn phải vội về xưởng.", "Chốt nhé, chú rửa tay xong rồi mới gắp.", "Ừ, gọi vừa đủ rồi mình ngồi nghỉ thêm chút."],
  "traditional-driver": ["Ừ, chú dựng nón gọn rồi, cứ gọi đi.", "Được, ăn xong chú đi cùng cậu ra đầu phố.", "Chốt nha, mai chạy xe thì tối nay phải nghỉ sớm."],
  "taxi-driver": ["Ừ, chú tắt bộ đàm rồi, tối nay nói chuyện thôi.", "Được, gọi đi rồi chú ngồi nghỉ một lát.", "Chốt nhé, hết ca rồi không cần nhìn đồng hồ nữa."],
  nurse: ["Ừ, gọi đi, cô đã bàn giao xong ca rồi.", "Được, tối nay mình không nhắc chuyện công việc nữa nha.", "Chốt nhé, ăn xong cô về ngủ cho đủ giấc."],
  musician: ["Ừ, gọi đi. Hôm nay không phải canh giờ diễn.", "Được, ăn xong rồi tính chuyện buổi diễn sau.", "Ừ, tối nay để cajon nghỉ, mình cứ ngồi lâu chút."],
};

const WAITING_ORDER_PAIRS: Record<DiningPartyType, readonly ConversationPair[]> = {
  family: [
    { text: "Con kể chuyện ở lớp trong lúc chờ nha?", reply: "Kể đi, mẹ đang nghe đây.", speakerPersona: "child", replyPersona: "mother" },
    { text: "Ba ơi, chiều nay con được cô khen đó.", reply: "Giỏi quá, lát kể ba nghe rõ hơn nha.", speakerPersona: "child", replyPersona: "father" },
    { text: "Hôm nay đường về nhà có đông không?", reply: "Cũng đông, mà giờ ngồi đây thấy thư thả rồi." },
    { text: "Mình ngồi gần nhau cho dễ nói chuyện nha.", reply: "Ừ, hiếm khi cả nhà rảnh cùng một buổi." },
    { text: "Mẹ để con tự chọn một món nhé?", reply: "Được, con chọn món con thích đi.", speakerPersona: "mother", replyPersona: "child" },
    { text: "Cuối tuần mình ghé thăm ông bà nha?", reply: "Ừ, để ba mẹ sắp xếp rồi đi cùng con." },
    { text: "Ngồi nghỉ một chút rồi mình xem thực đơn.", reply: "Được, cả nhà không cần vội đâu." },
    { text: "Con giữ chỗ này cho ba mẹ nè.", reply: "Cảm ơn con, ngồi cạnh nhau là vui rồi.", speakerPersona: "child" },
    { text: "Hôm nay ở lớp có chuyện gì vui không con?", reply: "Có, lát con kể cho ba mẹ nghe nha." },
    { text: "Đi cùng nhau thế này lâu rồi mới có dịp.", reply: "Ừ, mình cứ ngồi thoải mái một chút." },
    { text: "Con nhớ mai mình phải dậy sớm đó nha.", reply: "Con nhớ rồi, tối nay con sẽ về đúng giờ.", speakerPersona: "mother", replyPersona: "child" },
    { text: "Mọi người ngồi ổn chưa, có cần đổi chỗ không?", reply: "Ổn rồi, mình ngồi đây vừa thoáng." },
  ],
  friends: [
    { text: "Cuối cùng cũng gặp đủ mặt, tuần này ai cũng bận.", reply: "Ừ, ngồi với nhau một lát là thấy nhẹ đầu rồi." },
    { text: "Nãy gửi địa chỉ mà cậu tìm có dễ không?", reply: "Dễ, chỉ kẹt xe đoạn cuối thôi." },
    { text: "Mai ai có lịch sớm thì nhớ báo để về trước nha.", reply: "Tớ có việc buổi sáng, nhưng giờ vẫn ngồi thêm được." },
    { text: "Chuyện hôm trước cậu kể tới đoạn nào rồi?", reply: "Đợi đủ người rồi tớ kể từ đầu cho vui." },
    { text: "Lát nữa ăn xong mình đi bộ một vòng không?", reply: "Đi chứ, nếu mọi người còn sức." },
    { text: "Cậu gửi hình chuyến đi hôm nọ chưa?", reply: "Tớ gửi vào nhóm rồi, xem lại vẫn buồn cười." },
    { text: "Hôm nay ai đi xe thì lát nhớ lấy nón nha.", reply: "Tớ để ngay cạnh ghế rồi, cảm ơn nhắc." },
    { text: "Ngồi đây nói chuyện nghe nhau rõ hơn ngoài đường.", reply: "Chuẩn, ngoài kia xe chạy ồn quá." },
    { text: "Cậu còn làm ở chỗ cũ không?", reply: "Còn, dạo này đổi ca nên giờ mới rảnh." },
    { text: "Mọi người có nghe tin khu mình sắp sửa đường chưa?", reply: "Có nghe, mong là làm xong trước mùa mưa." },
    { text: "Hẹn lần trước mà ai cũng bận, nay mới đủ nhóm.", reply: "Tháng sau mình chốt lịch sớm hơn nhé." },
    { text: "Tớ để điện thoại úp xuống rồi, tối nay nghỉ việc chút.", reply: "Hay đó, có gì mai trả lời cũng được." },
    { text: "Cậu tới bằng xe buýt hay tự chạy xe vậy?", reply: "Tớ gửi xe đầu hẻm rồi đi bộ vào." },
    { text: "Ngồi gần nhau đi, tớ có chuyện muốn kể.", reply: "Kể đi, bọn tớ nghe đây." },
    { text: "Tớ tưởng cậu không tới được cơ.", reply: "Suýt nữa thì trễ, may là kịp." },
    { text: "Mình thống nhất lát ai gọi xe về nhé.", reply: "Để gần về rồi tính, giờ cứ thư giãn đã." },
  ],
};

const WAITING_FOOD_PAIRS: Record<DiningPartyType, readonly ConversationPair[]> = {
  family: [
    { text: "Con rửa tay rồi, chờ món thôi nha.", reply: "Ừ, ngồi yên một chút kẻo vướng lối đi.", speakerPersona: "child" },
    { text: "Mình cứ nói chuyện, món làm xong sẽ mang ra.", reply: "Ừ, tối nay cả nhà không cần tranh thủ gì cả." },
    { text: "Ba còn nhớ chuyến đi biển hồi hè không?", reply: "Nhớ chứ, lần sau mình đi sớm hơn nha.", speakerPersona: "child", replyPersona: "father" },
    { text: "Con có mệt không, ngồi nghỉ một chút nhé?", reply: "Con ổn ạ, ở đây mát nên dễ chịu.", speakerPersona: "mother", replyPersona: "child" },
    { text: "Mai mình đừng quên ghé tiệm sách nha.", reply: "Con nhớ rồi, con muốn chọn truyện mới." },
    { text: "Chờ một chút cũng được, mình đang có thời gian.", reply: "Ừ, hiếm khi cả nhà ngồi kể chuyện lâu thế này." },
    { text: "Mọi người có muốn uống nước trước không?", reply: "Có, cho ba một ly nước lọc nhé." },
    { text: "Con kể xong chuyện ở lớp chưa?", reply: "Còn đoạn vui nhất nữa, lát con kể tiếp." },
    { text: "Hôm nay con ngoan ghê, tự xếp cặp rồi đó.", reply: "Tại con muốn đi chơi với ba mẹ mà." },
    { text: "Mình ngồi thêm chút rồi về, không phải vội.", reply: "Dạ, con thích được đi cùng cả nhà." },
    { text: "Quạt bên này mát hơn lúc nãy đó.", reply: "Ừ, chỗ này ngồi dễ chịu thật." },
    { text: "Lát ăn xong mình chụp tấm hình nhé.", reply: "Được, để con ngồi sát vào giữa." },
  ],
  friends: [
    { text: "Ngồi chờ thế này mới có dịp nghe nốt chuyện.", reply: "Đúng rồi, nãy cậu đang kể vụ ở công ty mà." },
    { text: "Đoạn đường về hôm nay có sửa nên hơi vòng.", reply: "Tớ cũng thấy, chắc tuần sau đi đường khác." },
    { text: "Cậu làm bài thuyết trình xong chưa?", reply: "Gần xong rồi, tối nay tớ sửa nốt." },
    { text: "Tớ vừa tắt thông báo công việc rồi.", reply: "Chuẩn, tối nay dành thời gian cho nhóm mình." },
    { text: "Ai còn nhớ tên quán cà phê lần trước không?", reply: "Tớ lưu địa chỉ rồi, lát gửi cho mọi người." },
    { text: "Ngồi trong này đỡ ồn hơn ngoài phố ha.", reply: "Ừ, nghe nhau nói chuyện rõ hơn nhiều." },
    { text: "Lát ra ngoài nhớ đợi nhau rồi hãy đi nha.", reply: "Ừ, ra tới đường lớn rồi mình tính tiếp." },
    { text: "Tớ tưởng cậu đi ca tối nay cơ.", reply: "Đổi ca được nên tớ ghé gặp mọi người." },
    { text: "Nhóm mình lâu rồi chưa đi chơi xa.", reply: "Để tháng tới chọn ngày rồi đặt lịch nha." },
    { text: "Tớ vừa gửi tiền gửi xe vào nhóm rồi đó.", reply: "Thấy rồi, lát tớ chia lại cho đủ." },
    { text: "Cái chuyện cậu kể lúc nãy nghe khó tin ghê.", reply: "Tớ thề là có thật, lát tớ mở hình cho xem." },
    { text: "Lát nữa ai về hướng cầu thì đi cùng tớ nha.", reply: "Được, mình ra tới đường lớn rồi tính." },
    { text: "Ngồi yên một lúc mới thấy hôm nay mệt thật.", reply: "Ừ, làm cả ngày rồi, nghỉ chút đi." },
    { text: "Tớ giữ chỗ gửi xe gần đây, khỏi đi xa.", reply: "Cảm ơn nha, lát về đỡ phải vòng lại." },
    { text: "Cậu còn chơi môn đó mỗi tuần không?", reply: "Có, nhưng dạo này đổi sang sáng Chủ nhật." },
    { text: "Nếu món lâu thì mình cứ nói chuyện trước nha.", reply: "Ừ, giờ gặp nhau mới là chính." },
  ],
};

const PAYMENT_PAIRS: Record<DiningPartyType, readonly ConversationPair[]> = {
  family: [
    { text: "Để ba thanh toán nhé, mọi người cứ ngồi nghỉ.", reply: "Cảm ơn ba, tối nay cả nhà vui lắm.", speakerPersona: "father" },
    { text: "Mẹ kiểm tra đồ đạc xem con có quên gì không nha.", reply: "Con có đủ cặp với áo khoác rồi ạ.", speakerPersona: "mother", replyPersona: "child" },
    { text: "Con no rồi, cảm ơn ba mẹ đưa con đi ăn.", reply: "Cả nhà đi cùng nhau là vui rồi.", speakerPersona: "child", replyPersona: "mother" },
    { text: "Mình xem lại bàn có để quên điện thoại không.", reply: "Không ai để quên gì, mình chuẩn bị về thôi." },
    { text: "Lần sau mình rủ ông bà đi cùng nha.", reply: "Ừ, để ba mẹ hẹn ông bà dịp gần nhất." },
    { text: "Con lấy áo khoác rồi, mình về được chưa?", reply: "Được, ra ngoài nhớ đi sát ba mẹ nha.", speakerPersona: "child", replyPersona: "mother" },
    { text: "Hôm nay ngồi với nhau lâu hơn mọi lần ha.", reply: "Ừ, về nhà rồi mình xem lại tấm hình nhé." },
    { text: "Mình đi chậm thôi, ngoài cửa đang đông.", reply: "Ừ, để con đi giữa ba mẹ." },
  ],
  friends: [
    { text: "Tớ thanh toán trước rồi gửi phần từng người sau nha.", reply: "Được, gửi tổng vào nhóm để bọn tớ chuyển." },
    { text: "Ai đi chung đường thì lát mình về cùng nhé.", reply: "Tớ đi hướng cầu, mình ra tới đường lớn rồi tính." },
    { text: "Mọi người kiểm tra điện thoại với chìa khóa đi.", reply: "Đủ rồi, cảm ơn nhắc nha." },
    { text: "Hẹn lần sau đừng để cách nhau lâu vậy nữa.", reply: "Chốt ngày sớm đi, lần này đừng ai bùng." },
    { text: "Tớ gọi xe rồi, chắc vài phút nữa tới.", reply: "Tớ đứng chờ ngoài hiên với cậu nhé." },
    { text: "Ai để quên nón ở ghế không?", reply: "Không phải của tớ, của ai thì kiểm tra giúp nha." },
    { text: "Mai tớ gửi ảnh vào nhóm, giờ về cẩn thận nha.", reply: "Ừ, tới nhà nhắn một tiếng cho mọi người." },
    { text: "Cảm ơn đã tới, bữa nay nói chuyện vui thật.", reply: "Tụi mình gặp nhau thêm sớm nha." },
  ],
};

const PERSONA_CONVERSATION_PAIRS: Partial<Record<DialoguePersona, Partial<Record<DiningConversationPhase, readonly ConversationPair[]>>>> = {
  child: {
    "waiting-order": [{ text: "Mai lớp con có tiết vẽ đó.", reply: "Vậy tối nay con ngủ sớm để mai tỉnh táo nhé.", speakerPersona: "child", replyPersona: "mother" }],
    "waiting-food": [{ text: "Con vừa được cô dán sao bé ngoan.", reply: "Giỏi quá, lát về con kể thêm cho mẹ nghe.", speakerPersona: "child", replyPersona: "mother" }],
    eating: [{ text: "Hôm nay con vui vì được đi cùng cả nhà.", reply: "Ba mẹ cũng vui, lần sau mình lại đi nhé.", speakerPersona: "child", replyPersona: "mother" }],
  },
  preschooler: {
    "waiting-order": [{ text: "Con ngồi cạnh mẹ để kể chuyện nha?", reply: "Ừ, mẹ nghe con kể đây.", speakerPersona: "preschooler", replyPersona: "mother" }],
    "waiting-food": [{ text: "Hôm nay cô cho con dán hình ngôi sao đó!", reply: "Giỏi quá, lát về con kể ba nghe nữa nhé.", speakerPersona: "preschooler", replyPersona: "father" }],
    eating: [{ text: "Con ăn miếng nhỏ thôi để còn nghe mọi người kể chuyện.", reply: "Cứ ăn từ từ nha, cả nhà đang ngồi cùng con mà.", speakerPersona: "preschooler", replyPersona: "mother" }],
    "awaiting-payment": [{ text: "Con ăn xong rồi, mình về cùng nhau nha?", reply: "Ừ, cả nhà mình đi chậm thôi.", speakerPersona: "preschooler", replyPersona: "mother" }],
  },
  grandmother: {
    "waiting-order": [{ text: "Đi bộ tới đây, tôi muốn ngồi nghỉ chân một chút.", reply: "Nghỉ đi, mình không vội.", speakerPersona: "grandmother", replyPersona: "child" }],
    "waiting-food": [{ text: "Khu này thay đổi nhiều mà vẫn còn mấy hàng quen.", reply: "Lần sau mình ghé quán nước kia nhé.", speakerPersona: "grandmother", replyPersona: "child" }],
    eating: [{ text: "Món này ngày trước gần nhà mình cũng có bán.", reply: "Bà kể thêm đi, tụi con đang nghe.", speakerPersona: "grandmother", replyPersona: "child" }],
    "awaiting-payment": [{ text: "Ăn xong rồi, mình về thôi.", reply: "Dạ, để con đi cùng bà ra cửa.", speakerPersona: "grandmother", replyPersona: "child" }],
  },
  grandfather: {
    "waiting-order": [{ text: "Ngồi xuống rồi mới thấy chân mỏi thật.", reply: "Nghỉ một lát rồi mình gọi món nha.", speakerPersona: "grandfather", replyPersona: "child" }],
    "waiting-food": [{ text: "Đường trước hẻm mới sửa, đi êm hơn hẳn.", reply: "Vậy mai mình đi đường bên kia cho đỡ bụi.", speakerPersona: "grandfather", replyPersona: "child" }],
    eating: [{ text: "Nói chuyện một hồi mà quên cả giờ.", reply: "Lâu rồi nhà mình mới có buổi tối thong thả vậy.", speakerPersona: "grandfather", replyPersona: "child" }],
    "awaiting-payment": [{ text: "Ăn no rồi, mình về thôi.", reply: "Ừ, ra đầu hẻm rồi mình gọi xe nhé.", speakerPersona: "grandfather", replyPersona: "child" }],
  },
  office: {
    "waiting-order": [{ text: "Hôm nay lịch họp kín tới tận chiều.", reply: "Mai nhớ để trống giờ nghỉ trưa một chút nha.", speakerPersona: "office", replyPersona: "office" }],
    "waiting-food": [{ text: "Tớ vừa gửi xong bản báo cáo cuối ngày.", reply: "Thế thì tối nay khỏi nghĩ tới công việc nữa.", speakerPersona: "office", replyPersona: "office" }],
    eating: [{ text: "Sếp vừa nhắn, nhưng mai trả lời cũng được.", reply: "Đúng, giờ này mình đang nghỉ rồi.", speakerPersona: "office", replyPersona: "office" }],
  },
  teacher: {
    "waiting-order": [{ text: "Hôm nay mấy bé trong lớp làm cô cười cả buổi.", reply: "Nghe kể thôi đã thấy vui rồi, mai cô kể tiếp nha.", speakerPersona: "teacher", replyPersona: "office" }],
    "waiting-food": [{ text: "Cô mới cất sổ điểm vào túi, tối nay không chấm bài nữa.", reply: "Đúng rồi, bữa tối là giờ nghỉ của cô mà.", speakerPersona: "teacher", replyPersona: "office" }],
    eating: [{ text: "Cả ngày nói chuyện với học trò, giờ cô muốn nghe chuyện của cậu.", reply: "Vậy để tớ kể chuyện chuyến xe buýt sáng nay nhé.", speakerPersona: "teacher", replyPersona: "office" }],
    "awaiting-payment": [{ text: "Mai cô có tiết đầu giờ, mình về sớm một chút nha.", reply: "Ừ, để tớ đi cùng cô ra đầu phố.", speakerPersona: "teacher", replyPersona: "office" }],
  },
  student: {
    "waiting-order": [{ text: "Nhóm bài tập của mình đã chia việc chưa?", reply: "Rồi, tớ nhận phần thuyết trình nhé.", speakerPersona: "student", replyPersona: "student" }],
    "waiting-food": [{ text: "Mai cậu cho tớ mượn vở ghi buổi trước nha.", reply: "Được, mai tớ mang theo.", speakerPersona: "student", replyPersona: "student" }],
    eating: [{ text: "Thi xong môn này là tớ ngủ bù cả ngày.", reply: "Nhớ rủ tớ đi cùng, tớ cũng thiếu ngủ rồi.", speakerPersona: "student", replyPersona: "student" }],
  },
  worker: {
    "waiting-order": [{ text: "Ca hôm nay đông hơn dự tính nhiều.", reply: "Ừ, may là giờ cũng xong việc rồi.", speakerPersona: "worker", replyPersona: "worker" }],
    "waiting-food": [{ text: "Đoạn đường gần chợ đang sửa, mai nhớ né nhé.", reply: "Cảm ơn, tớ sẽ đi đường bên kia.", speakerPersona: "worker", replyPersona: "worker" }],
    eating: [{ text: "Tuần này lịch làm của cậu có đổi nữa không?", reply: "Chưa biết, có gì tớ nhắn vào nhóm.", speakerPersona: "worker", replyPersona: "worker" }],
  },
  tourist: {
    "waiting-order": [{ text: "Mình thích cách con phố vẫn đông vui buổi tối.", reply: "Cuối tuần còn nhộn nhịp hơn nữa đó.", speakerPersona: "tourist", replyPersona: "local" }],
    "waiting-food": [{ text: "Có con hẻm nào gần đây đáng đi bộ ngắm không?", reply: "Ra đầu đường rồi rẽ trái sẽ có nhiều hàng nhỏ.", speakerPersona: "tourist", replyPersona: "local" }],
    eating: [{ text: "Mình sẽ ghi lại địa chỉ khu phố này.", reply: "Lần sau quay lại, tụi mình chỉ thêm vài chỗ hay.", speakerPersona: "tourist", replyPersona: "local" }],
  },
  creator: {
    "waiting-order": [{ text: "Tớ định chụp vài tấm, mà góc này đẹp sẵn rồi.", reply: "Chụp xong cất máy xuống ngồi với mọi người nha.", speakerPersona: "creator" }],
    "waiting-food": [{ text: "Tớ đang chọn ảnh, cái nào cũng rung tay hết.", reply: "Để lát tớ gửi tấm chụp chung cho.", speakerPersona: "creator" }],
    eating: [{ text: "Thôi tớ cất máy, ăn nóng với mọi người đã.", reply: "Hay đó, câu chuyện ngoài đời vui hơn màn hình.", speakerPersona: "creator" }],
  },
  comic: {
    "waiting-order": [{ text: "Tui đói rồi, chọn món nhanh giúp tui nha.", reply: "Ừ, để coi món nào ra nhanh.", speakerPersona: "comic" }],
    "waiting-food": [{ text: "Chưa ra món nữa hả? Tui bắt đầu đói lại rồi.", reply: "Nãy giờ ông nói đói mấy lần rồi đó.", speakerPersona: "comic" }],
    eating: [{ text: "Tui đang kể chuyện này tự nhiên nhớ chuyện khác.", reply: "Ừ, ông kể tiếp đi, tui đang nghe.", speakerPersona: "comic" }],
  },
  local: {
    "waiting-order": [{ text: "Tiệm sửa đường đầu hẻm mở lại chưa nhỉ?", reply: "Sáng nay tớ đi ngang thấy họ dọn máy rồi.", speakerPersona: "local", replyPersona: "local" }],
    "waiting-food": [{ text: "Sáng mai chợ họp sớm, cậu có đi không?", reply: "Có, tớ định ghé trước giờ đông.", speakerPersona: "local", replyPersona: "local" }],
    eating: [{ text: "Dạo này hàng cây đầu phố xanh lên rồi ha.", reply: "Ừ, chiều đi ngang thấy mát hơn hẳn.", speakerPersona: "local", replyPersona: "local" }],
  },
  mechanic: {
    "waiting-order": [{ text: "Cái xe khó sửa nhất hôm nay cuối cùng cũng nổ máy.", reply: "Vậy là về xưởng yên tâm rồi, mai tính tiếp.", speakerPersona: "mechanic", replyPersona: "traditional-driver" }],
    "waiting-food": [{ text: "Tay chú còn mùi dầu không vậy?", reply: "Rửa kỹ rồi, giờ chỉ còn mùi đồ nướng thôi.", speakerPersona: "mechanic", replyPersona: "traditional-driver" }],
    eating: [{ text: "Mai xe chú thay nhớt rồi, chạy chắc êm hơn.", reply: "Ừ, để mai chú ghé xưởng kiểm tra nha.", speakerPersona: "mechanic", replyPersona: "traditional-driver" }],
    "awaiting-payment": [{ text: "Ngồi nghỉ một chút thấy khỏe lại rồi.", reply: "Ừ, mai mình lại gặp ngoài phố nha.", speakerPersona: "mechanic", replyPersona: "traditional-driver" }],
  },
  nurse: {
    "waiting-order": [{ text: "Cô vừa bàn giao xong ca, đầu óc vẫn còn nghĩ tới lịch trực.", reply: "Ăn tối xong rồi hãy tính, tối nay nghỉ một chút đi.", speakerPersona: "nurse", replyPersona: "taxi-driver" }],
    "waiting-food": [{ text: "Ngày mai chú chạy ca sáng nên tối nay phải ngủ sớm.", reply: "Vậy ăn thong thả chút rồi chú về nghỉ nha.", speakerPersona: "taxi-driver", replyPersona: "nurse" }],
    eating: [{ text: "Cô ngủ bù xong sẽ nhắn chú, rồi mình hẹn mọi người lần nữa.", reply: "Ừ, hết ca chú cũng rảnh hơn một chút.", speakerPersona: "nurse", replyPersona: "taxi-driver" }],
    "awaiting-payment": [{ text: "Cảm ơn đã chờ cô tan ca mới hẹn được.", reply: "Bạn bè mà, khi nào rảnh mình lại gặp.", speakerPersona: "nurse", replyPersona: "taxi-driver" }],
  },
  "taxi-driver": {
    "waiting-order": [{ text: "Hôm nay chú đi mấy vòng quanh phố, vẫn chưa thử con hẻm bên kia.", reply: "Mai cô rảnh thì mình đi bộ qua đó xem nha.", speakerPersona: "taxi-driver", replyPersona: "nurse" }],
    "waiting-food": [{ text: "Đường ngoài kia đông, may mà giờ mình ngồi yên được rồi.", reply: "Ừ, ca trực cũng xong, tối nay mình nghỉ thôi.", speakerPersona: "taxi-driver", replyPersona: "nurse" }],
    eating: [{ text: "Chú cất điện thoại công việc rồi, tối nay không nhận thêm cuốc nữa.", reply: "Vậy tốt, mình cứ nói chuyện thoải mái đi.", speakerPersona: "taxi-driver", replyPersona: "nurse" }],
  },
  musician: {
    "waiting-order": [{ text: "Tối nay nghỉ diễn, tự nhiên không biết nên bắt đầu câu chuyện từ đâu.", reply: "Bắt đầu bằng chuyện hôm qua cậu vào nhịp trễ đi.", speakerPersona: "musician", replyPersona: "creator" }],
    "waiting-food": [{ text: "Mai mình tập bài mới ở góc phố cũ nha?", reply: "Được, tớ ghé nghe thử rồi quay một đoạn ngắn.", speakerPersona: "musician", replyPersona: "creator" }],
    eating: [{ text: "Lần sau cậu giữ nhịp chậm hơn chút, đoạn cuối hơi nhanh đó.", reply: "Tớ tưởng cậu đánh cajon nhanh lên mới đúng nhịp mà.", speakerPersona: "musician", replyPersona: "creator" }],
    "awaiting-payment": [{ text: "Bữa nay ngồi kể chuyện còn lâu hơn buổi diễn.", reply: "Vậy lần sau mình hẹn sớm hơn nha.", speakerPersona: "musician", replyPersona: "creator" }],
  },
};

const ORDER_CALL_LINES: Record<DiningPartyType, readonly string[]> = {
  family: [
    "Cho con một phần {dish} nha mẹ.", "Ba ơi, gọi giúp con {dish} nhé!",
    "Con muốn ăn {dish}, cả nhà gọi chung nha.", "Món {dish} nhìn ngon quá, mình gọi món này nhé.",
    "Cả nhà thử {dish} trước đi, con thấy hấp dẫn ghê.", "Con gọi {dish}; ai ăn ké thì gắp nha!",
    "Cho con gọi {dish} nha, đói quá rồi.", "Con nghĩ {dish} hợp với cả nhà mình đó.",
    "Mẹ gọi thêm {dish} cho mọi người nhé.", "Nhà mình lấy {dish} trước rồi xem tiếp nha.",
    "Con chọn {dish}, món này nhìn ngon ghê.", "Cho cả nhà một phần {dish} nha cô.",
    "Mình gọi {dish} để chia nhau ăn nhé.", "Ba con mình thử {dish} đi ba!",
    "Con xin {dish} trước, lát con ăn thêm rau.", "Gọi {dish} đi, món này ai cũng ăn được.",
  ],
  friends: [
    "Cho mình một phần {dish} nha.", "Ê, gọi {dish} đi, nhìn ngon đó.",
    "Cho tớ thử {dish} với, nghe ngon ghê.", "Chốt {dish} nha, lát ai muốn ăn thì gắp.",
    "Nhóm mình gọi {dish} trước rồi tính tiếp.", "Cho một phần {dish}, đừng ai giành đó.",
    "Nhìn {dish} là biết phải gọi món đó rồi.", "Thêm {dish} vào đi, hôm nay chơi lớn.",
    "Tớ lấy {dish} nha, mọi người ăn chung không?", "Gọi {dish} đi, món này hợp bàn mình.",
    "Để tớ gọi {dish}, ai không ăn thì báo sớm.", "Cho nhóm mình một phần {dish} nhé!",
    "Tớ đang phân vân {dish} với món kia, mọi người chọn đi.", "Món {dish} nghe được đó, gọi đi.",
    "Gọi {dish} trước nha, tớ đói rồi.", "Thêm {dish} nữa nhé, chia đều cho công bằng.",
  ],
};

const ORDER_REPLY_LINES: Record<DiningPartyType, readonly string[]> = {
  family: [
    "Ừ, mẹ gọi luôn. Con muốn thêm rau không?", "Ba cũng định gọi món đó, hợp ghê.",
    "Được, nhưng ăn từ từ kẻo nóng nhé.", "Chốt nha, mẹ gọi thêm phần cho cả nhà.",
    "Ba duyệt. Ai ăn cay thì nói trước nha.", "Thử đi con, ngon thì lần sau mình gọi nữa.",
    "Món đó nghe được đó, để mẹ xem thực đơn.", "Cả nhà chia nhau ăn là vừa đẹp.",
    "Gọi đi, hôm nay ba bao món này.", "Nhớ chừa cho mẹ một miếng nha.",
    "Ừ, mà lát ăn xong nhớ uống nước đó.", "Con chọn món nhanh ghê, ba còn chưa xem xong.",
    "Mẹ đồng ý, gọi thêm chén nước chấm nhé.", "Cả nhà thử chung cho vui nha.",
    "Được rồi, nhưng đừng gọi nhiều tới mức ăn không hết.", "Ba nghe theo chuyên gia ăn uống của nhà mình.",
  ],
  friends: [
    "Chốt, món đó nhìn hợp bàn mình.", "Gọi đi, nhưng nhớ cho tớ gắp một miếng.",
    "Ok luôn, thêm món đó là đủ bộ.", "Được, hôm nay tớ dễ tính lắm.",
    "Miễn người gọi chia tiền công bằng là được.", "Món đó ổn, gọi thêm nước luôn nha.",
    "Tớ đồng ý, nhưng đừng ăn hết phần của tớ.", "Gọi đi, đói quá nên tớ không phản đối gì hết.",
    "Chuẩn bài, món đó ăn chung mới vui.", "Ủa, nãy bảo ăn nhẹ mà giờ gọi thêm hả?",
    "Cho vào danh sách đi, nhóm mình xử lý được.", "Được nha, nhưng lát nhớ chụp hình món đó.",
    "Tớ duyệt. Ai trả tiền thì chọn món tiếp theo.", "Gọi thêm phần đi, tớ ăn phụ cho.",
    "Nghe ngon đó, lần này tớ tin cậu.", "Rồi, gọi đi kẻo lát lại đổi ý.",
  ],
};

const CONVERSATION_OPENINGS: Record<DiningPartyType, readonly string[]> = {
  family: [
    "Ngồi ăn đủ mặt thế này mới vui.", "Món này thơm y như hồi cả nhà đi chơi.",
    "Ba ơi, lần trước ba kể chuyện quán này hay lắm.", "Đèn lồng đẹp đó ba ha.",
    "Cuối tuần sau mình lại đi ăn chung nha.", "Ba kể lại chuyện hồi nhỏ đi.",
    "Con đói từ lúc còn ở nhà rồi đó.", "Hôm nay con phụ mẹ dọn bàn nha.",
    "Ngồi gần nhau nói chuyện dễ hơn ở nhà ha.", "Ừ, góc này sáng với dễ chịu thật.",
    "Nhà mình nên đi sớm để chọn bàn đẹp ha.", "Con thích góc quán này, nhìn sáng ghê.",
    "Con đói nãy giờ mà mải nói chuyện quá.", "Lần sau mình rủ thêm ông bà đi nha.",
    "Con muốn kể chuyện ở lớp cho cả nhà nghe.", "Ăn món nóng thế này đúng là đã ghê.",
    "Mẹ ơi, nước chấm này có cay không?", "Con kể chuyện ở lớp hôm nay nha.",
    "Ba ơi, con chưa no đâu, gắp thêm giúp con với.", "Hôm nay con thích món này nhất.",
    "Mai mình đi chợ cùng nhau nha.", "Con muốn ngồi thêm chút nữa.",
    "Mẹ thấy quán này dễ chịu không?", "Ba ơi, con mời ba miếng này.",
    "Lần sau con muốn rủ ông bà.", "Con no rồi, nhưng món này ngon quá.",
    "Hôm nay cả nhà chụp tấm hình nha.", "Con phụ dọn chén sau nhé.",
    "Ngồi gần nhau nói chuyện dễ hơn ở nhà ha.", "Ba kể chuyện cũ mà sao lần nào cũng khác vậy?",
    "Con nhường miếng ngon cuối cho mẹ đó.", "Mẹ ơi, tối nay vui ghê.",
    "Con còn nhớ lần mình đi sở thú không?", "Mai con có bài tập nhóm, mẹ xem giúp con nhé.",
    "Mẹ ơi, cuối tuần mình ghé thăm bà nha?", "Ba ơi, lúc nhỏ ba thích môn gì nhất?",
    "Mọi người đi đường có mệt không?", "Tuần sau cả nhà mình thử đi công viên mới nhé.",
    "Hôm nay con muốn tự chọn đường về nhà.", "Mình ăn xong về sớm để con nghỉ ngơi nha.",
  ],
  friends: [
    "Quán này đông vui hơn tớ tưởng đó.", "Ngồi ăn chung mới có chuyện để tám.",
    "Tuần này mọi người bận quá, giờ mới gặp.", "Mùi đồ nướng làm tớ đói lại rồi.",
    "Lát ăn xong đi dạo thêm không?", "Đèn lồng tối nay lên hình đẹp ghê.",
    "Tấm hình nãy chụp đẹp đó.", "Ngồi đây lâu chút nha, tớ còn chuyện kể.",
    "Hôm nay ra ngoài ăn đúng là quyết định sáng suốt.", "Nhìn món bàn bên hấp dẫn ghê.",
    "Lần trước tụi mình cũng gọi món này ha?", "Mai có ai rảnh đi chơi tiếp không?",
    "Để tớ rót nước cho, mọi người cứ nói chuyện đi.", "Tớ nghe tiếng nồi sôi là bụng réo rồi.",
    "Chuyến đi hôm nay vui hơn tớ tưởng.", "Tuần sau nhóm mình tụ tập nữa nha.",
    "Hôm nay ai là người gọi món đầu tiên thế?", "Mai đi cà phê nữa không?",
    "Cậu bảo ăn nhẹ mà gọi ba món.", "Tớ kể chuyện công ty cho nghe nha.",
    "Đứa nào chọn quán vậy?", "Món này cay quá trời.",
    "Tớ giữ chỗ cho cậu nãy giờ.", "Lâu rồi tụi mình chưa đi chơi xa.",
    "Tối nay ai trả tiền trước?", "Ngồi thêm chút đi, chưa muốn về.",
    "Tớ đang tính gọi thêm món nữa.", "Cậu có nghe nhạc quán không?",
    "Ai cũng tới đủ, hiếm ghê.", "Món này ngon hơn tớ nghĩ.",
    "Lần này tớ không gọi món tráng miệng đâu.", "Bàn mình thiếu mỗi người tới trễ thôi.",
    "Cậu còn giữ tấm vé xem phim lần trước không?", "Kế hoạch đi Đà Lạt tháng sau tính tới đâu rồi?",
    "Tớ đổi sang đi làm bằng xe buýt, đỡ phải tìm chỗ gửi.", "Ai có playlist nghe lúc chạy xe không?",
    "Tớ mới học được một bài guitar, hôm nào đàn cho nghe.", "Nhóm chat im ắng cả tuần, nay gặp mới nói nhiều ghê.",
    "Cậu dọn qua khu mới thấy tiện không?", "Cuối tháng mình đi xem phim nhé, tớ chọn suất.",
  ],
};

const CONVERSATION_REPLIES: Record<DiningPartyType, readonly string[]> = {
  family: [
    "Ừ, hôm nay cả nhà mình cứ thong thả nha.", "Mẹ cũng thấy vậy, ăn nóng mới ngon.",
    "Ba nhớ chuyện đó mà, để ba kể tiếp.", "Ừ, ánh đèn vàng nhìn đẹp thật.",
    "Được chứ, cuối tuần mình sắp xếp nhé.", "Được, để ba kể đoạn vui nhất nha.",
    "Ăn từ từ thôi nha, không ai giành đâu.", "Ừ, con thích món này thì lần sau mẹ gọi nữa.",
    "Ừ, có gì cả nhà cứ kể cho nhau nghe nha.", "Mẹ cũng thích ngồi góc này.",
    "Nhất trí, lần sau mình đi sớm hơn nha.", "Con chọn chỗ giỏi quá, ngồi đây thoải mái ghê.",
    "Ừ, con ăn thêm đi, món còn nóng nè.", "Ừ, lần sau mình gọi ông bà đi cùng.",
    "Kể đi, ba mẹ đang nghe nè.", "Ừ, ăn nóng thế này thấy ấm bụng ghê.",
    "Mẹ thử chút rồi, cay nhẹ thôi con.", "Kể đi, ba mẹ nghe nè.",
    "Con cứ ăn thêm, ba gắp rau cho.", "Vậy lần sau mẹ gọi thêm phần nha.",
    "Được, sáng mai cả nhà đi nhé.", "Ừ, mình không cần vội về đâu.",
    "Có chứ, đèn vàng nhìn dễ chịu ghê.", "Ba cảm ơn, con ăn món này đi.",
    "Ừ, mẹ sẽ gọi hỏi ông bà nha.", "Ăn thêm chút nữa, mẹ không mách ai đâu.",
    "Được rồi, để ba chụp cho mọi người.", "Ngoan quá, ăn xong mình cùng dọn.",
    "Ừ, đúng là tối nay chọn đúng quán rồi.", "Ba kể theo trí nhớ, mỗi lần thêm chút gia vị.",
    "Cảm ơn con, mẹ để dành cho cả nhà cùng thử.", "Mẹ cũng vui vì cả nhà ở bên nhau.",
    "Nhớ chứ, lần sau mình ghé lại nha.", "Được, tối nay mình làm bài một chút rồi nghỉ.",
    "Ừ, mẹ sẽ hỏi bà xem cuối tuần rảnh không.", "Ba thích đá banh, hồi đó còn hay đá với bạn.",
    "Có hơi mệt, ngồi đây một lúc là khỏe rồi.", "Được, cả nhà chọn ngày nào thuận tiện nhé.",
    "Ừ, con chọn đường con thích đi.", "Nhất trí, về nhà sớm cho con ngủ ngon.",
  ],
  friends: [
    "Gặp nhau rồi mới kể hết chuyện được.", "Ừ, vừa ăn vừa nói chuyện dễ hơn.",
    "Lần sau nhớ báo sớm để tớ giữ lịch.", "Tớ cũng đói lại rồi, gọi thêm món nhé?",
    "Đi chứ, ăn xong đi thêm một vòng.", "Ừ, ánh đèn nhìn đẹp thật.",
    "Gửi tớ tấm đó nha, đừng đăng hình dìm.", "Bữa này vui hơn ngồi ở nhà nhiều.",
    "Công nhận, ở nhà đâu có vui thế này.", "Thôi đừng nhìn bàn bên nữa, gọi phần mình đi.",
    "Đúng rồi, món đó ngon nên tụi mình gọi nữa đi.", "Tớ đồng ý, nhưng ai về trễ tự bắt xe nha.",
    "Có cậu chu đáo ghê, tớ đang khát đây.", "Thế mình gọi thêm món nóng đi.",
    "Tớ cũng thấy vậy, lần sau phải đi tiếp.", "Được, tớ sẽ chặn lịch để khỏi ai bùng.",
    "Tớ chứ, nãy giờ tớ đói rồi.", "Đi, miễn đừng bắt tớ dậy lúc sáu giờ.",
    "Ba món bàn mình chia, tớ có ăn hết đâu.", "Kể đi, hôm nay tớ ngồi đây tới khuya.",
    "Tớ chọn đó, nhớ khen đúng người nha.", "Uống nước đi, đừng sĩ diện nữa.",
    "Ừ, lát miếng ngon đầu tớ nhường cậu.", "Chốt lịch đi, đừng nói rồi để đó nha.",
    "Tớ trả trước, mai chuyển khoản đủ đó.", "Ok, nhưng ai gọi xe thì đặt trước nha.",
    "Gọi đi, tớ ăn phụ được, đừng hỏi nhiều.", "Có, mà tớ nghe bụng mình rõ hơn.",
    "Phải chụp hình lưu niệm trước khi ai chạy mất.", "Tớ nói rồi, lần này tin chuyên gia chọn món đi.",
    "Ừ, để lát nữa xem cậu có đổi ý không.", "Tớ nhắn rồi, chắc đang tìm chỗ gửi xe.",
    "Có, tớ vẫn để trong ngăn bàn đó.", "Tớ đang xem ngày, cuối tuần sau có vẻ ổn.",
    "Hay đó, giờ cao điểm gửi xe đúng là cực.", "Có, để lát tớ gửi vào nhóm nhé.",
    "Nhất định phải đàn nghe thử đó nha.", "Tại nhắn tin không vui bằng gặp trực tiếp mà.",
    "Tiện hơn trước nhiều, đi bộ ra trạm cũng gần.", "Chốt, nhớ gửi giờ chiếu cho mọi người nha.",
  ],
};

export interface DiningOrderDialogue {
  text: string;
  reply: string;
  replySpeakerIndex: number;
}

export function diningOrderDialogue(
  partyType: DiningPartyType,
  dishName: string,
  dialogueNumber: number,
  partySize: number,
  speakerIndex: number,
  family: DiningFamilyContext = DEFAULT_FAMILY_CONTEXT,
  characterIds: readonly string[] = [],
): DiningOrderDialogue {
  const safeNumber = Math.max(0, Math.trunc(dialogueNumber));
  if (isOlderCouple(partyType, partySize, characterIds)) {
    const speakerPersona = CHARACTER_PERSONAS[characterIds[speakerIndex] ?? ""];
    const calls = speakerPersona === "grandmother"
      ? ["Ông gọi {dish} trước nhé, thiếu thì mình gọi thêm.", "Mình thử {dish} đi ông, lâu rồi chưa ăn.", "Cho một phần {dish} nhé, mình ăn chung."]
      : ["Mình gọi một phần {dish} trước nhé.", "Bà muốn ăn {dish} không? Mình gọi thử nhé.", "Gọi {dish} đi, ăn xong mình tính tiếp."];
    const replies = speakerPersona === "grandmother"
      ? ["Ừ, gọi một phần trước đi.", "Được, món này ăn chung tiện đấy.", "Ừ, thiếu thì mình gọi thêm."]
      : ["Ừ, gọi đi ông.", "Được, mình gọi một phần trước nhé.", "Ừ, món này tôi cũng muốn ăn."];
    const replySpeakerIndex = (speakerIndex + 1) % partySize;
    return {
      text: calls[safeNumber % calls.length]!.replaceAll("{dish}", dishName),
      reply: replies[safeNumber % replies.length]!,
      replySpeakerIndex,
    };
  }
  const lines = ORDER_CALL_LINES[partyType];
  const replies = ORDER_REPLY_LINES[partyType];
  const replySpeakerIndex = (speakerIndex + 1) % Math.max(1, partySize);
  const speakerPersona = CHARACTER_PERSONAS[characterIds[speakerIndex] ?? ""];
  const replyPersona = CHARACTER_PERSONAS[characterIds[replySpeakerIndex] ?? ""];
  const familyGrandparent = (persona: DialoguePersona | undefined) => partyType === "family"
    && (persona === "grandmother" || persona === "grandfather");
  const familyPreschooler = (persona: DialoguePersona | undefined, memberIndex: number) => partyType === "family"
    && persona === "preschooler" && characterIds[memberIndex] === "saigon-preschooler";
  const rawPersonaCalls = speakerPersona && (partyType === "friends" || familyGrandparent(speakerPersona) || familyPreschooler(speakerPersona, speakerIndex))
    ? ORDER_PERSONA_LINES[speakerPersona]
    : undefined;
  const rawPersonaReplies = replyPersona && (partyType === "friends" || familyGrandparent(replyPersona) || familyPreschooler(replyPersona, replySpeakerIndex))
    ? ORDER_REPLY_PERSONA_LINES[replyPersona]
    : undefined;
  const personaCalls = rawPersonaCalls ? dialogueLinesForParty(rawPersonaCalls, partyType, family) : undefined;
  const personaReplies = rawPersonaReplies ? dialogueLinesForParty(rawPersonaReplies, partyType, family) : undefined;
  const availableCalls = partyType === "family" ? dialogueLinesForFamilySpeaker(lines, family, speakerIndex) : lines;
  const availableReplies = partyType === "family" ? dialogueLinesForFamilySpeaker(replies, family, replySpeakerIndex) : replies;
  const usePersonaCall = personaCalls && safeNumber % 3 !== 0;
  const usePersonaReply = personaReplies && safeNumber % 2 === 0;
  const lineIndex = (safeNumber * 5 + speakerIndex * 3) % (usePersonaCall ? personaCalls.length : availableCalls.length);
  const replyIndex = (safeNumber * 7 + speakerIndex * 5) % (usePersonaReply ? personaReplies.length : availableReplies.length);
  return {
    text: (usePersonaCall ? personaCalls[lineIndex]! : availableCalls[lineIndex]!).replaceAll("{dish}", dishName),
    reply: usePersonaReply ? personaReplies[replyIndex]! : availableReplies[replyIndex]!,
    replySpeakerIndex,
  };
}

export interface DiningConversationDialogue {
  text: string;
  reply: string;
  speakerIndex: number;
  replySpeakerIndex: number;
}

export function diningConversationDialogue(
  partyType: DiningPartyType,
  conversationNumber: number,
  partySize: number,
  family: DiningFamilyContext = DEFAULT_FAMILY_CONTEXT,
  phase: DiningConversationPhase = "eating",
  characterIds: readonly string[] = [],
): DiningConversationDialogue {
  const safeNumber = Math.max(0, Math.trunc(conversationNumber));
  if (isOlderCouple(partyType, partySize, characterIds)) {
    return olderCoupleExchange(characterIds, phase, safeNumber);
  }
  const basePairs: readonly ConversationPair[] = phase === "waiting-order" || phase === "waiting-food"
    ? (phase === "waiting-order" ? WAITING_ORDER_PAIRS[partyType] : WAITING_FOOD_PAIRS[partyType])
    : phase === "awaiting-payment"
      ? PAYMENT_PAIRS[partyType]
      : CONVERSATION_OPENINGS[partyType]
      .slice(0, Math.min(CONVERSATION_OPENINGS[partyType].length, CONVERSATION_REPLIES[partyType].length))
      .map((text, index) => ({ text, reply: CONVERSATION_REPLIES[partyType][index]! }));
  const personas = characterIds.map((id) => CHARACTER_PERSONAS[id]).filter((persona): persona is DialoguePersona => Boolean(persona));
  const personaPairs = [...new Set(personas)].flatMap((persona) => PERSONA_CONVERSATION_PAIRS[persona]?.[phase] ?? []);
  const pairs = [...basePairs, ...personaPairs].filter((pair) => {
    const rolesPresent = (!pair.speakerPersona || personas.includes(pair.speakerPersona))
      && (!pair.replyPersona || personas.includes(pair.replyPersona));
    return rolesPresent && (partyType !== "family" || (familyLineMatchesPeople(pair.text, family) && familyLineMatchesPeople(pair.reply, family)));
  });
  const pair: ConversationPair = pairs[safeNumber % Math.max(1, pairs.length)] ?? { text: SAFE_FAMILY_LINES[0], reply: SAFE_FAMILY_LINES[1] };
  const defaultSpeakerIndex = safeNumber % Math.max(1, partySize);
  const familyDefaultSpeaker = family.motherIndex ?? family.fatherIndex ?? family.grandmotherIndex
    ?? family.grandfatherIndex ?? family.childIndices[0] ?? defaultSpeakerIndex;
  const indexForPersona = (persona: DialoguePersona | undefined, exceptIndex = -1): number | null => {
    if (!persona) return null;
    if (persona === "mother" && partyType === "family") return family.motherIndex;
    if (persona === "father" && partyType === "family") return family.fatherIndex;
    if (persona === "grandmother" && partyType === "family") return family.grandmotherIndex;
    if (persona === "grandfather" && partyType === "family") return family.grandfatherIndex;
    const index = characterIds.findIndex((id, memberIndex) => memberIndex !== exceptIndex && CHARACTER_PERSONAS[id] === persona);
    return index >= 0 ? index : null;
  };
  const hintedSpeaker = partyType === "family" ? familySpeakerHint(pair.text, family) : null;
  const explicitSpeakerIndex = indexForPersona(pair.speakerPersona);
  const speakerIndex = (pair.speakerPersona ? explicitSpeakerIndex : hintedSpeaker)
    ?? hintedSpeaker
    ?? (partyType === "family" ? familyDefaultSpeaker : defaultSpeakerIndex);
  const hintedReplySpeaker = partyType === "family" ? familySpeakerHint(pair.reply, family) : null;
  const personaReplySpeaker = indexForPersona(pair.replyPersona, speakerIndex);
  const replySpeakerIndex = (pair.replyPersona ? personaReplySpeaker : hintedReplySpeaker)
    ?? hintedReplySpeaker
    ?? (speakerIndex + 1) % Math.max(1, partySize);
  return {
    text: pair.text,
    reply: pair.reply,
    speakerIndex,
    replySpeakerIndex: replySpeakerIndex === speakerIndex && partySize > 1
      ? (speakerIndex + 1) % partySize
      : replySpeakerIndex,
  };
}

export interface DiningArrivalDialogue {
  text: string;
  speakerIndex: number;
}

export function diningArrivalDialogue(
  partyType: DiningPartyType,
  arrivalNumber: number,
  partySize: number,
  family: DiningFamilyContext = DEFAULT_FAMILY_CONTEXT,
  characterIds: readonly string[] = [],
): DiningArrivalDialogue {
  const safeArrival = Math.max(1, Math.trunc(arrivalNumber));
  if (isOlderCouple(partyType, partySize, characterIds)) {
    const arrival = OLDER_COUPLE_ARRIVALS[(safeArrival - 1) % OLDER_COUPLE_ARRIVALS.length]!;
    return { text: arrival.text, speakerIndex: olderCoupleIndex(characterIds, arrival.speaker) };
  }
  const tone = ARRIVAL_TONES[(safeArrival - 1) % ARRIVAL_TONES.length];
  const lines = dialogueLinesForParty(ARRIVAL_LINES[partyType][tone], partyType, family);
  const toneVisit = Math.floor((safeArrival - 1) / ARRIVAL_TONES.length);
  const defaultSpeakerIndex = safeArrival % Math.max(1, partySize);
  const speakerPersona = CHARACTER_PERSONAS[characterIds[defaultSpeakerIndex] ?? ""];
  const canUseFamilyGrandparentVoice = speakerPersona === "grandmother" || speakerPersona === "grandfather";
  const canUsePreschoolerVoice = speakerPersona === "preschooler" && characterIds[defaultSpeakerIndex] === "saigon-preschooler";
  const rawPersonaArrivalLines = speakerPersona && (partyType === "friends" || (partyType === "family" && (canUseFamilyGrandparentVoice || canUsePreschoolerVoice)))
    ? ARRIVAL_PERSONA_LINES[speakerPersona]
    : undefined;
  const personaArrivalLines = rawPersonaArrivalLines ? dialogueLinesForParty(rawPersonaArrivalLines, partyType, family) : undefined;
  let text: string;
  if (personaArrivalLines && safeArrival % 3 === 0) {
    text = personaArrivalLines[Math.floor(safeArrival / 3) % personaArrivalLines.length] ?? SAFE_FAMILY_LINES[0];
  } else
  if (toneVisit < lines.length) {
    text = lines[toneVisit];
  } else {
    const variants = ARRIVAL_VARIANTS[tone];
    // Keep each arrival to one complete thought. Combining unrelated opening
    // and follow-up lines produced long, mismatched speech bubbles.
    const completeLines = variants.openings;
    const partyCompatibleVariants = partyType === "family"
      ? completeLines.filter((line) => !/\b(?:tớ|cậu)\b/i.test(line))
      : completeLines;
    const availableVariants = dialogueLinesForParty(partyCompatibleVariants, partyType, family);
    text = availableVariants[(toneVisit - lines.length) % availableVariants.length] ?? SAFE_FAMILY_LINES[0];
  }
  // A child says child-centric family lines when one is present; otherwise an
  // adult family member speaks. Friends continue taking turns.
  const defaultFamilySpeaker = family.motherIndex ?? family.fatherIndex ?? family.grandmotherIndex
    ?? family.grandfatherIndex ?? family.childIndices[0] ?? 0;
  const speakerIndex = partyType === "family"
    ? familySpeakerHint(text, family) ?? defaultFamilySpeaker
    : defaultSpeakerIndex;
  return { text, speakerIndex };
}

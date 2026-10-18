import type { DiningPartyType } from "./diningCharacters";

type DialogueTone = "normal" | "funny" | "grumpy" | "cheerful" | "cute";

const ARRIVAL_TONES: readonly DialogueTone[] = ["normal", "funny", "cheerful", "cute", "grumpy"];

// Keep family dialogue consistent with the people who are actually at the table.
// This deliberately matches kinship phrases, not the dish name "ba chỉ".
const FATHER_REFERENCE = /\bba\s+(?:ơi|bảo|nói|con|kể|cũng|duyệt|bao|còn|nghe|gắp|mời|chụp|nhớ|đang|định|chưa|cảm ơn|muốn|tính)\b|\bba mẹ\b/i;

function dialogueLinesForParty(lines: readonly string[], partyType: DiningPartyType, familyHasFather: boolean): readonly string[] {
  if (partyType !== "family" || familyHasFather) return lines;
  const familyFriendlyLines = lines.filter((line) => !FATHER_REFERENCE.test(line));
  return familyFriendlyLines.length > 0 ? familyFriendlyLines : lines;
}

function dialogueLineAt(lines: readonly string[], index: number, partyType: DiningPartyType, familyHasFather: boolean): string {
  const availableLines = dialogueLinesForParty(lines, partyType, familyHasFather);
  return availableLines[index % availableLines.length] ?? lines[0] ?? "";
}

const ARRIVAL_LINES: Record<DiningPartyType, Record<DialogueTone, readonly string[]>> = {
  family: {
    normal: [
      "Ngồi bàn này nhé, chỗ này nhìn mát mẻ đó.",
      "Cho con ngồi gần mẹ, con đói quá rồi.",
      "Trời mưa mà có quán ấm thế này thích ghê.",
      "Chọn bàn nhìn ra cửa cho thoáng nha.",
      "Cả nhà mình cứ ăn thong thả thôi.",
      "Mùi thơm quá, chắc gọi món nóng trước.",
      "Đi bộ nãy giờ, ngồi xuống thấy khỏe hẳn.",
      "Ngồi gần đèn một chút, bên này đẹp ghê.",
    ],
    funny: [
      "Con đói tới mức nhìn cái bàn cũng ngon rồi.",
      "Ba bảo ăn nhẹ thôi mà chọn bàn bốn người!",
      "Ai rửa chén hả? À, mình đang ở quán mà.",
      "Con gọi món trước, mọi người cứ tin con!",
      "Đừng nhìn nồi lẩu nữa, nó chưa biết mình đâu.",
      "Nghe chữ nướng là bụng con tự ngồi dậy rồi.",
      "Chụp hình lẹ nha, đồ ăn tới là con mất bình tĩnh.",
      "Ba nói chỉ ăn một món. Lần này con tin ba.",
    ],
    cheerful: [
      "Cuối tuần cả nhà ăn cùng nhau vui quá!",
      "Đèn vàng đẹp ghê, con thích quán này rồi!",
      "Ăn cùng mọi người thì món gì cũng ngon.",
      "Cả nhà đông đủ rồi, gọi món thôi nào!",
      "Ngồi kể chuyện tới tối cũng được đó nha.",
      "Ngửi mùi thơm là tự nhiên vui lên rồi.",
      "Kết thúc chuyến đi bằng bữa này là chuẩn!",
      "Hôm nay được ăn cùng nhà mình là vui nhất.",
    ],
    cute: [
      "Mẹ ơi, cho con ngồi cạnh mẹ nha.",
      "Con chừa chỗ này cho ba đó!",
      "Đèn lồng sáng như mấy chú đom đóm kìa.",
      "Con đói xíu thôi… xíu cỡ ba tô á.",
      "Ngồi sát nhau cho ấm nha cả nhà.",
      "Con ăn rau nếu được gọi món ngon nha!",
      "Ba ơi, nồi đang sủi bọt như biết cười kìa.",
      "Chụp con với cả nhà trước khi ăn nha!",
    ],
    grumpy: [
      "Vào rồi mà chưa ai chỉ bàn hả?",
      "Đông thế này chắc chờ món hơi lâu nhỉ?",
      "Quạt quay kiểu này chắc chỉ mát cho cái quạt.",
      "Bàn sạch chút nha, đừng để khách phải nhắc.",
      "Ngồi một lúc rồi mà chưa thấy thực đơn đâu.",
      "Mau lên chút nha, trẻ con đói rồi đó.",
      "Đèn hơi tối, xem thực đơn phải nheo mắt luôn.",
      "Đông thật, hy vọng không phải chờ dài cổ.",
    ],
  },
  friends: {
    normal: [
      "Ngồi bàn này nha, nhìn bếp thấy vui ghê.",
      "Để túi xuống rồi cả nhóm xem thực đơn nhé.",
      "Quán đông mà không khí vẫn dễ chịu ha.",
      "Đi đường hơi mệt, ăn món nóng trước đi.",
      "Chừa chỗ cho mọi người rồi gọi món nha.",
      "Ngồi trong này nói chuyện thoải mái hơn.",
      "Đi một vòng mới kiếm được quán vừa ý.",
      "Mọi người chọn món đi, tối nay không vội.",
    ],
    funny: [
      "Đi ăn thôi mà nhóm mình họp chiến lược lâu ghê.",
      "Ai bảo không đói? Người hỏi thực đơn là cậu.",
      "Chụp ảnh lẹ, bụng mình sắp đăng story riêng rồi.",
      "Nhìn nồi lẩu kìa, nó gọi nhóm mình trước rồi.",
      "Đứa nào gọi ăn nhẹ thì tự chịu trách nhiệm nha.",
      "Đi với nhóm này nhớ đặt thêm ghế trước luôn.",
      "Mình không tham ăn, mình đang kiểm tra chất lượng.",
      "Tới quán rồi mới nhớ chưa thống nhất món gì.",
    ],
    cheerful: [
      "Cuối cùng cũng đủ mặt, gọi món thôi mọi người!",
      "Mùi đồ nướng bay tới là biết chọn đúng quán rồi.",
      "Đêm nay cứ vui đi, chuyện mai tính sau!",
      "Lâu rồi nhóm mình mới ăn đông đủ thế này.",
      "Chỗ này lên hình đẹp, đồ ăn chắc cũng ngon.",
      "Đói muốn xỉu mà thấy mọi người là tỉnh liền.",
      "Đèn lồng nhìn chill ghê, ngồi lâu chút nha.",
      "Ngồi tám chuyện tới lúc quán đóng cửa luôn!",
    ],
    cute: [
      "Tớ giữ chỗ này cho cậu đó, mau ngồi đi.",
      "Đi đông mới vui, thiếu cậu là thiếu món ngon.",
      "Tớ chọn món chính, cậu chọn món tráng miệng nha.",
      "Ngồi sát vào, chừa chỗ cho người tới sau nữa.",
      "Đừng gọi cay nha, lần trước cậu khóc rồi đó.",
      "Thấy đèn lồng là nhớ chuyến đi hôm trước ghê.",
      "Chụp tấm hình nhóm rồi hẵng gọi món nha.",
      "Nhường cậu miếng ngon đầu tiên, nhớ ghi công tớ!",
    ],
    grumpy: [
      "Quán đông mà chẳng ai ra đón, tự do ghê ha.",
      "Thực đơn đâu rồi, phải đoán món bằng mùi à?",
      "Ngồi được chưa hay đứng đây làm khách trưng bày?",
      "Bàn hơi chật nha, nhóm mình cũng trả tiền mà.",
      "Hy vọng đồ ăn ra nhanh hơn lúc xếp chỗ.",
      "Nhạc nghe rõ hơn tiếng gọi nhân viên luôn đó.",
      "Đông quá, chắc lát nữa nhân viên quên nhóm mình.",
      "Đèn đẹp mà xem thực đơn phải dí sát mặt mới thấy.",
    ],
  },
};

// After the authored one-liners, combine two short natural sentences. Each
// tone has 16 × 16 combinations, so a given tone can run for hundreds of
// arrivals before any exact line comes around again.
const ARRIVAL_VARIANTS: Record<DialogueTone, { openings: readonly string[]; followups: readonly string[] }> = {
  normal: {
    openings: [
      "Ngồi xuống đây thấy dễ chịu ghê.", "Đi quanh phố một lúc mới thấy đói.",
      "Quán đông mà vẫn có cảm giác ấm cúng.", "Đèn vàng làm góc này nhìn đẹp thật.",
      "Vừa tới nơi là bụng réo rồi.", "Bàn này nhìn ra bếp vui mắt ghê.",
      "Cho mình xem thực đơn một chút nha.", "Ngồi nghỉ chân rồi chọn món nhé.",
      "Trời tối rồi, ăn món nóng hợp ghê.", "Được ngồi xuống là nhẹ cả người.",
      "Mùi đồ nướng thơm từ ngoài cửa luôn.", "Chỗ này yên tĩnh hơn mình tưởng.",
      "Cuối cùng cũng tới giờ ăn rồi.", "Ngồi gần nhau nói chuyện dễ hơn.",
      "Nghe tiếng nồi sôi là thấy đói thêm.", "Mình chọn vài món rồi chia nhau ăn nha.",
    ],
    followups: [
      "Gọi món nóng ăn cho ấm bụng nhé.", "Mình cứ thong thả, hôm nay không vội.",
      "Chọn món nào cũng muốn thử hết.", "Ngồi đây kể chuyện thêm một lúc cũng được.",
      "Gọi thêm nước trước cho cả bàn nha.", "Ăn xong rồi hẵng tính chuyện đi tiếp.",
      "Mọi người chọn món theo ý thích nhé.", "Hôm nay mình ăn đơn giản thôi cũng vui rồi.",
      "Mùi thơm làm bụng réo lên lần nữa rồi.", "Ngồi gần cửa một chút chắc thoáng hơn.",
      "Có món gì nóng là mình muốn thử trước.", "Cứ xem thực đơn kỹ rồi quyết định nha.",
      "Được ngồi ăn cùng nhau là thích rồi.", "Mình gọi vài món để ăn chung nhé.",
      "Chờ đủ mọi người rồi gọi cũng vừa.", "Chỗ này ngồi lâu chắc cũng thoải mái.",
    ],
  },
  funny: {
    openings: [
      "Bụng mình biểu tình từ đầu hẻm rồi.", "Đi ăn nhẹ mà cả nhóm tới đủ mặt.",
      "Vừa nghe tiếng nồi lẩu sôi là tỉnh ngủ.", "Cái bụng nhìn thấy bàn là réo liền.",
      "Chưa mở thực đơn mà đã thấy phân vân.", "Mình định gọi đúng một món thôi.",
      "Mùi thơm bay ra tận ngoài cửa luôn.", "Ngồi xuống chưa được ba giây đã đói thêm.",
      "Đứa nào vừa bảo mình không đói đó?", "Cả bàn đang nhìn nồi lẩu chăm chú quá.",
      "Đói tới mức suýt chào nhầm cái ghế.", "Tới quán rồi mới nhớ chưa chọn món.",
      "Mình đã chuẩn bị tinh thần ăn thật ngoan.", "Cái ví tối nay chắc phải tập thể dục.",
      "Mình ngồi gần bếp để cổ vũ đầu bếp.", "Ai đó ngăn mình gọi món thứ năm đi.",
    ],
    followups: [
      "Chắc bàn bên cũng nghe bụng mình rồi.", "Nhưng tay đã mở thực đơn trang cuối.",
      "Gọi món ngay là quyết định sáng suốt nhất.", "Mình suýt gọi luôn cả cái bàn.",
      "Nhìn món nào cũng thấy có duyên hết.", "Cứu mình bằng món nóng trước nha.",
      "Chưa ăn mà bụng đã cảm ơn quán rồi.", "Mình xin ăn thay phần người tới trễ.",
      "Thôi gọi dư chút, mai tính chuyện ăn kiêng.", "Mùi thơm nghe như đang cổ vũ mình.",
      "Ai chụp hình nhanh, mình không đợi lâu đâu.", "Chắc lát nữa mình phải gọi thêm thật.",
      "Mình chỉ nếm thử thôi, nếm nhiều lần.", "Cái bụng vừa bỏ phiếu gọi thêm món.",
      "Để mình nghiên cứu món ngon bằng miệng nha.", "Mọi người cứ gọi, mình sẵn sàng ăn phụ.",
    ],
  },
  grumpy: {
    openings: [
      "Đứng ngoài chờ hơi lâu đó nha.", "Bàn này còn dính chút nước nè.",
      "Thực đơn vẫn chưa thấy đâu nhỉ.", "Quán đông đến mức khó chọn chỗ thật.",
      "Góc này hơi tối để đọc chữ đó.", "Mùi đồ ăn thơm thật, nhưng mình đói rồi.",
      "Ngồi chờ từ nãy tới giờ luôn á.", "Cho xin thêm cái ghế với nha.",
      "Mình gọi nhân viên mấy lần rồi đó.", "Bàn hơi chật một chút nha.",
      "Đông khách quá nên phục vụ chậm nhỉ.", "Nếu món còn lâu thì báo trước nha.",
      "Quạt bên này quay hơi yếu đó.", "Mình muốn đổi sang bàn sạch hơn.",
      "Đứng một lúc rồi mà chưa ai hướng dẫn.", "Gọi món mà phải đoán thì khó ghê.",
    ],
    followups: [
      "Nhờ xếp chỗ nhanh giúp mình nhé.", "Mình đổi chỗ khác cho thoải mái hơn nha.",
      "Có thực đơn thì mang ra giúp với.", "Cho tụi mình biết phải chờ bao lâu.",
      "Mình bắt đầu đói thật rồi đó.", "Nói trước một tiếng cho đỡ sốt ruột nha.",
      "Tụi mình chỉ cần bàn sạch và gọn thôi.", "Thấy món ngon là mình nguôi ngay ấy mà.",
      "Đừng để tụi mình phải tự đoán nữa nha.", "Mình sắp gọi luôn cả cái bàn rồi đó.",
      "Phục vụ nhanh tay chút là được rồi.", "Cho mình biết gọi món ở đâu với.",
      "Mọi người chờ lâu là bắt đầu khó chịu đó.", "Đổi cái quạt hướng sang đây giúp nha.",
      "Mong là món ăn không làm mình chờ thêm.", "Tụi mình ngồi đây, đừng quên nha.",
    ],
  },
  cheerful: {
    openings: [
      "Tối nay được đi ăn cùng nhau vui ghê.", "Nghe tiếng cười trong quán là thấy thích.",
      "Vừa bước vào đã thấy không khí rộn ràng.", "Hôm nay mọi người đủ mặt rồi nha.",
      "Mùi đồ nướng vừa bay tới là thấy vui.", "Lâu rồi mới tụ tập đông đủ thế này.",
      "Đèn lồng sáng lên nhìn đẹp quá chừng.", "Cuối cùng cũng có dịp đi ăn chung rồi.",
      "Cả nhóm chọn đúng chỗ rồi đó.", "Ngồi xuống thôi, mình đói vui vẻ rồi.",
      "Bữa này mình ăn thật thoải mái nha.", "Được gặp mọi người là thấy vui rồi.",
      "Quán có vẻ nhộn nhịp dễ thương ghê.", "Tối nay chắc có nhiều chuyện để kể.",
      "Đi ăn chung thế này mới đúng bài.", "Mình mong bữa này từ chiều tới giờ.",
    ],
    followups: [
      "Gọi vài món rồi cùng nhau thưởng thức nha.", "Tối nay cứ vui hết mình đi mọi người!",
      "Ngồi lâu thêm chút cũng không sao đâu.", "Chọn món ngon rồi chụp tấm hình nhé.",
      "Bàn đông vui thế này nhìn thích thật.", "Mình gọi thêm món để chia nhau ăn nha.",
      "Có mọi người ở đây là đủ vui rồi.", "Ăn xong mình đi dạo thêm một vòng nhé.",
      "Hôm nay món nào cũng sẽ ngon thôi.", "Cho mình gọi món đầu tiên nha!",
      "Ai tới trễ lát kể chuyện bù đó nha.", "Mình nâng ly nước chúc buổi tối vui vẻ!",
      "Để dành chỗ cho món tráng miệng nữa nha.", "Ngồi đây tám chuyện tới khuya luôn!",
      "Cứ gọi món mọi người thích nhất đi.", "Bữa ăn này có vẻ mở đầu hoàn hảo rồi.",
    ],
  },
  cute: {
    openings: [
      "Mình chừa chỗ đẹp cho mọi người nè.", "Cho tớ ngồi gần cậu một chút nha.",
      "Ngồi gần nhau cho vui nha mọi người.", "Tớ muốn gọi món để chia nhau ăn.",
      "Chụp ảnh nhóm trước khi gọi món nha.", "Cậu chọn món trước đi, tớ nghe theo.",
      "Ăn xong mình đi dạo thêm chút nha.", "Có mọi người ở đây là tớ vui rồi.",
      "Mình ngồi gần cửa sổ cho thoáng nha.", "Miếng ngon đầu tiên tớ nhường cậu đó.",
      "Ngồi tám chuyện thêm một lúc nhé.", "Tớ đợi đủ mặt rồi mới muốn gọi món.",
      "Đèn lồng làm góc này xinh ghê luôn.", "Mình kéo ghế sát vào cho đủ chỗ nha.",
      "Tớ giữ chỗ này cho cậu từ nãy đó.", "Bữa nay được ngồi chung là thích nhất.",
    ],
    followups: [
      "Mọi người ngồi sát lại cho ấm áp nha.", "Gọi món cậu thích, tớ ăn ké một miếng.",
      "Mình nhớ chừa phần cho người tới sau đó.", "Tấm hình này phải có đủ cả nhóm nha.",
      "Tớ sẽ nhường cậu chọn món ngon nhất.", "Mình gọi vài món rồi gắp cho nhau nhé.",
      "Ngồi đây lâu một chút cũng được mà.", "Cậu đói thì nói, tớ gọi thêm liền nha.",
      "Tối nay vui rồi, món gì cũng thấy ngon.", "Tớ chọn món, cậu chọn nước uống nha.",
      "Để tớ kéo ghế giúp cho nè.", "Có món ngon mình chia đều nhé.",
      "Mình ngồi cạnh nhau kể chuyện nha.", "Nhớ chụp thêm tấm hình lúc đồ ăn tới.",
      "Tớ đi đâu cũng thích có mọi người đi cùng.", "Cậu cứ chọn trước, tớ không giành đâu.",
    ],
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
    "Tớ đang nghiêng về {dish}; biểu quyết nhanh nào.", "Món {dish} nghe ổn áp đó, gọi đi.",
    "Gọi {dish} trước nha, bụng tớ hết kiên nhẫn rồi.", "Thêm {dish} nữa nhé, chia đều cho công bằng.",
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
    "Nghe ngon đó, lần này tớ tin cậu.", "Rồi, chốt đơn trước khi bụng biểu tình nữa.",
  ],
};

const CONVERSATION_OPENINGS: Record<DiningPartyType, readonly string[]> = {
  family: [
    "Ngồi ăn đủ mặt thế này mới vui.", "Món này thơm y như hồi cả nhà đi chơi.",
    "Ba ơi, lần trước ba kể chuyện quán này hay lắm.", "Đèn lồng làm quán trông ấm cúng ghê.",
    "Cuối tuần sau mình lại đi ăn chung nha.", "Ba kể lại chuyện hồi nhỏ đi.",
    "Con đói từ lúc còn ở nhà rồi đó.", "Hôm nay con phụ mẹ dọn bàn nha.",
    "Ngồi gần nhau nói chuyện dễ hơn ở nhà ha.", "Ừ, góc này sáng với dễ chịu thật.",
    "Nhà mình nên đi sớm để chọn bàn đẹp ha.", "Con thích góc quán này, nhìn sáng ghê.",
    "Con đói nãy giờ mà mải nói chuyện quá.", "Lần sau mình rủ thêm ông bà đi nha.",
    "Con muốn kể chuyện ở lớp cho cả nhà nghe.", "Ăn món nóng thế này đúng là đã ghê.",
    "Mẹ ơi, nước chấm này có cay không?", "Con kể chuyện ở lớp hôm nay nha.",
    "Ba ơi, con chưa no đâu, gắp thêm giúp con với.", "Hôm nay con thích món này nhất.",
    "Mai mình đi chợ cùng nhau nha.", "Con muốn ngồi thêm chút nữa.",
    "Mẹ có thấy quán ấm cúng không?", "Ba ơi, con mời ba miếng này.",
    "Lần sau con muốn rủ ông bà.", "Con no rồi, nhưng món này ngon quá.",
    "Hôm nay cả nhà chụp tấm hình nha.", "Con phụ dọn chén sau nhé.",
    "Trời mưa mà ngồi ăn món nóng thích thật.", "Ba kể chuyện cũ mà sao lần nào cũng khác vậy?",
    "Con nhường miếng ngon cuối cho mẹ đó.", "Mẹ ơi, tối nay vui ghê.",
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
  ],
};

const CONVERSATION_REPLIES: Record<DiningPartyType, readonly string[]> = {
  family: [
    "Ừ, hôm nay cả nhà mình cứ thong thả nha.", "Mẹ cũng thấy vậy, ăn nóng mới ngon.",
    "Ba nhớ chuyện đó mà, để ba kể tiếp.", "Ừ, ánh đèn vàng nhìn ấm cúng thật.",
    "Được chứ, cuối tuần mình sắp xếp nhé.", "Được, để ba kể đoạn vui nhất nha.",
    "Ăn từ từ thôi nha, không ai giành đâu.", "Nhìn con vui là mẹ cũng vui rồi.",
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
  ],
  friends: [
    "Chuẩn, có hội mình là câu chuyện không hết.", "Chuẩn, ngồi ăn mới tám chuyện đã.",
    "Lần sau nhớ báo sớm để tớ giữ lịch.", "Tớ cũng đói lại rồi, gọi thêm món nhé?",
    "Đi chứ, ăn xong đi thêm một vòng.", "Ừ, ánh đèn nhìn chill thật.",
    "Gửi tớ tấm đó nha, đừng đăng hình dìm.", "Bữa này vui hơn ngồi ở nhà nhiều.",
    "Công nhận, ở nhà đâu có vui thế này.", "Thôi đừng nhìn bàn bên nữa, gọi phần mình đi.",
    "Đúng rồi, món đó ngon nên tụi mình gọi nữa đi.", "Tớ đồng ý, nhưng ai về trễ tự bắt xe nha.",
    "Có cậu chu đáo ghê, tớ đang khát đây.", "Thế mình gọi thêm món nóng đi.",
    "Tớ cũng thấy vậy, lần sau phải đi tiếp.", "Được, tớ sẽ chặn lịch để khỏi ai bùng.",
    "Tớ chứ, bụng tớ nãy giờ họp khẩn.", "Đi, miễn đừng bắt tớ dậy lúc sáu giờ.",
    "Ba món bàn mình chia, tớ có ăn hết đâu.", "Kể đi, hôm nay tớ ngồi đây tới khuya.",
    "Tớ chọn đó, nhớ khen đúng người nha.", "Uống nước đi, đừng sĩ diện nữa.",
    "Cảm động ghê, lát miếng ngon đầu tớ nhường cậu.", "Chốt lịch đi, đừng nói rồi để đó nha.",
    "Tớ trả trước, mai chuyển khoản đủ đó.", "Ok, nhưng ai gọi xe thì đặt trước nha.",
    "Gọi đi, tớ ăn phụ được, đừng hỏi nhiều.", "Có, mà tớ nghe bụng mình rõ hơn.",
    "Phải chụp hình lưu niệm trước khi ai chạy mất.", "Tớ nói rồi, lần này tin chuyên gia chọn món đi.",
    "Ừ, để lát nữa xem cậu có đổi ý không.", "Tớ nhắn rồi, chắc đang tìm chỗ gửi xe.",
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
  familyHasFather = true,
): DiningOrderDialogue {
  const safeNumber = Math.max(0, Math.trunc(dialogueNumber));
  const lines = ORDER_CALL_LINES[partyType];
  const replies = ORDER_REPLY_LINES[partyType];
  const lineIndex = (safeNumber * 5 + speakerIndex * 3) % lines.length;
  const replyIndex = (safeNumber * 7 + speakerIndex * 5) % replies.length;
  return {
    text: dialogueLineAt(lines, lineIndex, partyType, familyHasFather).replaceAll("{dish}", dishName),
    reply: dialogueLineAt(replies, replyIndex, partyType, familyHasFather),
    replySpeakerIndex: (speakerIndex + 1) % Math.max(1, partySize),
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
  familyHasFather = true,
): DiningConversationDialogue {
  const safeNumber = Math.max(0, Math.trunc(conversationNumber));
  const openers = CONVERSATION_OPENINGS[partyType];
  const replies = CONVERSATION_REPLIES[partyType];
  const pairs = openers
    .slice(0, Math.min(openers.length, replies.length))
    .map((text, index) => ({ text, reply: replies[index] }))
    .filter((pair) => partyType !== "family" || familyHasFather || (!FATHER_REFERENCE.test(pair.text) && !FATHER_REFERENCE.test(pair.reply)));
  const pair = pairs[safeNumber % Math.max(1, pairs.length)] ?? { text: openers[0], reply: replies[0] };
  const speakerIndex = safeNumber % Math.max(1, partySize);
  return {
    text: pair.text,
    reply: pair.reply,
    speakerIndex,
    replySpeakerIndex: (speakerIndex + 1) % Math.max(1, partySize),
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
  familyHasFather = true,
): DiningArrivalDialogue {
  const safeArrival = Math.max(1, Math.trunc(arrivalNumber));
  const tone = ARRIVAL_TONES[(safeArrival - 1) % ARRIVAL_TONES.length];
  const lines = dialogueLinesForParty(ARRIVAL_LINES[partyType][tone], partyType, familyHasFather);
  const toneVisit = Math.floor((safeArrival - 1) / ARRIVAL_TONES.length);
  let text: string;
  if (toneVisit < lines.length) {
    text = lines[toneVisit];
  } else {
    const variants = ARRIVAL_VARIANTS[tone];
    const combination = (toneVisit - lines.length) % (variants.openings.length * variants.followups.length);
    const opening = variants.openings[combination % variants.openings.length];
    const followup = variants.followups[Math.floor(combination / variants.openings.length)];
    text = `${opening} ${followup}`;
  }
  // Family lines are usually spoken by the parent or older relative; friends
  // take turns so the same character does not always lead the conversation.
  const speakerIndex = partyType === "family"
    ? Math.min(1, Math.max(0, partySize - 1))
    : safeArrival % Math.max(1, partySize);
  return { text, speakerIndex };
}

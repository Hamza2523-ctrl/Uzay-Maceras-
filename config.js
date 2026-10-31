const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// TRANSPARAN PNG KARAKTER RESİMLERİ
const playerImg = new Image();
playerImg.src = "astronot_11.png";

const alienImg = new Image();
alienImg.src = "Uzaylı.png";

const dogImg = new Image();
dogImg.src = "köpek_3.png";

// OYUN DURUMLARI
let gameState = 'start';
let currentLevel = 1;         
let isTrainingMode = false; 
let isBotVsMode = false; 
let botDifficulty = 'kolay'; // kolay, orta, zor
let selectedBotCharacter = 'hamza'; // hamza, alien, dog
let botVsState = 'select_char'; // select_char, select_diff, playing

let unlockedLevel = 1;
let levelPage = 1; 

let isShopOpen = false;       
let isWarriorsOpen = false;   
let isHelpOpen = false;       
let isProfileOpen = false;    
let isNewsOpen = false;       
let isQuestsOpen = false;     
let isLootBoxOpen = false;    
let isUniverseMapOpen = false; 
let isTitlesOpen = false; 
let isSpaceStationOpen = false; 
let selectedCelestialBody = null; 

// --- TELSİZ SİSTEMİ DEĞİŞKENLERİ ---
let radioMessages = [
    "📡 TELSİZ CIZIRTISI: 'Kaptan Hamza, 4. Sektörde garip uzaylı hareketliliği var, dikkat et!'",
    "📡 TELSİZ CIZIRTISI: 'Tüm üslere duyuru! Güneş sistemindeki devasa asteroid geçişi başladı.'",
    "📡 TELSİZ CIZIRTISI: 'Destek ekibi: Lazer kalkanı enerjiniz tam görünürde, savaşa hazırsınız.'",
    "📡 TELSİZ CIZIRTISI: 'Kaptan! Uranüs pazarından yeni dron teknolojisi sevkiyatı yola çıktı.'",
    "📡 TELSİZ CIZIRTISI: 'Dikkat! Kızıl Gezegen Mars yakınlarında korsan gemileri tespit edildi!'",
    "📡 TELSİZ CIZIRTISI: 'Merkezden Kaptan Hamza'ya: Görev başarım oranınız komutanlığı gururlandırıyor!'"
];
let currentRadioText = "";
let radioTextTimer = 0;

// GÖK CİSİMLERİ BİLGİ BANKASI
const celestialData = {
    gunes: {
        name: "⭐ GÜNEŞ (Yıldız)",
        color: "#ffd700",
        info: "Güneş sistemimizin merkezindeki devasa yıldızdır!\n\n• Kendi ışığı ve ısısı vardır, dünyamızı ısıtır ve aydınlatır.\n• O kadar büyüktür ki içine yaklaşık 1.3 milyon Dünya sığabilir.\n• Gaz halindedir ve çoğunlukla hidrojen ve helyumdan oluşur.\n\n💡 OYUN İPUCU:\nGüneş çok sıcak olduğu için hiç bir düşman (uzay gemisi) yoktur ancak bir kaç garip şeylere rastlanıldığı söyleniyor bakmaktan zarar gelmez (:"
    },
    merkur: {
        name: "🪐 MERKÜR (Gezegen)",
        color: "#a8a29e",
        info: "Güneş'e en yakın olan ilk gezegendir.\n\n• Güneş sisteminin en küçük gezegenidir.\n• Atmosferi çok zayıf olduğu için Güneş'e bakan tarafı kavurucu sıcak, arkası ise buz gibi soğuk olur.\n• Uydusu ve halkası yoktur.\n\n💡 OYUN İPUCU:\nMerkür'ün bir yüzünün çok sıcak olması uzaylılardan kaynaklı, ateş toplarına dikkat et (:"
    },
    venus: {
        name: "🪐 VENÜS (Gezegen)",
        color: "#fb923c",
        info: "Güneş sisteminin en sıcak gezegenidir.\n\n• Kalın bulut tabakası sayesinde ısıyı hapsettiği için Merkür'den bile daha sıcaktır (Sera etkisi).\n• Gökyüzünde yıldız gibi parladığı için halk arasında 'Çoban Yıldızı' olarak bilinir.\n• Diğer gezegenlerin aksine ters yönde döner.\n\n💡 OYUN İPUCU:\nBelli ki Venüs'ün bir uzay gemisi kalkanı var, acaba yanmıyor mu bunlar?"
    },
    dunya: {
        name: "🌍 DÜNYA (Evimiz)",
        color: "#38bdf8",
        info: "Üzerinde yaşam olduğu bilinen tek gezegendir.\n\n• Yüzeyinin yaklaşık %70'i sularla kaplı olduğu için uzaydan mavi görünür.\n• Tek doğal uydusu Ay'dır.\n• Atmosferinde canlıların nefes almasını sağlayan bolca oksijen bulunur.\n\n💡 OYUN İPUCU:\nEvimizi korumak bizim birincil görevimiz! Düşmanların buraya ulaşmasına izin verme."
    },
    ay: {
        name: "🌕 AY (Dünya'nın Uydusu)",
        color: "#f1f5f9",
        info: "Dünyamızın tek doğal uydusudur.\n\n• Dünya çevresindeki turunu yaklaşık 27 günde tamamlar.\n• Kendi ışığı yoktur, Güneş'ten aldığı ışığı yansıtır.\n• Yüzeyinde krater adı verilen dev çukurlar bulunur.\n\n💡 OYUN İPUCU:\nKesin Ay'ın karanlık yüzünde bir iş çevriliyordur, buraya dikkat et!"
    },
    mars: {
        name: "🔴 MARS (Kızıl Gezegen)",
        color: "#f87171",
        info: "Toprağında çok fazla pas (demir oksit) bulunduğu için kıpkırmızı görünür.\n\n• Bu yüzden kendisine 'Kızıl Gezegen' denir.\n• Güneş sistemindeki en büyük dağ (Olympus Mons) buradadır.\n• İleride insanların kolonileşmeyi düşündüğü ilk gezegendir.\n\n💡 OYUN İPUCU:\nEn çok uzaylı burada vardır, dikkat et seni yemesinler (:"
    },
    jupiter: {
        name: "⚡ JÜPİTER (Gaz Devi)",
        color: "#fbbf24",
        info: "Güneş sisteminin en büyük gezegenidir!\n\n• Bir gaz devidir, yani taştan ziyade gaz ve sıvılardan oluşur.\n• Üzerinde yüz yıllardır devam eden devasa kırmızı bir fırtına lekesi vardır.\n• Onlarca uydusu (en bilinenleri Io, Europa) bulunur.\n\n💡 OYUN İPUCU:\nBu sert rüzgarlara dikkat et! Düşmanlar çok güçlü oldukları için etkilenmiyor ama sen..."
    },
    saturn: {
        name: "💫 SATÜRN (Halkalı Gezegen)",
        color: "#fde047",
        info: "Etrafındaki muhteşem halkalarıyla tanınan gaz devidir.\n\n• Bu halkalar milyarlarca buz ve taş parçasından oluşur.\n• O kadar hafiftir ki, eğer içine sığacak kadar büyük su dolu bir leğen bulabilseydiniz suyun üstünde yüzerdi!\n\n💡 OYUN İPUCU:\nBu halkalar ne kadar güzelmiş, yoksa içi uzaylı mı dolu!!!"
    },
    uranus: {
        name: "❄️ URANÜS (Buz Devi)",
        color: "#22d3ee",
        info: "Güneş sisteminin en soğuk gezegenlerinden biridir.\n\n• Bir buz devidir ve rengi masmavidir.\n• Diğer gezegenler topaç gibi dönerken Uranüs sanki yan yatmış bir varil gibi yuvarlanarak döner.\n\n💡 OYUN İPUCU:\nKesin bir pazar ülkesidir! Dron gibi garip ve değişik teknolojik şeyleri hep buradan alırız, gene de bir göz at (:"
    },
    neptun: {
        name: "🌀 NEPTÜN (Uzak Mavi Gezegen)",
        color: "#60a5fa",
        info: "Güneş'e en uzak olan resmi gezegendir.\n\n• Rengi koyu mavidir ve Güneş sistemindeki en şiddetli, en hızlı rüzgarlar burada eser.\n• Güneş etrafındaki bir turunu tam 165 yılda tamamlar!\n\n💡 OYUN İPUCU:\nAyy burası çok soğuk, kesin bir şey saklıdır!"
    }
};

let selectedWarrior = 'hamza'; 
let hasAlienWarrior = false;
let hasDogWarrior = false;

let shopCategory = 'savasci'; 

let totalCoins = 0; 
let totalCompletedLevels = 0; 
let completedUniqueLevels = [];

let stats = {
    totalEnemiesKilled: 0,
    totalBulletsFired: 0
};

let titles = [
    { id: 'beginner', name: '🏅 Acemi Savaşçı', desc: 'Uzay serüvenine adım atan her savaşçıya verilir.', unlocked: true },
    { id: 'boss_slayer', name: '☠️ İlk Patronu Yenen', desc: "5. Seviyedeki Dev Yeşil Boss'u ilk kez mağlup edenlere verilir.", unlocked: false },
    { id: 'ay_dede', name: '🌕 Ay Dede', desc: 'Evrende gidilen yerlerden Ay istasyonuna (10. Bölüm) ulaşanlara verilir.', unlocked: false }
];

let hasDoubleShot = false;      
let isDoubleShotEquipped = false; 

let hasPoisonBullet = false;      
let isPoisonBulletEquipped = false; 
let poisonAmmoCount = 3; 

let isPoisonActive = false;
let poisonTimer = 0;
let poisonTickTimer = 0;

let totalWins = 0;           
let lootBoxKeys = 0;         
let totalBoxesOpened = 0;    
let lastWonCoinsFromBox = 0; 
let isBoxOpenedAnimation = false; 

let hasBordoEffect = false;
let isBordoEffectEquipped = false;

let hasOrangeEffect = false;
let isOrangeEffectEquipped = false;

let quest1Progress = 0; 
let quest1Completed = false;
let quest1Claimed = false;

let quest2Progress = 0; 
let quest2Completed = false;
let quest2Claimed = false;

const playerWidth = 95;
const playerHeight = 115;
let player = {
    x: canvas.width / 2 - playerWidth / 2,
    y: canvas.height - playerHeight - 25,
    width: playerWidth,
    height: playerHeight,
    speed: 9,
    hp: 100,
    maxHp: 100
};

let bullets = [];
const bulletSpeed = 15;

let enemies = [];
let isBossSpawned = false; 
let isSinsiBossStage = false; 
let sinsiTeleportTimer = 0;

let enemyBullets = [];
let apples = [];
let appleNotificationTimer = 0;
let lastAppleTime = 0;

let mouseX = 0;
let mouseY = 0;
const keys = {};
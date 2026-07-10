/**
 * Exact category → photograph mapping (presentation only).
 * One category title = one dedicated Unsplash ecommerce photo. No fuzzy matching.
 */

const U = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=900&q=85`;

export const CATEGORY_PHOTO_MAP = {
  // ── Level 1 main categories (homepage) ──
  electronics: U("1498049794561-7780e7231661"),
  phones: U("1511707171634-5f897ff02aa9"),
  computers: U("1496181133206-80ce9b88a853"),
  fashion: U("1445205170230-053b83016050"),
  beauty: U("1571781948776-f32d5d0f0b8c"),
  "home & furniture": U("1586023492125-27b2c045efd7"),
  groceries: U("1542838132-92c53300491e"),
  automotive: U("1492144534655-ae79c964c9d7"),
  "sports & outdoors": U("1461896836934-ffe607ba8211"),
  books: U("1512820790803-83ca734da794"),
  baby: U("1515488042361-ee00e0ddd4e6"),
  pets: U("1583511655852-d47d24bb62d7"),
  health: U("1576091160399-112ba8d25d1f"),
  "office & school": U("1497366216548-37526070297c"),
  gaming: U("1542751371-adc38448a05e"),
  cameras: U("1510128043943-334398bf94f4"),

  // ── Legacy homepage aliases ──
  shoes: U("1549298916-b41d501d3772"),
  "home & living": U("1586023492125-27b2c045efd7"),
  furniture: U("1555041469-a586c61ea9bc"),
  sports: U("1461896836934-ffe607ba8211"),

  // ── Parent categories ──
  "computers & electronics": U("1587831990711-dc839807ae5f"),
  "cosmetics & personal care": U("1571781948776-f32d5d0f0b8c"),
  "home & furniture": U("1586023492125-27b2c045efd7"),
  "clothing & apparel": U("1489987707024-afc025f40404"),
  "shoes & footwear": U("1549298916-b41d501d3772"),
  "jewelry & watches": U("1523275335684-37898b6baf30"),
  "toys & games": U("1558068710-d48a584f2f0c"),
  "sports & outdoors": U("1461896836934-ffe607ba8211"),
  "books & magazines": U("1512820790803-83ca734da794"),
  "food & beverages": U("1542838132-92c53300491e"),
  "phones & accessories": U("1511707171634-5f897ff02aa9"),
  "cameras & photography": U("1510128043943-334398bf94f4"),
  "health & wellness": U("1576091160399-112ba8d25d1f"),
  "pet supplies": U("1583511655852-d47d24bb62d7"),
  "baby & kids": U("1515488042361-ee00e0ddd4e6"),
  "office & school supplies": U("1497366216548-37526070297c"),
  "music & instruments": U("1510915361894-b38c02c44d0b"),

  // ── Computers & Electronics ──
  laptops: U("1496181133206-80ce9b88a853"),
  desktops: U("1587831990711-dc839807ae5f"),
  monitors: U("1527443224574-f9f8b948f972"),
  tablets: U("1561154464-82e9abf7ffa1"),
  "printers & scanners": U("1586953208448-b68a7c2a397e"),
  networking: U("1558494949-ef010cbdcc31"),
  software: U("1461749280684-dccba630e2f6"),
  "computer accessories": U("1527864550417-7fd91fc51a46"),
  gaming: U("1542751371-adc38448a05e"),
  "external storage": U("1597872208373-b71a2b59c066"),
  "smart home devices": U("1558002038-1057dae4c2ca"),
  "vr & ar": U("1622979139777-2bde379584ff"),

  // ── Cosmetics & Personal Care ──
  skincare: U("1556228578-0d85b81a591d"),
  makeup: U("1512496015851-a90fb38ba796"),
  "hair care": U("1522338249552-c7cf0a026fb4"),
  fragrances: U("1541643600914-78b083683bed"),
  "beauty tools": U("1608249041790-2f1d53276563"),
  "bath & body": U("1600330695738-fb155403392b"),
  "nail care": U("1604654894610-63f603ebb517"),
  "sun care & tanning": U("1556228720-195a672e8a03"),
  "men's grooming": U("1621605816539-5b0efb9d2ebb"),

  // ── Home & Furniture ──
  "living room": U("1616486338815-68f4a112d548"),
  bedroom: U("1505693416388-b5d5b3fc4fa4"),
  "office furniture": U("1497366817033-6f379f21ae28"),
  "dining & kitchen": U("1556911220-bff31c812dba"),
  "storage & organization": U("1595428774221-ef282d3e6385"),
  "mattresses & bedding": U("1631049307264-da0ec6d70304"),
  "outdoor furniture": U("1600210492486-724fe5c67fb0"),
  lighting: U("1513506003907-5143feeeec21"),
  decor: U("1513694203237-719280a53608"),
  "flooring & rugs": U("1600166898291-77d6043c9276"),
  "window treatments": U("1507089947368-13625e723770"),

  // ── Clothing & Apparel ──
  "t-shirts": U("1521572163474-6864f9cf17ab"),
  jeans: U("1542272604-787c3835535d"),
  dresses: U("1595777453417-04f17f947b88"),
  "jackets & outerwear": U("1551028719-42217b75128d"),
  "suits & blazers": U("1594938298603-c8148c4dae35"),
  activewear: U("1571907481918-60f356b1b371"),
  "lingerie & sleepwear": U("1515886657611-9f3515b0c78f"),
  "hoodies & sweatshirts": U("1556821840-4a630f83abf7"),
  "pants & trousers": U("1473966968640-fa801b869a78"),
  shorts: U("1591195853828-11db89584926"),
  skirts: U("1583495668166-61d9497abf93"),
  swimwear: U("1559558548-0eff84a38aaa"),
  "kids' clothing": U("1519233292-a2e53b82020b"),
  "formal wear": U("1507679799987-c73779587cdf"),
  undergarments: U("1523381210434-271454fc7aba"),

  // ── Shoes & Footwear ──
  sneakers: U("1606107921902-7f4e0297a87b"),
  boots: U("1605812860429-40144b251290"),
  "formal shoes": U("1533868242-c67b0b80a017"),
  "sandals & flip flops": U("1603487747831-0a139eba343b"),
  "running shoes": U("1460353581641-37baddabfffa"),
  loafers: U("1560769670-fce457a0eb47"),
  "casual shoes": U("1614253256823-f427de539279"),
  "sports shoes": U("1608231383312-4477be3ee027"),
  "hiking & outdoor shoes": U("1556906788-624a3aa3eadf"),
  "work & safety shoes": U("1631549945928-b4af15b321da"),
  "slippers & home shoes": U("1620799140408-f992f63603ae"),
  "high heels": U("1543163521-1bf539c55dd2"),
  "kids' footwear": U("1515347614322-8944b477244d"),

  // ── Jewelry & Watches ──
  "men's watches": U("1523275335684-37898b6baf30"),
  "women's watches": U("1611591431211-6f0b85ceda8a"),
  "necklaces & chains": U("1611652022419-9e27b7b9f889"),
  rings: U("1605100804763-247f67b3557e"),
  "bracelets & bangles": U("1602170355287-aa358b937127"),
  earrings: U("1535632066927-ab7c754de377"),
  "brooches & pins": U("1617034561041-fa2874ffa145"),
  "cufflinks & tie clips": U("1617131626428-33e0d8c8d5f6"),
  "watches accessories": U("1524592094714-0f0654e20314"),
  "engagement & wedding rings": U("1515562141207-5a88f70733e0"),

  // ── Toys & Games ──
  "action figures": U("1558068710-d48a584f2f0c"),
  puzzles: U("1587731549480-87d185cbcd84"),
  "board games": U("1611192422204-8e393f51a059"),
  "educational toys": U("1587658112047-5d9d213e8a1b"),
  "outdoor toys": U("1550583724-b2693b0263b3"),
  "building sets": U("1566576912321-d58ddd7a6088"),
  "dolls & stuffed animals": U("1566576912321-d58ddd7a6088"),
  "video games": U("1606144042614-b1397c99a2e6"),
  "remote control toys": U("1558618666-fcd25c85cd64"),
  "art & craft kits": U("1452860600635-30dad6db0614"),

  // ── Sports & Outdoors ──
  cycling: U("1485968579580-b6d5508699e4"),
  "camping & hiking": U("1504280390367-361c6d9bab38"),
  fishing: U("1544552866-5bb948ef9898"),
  swimming: U("1530549380080-4c5d646b0e4f"),
  "running & jogging": U("1476480862122-cdf4eb90f0f3"),
  "yoga & pilates": U("1544367567-0f2fcb009e0b"),
  climbing: U("1522163182404-1f007e1b42d0"),
  "team sports": U("1574629810360-ef4d8fb0a110"),
  golf: U("1535131744536-731f79dd4fc0"),
  "winter sports": U("1551524559-6a0f8c0e8a1c"),

  // ── Books & Magazines ──
  fiction: U("1544947950-fcc07aebda0c"),
  "non-fiction": U("1524993573797-eb644ab7c77e"),
  "children's books": U("1503676260728-1c00da094a0b"),
  textbooks: U("1456515587731-0ad8cb0a5451"),
  magazines: U("1505664194775-d6d952c2589e"),

  // ── Food & Beverages ──
  snacks: U("1621939514649-280e2ee02536"),
  beverages: U("1544145945-f90425340c7e"),
  "health foods": U("1490645935987-3eb11089d08a"),
  "organic foods": U("1610836815097-06b0309a9a3b"),
  "dairy products": U("1628088062856-aa063781b104"),
  "bakery & confectionery": U("1509440153526-dde935080c22"),
  "frozen foods": U("1574489416605-0480c033dd29"),
  "meat & seafood": U("1607626908045-4a1c3dca6061"),
  "canned & packaged foods": U("1584262040766-48f8bc1a5116"),
  "spices & condiments": U("1596040038539-2a67650be9aa"),
  "grains & cereals": U("1586209006289-5bdb3a0ff9d1"),
  "nuts & dry fruits": U("1606312619070-d48af83edc84"),
  "instant & ready-to-eat": U("1565299624946-b28f40a0ae38"),
  "coffee & tea": U("1495474473867-e4f477e3a9d2"),
  "energy drinks": U("1622544017458-45bf9e37f355"),

  // ── Automotive ──
  "car accessories": U("1605559424843-9e4f29272bb9"),
  "tires & wheels": U("1552519007-430f6d383c7f"),
  "car maintenance": U("1486262715619-67b85e812520"),
  motorcycle: U("1558981403-c5f9899a6c3f"),
  "car care products": U("1601360461409-7abf25769cdb"),
  cars: U("1494976388531-d1058498beb8"),
  "car electronics": U("1617814076367-a57fe8c78719"),
  "lights & lighting accessories": U("1619643478517-bf4c3d2e7f4d"),
  "car audio & speakers": U("1484704849700-f032a568e944"),
  "motor oils & fluids": U("1625047509168-f35b7387b4cb"),
  "brakes & brake parts": U("1487757230740-866818bb9d7f"),
  "engines & components": U("1621135802926-d273900c9412"),
  "exterior accessories": U("1493238792780-21dd0ec0a48d"),
  "interior accessories": U("1449965408869-eaa3f7e138d2"),
  "truck accessories": U("1519641471654-76ce57b35a68"),
  "performance parts": U("1558618666-fcd25c85cd64"),
  "electric vehicles": U("1593945115998-1ce5856d7be1"),

  // ── Phones & Accessories ──
  smartphones: U("1511707171634-5f897ff02aa9"),
  "phone cases": U("1601784551446-20c9a07ebd14"),
  headphones: U("1505740420928-5e560c06d30e"),
  "chargers & cables": U("1625842268580-8b850b9b90c4"),
  "screen protectors": U("1601972598000-55130642bd29"),
  "mobile accessories": U("1616348436351-0a9d03946d9e8"),
  "wireless earbuds": U("1590658161039-a9dca36bb969"),
  smartwatches: U("1579586336328-22f8ae0c3b48"),
  "power banks": U("1609091839311-d5365f9cfaa9"),
  "bluetooth speakers": U("1608043157359-342ea7f6305a"),
  "vr headsets": U("1592478411213-615e704ffd2f"),
  "selfie sticks & tripods": U("1526170375885-d7a58dae9ac2"),
  "car phone holders": U("1280270278-36d4ec4e0f28"),
  "mobile gaming accessories": U("1593303897191-dfb30d300f6b"),
  "sim cards & adapters": U("1556656793-08538906a9f8"),

  // ── Cameras & Photography ──
  "digital cameras": U("1502920917128-1aa500764cbd"),
  "dslr cameras": U("1510128043943-334398bf94f4"),
  "mirrorless cameras": U("1516035069371-29a1b244cc32"),
  "camera lenses": U("1606983340126-99e4eada24d7"),
  "camera accessories": U("1452587925148-ce544e33e7c4"),
  "video cameras": U("1478739670147-9e9f1a4b7c1f"),
  "lighting equipment": U("1513506003907-5143feeeec21"),
  "camera bags": U("1564461367450-7bca563ca3f2"),
  "gimbals & stabilizers": U("1493225457124-a3eb161ffa5f"),

  // ── Health & Wellness ──
  "vitamins & supplements": U("1584308666744-24d5c474f2ae"),
  "medical equipment": U("1576091160399-112ba8d25d1f"),
  "fitness & weight loss": U("1571019613454-1cb2f99b2d8b"),
  "first aid": U("1603398939848-5c309f81a79d"),
  "personal care": U("1616394584735-f25b57c8c0e0"),
  "sleep & relaxation": U("1541781774451-bfc2cf63d6b4"),
  "alternative medicine": U("1608578702906-999e859a09bc"),
  "mobility aids": U("1516577757311-0713f13fa89f"),
  "skin care": U("1616394584735-f25b57c8c0e0"),
  "dental care": U("1606811971618-4486d14f3f99"),

  // ── Pet Supplies ──
  "pet food": U("1583511655852-d47d24bb62d7"),
  "pet toys": U("1601758228041-f3b2795255f1"),
  "pet grooming": U("1587300003388-59208cc962cb"),
  "pet health": U("1576201836456-35f322daa606"),
  "pet accessories": U("1516734212184-7a7f81f7d44d"),

  // ── Baby & Kids ──
  "baby clothing": U("1515488042361-ee00e0ddd4e6"),
  "baby gear": U("1601926336317-7c3afd7db537"),
  "diapers & wipes": U("1584464491033-06628f3a6b7b"),
  "toys & learning": U("1587658112047-5d9d213e8a1b"),
  "nursing & feeding": U("1584515974246-0f4e8b7e5ed1"),
  "strollers & car seats": U("1519689682108-07e1ba80d1a6"),
  "bedding & furniture": U("1567016122405-54aa62b2839e"),
  "health & safety": U("1476709678186-8d698a3a3c22"),
  maternity: U("1555252337-4f4e7ef5e9fe"),
  "feeding bottles & accessories": U("1584991102531-1d6585b6542a"),

  // ── Office & School Supplies ──
  stationery: U("1455396527742-8c8b75b342c8"),
  "office equipment": U("1497366216548-37526070297c"),
  "writing supplies": U("1586281380117-5abcb695c328"),
  "school supplies": U("1588072432836-e55fff2597df"),
  organizers: U("1586281380117-5abcb695c328"),

  // ── Music & Instruments ──
  guitars: U("1510915361894-b38c02c44d0b"),
  keyboards: U("1520523839897-bd0b4dd1f08d"),
  "drums & percussion": U("1519892302705-ca6b38c7f906"),
  "microphones & audio": U("1598484749129-67ec41e4a938"),
  "music accessories": U("1511379938541-6edc5ad48f7f"),
};

const DEFAULT_PHOTO = U("1489987707024-afc025f40404");

export const CATEGORY_FALLBACK_PHOTO = DEFAULT_PHOTO;

export const normalizeCategoryTitle = (title = "") =>
  title.toLowerCase().trim().replace(/\s+/g, " ");

/** Returns true for PNG cutouts, placeholders, and broken example URLs. */
export const isLegacyCategoryImage = (url) => {
  if (!url || typeof url !== "string") return true;
  const lower = url.toLowerCase();
  return (
    lower.includes("example.com") ||
    lower.includes("purepng.com") ||
    lower.includes("vecteezy.com") ||
    lower.includes("freepik.com") ||
    lower.includes("pngimg.com") ||
    lower.includes("automatednow.com") ||
    lower.includes("xboxservices.com") ||
    lower.includes("cerave.com")
  );
};

/**
 * Resolve a dedicated photograph for a category title.
 * Never uses fuzzy keyword matching — exact title lookup only.
 */
export const resolveCategoryPhoto = (title = "", legacySrc = null) => {
  const key = normalizeCategoryTitle(title);
  if (CATEGORY_PHOTO_MAP[key]) {
    return CATEGORY_PHOTO_MAP[key];
  }

  if (legacySrc && !isLegacyCategoryImage(legacySrc)) {
    return legacySrc;
  }

  return DEFAULT_PHOTO;
};

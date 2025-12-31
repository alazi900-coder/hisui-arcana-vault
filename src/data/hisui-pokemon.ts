// Pokémon Legends: Arceus - Complete Hisui Pokédex (242 Pokémon)
import type { Pokemon } from '@/types/pokemon';

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const ARTWORK_BASE = `${SPRITE_BASE}/other/official-artwork`;
const ANIMATED_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown';

// Helper to generate image URLs with animated sprites
const img = (id: number, hisuiId?: number) => ({
  thumb: `${SPRITE_BASE}/${id}.png`,
  artwork: `${ARTWORK_BASE}/${id}.png`,
  animated: `${ANIMATED_BASE}/${id}.gif`,
});

export const hisuiPokemon: Pokemon[] = [
  // #001 - Rowlet (Starter)
  {
    id: 'rowlet', dex_no: 1, name_ar: 'روليت', name_en: 'Rowlet',
    types: ['grass', 'flying'], tags: ['starter'],
    stats: { hp: 68, atk: 55, def: 55, spa: 50, spd: 50, spe: 42 },
    description_ar: 'بوكيمون بومة عشبي. يطلق ريشاً حاداً كالشفرات على أعدائه.',
    description_en: 'This wary Pokémon uses photosynthesis to store up energy during the day, while becoming active at night.',
    evolutions: [{ to_id: 'dartrix', conditions_ar: 'المستوى 17', conditions_en: 'Level 17' }],
    images: img(722), learnset: [], spawn_refs: []
  },
  {
    id: 'dartrix', dex_no: 2, name_ar: 'دارتريكس', name_en: 'Dartrix',
    types: ['grass', 'flying'], tags: [],
    stats: { hp: 78, atk: 75, def: 75, spa: 70, spd: 70, spe: 52 },
    description_ar: 'يفخر بمظهره ويقضي وقتاً طويلاً في تنظيف ريشه.',
    description_en: 'A narcissistic Pokémon that spends much time preening its wings.',
    evolutions: [{ to_id: 'hisuian-decidueye', conditions_ar: 'المستوى 36', conditions_en: 'Level 36' }],
    images: img(723), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-decidueye', dex_no: 3, name_ar: 'ديسيدواي الهيسوي', name_en: 'Hisuian Decidueye',
    types: ['grass', 'fighting'], tags: ['hisuian'],
    stats: { hp: 88, atk: 112, def: 80, spa: 95, spd: 95, spe: 60 },
    description_ar: 'تكيف مع بيئة هيسوي الباردة، يقاتل بشراسة مستخدماً ريشه كسهام.',
    description_en: 'The fierce cold of Hisui has caused this Pokémon to evolve into a fierce fighter.',
    evolutions: [], images: img(724, 10229), learnset: [], spawn_refs: []
  },
  // #004 - Cyndaquil (Starter)
  {
    id: 'cyndaquil', dex_no: 4, name_ar: 'سيندكويل', name_en: 'Cyndaquil',
    types: ['fire'], tags: ['starter'],
    stats: { hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 },
    description_ar: 'بوكيمون خجول يشعل ظهره عند الخوف للدفاع عن نفسه.',
    description_en: 'It is timid, and always curls itself up in a ball. If attacked, it flares up its back for protection.',
    evolutions: [{ to_id: 'quilava', conditions_ar: 'المستوى 14', conditions_en: 'Level 14' }],
    images: img(155), learnset: [], spawn_refs: []
  },
  {
    id: 'quilava', dex_no: 5, name_ar: 'كويلافا', name_en: 'Quilava',
    types: ['fire'], tags: [],
    stats: { hp: 58, atk: 64, def: 58, spa: 80, spd: 65, spe: 80 },
    description_ar: 'يخيف أعداءه بإشعال النيران على ظهره ورأسه.',
    description_en: 'It intimidates foes with the heat of its flames. The fire burns more strongly when it readies to fight.',
    evolutions: [{ to_id: 'hisuian-typhlosion', conditions_ar: 'المستوى 36', conditions_en: 'Level 36' }],
    images: img(156), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-typhlosion', dex_no: 6, name_ar: 'تايفلوجن الهيسوي', name_en: 'Hisuian Typhlosion',
    types: ['fire', 'ghost'], tags: ['hisuian'],
    stats: { hp: 73, atk: 84, def: 78, spa: 119, spd: 85, spe: 95 },
    description_ar: 'اكتسب قوى شبحية من أرواح هيسوي القديمة. لهيبه يحرق الروح.',
    description_en: 'Said to purify lost, forsaken souls with its flames and guide them to the afterlife.',
    evolutions: [], images: img(157, 10230), learnset: [], spawn_refs: []
  },
  // #007 - Oshawott (Starter)
  {
    id: 'oshawott', dex_no: 7, name_ar: 'أوشاووت', name_en: 'Oshawott',
    types: ['water'], tags: ['starter'],
    stats: { hp: 55, atk: 55, def: 45, spa: 63, spd: 45, spe: 45 },
    description_ar: 'يستخدم الصدفة على بطنه كسلاح للقتال والدفاع.',
    description_en: 'It fights using the scalchop on its stomach. In response to an attack, it retaliates immediately.',
    evolutions: [{ to_id: 'dewott', conditions_ar: 'المستوى 17', conditions_en: 'Level 17' }],
    images: img(501), learnset: [], spawn_refs: []
  },
  {
    id: 'dewott', dex_no: 8, name_ar: 'ديووت', name_en: 'Dewott',
    types: ['water'], tags: [],
    stats: { hp: 75, atk: 75, def: 60, spa: 83, spd: 60, spe: 60 },
    description_ar: 'يتدرب باستمرار على فنون السيف باستخدام صدفتيه.',
    description_en: 'Strict training is how it learns its flowing double-scalchop technique.',
    evolutions: [{ to_id: 'hisuian-samurott', conditions_ar: 'المستوى 36', conditions_en: 'Level 36' }],
    images: img(502), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-samurott', dex_no: 9, name_ar: 'ساموروت الهيسوي', name_en: 'Hisuian Samurott',
    types: ['water', 'dark'], tags: ['hisuian'],
    stats: { hp: 90, atk: 108, def: 80, spa: 100, spd: 65, spe: 85 },
    description_ar: 'محارب قاسٍ يستخدم صدفته كسيف حاد. لا يعرف الرحمة في المعركة.',
    description_en: 'Hard of heart and deft of blade, this rare form has a storied past in Hisui.',
    evolutions: [], images: img(503, 10231), learnset: [], spawn_refs: []
  },
  // #010-019 - Bidoof line & early Pokémon
  {
    id: 'bidoof', dex_no: 10, name_ar: 'بيدووف', name_en: 'Bidoof',
    types: ['normal'], tags: [],
    stats: { hp: 59, atk: 45, def: 40, spa: 35, spd: 40, spe: 31 },
    description_ar: 'يستخدم أسنانه القوية لقضم الأشجار. مجتهد جداً.',
    description_en: 'With nerves of steel, nothing can perturb it. It is more agile and active than it appears.',
    evolutions: [{ to_id: 'bibarel', conditions_ar: 'المستوى 15', conditions_en: 'Level 15' }],
    images: img(399), learnset: [], spawn_refs: []
  },
  {
    id: 'bibarel', dex_no: 11, name_ar: 'بيباريل', name_en: 'Bibarel',
    types: ['normal', 'water'], tags: [],
    stats: { hp: 79, atk: 85, def: 60, spa: 55, spd: 60, spe: 71 },
    description_ar: 'يبني سدوداً على الأنهار باستخدام الأشجار التي يقضمها.',
    description_en: 'It makes its nest by damming streams with bark and mud. It is known as an industrious worker.',
    evolutions: [], images: img(400), learnset: [], spawn_refs: []
  },
  {
    id: 'starly', dex_no: 12, name_ar: 'ستارلي', name_en: 'Starly',
    types: ['normal', 'flying'], tags: [],
    stats: { hp: 40, atk: 55, def: 30, spa: 30, spd: 30, spe: 60 },
    description_ar: 'يتجمع في أسراب كبيرة. صوته مزعج جداً.',
    description_en: 'They flock in great numbers. Though small, they flap their wings with great power.',
    evolutions: [{ to_id: 'staravia', conditions_ar: 'المستوى 14', conditions_en: 'Level 14' }],
    images: img(396), learnset: [], spawn_refs: []
  },
  {
    id: 'staravia', dex_no: 13, name_ar: 'ستارافيا', name_en: 'Staravia',
    types: ['normal', 'flying'], tags: [],
    stats: { hp: 55, atk: 75, def: 50, spa: 40, spd: 40, spe: 80 },
    description_ar: 'يعيش في مجموعات ويتنافس على الزعامة.',
    description_en: 'It lives in forests and fields. Squabbles over territory occur when flocks collide.',
    evolutions: [{ to_id: 'staraptor', conditions_ar: 'المستوى 34', conditions_en: 'Level 34' }],
    images: img(397), learnset: [], spawn_refs: []
  },
  {
    id: 'staraptor', dex_no: 14, name_ar: 'ستارابتور', name_en: 'Staraptor',
    types: ['normal', 'flying'], tags: [],
    stats: { hp: 85, atk: 120, def: 70, spa: 50, spd: 60, spe: 100 },
    description_ar: 'محارب شرس في السماء. لا يتوقف حتى يهزم خصمه.',
    description_en: 'It never stops attacking even if it is injured. It is a fearsome Pokémon.',
    evolutions: [], images: img(398), learnset: [], spawn_refs: []
  },
  {
    id: 'shinx', dex_no: 15, name_ar: 'شينكس', name_en: 'Shinx',
    types: ['electric'], tags: [],
    stats: { hp: 45, atk: 65, def: 34, spa: 40, spd: 34, spe: 45 },
    description_ar: 'يولد الكهرباء عند شد عضلاته. فروه يلمع.',
    description_en: 'All of its fur dazzles if danger is sensed. It flees while the foe is momentarily blinded.',
    evolutions: [{ to_id: 'luxio', conditions_ar: 'المستوى 15', conditions_en: 'Level 15' }],
    images: img(403), learnset: [], spawn_refs: []
  },
  {
    id: 'luxio', dex_no: 16, name_ar: 'لوكسيو', name_en: 'Luxio',
    types: ['electric'], tags: [],
    stats: { hp: 60, atk: 85, def: 49, spa: 60, spd: 49, spe: 60 },
    description_ar: 'يعيش في مجموعات صغيرة. مخالبه تطلق صواعق كهربائية.',
    description_en: 'Strong electricity courses through the tips of its claws. A light scratch causes fainting in foes.',
    evolutions: [{ to_id: 'luxray', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' }],
    images: img(404), learnset: [], spawn_refs: []
  },
  {
    id: 'luxray', dex_no: 17, name_ar: 'لوكسراي', name_en: 'Luxray',
    types: ['electric'], tags: [],
    stats: { hp: 80, atk: 120, def: 79, spa: 95, spd: 79, spe: 70 },
    description_ar: 'يمكنه رؤية ما خلف الجدران بأشعة X. صياد ماهر.',
    description_en: 'It has eyes that can see through anything. It spots and captures prey hiding behind objects.',
    evolutions: [], images: img(405), learnset: [], spawn_refs: []
  },
  // Wurmple line
  {
    id: 'wurmple', dex_no: 18, name_ar: 'ورمبل', name_en: 'Wurmple',
    types: ['bug'], tags: [],
    stats: { hp: 45, atk: 45, def: 35, spa: 20, spd: 30, spe: 20 },
    description_ar: 'يستخدم الأشواك على ذيله للدفاع عن نفسه.',
    description_en: 'Using the spikes on its rear end, it peels the bark off trees and feeds on the sap that oozes out.',
    evolutions: [
      { to_id: 'silcoon', conditions_ar: 'المستوى 7 (عشوائي)', conditions_en: 'Level 7 (Random)' },
      { to_id: 'cascoon', conditions_ar: 'المستوى 7 (عشوائي)', conditions_en: 'Level 7 (Random)' }
    ],
    images: img(265), learnset: [], spawn_refs: []
  },
  {
    id: 'silcoon', dex_no: 19, name_ar: 'سيلكون', name_en: 'Silcoon',
    types: ['bug'], tags: [],
    stats: { hp: 50, atk: 35, def: 55, spa: 25, spd: 25, spe: 15 },
    description_ar: 'يلف نفسه بخيوط الحرير وينتظر التطور.',
    description_en: 'It wraps silk around the branches of a tree. It drinks rainwater collecting on its silk.',
    evolutions: [{ to_id: 'beautifly', conditions_ar: 'المستوى 10', conditions_en: 'Level 10' }],
    images: img(266), learnset: [], spawn_refs: []
  },
  {
    id: 'beautifly', dex_no: 20, name_ar: 'بيوتيفلاي', name_en: 'Beautifly',
    types: ['bug', 'flying'], tags: [],
    stats: { hp: 60, atk: 70, def: 50, spa: 100, spd: 50, spe: 65 },
    description_ar: 'يمتص رحيق الأزهار بخرطومه الطويل.',
    description_en: 'It has a long mouth like a coiled needle, which is very convenient for collecting pollen from flowers.',
    evolutions: [], images: img(267), learnset: [], spawn_refs: []
  },
  {
    id: 'cascoon', dex_no: 21, name_ar: 'كاسكون', name_en: 'Cascoon',
    types: ['bug'], tags: [],
    stats: { hp: 50, atk: 35, def: 55, spa: 25, spd: 25, spe: 15 },
    description_ar: 'لا يتحرك أبداً. يتذكر من هاجمه لينتقم لاحقاً.',
    description_en: 'If it is attacked, it does not fight back but simply endures. It never forgets the pain it endures.',
    evolutions: [{ to_id: 'dustox', conditions_ar: 'المستوى 10', conditions_en: 'Level 10' }],
    images: img(268), learnset: [], spawn_refs: []
  },
  {
    id: 'dustox', dex_no: 22, name_ar: 'داستوكس', name_en: 'Dustox',
    types: ['bug', 'poison'], tags: [],
    stats: { hp: 60, atk: 50, def: 70, spa: 50, spd: 90, spe: 65 },
    description_ar: 'ينثر سماً ساماً من أجنحته عند الخطر.',
    description_en: 'It scatters horribly toxic dust when it senses danger. It is a nocturnal Pokémon.',
    evolutions: [], images: img(269), learnset: [], spawn_refs: []
  },
  // Ponyta line
  {
    id: 'ponyta', dex_no: 23, name_ar: 'بونيتا', name_en: 'Ponyta',
    types: ['fire'], tags: [],
    stats: { hp: 50, atk: 85, def: 55, spa: 65, spd: 65, spe: 90 },
    description_ar: 'عند ولادته يكون ضعيفاً لكنه يصبح أقوى مع الجري.',
    description_en: 'It is incredibly weak at birth. It can barely stand up. It gets stronger by stumbling and falling.',
    evolutions: [{ to_id: 'rapidash', conditions_ar: 'المستوى 40', conditions_en: 'Level 40' }],
    images: img(77), learnset: [], spawn_refs: []
  },
  {
    id: 'rapidash', dex_no: 24, name_ar: 'رابيداش', name_en: 'Rapidash',
    types: ['fire'], tags: [],
    stats: { hp: 65, atk: 100, def: 70, spa: 80, spd: 80, spe: 105 },
    description_ar: 'يركض بسرعة 150 ميلاً في الساعة. لبدته النارية جميلة.',
    description_en: 'Very competitive, this Pokémon will chase anything that moves fast in the hopes of racing it.',
    evolutions: [], images: img(78), learnset: [], spawn_refs: []
  },
  // Eevee line
  {
    id: 'eevee', dex_no: 25, name_ar: 'إيفي', name_en: 'Eevee',
    types: ['normal'], tags: [],
    stats: { hp: 55, atk: 55, def: 50, spa: 45, spd: 65, spe: 55 },
    description_ar: 'جيناته غير مستقرة مما يسمح له بالتطور بطرق متعددة.',
    description_en: 'Its genetic code is irregular. It may mutate if it is exposed to radiation from elemental stones.',
    evolutions: [
      { to_id: 'vaporeon', conditions_ar: 'حجر الماء', conditions_en: 'Water Stone' },
      { to_id: 'jolteon', conditions_ar: 'حجر الرعد', conditions_en: 'Thunder Stone' },
      { to_id: 'flareon', conditions_ar: 'حجر النار', conditions_en: 'Fire Stone' },
      { to_id: 'espeon', conditions_ar: 'صداقة عالية (نهار)', conditions_en: 'High Friendship (Day)' },
      { to_id: 'umbreon', conditions_ar: 'صداقة عالية (ليل)', conditions_en: 'High Friendship (Night)' },
      { to_id: 'leafeon', conditions_ar: 'حجر الورقة', conditions_en: 'Leaf Stone' },
      { to_id: 'glaceon', conditions_ar: 'حجر الجليد', conditions_en: 'Ice Stone' },
      { to_id: 'sylveon', conditions_ar: 'صداقة عالية + حركة جنية', conditions_en: 'High Friendship + Fairy Move' }
    ],
    images: img(133), learnset: [], spawn_refs: []
  },
  {
    id: 'vaporeon', dex_no: 26, name_ar: 'فابوريون', name_en: 'Vaporeon',
    types: ['water'], tags: [],
    stats: { hp: 130, atk: 65, def: 60, spa: 110, spd: 95, spe: 65 },
    description_ar: 'يمكنه الذوبان في الماء والاختفاء تماماً.',
    description_en: 'It has evolved to be suitable for an aquatic life. It can invisibly melt away into water.',
    evolutions: [], images: img(134), learnset: [], spawn_refs: []
  },
  {
    id: 'jolteon', dex_no: 27, name_ar: 'جولتيون', name_en: 'Jolteon',
    types: ['electric'], tags: [],
    stats: { hp: 65, atk: 65, def: 60, spa: 110, spd: 95, spe: 130 },
    description_ar: 'كل شعرة في جسمه مشحونة بالكهرباء.',
    description_en: 'It accumulates negative ions in the atmosphere to blast out 10,000-volt lightning bolts.',
    evolutions: [], images: img(135), learnset: [], spawn_refs: []
  },
  {
    id: 'flareon', dex_no: 28, name_ar: 'فلاريون', name_en: 'Flareon',
    types: ['fire'], tags: [],
    stats: { hp: 65, atk: 130, def: 60, spa: 95, spd: 110, spe: 65 },
    description_ar: 'يخزن الحرارة في جسمه ويطلقها كلهيب.',
    description_en: 'It stores some of the air it inhales in its internal flame pouch, which heats it to 3,000 degrees.',
    evolutions: [], images: img(136), learnset: [], spawn_refs: []
  },
  {
    id: 'espeon', dex_no: 29, name_ar: 'إسبيون', name_en: 'Espeon',
    types: ['psychic'], tags: [],
    stats: { hp: 65, atk: 65, def: 60, spa: 130, spd: 95, spe: 110 },
    description_ar: 'يستشعر حركات الهواء بفروه ليتنبأ بالمستقبل.',
    description_en: 'By reading air currents, it can predict things such as the weather or its foe\'s next move.',
    evolutions: [], images: img(196), learnset: [], spawn_refs: []
  },
  {
    id: 'umbreon', dex_no: 30, name_ar: 'أمبريون', name_en: 'Umbreon',
    types: ['dark'], tags: [],
    stats: { hp: 95, atk: 65, def: 110, spa: 60, spd: 130, spe: 65 },
    description_ar: 'حلقاته تتوهج عندما يكون متحمساً أو غاضباً.',
    description_en: 'When exposed to the moon\'s aura, the rings on its body glow faintly and fill it with power.',
    evolutions: [], images: img(197), learnset: [], spawn_refs: []
  },
  {
    id: 'leafeon', dex_no: 31, name_ar: 'ليفيون', name_en: 'Leafeon',
    types: ['grass'], tags: [],
    stats: { hp: 65, atk: 110, def: 130, spa: 60, spd: 65, spe: 95 },
    description_ar: 'يقوم بالتمثيل الضوئي مثل النبات.',
    description_en: 'It basically does not fight. When it basks in the sun, it produces clean air from its body.',
    evolutions: [], images: img(470), learnset: [], spawn_refs: []
  },
  {
    id: 'glaceon', dex_no: 32, name_ar: 'جلاسيون', name_en: 'Glaceon',
    types: ['ice'], tags: [],
    stats: { hp: 65, atk: 60, def: 110, spa: 130, spd: 95, spe: 65 },
    description_ar: 'يجمد الهواء حوله ليخلق رذاذاً جليدياً.',
    description_en: 'It can control its body temperature at will, freezing the moisture in the air into ice crystals.',
    evolutions: [], images: img(471), learnset: [], spawn_refs: []
  },
  {
    id: 'sylveon', dex_no: 33, name_ar: 'سيلفيون', name_en: 'Sylveon',
    types: ['fairy'], tags: [],
    stats: { hp: 95, atk: 65, def: 65, spa: 110, spd: 130, spe: 60 },
    description_ar: 'يهدئ المعارك بإرسال هالة مسالمة من أشرطته.',
    description_en: 'It wraps its ribbonlike feelers around its Trainer\'s arm as they walk together.',
    evolutions: [], images: img(700), learnset: [], spawn_refs: []
  },
  // Zubat line
  {
    id: 'zubat', dex_no: 34, name_ar: 'زوبات', name_en: 'Zubat',
    types: ['poison', 'flying'], tags: [],
    stats: { hp: 40, atk: 45, def: 35, spa: 30, spd: 40, spe: 55 },
    description_ar: 'يعيش في الكهوف المظلمة. لا عيون له ويستخدم الصدى.',
    description_en: 'It has no eyes. Instead, it relies on its ultrasonic cries for echolocation to fly about.',
    evolutions: [{ to_id: 'golbat', conditions_ar: 'المستوى 22', conditions_en: 'Level 22' }],
    images: img(41), learnset: [], spawn_refs: []
  },
  {
    id: 'golbat', dex_no: 35, name_ar: 'جولبات', name_en: 'Golbat',
    types: ['poison', 'flying'], tags: [],
    stats: { hp: 75, atk: 80, def: 70, spa: 65, spd: 75, spe: 90 },
    description_ar: 'يمتص الدماء حتى يصبح ثقيلاً جداً للطيران.',
    description_en: 'It can drink more than 10 ounces of blood at once. If it has too much, it gets too heavy to fly.',
    evolutions: [{ to_id: 'crobat', conditions_ar: 'صداقة عالية', conditions_en: 'High Friendship' }],
    images: img(42), learnset: [], spawn_refs: []
  },
  {
    id: 'crobat', dex_no: 36, name_ar: 'كروبات', name_en: 'Crobat',
    types: ['poison', 'flying'], tags: [],
    stats: { hp: 85, atk: 90, def: 80, spa: 70, spd: 80, spe: 130 },
    description_ar: 'يطير بصمت في الليل. أجنحته الأربعة تجعله سريعاً جداً.',
    description_en: 'The development of wings on its legs enables it to fly fast but also makes it hard to stop.',
    evolutions: [], images: img(169), learnset: [], spawn_refs: []
  },
  // Drifloon line
  {
    id: 'drifloon', dex_no: 37, name_ar: 'دريفلون', name_en: 'Drifloon',
    types: ['ghost', 'flying'], tags: [],
    stats: { hp: 90, atk: 50, def: 34, spa: 60, spd: 44, spe: 70 },
    description_ar: 'يقال إنه يحاول خطف الأطفال الذين يمسكون بخيطه.',
    description_en: 'It is whispered that any child who mistakes Drifloon for a balloon and holds on to it could wind up missing.',
    evolutions: [{ to_id: 'drifblim', conditions_ar: 'المستوى 28', conditions_en: 'Level 28' }],
    images: img(425), learnset: [], spawn_refs: []
  },
  {
    id: 'drifblim', dex_no: 38, name_ar: 'دريفبليم', name_en: 'Drifblim',
    types: ['ghost', 'flying'], tags: [],
    stats: { hp: 150, atk: 80, def: 44, spa: 90, spd: 54, spe: 80 },
    description_ar: 'يطفو ويحمل البوكيمون والناس. لا أحد يعرف أين يذهب.',
    description_en: 'It carries people and Pokémon when it flies. But since it only drifts, it can end up anywhere.',
    evolutions: [], images: img(426), learnset: [], spawn_refs: []
  },
  // Kricketot line
  {
    id: 'kricketot', dex_no: 39, name_ar: 'كريكيتوت', name_en: 'Kricketot',
    types: ['bug'], tags: [],
    stats: { hp: 37, atk: 25, def: 41, spa: 25, spd: 41, spe: 25 },
    description_ar: 'يصدر صوتاً بضرب قرونه ببعضها.',
    description_en: 'When its antennae hit each other, it sounds like the music of a xylophone.',
    evolutions: [{ to_id: 'kricketune', conditions_ar: 'المستوى 10', conditions_en: 'Level 10' }],
    images: img(401), learnset: [], spawn_refs: []
  },
  {
    id: 'kricketune', dex_no: 40, name_ar: 'كريكيتون', name_en: 'Kricketune',
    types: ['bug'], tags: [],
    stats: { hp: 77, atk: 85, def: 51, spa: 55, spd: 51, spe: 65 },
    description_ar: 'يعزف ألحاناً عاطفية بأذرعه.',
    description_en: 'It signals its emotions with its melodies. Scientists are studying these melodic patterns.',
    evolutions: [], images: img(402), learnset: [], spawn_refs: []
  },
  // Buizel line
  {
    id: 'buizel', dex_no: 41, name_ar: 'بويزل', name_en: 'Buizel',
    types: ['water'], tags: [],
    stats: { hp: 55, atk: 65, def: 35, spa: 60, spd: 30, spe: 85 },
    description_ar: 'يدور طوقه كمروحة للسباحة بسرعة.',
    description_en: 'It spins its two tails like a screw to propel itself through water. The tails also act as a float.',
    evolutions: [{ to_id: 'floatzel', conditions_ar: 'المستوى 26', conditions_en: 'Level 26' }],
    images: img(418), learnset: [], spawn_refs: []
  },
  {
    id: 'floatzel', dex_no: 42, name_ar: 'فلوتزل', name_en: 'Floatzel',
    types: ['water'], tags: [],
    stats: { hp: 85, atk: 105, def: 55, spa: 85, spd: 50, spe: 115 },
    description_ar: 'ينقذ الغرقى بطوقه الطافي. سباح ممتاز.',
    description_en: 'It assists in the rescue of people and Pokémon from drowning. It is known as the sea weasel.',
    evolutions: [], images: img(419), learnset: [], spawn_refs: []
  },
  // Burmy & Wormadam & Mothim
  {
    id: 'burmy', dex_no: 43, name_ar: 'بيرمي', name_en: 'Burmy',
    types: ['bug'], tags: [],
    stats: { hp: 40, atk: 29, def: 45, spa: 29, spd: 45, spe: 36 },
    description_ar: 'يغطي جسمه بأي مواد متاحة للحماية.',
    description_en: 'It covers itself with materials like twigs and leaves to protect itself from the cold.',
    evolutions: [
      { to_id: 'wormadam', conditions_ar: 'المستوى 20 (أنثى)', conditions_en: 'Level 20 (Female)' },
      { to_id: 'mothim', conditions_ar: 'المستوى 20 (ذكر)', conditions_en: 'Level 20 (Male)' }
    ],
    images: img(412), learnset: [], spawn_refs: []
  },
  {
    id: 'wormadam', dex_no: 44, name_ar: 'ورمادام', name_en: 'Wormadam',
    types: ['bug', 'grass'], tags: [],
    stats: { hp: 60, atk: 59, def: 85, spa: 79, spd: 105, spe: 36 },
    description_ar: 'عباءتها النباتية أصبحت جزءاً من جسمها.',
    description_en: 'When Burmy evolved, its cloak became a permanent part of this Pokémon\'s body.',
    evolutions: [], images: img(413), learnset: [], spawn_refs: []
  },
  {
    id: 'mothim', dex_no: 45, name_ar: 'موثيم', name_en: 'Mothim',
    types: ['bug', 'flying'], tags: [],
    stats: { hp: 70, atk: 94, def: 50, spa: 94, spd: 50, spe: 66 },
    description_ar: 'يسرق العسل من خلايا النحل ليلاً.',
    description_en: 'It loves the honey of flowers and steals honey collected by Combee.',
    evolutions: [], images: img(414), learnset: [], spawn_refs: []
  },
  // Geodude line (Hisui doesn't have Hisuian form for these in PLA)
  {
    id: 'geodude', dex_no: 46, name_ar: 'جيودود', name_en: 'Geodude',
    types: ['rock', 'ground'], tags: [],
    stats: { hp: 40, atk: 80, def: 100, spa: 30, spd: 30, spe: 20 },
    description_ar: 'يتدحرج أسفل الجبال. لا يشعر بالألم.',
    description_en: 'Found in fields and mountains. Mistaking them for boulders, people often step on them.',
    evolutions: [{ to_id: 'graveler', conditions_ar: 'المستوى 25', conditions_en: 'Level 25' }],
    images: img(74), learnset: [], spawn_refs: []
  },
  {
    id: 'graveler', dex_no: 47, name_ar: 'جرافيلر', name_en: 'Graveler',
    types: ['rock', 'ground'], tags: [],
    stats: { hp: 55, atk: 95, def: 115, spa: 45, spd: 45, spe: 35 },
    description_ar: 'يتدحرج أسفل المنحدرات بسرعة هائلة.',
    description_en: 'It rolls down slopes to move. It will not stop until it is at the bottom.',
    evolutions: [{ to_id: 'golem', conditions_ar: 'كابل الربط', conditions_en: 'Link Cable' }],
    images: img(75), learnset: [], spawn_refs: []
  },
  {
    id: 'golem', dex_no: 48, name_ar: 'جوليم', name_en: 'Golem',
    types: ['rock', 'ground'], tags: [],
    stats: { hp: 80, atk: 120, def: 130, spa: 55, spd: 65, spe: 45 },
    description_ar: 'جسمه صلب كالفولاذ. ينسلخ مرة في السنة.',
    description_en: 'Once a year, it sheds its rocky hide. The discarded shell crumbles and becomes soil for plants.',
    evolutions: [], images: img(76), learnset: [], spawn_refs: []
  },
  // Abra line
  {
    id: 'abra', dex_no: 49, name_ar: 'أبرا', name_en: 'Abra',
    types: ['psychic'], tags: [],
    stats: { hp: 25, atk: 20, def: 15, spa: 105, spd: 55, spe: 90 },
    description_ar: 'ينام 18 ساعة يومياً. يهرب بالتنقل الآني.',
    description_en: 'It sleeps for 18 hours a day. Even when awake, it teleports itself while remaining seated.',
    evolutions: [{ to_id: 'kadabra', conditions_ar: 'المستوى 16', conditions_en: 'Level 16' }],
    images: img(63), learnset: [], spawn_refs: []
  },
  {
    id: 'kadabra', dex_no: 50, name_ar: 'كادابرا', name_en: 'Kadabra',
    types: ['psychic'], tags: [],
    stats: { hp: 40, atk: 35, def: 30, spa: 120, spd: 70, spe: 105 },
    description_ar: 'ينحني ملعقته بالقوة النفسية ويعيدها.',
    description_en: 'It emits special alpha waves from its body that induce headaches just by being nearby.',
    evolutions: [{ to_id: 'alakazam', conditions_ar: 'كابل الربط', conditions_en: 'Link Cable' }],
    images: img(64), learnset: [], spawn_refs: []
  },
  {
    id: 'alakazam', dex_no: 51, name_ar: 'ألاكازام', name_en: 'Alakazam',
    types: ['psychic'], tags: [],
    stats: { hp: 55, atk: 50, def: 45, spa: 135, spd: 95, spe: 120 },
    description_ar: 'ذكاؤه يفوق الحاسوب الخارق. يتذكر كل شيء.',
    description_en: 'Its brain can outperform a supercomputer. Its IQ is said to be around 5,000.',
    evolutions: [], images: img(65), learnset: [], spawn_refs: []
  },
  // Chimchar line
  {
    id: 'chimchar', dex_no: 52, name_ar: 'تشيمتشار', name_en: 'Chimchar',
    types: ['fire'], tags: [],
    stats: { hp: 44, atk: 58, def: 44, spa: 58, spd: 44, spe: 61 },
    description_ar: 'ينطفئ لهيبه عندما ينام فقط.',
    description_en: 'It agilely scales sheer cliffs to live atop craggy mountains. Its fire is put out when it sleeps.',
    evolutions: [{ to_id: 'monferno', conditions_ar: 'المستوى 14', conditions_en: 'Level 14' }],
    images: img(390), learnset: [], spawn_refs: []
  },
  {
    id: 'monferno', dex_no: 53, name_ar: 'مونفيرنو', name_en: 'Monferno',
    types: ['fire', 'fighting'], tags: [],
    stats: { hp: 64, atk: 78, def: 52, spa: 78, spd: 52, spe: 81 },
    description_ar: 'يستخدم ذيله الناري كسلاح في القتال.',
    description_en: 'To intimidate attackers, it stretches the fire on its tail to make itself appear bigger.',
    evolutions: [{ to_id: 'infernape', conditions_ar: 'المستوى 36', conditions_en: 'Level 36' }],
    images: img(391), learnset: [], spawn_refs: []
  },
  {
    id: 'infernape', dex_no: 54, name_ar: 'إنفيرنايب', name_en: 'Infernape',
    types: ['fire', 'fighting'], tags: [],
    stats: { hp: 76, atk: 104, def: 71, spa: 104, spd: 71, spe: 108 },
    description_ar: 'يستخدم فنون قتال فريدة مع النيران.',
    description_en: 'It uses a special kind of martial arts involving all its limbs. Its fire never goes out.',
    evolutions: [], images: img(392), learnset: [], spawn_refs: []
  },
  // Pichu line
  {
    id: 'pichu', dex_no: 55, name_ar: 'بيتشو', name_en: 'Pichu',
    types: ['electric'], tags: [],
    stats: { hp: 20, atk: 40, def: 15, spa: 35, spd: 35, spe: 60 },
    description_ar: 'لا يستطيع التحكم في كهربائه بعد. يصعق نفسه أحياناً.',
    description_en: 'It is not yet skilled at storing electricity. It may send out a jolt if amused or startled.',
    evolutions: [{ to_id: 'pikachu', conditions_ar: 'صداقة عالية', conditions_en: 'High Friendship' }],
    images: img(172), learnset: [], spawn_refs: []
  },
  {
    id: 'pikachu', dex_no: 56, name_ar: 'بيكاتشو', name_en: 'Pikachu',
    types: ['electric'], tags: [],
    stats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
    description_ar: 'يخزن الكهرباء في خديه ويطلقها كصاعقة.',
    description_en: 'Pikachu that can generate powerful electricity have cheek sacs that are extra soft and super stretchy.',
    evolutions: [{ to_id: 'raichu', conditions_ar: 'حجر الرعد', conditions_en: 'Thunder Stone' }],
    images: img(25), learnset: [], spawn_refs: []
  },
  {
    id: 'raichu', dex_no: 57, name_ar: 'رايتشو', name_en: 'Raichu',
    types: ['electric'], tags: [],
    stats: { hp: 60, atk: 90, def: 55, spa: 90, spd: 80, spe: 110 },
    description_ar: 'يفرغ شحنته في الأرض لتجنب الصعق.',
    description_en: 'Its long tail serves as a ground to protect itself from its own high-voltage power.',
    evolutions: [], images: img(26), learnset: [], spawn_refs: []
  },
  // Magikarp & Gyarados
  {
    id: 'magikarp', dex_no: 58, name_ar: 'ماجيكارب', name_en: 'Magikarp',
    types: ['water'], tags: [],
    stats: { hp: 20, atk: 10, def: 55, spa: 15, spd: 20, spe: 80 },
    description_ar: 'أضعف البوكيمون. يقفز فقط بلا طائل.',
    description_en: 'It is virtually worthless in terms of both power and speed. It is the most weak and pathetic Pokémon.',
    evolutions: [{ to_id: 'gyarados', conditions_ar: 'المستوى 20', conditions_en: 'Level 20' }],
    images: img(129), learnset: [], spawn_refs: []
  },
  {
    id: 'gyarados', dex_no: 59, name_ar: 'جايرادوس', name_en: 'Gyarados',
    types: ['water', 'flying'], tags: [],
    stats: { hp: 95, atk: 125, def: 79, spa: 60, spd: 100, spe: 81 },
    description_ar: 'غضبه مدمر. يمكنه تدمير مدينة في ساعات.',
    description_en: 'Once it begins to rampage, a Gyarados will burn everything down, even in a harsh storm.',
    evolutions: [], images: img(130), learnset: [], spawn_refs: []
  },
  // Shellos & Gastrodon
  {
    id: 'shellos', dex_no: 60, name_ar: 'شيلوس', name_en: 'Shellos',
    types: ['water'], tags: [],
    stats: { hp: 76, atk: 48, def: 48, spa: 57, spd: 62, spe: 34 },
    description_ar: 'لونه يختلف حسب المنطقة. يفرز مخاطاً لزجاً.',
    description_en: 'It oozes a purple fluid to deter enemies. Its shape has changed over the generations.',
    evolutions: [{ to_id: 'gastrodon', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' }],
    images: img(422), learnset: [], spawn_refs: []
  },
  {
    id: 'gastrodon', dex_no: 61, name_ar: 'جاسترودون', name_en: 'Gastrodon',
    types: ['water', 'ground'], tags: [],
    stats: { hp: 111, atk: 83, def: 68, spa: 92, spd: 82, spe: 39 },
    description_ar: 'يعيد تكوين جسمه لو تم تقطيعه. مخاطه سام.',
    description_en: 'It apparently had a shell on its back long ago. It lives in shallow pools.',
    evolutions: [], images: img(423), learnset: [], spawn_refs: []
  },
  // Psyduck & Golduck
  {
    id: 'psyduck', dex_no: 62, name_ar: 'سايداك', name_en: 'Psyduck',
    types: ['water'], tags: [],
    stats: { hp: 50, atk: 52, def: 48, spa: 65, spd: 50, spe: 55 },
    description_ar: 'يعاني من صداع مستمر. يطلق قوى نفسية عند الألم.',
    description_en: 'Always tormented by headaches. It uses its psychic powers unconsciously to alleviate the pain.',
    evolutions: [{ to_id: 'golduck', conditions_ar: 'المستوى 33', conditions_en: 'Level 33' }],
    images: img(54), learnset: [], spawn_refs: []
  },
  {
    id: 'golduck', dex_no: 63, name_ar: 'جولداك', name_en: 'Golduck',
    types: ['water'], tags: [],
    stats: { hp: 80, atk: 82, def: 78, spa: 95, spd: 80, spe: 85 },
    description_ar: 'سباح ممتاز. يُعتقد أنه يملك قوى نفسية.',
    description_en: 'It has superb swimming skills. It uses its psychic powers when its forehead shines mysteriously.',
    evolutions: [], images: img(55), learnset: [], spawn_refs: []
  },
  // Combee & Vespiquen
  {
    id: 'combee', dex_no: 64, name_ar: 'كومبي', name_en: 'Combee',
    types: ['bug', 'flying'], tags: [],
    stats: { hp: 30, atk: 30, def: 42, spa: 30, spd: 42, spe: 70 },
    description_ar: 'ثلاثة تعمل معاً لجمع الرحيق.',
    description_en: 'A Pokémon formed by three others. It busily carries sweet floral honey to its Vespiquen.',
    evolutions: [{ to_id: 'vespiquen', conditions_ar: 'المستوى 21 (أنثى)', conditions_en: 'Level 21 (Female)' }],
    images: img(415), learnset: [], spawn_refs: []
  },
  {
    id: 'vespiquen', dex_no: 65, name_ar: 'فيسبيكوين', name_en: 'Vespiquen',
    types: ['bug', 'flying'], tags: [],
    stats: { hp: 70, atk: 80, def: 102, spa: 80, spd: 102, spe: 40 },
    description_ar: 'ملكة خلية النحل. تربي يرقات في جسمها.',
    description_en: 'Its abdomen is a honeycomb for grubs. It commands a colony of Combee.',
    evolutions: [], images: img(416), learnset: [], spawn_refs: []
  },
  // Scyther & Kleavor
  {
    id: 'scyther', dex_no: 66, name_ar: 'سايثر', name_en: 'Scyther',
    types: ['bug', 'flying'], tags: [],
    stats: { hp: 70, atk: 110, def: 80, spa: 55, spd: 80, spe: 105 },
    description_ar: 'سيوفه الحادة تقطع أي شيء. صياد سريع.',
    description_en: 'It slashes through grass with its sharp scythes, moving too fast for the human eye to track.',
    evolutions: [
      { to_id: 'kleavor', conditions_ar: 'حجر أسود (Black Augurite)', conditions_en: 'Black Augurite' },
      { to_id: 'scizor', conditions_ar: 'معطف معدني', conditions_en: 'Metal Coat' }
    ],
    images: img(123), learnset: [], spawn_refs: []
  },
  {
    id: 'kleavor', dex_no: 67, name_ar: 'كليفور', name_en: 'Kleavor',
    types: ['bug', 'rock'], tags: ['hisuian', 'noble'],
    stats: { hp: 70, atk: 135, def: 95, spa: 45, spd: 70, spe: 85 },
    description_ar: 'أذرعه الحجرية حادة كالفؤوس. النسخة النبيلة قوية جداً.',
    description_en: 'A violent creature that fells towering trees with its crude axes and uses them to build its nest.',
    evolutions: [], images: img(900), learnset: [], spawn_refs: []
  },
  {
    id: 'scizor', dex_no: 68, name_ar: 'سيزور', name_en: 'Scizor',
    types: ['bug', 'steel'], tags: [],
    stats: { hp: 70, atk: 130, def: 100, spa: 55, spd: 80, spe: 65 },
    description_ar: 'مخالبه الفولاذية قوية بما يكفي لسحق أي شيء.',
    description_en: 'This Pokémon\'s pincers, which contain steel, can crush any hard object into bits.',
    evolutions: [], images: img(212), learnset: [], spawn_refs: []
  },
  // Paras & Parasect
  {
    id: 'paras', dex_no: 69, name_ar: 'باراس', name_en: 'Paras',
    types: ['bug', 'grass'], tags: [],
    stats: { hp: 35, atk: 70, def: 55, spa: 45, spd: 55, spe: 25 },
    description_ar: 'الفطريات على ظهره تتحكم به جزئياً.',
    description_en: 'Mushrooms called tochukaso grow on its back. The mushrooms can be used as medicine.',
    evolutions: [{ to_id: 'parasect', conditions_ar: 'المستوى 24', conditions_en: 'Level 24' }],
    images: img(46), learnset: [], spawn_refs: []
  },
  {
    id: 'parasect', dex_no: 70, name_ar: 'باراسيكت', name_en: 'Parasect',
    types: ['bug', 'grass'], tags: [],
    stats: { hp: 60, atk: 95, def: 80, spa: 60, spd: 80, spe: 30 },
    description_ar: 'الفطر سيطر على جسمه بالكامل.',
    description_en: 'The mushroom has taken over its host. It scatters toxic spores from the mushroom cap.',
    evolutions: [], images: img(47), learnset: [], spawn_refs: []
  },
  // Croagunk & Toxicroak
  {
    id: 'croagunk', dex_no: 71, name_ar: 'كروجانك', name_en: 'Croagunk',
    types: ['poison', 'fighting'], tags: [],
    stats: { hp: 48, atk: 61, def: 40, spa: 61, spd: 40, spe: 50 },
    description_ar: 'أكياس سمه تنبض بإيقاع غريب.',
    description_en: 'Its cheek pouches hold its poison. Inflating them raises the pitch of its croaks.',
    evolutions: [{ to_id: 'toxicroak', conditions_ar: 'المستوى 37', conditions_en: 'Level 37' }],
    images: img(453), learnset: [], spawn_refs: []
  },
  {
    id: 'toxicroak', dex_no: 72, name_ar: 'توكسيكروك', name_en: 'Toxicroak',
    types: ['poison', 'fighting'], tags: [],
    stats: { hp: 83, atk: 106, def: 65, spa: 86, spd: 65, spe: 85 },
    description_ar: 'مخلب سمه قاتل. يحتفظ بالسم في كيس حلقه.',
    description_en: 'The toxin made in its poison sacs is pumped to the claws through tubes in its arms.',
    evolutions: [], images: img(454), learnset: [], spawn_refs: []
  },
  // Stunky & Skuntank
  {
    id: 'stunky', dex_no: 73, name_ar: 'ستانكي', name_en: 'Stunky',
    types: ['poison', 'dark'], tags: [],
    stats: { hp: 63, atk: 63, def: 47, spa: 41, spd: 41, spe: 74 },
    description_ar: 'رائحته النتنة يمكن أن تُشم من ميل بعيد.',
    description_en: 'It sprays a foul fluid from its rear. Its stench spreads over a mile radius.',
    evolutions: [{ to_id: 'skuntank', conditions_ar: 'المستوى 34', conditions_en: 'Level 34' }],
    images: img(434), learnset: [], spawn_refs: []
  },
  {
    id: 'skuntank', dex_no: 74, name_ar: 'سكانتانك', name_en: 'Skuntank',
    types: ['poison', 'dark'], tags: [],
    stats: { hp: 103, atk: 93, def: 67, spa: 71, spd: 61, spe: 84 },
    description_ar: 'يطلق سائلاً ساماً من ذيله يحرق الجلد.',
    description_en: 'It sprays a vile-smelling fluid from the tip of its tail to attack. Its range is over 160 feet.',
    evolutions: [], images: img(435), learnset: [], spawn_refs: []
  },
  // Hippopotas & Hippowdon
  {
    id: 'hippopotas', dex_no: 75, name_ar: 'هيبوبوتاس', name_en: 'Hippopotas',
    types: ['ground'], tags: [],
    stats: { hp: 68, atk: 72, def: 78, spa: 38, spd: 42, spe: 32 },
    description_ar: 'يخرج رملاً من فتحات جسمه بدلاً من العرق.',
    description_en: 'It lives in arid places. Instead of perspiration, it expels grainy sand from its body.',
    evolutions: [{ to_id: 'hippowdon', conditions_ar: 'المستوى 34', conditions_en: 'Level 34' }],
    images: img(449), learnset: [], spawn_refs: []
  },
  {
    id: 'hippowdon', dex_no: 76, name_ar: 'هيبودون', name_en: 'Hippowdon',
    types: ['ground'], tags: [],
    stats: { hp: 108, atk: 112, def: 118, spa: 68, spd: 72, spe: 47 },
    description_ar: 'يثير عاصفة رملية عند فتح فمه.',
    description_en: 'It brandishes its gaping mouth in a display of fearsome strength. It creates a sandstorm.',
    evolutions: [], images: img(450), learnset: [], spawn_refs: []
  },
  // Pachirisu
  {
    id: 'pachirisu', dex_no: 77, name_ar: 'باتشيريسو', name_en: 'Pachirisu',
    types: ['electric'], tags: [],
    stats: { hp: 60, atk: 45, def: 70, spa: 45, spd: 90, spe: 95 },
    description_ar: 'يخزن كرات كهربائية في فروه.',
    description_en: 'It makes fur balls that crackle with static electricity. It stores them in tree holes.',
    evolutions: [], images: img(417), learnset: [], spawn_refs: []
  },
  // Snorlax & Munchlax
  {
    id: 'munchlax', dex_no: 78, name_ar: 'مانتشلاكس', name_en: 'Munchlax',
    types: ['normal'], tags: [],
    stats: { hp: 135, atk: 85, def: 40, spa: 40, spd: 85, spe: 5 },
    description_ar: 'يأكل أي شيء يجده دون مضغ.',
    description_en: 'It wolfs down its weight in food once a day, swallowing it without chewing.',
    evolutions: [{ to_id: 'snorlax', conditions_ar: 'صداقة عالية', conditions_en: 'High Friendship' }],
    images: img(446), learnset: [], spawn_refs: []
  },
  {
    id: 'snorlax', dex_no: 79, name_ar: 'سنورلاكس', name_en: 'Snorlax',
    types: ['normal'], tags: [],
    stats: { hp: 160, atk: 110, def: 65, spa: 65, spd: 110, spe: 30 },
    description_ar: 'ينام طوال اليوم ويأكل 400 كيلو يومياً.',
    description_en: 'It is not satisfied unless it eats over 880 pounds of food every day. It starts to feel hungry right after eating.',
    evolutions: [], images: img(143), learnset: [], spawn_refs: []
  },
  // Aipom & Ambipom
  {
    id: 'aipom', dex_no: 80, name_ar: 'أيبوم', name_en: 'Aipom',
    types: ['normal'], tags: [],
    stats: { hp: 55, atk: 70, def: 55, spa: 40, spd: 55, spe: 85 },
    description_ar: 'يستخدم ذيله كيد أكثر براعة من يديه الفعليتين.',
    description_en: 'Its tail is so powerful that it can use it to grab a tree branch and hold itself up.',
    evolutions: [{ to_id: 'ambipom', conditions_ar: 'تعلم Double Hit', conditions_en: 'Learn Double Hit' }],
    images: img(190), learnset: [], spawn_refs: []
  },
  {
    id: 'ambipom', dex_no: 81, name_ar: 'أمبيبوم', name_en: 'Ambipom',
    types: ['normal'], tags: [],
    stats: { hp: 75, atk: 100, def: 66, spa: 60, spd: 66, spe: 115 },
    description_ar: 'يستخدم ذيليه للقيام بمهام معقدة.',
    description_en: 'To eat, it skillfully performs a ring toss with its tails, hooking berries from branches.',
    evolutions: [], images: img(424), learnset: [], spawn_refs: []
  },
  // Heracross
  {
    id: 'heracross', dex_no: 82, name_ar: 'هيراكروس', name_en: 'Heracross',
    types: ['bug', 'fighting'], tags: [],
    stats: { hp: 80, atk: 125, def: 75, spa: 40, spd: 95, spe: 85 },
    description_ar: 'قرنه قوي بما يكفي لقلب شاحنة.',
    description_en: 'This powerful Pokémon thrusts its horn under its enemies\' bellies, then lifts and throws them.',
    evolutions: [], images: img(214), learnset: [], spawn_refs: []
  },
  // Magnemite line
  {
    id: 'magnemite', dex_no: 83, name_ar: 'ماجنيمايت', name_en: 'Magnemite',
    types: ['electric', 'steel'], tags: [],
    stats: { hp: 25, atk: 35, def: 70, spa: 95, spd: 55, spe: 45 },
    description_ar: 'يطفو بالمغناطيسية ويصدر موجات كهربائية.',
    description_en: 'It is attracted by electromagnetic waves. It may approach trainers if they are using a phone.',
    evolutions: [{ to_id: 'magneton', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' }],
    images: img(81), learnset: [], spawn_refs: []
  },
  {
    id: 'magneton', dex_no: 84, name_ar: 'ماجنيتون', name_en: 'Magneton',
    types: ['electric', 'steel'], tags: [],
    stats: { hp: 50, atk: 60, def: 95, spa: 120, spd: 70, spe: 70 },
    description_ar: 'ثلاثة ماجنيمايت اتحدوا. مجاله المغناطيسي قوي.',
    description_en: 'This Pokémon is three Magnemite that have linked together. It generates powerful radio waves.',
    evolutions: [{ to_id: 'magnezone', conditions_ar: 'حجر الرعد', conditions_en: 'Thunder Stone' }],
    images: img(82), learnset: [], spawn_refs: []
  },
  {
    id: 'magnezone', dex_no: 85, name_ar: 'ماجنيزون', name_en: 'Magnezone',
    types: ['electric', 'steel'], tags: [],
    stats: { hp: 70, atk: 70, def: 115, spa: 130, spd: 90, spe: 60 },
    description_ar: 'يطلق مدافع كهرومغناطيسية قوية.',
    description_en: 'It evolved from exposure to a special magnetic field. Three units generate magnetism.',
    evolutions: [], images: img(462), learnset: [], spawn_refs: []
  },
  // Bronzor & Bronzong
  {
    id: 'bronzor', dex_no: 86, name_ar: 'برونزور', name_en: 'Bronzor',
    types: ['steel', 'psychic'], tags: [],
    stats: { hp: 57, atk: 24, def: 86, spa: 24, spd: 86, spe: 23 },
    description_ar: 'يُعتقد أنه مرآة قديمة تحولت لبوكيمون.',
    description_en: 'Ancient people believed that the pattern on Bronzor\'s back contained a mysterious power.',
    evolutions: [{ to_id: 'bronzong', conditions_ar: 'المستوى 33', conditions_en: 'Level 33' }],
    images: img(436), learnset: [], spawn_refs: []
  },
  {
    id: 'bronzong', dex_no: 87, name_ar: 'برونزونج', name_en: 'Bronzong',
    types: ['steel', 'psychic'], tags: [],
    stats: { hp: 67, atk: 89, def: 116, spa: 79, spd: 116, spe: 33 },
    description_ar: 'يُقال إنه يستدعي المطر بقوة غامضة.',
    description_en: 'Ancient people believed that petitioning Bronzong for rain was the way to make crops grow.',
    evolutions: [], images: img(437), learnset: [], spawn_refs: []
  },
  // Elekid line
  {
    id: 'elekid', dex_no: 88, name_ar: 'إليكيد', name_en: 'Elekid',
    types: ['electric'], tags: [],
    stats: { hp: 45, atk: 63, def: 37, spa: 65, spd: 55, spe: 95 },
    description_ar: 'يدور ذراعيه لتوليد الكهرباء.',
    description_en: 'It rotates its arms to generate electricity, but it tires easily, so it charges up only a little bit.',
    evolutions: [{ to_id: 'electabuzz', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' }],
    images: img(239), learnset: [], spawn_refs: []
  },
  {
    id: 'electabuzz', dex_no: 89, name_ar: 'إلكتابز', name_en: 'Electabuzz',
    types: ['electric'], tags: [],
    stats: { hp: 65, atk: 83, def: 57, spa: 95, spd: 85, spe: 105 },
    description_ar: 'يظهر بالقرب من محطات الطاقة. يسبب انقطاع الكهرباء.',
    description_en: 'If a major power outage occurs, it is certain that Electabuzz have eaten the electricity.',
    evolutions: [{ to_id: 'electivire', conditions_ar: 'Electirizer', conditions_en: 'Electirizer' }],
    images: img(125), learnset: [], spawn_refs: []
  },
  {
    id: 'electivire', dex_no: 90, name_ar: 'إلكتيفاير', name_en: 'Electivire',
    types: ['electric'], tags: [],
    stats: { hp: 75, atk: 123, def: 67, spa: 95, spd: 85, spe: 95 },
    description_ar: 'يضغط ذيليه على الخصم ويطلق 20,000 فولت.',
    description_en: 'Heedless of enemy attacks, it closes in, shoves its tails onto the foe, then looses high voltage.',
    evolutions: [], images: img(466), learnset: [], spawn_refs: []
  },
  // Magby line
  {
    id: 'magby', dex_no: 91, name_ar: 'ماجبي', name_en: 'Magby',
    types: ['fire'], tags: [],
    stats: { hp: 45, atk: 75, def: 37, spa: 70, spd: 55, spe: 83 },
    description_ar: 'درجة حرارته حوالي 600 درجة مئوية.',
    description_en: 'It lives in volcanic craters. Its body temperature is around 600 degrees C.',
    evolutions: [{ to_id: 'magmar', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' }],
    images: img(240), learnset: [], spawn_refs: []
  },
  {
    id: 'magmar', dex_no: 92, name_ar: 'ماجمار', name_en: 'Magmar',
    types: ['fire'], tags: [],
    stats: { hp: 65, atk: 95, def: 57, spa: 100, spd: 85, spe: 93 },
    description_ar: 'جسمه يشتعل بالنار. يعيش في البراكين.',
    description_en: 'Its body is like a furnace. If angered, it spouts flames that are hot enough to melt boulders.',
    evolutions: [{ to_id: 'magmortar', conditions_ar: 'Magmarizer', conditions_en: 'Magmarizer' }],
    images: img(126), learnset: [], spawn_refs: []
  },
  {
    id: 'magmortar', dex_no: 93, name_ar: 'ماجمورتار', name_en: 'Magmortar',
    types: ['fire'], tags: [],
    stats: { hp: 75, atk: 95, def: 67, spa: 125, spd: 95, spe: 83 },
    description_ar: 'يطلق كرات نار من ذراعيه تبخر أي شيء.',
    description_en: 'It launches fireballs of over 3,600 degrees F from the ends of its arms. It lives in volcanic craters.',
    evolutions: [], images: img(467), learnset: [], spawn_refs: []
  },
  // Mime Jr. & Mr. Mime
  {
    id: 'mime-jr', dex_no: 94, name_ar: 'مايم جونيور', name_en: 'Mime Jr.',
    types: ['psychic', 'fairy'], tags: [],
    stats: { hp: 20, atk: 25, def: 45, spa: 70, spd: 90, spe: 60 },
    description_ar: 'يقلد حركات الآخرين ليتعلم.',
    description_en: 'It mimics its foes in order to create confusion. It can rarely be found alone.',
    evolutions: [{ to_id: 'mr-mime', conditions_ar: 'تعلم Mimic', conditions_en: 'Learn Mimic' }],
    images: img(439), learnset: [], spawn_refs: []
  },
  {
    id: 'mr-mime', dex_no: 95, name_ar: 'مستر مايم', name_en: 'Mr. Mime',
    types: ['psychic', 'fairy'], tags: [],
    stats: { hp: 40, atk: 45, def: 65, spa: 100, spd: 120, spe: 90 },
    description_ar: 'يخلق جدراناً غير مرئية بقوته النفسية.',
    description_en: 'It is a master of pantomime. Its gestures and movements convince watchers that something unseeable exists.',
    evolutions: [], images: img(122), learnset: [], spawn_refs: []
  },
  // Happiny line
  {
    id: 'happiny', dex_no: 96, name_ar: 'هابيني', name_en: 'Happiny',
    types: ['normal'], tags: [],
    stats: { hp: 100, atk: 5, def: 5, spa: 15, spd: 65, spe: 30 },
    description_ar: 'تحمل حجراً أبيض في جيبها كبيضة وهمية.',
    description_en: 'It carries a white, egg-shaped rock in its belly pouch to imitate Chansey.',
    evolutions: [{ to_id: 'chansey', conditions_ar: 'حجر بيضاوي (نهار)', conditions_en: 'Oval Stone (Day)' }],
    images: img(440), learnset: [], spawn_refs: []
  },
  {
    id: 'chansey', dex_no: 97, name_ar: 'تشانسي', name_en: 'Chansey',
    types: ['normal'], tags: [],
    stats: { hp: 250, atk: 5, def: 5, spa: 35, spd: 105, spe: 50 },
    description_ar: 'بيضها مغذٍ جداً. تشاركه مع المرضى.',
    description_en: 'This egg-bearing Pokémon delivers happiness. Eating its eggs makes one kind and caring.',
    evolutions: [{ to_id: 'blissey', conditions_ar: 'صداقة عالية', conditions_en: 'High Friendship' }],
    images: img(113), learnset: [], spawn_refs: []
  },
  {
    id: 'blissey', dex_no: 98, name_ar: 'بليسي', name_en: 'Blissey',
    types: ['normal'], tags: [],
    stats: { hp: 255, atk: 10, def: 10, spa: 75, spd: 135, spe: 55 },
    description_ar: 'تشعر بحزن أي كائن وتحاول مساعدته.',
    description_en: 'The eggs it lays are extremely nutritious. Eating even one fills you with happiness and energy.',
    evolutions: [], images: img(242), learnset: [], spawn_refs: []
  },
  // Budew line
  {
    id: 'budew', dex_no: 99, name_ar: 'بيديو', name_en: 'Budew',
    types: ['grass', 'poison'], tags: [],
    stats: { hp: 40, atk: 30, def: 35, spa: 50, spd: 70, spe: 55 },
    description_ar: 'برعم حساس للشمس. يتفتح في الربيع.',
    description_en: 'Sensitive to changing temperature, the bud is said to bloom when it feels the sun\'s warm touch.',
    evolutions: [{ to_id: 'roselia', conditions_ar: 'صداقة عالية (نهار)', conditions_en: 'High Friendship (Day)' }],
    images: img(406), learnset: [], spawn_refs: []
  },
  {
    id: 'roselia', dex_no: 100, name_ar: 'روزيليا', name_en: 'Roselia',
    types: ['grass', 'poison'], tags: [],
    stats: { hp: 50, atk: 60, def: 45, spa: 100, spd: 80, spe: 65 },
    description_ar: 'وردتاها سامتان. كلما كانت الرائحة أقوى زاد السم.',
    description_en: 'It uses the sweet aroma of its flowers to lure in prey that it then jabs with its thorns.',
    evolutions: [{ to_id: 'roserade', conditions_ar: 'حجر لامع', conditions_en: 'Shiny Stone' }],
    images: img(315), learnset: [], spawn_refs: []
  },
  {
    id: 'roserade', dex_no: 101, name_ar: 'روزريد', name_en: 'Roserade',
    types: ['grass', 'poison'], tags: [],
    stats: { hp: 60, atk: 70, def: 65, spa: 125, spd: 105, spe: 90 },
    description_ar: 'زهرتاها تخفي سوطين سامين قاتلين.',
    description_en: 'It attracts prey with its sweet aroma, then downs it with the thorns hidden in its arms.',
    evolutions: [], images: img(407), learnset: [], spawn_refs: []
  },
  // Carnivine
  {
    id: 'carnivine', dex_no: 102, name_ar: 'كارنيفاين', name_en: 'Carnivine',
    types: ['grass'], tags: [],
    stats: { hp: 74, atk: 100, def: 72, spa: 90, spd: 72, spe: 46 },
    description_ar: 'يجذب الفرائس برائحته الحلوة ثم يلتهمها.',
    description_en: 'It binds itself to trees in marshes. It uses its sweet-smelling drool to attract prey.',
    evolutions: [], images: img(455), learnset: [], spawn_refs: []
  },
  // Tangela & Tangrowth
  {
    id: 'tangela', dex_no: 103, name_ar: 'تانجيلا', name_en: 'Tangela',
    types: ['grass'], tags: [],
    stats: { hp: 65, atk: 55, def: 115, spa: 100, spd: 40, spe: 60 },
    description_ar: 'جسمه مغطى بكروم زرقاء. لا أحد رأى ما تحتها.',
    description_en: 'The blue vines shrouding its body are covered in fine hair. They are hard to see.',
    evolutions: [{ to_id: 'tangrowth', conditions_ar: 'تعلم Ancient Power', conditions_en: 'Learn Ancient Power' }],
    images: img(114), learnset: [], spawn_refs: []
  },
  {
    id: 'tangrowth', dex_no: 104, name_ar: 'تانجروث', name_en: 'Tangrowth',
    types: ['grass'], tags: [],
    stats: { hp: 100, atk: 100, def: 125, spa: 110, spd: 50, spe: 50 },
    description_ar: 'أذرعه تنمو من جديد لو قُطعت.',
    description_en: 'Its arms are made of plants that bind themselves to things. They grow back right away if cut.',
    evolutions: [], images: img(465), learnset: [], spawn_refs: []
  },
  // Barboach & Whiscash
  {
    id: 'barboach', dex_no: 105, name_ar: 'باربواتش', name_en: 'Barboach',
    types: ['water', 'ground'], tags: [],
    stats: { hp: 50, atk: 48, def: 43, spa: 46, spd: 41, spe: 60 },
    description_ar: 'شواربه تستشعر الفريسة في الوحل.',
    description_en: 'Its slimy body is hard to grasp. When it senses danger, it buries itself in mud.',
    evolutions: [{ to_id: 'whiscash', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' }],
    images: img(339), learnset: [], spawn_refs: []
  },
  {
    id: 'whiscash', dex_no: 106, name_ar: 'ويسكاش', name_en: 'Whiscash',
    types: ['water', 'ground'], tags: [],
    stats: { hp: 110, atk: 78, def: 73, spa: 76, spd: 71, spe: 60 },
    description_ar: 'يتنبأ بالزلازل. يحمي بركته بشراسة.',
    description_en: 'It claims a large swamp as its territory. If an enemy draws near, it jumps and attacks.',
    evolutions: [], images: img(340), learnset: [], spawn_refs: []
  },
  // Croagunk already added (71), Toxicroak (72)
  // Ralts line
  {
    id: 'ralts', dex_no: 107, name_ar: 'رالتس', name_en: 'Ralts',
    types: ['psychic', 'fairy'], tags: [],
    stats: { hp: 28, atk: 25, def: 25, spa: 45, spd: 35, spe: 40 },
    description_ar: 'تستشعر المشاعر بقرنها. تختبئ إذا شعرت بالعداء.',
    description_en: 'It can sense the emotions of people. If its Trainer is in a cheerful mood, it grows cheerful too.',
    evolutions: [{ to_id: 'kirlia', conditions_ar: 'المستوى 20', conditions_en: 'Level 20' }],
    images: img(280), learnset: [], spawn_refs: []
  },
  {
    id: 'kirlia', dex_no: 108, name_ar: 'كيرليا', name_en: 'Kirlia',
    types: ['psychic', 'fairy'], tags: [],
    stats: { hp: 38, atk: 35, def: 35, spa: 65, spd: 55, spe: 50 },
    description_ar: 'ترقص عندما تشعر بسعادة مدربها.',
    description_en: 'This Pokémon uses the horns on its head to amplify its psychokinetic power.',
    evolutions: [
      { to_id: 'gardevoir', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' },
      { to_id: 'gallade', conditions_ar: 'حجر الفجر (ذكر)', conditions_en: 'Dawn Stone (Male)' }
    ],
    images: img(281), learnset: [], spawn_refs: []
  },
  {
    id: 'gardevoir', dex_no: 109, name_ar: 'جارديفوار', name_en: 'Gardevoir',
    types: ['psychic', 'fairy'], tags: [],
    stats: { hp: 68, atk: 65, def: 65, spa: 125, spd: 115, spe: 80 },
    description_ar: 'تحمي مدربها بكل ما لديها، حتى لو كلفها حياتها.',
    description_en: 'It has the power to predict the future. There is a strong bond between it and its Trainer.',
    evolutions: [], images: img(282), learnset: [], spawn_refs: []
  },
  {
    id: 'gallade', dex_no: 110, name_ar: 'جالاد', name_en: 'Gallade',
    types: ['psychic', 'fighting'], tags: [],
    stats: { hp: 68, atk: 125, def: 65, spa: 65, spd: 115, spe: 80 },
    description_ar: 'فارس يحمي الآخرين. سيوف ذراعيه قاطعة.',
    description_en: 'A master of courtesy and swordsmanship, it fights using extending swords on its elbows.',
    evolutions: [], images: img(475), learnset: [], spawn_refs: []
  },
  // Yanma & Yanmega
  {
    id: 'yanma', dex_no: 111, name_ar: 'يانما', name_en: 'Yanma',
    types: ['bug', 'flying'], tags: [],
    stats: { hp: 65, atk: 65, def: 45, spa: 75, spd: 45, spe: 95 },
    description_ar: 'يحرك أجنحته بسرعة فائقة ويطير في أي اتجاه.',
    description_en: 'It can see 360 degrees without moving its eyes. It is a great flyer capable of high-speed aerobatic maneuvers.',
    evolutions: [{ to_id: 'yanmega', conditions_ar: 'تعلم Ancient Power', conditions_en: 'Learn Ancient Power' }],
    images: img(193), learnset: [], spawn_refs: []
  },
  {
    id: 'yanmega', dex_no: 112, name_ar: 'يانميجا', name_en: 'Yanmega',
    types: ['bug', 'flying'], tags: [],
    stats: { hp: 86, atk: 76, def: 86, spa: 116, spd: 56, spe: 95 },
    description_ar: 'موجات صوته تسبب صداعاً للفرائس.',
    description_en: 'Its wings are capable of generating shock waves, which can damage the internal organs of foes.',
    evolutions: [], images: img(469), learnset: [], spawn_refs: []
  },
  // Hippo line already added (75-76)
  // Swinub line
  {
    id: 'swinub', dex_no: 113, name_ar: 'سواينوب', name_en: 'Swinub',
    types: ['ice', 'ground'], tags: [],
    stats: { hp: 50, atk: 50, def: 40, spa: 30, spd: 30, spe: 50 },
    description_ar: 'أنفه حساس جداً. يبحث عن الطعام تحت الثلج.',
    description_en: 'It uses the tip of its nose to dig for food. Its nose is so tough that even frozen ground poses no problem.',
    evolutions: [{ to_id: 'piloswine', conditions_ar: 'المستوى 33', conditions_en: 'Level 33' }],
    images: img(220), learnset: [], spawn_refs: []
  },
  {
    id: 'piloswine', dex_no: 114, name_ar: 'بايلوسواين', name_en: 'Piloswine',
    types: ['ice', 'ground'], tags: [],
    stats: { hp: 100, atk: 100, def: 80, spa: 60, spd: 60, spe: 50 },
    description_ar: 'فروه يغطي عينيه. يستخدم أنفه للتوجيه.',
    description_en: 'Because the hair all over its body obscures its sight, it just keeps charging repeatedly.',
    evolutions: [{ to_id: 'mamoswine', conditions_ar: 'تعلم Ancient Power', conditions_en: 'Learn Ancient Power' }],
    images: img(221), learnset: [], spawn_refs: []
  },
  {
    id: 'mamoswine', dex_no: 115, name_ar: 'ماموسواين', name_en: 'Mamoswine',
    types: ['ice', 'ground'], tags: [],
    stats: { hp: 110, atk: 130, def: 80, spa: 70, spd: 60, spe: 80 },
    description_ar: 'قوته هائلة. يعود لعصر ما قبل التاريخ.',
    description_en: 'It looks strong, and that strength is real. Its twin tusks are so hard they can shatter ice.',
    evolutions: [], images: img(473), learnset: [], spawn_refs: []
  },
  // Bergmite & Avalugg & Hisuian Avalugg
  {
    id: 'bergmite', dex_no: 116, name_ar: 'بيرجمايت', name_en: 'Bergmite',
    types: ['ice'], tags: [],
    stats: { hp: 55, atk: 69, def: 85, spa: 32, spd: 35, spe: 28 },
    description_ar: 'جسمه مغطى بجليد صلب كالفولاذ.',
    description_en: 'It blocks opponents\' attacks with the ice that shields its body. It uses cold air to repair any damage.',
    evolutions: [{ to_id: 'hisuian-avalugg', conditions_ar: 'المستوى 37', conditions_en: 'Level 37' }],
    images: img(712), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-avalugg', dex_no: 117, name_ar: 'أفالوج الهيسوي', name_en: 'Hisuian Avalugg',
    types: ['ice', 'rock'], tags: ['hisuian', 'noble'],
    stats: { hp: 95, atk: 127, def: 184, spa: 34, spd: 36, spe: 38 },
    description_ar: 'فكه الصخري قادر على سحق أي شيء. نسخة نوبل قوية جداً.',
    description_en: 'The armor of ice covering its lower jaw puts steel to shame and can shatter rocks.',
    evolutions: [], images: img(713, 10234), learnset: [], spawn_refs: []
  },
  // Snorunt line & Froslass
  {
    id: 'snorunt', dex_no: 118, name_ar: 'سنورانت', name_en: 'Snorunt',
    types: ['ice'], tags: [],
    stats: { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 },
    description_ar: 'يظهر للمنازل في ليالي الثلج ويجلب الحظ.',
    description_en: 'It is said that a home visited by this Pokémon will prosper. It bounces happily in cold places.',
    evolutions: [
      { to_id: 'glalie', conditions_ar: 'المستوى 42', conditions_en: 'Level 42' },
      { to_id: 'froslass', conditions_ar: 'حجر الفجر (أنثى)', conditions_en: 'Dawn Stone (Female)' }
    ],
    images: img(361), learnset: [], spawn_refs: []
  },
  {
    id: 'glalie', dex_no: 119, name_ar: 'جلالي', name_en: 'Glalie',
    types: ['ice'], tags: [],
    stats: { hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 80 },
    description_ar: 'يجمد الفريسة ثم يأكلها ببطء.',
    description_en: 'It has a body of ice that won\'t melt, even with fire. It can instantly freeze moisture in the air.',
    evolutions: [], images: img(362), learnset: [], spawn_refs: []
  },
  {
    id: 'froslass', dex_no: 120, name_ar: 'فروسلاس', name_en: 'Froslass',
    types: ['ice', 'ghost'], tags: [],
    stats: { hp: 70, atk: 80, def: 70, spa: 80, spd: 70, spe: 110 },
    description_ar: 'يُقال إنها روح امرأة ضاعت في الجبال الثلجية.',
    description_en: 'Legends say that on cold nights, it freezes hikers and keeps their frozen bodies.',
    evolutions: [], images: img(478), learnset: [], spawn_refs: []
  },
  // Sneasel & Weavile & Sneasler
  {
    id: 'sneasel', dex_no: 121, name_ar: 'سنيزل', name_en: 'Sneasel',
    types: ['dark', 'ice'], tags: [],
    stats: { hp: 55, atk: 95, def: 55, spa: 35, spd: 75, spe: 115 },
    description_ar: 'يهاجم ليلاً. مخالبه تخرج عند الصيد.',
    description_en: 'It attacks prey by suddenly extending its hidden claws. Its speed and ferocity are unmatched.',
    evolutions: [{ to_id: 'weavile', conditions_ar: 'Razor Claw (ليل)', conditions_en: 'Razor Claw (Night)' }],
    images: img(215), learnset: [], spawn_refs: []
  },
  {
    id: 'weavile', dex_no: 122, name_ar: 'ويفايل', name_en: 'Weavile',
    types: ['dark', 'ice'], tags: [],
    stats: { hp: 70, atk: 120, def: 65, spa: 45, spd: 85, spe: 125 },
    description_ar: 'يصطاد في مجموعات منسقة. يتواصل بعلامات.',
    description_en: 'They travel in groups of four or five, leaving scratches on trees to communicate with other Weavile.',
    evolutions: [], images: img(461), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-sneasel', dex_no: 123, name_ar: 'سنيزل الهيسوي', name_en: 'Hisuian Sneasel',
    types: ['fighting', 'poison'], tags: ['hisuian'],
    stats: { hp: 55, atk: 95, def: 55, spa: 35, spd: 75, spe: 115 },
    description_ar: 'يتسلق الجبال بمخالبه السامة.',
    description_en: 'Its sturdy, curved claws allow it to scale vertical cliffs and inject its toxin into prey.',
    evolutions: [{ to_id: 'sneasler', conditions_ar: 'Razor Claw (نهار)', conditions_en: 'Razor Claw (Day)' }],
    images: img(215, 10232), learnset: [], spawn_refs: []
  },
  {
    id: 'sneasler', dex_no: 124, name_ar: 'سنيزلر', name_en: 'Sneasler',
    types: ['fighting', 'poison'], tags: ['hisuian', 'noble'],
    stats: { hp: 80, atk: 130, def: 60, spa: 40, spd: 80, spe: 120 },
    description_ar: 'يتسلق أي سطح بسهولة. سمه قوي جداً.',
    description_en: 'Because of its propensity to climb, it\'s often used for mountain ascents by Trainers.',
    evolutions: [], images: img(903), learnset: [], spawn_refs: []
  },
  // Teddiursa, Ursaring, Ursaluna
  {
    id: 'teddiursa', dex_no: 125, name_ar: 'تيديأرسا', name_en: 'Teddiursa',
    types: ['normal'], tags: [],
    stats: { hp: 60, atk: 80, def: 50, spa: 50, spd: 50, spe: 40 },
    description_ar: 'يلعق كفيه المغطاة بالعسل طوال الوقت.',
    description_en: 'If it finds honey, its crescent mark glows. It always licks its paws because they\'re soaked with honey.',
    evolutions: [{ to_id: 'ursaring', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' }],
    images: img(216), learnset: [], spawn_refs: []
  },
  {
    id: 'ursaring', dex_no: 126, name_ar: 'أرسارينج', name_en: 'Ursaring',
    types: ['normal'], tags: [],
    stats: { hp: 90, atk: 130, def: 75, spa: 75, spd: 75, spe: 55 },
    description_ar: 'يعثر على الطعام المدفون بسهولة بحاسة شمه.',
    description_en: 'Although it has a large body, it is quite skilled at climbing trees. It eats and sleeps in trees.',
    evolutions: [{ to_id: 'ursaluna', conditions_ar: 'Peat Block (قمر مكتمل)', conditions_en: 'Peat Block (Full Moon)' }],
    images: img(217), learnset: [], spawn_refs: []
  },
  {
    id: 'ursaluna', dex_no: 127, name_ar: 'أرسالونا', name_en: 'Ursaluna',
    types: ['ground', 'normal'], tags: ['hisuian'],
    stats: { hp: 130, atk: 140, def: 105, spa: 45, spd: 80, spe: 50 },
    description_ar: 'يحفر الأرض بحثاً عن الطعام. قوته هائلة.',
    description_en: 'Swampy terrain gives Ursaluna its sturdy, bulky body and large, immovable base.',
    evolutions: [], images: img(901), learnset: [], spawn_refs: []
  },
  // Goomy line
  {
    id: 'goomy', dex_no: 128, name_ar: 'جومي', name_en: 'Goomy',
    types: ['dragon'], tags: [],
    stats: { hp: 45, atk: 50, def: 35, spa: 55, spd: 75, spe: 40 },
    description_ar: 'أضعف بوكيمون تنين. جسمه لزج.',
    description_en: 'The weakest Dragon-type Pokémon, it lives in damp, shady places.',
    evolutions: [{ to_id: 'hisuian-sliggoo', conditions_ar: 'المستوى 40 (مطر)', conditions_en: 'Level 40 (Rain)' }],
    images: img(704), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-sliggoo', dex_no: 129, name_ar: 'سليجو الهيسوي', name_en: 'Hisuian Sliggoo',
    types: ['dragon', 'steel'], tags: ['hisuian'],
    stats: { hp: 58, atk: 75, def: 83, spa: 83, spd: 113, spe: 40 },
    description_ar: 'صدفته الفولاذية تحميه لكنها تبطئ حركته.',
    description_en: 'A shell of liquid metal covers its body. When attacked, it contracts its body to hide within.',
    evolutions: [{ to_id: 'hisuian-goodra', conditions_ar: 'المستوى 50 (مطر)', conditions_en: 'Level 50 (Rain)' }],
    images: img(705, 10235), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-goodra', dex_no: 130, name_ar: 'جودرا الهيسوي', name_en: 'Hisuian Goodra',
    types: ['dragon', 'steel'], tags: ['hisuian'],
    stats: { hp: 80, atk: 100, def: 100, spa: 110, spd: 150, spe: 60 },
    description_ar: 'يعانق الأشياء التي يحبها بقوة، حتى تتحطم أحياناً.',
    description_en: 'This Pokémon lives in caves. It will hug anything it likes, and its snail-like shell is sticky.',
    evolutions: [], images: img(706, 10236), learnset: [], spawn_refs: []
  },
  // Onix & Steelix
  {
    id: 'onix', dex_no: 131, name_ar: 'أونيكس', name_en: 'Onix',
    types: ['rock', 'ground'], tags: [],
    stats: { hp: 35, atk: 45, def: 160, spa: 30, spd: 45, spe: 70 },
    description_ar: 'يحفر الأرض بسرعة 80 كم/ساعة باحثاً عن الطعام.',
    description_en: 'It usually lives underground. It searches for food while boring through the ground.',
    evolutions: [{ to_id: 'steelix', conditions_ar: 'معطف معدني', conditions_en: 'Metal Coat' }],
    images: img(95), learnset: [], spawn_refs: []
  },
  {
    id: 'steelix', dex_no: 132, name_ar: 'ستيليكس', name_en: 'Steelix',
    types: ['steel', 'ground'], tags: [],
    stats: { hp: 75, atk: 85, def: 200, spa: 55, spd: 65, spe: 30 },
    description_ar: 'جسمه أصلب من الألماس. يعيش في أعماق الأرض.',
    description_en: 'It is thought its body transformed as a result of iron accumulating internally from swallowing soil.',
    evolutions: [], images: img(208), learnset: [], spawn_refs: []
  },
  // Rhyhorn line
  {
    id: 'rhyhorn', dex_no: 133, name_ar: 'رايهورن', name_en: 'Rhyhorn',
    types: ['ground', 'rock'], tags: [],
    stats: { hp: 80, atk: 85, def: 95, spa: 30, spd: 30, spe: 25 },
    description_ar: 'يهاجم بالصدم. ذاكرته ضعيفة.',
    description_en: 'Its brain is very small. It is so dumb that it can\'t remember why it started charging.',
    evolutions: [{ to_id: 'rhydon', conditions_ar: 'المستوى 42', conditions_en: 'Level 42' }],
    images: img(111), learnset: [], spawn_refs: []
  },
  {
    id: 'rhydon', dex_no: 134, name_ar: 'رايدون', name_en: 'Rhydon',
    types: ['ground', 'rock'], tags: [],
    stats: { hp: 105, atk: 130, def: 120, spa: 45, spd: 45, spe: 40 },
    description_ar: 'قرنه يحفر الألماس. جلده يقاوم الحمم.',
    description_en: 'It begins walking on its hind legs after evolution. It can punch holes through boulders.',
    evolutions: [{ to_id: 'rhyperior', conditions_ar: 'Protector', conditions_en: 'Protector' }],
    images: img(112), learnset: [], spawn_refs: []
  },
  {
    id: 'rhyperior', dex_no: 135, name_ar: 'رايبيريور', name_en: 'Rhyperior',
    types: ['ground', 'rock'], tags: [],
    stats: { hp: 115, atk: 140, def: 130, spa: 55, spd: 55, spe: 40 },
    description_ar: 'يطلق صخوراً من كفيه كالقذائف.',
    description_en: 'It can launch a rock held in its hand like a missile by swinging its arm.',
    evolutions: [], images: img(464), learnset: [], spawn_refs: []
  },
  // Bonsly & Sudowoodo
  {
    id: 'bonsly', dex_no: 136, name_ar: 'بونسلي', name_en: 'Bonsly',
    types: ['rock'], tags: [],
    stats: { hp: 50, atk: 80, def: 95, spa: 10, spd: 45, spe: 10 },
    description_ar: 'يتظاهر بأنه نبات ليتجنب الخطر.',
    description_en: 'It looks like it is crying, but the fluid is moisture it expels to adjust its body\'s fluid levels.',
    evolutions: [{ to_id: 'sudowoodo', conditions_ar: 'تعلم Mimic', conditions_en: 'Learn Mimic' }],
    images: img(438), learnset: [], spawn_refs: []
  },
  {
    id: 'sudowoodo', dex_no: 137, name_ar: 'سودوودو', name_en: 'Sudowoodo',
    types: ['rock'], tags: [],
    stats: { hp: 70, atk: 100, def: 115, spa: 30, spd: 65, spe: 30 },
    description_ar: 'يتنكر كشجرة. يكره الماء.',
    description_en: 'Although it pretends to be a tree, its body is more like stone or rock than like plant life.',
    evolutions: [], images: img(185), learnset: [], spawn_refs: []
  },
  // Chingling & Chimecho
  {
    id: 'chingling', dex_no: 138, name_ar: 'تشينجلينج', name_en: 'Chingling',
    types: ['psychic'], tags: [],
    stats: { hp: 45, atk: 30, def: 50, spa: 65, spd: 50, spe: 45 },
    description_ar: 'يصدر صوت جرس عند القفز.',
    description_en: 'There is an orb inside its mouth. When it hops, the orb bounces all over and makes a ringing sound.',
    evolutions: [{ to_id: 'chimecho', conditions_ar: 'صداقة عالية (ليل)', conditions_en: 'High Friendship (Night)' }],
    images: img(433), learnset: [], spawn_refs: []
  },
  {
    id: 'chimecho', dex_no: 139, name_ar: 'تشيميكو', name_en: 'Chimecho',
    types: ['psychic'], tags: [],
    stats: { hp: 75, atk: 50, def: 80, spa: 95, spd: 90, spe: 65 },
    description_ar: 'ذيله الطويل يتأرجح مع الريح.',
    description_en: 'They fly about very actively when the hot season arrives. They communicate using seven cries.',
    evolutions: [], images: img(358), learnset: [], spawn_refs: []
  },
  // Cleffa line
  {
    id: 'cleffa', dex_no: 140, name_ar: 'كليفا', name_en: 'Cleffa',
    types: ['fairy'], tags: [],
    stats: { hp: 50, atk: 25, def: 28, spa: 45, spd: 55, spe: 15 },
    description_ar: 'يُقال إنها تسقط من السماء في ليالي النجوم.',
    description_en: 'It is often seen when shooting stars fill the night skies. It\'s said to arrive riding on a shooting star.',
    evolutions: [{ to_id: 'clefairy', conditions_ar: 'صداقة عالية', conditions_en: 'High Friendship' }],
    images: img(173), learnset: [], spawn_refs: []
  },
  {
    id: 'clefairy', dex_no: 141, name_ar: 'كليفيري', name_en: 'Clefairy',
    types: ['fairy'], tags: [],
    stats: { hp: 70, atk: 45, def: 48, spa: 60, spd: 65, spe: 35 },
    description_ar: 'ترقص تحت ضوء القمر المكتمل.',
    description_en: 'Its adorable behavior and appearance make it popular with everyone, men, women, and children alike.',
    evolutions: [{ to_id: 'clefable', conditions_ar: 'حجر القمر', conditions_en: 'Moon Stone' }],
    images: img(35), learnset: [], spawn_refs: []
  },
  {
    id: 'clefable', dex_no: 142, name_ar: 'كليفابل', name_en: 'Clefable',
    types: ['fairy'], tags: [],
    stats: { hp: 95, atk: 70, def: 73, spa: 95, spd: 90, spe: 60 },
    description_ar: 'نادرة جداً. تختبئ عند رؤية الناس.',
    description_en: 'They don\'t like to be seen, so they\'re rarely spotted. But once they trust someone, they become friendly.',
    evolutions: [], images: img(36), learnset: [], spawn_refs: []
  },
  // Snover & Abomasnow
  {
    id: 'snover', dex_no: 143, name_ar: 'سنوفر', name_en: 'Snover',
    types: ['grass', 'ice'], tags: [],
    stats: { hp: 60, atk: 62, def: 50, spa: 62, spd: 60, spe: 40 },
    description_ar: 'يعيش في قمم الجبال الثلجية.',
    description_en: 'It lives on snowy mountains. It sinks its legs into the snow to absorb water and nutrients.',
    evolutions: [{ to_id: 'abomasnow', conditions_ar: 'المستوى 40', conditions_en: 'Level 40' }],
    images: img(459), learnset: [], spawn_refs: []
  },
  {
    id: 'abomasnow', dex_no: 144, name_ar: 'أبوماسنو', name_en: 'Abomasnow',
    types: ['grass', 'ice'], tags: [],
    stats: { hp: 90, atk: 92, def: 75, spa: 92, spd: 85, spe: 60 },
    description_ar: 'يسبب عواصف ثلجية. يحمي قطعانه.',
    description_en: 'It whips up blizzards in mountains that are always covered with snow. It is the abominable snowman.',
    evolutions: [], images: img(460), learnset: [], spawn_refs: []
  },
  // Zorua & Zoroark (Hisuian)
  {
    id: 'hisuian-zorua', dex_no: 145, name_ar: 'زوروا الهيسوي', name_en: 'Hisuian Zorua',
    types: ['normal', 'ghost'], tags: ['hisuian'],
    stats: { hp: 35, atk: 60, def: 40, spa: 85, spd: 40, spe: 70 },
    description_ar: 'روح زوروا الذي مات من البرد في هيسوي.',
    description_en: 'A Zorua that died in ancient Hisui and came back as a ghost, fueled by malice.',
    evolutions: [{ to_id: 'hisuian-zoroark', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' }],
    images: img(570, 10237), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-zoroark', dex_no: 146, name_ar: 'زورورك الهيسوي', name_en: 'Hisuian Zoroark',
    types: ['normal', 'ghost'], tags: ['hisuian'],
    stats: { hp: 55, atk: 100, def: 60, spa: 125, spd: 60, spe: 110 },
    description_ar: 'أوهامه مخيفة جداً. يحمي صغاره بضراوة.',
    description_en: 'Its terrifying illusions are projected by spite energy. It protects its young, even after death.',
    evolutions: [], images: img(571, 10238), learnset: [], spawn_refs: []
  },
  // Rufflet & Hisuian Braviary
  {
    id: 'rufflet', dex_no: 147, name_ar: 'رافليت', name_en: 'Rufflet',
    types: ['normal', 'flying'], tags: [],
    stats: { hp: 70, atk: 83, def: 50, spa: 37, spd: 50, spe: 60 },
    description_ar: 'يتحدى أعداء أكبر منه بشجاعة.',
    description_en: 'With its sharp claws, this Pokémon catches prey. It doesn\'t fear any foe, no matter how strong.',
    evolutions: [{ to_id: 'hisuian-braviary', conditions_ar: 'المستوى 54', conditions_en: 'Level 54' }],
    images: img(627), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-braviary', dex_no: 148, name_ar: 'بريفياري الهيسوي', name_en: 'Hisuian Braviary',
    types: ['psychic', 'flying'], tags: ['hisuian'],
    stats: { hp: 110, atk: 83, def: 70, spa: 112, spd: 70, spe: 65 },
    description_ar: 'يطير بقوى نفسية. صرخاته تصم الآذان.',
    description_en: 'It uses its psychic power to generate shock waves that paralyze foes.',
    evolutions: [], images: img(628, 10239), learnset: [], spawn_refs: []
  },
  // Petilil & Hisuian Lilligant
  {
    id: 'petilil', dex_no: 149, name_ar: 'بيتيليل', name_en: 'Petilil',
    types: ['grass'], tags: [],
    stats: { hp: 45, atk: 35, def: 50, spa: 70, spd: 50, spe: 30 },
    description_ar: 'أوراقها مريحة عند مضغها.',
    description_en: 'The leaves on its head are very bitter. Eating one of these leaves is known to refresh a tired body.',
    evolutions: [{ to_id: 'hisuian-lilligant', conditions_ar: 'حجر الشمس', conditions_en: 'Sun Stone' }],
    images: img(548), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-lilligant', dex_no: 150, name_ar: 'ليليجانت الهيسوي', name_en: 'Hisuian Lilligant',
    types: ['grass', 'fighting'], tags: ['hisuian', 'noble'],
    stats: { hp: 70, atk: 105, def: 75, spa: 50, spd: 75, spe: 105 },
    description_ar: 'راقصة رشيقة بأرجل قوية.',
    description_en: 'Its well-developed legs are strong. It can leap great distances with a single bound.',
    evolutions: [], images: img(549, 10240), learnset: [], spawn_refs: []
  },
  // Basculin & Basculegion
  {
    id: 'basculin', dex_no: 151, name_ar: 'باسكولين', name_en: 'Basculin',
    types: ['water'], tags: [],
    stats: { hp: 70, atk: 92, def: 65, spa: 80, spd: 55, spe: 98 },
    description_ar: 'أسماك عدوانية تتقاتل بين الأحمر والأزرق.',
    description_en: 'In the Hisui region, Basculin with white stripes travel upstream to spawn.',
    evolutions: [{ to_id: 'basculegion', conditions_ar: '294 ضرر Recoil', conditions_en: '294 Recoil Damage' }],
    images: img(550), learnset: [], spawn_refs: []
  },
  {
    id: 'basculegion', dex_no: 152, name_ar: 'باسكوليجون', name_en: 'Basculegion',
    types: ['water', 'ghost'], tags: ['hisuian'],
    stats: { hp: 120, atk: 112, def: 65, spa: 80, spd: 75, spe: 78 },
    description_ar: 'يحمل أرواح رفاقه الذين لم ينجوا من الرحلة.',
    description_en: 'Clinging to Basculegion\'s body are the souls of other Basculin that perished during the journey.',
    evolutions: [], images: img(902), learnset: [], spawn_refs: []
  },
  // Vulpix & Ninetales
  {
    id: 'vulpix', dex_no: 153, name_ar: 'فولبكس', name_en: 'Vulpix',
    types: ['fire'], tags: [],
    stats: { hp: 38, atk: 41, def: 40, spa: 50, spd: 65, spe: 65 },
    description_ar: 'تولد بذيل واحد ينقسم مع النمو.',
    description_en: 'It is often seen with six tails at birth. As it grows, its tails split from their tips.',
    evolutions: [{ to_id: 'ninetales', conditions_ar: 'حجر النار', conditions_en: 'Fire Stone' }],
    images: img(37), learnset: [], spawn_refs: []
  },
  {
    id: 'ninetales', dex_no: 154, name_ar: 'ناينتيلز', name_en: 'Ninetales',
    types: ['fire'], tags: [],
    stats: { hp: 73, atk: 76, def: 75, spa: 81, spd: 100, spe: 100 },
    description_ar: 'ذيولها التسعة تحمل قوى خارقة.',
    description_en: 'It is said to live for 1,000 years. Each of its tails is loaded with supernatural powers.',
    evolutions: [], images: img(38), learnset: [], spawn_refs: []
  },
  // Tentacool & Tentacruel
  {
    id: 'tentacool', dex_no: 155, name_ar: 'تنتاكول', name_en: 'Tentacool',
    types: ['water', 'poison'], tags: [],
    stats: { hp: 40, atk: 40, def: 35, spa: 50, spd: 100, spe: 70 },
    description_ar: 'جسمه 99% ماء. لسعته مؤلمة.',
    description_en: 'Its body is virtually composed of water. It ensnares its foe with its two long tentacles.',
    evolutions: [{ to_id: 'tentacruel', conditions_ar: 'المستوى 30', conditions_en: 'Level 30' }],
    images: img(72), learnset: [], spawn_refs: []
  },
  {
    id: 'tentacruel', dex_no: 156, name_ar: 'تنتاكرويل', name_en: 'Tentacruel',
    types: ['water', 'poison'], tags: [],
    stats: { hp: 80, atk: 70, def: 65, spa: 80, spd: 120, spe: 100 },
    description_ar: '80 مجساً سامة تصطاد الفريسة.',
    description_en: 'Its 80 tentacles can stretch and contract freely. They wrap around its prey and weaken it with poison.',
    evolutions: [], images: img(73), learnset: [], spawn_refs: []
  },
  // Finneon & Lumineon
  {
    id: 'finneon', dex_no: 157, name_ar: 'فينيون', name_en: 'Finneon',
    types: ['water'], tags: [],
    stats: { hp: 49, atk: 49, def: 56, spa: 49, spd: 61, spe: 66 },
    description_ar: 'يسبح في أسراب كبيرة. زعانفه تتوهج.',
    description_en: 'It lures in prey with its shining tail fins. It stays near the surface during the day.',
    evolutions: [{ to_id: 'lumineon', conditions_ar: 'المستوى 31', conditions_en: 'Level 31' }],
    images: img(456), learnset: [], spawn_refs: []
  },
  {
    id: 'lumineon', dex_no: 158, name_ar: 'لومينيون', name_en: 'Lumineon',
    types: ['water'], tags: [],
    stats: { hp: 69, atk: 69, def: 76, spa: 69, spd: 86, spe: 91 },
    description_ar: 'زعانفه المتلألئة جميلة في الظلام.',
    description_en: 'It crawls along the seafloor using its long front fins like legs. It competes for food with Lanturn.',
    evolutions: [], images: img(457), learnset: [], spawn_refs: []
  },
  // Mantyke & Mantine
  {
    id: 'mantyke', dex_no: 159, name_ar: 'مانتايك', name_en: 'Mantyke',
    types: ['water', 'flying'], tags: [],
    stats: { hp: 45, atk: 20, def: 50, spa: 60, spd: 120, spe: 50 },
    description_ar: 'ودود جداً. يتبع السفن أحياناً.',
    description_en: 'Swimming along with a school of Remoraid seems to increase its speed and strength.',
    evolutions: [{ to_id: 'mantine', conditions_ar: 'مع Remoraid', conditions_en: 'With Remoraid in Party' }],
    images: img(458), learnset: [], spawn_refs: []
  },
  {
    id: 'mantine', dex_no: 160, name_ar: 'مانتاين', name_en: 'Mantine',
    types: ['water', 'flying'], tags: [],
    stats: { hp: 85, atk: 40, def: 70, spa: 80, spd: 140, spe: 70 },
    description_ar: 'يطير فوق الأمواج برشاقة.',
    description_en: 'Swimming freely in open seas, it may fly out of the water and over the waves if it builds up enough speed.',
    evolutions: [], images: img(226), learnset: [], spawn_refs: []
  },
  // Octillery & Remoraid
  {
    id: 'remoraid', dex_no: 161, name_ar: 'ريموريد', name_en: 'Remoraid',
    types: ['water'], tags: [],
    stats: { hp: 35, atk: 65, def: 35, spa: 65, spd: 35, spe: 65 },
    description_ar: 'يطلق ماءً بضغط عالٍ.',
    description_en: 'It has superb accuracy. The water it shoots out can strike even moving prey from more than 300 feet away.',
    evolutions: [{ to_id: 'octillery', conditions_ar: 'المستوى 25', conditions_en: 'Level 25' }],
    images: img(223), learnset: [], spawn_refs: []
  },
  {
    id: 'octillery', dex_no: 162, name_ar: 'أوكتيليري', name_en: 'Octillery',
    types: ['water'], tags: [],
    stats: { hp: 75, atk: 105, def: 75, spa: 105, spd: 75, spe: 45 },
    description_ar: 'يطلق حبراً ومقذوفات صخرية.',
    description_en: 'It locks onto foes with its leg suckers, then rams them with its rock-hard head.',
    evolutions: [], images: img(224), learnset: [], spawn_refs: []
  },
  // Skorupi & Drapion
  {
    id: 'skorupi', dex_no: 163, name_ar: 'سكوربي', name_en: 'Skorupi',
    types: ['poison', 'bug'], tags: [],
    stats: { hp: 40, atk: 50, def: 90, spa: 30, spd: 55, spe: 65 },
    description_ar: 'يختبئ في الرمال وينتظر الفريسة.',
    description_en: 'It grips prey with its tail claws and injects poison. It tenaciously hangs on until the poison takes.',
    evolutions: [{ to_id: 'drapion', conditions_ar: 'المستوى 40', conditions_en: 'Level 40' }],
    images: img(451), learnset: [], spawn_refs: []
  },
  {
    id: 'drapion', dex_no: 164, name_ar: 'درابيون', name_en: 'Drapion',
    types: ['poison', 'dark'], tags: [],
    stats: { hp: 70, atk: 90, def: 110, spa: 60, spd: 75, spe: 95 },
    description_ar: 'مخالبه تسحق السيارات. سمه قاتل.',
    description_en: 'Its body is encased in a sturdy shell. Its head rotates 180 degrees, eliminating blind spots.',
    evolutions: [], images: img(452), learnset: [], spawn_refs: []
  },
  // Hisuian Growlithe & Arcanine
  {
    id: 'hisuian-growlithe', dex_no: 165, name_ar: 'جراوليث الهيسوي', name_en: 'Hisuian Growlithe',
    types: ['fire', 'rock'], tags: ['hisuian'],
    stats: { hp: 60, atk: 75, def: 45, spa: 65, spd: 50, spe: 55 },
    description_ar: 'فروه الصخري يحميه. مخلص جداً.',
    description_en: 'Its thick protective fur allows it to run across rocky terrain. It guards its territory vigilantly.',
    evolutions: [{ to_id: 'hisuian-arcanine', conditions_ar: 'حجر النار', conditions_en: 'Fire Stone' }],
    images: img(58, 10241), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-arcanine', dex_no: 166, name_ar: 'أركناين الهيسوي', name_en: 'Hisuian Arcanine',
    types: ['fire', 'rock'], tags: ['hisuian', 'noble'],
    stats: { hp: 95, atk: 115, def: 80, spa: 95, spd: 80, spe: 90 },
    description_ar: 'يعتبره الهيسويون حامياً مقدساً.',
    description_en: 'Snaps at everything, even its allies. Has been worshiped since the ancient past in Hisui.',
    evolutions: [], images: img(59, 10242), learnset: [], spawn_refs: []
  },
  // Glameow & Purugly
  {
    id: 'glameow', dex_no: 167, name_ar: 'جلاميو', name_en: 'Glameow',
    types: ['normal'], tags: [],
    stats: { hp: 49, atk: 55, def: 42, spa: 42, spd: 37, spe: 85 },
    description_ar: 'مزاجية. ذيلها يتموج عند السعادة.',
    description_en: 'When it\'s happy, Glameow demonstrates beautiful movements of its tail, like a dancing ribbon.',
    evolutions: [{ to_id: 'purugly', conditions_ar: 'المستوى 38', conditions_en: 'Level 38' }],
    images: img(431), learnset: [], spawn_refs: []
  },
  {
    id: 'purugly', dex_no: 168, name_ar: 'بوروجلي', name_en: 'Purugly',
    types: ['normal'], tags: [],
    stats: { hp: 71, atk: 82, def: 64, spa: 64, spd: 59, spe: 112 },
    description_ar: 'تحاول أن تبدو أكبر بشد خصرها.',
    description_en: 'It is a brazen brute that barges its way into another Pokémon\'s nest and makes itself at home.',
    evolutions: [], images: img(432), learnset: [], spawn_refs: []
  },
  // Machop line
  {
    id: 'machop', dex_no: 169, name_ar: 'ماتشوب', name_en: 'Machop',
    types: ['fighting'], tags: [],
    stats: { hp: 70, atk: 80, def: 50, spa: 35, spd: 35, spe: 35 },
    description_ar: 'عضلاته لا تتعب أبداً.',
    description_en: 'Its whole body is composed of muscles. Even though it\'s small, it can pick up and throw 100 adults.',
    evolutions: [{ to_id: 'machoke', conditions_ar: 'المستوى 28', conditions_en: 'Level 28' }],
    images: img(66), learnset: [], spawn_refs: []
  },
  {
    id: 'machoke', dex_no: 170, name_ar: 'ماتشوك', name_en: 'Machoke',
    types: ['fighting'], tags: [],
    stats: { hp: 80, atk: 100, def: 70, spa: 50, spd: 60, spe: 45 },
    description_ar: 'يرتدي حزاماً للتحكم في قوته.',
    description_en: 'It always wears a power-save belt since its strength is too great. But even then, it\'s powerful.',
    evolutions: [{ to_id: 'machamp', conditions_ar: 'كابل الربط', conditions_en: 'Link Cable' }],
    images: img(67), learnset: [], spawn_refs: []
  },
  {
    id: 'machamp', dex_no: 171, name_ar: 'ماتشامب', name_en: 'Machamp',
    types: ['fighting'], tags: [],
    stats: { hp: 90, atk: 130, def: 80, spa: 65, spd: 85, spe: 55 },
    description_ar: 'أربع أذرع تطلق 1000 لكمة في الثانية.',
    description_en: 'It has four arms, allowing it to throw 1,000 punches in a short span of time.',
    evolutions: [], images: img(68), learnset: [], spawn_refs: []
  },
  // Gastly line
  {
    id: 'gastly', dex_no: 172, name_ar: 'جاستلي', name_en: 'Gastly',
    types: ['ghost', 'poison'], tags: [],
    stats: { hp: 30, atk: 35, def: 30, spa: 100, spd: 35, spe: 80 },
    description_ar: 'جسمه من غاز سام. يمكنه الاختفاء.',
    description_en: 'Its body is made of gas. Despite lacking substance, it can envelope its foes and cause suffocation.',
    evolutions: [{ to_id: 'haunter', conditions_ar: 'المستوى 25', conditions_en: 'Level 25' }],
    images: img(92), learnset: [], spawn_refs: []
  },
  {
    id: 'haunter', dex_no: 173, name_ar: 'هونتر', name_en: 'Haunter',
    types: ['ghost', 'poison'], tags: [],
    stats: { hp: 45, atk: 50, def: 45, spa: 115, spd: 55, spe: 95 },
    description_ar: 'يلعق ضحاياه فتهتز أجسادهم حتى الموت.',
    description_en: 'If you get the feeling of being watched in darkness when nobody is around, Haunter is there.',
    evolutions: [{ to_id: 'gengar', conditions_ar: 'كابل الربط', conditions_en: 'Link Cable' }],
    images: img(93), learnset: [], spawn_refs: []
  },
  {
    id: 'gengar', dex_no: 174, name_ar: 'جينجار', name_en: 'Gengar',
    types: ['ghost', 'poison'], tags: [],
    stats: { hp: 60, atk: 65, def: 60, spa: 130, spd: 75, spe: 110 },
    description_ar: 'يختبئ في الظلال ويستنزف حرارة الجسم.',
    description_en: 'To steal the life of its target, it slips into the prey\'s shadow and waits for an opportunity.',
    evolutions: [], images: img(94), learnset: [], spawn_refs: []
  },
  // Spiritomb
  {
    id: 'spiritomb', dex_no: 175, name_ar: 'سبيريتومب', name_en: 'Spiritomb',
    types: ['ghost', 'dark'], tags: [],
    stats: { hp: 50, atk: 92, def: 108, spa: 92, spd: 108, spe: 35 },
    description_ar: '108 أرواح شريرة محبوسة في حجر.',
    description_en: 'Exactly 108 spirits have gathered to form this Pokémon. It\'s bound to a fissure in the Odd Keystone.',
    evolutions: [], images: img(442), learnset: [], spawn_refs: []
  },
  // Murkrow & Honchkrow
  {
    id: 'murkrow', dex_no: 176, name_ar: 'موركرو', name_en: 'Murkrow',
    types: ['dark', 'flying'], tags: [],
    stats: { hp: 60, atk: 85, def: 42, spa: 85, spd: 42, spe: 91 },
    description_ar: 'يجمع الأشياء اللامعة. يُعتبر نذير شؤم.',
    description_en: 'Feared and loathed by many, it is believed to bring misfortune to all those who see it at night.',
    evolutions: [{ to_id: 'honchkrow', conditions_ar: 'حجر الظلام', conditions_en: 'Dusk Stone' }],
    images: img(198), learnset: [], spawn_refs: []
  },
  {
    id: 'honchkrow', dex_no: 177, name_ar: 'هونشكرو', name_en: 'Honchkrow',
    types: ['dark', 'flying'], tags: [],
    stats: { hp: 100, atk: 125, def: 52, spa: 105, spd: 52, spe: 71 },
    description_ar: 'زعيم سرب موركرو. نادراً ما يتحرك بنفسه.',
    description_en: 'It makes its Murkrow followers bring it food. It idles its time away in its nest all day long.',
    evolutions: [], images: img(430), learnset: [], spawn_refs: []
  },
  // Misdreavus & Mismagius
  {
    id: 'misdreavus', dex_no: 178, name_ar: 'ميسدريفوس', name_en: 'Misdreavus',
    types: ['ghost'], tags: [],
    stats: { hp: 60, atk: 60, def: 60, spa: 85, spd: 85, spe: 85 },
    description_ar: 'تحب إخافة الناس. تتغذى على الخوف.',
    description_en: 'It loves to bite and yank people\'s hair from behind without warning, just to see their shocked reactions.',
    evolutions: [{ to_id: 'mismagius', conditions_ar: 'حجر الظلام', conditions_en: 'Dusk Stone' }],
    images: img(200), learnset: [], spawn_refs: []
  },
  {
    id: 'mismagius', dex_no: 179, name_ar: 'ميسماجيوس', name_en: 'Mismagius',
    types: ['ghost'], tags: [],
    stats: { hp: 60, atk: 60, def: 60, spa: 105, spd: 105, spe: 105 },
    description_ar: 'تعويذاتها تسبب الصداع والهلوسة.',
    description_en: 'It chants incantations. While it is very rarely casting a spell that brings happiness, it\'s usually cursing.',
    evolutions: [], images: img(429), learnset: [], spawn_refs: []
  },
  // Unown
  {
    id: 'unown', dex_no: 180, name_ar: 'أنون', name_en: 'Unown',
    types: ['psychic'], tags: [],
    stats: { hp: 48, atk: 72, def: 48, spa: 72, spd: 48, spe: 48 },
    description_ar: 'شكله يشبه الحروف القديمة.',
    description_en: 'This Pokémon is shaped like ancient writing. Although research has been conducted, no one has decoded its meaning.',
    evolutions: [], images: img(201), learnset: [], spawn_refs: []
  },
  // Spheal line
  {
    id: 'spheal', dex_no: 181, name_ar: 'سفيل', name_en: 'Spheal',
    types: ['ice', 'water'], tags: [],
    stats: { hp: 70, atk: 40, def: 50, spa: 55, spd: 50, spe: 25 },
    description_ar: 'يتدحرج للتنقل لأنه أسرع من المشي.',
    description_en: 'It rolls across ice to travel. When it becomes an adult, it takes to the open seas.',
    evolutions: [{ to_id: 'sealeo', conditions_ar: 'المستوى 32', conditions_en: 'Level 32' }],
    images: img(363), learnset: [], spawn_refs: []
  },
  {
    id: 'sealeo', dex_no: 182, name_ar: 'سيليو', name_en: 'Sealeo',
    types: ['ice', 'water'], tags: [],
    stats: { hp: 90, atk: 60, def: 70, spa: 75, spd: 70, spe: 45 },
    description_ar: 'يوازن الأشياء على أنفه لفحصها.',
    description_en: 'It has the habit of always juggling on the tip of its nose anything it sees for the first time.',
    evolutions: [{ to_id: 'walrein', conditions_ar: 'المستوى 44', conditions_en: 'Level 44' }],
    images: img(364), learnset: [], spawn_refs: []
  },
  {
    id: 'walrein', dex_no: 183, name_ar: 'والرين', name_en: 'Walrein',
    types: ['ice', 'water'], tags: [],
    stats: { hp: 110, atk: 80, def: 90, spa: 95, spd: 90, spe: 65 },
    description_ar: 'أنيابه الضخمة تحطم الجبال الجليدية.',
    description_en: 'It shatters ice with its big tusks. Its thick blubber protects it from subzero temperatures.',
    evolutions: [], images: img(365), learnset: [], spawn_refs: []
  },
  // Piplup line
  {
    id: 'piplup', dex_no: 184, name_ar: 'بيبلوب', name_en: 'Piplup',
    types: ['water'], tags: [],
    stats: { hp: 53, atk: 51, def: 53, spa: 61, spd: 56, spe: 40 },
    description_ar: 'فخور جداً. لا يقبل الطعام من المدربين بسهولة.',
    description_en: 'Because it is very proud, it hates accepting food from people. Its thick down guards it from cold.',
    evolutions: [{ to_id: 'prinplup', conditions_ar: 'المستوى 16', conditions_en: 'Level 16' }],
    images: img(393), learnset: [], spawn_refs: []
  },
  {
    id: 'prinplup', dex_no: 185, name_ar: 'برينبلوب', name_en: 'Prinplup',
    types: ['water'], tags: [],
    stats: { hp: 64, atk: 66, def: 68, spa: 81, spd: 76, spe: 50 },
    description_ar: 'يعيش وحيداً. جناحه يقطع الأشجار.',
    description_en: 'It lives alone, away from others. Apparently, every one of them believes it is the most important.',
    evolutions: [{ to_id: 'empoleon', conditions_ar: 'المستوى 36', conditions_en: 'Level 36' }],
    images: img(394), learnset: [], spawn_refs: []
  },
  {
    id: 'empoleon', dex_no: 186, name_ar: 'إمبوليون', name_en: 'Empoleon',
    types: ['water', 'steel'], tags: [],
    stats: { hp: 84, atk: 86, def: 88, spa: 111, spd: 101, spe: 60 },
    description_ar: 'أجنحته تقطع الجليد. يمكنه الغوص لمدة طويلة.',
    description_en: 'The three horns that extend from its beak attest to its power. The leader has the biggest horns.',
    evolutions: [], images: img(395), learnset: [], spawn_refs: []
  },
  // Turtwig line
  {
    id: 'turtwig', dex_no: 187, name_ar: 'تيرتويج', name_en: 'Turtwig',
    types: ['grass'], tags: [],
    stats: { hp: 55, atk: 68, def: 64, spa: 45, spd: 55, spe: 31 },
    description_ar: 'يقوم بالتمثيل الضوئي. يشرب الماء النظيف.',
    description_en: 'It undertakes photosynthesis with its body, making oxygen. The leaf on its head wilts if it is thirsty.',
    evolutions: [{ to_id: 'grotle', conditions_ar: 'المستوى 18', conditions_en: 'Level 18' }],
    images: img(387), learnset: [], spawn_refs: []
  },
  {
    id: 'grotle', dex_no: 188, name_ar: 'جروتل', name_en: 'Grotle',
    types: ['grass'], tags: [],
    stats: { hp: 75, atk: 89, def: 85, spa: 55, spd: 65, spe: 36 },
    description_ar: 'تنمو أشجار على ظهره. تأتيه بوكيمونات صغيرة.',
    description_en: 'It lives along water in forests. In the daytime, it leaves the forest to sunbathe its treed shell.',
    evolutions: [{ to_id: 'torterra', conditions_ar: 'المستوى 32', conditions_en: 'Level 32' }],
    images: img(388), learnset: [], spawn_refs: []
  },
  {
    id: 'torterra', dex_no: 189, name_ar: 'تورتيرا', name_en: 'Torterra',
    types: ['grass', 'ground'], tags: [],
    stats: { hp: 95, atk: 109, def: 105, spa: 75, spd: 85, spe: 56 },
    description_ar: 'بوكيمونات صغيرة تعيش على ظهره.',
    description_en: 'Small Pokémon occasionally gather on its unmoving back to begin building their nests.',
    evolutions: [], images: img(389), learnset: [], spawn_refs: []
  },
  // Rotom (all forms available but we list base)
  {
    id: 'rotom', dex_no: 190, name_ar: 'روتوم', name_en: 'Rotom',
    types: ['electric', 'ghost'], tags: [],
    stats: { hp: 50, atk: 50, def: 77, spa: 95, spd: 77, spe: 91 },
    description_ar: 'يدخل الأجهزة الكهربائية ويتحكم بها.',
    description_en: 'Its electric-like body can enter some kinds of machines and take control to cause mischief.',
    evolutions: [], images: img(479), learnset: [], spawn_refs: []
  },
  // Gible line
  {
    id: 'gible', dex_no: 191, name_ar: 'جيبل', name_en: 'Gible',
    types: ['dragon', 'ground'], tags: [],
    stats: { hp: 58, atk: 70, def: 45, spa: 40, spd: 45, spe: 42 },
    description_ar: 'يعيش في الكهوف الدافئة. يعض بقوة.',
    description_en: 'It nests in horizontal holes warmed by geothermal heat. It attacks when it sees an enemy.',
    evolutions: [{ to_id: 'gabite', conditions_ar: 'المستوى 24', conditions_en: 'Level 24' }],
    images: img(443), learnset: [], spawn_refs: []
  },
  {
    id: 'gabite', dex_no: 192, name_ar: 'جابايت', name_en: 'Gabite',
    types: ['dragon', 'ground'], tags: [],
    stats: { hp: 68, atk: 90, def: 65, spa: 50, spd: 55, spe: 82 },
    description_ar: 'يحفر لجمع الأحجار الكريمة.',
    description_en: 'It loves sparkly things. It seeks treasures in caves and hoards them in its nest.',
    evolutions: [{ to_id: 'garchomp', conditions_ar: 'المستوى 48', conditions_en: 'Level 48' }],
    images: img(444), learnset: [], spawn_refs: []
  },
  {
    id: 'garchomp', dex_no: 193, name_ar: 'جارتشومب', name_en: 'Garchomp',
    types: ['dragon', 'ground'], tags: [],
    stats: { hp: 108, atk: 130, def: 95, spa: 80, spd: 85, spe: 102 },
    description_ar: 'يطير بسرعة الصوت. لا يفلت منه أي فريسة.',
    description_en: 'It can fly at speeds rivaling jet planes. It attacks with its sharp fins and fangs.',
    evolutions: [], images: img(445), learnset: [], spawn_refs: []
  },
  // Riolu & Lucario
  {
    id: 'riolu', dex_no: 194, name_ar: 'ريولو', name_en: 'Riolu',
    types: ['fighting'], tags: [],
    stats: { hp: 40, atk: 70, def: 40, spa: 35, spd: 40, spe: 60 },
    description_ar: 'يستشعر الهالات ويمكنه التواصل عن بعد.',
    description_en: 'Its body is lithe yet powerful. It can sense what people are thinking from over half a mile away.',
    evolutions: [{ to_id: 'lucario', conditions_ar: 'صداقة عالية (نهار)', conditions_en: 'High Friendship (Day)' }],
    images: img(447), learnset: [], spawn_refs: []
  },
  {
    id: 'lucario', dex_no: 195, name_ar: 'لوكاريو', name_en: 'Lucario',
    types: ['fighting', 'steel'], tags: [],
    stats: { hp: 70, atk: 110, def: 70, spa: 115, spd: 70, spe: 90 },
    description_ar: 'يقرأ الأفكار ويطلق قوة الهالة.',
    description_en: 'By reading the auras of all things, it can tell how others are feeling from over half a mile away.',
    evolutions: [], images: img(448), learnset: [], spawn_refs: []
  },
  // Duskull line
  {
    id: 'duskull', dex_no: 196, name_ar: 'داسكول', name_en: 'Duskull',
    types: ['ghost'], tags: [],
    stats: { hp: 20, atk: 40, def: 90, spa: 30, spd: 90, spe: 25 },
    description_ar: 'يطارد الأطفال المشاغبين.',
    description_en: 'It doggedly pursues its prey wherever it goes. However, the Pokemon itself tires at sunrise.',
    evolutions: [{ to_id: 'dusclops', conditions_ar: 'المستوى 37', conditions_en: 'Level 37' }],
    images: img(355), learnset: [], spawn_refs: []
  },
  {
    id: 'dusclops', dex_no: 197, name_ar: 'داسكلوبس', name_en: 'Dusclops',
    types: ['ghost'], tags: [],
    stats: { hp: 40, atk: 70, def: 130, spa: 60, spd: 130, spe: 25 },
    description_ar: 'جسمه أجوف كالثقب الأسود.',
    description_en: 'Its body is hollow—not even a shred of anything exists. Its body is like a black hole.',
    evolutions: [{ to_id: 'dusknoir', conditions_ar: 'Reaper Cloth', conditions_en: 'Reaper Cloth' }],
    images: img(356), learnset: [], spawn_refs: []
  },
  {
    id: 'dusknoir', dex_no: 198, name_ar: 'داسكنوار', name_en: 'Dusknoir',
    types: ['ghost'], tags: [],
    stats: { hp: 45, atk: 100, def: 135, spa: 65, spd: 135, spe: 45 },
    description_ar: 'يتلقى أوامر من عالم الأرواح عبر هوائيه.',
    description_en: 'The antenna on its head captures radio waves from the spirit world that command it to take people there.',
    evolutions: [], images: img(477), learnset: [], spawn_refs: []
  },
  // Gligar & Gliscor
  {
    id: 'gligar', dex_no: 199, name_ar: 'جليجار', name_en: 'Gligar',
    types: ['ground', 'flying'], tags: [],
    stats: { hp: 65, atk: 75, def: 105, spa: 35, spd: 65, spe: 85 },
    description_ar: 'ينزلق من المرتفعات ويهاجم بذيله السام.',
    description_en: 'It usually clings to cliffs and flies silently through the air. It strikes from behind to attack.',
    evolutions: [{ to_id: 'gliscor', conditions_ar: 'Razor Fang (ليل)', conditions_en: 'Razor Fang (Night)' }],
    images: img(207), learnset: [], spawn_refs: []
  },
  {
    id: 'gliscor', dex_no: 200, name_ar: 'جليسكور', name_en: 'Gliscor',
    types: ['ground', 'flying'], tags: [],
    stats: { hp: 75, atk: 95, def: 125, spa: 45, spd: 75, spe: 95 },
    description_ar: 'يعلق رأساً على عقب مثل الخفاش.',
    description_en: 'If it succeeds in catching even a faint breeze properly, it can circle the globe without flapping.',
    evolutions: [], images: img(472), learnset: [], spawn_refs: []
  },
  // Nosepass & Probopass
  {
    id: 'nosepass', dex_no: 201, name_ar: 'نوزباس', name_en: 'Nosepass',
    types: ['rock'], tags: [],
    stats: { hp: 30, atk: 45, def: 135, spa: 45, spd: 90, spe: 30 },
    description_ar: 'أنفه المغناطيسي يشير للشمال دائماً.',
    description_en: 'Its nose is a magnet. It always faces north and is drawn toward magnetic fields.',
    evolutions: [{ to_id: 'probopass', conditions_ar: 'Coronet Highlands', conditions_en: 'Coronet Highlands' }],
    images: img(299), learnset: [], spawn_refs: []
  },
  {
    id: 'probopass', dex_no: 202, name_ar: 'بروبوباس', name_en: 'Probopass',
    types: ['rock', 'steel'], tags: [],
    stats: { hp: 60, atk: 55, def: 145, spa: 75, spd: 150, spe: 40 },
    description_ar: 'يتحكم في وحداته الصغيرة بالمغناطيسية.',
    description_en: 'It controls three small units called Mini-Noses using magnetic force.',
    evolutions: [], images: img(476), learnset: [], spawn_refs: []
  },
  // Voltorb & Electrode (Hisuian)
  {
    id: 'hisuian-voltorb', dex_no: 203, name_ar: 'فولتورب الهيسوي', name_en: 'Hisuian Voltorb',
    types: ['electric', 'grass'], tags: ['hisuian'],
    stats: { hp: 40, atk: 30, def: 50, spa: 55, spd: 55, spe: 100 },
    description_ar: 'يشبه كرة البوكي القديمة. ودود جداً.',
    description_en: 'Its face resembles a Poké Ball. When excited, it discharges electricity from the hole in its head.',
    evolutions: [{ to_id: 'hisuian-electrode', conditions_ar: 'حجر الورقة', conditions_en: 'Leaf Stone' }],
    images: img(100, 10243), learnset: [], spawn_refs: []
  },
  {
    id: 'hisuian-electrode', dex_no: 204, name_ar: 'إلكترود الهيسوي', name_en: 'Hisuian Electrode',
    types: ['electric', 'grass'], tags: ['hisuian', 'noble'],
    stats: { hp: 60, atk: 50, def: 70, spa: 80, spd: 80, spe: 150 },
    description_ar: 'ينفجر عند الغضب. انفجاره يشبه الألعاب النارية.',
    description_en: 'When excited, it lets off electric sparks in response, seemingly unfamiliar with human civilization.',
    evolutions: [], images: img(101, 10244), learnset: [], spawn_refs: []
  },
  // Togepi line
  {
    id: 'togepi', dex_no: 205, name_ar: 'توجيبي', name_en: 'Togepi',
    types: ['fairy'], tags: [],
    stats: { hp: 35, atk: 20, def: 65, spa: 40, spd: 65, spe: 20 },
    description_ar: 'يخزن السعادة في قشرته.',
    description_en: 'The shell seems to be filled with joy. It is said that it will share good luck when treated kindly.',
    evolutions: [{ to_id: 'togetic', conditions_ar: 'صداقة عالية', conditions_en: 'High Friendship' }],
    images: img(175), learnset: [], spawn_refs: []
  },
  {
    id: 'togetic', dex_no: 206, name_ar: 'توجيتيك', name_en: 'Togetic',
    types: ['fairy', 'flying'], tags: [],
    stats: { hp: 55, atk: 40, def: 85, spa: 80, spd: 105, spe: 40 },
    description_ar: 'يظهر للأشخاص الطيبين ويجلب السعادة.',
    description_en: 'It grows dispirited if it is not with kind people. It can float in midair without moving its wings.',
    evolutions: [{ to_id: 'togekiss', conditions_ar: 'حجر لامع', conditions_en: 'Shiny Stone' }],
    images: img(176), learnset: [], spawn_refs: []
  },
  {
    id: 'togekiss', dex_no: 207, name_ar: 'توجيكيس', name_en: 'Togekiss',
    types: ['fairy', 'flying'], tags: [],
    stats: { hp: 85, atk: 50, def: 95, spa: 120, spd: 115, spe: 80 },
    description_ar: 'يزور الأماكن السلمية ويتجنب الصراعات.',
    description_en: 'It shares many blessings with people who respect one another\'s rights and avoid needless strife.',
    evolutions: [], images: img(468), learnset: [], spawn_refs: []
  },
  // Tynamo line (only in distortion)
  {
    id: 'tynamo', dex_no: 208, name_ar: 'تاينامو', name_en: 'Tynamo',
    types: ['electric'], tags: [],
    stats: { hp: 35, atk: 55, def: 40, spa: 45, spd: 40, spe: 60 },
    description_ar: 'وحيداً ضعيف لكنه قوي في مجموعات.',
    description_en: 'One alone can emit only a trickle of electricity, so a group of them gathers to shock foes.',
    evolutions: [{ to_id: 'eelektrik', conditions_ar: 'المستوى 39', conditions_en: 'Level 39' }],
    images: img(602), learnset: [], spawn_refs: []
  },
  {
    id: 'eelektrik', dex_no: 209, name_ar: 'إيليكتريك', name_en: 'Eelektrik',
    types: ['electric'], tags: [],
    stats: { hp: 65, atk: 85, def: 70, spa: 75, spd: 70, spe: 40 },
    description_ar: 'يعانق فريسته ويصعقها.',
    description_en: 'These Pokémon have a big appetite. They attack prey by wrapping around them and zapping them.',
    evolutions: [{ to_id: 'eelektross', conditions_ar: 'حجر الرعد', conditions_en: 'Thunder Stone' }],
    images: img(603), learnset: [], spawn_refs: []
  },
  {
    id: 'eelektross', dex_no: 210, name_ar: 'إيليكتروس', name_en: 'Eelektross',
    types: ['electric'], tags: [],
    stats: { hp: 85, atk: 115, def: 80, spa: 105, spd: 80, spe: 50 },
    description_ar: 'يخرج من البحر ويسحب الفريسة للمحيط.',
    description_en: 'It crawls out of the sea using its arms. It will attack prey and instantly drag it into the ocean.',
    evolutions: [], images: img(604), learnset: [], spawn_refs: []
  },
  // Porygon line
  {
    id: 'porygon', dex_no: 211, name_ar: 'بوريجون', name_en: 'Porygon',
    types: ['normal'], tags: [],
    stats: { hp: 65, atk: 60, def: 70, spa: 85, spd: 75, spe: 40 },
    description_ar: 'بوكيمون اصطناعي بالكامل.',
    description_en: 'A man-made Pokémon created using advanced technology. It is programmed with only basic motions.',
    evolutions: [{ to_id: 'porygon2', conditions_ar: 'Upgrade', conditions_en: 'Upgrade' }],
    images: img(137), learnset: [], spawn_refs: []
  },
  {
    id: 'porygon2', dex_no: 212, name_ar: 'بوريجون2', name_en: 'Porygon2',
    types: ['normal'], tags: [],
    stats: { hp: 85, atk: 80, def: 90, spa: 105, spd: 95, spe: 60 },
    description_ar: 'نسخة محسنة بذكاء اصطناعي.',
    description_en: 'Version 2.0 was created with artificial intelligence. It can develop feelings on its own.',
    evolutions: [{ to_id: 'porygon-z', conditions_ar: 'Dubious Disc', conditions_en: 'Dubious Disc' }],
    images: img(233), learnset: [], spawn_refs: []
  },
  {
    id: 'porygon-z', dex_no: 213, name_ar: 'بوريجون-Z', name_en: 'Porygon-Z',
    types: ['normal'], tags: [],
    stats: { hp: 85, atk: 80, def: 70, spa: 135, spd: 75, spe: 90 },
    description_ar: 'برنامج إضافي سبب خللاً في سلوكه.',
    description_en: 'An additional program was installed to allow it to travel through alien dimensions, but it began behaving strangely.',
    evolutions: [], images: img(474), learnset: [], spawn_refs: []
  },
  // Qwilfish & Overqwil
  {
    id: 'hisuian-qwilfish', dex_no: 214, name_ar: 'كويلفيش الهيسوي', name_en: 'Hisuian Qwilfish',
    types: ['dark', 'poison'], tags: ['hisuian'],
    stats: { hp: 65, atk: 95, def: 85, spa: 55, spd: 55, spe: 85 },
    description_ar: 'أشواكه السامة أقوى من النسخة العادية.',
    description_en: 'Its spines have evolved to be more toxic. It is extremely territorial.',
    evolutions: [{ to_id: 'overqwil', conditions_ar: '20x Barb Barrage بأسلوب قوي', conditions_en: '20x Strong Style Barb Barrage' }],
    images: img(211, 10245), learnset: [], spawn_refs: []
  },
  {
    id: 'overqwil', dex_no: 215, name_ar: 'أوفركويل', name_en: 'Overqwil',
    types: ['dark', 'poison'], tags: ['hisuian'],
    stats: { hp: 85, atk: 115, def: 95, spa: 65, spd: 65, spe: 85 },
    description_ar: 'أشواكه الضخمة تنتج سماً مميتاً.',
    description_en: 'Its lancelike spines are so toxic that even a slight prick causes a Pokémon to faint in agony.',
    evolutions: [], images: img(904), learnset: [], spawn_refs: []
  },
  // Cresselia
  {
    id: 'cresselia', dex_no: 216, name_ar: 'كريسيليا', name_en: 'Cresselia',
    types: ['psychic'], tags: ['legendary'],
    stats: { hp: 120, atk: 70, def: 120, spa: 75, spd: 130, spe: 85 },
    description_ar: 'تمثل الهلال. ريشها يجلب أحلاماً سعيدة.',
    description_en: 'Shiny particles are released from its wings like a veil. Seeing its shining form brings good dreams.',
    evolutions: [], images: img(488), learnset: [], spawn_refs: []
  },
  // Lake Trio
  {
    id: 'uxie', dex_no: 217, name_ar: 'يوكسي', name_en: 'Uxie',
    types: ['psychic'], tags: ['legendary'],
    stats: { hp: 75, atk: 75, def: 130, spa: 75, spd: 130, spe: 95 },
    description_ar: 'كائن المعرفة. من ينظر لعينيه يفقد ذاكرته.',
    description_en: 'Known as "The Being of Knowledge." It is said that it can wipe out the memory of those who see its eyes.',
    evolutions: [], images: img(480), learnset: [], spawn_refs: []
  },
  {
    id: 'mesprit', dex_no: 218, name_ar: 'ميسبريت', name_en: 'Mesprit',
    types: ['psychic'], tags: ['legendary'],
    stats: { hp: 80, atk: 105, def: 105, spa: 105, spd: 105, spe: 80 },
    description_ar: 'كائن المشاعر. علّم البشر الحب والحزن.',
    description_en: 'Known as "The Being of Emotion." It taught humans the nobility of sorrow, pain, and joy.',
    evolutions: [], images: img(481), learnset: [], spawn_refs: []
  },
  {
    id: 'azelf', dex_no: 219, name_ar: 'أزيلف', name_en: 'Azelf',
    types: ['psychic'], tags: ['legendary'],
    stats: { hp: 75, atk: 125, def: 70, spa: 125, spd: 70, spe: 115 },
    description_ar: 'كائن الإرادة. منحها للبشر.',
    description_en: 'Known as "The Being of Willpower." It gave humans the determination to face any difficulty.',
    evolutions: [], images: img(482), learnset: [], spawn_refs: []
  },
  // Heatran
  {
    id: 'heatran', dex_no: 220, name_ar: 'هيتران', name_en: 'Heatran',
    types: ['fire', 'steel'], tags: ['legendary'],
    stats: { hp: 91, atk: 90, def: 106, spa: 130, spd: 106, spe: 77 },
    description_ar: 'يعيش في الكهوف البركانية. دمه مثل الحمم.',
    description_en: 'It dwells in volcanic caves. It digs in with its cross-shaped claws to move across rock surfaces.',
    evolutions: [], images: img(485), learnset: [], spawn_refs: []
  },
  // Regigigas
  {
    id: 'regigigas', dex_no: 221, name_ar: 'ريجيجيجاس', name_en: 'Regigigas',
    types: ['normal'], tags: ['legendary'],
    stats: { hp: 110, atk: 160, def: 110, spa: 80, spd: 110, spe: 100 },
    description_ar: 'يُقال إنه سحب القارات بالحبال.',
    description_en: 'There is an enduring legend that states this Pokémon towed continents with ropes.',
    evolutions: [], images: img(486), learnset: [], spawn_refs: []
  },
  // Creation Trio
  {
    id: 'dialga', dex_no: 222, name_ar: 'ديالجا', name_en: 'Dialga',
    types: ['steel', 'dragon'], tags: ['legendary'],
    stats: { hp: 100, atk: 120, def: 120, spa: 150, spd: 100, spe: 90 },
    description_ar: 'إله الزمن. ولادته أطلقت الزمن.',
    description_en: 'A Pokémon spoken of in legend. It is said that time began moving when Dialga was born.',
    evolutions: [], images: img(483), learnset: [], spawn_refs: []
  },
  {
    id: 'origin-dialga', dex_no: 223, name_ar: 'ديالجا الأصل', name_en: 'Origin Dialga',
    types: ['steel', 'dragon'], tags: ['legendary'],
    stats: { hp: 100, atk: 100, def: 120, spa: 150, spd: 120, spe: 90 },
    description_ar: 'شكل ديالجا الأصلي عندما يمتلك حجر آداما.',
    description_en: 'Radiant light bursts from Dialga\'s body in this form. It can distort time in infinite ways.',
    evolutions: [], images: img(483, 10249), learnset: [], spawn_refs: []
  },
  {
    id: 'palkia', dex_no: 224, name_ar: 'بالكيا', name_en: 'Palkia',
    types: ['water', 'dragon'], tags: ['legendary'],
    stats: { hp: 90, atk: 120, def: 100, spa: 150, spd: 120, spe: 100 },
    description_ar: 'إله الفضاء. يمكنه تشويه المكان.',
    description_en: 'It has the ability to distort space. It is described as a deity in Hisui mythology.',
    evolutions: [], images: img(484), learnset: [], spawn_refs: []
  },
  {
    id: 'origin-palkia', dex_no: 225, name_ar: 'بالكيا الأصل', name_en: 'Origin Palkia',
    types: ['water', 'dragon'], tags: ['legendary'],
    stats: { hp: 90, atk: 100, def: 100, spa: 150, spd: 120, spe: 120 },
    description_ar: 'شكل بالكيا الأصلي. يتحكم بالمكان بشكل كامل.',
    description_en: 'Palkia\'s body transforms when empowered by the Lustrous Globe. It can bend all of space.',
    evolutions: [], images: img(484, 10250), learnset: [], spawn_refs: []
  },
  {
    id: 'giratina', dex_no: 226, name_ar: 'جيراتينا', name_en: 'Giratina',
    types: ['ghost', 'dragon'], tags: ['legendary'],
    stats: { hp: 150, atk: 100, def: 120, spa: 100, spd: 120, spe: 90 },
    description_ar: 'نُفي لعالم آخر بسبب عنفه.',
    description_en: 'It was banished for its violence. It silently gazes upon the old world from the Distortion World.',
    evolutions: [], images: img(487), learnset: [], spawn_refs: []
  },
  // Forces of Nature
  {
    id: 'tornadus', dex_no: 227, name_ar: 'تورنادوس', name_en: 'Tornadus',
    types: ['flying'], tags: ['legendary'],
    stats: { hp: 79, atk: 115, def: 70, spa: 125, spd: 80, spe: 111 },
    description_ar: 'يسبب عواصف عملاقة.',
    description_en: 'The energy of its lower half generates huge winds. It can blow away an entire house.',
    evolutions: [], images: img(641), learnset: [], spawn_refs: []
  },
  {
    id: 'thundurus', dex_no: 228, name_ar: 'ثندروس', name_en: 'Thundurus',
    types: ['electric', 'flying'], tags: ['legendary'],
    stats: { hp: 79, atk: 115, def: 70, spa: 125, spd: 80, spe: 111 },
    description_ar: 'يسبب البرق والعواصف الرعدية.',
    description_en: 'Countless farms were destroyed by the thunderstorms it caused. It also damages Hisui\'s landscape.',
    evolutions: [], images: img(642), learnset: [], spawn_refs: []
  },
  {
    id: 'landorus', dex_no: 229, name_ar: 'لاندوروس', name_en: 'Landorus',
    types: ['ground', 'flying'], tags: ['legendary'],
    stats: { hp: 89, atk: 125, def: 90, spa: 115, spd: 80, spe: 101 },
    description_ar: 'يجعل الحقول خصبة بقوته.',
    description_en: 'It makes crops grow with nutrients in the soil. It is said to be a guardian of the farmlands.',
    evolutions: [], images: img(645), learnset: [], spawn_refs: []
  },
  {
    id: 'enamorus', dex_no: 230, name_ar: 'إناموروس', name_en: 'Enamorus',
    types: ['fairy', 'flying'], tags: ['legendary', 'hisuian'],
    stats: { hp: 74, atk: 115, def: 70, spa: 135, spd: 80, spe: 106 },
    description_ar: 'تجلب الربيع إلى هيسوي. تنشر الحب.',
    description_en: 'It heralds spring, bringing passion. The hearts of people and Pokémon fill with love at its arrival.',
    evolutions: [], images: img(905), learnset: [], spawn_refs: []
  },
  // Mythicals
  {
    id: 'darkrai', dex_no: 231, name_ar: 'داركراي', name_en: 'Darkrai',
    types: ['dark'], tags: ['mythical'],
    stats: { hp: 70, atk: 90, def: 90, spa: 135, spd: 90, spe: 125 },
    description_ar: 'يسبب كوابيس مرعبة.',
    description_en: 'It can lull people to sleep and make them dream. It is active during nights of the new moon.',
    evolutions: [], images: img(491), learnset: [], spawn_refs: []
  },
  {
    id: 'shaymin', dex_no: 232, name_ar: 'شايمين', name_en: 'Shaymin',
    types: ['grass'], tags: ['mythical'],
    stats: { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
    description_ar: 'يحول السموم إلى زهور. رمز الامتنان.',
    description_en: 'It can dissolve toxins in the air to instantly transform ruined land into a lush field of flowers.',
    evolutions: [], images: img(492), learnset: [], spawn_refs: []
  },
  {
    id: 'manaphy', dex_no: 233, name_ar: 'مانافي', name_en: 'Manaphy',
    types: ['water'], tags: ['mythical'],
    stats: { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100 },
    description_ar: 'يسبح المحيطات ويرتبط بأي بوكيمون.',
    description_en: 'Born on a cold seafloor, it will swim great distances to return to its birthplace.',
    evolutions: [], images: img(490), learnset: [], spawn_refs: []
  },
  {
    id: 'phione', dex_no: 234, name_ar: 'فيوني', name_en: 'Phione',
    types: ['water'], tags: ['mythical'],
    stats: { hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 80 },
    description_ar: 'يفقس من بيضة مانافي.',
    description_en: 'It drifts in warm seas. It always returns to where it was born to reproduce.',
    evolutions: [], images: img(489), learnset: [], spawn_refs: []
  },
  // Arceus - The God
  {
    id: 'arceus', dex_no: 235, name_ar: 'أركيوس', name_en: 'Arceus',
    types: ['normal'], tags: ['mythical'],
    stats: { hp: 120, atk: 120, def: 120, spa: 120, spd: 120, spe: 120 },
    description_ar: 'يُقال إنه خلق سينوه/هيسوي بأذرعه الألف.',
    description_en: 'It is told in mythology that this Pokémon was born before the universe even existed.',
    evolutions: [], images: img(493), learnset: [], spawn_refs: []
  },
  // Wyrdeer (New)
  {
    id: 'wyrdeer', dex_no: 236, name_ar: 'وايردير', name_en: 'Wyrdeer',
    types: ['normal', 'psychic'], tags: ['hisuian'],
    stats: { hp: 103, atk: 105, def: 72, spa: 105, spd: 75, spe: 65 },
    description_ar: 'تطور ستانتلر في هيسوي. قرونه تستشعر الروح.',
    description_en: 'The sturdy antlers on its head provide great protection. They are also used to call allies.',
    evolutions: [], images: img(899), learnset: [], spawn_refs: []
  },
  // Stantler
  {
    id: 'stantler', dex_no: 237, name_ar: 'ستانتلر', name_en: 'Stantler',
    types: ['normal'], tags: [],
    stats: { hp: 73, atk: 95, def: 62, spa: 85, spd: 65, spe: 85 },
    description_ar: 'قرونه تسبب الهلوسة.',
    description_en: 'Those who stare at its antlers will gradually lose control of their senses and be unable to stand.',
    evolutions: [{ to_id: 'wyrdeer', conditions_ar: '20x Psyshield Bash بأسلوب رشيق', conditions_en: '20x Agile Style Psyshield Bash' }],
    images: img(234), learnset: [], spawn_refs: []
  },
  // Lickitung & Lickilicky
  {
    id: 'lickitung', dex_no: 238, name_ar: 'ليكيتونج', name_en: 'Lickitung',
    types: ['normal'], tags: [],
    stats: { hp: 90, atk: 55, def: 75, spa: 60, spd: 75, spe: 30 },
    description_ar: 'لسانه أطول من جسمه. يستخدمه لكل شيء.',
    description_en: 'Its tongue can extend over two meters long. It uses its saliva to feel things out and to remember.',
    evolutions: [{ to_id: 'lickilicky', conditions_ar: 'تعلم Rollout', conditions_en: 'Learn Rollout' }],
    images: img(108), learnset: [], spawn_refs: []
  },
  {
    id: 'lickilicky', dex_no: 239, name_ar: 'ليكيليكي', name_en: 'Lickilicky',
    types: ['normal'], tags: [],
    stats: { hp: 110, atk: 85, def: 95, spa: 80, spd: 95, spe: 50 },
    description_ar: 'يلف فريسته بلسانه. لعابه مذيب.',
    description_en: 'It wraps things with its extensible tongue. Getting too close to it will leave you soaked with drool.',
    evolutions: [], images: img(463), learnset: [], spawn_refs: []
  },
  // Cherubi & Cherrim
  {
    id: 'cherubi', dex_no: 240, name_ar: 'تشيروبي', name_en: 'Cherubi',
    types: ['grass'], tags: [],
    stats: { hp: 45, atk: 35, def: 45, spa: 62, spd: 53, spe: 35 },
    description_ar: 'الكرة الصغيرة تحتوي على مغذيات.',
    description_en: 'The small ball on its head is for storing nutrients. It evolves as it matures.',
    evolutions: [{ to_id: 'cherrim', conditions_ar: 'المستوى 25', conditions_en: 'Level 25' }],
    images: img(420), learnset: [], spawn_refs: []
  },
  {
    id: 'cherrim', dex_no: 241, name_ar: 'تشيريم', name_en: 'Cherrim',
    types: ['grass'], tags: [],
    stats: { hp: 70, atk: 60, def: 70, spa: 87, spd: 78, spe: 85 },
    description_ar: 'تتفتح في الشمس المشرقة.',
    description_en: 'If it senses strong sunlight, it opens its folded petals to absorb the sun\'s rays with its whole body.',
    evolutions: [], images: img(421), learnset: [], spawn_refs: []
  },
  // Final: #242 - Total 242 Pokémon
  {
    id: 'gligar-alpha', dex_no: 242, name_ar: 'جليجار ألفا', name_en: 'Alpha Gligar',
    types: ['ground', 'flying'], tags: ['alpha'],
    stats: { hp: 65, atk: 75, def: 105, spa: 35, spd: 65, spe: 85 },
    description_ar: 'نسخة ألفا عملاقة من جليجار.',
    description_en: 'A massive Alpha version of Gligar with enhanced power.',
    evolutions: [{ to_id: 'gliscor', conditions_ar: 'Razor Fang (ليل)', conditions_en: 'Razor Fang (Night)' }],
    images: img(207), learnset: [], spawn_refs: []
  }
];

export default hisuiPokemon;

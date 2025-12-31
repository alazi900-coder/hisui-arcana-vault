// Pokémon Legends: Arceus - Complete Learnsets
// Moves learned by level-up, evolution, and tutors

import type { LearnsetEntry } from '@/types/pokemon';

// Helper to create level-up moves
const lvl = (move_id: string, level: number): LearnsetEntry => ({ move_id, method: 'level', level });
const tutor = (move_id: string): LearnsetEntry => ({ move_id, method: 'tutor' });
const evo = (move_id: string): LearnsetEntry => ({ move_id, method: 'evolution' });

export const hisuiLearnsets: Record<string, LearnsetEntry[]> = {
  // #001 - Rowlet
  'rowlet': [
    lvl('tackle', 1), lvl('leafage', 1), lvl('growl', 6), lvl('peck', 9),
    lvl('astonish', 12), lvl('razor-leaf', 15), lvl('synthesis', 18),
    tutor('aerial-ace'), tutor('energy-ball'), tutor('shadow-ball')
  ],
  
  // #002 - Dartrix
  'dartrix': [
    lvl('tackle', 1), lvl('leafage', 1), lvl('growl', 6), lvl('peck', 9),
    lvl('astonish', 12), lvl('razor-leaf', 15), lvl('synthesis', 18),
    lvl('air-cutter', 21), lvl('leaf-blade', 25), lvl('brave-bird', 33),
    tutor('aerial-ace'), tutor('energy-ball'), tutor('shadow-ball'), tutor('psychic')
  ],
  
  // #003 - Hisuian Decidueye
  'hisuian-decidueye': [
    lvl('tackle', 1), lvl('leafage', 1), lvl('peck', 1), lvl('astonish', 1),
    lvl('razor-leaf', 15), lvl('air-cutter', 21), lvl('leaf-blade', 25),
    lvl('aura-sphere', 37), lvl('triple-arrows', 1), lvl('brave-bird', 43),
    evo('triple-arrows'),
    tutor('aerial-ace'), tutor('energy-ball'), tutor('focus-blast'), tutor('close-combat')
  ],
  
  // #004 - Cyndaquil
  'cyndaquil': [
    lvl('tackle', 1), lvl('ember', 1), lvl('smokescreen', 6), lvl('quick-attack', 10),
    lvl('flame-wheel', 13), lvl('swift', 19), lvl('flamethrower', 25),
    tutor('fire-punch'), tutor('shadow-ball'), tutor('focus-blast')
  ],
  
  // #005 - Quilava
  'quilava': [
    lvl('tackle', 1), lvl('ember', 1), lvl('smokescreen', 6), lvl('quick-attack', 10),
    lvl('flame-wheel', 13), lvl('swift', 19), lvl('flamethrower', 25),
    lvl('inferno', 31), lvl('eruption', 37),
    tutor('fire-punch'), tutor('shadow-ball'), tutor('focus-blast'), tutor('wild-charge')
  ],
  
  // #006 - Hisuian Typhlosion
  'hisuian-typhlosion': [
    lvl('tackle', 1), lvl('ember', 1), lvl('smokescreen', 1), lvl('quick-attack', 1),
    lvl('flame-wheel', 13), lvl('swift', 19), lvl('flamethrower', 25),
    lvl('inferno', 31), lvl('infernal-parade', 37), lvl('eruption', 43),
    evo('infernal-parade'),
    tutor('fire-punch'), tutor('shadow-ball'), tutor('focus-blast'), tutor('hex')
  ],
  
  // #007 - Oshawott
  'oshawott': [
    lvl('tackle', 1), lvl('water-gun', 1), lvl('tail-whip', 5), lvl('water-pulse', 11),
    lvl('fury-cutter', 13), lvl('razor-shell', 18), lvl('aqua-jet', 21),
    tutor('ice-beam'), tutor('air-slash'), tutor('surf')
  ],
  
  // #008 - Dewott
  'dewott': [
    lvl('tackle', 1), lvl('water-gun', 1), lvl('tail-whip', 5), lvl('water-pulse', 11),
    lvl('fury-cutter', 13), lvl('razor-shell', 18), lvl('aqua-jet', 21),
    lvl('swords-dance', 25), lvl('aqua-tail', 33),
    tutor('ice-beam'), tutor('air-slash'), tutor('surf'), tutor('night-slash')
  ],
  
  // #009 - Hisuian Samurott
  'hisuian-samurott': [
    lvl('tackle', 1), lvl('water-gun', 1), lvl('fury-cutter', 1), lvl('razor-shell', 1),
    lvl('aqua-jet', 21), lvl('swords-dance', 25), lvl('aqua-tail', 33),
    lvl('ceaseless-edge', 37), lvl('hydro-pump', 47),
    evo('ceaseless-edge'),
    tutor('ice-beam'), tutor('dark-pulse'), tutor('surf'), tutor('night-slash')
  ],
  
  // #010 - Bidoof
  'bidoof': [
    lvl('tackle', 1), lvl('growl', 1), lvl('rollout', 5), lvl('headbutt', 9),
    lvl('hyper-fang', 13), lvl('crunch', 21),
    tutor('ice-beam'), tutor('thunderbolt'), tutor('stealth-rock')
  ],
  
  // #011 - Bibarel
  'bibarel': [
    lvl('tackle', 1), lvl('growl', 1), lvl('rollout', 5), lvl('headbutt', 9),
    lvl('hyper-fang', 13), lvl('aqua-jet', 18), lvl('crunch', 21),
    lvl('superpower', 29), lvl('aqua-tail', 37),
    tutor('ice-beam'), tutor('thunderbolt'), tutor('surf'), tutor('stealth-rock')
  ],
  
  // #012 - Starly
  'starly': [
    lvl('tackle', 1), lvl('growl', 1), lvl('quick-attack', 5), lvl('wing-attack', 9),
    lvl('aerial-ace', 15), lvl('agility', 18),
    tutor('brave-bird'), tutor('close-combat'), tutor('roost')
  ],
  
  // #013 - Staravia
  'staravia': [
    lvl('tackle', 1), lvl('quick-attack', 5), lvl('wing-attack', 9),
    lvl('aerial-ace', 15), lvl('agility', 18), lvl('brave-bird', 25),
    tutor('close-combat'), tutor('roost'), tutor('u-turn')
  ],
  
  // #014 - Staraptor
  'staraptor': [
    lvl('tackle', 1), lvl('quick-attack', 1), lvl('wing-attack', 1),
    lvl('aerial-ace', 15), lvl('agility', 18), lvl('brave-bird', 25),
    lvl('close-combat', 34), lvl('giga-impact', 49),
    tutor('roost'), tutor('u-turn'), tutor('double-edge')
  ],
  
  // #015 - Shinx
  'shinx': [
    lvl('tackle', 1), lvl('thunder-shock', 1), lvl('charge', 6),
    lvl('spark', 12), lvl('bite', 15), lvl('thunder-fang', 21),
    tutor('thunderbolt'), tutor('wild-charge'), tutor('crunch')
  ],
  
  // #016 - Luxio
  'luxio': [
    lvl('tackle', 1), lvl('thunder-shock', 1), lvl('charge', 6),
    lvl('spark', 12), lvl('bite', 15), lvl('thunder-fang', 21),
    lvl('crunch', 28), lvl('discharge', 35),
    tutor('thunderbolt'), tutor('wild-charge'), tutor('iron-tail')
  ],
  
  // #017 - Luxray
  'luxray': [
    lvl('tackle', 1), lvl('thunder-shock', 1), lvl('spark', 1),
    lvl('bite', 15), lvl('thunder-fang', 21), lvl('crunch', 28),
    lvl('discharge', 35), lvl('wild-charge', 42), lvl('electric-terrain', 50),
    tutor('thunderbolt'), tutor('iron-tail'), tutor('superpower')
  ],
  
  // #018 - Abra
  'abra': [
    lvl('teleport', 1), lvl('confusion', 1),
    tutor('psychic'), tutor('shadow-ball'), tutor('energy-ball')
  ],
  
  // #019 - Kadabra
  'kadabra': [
    lvl('teleport', 1), lvl('confusion', 1), lvl('psybeam', 16),
    lvl('recover', 21), lvl('psychic', 26), lvl('calm-mind', 31),
    tutor('shadow-ball'), tutor('energy-ball'), tutor('focus-blast')
  ],
  
  // #020 - Alakazam
  'alakazam': [
    lvl('teleport', 1), lvl('confusion', 1), lvl('psybeam', 1),
    lvl('recover', 21), lvl('psychic', 26), lvl('calm-mind', 31),
    lvl('future-sight', 36), lvl('psycho-cut', 43),
    tutor('shadow-ball'), tutor('energy-ball'), tutor('focus-blast'), tutor('dazzling-gleam')
  ],
  
  // #021 - Chimchar
  'chimchar': [
    lvl('scratch', 1), lvl('ember', 1), lvl('taunt', 7), lvl('fury-swipes', 9),
    lvl('flame-wheel', 15), lvl('mach-punch', 17),
    tutor('fire-punch'), tutor('thunder-punch'), tutor('focus-blast')
  ],
  
  // #022 - Monferno
  'monferno': [
    lvl('scratch', 1), lvl('ember', 1), lvl('taunt', 7), lvl('fury-swipes', 9),
    lvl('flame-wheel', 15), lvl('mach-punch', 17), lvl('power-up-punch', 22),
    lvl('close-combat', 32),
    tutor('fire-punch'), tutor('thunder-punch'), tutor('focus-blast'), tutor('flamethrower')
  ],
  
  // #023 - Infernape
  'infernape': [
    lvl('scratch', 1), lvl('ember', 1), lvl('flame-wheel', 1), lvl('mach-punch', 1),
    lvl('power-up-punch', 22), lvl('close-combat', 32), lvl('flare-blitz', 42),
    lvl('calm-mind', 50),
    tutor('fire-punch'), tutor('thunder-punch'), tutor('focus-blast'), tutor('flamethrower')
  ],
  
  // #024 - Buizel
  'buizel': [
    lvl('tackle', 1), lvl('water-gun', 1), lvl('quick-attack', 7),
    lvl('aqua-jet', 11), lvl('swift', 18), lvl('aqua-tail', 24),
    tutor('ice-beam'), tutor('surf'), tutor('brick-break')
  ],
  
  // #025 - Floatzel
  'floatzel': [
    lvl('tackle', 1), lvl('water-gun', 1), lvl('quick-attack', 7),
    lvl('aqua-jet', 11), lvl('swift', 18), lvl('aqua-tail', 24),
    lvl('hydro-pump', 35), lvl('wave-crash', 46),
    tutor('ice-beam'), tutor('surf'), tutor('brick-break'), tutor('crunch')
  ],
  
  // #026 - Pichu
  'pichu': [
    lvl('thunder-shock', 1), lvl('tail-whip', 1), lvl('charm', 5),
    lvl('sweet-kiss', 10), lvl('nuzzle', 13),
    tutor('thunderbolt'), tutor('grass-knot'), tutor('iron-tail')
  ],
  
  // #027 - Pikachu
  'pikachu': [
    lvl('thunder-shock', 1), lvl('tail-whip', 1), lvl('quick-attack', 5),
    lvl('electro-ball', 12), lvl('nuzzle', 15), lvl('spark', 20),
    lvl('thunderbolt', 28), lvl('agility', 34), lvl('thunder', 42),
    tutor('grass-knot'), tutor('iron-tail'), tutor('volt-tackle')
  ],
  
  // #028 - Raichu
  'raichu': [
    lvl('thunder-shock', 1), lvl('quick-attack', 1), lvl('electro-ball', 1),
    lvl('thunderbolt', 1), lvl('thunder', 1), lvl('thunder-punch', 1),
    tutor('grass-knot'), tutor('iron-tail'), tutor('focus-blast'), tutor('surf')
  ],
  
  // #029 - Zubat
  'zubat': [
    lvl('supersonic', 1), lvl('astonish', 1), lvl('absorb', 5),
    lvl('bite', 10), lvl('wing-attack', 15), lvl('confuse-ray', 20),
    tutor('air-slash'), tutor('poison-jab'), tutor('shadow-ball')
  ],
  
  // #030 - Golbat
  'golbat': [
    lvl('supersonic', 1), lvl('astonish', 1), lvl('absorb', 5),
    lvl('bite', 10), lvl('wing-attack', 15), lvl('confuse-ray', 20),
    lvl('air-slash', 27), lvl('leech-life', 33), lvl('brave-bird', 43),
    tutor('poison-jab'), tutor('shadow-ball'), tutor('heat-wave')
  ],
  
  // #031 - Crobat
  'crobat': [
    lvl('supersonic', 1), lvl('astonish', 1), lvl('bite', 1), lvl('wing-attack', 1),
    lvl('confuse-ray', 20), lvl('air-slash', 27), lvl('leech-life', 33),
    lvl('brave-bird', 43), lvl('cross-poison', 50),
    tutor('poison-jab'), tutor('shadow-ball'), tutor('heat-wave'), tutor('u-turn')
  ],
  
  // #032 - Drifloon
  'drifloon': [
    lvl('minimize', 1), lvl('gust', 1), lvl('astonish', 4), lvl('focus-energy', 8),
    lvl('payback', 12), lvl('hex', 16), lvl('shadow-ball', 24),
    tutor('psychic'), tutor('thunderbolt'), tutor('will-o-wisp')
  ],
  
  // #033 - Drifblim
  'drifblim': [
    lvl('minimize', 1), lvl('gust', 1), lvl('astonish', 1), lvl('hex', 1),
    lvl('shadow-ball', 24), lvl('stockpile', 30), lvl('destiny-bond', 40),
    lvl('explosion', 50),
    tutor('psychic'), tutor('thunderbolt'), tutor('will-o-wisp'), tutor('calm-mind')
  ],
  
  // #034 - Kricketot
  'kricketot': [
    lvl('growl', 1), lvl('bide', 1), lvl('struggle-bug', 6),
    tutor('bug-bite'), tutor('mud-slap')
  ],
  
  // #035 - Kricketune
  'kricketune': [
    lvl('growl', 1), lvl('bide', 1), lvl('fury-cutter', 10),
    lvl('night-slash', 18), lvl('x-scissor', 26), lvl('bug-buzz', 36),
    tutor('bug-bite'), tutor('aerial-ace'), tutor('brick-break')
  ],
  
  // #036 - Budew
  'budew': [
    lvl('absorb', 1), lvl('growth', 1), lvl('stun-spore', 5),
    lvl('mega-drain', 10), lvl('poison-sting', 13),
    tutor('energy-ball'), tutor('sludge-bomb'), tutor('shadow-ball')
  ],
  
  // #037 - Roselia
  'roselia': [
    lvl('absorb', 1), lvl('growth', 1), lvl('stun-spore', 5),
    lvl('mega-drain', 10), lvl('poison-sting', 13), lvl('giga-drain', 22),
    lvl('toxic', 28), lvl('petal-blizzard', 34),
    tutor('energy-ball'), tutor('sludge-bomb'), tutor('shadow-ball'), tutor('dazzling-gleam')
  ],
  
  // #038 - Roserade
  'roserade': [
    lvl('absorb', 1), lvl('mega-drain', 1), lvl('giga-drain', 1),
    lvl('toxic', 1), lvl('petal-blizzard', 1), lvl('petal-dance', 1),
    lvl('sludge-bomb', 1),
    tutor('energy-ball'), tutor('shadow-ball'), tutor('dazzling-gleam'), tutor('venoshock')
  ],
  
  // #039 - Combee
  'combee': [
    lvl('gust', 1), lvl('sweet-scent', 1), lvl('bug-bite', 9),
    tutor('air-cutter')
  ],
  
  // #040 - Vespiquen
  'vespiquen': [
    lvl('gust', 1), lvl('sweet-scent', 1), lvl('bug-bite', 1),
    lvl('fury-cutter', 21), lvl('slash', 25), lvl('power-gem', 33),
    lvl('attack-order', 37), lvl('defend-order', 37), lvl('heal-order', 37),
    tutor('air-slash'), tutor('x-scissor'), tutor('sludge-bomb')
  ],
  
  // #041 - Pachirisu
  'pachirisu': [
    lvl('growl', 1), lvl('thunder-shock', 1), lvl('quick-attack', 5),
    lvl('spark', 13), lvl('electro-ball', 17), lvl('nuzzle', 21),
    lvl('discharge', 29), lvl('super-fang', 33),
    tutor('thunderbolt'), tutor('grass-knot'), tutor('u-turn')
  ],
  
  // #042 - Buneary
  'buneary': [
    lvl('pound', 1), lvl('defense-curl', 1), lvl('baby-doll-eyes', 4),
    lvl('quick-attack', 8), lvl('jump-kick', 13), lvl('headbutt', 20),
    tutor('ice-punch'), tutor('fire-punch'), tutor('thunder-punch')
  ],
  
  // #043 - Lopunny
  'lopunny': [
    lvl('pound', 1), lvl('defense-curl', 1), lvl('quick-attack', 1),
    lvl('jump-kick', 13), lvl('headbutt', 20), lvl('high-jump-kick', 37),
    lvl('agility', 43), lvl('bounce', 50),
    tutor('ice-punch'), tutor('fire-punch'), tutor('thunder-punch'), tutor('focus-blast')
  ],
  
  // #044 - Wurmple
  'wurmple': [
    lvl('tackle', 1), lvl('string-shot', 1), lvl('poison-sting', 5),
    lvl('bug-bite', 9),
    tutor('electroweb')
  ],
  
  // #045 - Silcoon
  'silcoon': [
    lvl('harden', 1), lvl('iron-defense', 7),
    tutor('iron-defense')
  ],
  
  // #046 - Beautifly
  'beautifly': [
    lvl('gust', 1), lvl('absorb', 1), lvl('stun-spore', 12),
    lvl('morning-sun', 17), lvl('air-cutter', 22), lvl('mega-drain', 27),
    lvl('silver-wind', 32), lvl('quiver-dance', 40), lvl('bug-buzz', 45),
    tutor('psychic'), tutor('energy-ball'), tutor('shadow-ball')
  ],
  
  // #047 - Cascoon
  'cascoon': [
    lvl('harden', 1), lvl('iron-defense', 7),
    tutor('iron-defense')
  ],
  
  // #048 - Dustox
  'dustox': [
    lvl('gust', 1), lvl('confusion', 1), lvl('poison-powder', 12),
    lvl('moonlight', 17), lvl('psybeam', 22), lvl('venoshock', 27),
    lvl('silver-wind', 32), lvl('quiver-dance', 40), lvl('bug-buzz', 45),
    tutor('psychic'), tutor('sludge-bomb'), tutor('shadow-ball')
  ],
  
  // #049 - Ponyta
  'ponyta': [
    lvl('tackle', 1), lvl('growl', 1), lvl('ember', 5),
    lvl('flame-wheel', 11), lvl('stomp', 17), lvl('fire-spin', 23),
    lvl('agility', 29), lvl('flamethrower', 35),
    tutor('flare-blitz'), tutor('wild-charge'), tutor('high-horsepower')
  ],
  
  // #050 - Rapidash
  'rapidash': [
    lvl('tackle', 1), lvl('ember', 1), lvl('flame-wheel', 1),
    lvl('stomp', 17), lvl('fire-spin', 23), lvl('agility', 29),
    lvl('flamethrower', 35), lvl('flare-blitz', 43), lvl('megahorn', 50),
    tutor('wild-charge'), tutor('high-horsepower'), tutor('smart-strike')
  ],
  
  // #051 - Eevee
  'eevee': [
    lvl('tackle', 1), lvl('growl', 1), lvl('tail-whip', 1), lvl('covet', 5),
    lvl('sand-attack', 10), lvl('quick-attack', 15), lvl('baby-doll-eyes', 20),
    lvl('swift', 25), lvl('take-down', 30),
    tutor('shadow-ball'), tutor('iron-tail'), tutor('hyper-voice')
  ],
  
  // #052 - Vaporeon
  'vaporeon': [
    lvl('tackle', 1), lvl('water-gun', 1), lvl('quick-attack', 1),
    lvl('water-pulse', 15), lvl('aurora-beam', 20), lvl('aqua-ring', 25),
    lvl('acid-armor', 30), lvl('hydro-pump', 40), lvl('aqua-tail', 45),
    tutor('ice-beam'), tutor('surf'), tutor('shadow-ball')
  ],
  
  // #053 - Jolteon
  'jolteon': [
    lvl('tackle', 1), lvl('thunder-shock', 1), lvl('quick-attack', 1),
    lvl('electro-ball', 15), lvl('thunder-wave', 20), lvl('agility', 25),
    lvl('discharge', 30), lvl('thunder', 40), lvl('pin-missile', 45),
    tutor('thunderbolt'), tutor('shadow-ball'), tutor('volt-switch')
  ],
  
  // #054 - Flareon
  'flareon': [
    lvl('tackle', 1), lvl('ember', 1), lvl('quick-attack', 1),
    lvl('fire-fang', 15), lvl('fire-spin', 20), lvl('scary-face', 25),
    lvl('lava-plume', 30), lvl('flare-blitz', 40), lvl('superpower', 45),
    tutor('flamethrower'), tutor('shadow-ball'), tutor('iron-tail')
  ],
  
  // #055 - Umbreon
  'umbreon': [
    lvl('tackle', 1), lvl('sand-attack', 1), lvl('quick-attack', 1),
    lvl('pursuit', 15), lvl('confuse-ray', 20), lvl('guard-swap', 25),
    lvl('dark-pulse', 30), lvl('moonlight', 40), lvl('foul-play', 45),
    tutor('psychic'), tutor('shadow-ball'), tutor('snarl')
  ],
  
  // #056 - Espeon
  'espeon': [
    lvl('tackle', 1), lvl('confusion', 1), lvl('quick-attack', 1),
    lvl('psybeam', 15), lvl('future-sight', 20), lvl('calm-mind', 25),
    lvl('psychic', 30), lvl('morning-sun', 40), lvl('psych-up', 45),
    tutor('shadow-ball'), tutor('dazzling-gleam'), tutor('grass-knot')
  ],
  
  // #057 - Leafeon
  'leafeon': [
    lvl('tackle', 1), lvl('razor-leaf', 1), lvl('quick-attack', 1),
    lvl('magical-leaf', 15), lvl('giga-drain', 20), lvl('swords-dance', 25),
    lvl('leaf-blade', 30), lvl('sunny-day', 40), lvl('solar-blade', 45),
    tutor('energy-ball'), tutor('x-scissor'), tutor('iron-tail')
  ],
  
  // #058 - Glaceon
  'glaceon': [
    lvl('tackle', 1), lvl('powder-snow', 1), lvl('quick-attack', 1),
    lvl('icy-wind', 15), lvl('ice-fang', 20), lvl('barrier', 25),
    lvl('ice-beam', 30), lvl('hail', 40), lvl('blizzard', 45),
    tutor('water-pulse'), tutor('shadow-ball'), tutor('iron-tail')
  ],
  
  // #059 - Sylveon
  'sylveon': [
    lvl('tackle', 1), lvl('fairy-wind', 1), lvl('quick-attack', 1),
    lvl('draining-kiss', 15), lvl('skill-swap', 20), lvl('misty-terrain', 25),
    lvl('moonblast', 30), lvl('psych-up', 40), lvl('last-resort', 45),
    tutor('dazzling-gleam'), tutor('shadow-ball'), tutor('hyper-voice')
  ],
  
  // #060 - Mime Jr.
  'mime-jr': [
    lvl('confusion', 1), lvl('copycat', 1), lvl('encore', 4),
    lvl('psybeam', 12), lvl('mimic', 16), lvl('light-screen', 20),
    tutor('psychic'), tutor('shadow-ball'), tutor('dazzling-gleam')
  ],
  
  // #061 - Mr. Mime
  'mr-mime': [
    lvl('confusion', 1), lvl('copycat', 1), lvl('encore', 1),
    lvl('psybeam', 12), lvl('mimic', 16), lvl('light-screen', 20),
    lvl('psychic', 28), lvl('reflect', 32), lvl('dazzling-gleam', 40),
    tutor('shadow-ball'), tutor('energy-ball'), tutor('focus-blast')
  ],
  
  // #062 - Happiny
  'happiny': [
    lvl('pound', 1), lvl('charm', 1), lvl('copycat', 4),
    lvl('sweet-kiss', 8),
    tutor('thunderbolt'), tutor('flamethrower'), tutor('ice-beam')
  ],
  
  // #063 - Chansey
  'chansey': [
    lvl('pound', 1), lvl('growl', 1), lvl('tail-whip', 4),
    lvl('double-slap', 12), lvl('soft-boiled', 16), lvl('egg-bomb', 20),
    lvl('take-down', 28), lvl('double-edge', 36),
    tutor('thunderbolt'), tutor('flamethrower'), tutor('ice-beam'), tutor('shadow-ball')
  ],
  
  // #064 - Blissey
  'blissey': [
    lvl('pound', 1), lvl('growl', 1), lvl('tail-whip', 1),
    lvl('double-slap', 12), lvl('soft-boiled', 16), lvl('egg-bomb', 20),
    lvl('take-down', 28), lvl('double-edge', 36), lvl('healing-wish', 46),
    tutor('thunderbolt'), tutor('flamethrower'), tutor('ice-beam'), tutor('focus-blast')
  ],
  
  // #065 - Munchlax
  'munchlax': [
    lvl('tackle', 1), lvl('lick', 1), lvl('defense-curl', 4),
    lvl('odor-sleuth', 8), lvl('stockpile', 12), lvl('body-slam', 20),
    tutor('ice-punch'), tutor('fire-punch'), tutor('thunder-punch')
  ],
  
  // #066 - Snorlax
  'snorlax': [
    lvl('tackle', 1), lvl('lick', 1), lvl('defense-curl', 1),
    lvl('stockpile', 12), lvl('body-slam', 20), lvl('rest', 28),
    lvl('snore', 32), lvl('giga-impact', 44), lvl('high-horsepower', 50),
    tutor('ice-punch'), tutor('fire-punch'), tutor('thunder-punch'), tutor('earthquake')
  ],
  
  // #067 - Paras
  'paras': [
    lvl('scratch', 1), lvl('stun-spore', 1), lvl('absorb', 6),
    lvl('fury-cutter', 11), lvl('spore', 17), lvl('slash', 22),
    tutor('x-scissor'), tutor('aerial-ace'), tutor('brick-break')
  ],
  
  // #068 - Parasect
  'parasect': [
    lvl('scratch', 1), lvl('stun-spore', 1), lvl('absorb', 1),
    lvl('fury-cutter', 11), lvl('spore', 17), lvl('slash', 22),
    lvl('x-scissor', 29), lvl('giga-drain', 37), lvl('rage-powder', 44),
    tutor('aerial-ace'), tutor('brick-break'), tutor('seed-bomb')
  ],
  
  // #069 - Geodude
  'geodude': [
    lvl('tackle', 1), lvl('defense-curl', 1), lvl('rock-throw', 6),
    lvl('rollout', 10), lvl('rock-polish', 14), lvl('rock-slide', 22),
    tutor('earthquake'), tutor('thunder-punch'), tutor('fire-punch')
  ],
  
  // #070 - Graveler
  'graveler': [
    lvl('tackle', 1), lvl('defense-curl', 1), lvl('rock-throw', 6),
    lvl('rollout', 10), lvl('rock-polish', 14), lvl('rock-slide', 22),
    lvl('stone-edge', 30), lvl('earthquake', 36),
    tutor('thunder-punch'), tutor('fire-punch'), tutor('stealth-rock')
  ],
  
  // #071 - Golem
  'golem': [
    lvl('tackle', 1), lvl('rock-throw', 1), lvl('rollout', 1),
    lvl('rock-polish', 14), lvl('rock-slide', 22), lvl('stone-edge', 30),
    lvl('earthquake', 36), lvl('explosion', 44),
    tutor('thunder-punch'), tutor('fire-punch'), tutor('stealth-rock'), tutor('heavy-slam')
  ],
  
  // #072 - Gastly
  'gastly': [
    lvl('lick', 1), lvl('hypnosis', 1), lvl('mean-look', 4),
    lvl('confuse-ray', 12), lvl('hex', 16), lvl('shadow-ball', 24),
    tutor('psychic'), tutor('sludge-bomb'), tutor('dark-pulse')
  ],
  
  // #073 - Haunter
  'haunter': [
    lvl('lick', 1), lvl('hypnosis', 1), lvl('mean-look', 4),
    lvl('confuse-ray', 12), lvl('hex', 16), lvl('shadow-ball', 24),
    lvl('dream-eater', 32), lvl('dark-pulse', 40),
    tutor('psychic'), tutor('sludge-bomb'), tutor('dazzling-gleam')
  ],
  
  // #074 - Gengar
  'gengar': [
    lvl('lick', 1), lvl('hypnosis', 1), lvl('confuse-ray', 1),
    lvl('hex', 16), lvl('shadow-ball', 24), lvl('dream-eater', 32),
    lvl('dark-pulse', 40), lvl('destiny-bond', 48),
    tutor('psychic'), tutor('sludge-bomb'), tutor('dazzling-gleam'), tutor('focus-blast')
  ],
  
  // #075 - Magikarp
  'magikarp': [
    lvl('splash', 1), lvl('tackle', 15), lvl('flail', 25),
    tutor('hydro-pump')
  ],
  
  // #076 - Gyarados
  'gyarados': [
    lvl('bite', 1), lvl('thrash', 1), lvl('leer', 1),
    lvl('twister', 20), lvl('ice-fang', 24), lvl('aqua-tail', 28),
    lvl('crunch', 36), lvl('hurricane', 44), lvl('hydro-pump', 52),
    tutor('ice-beam'), tutor('thunderbolt'), tutor('earthquake'), tutor('dark-pulse')
  ],
  
  // #077 - Barboach
  'barboach': [
    lvl('mud-slap', 1), lvl('water-gun', 1), lvl('rest', 6),
    lvl('snore', 6), lvl('water-pulse', 12), lvl('mud-bomb', 18),
    lvl('aqua-tail', 24),
    tutor('ice-beam'), tutor('earthquake'), tutor('dragon-dance')
  ],
  
  // #078 - Whiscash
  'whiscash': [
    lvl('mud-slap', 1), lvl('water-gun', 1), lvl('water-pulse', 12),
    lvl('mud-bomb', 18), lvl('aqua-tail', 24), lvl('earthquake', 32),
    lvl('future-sight', 40), lvl('fissure', 50),
    tutor('ice-beam'), tutor('zen-headbutt'), tutor('stone-edge')
  ],
  
  // #079 - Croagunk
  'croagunk': [
    lvl('poison-sting', 1), lvl('mud-slap', 1), lvl('astonish', 4),
    lvl('pursuit', 8), lvl('venoshock', 15), lvl('sucker-punch', 22),
    lvl('poison-jab', 29),
    tutor('focus-blast'), tutor('sludge-bomb'), tutor('dark-pulse')
  ],
  
  // #080 - Toxicroak
  'toxicroak': [
    lvl('poison-sting', 1), lvl('mud-slap', 1), lvl('astonish', 1),
    lvl('pursuit', 8), lvl('venoshock', 15), lvl('sucker-punch', 22),
    lvl('poison-jab', 29), lvl('nasty-plot', 37), lvl('sludge-bomb', 44),
    tutor('focus-blast'), tutor('dark-pulse'), tutor('ice-punch')
  ],
  
  // #081 - Ralts
  'ralts': [
    lvl('growl', 1), lvl('confusion', 1), lvl('disarming-voice', 6),
    lvl('psybeam', 11), lvl('draining-kiss', 17), lvl('calm-mind', 23),
    tutor('psychic'), tutor('shadow-ball'), tutor('dazzling-gleam')
  ],
  
  // #082 - Kirlia
  'kirlia': [
    lvl('growl', 1), lvl('confusion', 1), lvl('disarming-voice', 6),
    lvl('psybeam', 11), lvl('draining-kiss', 17), lvl('calm-mind', 23),
    lvl('psychic', 31), lvl('hypnosis', 37),
    tutor('shadow-ball'), tutor('dazzling-gleam'), tutor('thunderbolt')
  ],
  
  // #083 - Gardevoir
  'gardevoir': [
    lvl('confusion', 1), lvl('disarming-voice', 1), lvl('psybeam', 1),
    lvl('draining-kiss', 17), lvl('calm-mind', 23), lvl('psychic', 31),
    lvl('hypnosis', 37), lvl('moonblast', 45), lvl('future-sight', 53),
    tutor('shadow-ball'), tutor('dazzling-gleam'), tutor('thunderbolt'), tutor('focus-blast')
  ],
  
  // #084 - Gallade
  'gallade': [
    lvl('confusion', 1), lvl('leer', 1), lvl('fury-cutter', 1),
    lvl('slash', 17), lvl('swords-dance', 23), lvl('psycho-cut', 31),
    lvl('close-combat', 37), lvl('leaf-blade', 45), lvl('stored-power', 53),
    evo('close-combat'),
    tutor('shadow-ball'), tutor('brick-break'), tutor('x-scissor'), tutor('night-slash')
  ],
  
  // #085 - Machop
  'machop': [
    lvl('low-kick', 1), lvl('leer', 1), lvl('focus-energy', 4),
    lvl('karate-chop', 8), lvl('rock-throw', 15), lvl('seismic-toss', 19),
    lvl('knock-off', 26), lvl('cross-chop', 33),
    tutor('close-combat'), tutor('fire-punch'), tutor('thunder-punch')
  ],
  
  // #086 - Machoke
  'machoke': [
    lvl('low-kick', 1), lvl('leer', 1), lvl('focus-energy', 1),
    lvl('karate-chop', 8), lvl('rock-throw', 15), lvl('seismic-toss', 19),
    lvl('knock-off', 26), lvl('cross-chop', 33), lvl('dynamic-punch', 41),
    tutor('close-combat'), tutor('fire-punch'), tutor('thunder-punch'), tutor('earthquake')
  ],
  
  // #087 - Machamp
  'machamp': [
    lvl('low-kick', 1), lvl('leer', 1), lvl('karate-chop', 1),
    lvl('seismic-toss', 19), lvl('knock-off', 26), lvl('cross-chop', 33),
    lvl('dynamic-punch', 41), lvl('close-combat', 50),
    tutor('fire-punch'), tutor('thunder-punch'), tutor('earthquake'), tutor('stone-edge')
  ],
  
  // #088 - Onix
  'onix': [
    lvl('tackle', 1), lvl('harden', 1), lvl('rock-throw', 4),
    lvl('rock-tomb', 10), lvl('screech', 16), lvl('rock-slide', 22),
    lvl('iron-tail', 28), lvl('stone-edge', 34),
    tutor('earthquake'), tutor('iron-head'), tutor('stealth-rock')
  ],
  
  // #089 - Steelix
  'steelix': [
    lvl('tackle', 1), lvl('harden', 1), lvl('rock-throw', 1),
    lvl('rock-tomb', 10), lvl('screech', 16), lvl('rock-slide', 22),
    lvl('iron-tail', 28), lvl('stone-edge', 34), lvl('crunch', 42),
    lvl('double-edge', 50),
    tutor('earthquake'), tutor('iron-head'), tutor('stealth-rock'), tutor('flash-cannon')
  ],
  
  // #090 - Rhyhorn
  'rhyhorn': [
    lvl('tackle', 1), lvl('tail-whip', 1), lvl('horn-attack', 5),
    lvl('stomp', 10), lvl('rock-blast', 15), lvl('rock-slide', 25),
    lvl('drill-run', 30), lvl('stone-edge', 40),
    tutor('earthquake'), tutor('megahorn'), tutor('fire-fang')
  ],
  
  // #091 - Rhydon
  'rhydon': [
    lvl('tackle', 1), lvl('tail-whip', 1), lvl('horn-attack', 1),
    lvl('stomp', 10), lvl('rock-blast', 15), lvl('rock-slide', 25),
    lvl('drill-run', 30), lvl('stone-edge', 40), lvl('horn-drill', 48),
    tutor('earthquake'), tutor('megahorn'), tutor('fire-fang'), tutor('ice-punch')
  ],
  
  // #092 - Rhyperior
  'rhyperior': [
    lvl('tackle', 1), lvl('horn-attack', 1), lvl('rock-blast', 1),
    lvl('rock-slide', 25), lvl('drill-run', 30), lvl('stone-edge', 40),
    lvl('horn-drill', 48), lvl('rock-wrecker', 55),
    tutor('earthquake'), tutor('megahorn'), tutor('ice-punch'), tutor('thunder-punch')
  ],
  
  // #093 - Bonsly
  'bonsly': [
    lvl('fake-tears', 1), lvl('copycat', 1), lvl('rock-throw', 5),
    lvl('mimic', 12), lvl('rock-tomb', 16), lvl('rock-slide', 23),
    tutor('brick-break'), tutor('stealth-rock')
  ],
  
  // #094 - Sudowoodo
  'sudowoodo': [
    lvl('fake-tears', 1), lvl('copycat', 1), lvl('rock-throw', 1),
    lvl('rock-tomb', 16), lvl('rock-slide', 23), lvl('sucker-punch', 30),
    lvl('stone-edge', 40), lvl('head-smash', 48),
    tutor('brick-break'), tutor('stealth-rock'), tutor('earthquake')
  ],
  
  // #095 - Magnemite
  'magnemite': [
    lvl('tackle', 1), lvl('thunder-shock', 1), lvl('supersonic', 4),
    lvl('thunder-wave', 8), lvl('spark', 14), lvl('mirror-shot', 20),
    lvl('flash-cannon', 28),
    tutor('thunderbolt'), tutor('volt-switch'), tutor('tri-attack')
  ],
  
  // #096 - Magneton
  'magneton': [
    lvl('tackle', 1), lvl('thunder-shock', 1), lvl('supersonic', 1),
    lvl('thunder-wave', 8), lvl('spark', 14), lvl('mirror-shot', 20),
    lvl('flash-cannon', 28), lvl('discharge', 36), lvl('lock-on', 44),
    tutor('thunderbolt'), tutor('volt-switch'), tutor('tri-attack'), tutor('explosion')
  ],
  
  // #097 - Magnezone
  'magnezone': [
    lvl('tackle', 1), lvl('thunder-shock', 1), lvl('spark', 1),
    lvl('mirror-shot', 20), lvl('flash-cannon', 28), lvl('discharge', 36),
    lvl('lock-on', 44), lvl('zap-cannon', 52),
    tutor('thunderbolt'), tutor('volt-switch'), tutor('tri-attack'), tutor('hyper-beam')
  ],
  
  // #098 - Turtwig
  'turtwig': [
    lvl('tackle', 1), lvl('withdraw', 1), lvl('absorb', 5),
    lvl('razor-leaf', 10), lvl('curse', 17), lvl('bite', 22),
    lvl('mega-drain', 27),
    tutor('energy-ball'), tutor('earthquake'), tutor('rock-slide')
  ],
  
  // #099 - Grotle
  'grotle': [
    lvl('tackle', 1), lvl('withdraw', 1), lvl('absorb', 1),
    lvl('razor-leaf', 10), lvl('curse', 17), lvl('bite', 22),
    lvl('mega-drain', 27), lvl('crunch', 33), lvl('giga-drain', 39),
    tutor('energy-ball'), tutor('earthquake'), tutor('rock-slide'), tutor('stealth-rock')
  ],
  
  // #100 - Torterra
  'torterra': [
    lvl('tackle', 1), lvl('withdraw', 1), lvl('razor-leaf', 1),
    lvl('curse', 17), lvl('bite', 22), lvl('mega-drain', 27),
    lvl('crunch', 33), lvl('giga-drain', 39), lvl('earthquake', 45),
    lvl('leaf-storm', 52),
    tutor('energy-ball'), tutor('rock-slide'), tutor('stealth-rock'), tutor('stone-edge')
  ],
  
  // Legendary & Mythical Pokémon
  
  // #238 - Dialga
  'dialga': [
    lvl('dragon-breath', 1), lvl('metal-claw', 1), lvl('ancient-power', 8),
    lvl('slash', 16), lvl('power-gem', 24), lvl('metal-burst', 32),
    lvl('flash-cannon', 40), lvl('aura-sphere', 48), lvl('roar-of-time', 56),
    tutor('iron-head'), tutor('earth-power'), tutor('thunderbolt'), tutor('ice-beam')
  ],
  
  // Dialga Origin Form
  'dialga-origin': [
    lvl('dragon-breath', 1), lvl('metal-claw', 1), lvl('ancient-power', 1),
    lvl('power-gem', 24), lvl('metal-burst', 32), lvl('flash-cannon', 40),
    lvl('aura-sphere', 48), lvl('roar-of-time', 56),
    tutor('iron-head'), tutor('earth-power'), tutor('thunderbolt'), tutor('draco-meteor')
  ],
  
  // #239 - Palkia
  'palkia': [
    lvl('dragon-breath', 1), lvl('water-pulse', 1), lvl('ancient-power', 8),
    lvl('slash', 16), lvl('power-gem', 24), lvl('aqua-tail', 32),
    lvl('hydro-pump', 40), lvl('aura-sphere', 48), lvl('spacial-rend', 56),
    tutor('surf'), tutor('earth-power'), tutor('thunderbolt'), tutor('fire-blast')
  ],
  
  // Palkia Origin Form
  'palkia-origin': [
    lvl('dragon-breath', 1), lvl('water-pulse', 1), lvl('ancient-power', 1),
    lvl('power-gem', 24), lvl('aqua-tail', 32), lvl('hydro-pump', 40),
    lvl('aura-sphere', 48), lvl('spacial-rend', 56),
    tutor('surf'), tutor('earth-power'), tutor('thunderbolt'), tutor('draco-meteor')
  ],
  
  // #240 - Heatran
  'heatran': [
    lvl('fire-fang', 1), lvl('metal-claw', 1), lvl('ancient-power', 8),
    lvl('leer', 16), lvl('crunch', 24), lvl('iron-head', 32),
    lvl('lava-plume', 40), lvl('earth-power', 48), lvl('magma-storm', 56),
    tutor('flamethrower'), tutor('flash-cannon'), tutor('stone-edge'), tutor('explosion')
  ],
  
  // #241 - Regigigas
  'regigigas': [
    lvl('pound', 1), lvl('confuse-ray', 1), lvl('dizzy-punch', 8),
    lvl('stomp', 16), lvl('zen-headbutt', 24), lvl('revenge', 32),
    lvl('heavy-slam', 40), lvl('giga-impact', 48), lvl('crush-grip', 56),
    tutor('thunder-punch'), tutor('fire-punch'), tutor('ice-punch'), tutor('earthquake')
  ],
  
  // #242 - Giratina
  'giratina': [
    lvl('dragon-breath', 1), lvl('shadow-sneak', 1), lvl('ancient-power', 8),
    lvl('slash', 16), lvl('shadow-claw', 24), lvl('scary-face', 32),
    lvl('pain-split', 40), lvl('aura-sphere', 48), lvl('shadow-force', 56),
    tutor('dark-pulse'), tutor('earth-power'), tutor('thunderbolt'), tutor('draco-meteor')
  ],
  
  // Giratina Origin Form
  'giratina-origin': [
    lvl('dragon-breath', 1), lvl('shadow-sneak', 1), lvl('ancient-power', 1),
    lvl('shadow-claw', 24), lvl('scary-face', 32), lvl('pain-split', 40),
    lvl('aura-sphere', 48), lvl('shadow-force', 56),
    tutor('dark-pulse'), tutor('earth-power'), tutor('thunderbolt'), tutor('draco-meteor')
  ],
  
  // #243 - Cresselia
  'cresselia': [
    lvl('confusion', 1), lvl('mist', 1), lvl('aurora-beam', 8),
    lvl('psycho-cut', 16), lvl('slash', 24), lvl('moonlight', 32),
    lvl('psychic', 40), lvl('lunar-blessing', 48), lvl('future-sight', 56),
    tutor('moonblast'), tutor('ice-beam'), tutor('shadow-ball'), tutor('energy-ball')
  ],
  
  // #244 - Phione
  'phione': [
    lvl('water-gun', 1), lvl('charm', 1), lvl('supersonic', 8),
    lvl('bubble-beam', 16), lvl('acid-armor', 24), lvl('whirlpool', 32),
    lvl('aqua-ring', 40), lvl('rain-dance', 48),
    tutor('ice-beam'), tutor('surf'), tutor('psychic'), tutor('u-turn')
  ],
  
  // #245 - Manaphy
  'manaphy': [
    lvl('water-gun', 1), lvl('charm', 1), lvl('supersonic', 8),
    lvl('bubble-beam', 16), lvl('acid-armor', 24), lvl('whirlpool', 32),
    lvl('aqua-ring', 40), lvl('rain-dance', 48), lvl('heart-swap', 56),
    tutor('ice-beam'), tutor('surf'), tutor('psychic'), tutor('energy-ball')
  ],
  
  // #246 - Darkrai
  'darkrai': [
    lvl('pursuit', 1), lvl('disable', 1), lvl('quick-attack', 8),
    lvl('hypnosis', 16), lvl('feint-attack', 24), lvl('nightmare', 32),
    lvl('dark-pulse', 40), lvl('dream-eater', 48), lvl('dark-void', 56),
    tutor('shadow-ball'), tutor('focus-blast'), tutor('ice-beam'), tutor('psychic')
  ],
  
  // #247 - Shaymin
  'shaymin': [
    lvl('growth', 1), lvl('magical-leaf', 1), lvl('leech-seed', 8),
    lvl('synthesis', 16), lvl('sweet-scent', 24), lvl('natural-gift', 32),
    lvl('energy-ball', 40), lvl('aromatherapy', 48), lvl('seed-flare', 56),
    tutor('psychic'), tutor('earth-power'), tutor('dazzling-gleam'), tutor('air-slash')
  ],
  
  // #248 - Shaymin Sky Form
  'shaymin-sky': [
    lvl('growth', 1), lvl('magical-leaf', 1), lvl('quick-attack', 8),
    lvl('synthesis', 16), lvl('air-slash', 24), lvl('sweet-kiss', 32),
    lvl('energy-ball', 40), lvl('leaf-storm', 48), lvl('seed-flare', 56),
    tutor('psychic'), tutor('earth-power'), tutor('dazzling-gleam')
  ],
  
  // #249 - Arceus
  'arceus': [
    lvl('seismic-toss', 1), lvl('cosmic-power', 1), lvl('punishment', 8),
    lvl('gravity', 16), lvl('earth-power', 24), lvl('hyper-voice', 32),
    lvl('extreme-speed', 40), lvl('refresh', 48), lvl('future-sight', 56),
    lvl('recover', 64), lvl('hyper-beam', 72), lvl('perish-song', 80),
    lvl('judgment', 88),
    tutor('thunderbolt'), tutor('flamethrower'), tutor('ice-beam'), tutor('shadow-ball'),
    tutor('earthquake'), tutor('psychic'), tutor('focus-blast'), tutor('dark-pulse')
  ],
  
  // Additional common Pokémon
  
  // Psyduck
  'psyduck': [
    lvl('scratch', 1), lvl('water-gun', 1), lvl('confusion', 4),
    lvl('fury-swipes', 8), lvl('water-pulse', 15), lvl('disable', 22),
    lvl('psybeam', 29),
    tutor('ice-beam'), tutor('psychic'), tutor('calm-mind')
  ],
  
  // Golduck
  'golduck': [
    lvl('scratch', 1), lvl('water-gun', 1), lvl('confusion', 1),
    lvl('fury-swipes', 8), lvl('water-pulse', 15), lvl('disable', 22),
    lvl('psybeam', 29), lvl('aqua-tail', 36), lvl('hydro-pump', 43),
    tutor('ice-beam'), tutor('psychic'), tutor('calm-mind'), tutor('focus-blast')
  ],
  
  // Scyther
  'scyther': [
    lvl('quick-attack', 1), lvl('leer', 1), lvl('fury-cutter', 5),
    lvl('false-swipe', 9), lvl('wing-attack', 13), lvl('double-team', 17),
    lvl('slash', 21), lvl('air-slash', 29), lvl('x-scissor', 37),
    tutor('aerial-ace'), tutor('brick-break'), tutor('swords-dance')
  ],
  
  // Kleavor
  'kleavor': [
    lvl('quick-attack', 1), lvl('leer', 1), lvl('fury-cutter', 1),
    lvl('rock-smash', 9), lvl('slash', 21), lvl('air-slash', 29),
    lvl('x-scissor', 37), lvl('stone-axe', 1), lvl('close-combat', 45),
    evo('stone-axe'),
    tutor('aerial-ace'), tutor('brick-break'), tutor('swords-dance'), tutor('rock-slide')
  ],
  
  // Scizor
  'scizor': [
    lvl('quick-attack', 1), lvl('leer', 1), lvl('fury-cutter', 1),
    lvl('false-swipe', 9), lvl('metal-claw', 13), lvl('double-team', 17),
    lvl('slash', 21), lvl('bullet-punch', 29), lvl('x-scissor', 37),
    lvl('iron-head', 45),
    tutor('aerial-ace'), tutor('brick-break'), tutor('swords-dance'), tutor('night-slash')
  ],
  
  // Sneasel (Hisuian)
  'hisuian-sneasel': [
    lvl('scratch', 1), lvl('leer', 1), lvl('quick-attack', 6),
    lvl('metal-claw', 12), lvl('poison-jab', 18), lvl('slash', 24),
    lvl('close-combat', 30), lvl('dire-claw', 36),
    tutor('ice-punch'), tutor('brick-break'), tutor('rock-slide')
  ],
  
  // Sneasler
  'sneasler': [
    lvl('scratch', 1), lvl('leer', 1), lvl('quick-attack', 1),
    lvl('metal-claw', 12), lvl('poison-jab', 18), lvl('slash', 24),
    lvl('close-combat', 30), lvl('dire-claw', 36), lvl('victory-dance', 1),
    evo('dire-claw'),
    tutor('ice-punch'), tutor('brick-break'), tutor('rock-slide'), tutor('gunk-shot')
  ],
  
  // Weavile
  'weavile': [
    lvl('scratch', 1), lvl('leer', 1), lvl('quick-attack', 1),
    lvl('metal-claw', 12), lvl('ice-shard', 18), lvl('slash', 24),
    lvl('night-slash', 30), lvl('ice-punch', 36), lvl('dark-pulse', 42),
    tutor('brick-break'), tutor('x-scissor'), tutor('low-kick')
  ],
  
  // Growlithe (Hisuian)
  'hisuian-growlithe': [
    lvl('bite', 1), lvl('ember', 1), lvl('leer', 4),
    lvl('flame-wheel', 12), lvl('rock-throw', 16), lvl('fire-fang', 24),
    lvl('rock-slide', 28), lvl('flamethrower', 36),
    tutor('flare-blitz'), tutor('stone-edge'), tutor('wild-charge')
  ],
  
  // Arcanine (Hisuian)
  'hisuian-arcanine': [
    lvl('bite', 1), lvl('ember', 1), lvl('flame-wheel', 1),
    lvl('rock-throw', 16), lvl('fire-fang', 24), lvl('rock-slide', 28),
    lvl('flamethrower', 36), lvl('raging-fury', 1), lvl('extreme-speed', 45),
    evo('raging-fury'),
    tutor('flare-blitz'), tutor('stone-edge'), tutor('wild-charge'), tutor('crunch')
  ],
  
  // Voltorb (Hisuian)
  'hisuian-voltorb': [
    lvl('tackle', 1), lvl('charge', 1), lvl('thunder-shock', 4),
    lvl('rollout', 8), lvl('spark', 15), lvl('self-destruct', 22),
    lvl('energy-ball', 29),
    tutor('thunderbolt'), tutor('grass-knot'), tutor('explosion')
  ],
  
  // Electrode (Hisuian)
  'hisuian-electrode': [
    lvl('tackle', 1), lvl('charge', 1), lvl('thunder-shock', 1),
    lvl('rollout', 8), lvl('spark', 15), lvl('self-destruct', 22),
    lvl('energy-ball', 29), lvl('chloroblast', 1), lvl('thunder', 40),
    evo('chloroblast'),
    tutor('thunderbolt'), tutor('grass-knot'), tutor('explosion'), tutor('hyper-beam')
  ],
  
  // Teddiursa
  'teddiursa': [
    lvl('scratch', 1), lvl('leer', 1), lvl('lick', 4),
    lvl('fury-swipes', 8), lvl('sweet-scent', 12), lvl('slash', 20),
    lvl('play-rough', 28),
    tutor('close-combat'), tutor('earthquake'), tutor('crunch')
  ],
  
  // Ursaring
  'ursaring': [
    lvl('scratch', 1), lvl('leer', 1), lvl('lick', 1),
    lvl('fury-swipes', 8), lvl('sweet-scent', 12), lvl('slash', 20),
    lvl('play-rough', 28), lvl('hammer-arm', 36), lvl('thrash', 44),
    tutor('close-combat'), tutor('earthquake'), tutor('crunch'), tutor('swords-dance')
  ],
  
  // Ursaluna
  'ursaluna': [
    lvl('scratch', 1), lvl('leer', 1), lvl('lick', 1),
    lvl('fury-swipes', 8), lvl('slash', 20), lvl('play-rough', 28),
    lvl('hammer-arm', 36), lvl('headlong-rush', 1), lvl('high-horsepower', 44),
    evo('headlong-rush'),
    tutor('close-combat'), tutor('earthquake'), tutor('crunch'), tutor('stone-edge')
  ],
  
  // Basculin (White Stripe)
  'basculin-white-striped': [
    lvl('tackle', 1), lvl('water-gun', 1), lvl('uproar', 4),
    lvl('headbutt', 8), lvl('bite', 12), lvl('aqua-jet', 16),
    lvl('crunch', 24), lvl('take-down', 28), lvl('aqua-tail', 32),
    tutor('ice-beam'), tutor('surf'), tutor('zen-headbutt')
  ],
  
  // Basculegion (Male)
  'basculegion': [
    lvl('tackle', 1), lvl('water-gun', 1), lvl('bite', 1),
    lvl('aqua-jet', 16), lvl('crunch', 24), lvl('take-down', 28),
    lvl('aqua-tail', 32), lvl('wave-crash', 1), lvl('shadow-ball', 40),
    evo('wave-crash'),
    tutor('ice-beam'), tutor('surf'), tutor('phantom-force'), tutor('hydro-pump')
  ],
  
  // Spheal
  'spheal': [
    lvl('powder-snow', 1), lvl('defense-curl', 1), lvl('rollout', 5),
    lvl('water-gun', 9), lvl('encore', 13), lvl('ice-ball', 17),
    lvl('aurora-beam', 25),
    tutor('ice-beam'), tutor('surf'), tutor('earthquake')
  ],
  
  // Sealeo
  'sealeo': [
    lvl('powder-snow', 1), lvl('defense-curl', 1), lvl('rollout', 5),
    lvl('water-gun', 9), lvl('encore', 13), lvl('ice-ball', 17),
    lvl('aurora-beam', 25), lvl('body-slam', 31), lvl('blizzard', 43),
    tutor('ice-beam'), tutor('surf'), tutor('earthquake'), tutor('rock-slide')
  ],
  
  // Walrein
  'walrein': [
    lvl('powder-snow', 1), lvl('rollout', 1), lvl('water-gun', 1),
    lvl('ice-ball', 17), lvl('aurora-beam', 25), lvl('body-slam', 31),
    lvl('blizzard', 43), lvl('ice-fang', 1), lvl('sheer-cold', 52),
    tutor('ice-beam'), tutor('surf'), tutor('earthquake'), tutor('stone-edge')
  ],
  
  // Bergmite
  'bergmite': [
    lvl('tackle', 1), lvl('harden', 1), lvl('powder-snow', 4),
    lvl('icy-wind', 10), lvl('take-down', 15), lvl('ice-fang', 20),
    lvl('ice-beam', 30),
    tutor('avalanche'), tutor('stone-edge'), tutor('recover')
  ],
  
  // Avalugg (Hisuian)
  'hisuian-avalugg': [
    lvl('tackle', 1), lvl('harden', 1), lvl('powder-snow', 1),
    lvl('icy-wind', 10), lvl('take-down', 15), lvl('ice-fang', 20),
    lvl('ice-beam', 30), lvl('mountain-gale', 1), lvl('stone-edge', 42),
    evo('mountain-gale'),
    tutor('avalanche'), tutor('rock-slide'), tutor('high-horsepower'), tutor('crunch')
  ],
  
  // Zorua (Hisuian)
  'hisuian-zorua': [
    lvl('scratch', 1), lvl('leer', 1), lvl('shadow-sneak', 4),
    lvl('spite', 8), lvl('extrasensory', 16), lvl('bitter-malice', 24),
    tutor('shadow-ball'), tutor('dark-pulse'), tutor('psychic')
  ],
  
  // Zoroark (Hisuian)
  'hisuian-zoroark': [
    lvl('scratch', 1), lvl('leer', 1), lvl('shadow-sneak', 1),
    lvl('spite', 8), lvl('extrasensory', 16), lvl('bitter-malice', 24),
    lvl('shadow-ball', 32), lvl('nasty-plot', 40), lvl('shadow-claw', 48),
    tutor('dark-pulse'), tutor('psychic'), tutor('focus-blast'), tutor('flamethrower')
  ],
  
  // Rufflet
  'rufflet': [
    lvl('peck', 1), lvl('leer', 1), lvl('fury-attack', 5),
    lvl('wing-attack', 10), lvl('hone-claws', 15), lvl('slash', 20),
    lvl('air-slash', 28), lvl('brave-bird', 37),
    tutor('close-combat'), tutor('rock-slide'), tutor('superpower')
  ],
  
  // Braviary (Hisuian)
  'hisuian-braviary': [
    lvl('peck', 1), lvl('leer', 1), lvl('fury-attack', 1),
    lvl('wing-attack', 10), lvl('hone-claws', 15), lvl('slash', 20),
    lvl('air-slash', 28), lvl('brave-bird', 37), lvl('esper-wing', 1),
    lvl('hurricane', 50),
    evo('esper-wing'),
    tutor('close-combat'), tutor('psychic'), tutor('superpower'), tutor('zen-headbutt')
  ],
  
  // Petilil
  'petilil': [
    lvl('absorb', 1), lvl('growth', 1), lvl('sleep-powder', 4),
    lvl('mega-drain', 10), lvl('leech-seed', 16), lvl('magical-leaf', 22),
    lvl('energy-ball', 31),
    tutor('giga-drain'), tutor('grass-knot'), tutor('healing-wish')
  ],
  
  // Lilligant (Hisuian)
  'hisuian-lilligant': [
    lvl('absorb', 1), lvl('growth', 1), lvl('sleep-powder', 1),
    lvl('mega-drain', 10), lvl('leech-seed', 16), lvl('magical-leaf', 22),
    lvl('energy-ball', 31), lvl('victory-dance', 1), lvl('close-combat', 42),
    evo('victory-dance'),
    tutor('giga-drain'), tutor('grass-knot'), tutor('ice-spinner'), tutor('drain-punch')
  ],
  
  // Goomy
  'goomy': [
    lvl('tackle', 1), lvl('absorb', 1), lvl('bubble', 5),
    lvl('dragon-breath', 10), lvl('protect', 15), lvl('flail', 20),
    lvl('water-pulse', 25), lvl('dragon-pulse', 32),
    tutor('sludge-bomb'), tutor('thunderbolt'), tutor('ice-beam')
  ],
  
  // Sliggoo (Hisuian)
  'hisuian-sliggoo': [
    lvl('tackle', 1), lvl('absorb', 1), lvl('bubble', 1),
    lvl('dragon-breath', 10), lvl('protect', 15), lvl('acid-spray', 20),
    lvl('water-pulse', 25), lvl('dragon-pulse', 32), lvl('iron-head', 38),
    tutor('sludge-bomb'), tutor('thunderbolt'), tutor('flash-cannon')
  ],
  
  // Goodra (Hisuian)
  'hisuian-goodra': [
    lvl('tackle', 1), lvl('absorb', 1), lvl('dragon-breath', 1),
    lvl('protect', 15), lvl('acid-spray', 20), lvl('water-pulse', 25),
    lvl('dragon-pulse', 32), lvl('iron-head', 38), lvl('shelter', 1),
    lvl('outrage', 50),
    evo('shelter'),
    tutor('sludge-bomb'), tutor('thunderbolt'), tutor('flash-cannon'), tutor('ice-beam')
  ],
  
  // Overqwil
  'overqwil': [
    lvl('poison-sting', 1), lvl('bite', 1), lvl('spikes', 8),
    lvl('pin-missile', 14), lvl('barb-barrage', 1), lvl('crunch', 28),
    lvl('poison-jab', 35), lvl('dark-pulse', 42),
    evo('barb-barrage'),
    tutor('sludge-bomb'), tutor('ice-beam'), tutor('thunder-wave'), tutor('gunk-shot')
  ],
  
  // Enamorus
  'enamorus': [
    lvl('astonish', 1), lvl('fairy-wind', 1), lvl('draining-kiss', 7),
    lvl('extrasensory', 13), lvl('flatter', 19), lvl('twister', 25),
    lvl('uproar', 31), lvl('mystical-fire', 37), lvl('springtide-storm', 49),
    tutor('moonblast'), tutor('psychic'), tutor('focus-blast'), tutor('grass-knot')
  ],
};

// Default learnset for Pokémon not explicitly defined
export const defaultLearnset: LearnsetEntry[] = [
  lvl('tackle', 1),
  lvl('growl', 1),
  tutor('rest'),
  tutor('protect')
];

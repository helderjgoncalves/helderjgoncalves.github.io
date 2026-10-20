export interface Photo {
  /** The grid tile, /photos/<trip>/800/<name>.jpg; the other sizes sit beside it (sizedSrc). */
  src: string;
  alt: string;
  caption: string;
  /** Where it was, shown under the caption: 'Country · one short detail'. */
  place?: string;
  width: number;
  height: number;
  /** Landscape shots span two grid columns on the full page. */
  wide?: boolean;
  /** CSS object-position, for subjects that sit off-centre in the crop. */
  focus?: string;
  /** A placeholder standing in for a trip's real photos. The build lists them. */
  sample?: boolean;
  /**
   * No original to rebuild from, so 2048/ holds the one copy there is (about
   * 1024 px) and there's no 1280/ or AVIF. Every other still is made from the
   * original at both sizes; see largeSrcSet.
   */
  lowRes?: boolean;
  /** The original's long side, when it's too small for the 2880 px AVIF. */
  originalLong?: number;
  /**
   * The name of a short clip on the media host, played in the viewer in place
   * of the photo, which becomes its poster. Loaded only on play. See videoSources.
   */
  video?: string;
}

/** Clips live in R2, on the bucket's custom domain, not in the repo. */
const MEDIA_HOST = 'https://media.hgoncalves.uk';

/**
 * A clip's copies, in the order the browser should try them: AV1, then HEVC
 * for Apple devices without an AV1 decoder. Both are 10-bit HLG; the codec
 * strings let a browser skip the one it can't play without downloading it.
 * Filed in R2 like the photos: <trip>/<codec>/<name>.mp4.
 */
export function videoSources(photo: Photo): { src: string; type: string }[] {
  if (!photo.video) return [];
  const trip = photo.src.split('/')[2];
  return [
    { src: `${MEDIA_HOST}/${trip}/av1/${photo.video}.mp4`, type: 'video/mp4; codecs="av01.0.09M.10"' },
    { src: `${MEDIA_HOST}/${trip}/hevc/${photo.video}.mp4`, type: 'video/mp4; codecs="hvc1.2.4.L123.B0"' },
  ];
}

/** Shown in the viewer, over the still, when a clip fails to load. */
export const videoUnavailable = 'The video isn’t available right now.';

/** Shown instead when the browser can play none of the clip's copies. */
export const videoUnsupported = 'This browser can’t play this video.';

/**
 * Every photo on the site, described once. The home page and the trip pages
 * pick from here, so a photo that appears on both can't drift apart.
 */
export const photos = {
  summitNight: {
    src: '/photos/bolivia/800/summit-night.jpg',
    alt: 'On the snowy summit of Huayna Potosí at night in crampons and a helmet, the lights of La Paz far below',
    caption: 'Huayna Potosí',
    place: 'Bolivia · the 6,088\u00a0m summit, before dawn',
    width: 800,
    height: 600,
    wide: true,
    focus: '70% 50%',
  },
  aboveTheClouds: {
    src: '/photos/bolivia/800/above-the-clouds.jpg',
    alt: 'Sunrise over a sea of clouds from the snow ridge of Huayna Potosí',
    caption: 'Huayna Potosí',
    place: 'Bolivia · sunrise above the clouds',
    width: 600,
    height: 800,
  },
  volcano: {
    src: '/photos/guatemala/800/volcano.jpg',
    alt: 'Volcán de Fuego erupting at night, lava running down its flanks under the stars',
    caption: 'Volcán de Fuego',
    place: 'Guatemala · seen from 4,000\u00a0m',
    width: 600,
    height: 800,
  },
  torresDelPaine: {
    src: '/photos/patagonia/800/torres-del-paine.jpg',
    alt: 'Jumping star-shaped on a rock at the turquoise lagoon below the granite towers of Torres del Paine',
    caption: 'Torres del Paine',
    place: 'Chile · Base Las Torres',
    width: 450,
    height: 800,
    focus: '50% 60%',
  },
  lagoPehoe: {
    src: '/photos/patagonia/800/lago-pehoe.jpg',
    alt: 'Video from a catamaran crossing turquoise Lago Pehoé, panning from the dark-capped Cuernos del Paine to snowy peaks',
    caption: 'Lago Pehoé',
    place: 'Chile · crossing under the Cuernos',
    width: 450,
    height: 800,
    video: 'lago-pehoe',
  },
  paineMassif: {
    src: '/photos/patagonia/800/paine-massif.jpg',
    alt: 'Video across Lago Pehoé to the snowy Paine massif and the dark-capped Cuernos under drifting clouds',
    caption: 'Lago Pehoé',
    place: 'Chile · the Paine massif across the water',
    width: 800,
    height: 450,
    wide: true,
    video: 'paine-massif',
  },
  lagoGreyClip: {
    src: '/photos/patagonia/800/lago-grey-clip.jpg',
    alt: 'Video from the rocks above Lago Grey, icebergs drifting on the pale water below the mountains',
    caption: 'Lago Grey',
    place: 'Chile · icebergs on the lake',
    width: 450,
    height: 800,
    video: 'lago-grey',
  },
  chileanFlag: {
    src: '/photos/patagonia/800/chilean-flag.jpg',
    alt: 'A frayed Chilean flag snapping in the wind from a white mast against a deep blue sky',
    caption: 'Lago Pehoé',
    place: 'Chile · a flag worn by the wind',
    width: 600,
    height: 800,
  },
  lasTorres: {
    src: '/photos/patagonia/800/las-torres.jpg',
    alt: 'The three granite towers of Torres del Paine rising above a pale turquoise lagoon under a clear blue sky',
    caption: 'Las Torres',
    place: 'Chile · the three granite towers',
    width: 600,
    height: 800,
  },
  cuernosDelPaine: {
    src: '/photos/patagonia/800/cuernos-del-paine.jpg',
    alt: 'The dark-capped peaks of the Cuernos del Paine above golden grassy hills and a turquoise lake',
    caption: 'Cuernos del Paine',
    place: 'Chile · Torres del Paine',
    width: 600,
    height: 800,
  },
  fitzRoy: {
    src: '/photos/patagonia/800/fitz-roy.jpg',
    alt: 'Hikers on a rocky trail climbing towards the jagged, snow-flecked peaks of Fitz Roy under a deep blue sky',
    caption: 'Fitz Roy',
    place: 'Argentina · trail to Laguna de los Tres',
    width: 600,
    height: 800,
  },
  rioDeLasVueltas: {
    src: '/photos/patagonia/800/rio-de-las-vueltas.jpg',
    alt: 'A braided turquoise river winding along a wide valley floor between dry mountains, seen from a rocky slope above',
    caption: 'Río de las Vueltas',
    place: 'Argentina · El Chaltén',
    width: 600,
    height: 800,
  },
  lomaDelPliegueTumbado: {
    src: '/photos/patagonia/800/loma-del-pliegue-tumbado.jpg',
    alt: 'A hiker with trekking poles and an orange backpack walking a stony path across a bare ridge under a cloudless sky',
    caption: 'Loma del Pliegue Tumbado',
    place: 'Argentina · El Chaltén',
    width: 600,
    height: 800,
  },
  pliegueTumbadoSummit: {
    src: '/photos/patagonia/800/pliegue-tumbado-summit.jpg',
    alt: 'From a stony summit, bare brown hills fall away to a wide plain and a long turquoise lake under a deep blue sky',
    caption: 'Loma del Pliegue Tumbado',
    place: 'Argentina · Lago Viedma from the top',
    width: 600,
    height: 800,
  },
  falcon: {
    src: '/photos/patagonia/800/falcon.jpg',
    alt: 'A brown falcon perched on a rock, the turquoise lake and the steppe spread out far below',
    caption: 'Loma del Pliegue Tumbado',
    place: 'Argentina · a falcon at the top',
    width: 600,
    height: 800,
  },
  rioElectricoBridge: {
    src: '/photos/patagonia/800/rio-electrico-bridge.jpg',
    alt: 'Video from the stony bank of a turquoise river, panning from a red steel footbridge to a rocky peak up the valley',
    caption: 'Río Eléctrico',
    place: 'Argentina · the footbridge over the river',
    width: 450,
    height: 800,
    video: 'rio-electrico-bridge',
  },
  rioElectrico: {
    src: '/photos/patagonia/800/rio-electrico.jpg',
    alt: 'A wide turquoise river braiding over gravel bars towards a rust-coloured peak and snowy mountains under soft cloud',
    caption: 'Río Eléctrico',
    place: 'Argentina · snow peaks up the valley',
    width: 600,
    height: 800,
  },
  rioElectricoValley: {
    src: '/photos/patagonia/800/rio-electrico-valley.jpg',
    alt: 'A clear stream running through green scrub and stones on a valley floor, snowy peaks ahead under a wide blue sky',
    caption: 'Río Eléctrico',
    place: 'Argentina · along the valley floor',
    width: 600,
    height: 800,
  },
  lagunaTorre: {
    src: '/photos/patagonia/800/laguna-torre.jpg',
    alt: 'Video from a stony slope panning from the spires of Cerro Torre and Fitz Roy, above a pale lagoon, out over the valley to the steppe',
    caption: 'Laguna Torre',
    place: 'Argentina · under Cerro Torre',
    width: 450,
    height: 800,
    video: 'laguna-torre',
  },
  losTresBoardwalk: {
    src: '/photos/patagonia/800/los-tres-boardwalk.jpg',
    alt: 'Video walking a wooden boardwalk across a green marsh, ending on the snowy spires of Fitz Roy',
    caption: 'Laguna de los Tres',
    place: 'Argentina · boardwalk over the marsh',
    width: 450,
    height: 800,
    video: 'los-tres-boardwalk',
  },
  lagunaDeLosTres: {
    src: '/photos/patagonia/800/laguna-de-los-tres.jpg',
    alt: 'Video panning from a turquoise lagoon in a rocky bowl up to the granite spires of Fitz Roy',
    caption: 'Laguna de los Tres',
    place: 'Argentina · under Fitz Roy',
    width: 450,
    height: 800,
    video: 'laguna-de-los-tres',
  },
  miradorDeLosCondores: {
    src: '/photos/patagonia/800/mirador-de-los-condores.jpg',
    alt: 'Video panning from dry hills and a bare white tree across a green slope to a river winding down the valley',
    caption: 'Mirador de los Cóndores',
    place: 'Argentina · over the valley',
    width: 450,
    height: 800,
    video: 'mirador-de-los-condores',
  },
  miradorDeLasAguilas: {
    src: '/photos/patagonia/800/mirador-de-las-aguilas.jpg',
    alt: 'From a rocky viewpoint, golden steppe runs down to a turquoise lake and distant mountains under big white clouds',
    caption: 'Mirador de las Águilas',
    place: 'Argentina · over the steppe to Lago Viedma',
    width: 600,
    height: 800,
  },
  lagoViedma: {
    src: '/photos/patagonia/800/lago-viedma.jpg',
    alt: 'A turquoise lake with a pale inlet in the foreground, low mountains behind it and white clouds above',
    caption: 'Mirador de las Águilas',
    place: 'Argentina · Lago Viedma',
    width: 600,
    height: 800,
  },
  glacier: {
    src: '/photos/patagonia/800/glacier.jpg',
    alt: 'The blue-white front of the Perito Moreno Glacier meeting a grey-green lake',
    caption: 'Perito Moreno Glacier',
    place: 'Argentina · Patagonia',
    width: 600,
    height: 800,
  },
  rainbowMountain: {
    src: '/photos/peru/800/rainbow-mountain.jpg',
    alt: 'Crouching in a beanie and down jacket on a dusty ridge, the red, ochre and green stripes of Rainbow Mountain behind under a cloudy sky',
    caption: 'Rainbow Mountain',
    place: 'Peru · Vinicunca',
    width: 600,
    height: 800,
  },
  saltFlatJump: {
    src: '/photos/bolivia/800/salt-flat-jump.jpg',
    alt: 'Jumping mid-air on the mirrored Salar de Uyuni at sunset, reflection below',
    caption: 'Salar de Uyuni',
    place: 'Bolivia · the world’s largest salt flat',
    width: 600,
    height: 800,
  },
  machuPicchu: {
    src: '/photos/peru/800/machu-picchu.jpg',
    alt: 'Arms wide in front of Machu Picchu and the green peaks behind it',
    caption: 'Machu Picchu',
    place: 'Peru · a New Seven Wonder',
    width: 600,
    height: 800,
  },
  lakeSunset: {
    src: '/photos/peru/800/lake-sunset.jpg',
    alt: 'Silhouette watching the sun set over Lake Titicaca from Amantaní Island',
    caption: 'Amantaní Island',
    place: 'Peru · sunset over Lake Titicaca',
    width: 600,
    height: 800,
    focus: '50% 30%',
  },
  motorcycle: {
    src: '/photos/other/800/motorcycle.jpg',
    alt: 'Sitting on a dark red motorcycle on a forest road',
    caption: 'Forest roads',
    width: 600,
    height: 800,
    lowRes: true,
  },
  snowboard: {
    src: '/photos/other/800/snowboard.jpg',
    alt: 'Smiling in sunglasses, holding a red snowboard upright on a sunny snow slope',
    caption: 'Snowboarding',
    width: 599,
    height: 800,
    originalLong: 2049,
  },
  paragliding: {
    src: '/photos/other/800/paragliding.jpg',
    alt: 'Lifting off under a blue and yellow paraglider from a grassy launch, wind turbines on the ridge behind',
    caption: 'Paragliding',
    width: 600,
    height: 800,
    lowRes: true,
  },
  fuegoAsh: {
    src: '/photos/guatemala/800/fuego-ash.jpg',
    alt: 'A tall ash cloud rising from Volcán de Fuego above a sea of clouds, a line of people silhouetted on the ridge in front',
    caption: 'Volcán de Fuego',
    place: 'Guatemala · an ash cloud at dawn',
    width: 600,
    height: 800,
  },
  saltTables: {
    src: '/photos/bolivia/800/salt-tables.jpg',
    alt: 'Tables built from salt bricks on the white Salar de Uyuni, distant mountains under a wide blue sky',
    caption: 'Salar de Uyuni',
    place: 'Bolivia · salt-brick tables',
    width: 600,
    height: 800,
  },
  saltSunset: {
    src: '/photos/bolivia/800/salt-sunset.jpg',
    alt: 'Golden sunset mirrored in a thin layer of water on the Salar de Uyuni, low hills on the horizon',
    caption: 'Salar de Uyuni',
    place: 'Bolivia · sunset on the mirror',
    width: 600,
    height: 800,
  },
  milkyWay: {
    src: '/photos/bolivia/800/milky-way.jpg',
    alt: 'The Milky Way arching over a still lagoon, the moon rising in an orange glow behind dark hills',
    caption: 'Eduardo Avaroa Reserve',
    place: 'Bolivia · the Milky Way at moonrise',
    width: 600,
    height: 800,
  },
  semucChampey: {
    src: '/photos/guatemala/800/semuc-champey.jpg',
    alt: 'The turquoise limestone pools of Semuc Champey seen from a wooden lookout high above the jungle',
    caption: 'Semuc Champey',
    place: 'Guatemala · the pools from the lookout',
    width: 800,
    height: 600,
    wide: true,
  },
  ollantaytambo: {
    src: '/photos/peru/800/ollantaytambo.jpg',
    alt: 'An Inca stone water channel running through the ruins of Ollantaytambo, terraced mountains behind',
    caption: 'Ollantaytambo',
    place: 'Peru · Inca water channels',
    width: 600,
    height: 800,
  },
  sacsayhuaman: {
    src: '/photos/peru/800/sacsayhuaman.jpg',
    alt: 'The zigzag stone walls of Sacsayhuamán along a green esplanade above Cusco, under big clouds',
    caption: 'Sacsayhuamán',
    place: 'Peru · above Cusco',
    width: 600,
    height: 800,
  },
  alpacas: {
    src: '/photos/peru/800/alpacas.jpg',
    alt: 'Alpacas grazing in a high green valley below snow-capped Andean peaks',
    caption: 'Ausangate',
    place: 'Peru · alpacas below the snow',
    width: 600,
    height: 800,
  },
  deathRoad: {
    src: '/photos/bolivia/800/death-road.jpg',
    alt: 'On a mountain bike under the "Welcome to Death Road" sign at the bottom of the ride',
    caption: 'Death Road',
    place: 'Bolivia · made it to the bottom',
    width: 600,
    height: 800,
  },
  islaIncahuasi: {
    src: '/photos/bolivia/800/isla-incahuasi.jpg',
    alt: 'Standing on the rocks beside a giant cactus on Isla Incahuasi, in the middle of the salt flat',
    caption: 'Isla Incahuasi',
    place: 'Bolivia · giant cacti in a sea of salt',
    width: 600,
    height: 800,
  },
  lagunaHedionda: {
    src: '/photos/bolivia/800/laguna-hedionda.jpg',
    alt: 'Flamingos feeding in a blue lagoon below a reddish volcano',
    caption: 'Laguna Hedionda',
    place: 'Bolivia · flamingos below the volcanoes',
    width: 600,
    height: 800,
  },
  flamingos: {
    src: '/photos/bolivia/800/flamingos.jpg',
    alt: 'A flock of pink flamingos wading in a lagoon under a deep blue sky',
    caption: 'Laguna Hedionda',
    place: 'Bolivia · a flock of flamingos',
    width: 600,
    height: 800,
  },
  arbolDePiedra: {
    src: '/photos/bolivia/800/arbol-de-piedra.jpg',
    alt: 'The Árbol de Piedra, a wind-carved rock shaped like a tree, on the sandy Siloli Desert',
    caption: 'Árbol de Piedra',
    place: 'Bolivia · the stone tree of the Siloli Desert',
    width: 600,
    height: 800,
  },
  solDeManana: {
    src: '/photos/bolivia/800/sol-de-manana.jpg',
    alt: 'Standing with arms out in the steam of the Sol de Mañana geysers',
    caption: 'Sol de Mañana',
    place: 'Bolivia · geysers at almost 5,000\u00a0m',
    width: 600,
    height: 800,
  },
  sanTelmoMarket: {
    src: '/photos/argentina/800/san-telmo-market.jpg',
    alt: 'Food stalls under the iron roof of the San Telmo market',
    caption: 'Mercado de San Telmo',
    place: 'Argentina · Buenos Aires',
    width: 600,
    height: 800,
  },
  sanTelmo: {
    src: '/photos/argentina/800/san-telmo.jpg',
    alt: 'A busy street in San Telmo lined with old buildings and balconies',
    caption: 'San Telmo',
    place: 'Argentina · Buenos Aires',
    width: 600,
    height: 800,
  },
  torreMonumental: {
    src: '/photos/argentina/800/torre-monumental.jpg',
    alt: 'The brick clock tower of the Torre Monumental against a pink evening sky',
    caption: 'Torre Monumental',
    place: 'Argentina · Buenos Aires at dusk',
    width: 600,
    height: 800,
  },
  peritoMorenoLake: {
    src: '/photos/patagonia/800/perito-moreno-lake.jpg',
    alt: 'A walkway above Lago Argentino, a small boat on the water and mountains behind',
    caption: 'Perito Moreno Glacier',
    place: 'Argentina · Lago Argentino from the walkways',
    width: 600,
    height: 800,
  },
  peritoMorenoIcebergs: {
    src: '/photos/patagonia/800/perito-moreno-icebergs.jpg',
    alt: 'The jagged blue front of the Perito Moreno Glacier, icebergs floating below',
    caption: 'Perito Moreno Glacier',
    place: 'Argentina · icebergs off the ice front',
    width: 600,
    height: 800,
  },
  lagoGrey: {
    src: '/photos/patagonia/800/lago-grey.jpg',
    alt: 'Waving from the rocks on the shore of Lago Grey, icebergs and the glacier behind',
    caption: 'Lago Grey',
    place: 'Chile · icebergs from Grey Glacier',
    width: 600,
    height: 800,
  },

  pasoDeLosVientos: {
    src: '/photos/patagonia/800/paso-de-los-vientos.jpg',
    alt: 'Video from the Paso de los Vientos sign, panning over the green Ascencio valley and its river below grey peaks',
    caption: 'Paso de los Vientos',
    place: 'Chile · into the Ascencio valley',
    width: 450,
    height: 800,
    video: 'paso-de-los-vientos',
  },
  chilenoHorses: {
    src: '/photos/patagonia/800/chileno-horses.jpg',
    alt: 'Two saddled horses resting among the beech trees by Refugio Chileno',
    caption: 'Refugio Chileno',
    place: 'Chile · horses on the way to the towers',
    width: 600,
    height: 800,
  },
  rioAscencio: {
    src: '/photos/patagonia/800/rio-ascencio.jpg',
    alt: 'The Río Ascencio running clear over grey stones between beech woods, pale granite peaks above',
    caption: 'Río Ascencio',
    place: 'Chile · the river below Chileno',
    width: 600,
    height: 800,
  },
  lasTorresClimb: {
    src: '/photos/patagonia/800/las-torres-climb.jpg',
    alt: 'Hikers climbing the boulder field below Las Torres, the green Ascencio valley and snowy peaks behind',
    caption: 'Las Torres',
    place: 'Chile · the last climb, over the boulders',
    width: 600,
    height: 800,
  },
  lagunaInge: {
    src: '/photos/patagonia/800/laguna-inge.jpg',
    alt: 'Clouds and green hills mirrored in the still water of Laguna Inge',
    caption: 'Laguna Inge',
    place: 'Chile · a still morning on the water',
    width: 600,
    height: 800,
  },
  nordenskjoldHills: {
    src: '/photos/patagonia/800/nordenskjold-hills.jpg',
    alt: 'Dark folded rock layers slanting down a hill into the turquoise water of Lago Nordenskjöld, under low cloud',
    caption: 'Lago Nordenskjöld',
    place: 'Chile · folded hills across the water',
    width: 600,
    height: 800,
  },
  nordenskjoldTrail: {
    src: '/photos/patagonia/800/nordenskjold-trail.jpg',
    alt: 'Video from a stony slope panning along the pale turquoise length of Lago Nordenskjöld under grey cloud',
    caption: 'Lago Nordenskjöld',
    place: 'Chile · the trail above the lake',
    width: 450,
    height: 800,
    video: 'nordenskjold-trail',
  },
  lagunaIngeRainbow: {
    src: '/photos/patagonia/800/laguna-inge-rainbow.jpg',
    alt: 'Video from a stony slope over green steppe, ending on a small pond under a rainbow',
    caption: 'Laguna Inge',
    place: 'Chile · a rainbow over the steppe',
    width: 450,
    height: 800,
    video: 'laguna-inge-rainbow',
  },
  lagoGreyHill: {
    src: '/photos/patagonia/800/lago-grey-hill.jpg',
    alt: 'Video panning over windblown grass to the milky water of Lago Grey and the dark ridges beyond',
    caption: 'Lago Grey',
    place: 'Chile · grass bent by the wind',
    width: 450,
    height: 800,
    video: 'lago-grey-hill',
  },
  lagunaLosPatos: {
    src: '/photos/patagonia/800/laguna-los-patos.jpg',
    alt: 'Rocky islets in the deep blue water of Laguna Los Patos, bare branches in the foreground',
    caption: 'Laguna Los Patos',
    place: 'Chile · beside Lago Grey',
    width: 600,
    height: 800,
  },
  pudeto: {
    src: '/photos/patagonia/800/pudeto.jpg',
    alt: 'Video at the water’s edge, clouds mirrored in Lago Pehoé and the catamaran at its dock in Pudeto',
    caption: 'Lago Pehoé',
    place: 'Chile · the catamaran at Pudeto',
    width: 450,
    height: 800,
    video: 'pudeto',
  },
  paliAike: {
    src: '/photos/patagonia/800/pali-aike.jpg',
    alt: 'A small herd of guanacos crossing the steppe below a ridge of dark lava rock',
    caption: 'Pali Aike',
    place: 'Chile · guanacos below the lava',
    width: 600,
    height: 800,
  },
  lagunaBlancaRheas: {
    src: '/photos/patagonia/800/laguna-blanca-rheas.jpg',
    alt: 'Five rheas grazing among white daisies by a fence, a dry lake bed behind',
    caption: 'Laguna Blanca',
    place: 'Chile · rheas by the road south',
    width: 600,
    height: 800,
  },
  paliAikeRoad: {
    src: '/photos/patagonia/800/pali-aike-road.jpg',
    alt: 'A straight gravel road running to the horizon across flat steppe under a blue sky',
    caption: 'Pali Aike',
    place: 'Chile · the gravel road in',
    width: 600,
    height: 800,
  },
  paliAikeLookout: {
    src: '/photos/patagonia/800/pali-aike-lookout.jpg',
    alt: 'Video from a railed lookout on the lava rock, panning across the flat steppe to the horizon',
    caption: 'Pali Aike',
    place: 'Chile · the steppe from the lookout',
    width: 450,
    height: 800,
    video: 'pali-aike-lookout',
  },
  paliAikeTrail: {
    src: '/photos/patagonia/800/pali-aike-trail.jpg',
    alt: 'Video walking down steps onto a sandy trail through tussock grass, between the lava walls of a crater',
    caption: 'Pali Aike',
    place: 'Chile · into a crater with caves',
    width: 450,
    height: 800,
    video: 'pali-aike-trail',
  },
  moradaDelDiablo: {
    src: '/photos/patagonia/800/morada-del-diablo.jpg',
    alt: 'Video from the railing on the rim of the Morada del Diablo crater, its dark walls in shadow under the sun',
    caption: 'Morada del Diablo',
    place: 'Chile · a crater in Pali Aike',
    width: 450,
    height: 800,
    video: 'morada-del-diablo',
  },
  paliAikeFox: {
    src: '/photos/patagonia/800/pali-aike-fox.jpg',
    alt: 'Video of a grey fox trotting through the steppe grass below low hills',
    caption: 'Pali Aike',
    place: 'Chile · a grey fox on the steppe',
    width: 450,
    height: 800,
    video: 'pali-aike-fox',
  },
  tierraDelFuegoRoad: {
    src: '/photos/patagonia/800/tierra-del-fuego-road.jpg',
    alt: 'A paved road with yellow lines running straight over rolling scrubland under a grey sky',
    caption: 'Tierra del Fuego',
    place: 'Chile · the empty road south',
    width: 600,
    height: 800,
    wide: true,
    focus: '50% 60%',
  },
  lagunaDeLosCisnes: {
    src: '/photos/patagonia/800/laguna-de-los-cisnes.jpg',
    alt: 'A wooden boardwalk running straight out across dry grassland under a grey sky',
    caption: 'Laguna de los Cisnes',
    place: 'Chile · a boardwalk by Porvenir',
    width: 600,
    height: 800,
  },
  threeKingPenguins: {
    src: '/photos/patagonia/800/three-king-penguins.jpg',
    alt: 'Three king penguins walking across the grass between rope fences',
    caption: 'Bahía Inútil',
    place: 'Chile · three king penguins on the grass',
    width: 600,
    height: 800,
  },
  kingPenguinChicks: {
    src: '/photos/patagonia/800/king-penguin-chicks.jpg',
    alt: 'A crowd of king penguins close up, sleek adults among fluffy brown chicks',
    caption: 'Bahía Inútil',
    place: 'Chile · adults and their brown chicks',
    width: 600,
    height: 800,
  },
  kingPenguins: {
    src: '/photos/patagonia/800/king-penguins.jpg',
    alt: 'Video of a king penguin feeding its brown, downy chick among the colony on the grass',
    caption: 'Bahía Inútil',
    place: 'Chile · a king penguin feeding its chick',
    width: 450,
    height: 800,
    video: 'king-penguins',
  },
  porvenirShore: {
    src: '/photos/patagonia/800/porvenir-shore.jpg',
    alt: 'Video panning from a stony, grassy shore out over calm water under long streaks of cloud',
    caption: 'Tierra del Fuego',
    place: 'Chile · the shore near Porvenir',
    width: 450,
    height: 800,
    video: 'porvenir-shore',
  },
  leavingPatagonia: {
    src: '/photos/patagonia/800/leaving-patagonia.jpg',
    alt: 'Video from a plane window, the red-tipped wing over lakes and islands under scattered cloud',
    caption: 'Leaving Patagonia',
    place: 'Chile · from the plane window',
    width: 450,
    height: 800,
    video: 'leaving-patagonia',
  },
  valparaiso: {
    src: '/photos/chile/800/valparaiso.jpg',
    alt: 'Video walking a cobbled lane on Cerro Alegre, past a street guitarist, yellow houses and murals',
    caption: 'Valparaíso',
    place: 'Chile · the lanes of Cerro Alegre',
    width: 450,
    height: 800,
    video: 'valparaiso',
  },

  // Placeholders until the real photos arrive — swap each for a real entry.
  sampleYucatan: {
    src: '/photos/yucatan/800/sample-yucatan.jpg',
    alt: 'Placeholder: photos of Chichén Itzá to come',
    caption: 'Chichén Itzá',
    place: 'Mexico · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
  sampleBelize: {
    src: '/photos/belize/800/sample-belize.jpg',
    alt: 'Placeholder: photos of the Belize coast to come',
    caption: 'Caye Caulker',
    place: 'Belize · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
  sampleMorocco: {
    src: '/photos/morocco/800/sample-morocco.jpg',
    alt: 'Placeholder: photos of Morocco to come',
    caption: 'Marrakech',
    place: 'Morocco · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
  sampleRio: {
    src: '/photos/rio-de-janeiro/800/sample-rio-de-janeiro.jpg',
    alt: 'Placeholder: photos of Christ the Redeemer to come',
    caption: 'Christ the Redeemer',
    place: 'Brazil · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
  sampleArgentina: {
    src: '/photos/argentina/800/sample-argentina.jpg',
    alt: 'Placeholder: photos of Argentina to come',
    caption: 'Iguazú Falls',
    place: 'Argentina · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
} satisfies Record<string, Photo>;

/**
 * A photo at another size. Photos live by trip, then size:
 * /photos/<trip slug or other>/<long side>/<name>. `src` is the 800 px grid
 * tile, 1280 is for phones in the viewer, 2048 for laptops and 2880 (AVIF
 * only) for 4K and 5K. The build checks each photo sits in its trip's folder.
 */
function sizedSrc(photo: Photo, long: 1280 | 2048 | 2880): string {
  return photo.src.replace('/800/', `/${long}/`);
}

/**
 * The viewer's main copy, also the tile's link: 2048 px when made from the
 * original, or the one copy there is for lowRes photos and samples. Every
 * photo needs one — `npm test` fails if it's missing.
 */
export function largeSrc(photo: Photo): string {
  return sizedSrc(photo, 2048);
}

/**
 * The viewer's AVIF srcset and sizes, so phones fetch the 1280 px copy,
 * laptops the 2048 px one and 4K/5K screens the 2880 px one. The JPEG is
 * only a fallback for browsers without AVIF (Safari before macOS 13), so it
 * ships at 2048 alone. Undefined when there's only one copy (lowRes,
 * samples, video stills). Widths are in real pixels: a portrait photo's long
 * side is its height. The viewer fits the photo within the screen's width
 * and its height less the caption (`.viewer__img`), so the screen's shape
 * against the photo's says which one binds.
 */
export function largeSrcSet(
  photo: Photo,
  /** The biggest long side to offer, e.g. 1280 when the visitor asks to save data. */
  cap = Infinity,
): { srcSet: string; sizes: string } | undefined {
  if (photo.lowRes || photo.sample || photo.video) return undefined;
  const aspect = photo.width / photo.height;
  const width = (long: number) => Math.round(long * Math.min(1, aspect));
  const copies: [string, number][] = [
    [sizedSrc(photo, 1280), 1280],
    [largeSrc(photo), 2048],
  ];
  if ((photo.originalLong ?? Infinity) >= 2880) copies.push([sizedSrc(photo, 2880), 2880]);
  return {
    srcSet: copies
      .filter(([, long], i) => i === 0 || long <= cap)
      .map(([src, long]) => `${avifSrc(src)} ${width(long)}w`)
      .join(', '),
    sizes: `(min-aspect-ratio: ${photo.width}/${photo.height}) calc((100vh - 9rem) * ${aspect.toFixed(3)}), 100vw`,
  };
}

/**
 * Whether a photo has AVIFs, at every size it ships in; JPEGs exist only at
 * 800 and 2048 px. The AVIFs are made from the original (10-bit,
 * full-resolution colour); a clip's are its HDR poster. Samples and lowRes
 * photos have JPEGs only.
 */
export function hasAvif(photo: Photo): boolean {
  return !photo.sample && !photo.lowRes;
}

/** The AVIF beside a JPEG. The JPEG stays as the fallback and for crawlers. */
export function avifSrc(src: string): string {
  return src.replace(/\.jpg$/, '.avif');
}

/** Anchor id for a photo on the full page, from its file name: '/photos/volcano.jpg' → 'volcano'. */
export function photoId(photo: Photo): string {
  return photo.src.replace(/^.*\//, '').replace(/\.\w+$/, '');
}

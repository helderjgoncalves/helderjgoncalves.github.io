export interface Photo {
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
}

/**
 * Every photo on the site, described once. Off the clock and the trip pages
 * pick from here, so a photo that appears on both can't drift apart.
 */
export const photos = {
  summitNight: {
    src: '/photos/summit-night.jpg',
    alt: 'On the snowy summit of Huayna Potosí at night in crampons and a helmet, the lights of La Paz far below',
    caption: 'Huayna Potosí',
    place: 'Bolivia · the 6,088\u00a0m summit, before dawn',
    width: 800,
    height: 600,
    wide: true,
    focus: '70% 50%',
  },
  aboveTheClouds: {
    src: '/photos/above-the-clouds.jpg',
    alt: 'Sunrise over a sea of clouds from the snow ridge of Huayna Potosí',
    caption: 'Huayna Potosí',
    place: 'Bolivia · sunrise above the clouds',
    width: 600,
    height: 800,
  },
  volcano: {
    src: '/photos/volcano.jpg',
    alt: 'Volcán de Fuego erupting at night, lava running down its flanks under the stars',
    caption: 'Volcán de Fuego',
    place: 'Guatemala · seen from 4,000\u00a0m',
    width: 600,
    height: 800,
  },
  torresDelPaine: {
    src: '/photos/torres-del-paine.jpg',
    alt: 'Jumping star-shaped on a rock at the turquoise lagoon below the granite towers of Torres del Paine',
    caption: 'Torres del Paine',
    place: 'Chile · Base Las Torres',
    width: 450,
    height: 800,
    focus: '50% 60%',
  },
  lasTorres: {
    src: '/photos/las-torres.jpg',
    alt: 'The three granite towers of Torres del Paine rising above a pale turquoise lagoon under a clear blue sky',
    caption: 'Las Torres',
    place: 'Chile · the three granite towers',
    width: 600,
    height: 800,
  },
  cuernosDelPaine: {
    src: '/photos/cuernos-del-paine.jpg',
    alt: 'The dark-capped peaks of the Cuernos del Paine above golden grassy hills and a turquoise lake',
    caption: 'Cuernos del Paine',
    place: 'Chile · Torres del Paine',
    width: 600,
    height: 800,
  },
  fitzRoy: {
    src: '/photos/fitz-roy.jpg',
    alt: 'Hikers on a rocky trail climbing towards the jagged, snow-flecked peaks of Fitz Roy under a deep blue sky',
    caption: 'Fitz Roy',
    place: 'Argentina · trail to Laguna de los Tres',
    width: 600,
    height: 800,
  },
  rioDeLasVueltas: {
    src: '/photos/rio-de-las-vueltas.jpg',
    alt: 'A braided turquoise river winding along a wide valley floor between dry mountains, seen from a rocky slope above',
    caption: 'Río de las Vueltas',
    place: 'Argentina · El Chaltén',
    width: 600,
    height: 800,
  },
  lomaDelPliegueTumbado: {
    src: '/photos/loma-del-pliegue-tumbado.jpg',
    alt: 'A hiker with trekking poles and an orange backpack walking a stony path across a bare ridge under a cloudless sky',
    caption: 'Loma del Pliegue Tumbado',
    place: 'Argentina · El Chaltén',
    width: 600,
    height: 800,
  },
  glacier: {
    src: '/photos/glacier.jpg',
    alt: 'The blue-white front of the Perito Moreno Glacier meeting a grey-green lake',
    caption: 'Perito Moreno Glacier',
    place: 'Argentina · Patagonia',
    width: 600,
    height: 800,
  },
  rainbowMountain: {
    src: '/photos/rainbow-mountain.jpg',
    alt: 'Crouching in a beanie and down jacket on a dusty ridge, the red, ochre and green stripes of Rainbow Mountain behind under a cloudy sky',
    caption: 'Rainbow Mountain',
    place: 'Peru · Vinicunca',
    width: 600,
    height: 800,
  },
  saltFlatJump: {
    src: '/photos/salt-flat-jump.jpg',
    alt: 'Jumping mid-air on the mirrored Salar de Uyuni at sunset, reflection below',
    caption: 'Salar de Uyuni',
    place: 'Bolivia · the world’s largest salt flat',
    width: 600,
    height: 800,
  },
  machuPicchu: {
    src: '/photos/machu-picchu.jpg',
    alt: 'Arms wide in front of Machu Picchu and the green peaks behind it',
    caption: 'Machu Picchu',
    place: 'Peru · a New Seven Wonder',
    width: 600,
    height: 800,
  },
  lakeSunset: {
    src: '/photos/lake-sunset.jpg',
    alt: 'Silhouette watching the sun set over Lake Titicaca from Amantaní Island',
    caption: 'Amantaní Island',
    place: 'Peru · sunset over Lake Titicaca',
    width: 600,
    height: 800,
    focus: '50% 30%',
  },
  motorcycle: {
    src: '/photos/motorcycle.jpg',
    alt: 'Sitting on a dark red motorcycle on a forest road',
    caption: 'Forest roads',
    width: 600,
    height: 800,
  },
  snowboard: {
    src: '/photos/snowboard.jpg',
    alt: 'Smiling in sunglasses, holding a red snowboard upright on a sunny snow slope',
    caption: 'Snowboarding',
    width: 599,
    height: 800,
  },
  paragliding: {
    src: '/photos/paragliding.jpg',
    alt: 'Lifting off under a blue and yellow paraglider from a grassy launch, wind turbines on the ridge behind',
    caption: 'Paragliding',
    width: 600,
    height: 800,
  },
  fuegoAsh: {
    src: '/photos/fuego-ash.jpg',
    alt: 'A tall ash cloud rising from Volcán de Fuego above a sea of clouds, a line of people silhouetted on the ridge in front',
    caption: 'Volcán de Fuego',
    place: 'Guatemala · an ash cloud at dawn',
    width: 600,
    height: 800,
  },
  saltTables: {
    src: '/photos/salt-tables.jpg',
    alt: 'Tables built from salt bricks on the white Salar de Uyuni, distant mountains under a wide blue sky',
    caption: 'Salar de Uyuni',
    place: 'Bolivia · salt-brick tables',
    width: 600,
    height: 800,
  },
  saltSunset: {
    src: '/photos/salt-sunset.jpg',
    alt: 'Golden sunset mirrored in a thin layer of water on the Salar de Uyuni, low hills on the horizon',
    caption: 'Salar de Uyuni',
    place: 'Bolivia · sunset on the mirror',
    width: 600,
    height: 800,
  },

  // Placeholders until the real photos arrive — swap each for a real entry.
  sampleYucatan: {
    src: '/photos/sample-yucatan.jpg',
    alt: 'Placeholder: photos of Chichén Itzá to come',
    caption: 'Chichén Itzá',
    place: 'Mexico · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
  sampleBelize: {
    src: '/photos/sample-belize.jpg',
    alt: 'Placeholder: photos of the Belize coast to come',
    caption: 'Caye Caulker',
    place: 'Belize · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
  sampleMorocco: {
    src: '/photos/sample-morocco.jpg',
    alt: 'Placeholder: photos of Morocco to come',
    caption: 'Marrakech',
    place: 'Morocco · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
  sampleRio: {
    src: '/photos/sample-rio-de-janeiro.jpg',
    alt: 'Placeholder: photos of Christ the Redeemer to come',
    caption: 'Christ the Redeemer',
    place: 'Brazil · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
  sampleArgentina: {
    src: '/photos/sample-argentina.jpg',
    alt: 'Placeholder: photos of Argentina to come',
    caption: 'Iguazú Falls',
    place: 'Argentina · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
  sampleChile: {
    src: '/photos/sample-chile.jpg',
    alt: 'Placeholder: photos of the Atacama Desert to come',
    caption: 'Atacama Desert',
    place: 'Chile · sample photo',
    width: 600,
    height: 800,
    sample: true,
  },
} satisfies Record<string, Photo>;

/**
 * The bigger copy opened in the photo viewer. Every photo needs one at
 * /photos/large/<same name> — `npm test` fails if it's missing.
 */
export function largeSrc(photo: Photo): string {
  return photo.src.replace('/photos/', '/photos/large/');
}

/** Anchor id for a photo on the full page, from its file name: '/photos/volcano.jpg' → 'volcano'. */
export function photoId(photo: Photo): string {
  return photo.src.replace(/^.*\//, '').replace(/\.\w+$/, '');
}

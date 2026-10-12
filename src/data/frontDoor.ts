import { tripCountries, trips } from './trips';

export interface FrontDoorLink {
  eyebrow: string;
  title: string;
  line: string;
  href: string;
  cta: string;
}

const countryCount = new Set(trips.flatMap(tripCountries)).size;

export const frontDoor = {
  meta: {
    title: 'Hélder Gonçalves — Lead Software Engineer',
    description:
      'Lead Software Engineer on developer tools at OutSystems. Curriculum vitae, a home-lab case study, trip pages, and photos from life off the clock.',
  },
  intro:
    'Engineer by trade, explorer by habit. I build developer tools at OutSystems, used every day by thousands of engineers. The rest of the time I take what life has to offer: a summit before dawn, lava lighting up the night, sunset over the salt flats — and a long, slow dinner to finish.',
  doors: [
    {
      eyebrow: 'Life',
      title: 'Off the clock',
      line: 'Hobbies away from the laptop: travel, the odd ride and photography.',
      href: '/off-the-clock/',
      cta: 'See what I get up to',
    },
    {
      eyebrow: 'Travel',
      title: 'Trips',
      line: `Where the landscape sets the pace: ${trips.length} trips across ${countryCount} countries.`,
      href: '/trips/',
      cta: 'See the trips',
    },
    {
      eyebrow: 'Side project',
      title: 'Home lab',
      line: 'A private cloud for the family, with no inbound ports and zero-trust access.',
      href: '/homelab/',
      cta: "See how it's built",
    },
    {
      eyebrow: 'Work',
      title: 'Curriculum vitae',
      line: 'Ten years on developer tools: roles, results, education and awards.',
      href: '/cv/',
      cta: 'Read the CV',
    },
  ] satisfies FrontDoorLink[],
};

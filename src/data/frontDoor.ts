export interface FrontDoorLink {
  eyebrow: string;
  title: string;
  line: string;
  href: string;
  cta: string;
}

export const frontDoor = {
  meta: {
    title: 'Hélder Gonçalves — Lead Software Engineer',
    description:
      'Lead Software Engineer on developer tools at OutSystems. Curriculum vitae, a home-lab case study, and photos from travel and adventures.',
  },
  intro:
    'I build developer tools at OutSystems, used every day by thousands of engineers. Off the clock I travel, climb and ride whenever I can.',
  doors: [
    {
      eyebrow: 'Work',
      title: 'Curriculum vitae',
      line: 'Ten years on developer tools: roles, results, education and awards.',
      href: '/cv/',
      cta: 'Read the CV',
    },
    {
      eyebrow: 'Side project',
      title: 'Home lab',
      line: 'A private cloud for the family, with no inbound ports and zero-trust access.',
      href: '/homelab/',
      cta: 'View case study',
    },
    {
      eyebrow: 'Outside work',
      title: 'Off the clock',
      line: 'Travel, adventures and two wheels — a few photos from the road.',
      href: '/off-the-clock/',
      cta: 'See the photos',
    },
  ] satisfies FrontDoorLink[],
};

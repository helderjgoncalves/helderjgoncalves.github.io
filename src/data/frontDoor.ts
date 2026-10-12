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
      'Lead Software Engineer on developer tools at OutSystems. Curriculum vitae, a home-lab case study, and life off the clock across 26 countries.',
  },
  intro:
    'I build developer tools at OutSystems — ten years on one IDE, now bringing Mentor, its agentic AI, into ODC Studio. Away from work I travel: 26 countries so far, the higher and colder the better.',
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
      line: 'Travel, mountains and two wheels: 26 countries so far, and 4 of the 7 wonders of the world.',
      href: '/off-the-clock/',
      cta: 'See the photos',
    },
  ] satisfies FrontDoorLink[],
};

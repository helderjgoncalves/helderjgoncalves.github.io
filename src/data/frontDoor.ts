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
      'Lead Software Engineer on developer tools at OutSystems. Curriculum vitae, a home-lab case study, and photos from 26 countries of travel.',
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
      eyebrow: 'Off the clock',
      title: 'Travel',
      line: '26 countries so far: summits before sunrise, glaciers, salt flats and a volcano at night.',
      href: '/travel/',
      cta: 'See the photos',
    },
  ] satisfies FrontDoorLink[],
};

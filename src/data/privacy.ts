/** A run of text, a link within it, or a bold lead-in. */
export type PrivacyText = string | { label: string; href: string } | { strong: string };

export interface PrivacySection {
  id: string;
  title: string;
  /** Each paragraph is a run of text and links. */
  paragraphs: PrivacyText[][];
}

export interface PrivacyPageData {
  title: string;
  thesis: string;
  sections: PrivacySection[];
  meta: {
    title: string;
    description: string;
    canonical: string;
  };
}

const EMAIL = 'helder@hgoncalves.uk';
const mail = { label: EMAIL, href: `mailto:${EMAIL}` };

const github = {
  label: 'GitHub Privacy Statement',
  href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
};
const cloudflare = { label: 'Cloudflare Privacy Policy', href: 'https://www.cloudflare.com/privacypolicy/' };

export const privacy: PrivacyPageData = {
  title: 'Privacy notice',
  thesis:
    'How personal data is processed on this website, under Regulation (EU) 2016/679 (General Data Protection Regulation, "GDPR") and Portuguese Law No. 58/2019.',
  sections: [
    {
      id: 'controller',
      title: 'Data controller',
      paragraphs: [
        [
          'This website (hgoncalves.uk) is a personal, non-commercial website. The controller of the personal data described in this notice is Hélder Gonçalves, a private individual resident in Portugal ("the controller"), who may be contacted at ',
          mail,
          '.',
        ],
      ],
    },
    {
      id: 'data',
      title: 'Data processed',
      paragraphs: [
        [
          { strong: 'Browsing.' },
          ' The website does not use analytics, advertising, tracking technologies or social media plugins, and the controller does not collect personal data from visitors who only browse it. When a page is requested, the hosting and network providers listed below process technical data, such as the IP address, browser type, the page requested and the date and time of the request, which is necessary to deliver the page and to protect the service.',
        ],
        [
          { strong: 'Contact form.' },
          ' When a visitor sends a message through the trip-tips form, the following data is processed: email address (required), name and destination (optional), the content of the message, and the page from which it was sent. The IP address is used transiently to limit the number of messages per visitor and to verify, through Cloudflare Turnstile, that the request is not automated. Turnstile is loaded only when the form is opened.',
        ],
        [
          'Providing data through the form is voluntary. The email address is required solely so that the controller can reply. No automated decision-making, including profiling, takes place.',
        ],
      ],
    },
    {
      id: 'purposes',
      title: 'Purposes and legal bases',
      paragraphs: [
        [
          'Data submitted through the contact form is processed solely to respond to the enquiry and any subsequent correspondence. Technical data and the anti-abuse checks are processed to deliver the website and to protect it and the form from abuse. In both cases, the legal basis is the legitimate interest of the controller (Article 6(1)(f) GDPR) in answering the requests it receives and in keeping the website secure. Personal data is not used for marketing, is not added to any mailing list, and is not sold or shared with third parties for their own purposes.',
        ],
      ],
    },
    {
      id: 'recipients',
      title: 'Recipients and transfers',
      paragraphs: [
        [
          'The website is hosted by GitHub, Inc. (GitHub Pages). Its domain, video content and contact form are operated through Cloudflare, Inc., which also delivers form messages to the controller by email (Cloudflare Email Routing). These providers process data as service providers to the controller and, for the security and operation of their own services, under their own terms: see the ',
          github,
          ' and the ',
          cloudflare,
          '.',
        ],
        [
          'GitHub, Inc. and Cloudflare, Inc. are established in the United States and certified under the EU–U.S. Data Privacy Framework. Transfers to them rely on the European Commission adequacy decision of 10 July 2023 (Article 45 GDPR).',
        ],
      ],
    },
    {
      id: 'retention',
      title: 'Retention',
      paragraphs: [
        [
          'Messages received through the contact form, and any correspondence that follows, are kept only for as long as necessary to respond, and are deleted no later than twelve months after the last exchange, or earlier upon request. Technical data is retained by the providers above in accordance with their own policies. The controller does not keep any other record of visitors.',
        ],
      ],
    },
    {
      id: 'storage',
      title: 'Cookies and local storage',
      paragraphs: [
        [
          'The website does not set cookies. If a visitor selects a light or dark theme, that preference is stored in the browser\'s local storage on the visitor\'s own device and is never transmitted. This storage is strictly necessary to provide a feature expressly requested by the visitor and is therefore exempt from consent under Article 5(3) of Directive 2002/58/EC, as transposed by Portuguese Law No. 41/2004. It can be removed at any time by clearing the browser\'s site data.',
        ],
      ],
    },
    {
      id: 'rights',
      title: 'Your rights',
      paragraphs: [
        [
          'Under Articles 15 to 21 GDPR, data subjects have the right to access their personal data, to have it rectified or erased, to restrict its processing and to object to it. Requests may be sent to ',
          mail,
          ' and will be answered within one month of receipt (Article 12(3) GDPR).',
        ],
        [
          'Data subjects also have the right to lodge a complaint with a supervisory authority (Article 77 GDPR). In Portugal, this is the Comissão Nacional de Proteção de Dados (',
          { label: 'CNPD', href: 'https://www.cnpd.pt' },
          ').',
        ],
      ],
    },
    {
      id: 'copyright',
      title: 'Copyright and image rights',
      paragraphs: [
        [
          'All photographs, videos and texts on this website are the exclusive work of Hélder Gonçalves and are protected under the Portuguese Code of Copyright and Related Rights and international copyright law. All rights are reserved. No one may reproduce, download for reuse, distribute, publish, modify or otherwise use them, in whole or in part, for any purpose, commercial or not, without his prior written authorisation, which may be requested at ',
          mail,
          '. Their availability on this website grants no licence of any kind.',
        ],
        [
          'The use of this website and its content for text and data mining, including the training of artificial intelligence models, is expressly reserved under Article 4(3) of Directive (EU) 2019/790. This reservation is also stated in machine-readable form in the website\'s robots.txt and metadata.',
        ],
        [
          'Any person depicted in a photograph or video who wishes it to be removed may request this at ',
          mail,
          ', and it will be removed without undue delay. The source code of the website is available for non-commercial use under the ',
          {
            label: 'PolyForm Noncommercial License 1.0.0',
            href: 'https://github.com/helderjgoncalves/helderjgoncalves.github.io/blob/main/LICENSE.md',
          },
          '.',
        ],
      ],
    },
    {
      id: 'changes',
      title: 'Changes',
      paragraphs: [
        [
          'This notice may be updated to reflect changes to the website or to applicable law. The version published on this page is the one in force.',
        ],
      ],
    },
  ],
  meta: {
    title: 'Privacy notice · Hélder Gonçalves',
    description:
      'Privacy notice for hgoncalves.uk: the personal data processed through the contact form, its legal bases, recipients, retention and your rights under the GDPR.',
    canonical: 'https://hgoncalves.uk/privacy/',
  },
};

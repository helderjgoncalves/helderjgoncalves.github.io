export interface HomelabDecision {
  title: string;
  description: string;
  /** Optional outbound proof for the claim — rendered under the description. */
  evidence?: { label: string; href: string };
}

export interface HomelabStackItem {
  name: string;
  purpose: string;
}

export interface HomelabCta {
  label: string;
  href: string;
  external?: boolean;
  primary?: boolean;
}

export interface HomelabPageData {
  title: string;
  /** A word of the title set in the hero's cool colours. */
  highlight: string;
  thesis: string;
  intro: string;
  decisions: HomelabDecision[];
  stack: HomelabStackItem[];
  ctas: HomelabCta[];
  meta: {
    title: string;
    description: string;
    canonical: string;
    /** Absolute URL of the 1200x630 social card for this page. */
    image: string;
    /** ISO date the page first went live. Feeds TechArticle.datePublished. */
    datePublished: string;
  };
}

export const homelab: HomelabPageData = {
  title: 'Self-Hosted Home Lab',
  highlight: 'Home Lab',
  thesis: 'NAS private cloud — no inbound ports, zero-trust at the edge, declarative and versioned in Git.',
  intro:
    'A family-facing private cloud on a NAS: photos, files, media, and monitoring — all self-hosted, HTTPS everywhere, and declared as code, so every stack redeploys onto fresh hardware straight from this repo.',
  decisions: [
    {
      title: 'No inbound ports',
      description:
        'All external traffic enters via Cloudflare Tunnel, and the Tailscale VPN dials out the same way. Every service here is published outbound-only; none of them needs a forwarded port or a public IP.',
    },
    {
      title: 'One hostname everywhere',
      description:
        'Public DNS resolves to Cloudflare; AdGuard Home rewrites map the same names to internal IPs for LAN and VPN clients alike, and resolves everything else over DoH. Either way the request hits the same reverse proxy — same URLs, same TLS, same app logins, one bookmark.',
    },
    {
      title: 'Auth at the edge',
      description:
        'Cloudflare Access enforces SSO/OAuth for humans, service tokens and mTLS for machines — every policy evaluated at the edge, not inside the apps. The apps keep their own logins behind that, and there is no public origin to go around it.',
    },
    {
      title: 'Least privilege on the VPN',
      description:
        'VPN traffic reaches Traefik directly, skipping Cloudflare Access, so per-route allowlists carry it instead: family devices get only the public apps behind their own logins, and admin UIs answer to my devices alone.',
    },
    {
      title: 'Monitors that can’t take over',
      description:
        'Uptime Kuma and Beszel see Docker through a read-only proxy: they list containers and read their state, but can’t create, start, stop or exec. Only the stack manager can deploy. A compromised monitor could read what it watches, never run anything on the NAS.',
    },
    {
      title: 'Layered monitoring',
      description:
        'Uptime Kuma covers container and HTTP liveness, Beszel covers resources, and Better Stack probes the public path from outside. Alerts converge on ntfy — and Better Stack also expects a heartbeat on a schedule, so a lab that goes dark entirely, ntfy included, still raises an alarm: the missing heartbeat is the alert.',
      evidence: { label: 'Live status page', href: 'https://status.hgoncalves.uk' },
    },
    {
      title: 'Updates that know when to ask',
      description:
        'Updates run unattended. Each compose tag sets how far an app moves on its own, and a release past it raises a push. An LLM on Workers AI judges the releases the rules can’t from their notes; critical majors wait for me. Every upgrade backs up first and rolls back if unhealthy.',
      evidence: {
        label: 'The updater on GitHub',
        href: 'https://github.com/helderjgoncalves/Homelab-Infrastructure/tree/main/updates',
      },
    },
    {
      title: 'Secrets stay out of Git',
      description:
        'Every stack is compose-as-code with .env.example templates. Runtime secrets live only in ignored env files; config is reproducible, credentials are not. CI scans the whole Git history for leaks on every push.',
      evidence: {
        label: 'CI on every push',
        href: 'https://github.com/helderjgoncalves/Homelab-Infrastructure/actions/workflows/validate.yml',
      },
    },
  ],
  stack: [
    { name: 'Immich', purpose: 'Photo / video library and phone backup' },
    { name: 'OpenCloud', purpose: 'File sync and collaboration' },
    { name: 'Plex / Plexamp', purpose: 'Media (runs on the NAS; not in the repo)' },
    { name: 'Home Assistant', purpose: 'Home automation' },
    { name: 'Cloudflare Tunnel', purpose: 'Outbound-only ingress, Access, mTLS' },
    { name: 'Tailscale', purpose: 'ACL-scoped VPN for family devices and admin' },
    { name: 'Traefik', purpose: 'TLS termination, per-host routing and access lists' },
    { name: 'AdGuard Home', purpose: 'DNS over HTTPS upstream, ad blocking, LAN hostname rewrites' },
    { name: 'Dockge', purpose: 'Compose stack manager' },
    { name: 'Uptime Kuma', purpose: 'Container and HTTP liveness probes' },
    { name: 'Beszel', purpose: 'CPU, RAM, disk, temperature metrics' },
    { name: 'ntfy', purpose: 'Push alerts for every monitoring layer' },
  ],
  ctas: [
    {
      label: 'View on GitHub',
      href: 'https://github.com/helderjgoncalves/Homelab-Infrastructure',
      external: true,
      primary: true,
    },
    {
      label: 'Public status page',
      href: 'https://status.hgoncalves.uk',
      external: true,
    },
  ],
  meta: {
    title: 'Self-Hosted Home Lab · Hélder Gonçalves',
    description:
      'Case study of a NAS private cloud: no inbound ports, Cloudflare Tunnel into Traefik, zero-trust access, monitoring and self-reverting updates, all declared in Git.',
    canonical: 'https://hgoncalves.uk/homelab/',
    image: 'https://hgoncalves.uk/og/homelab.jpg',
    datePublished: '2026-08-10',
  },
};

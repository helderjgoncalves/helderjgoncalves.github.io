/** Architecture overview as an accessible SVG (mirrors the Homelab README diagram). */

// Both layouts read their copy from here so the wide and narrow diagrams can
// never drift apart. Only the geometry differs between them.
const TEXT = {
  title: 'Homelab architecture',
  desc:
    'Internet traffic reaches Cloudflare edge for DNS, WAF, TLS, and Access, then enters the ' +
    'homelab through a Cloudflare Tunnel. LAN and Tailscale clients resolve the same hostnames ' +
    'via AdGuard Home and, like the tunnel, land on a reverse proxy that applies per-host access lists ' +
    'and routes to self-hosted services. Dockge and monitoring run alongside, outside the request path.',
  internet: 'Internet',
  httpsOnly: 'HTTPS only',
  cloudflare: 'Cloudflare (Edge)',
  cloudflareAuth: 'DNS · WAF / TLS · Access (OAuth / SSO)',
  cloudflareMtls: 'mTLS · service tokens',
  tunnel: 'Cloudflare Tunnel',
  boundary: 'Homelab (NAS)',
  cloudflared: 'cloudflared',
  cloudflaredSub: 'tunnel',
  lan: 'LAN · Tailscale',
  // Short form deliberately: the box is 148 units wide in the narrow layout and
  // 'AdGuard Home · same names' overflows it. Full name is in the stack list.
  lanSub: 'AdGuard · same names',
  proxy: 'Reverse proxy',
  proxySub: 'Traefik · HTTPS · ACLs',
  services: 'Self-hosted services',
  servicesSub: 'Immich · OpenCloud · ntfy · …',
  supporting: 'Supporting services · not in the request path',
  dockge: 'Dockge',
  dockgeSub: 'stack management',
  monitoring: 'Monitoring',
  monitoringSub: 'Kuma · Beszel → ntfy',
} as const;

/**
 * Arrowhead for the connectors. Defined per layout because a marker inside a
 * `display: none` SVG is not reliably referenceable from a sibling one. refX
 * puts the tip on the line's end point, so it meets the target box edge
 * without overshooting into it.
 */
function ArrowMarker({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto"
      >
        <path className="homelab-arch__arrowhead" d="M 0 1 L 9 5 L 0 9 z" />
      </marker>
    </defs>
  );
}

/**
 * Landscape layout, shown from the md breakpoint up. Its 720-unit viewBox
 * scales with the container, so it is only used where there is enough width to
 * keep the 10–13px type readable.
 */
function WideDiagram() {
  const arrow = 'url(#homelab-arrow-wide)';
  return (
    <svg
      className="homelab-arch__svg homelab-arch__svg--wide"
      viewBox="0 0 720 464"
      role="img"
      aria-labelledby="homelab-arch-title-wide homelab-arch-desc-wide"
    >
      <title id="homelab-arch-title-wide">{TEXT.title}</title>
      <desc id="homelab-arch-desc-wide">{TEXT.desc}</desc>
      <ArrowMarker id="homelab-arrow-wide" />

      <rect className="homelab-arch__box homelab-arch__box--edge" x="260" y="8" width="200" height="40" rx="8" />
      <text className="homelab-arch__label" x="360" y="33" textAnchor="middle">
        {TEXT.internet}
      </text>

      <line className="homelab-arch__line" x1="360" y1="48" x2="360" y2="72" markerEnd={arrow} />
      <text className="homelab-arch__caption" x="372" y="66">
        {TEXT.httpsOnly}
      </text>

      <rect className="homelab-arch__box homelab-arch__box--cf" x="200" y="72" width="320" height="72" rx="8" />
      <text className="homelab-arch__label" x="360" y="96" textAnchor="middle">
        {TEXT.cloudflare}
      </text>
      <text className="homelab-arch__sub" x="360" y="116" textAnchor="middle">
        {TEXT.cloudflareAuth}
      </text>
      <text className="homelab-arch__sub" x="360" y="132" textAnchor="middle">
        {TEXT.cloudflareMtls}
      </text>

      <line className="homelab-arch__line" x1="360" y1="144" x2="360" y2="176" markerEnd={arrow} />
      <text className="homelab-arch__caption" x="372" y="168">
        {TEXT.tunnel}
      </text>

      <rect className="homelab-arch__boundary" x="24" y="176" width="672" height="272" rx="12" />
      <text className="homelab-arch__boundary-label" x="44" y="198">
        {TEXT.boundary}
      </text>

      <rect className="homelab-arch__box" x="48" y="216" width="168" height="56" rx="8" />
      <text className="homelab-arch__label" x="132" y="240" textAnchor="middle">
        {TEXT.cloudflared}
      </text>
      <text className="homelab-arch__sub" x="132" y="258" textAnchor="middle">
        {TEXT.cloudflaredSub}
      </text>

      <rect className="homelab-arch__box homelab-arch__box--lan" x="48" y="288" width="168" height="56" rx="8" />
      <text className="homelab-arch__label" x="132" y="312" textAnchor="middle">
        {TEXT.lan}
      </text>
      <text className="homelab-arch__sub" x="132" y="330" textAnchor="middle">
        {TEXT.lanSub}
      </text>

      <line className="homelab-arch__line" x1="216" y1="244" x2="248" y2="244" markerEnd={arrow} />
      <line className="homelab-arch__line" x1="216" y1="316" x2="248" y2="316" markerEnd={arrow} />

      <rect className="homelab-arch__box" x="248" y="216" width="168" height="128" rx="8" />
      <text className="homelab-arch__label" x="332" y="272" textAnchor="middle">
        {TEXT.proxy}
      </text>
      <text className="homelab-arch__sub" x="332" y="292" textAnchor="middle">
        {TEXT.proxySub}
      </text>

      <line className="homelab-arch__line" x1="416" y1="280" x2="448" y2="280" markerEnd={arrow} />

      <rect className="homelab-arch__box homelab-arch__box--accent" x="448" y="216" width="224" height="128" rx="8" />
      <text className="homelab-arch__label" x="560" y="272" textAnchor="middle">
        {TEXT.services}
      </text>
      <text className="homelab-arch__sub" x="560" y="292" textAnchor="middle">
        {TEXT.servicesSub}
      </text>

      {/* Deliberately unconnected: these sit beside the ingress path, not in it. */}
      <text className="homelab-arch__boundary-label" x="48" y="376">
        {TEXT.supporting}
      </text>

      <rect className="homelab-arch__box" x="48" y="388" width="304" height="48" rx="8" />
      <text className="homelab-arch__label" x="200" y="408" textAnchor="middle">
        {TEXT.dockge}
      </text>
      <text className="homelab-arch__sub" x="200" y="424" textAnchor="middle">
        {TEXT.dockgeSub}
      </text>

      <rect className="homelab-arch__box" x="368" y="388" width="304" height="48" rx="8" />
      <text className="homelab-arch__label" x="520" y="408" textAnchor="middle">
        {TEXT.monitoring}
      </text>
      <text className="homelab-arch__sub" x="520" y="424" textAnchor="middle">
        {TEXT.monitoringSub}
      </text>
    </svg>
  );
}

/**
 * Portrait layout for narrow viewports. The 360-unit viewBox is close to the
 * rendered pixel width on a phone, so type stays near its nominal size instead
 * of being scaled to roughly 44% as the landscape version was. Ingress paths
 * sit side by side so they visibly merge into the reverse proxy.
 */
function NarrowDiagram() {
  const arrow = 'url(#homelab-arrow-narrow)';
  return (
    <svg
      className="homelab-arch__svg homelab-arch__svg--narrow"
      viewBox="0 0 360 608"
      role="img"
      aria-labelledby="homelab-arch-title-narrow homelab-arch-desc-narrow"
    >
      <title id="homelab-arch-title-narrow">{TEXT.title}</title>
      <desc id="homelab-arch-desc-narrow">{TEXT.desc}</desc>
      <ArrowMarker id="homelab-arrow-narrow" />

      <rect className="homelab-arch__box homelab-arch__box--edge" x="90" y="8" width="180" height="36" rx="8" />
      <text className="homelab-arch__label" x="180" y="31" textAnchor="middle">
        {TEXT.internet}
      </text>

      <line className="homelab-arch__line" x1="180" y1="44" x2="180" y2="72" markerEnd={arrow} />
      <text className="homelab-arch__caption" x="188" y="62">
        {TEXT.httpsOnly}
      </text>

      <rect className="homelab-arch__box homelab-arch__box--cf" x="8" y="72" width="344" height="76" rx="8" />
      <text className="homelab-arch__label" x="180" y="96" textAnchor="middle">
        {TEXT.cloudflare}
      </text>
      <text className="homelab-arch__sub" x="180" y="118" textAnchor="middle">
        {TEXT.cloudflareAuth}
      </text>
      <text className="homelab-arch__sub" x="180" y="138" textAnchor="middle">
        {TEXT.cloudflareMtls}
      </text>

      <line className="homelab-arch__line" x1="180" y1="148" x2="180" y2="180" markerEnd={arrow} />
      <text className="homelab-arch__caption" x="188" y="168">
        {TEXT.tunnel}
      </text>

      <rect className="homelab-arch__boundary" x="8" y="180" width="344" height="416" rx="12" />
      <text className="homelab-arch__boundary-label" x="24" y="202">
        {TEXT.boundary}
      </text>

      <rect className="homelab-arch__box" x="24" y="216" width="148" height="52" rx="8" />
      <text className="homelab-arch__label" x="98" y="237" textAnchor="middle">
        {TEXT.cloudflared}
      </text>
      <text className="homelab-arch__sub" x="98" y="254" textAnchor="middle">
        {TEXT.cloudflaredSub}
      </text>

      <rect className="homelab-arch__box homelab-arch__box--lan" x="188" y="216" width="148" height="52" rx="8" />
      <text className="homelab-arch__label" x="262" y="237" textAnchor="middle">
        {TEXT.lan}
      </text>
      <text className="homelab-arch__sub" x="262" y="254" textAnchor="middle">
        {TEXT.lanSub}
      </text>

      <line className="homelab-arch__line" x1="98" y1="268" x2="98" y2="292" />
      <line className="homelab-arch__line" x1="262" y1="268" x2="262" y2="292" />
      <line className="homelab-arch__line" x1="98" y1="292" x2="262" y2="292" />
      <line className="homelab-arch__line" x1="180" y1="292" x2="180" y2="312" markerEnd={arrow} />

      <rect className="homelab-arch__box" x="24" y="312" width="312" height="48" rx="8" />
      <text className="homelab-arch__label" x="180" y="333" textAnchor="middle">
        {TEXT.proxy}
      </text>
      <text className="homelab-arch__sub" x="180" y="350" textAnchor="middle">
        {TEXT.proxySub}
      </text>

      <line className="homelab-arch__line" x1="180" y1="360" x2="180" y2="380" markerEnd={arrow} />

      <rect className="homelab-arch__box homelab-arch__box--accent" x="24" y="380" width="312" height="52" rx="8" />
      <text className="homelab-arch__label" x="180" y="402" textAnchor="middle">
        {TEXT.services}
      </text>
      <text className="homelab-arch__sub" x="180" y="420" textAnchor="middle">
        {TEXT.servicesSub}
      </text>

      {/* Deliberately unconnected: these sit beside the ingress path, not in it. */}
      <text className="homelab-arch__boundary-label" x="24" y="464">
        {TEXT.supporting}
      </text>

      <rect className="homelab-arch__box" x="24" y="476" width="312" height="48" rx="8" />
      <text className="homelab-arch__label" x="180" y="497" textAnchor="middle">
        {TEXT.dockge}
      </text>
      <text className="homelab-arch__sub" x="180" y="514" textAnchor="middle">
        {TEXT.dockgeSub}
      </text>

      <rect className="homelab-arch__box" x="24" y="536" width="312" height="48" rx="8" />
      <text className="homelab-arch__label" x="180" y="557" textAnchor="middle">
        {TEXT.monitoring}
      </text>
      <text className="homelab-arch__sub" x="180" y="574" textAnchor="middle">
        {TEXT.monitoringSub}
      </text>
    </svg>
  );
}

export function HomelabArchitecture() {
  return (
    <figure className="homelab-arch">
      <NarrowDiagram />
      <WideDiagram />
      <figcaption className="homelab-arch__caption-text">
        Cloudflare Tunnel and Tailscale both dial out — LAN and VPN still hit the same reverse proxy. Nothing is port-forwarded.
      </figcaption>
    </figure>
  );
}

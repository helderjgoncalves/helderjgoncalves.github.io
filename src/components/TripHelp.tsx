import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react';
import { tripsPage } from '../data/tripsPage';
import { Icon } from './Icon';

interface TripHelpProps {
  title?: string;
  /** Trip pages end here, so the way back to /trips/ sits beside the offer. */
  back?: boolean;
  /** On a trip page: the form asks about it rather than "Where to?". */
  trip?: string;
}

/** A form's unsent words, by field name. */
type Draft = Map<string, string>;

type Status = 'idle' | 'sending' | 'sent' | keyof typeof tripsPage.help.form.errors;

/** Fields the form checks itself, so the browser's own bubbles never show. */
type Checked = 'message' | 'email';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_MESSAGE = 10;
const MAX_LINKS = 5;

/** The Worker's own tests, so a message it would turn away is caught here, by its field. */
function looksReal(message: string) {
  const text = message.trim();
  return text.length >= MIN_MESSAGE && (text.match(/\p{L}{2,}/gu) ?? []).length >= 2;
}

function tooManyLinks(message: string) {
  return (message.match(/https?:\/\/|www\./gi) ?? []).length > MAX_LINKS;
}

interface Turnstile {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widget: string): void;
  remove(widget: string): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let turnstileScript: Promise<Turnstile> | undefined;

/** The theme on screen: the one picked with the toggle, or else the system's. */
function siteTheme() {
  const picked = document.documentElement.dataset.theme;
  if (picked === 'light' || picked === 'dark') return picked;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadTurnstile(): Promise<Turnstile> {
  turnstileScript ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
    script.onerror = () => {
      turnstileScript = undefined;
      reject(new Error('turnstile'));
    };
    document.head.append(script);
  });
  return turnstileScript;
}

interface TripHelpFormProps {
  trip?: string;
  /**
   * Under the route, where it has the page's width: two columns from md up
   * (the message beside email and name), and no "About" chip, since the page
   * it sits in already says where.
   */
  wide?: boolean;
  /** Set by whoever opened it, to fold it shut again (its own Esc asks via `onClose`). */
  closing?: boolean;
  /** What's been typed, kept by the opener so closing without sending loses nothing. */
  draft: Draft;
  onClose: () => void;
  /** Once it has folded shut, to bring back what opened it. */
  onClosed: () => void;
}

/**
 * The form "Email me" and the route's "just ask" open in place. It grows open
 * where it was asked for and scrolls to the middle of the screen.
 */
export function TripHelpForm({ trip = '', wide = false, closing = false, draft, onClose, onClosed }: TripHelpFormProps) {
  const { email, form } = tripsPage.help;
  const [status, setStatus] = useState<Status>('idle');
  const [problems, setProblems] = useState<Partial<Record<Checked, string>>>({});
  const widget = useRef<string | undefined>(undefined);
  const check = useRef<HTMLDivElement>(null);
  const [challenged, setChallenged] = useState(false);
  const slot = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const ids = useId();

  useEffect(() => {
    startedAt ||= Date.now();
    // The form grows from nothing, so near the page's foot there is no room yet
    // to scroll it into view: hold its final height until it has grown.
    const box = slot.current;
    let release: number | undefined;
    if (box) {
      const full = box.querySelector<HTMLElement>('.trip-help__form')?.offsetHeight ?? 0;
      box.style.minHeight = `${full}px`;
      release = window.setTimeout(() => (box.style.minHeight = ''), 700);
      // Centred while it fits; taller (phones), its top goes under the nav instead.
      box.scrollIntoView({ block: full < window.innerHeight * 0.8 ? 'center' : 'start' });
      box
        .querySelector<HTMLElement>('input[name=trip]:not([type=hidden]), textarea')
        ?.focus({ preventScroll: true });
    }
    let cancelled = false;
    let fold: number | undefined;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !check.current) return;
        widget.current = turnstile.render(check.current, {
          sitekey: form.siteKey,
          appearance: 'interaction-only',
          theme: siteTheme(),
          // Most visitors never see it. When Cloudflare does want a click, it
          // slides in, and folds away a moment after saying "Success!".
          'before-interactive-callback': () => {
            window.clearTimeout(fold);
            setChallenged(true);
          },
          'after-interactive-callback': () => {
            fold = window.setTimeout(() => setChallenged(false), 1200);
          },
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      window.clearTimeout(release);
      window.clearTimeout(fold);
      if (box) box.style.minHeight = '';
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [form.siteKey]);

  useEffect(() => {
    if (status === 'sent') done.current?.focus();
  }, [status]);

  const invalid = (name: Checked) => ({
    'aria-invalid': problems[name] ? true : undefined,
    'aria-describedby': problems[name] ? `${ids}-${name}-problem` : undefined,
    onInput: () => problems[name] && setProblems(({ [name]: _, ...rest }) => rest),
  });

  const problem = (name: Checked) =>
    problems[name] && (
      <span id={`${ids}-${name}-problem`} className="trip-help__problem">
        <Icon name="alert" />
        {problems[name]}
      </span>
    );

  const keep = (event: FormEvent<HTMLFormElement>) => {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (field.name && field.name !== 'website') draft.set(field.name, field.value);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { 'cf-turnstile-response': token = '', ...data } = Object.fromEntries(new FormData(event.currentTarget));
    const address = String(data.email ?? '').trim();
    const found: Partial<Record<Checked, string>> = {};
    const message = String(data.message ?? '');
    if (tooManyLinks(message)) found.message = form.checks.links;
    else if (!looksReal(message)) found.message = form.checks.message;
    if (!address) found.email = form.checks.email;
    else if (!EMAIL.test(address)) found.email = form.checks.emailFormat;
    setProblems(found);
    const first = Object.keys(found)[0];
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[name=${first}]`)?.focus();
      return;
    }
    setStatus('sending');
    let next: Status = 'failed';
    try {
      const response = await fetch(form.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          token,
          elapsed: Date.now() - startedAt,
          page: location.pathname,
        }),
      });
      const result: { ok?: boolean; error?: string } = await response.json();
      if (result.ok) next = 'sent';
      else if (result.error && result.error in form.errors) next = result.error as Status;
    } catch {
      next = 'failed';
    }
    if (next !== 'sent' && widget.current) window.turnstile?.reset(widget.current);
    if (next === 'sent') {
      draft.clear();
      startedAt = 0;
    }
    setStatus(next);
  };

  useEffect(() => {
    if (!closing) return;
    if (slot.current) slot.current.style.minHeight = '';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) onClosed();
  }, [closing, onClosed]);

  const escape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onClose();
  };

  const classes = ['trip-help__slot', wide && 'trip-help__slot--wide', closing && 'trip-help__slot--closing'];

  return (
    <div
      ref={slot}
      className={classes.filter(Boolean).join(' ')}
      onKeyDown={escape}
      onAnimationEnd={(event) => closing && event.target === event.currentTarget.firstChild && onClosed()}
    >
      <div className="trip-help__reveal">
        <div className="trip-help__clip">
          {status === 'sent' ? (
            <div ref={done} className="trip-help__form trip-help__sent" role="status" tabIndex={-1}>
              <span className="trip-help__sent-mark">
                <Icon name="check" />
              </span>
              <p className="trip-help__sent-title">{form.sent.title}</p>
              <p className="trip-help__sent-text">{form.sent.text}</p>
            </div>
          ) : (
              <form className={['trip-help__form', wide && 'trip-help__form--wide', wide && !trip && 'trip-help__form--asks'].filter(Boolean).join(' ')} onSubmit={submit} onInput={keep} noValidate>
                {trip && wide ? (
                  <input type="hidden" name="trip" value={trip} />
                ) : trip ? (
                  <p className="trip-help__about">
                    <Icon name="globe" />
                    {form.about} {trip}
                    <input type="hidden" name="trip" value={trip} />
                  </p>
                ) : (
                  <div className="trip-help__field">
                    <label htmlFor={`${ids}-trip`}>
                      {form.trip} <span className="trip-help__optional">({form.optional})</span>
                    </label>
                    <input
                      id={`${ids}-trip`}
                      name="trip"
                      defaultValue={draft.get('trip')}
                      placeholder={form.tripPlaceholder}
                      maxLength={100}
                    />
                  </div>
                )}
                <div className="trip-help__field">
                  <div className="trip-help__label">
                    <label htmlFor={`${ids}-message`}>{form.message}</label>
                    {problem('message')}
                  </div>
                  <textarea
                    id={`${ids}-message`}
                    name="message"
                    defaultValue={draft.get('message')}
                    rows={wide ? 4 : 5}
                    minLength={10}
                    maxLength={4000}
                    placeholder={form.messagePlaceholder}
                    required
                    {...invalid('message')}
                  />
                </div>
                <div className="trip-help__row">
                  <div className="trip-help__field">
                    <div className="trip-help__label">
                      <label htmlFor={`${ids}-email`}>{form.email}</label>
                      {problem('email')}
                    </div>
                    <input
                      id={`${ids}-email`}
                      name="email"
                      defaultValue={draft.get('email')}
                      type="email"
                      autoComplete="email"
                      maxLength={200}
                      required
                      {...invalid('email')}
                    />
                  </div>
                  <div className="trip-help__field">
                    <label htmlFor={`${ids}-name`}>
                      {form.name} <span className="trip-help__optional">({form.optional})</span>
                    </label>
                    <input
                      id={`${ids}-name`}
                      name="name"
                      autoComplete="name"
                      defaultValue={draft.get('name')}
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="trip-help__trap" aria-hidden="true">
                  <label htmlFor={`${ids}-website`}>Website</label>
                  <input id={`${ids}-website`} name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <div className={challenged ? 'trip-help__check trip-help__check--shown' : 'trip-help__check'}>
                  <div ref={check} />
                </div>
                {status in form.errors && (
                  <p className="trip-help__notice" role="alert">
                    <Icon name="alert" />
                    <span>{form.errors[status as keyof typeof form.errors]}</span>
                  </p>
                )}
                <div className="trip-help__footer">
                  <p className="trip-help__direct">
                    {form.direct} <a href={`mailto:${email}`}>{email}</a>
                  </p>
                  <button className="trip-help__email" type="submit" disabled={status === 'sending'}>
                    <Icon name="email" />
                    {status === 'sending' ? form.sending : form.send}
                  </button>
                </div>
              </form>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * A page's forms are one form shown in two places: one open at a time
 * (opening one folds the other away) and one draft between them.
 */
const draft: Draft = new Map();
/** When this draft was begun: the Worker's minimum fill time counts from here,
 * not from the latest opening, or a kept draft sent at once reads as a bot. */
let startedAt = 0;
let active: string | null = null;
const listeners = new Set<() => void>();

function activate(id: string | null) {
  active = id;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Open, folding shut, or shut. Focus goes back to the opener once it's shut,
 * unless it shut because the other place opened.
 */
function useFold() {
  const id = useId();
  const wanted = useSyncExternalStore(subscribe, () => active === id, () => false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const opener = useRef<HTMLAnchorElement>(null);
  const refocus = useRef(false);

  useEffect(() => {
    if (!open && refocus.current) opener.current?.focus();
    refocus.current = false;
  }, [open]);

  useEffect(() => {
    if (wanted) {
      setOpen(true);
      setClosing(false);
    } else if (open) setClosing(true);
  }, [wanted, open]);

  useEffect(() => () => {
    if (active === id) active = null;
  }, [id]);

  const show = (event: MouseEvent) => {
    event.preventDefault();
    activate(id);
  };
  const close = () => {
    if (active === id) activate(null);
  };
  const closed = useCallback(() => {
    setOpen(false);
    setClosing(false);
    refocus.current = active === null;
  }, []);

  return { open, closing, opener, show, close, closed, draft };
}

export function TripHelp({ title = tripsPage.help.title, back = false, trip = '' }: TripHelpProps) {
  const { email, text, cta } = tripsPage.help;
  const fold = useFold();

  return (
    <aside className="container trip-help" aria-labelledby="trip-help-title">
      <div className="trip-help__card">
        <h2 id="trip-help-title" className="trip-help__title">
          {title}
        </h2>
        <p className="trip-help__text">{text}</p>

        {fold.open ? (
          <TripHelpForm trip={trip} wide draft={fold.draft} closing={fold.closing} onClose={fold.close} onClosed={fold.closed} />
        ) : (
          <a ref={fold.opener} className="trip-help__email" href={`mailto:${email}`} onClick={fold.show} draggable={false}>
            <Icon name="email" />
            {cta}
          </a>
        )}

        {back && (
          <p className="trip-help__back">
            <a href="/trips/" draggable={false}>
              <Icon name="chevronLeft" />
              All trips
            </a>
          </p>
        )}
      </div>
    </aside>
  );
}

/**
 * The line under a trip's route. Its "just ask" opens the form right there,
 * and while it's open the line heads it, with the way to close it at its end.
 */
export function TripAsk({ trip }: { trip: string }) {
  const { email, prompt, promptLink, form } = tripsPage.help;
  const fold = useFold();

  return (
    <>
      <p className="trip-route__ask">
        <span className="trip-route__ask-mark">
          <Icon name="email" />
        </span>
        <span>
          {prompt}{' '}
          {fold.open ? (
            promptLink
          ) : (
            <a ref={fold.opener} href={`mailto:${email}`} onClick={fold.show} draggable={false}>
              {promptLink}
            </a>
          )}
          .
        </span>
        {fold.open && (
          <button type="button" className="trip-route__ask-close" onClick={fold.close} disabled={fold.closing}>
            <Icon name="close" />
            <span className="trip-route__ask-close-label">{form.close}</span>
          </button>
        )}
      </p>
      {fold.open && (
        <TripHelpForm trip={trip} wide draft={fold.draft} closing={fold.closing} onClose={fold.close} onClosed={fold.closed} />
      )}
    </>
  );
}

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronRight,
  ExternalLink,
  Film,
  Instagram,
  Loader2,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  Play,
  Plus,
  Save,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  Youtube,
} from "lucide-react";
import { FALLBACK_ASSETS, DEFAULT_SETTINGS, DEFAULT_SITE_DATA, type MediaItem, type NewsItem, type Product, type SiteSettings } from "@shared/content";
import { startLogin } from "../const";
import { trpc } from "../lib/trpc";

const orange = "#f05d23";
const GAMEPLAY_ASSETS = {
  laneway: "/manus-storage/async-images/r4f59jxlGGxkT0CgxvG1PZ/image-1.webp",
  tram: "/manus-storage/async-images/r4f59jxlGGxkT0CgxvG1PZ/image-2.webp",
} as const;

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="brand-mark" aria-label="NEWCOMER home">
      <span className={`brand-symbol ${light ? "brand-symbol-light" : ""}`}>N</span>
      <span className="brand-word">NEWCOMER</span>
    </Link>
  );
}

function SiteHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const { data: authUser } = trpc.auth.me.useQuery();
  const links = [
    ["Overview", "/overview"],
    ["Gallery", "/gallery"],
    ["Updates", "/updates"],
    ["Release", "/release"],
    ["Pre-order", "/preorder"],
    ["Wheel", "/wheel"],
    ["Account", "/account"],
    ["Player hub", "/player"],
    ["Game info", "/game-info"],
    ["Dev centre", "/development"],
  ];
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Logo />
        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={active === href ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          {authUser?.role === "admin" && <Link href="/admin" className={active === "/admin" ? "active" : ""} onClick={() => setOpen(false)}>Admin</Link>}
          <Link href="/contact" className={`nav-cta ${active === "/contact" ? "active" : ""}`} onClick={() => setOpen(false)}>Contact <ArrowUpRight /></Link>
        </nav>
        <button className="icon-button menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p className="footer-note">A realistic open-world game inspired by Melbourne, Australia.<br />Official details will be published as they are confirmed.</p>
        </div>
        <div className="footer-links">
          <span className="label">Navigate</span>
          <Link href="/overview">Overview</Link><Link href="/gallery">Gallery</Link><Link href="/updates">Updates</Link><Link href="/release">Release</Link>
        </div>
        <div className="footer-links">
          <span className="label">Community</span>
          <Link href="/community">Discord & social</Link><Link href="/contact">Contact & support</Link>
          <a href={settings.discordUrl || "#"} onClick={e => !settings.discordUrl && e.preventDefault()}>Discord <ExternalLink size={13} /></a>
        </div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} NEWCOMER</span><span>Melbourne / Australia</span><Link href="/admin"><LockKeyhole size={12} /> Admin</Link></div>
    </footer>
  );
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="page-intro container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></section>;
}

function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="hero">
      <div className="hero-image" style={{ backgroundImage: `url(${FALLBACK_ASSETS.hero})` }} />
      <div className="hero-grid-lines" />
      <div className="container hero-content">
        <div className="hero-kicker"><span className="orange-dot" /> MELBOURNE / AUSTRALIA <span className="rule" /> <span>PROJECT STATUS: IN DEVELOPMENT</span></div>
        <h1>THE CITY<br /><em>IS YOURS</em><span className="accent-dot">.</span></h1>
        <div className="hero-bottom">
          <p className="hero-copy">{settings.overview}</p>
          <Link className="button button-primary" href="/overview">Enter the project <ArrowDownRight size={16} /></Link>
        </div>
      </div>
      <div className="hero-scroll"><span>Scroll to explore</span><ArrowDownRight size={16} /></div>
      <div className="hero-stamp">N / 01<br /><span>NEWCOMER</span></div>
    </section>
  );
}

function HomePage({ data }: { data: { settings: SiteSettings; gallery: MediaItem[]; news: NewsItem[]; products: Product[] } }) {
  const featured = data.gallery.slice(0, 3);
  return <>
    <SiteHeader />
    <main>
      <Hero settings={data.settings} />
      <section className="ticker"><div className="ticker-track"><span>NEWCOMER</span><i>—</i><span>MELBOURNE / AUSTRALIA</span><i>—</i><span>IN DEVELOPMENT</span><i>—</i><span>NEWCOMER</span><i>—</i><span>MELBOURNE / AUSTRALIA</span></div></section>
      <section className="section overview-tease container" id="overview">
        <div className="section-heading"><span className="eyebrow">01 / The project</span><span className="section-index">01 — 04</span></div>
        <div className="split-heading"><h2>A city with<br /><em>weight.</em></h2><div><p className="lead">{data.settings.overview}</p><Link className="text-link" href="/overview">Read the overview <ArrowRight size={16} /></Link></div></div>
        <div className="tease-meta"><span><b>SETTING</b> MELBOURNE, AUSTRALIA</span><span><b>STATUS</b> IN DEVELOPMENT</span><span><b>DETAILS</b> TO BE ANNOUNCED</span></div>
      </section>
      <section className="image-break"><img src={FALLBACK_ASSETS.laneway} alt="Atmospheric Melbourne laneway at night" /><div className="image-break-caption"><span>FIELD NOTE / 001</span><strong>LIGHT AFTER RAIN</strong></div></section>
      <section className="section gallery-tease container">
        <div className="section-heading"><span className="eyebrow">02 / Visual archive</span><Link className="text-link" href="/gallery">View all media <ArrowRight size={16} /></Link></div>
        <div className="gallery-mosaic">{featured.map((item, i) => <GalleryCard key={item.id ?? item.title} item={item} index={i} />)}</div>
      </section>
      <section className="section signal-band"><div className="container signal-grid"><div className="signal-number">03</div><div><span className="eyebrow">03 / Official signal</span><h2>Nothing invented.<br /><em>Everything earned.</em></h2></div><p>NEWCOMER is still in development. This website is the official place for confirmed announcements, visual updates and community news — not speculation.</p></div></section>
      <section className="section updates-tease container">
        <div className="section-heading"><span className="eyebrow">04 / Development log</span><Link className="text-link" href="/updates">All updates <ArrowRight size={16} /></Link></div>
        {data.news.length ? <div className="update-list">{data.news.slice(0, 3).map((item, i) => <UpdateRow key={item.id ?? item.title} item={item} index={i} />)}</div> : <EmptyState icon={<Sparkles size={18} />} title="The log is quiet for now." copy="Official development updates will appear here when they are ready to share." />}
      </section>
      <AnnouncementSignup />
      <ReleaseStrip settings={data.settings} />
    </main>
    <Footer settings={data.settings} />
  </>;
}

function GalleryCard({ item, index, large = false }: { item: MediaItem; index: number; large?: boolean }) {
  return <div className={`gallery-card ${large ? "gallery-card-large" : ""}`}><img src={item.imageUrl} alt={item.title} /><div className="gallery-overlay"><span>{String(index + 1).padStart(2, "0")} / {item.mediaType === "video" ? "VIDEO" : "IMAGE"}</span><strong>{item.title}</strong><small>{item.description}</small>{item.mediaType === "video" && <span className="play-chip"><Play size={12} fill="currentColor" /> Play</span>}</div></div>;
}

function UpdateRow({ item, index }: { item: NewsItem; index: number }) {
  return <Link href={`/updates/${item.id ?? index}`} className="update-row"><span className="update-index">0{index + 1}</span><div><span className="eyebrow">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-AU", { month: "short", year: "numeric" }) : "UPDATE"}</span><h3>{item.title}</h3><p>{item.excerpt}</p></div><ChevronRight className="row-arrow" size={19} /></Link>;
}

function ReleaseStrip({ settings }: { settings: SiteSettings }) {
  return <section className="release-strip"><div className="container release-grid"><div><span className="eyebrow">Release information</span><h2>Not announced.<br /><em>Not forgotten.</em></h2></div><div className="release-details"><div><span>Status</span><strong>{settings.releaseStatus}</strong></div><div><span>Release date</span><strong>{settings.releaseDate || "TBA"}</strong></div><div><span>Platforms</span><strong>{settings.platforms || "TBA"}</strong></div><Link className="button button-outline" href="/release">Release details <ArrowRight size={16} /></Link></div></div></section>;
}

function AnnouncementSignup() {
  const subscribe = trpc.content.subscribe.useMutation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    subscribe.mutate({ email }, { onSuccess: () => { setSubmitted(true); setEmail(""); } });
  };
  return <section className="announcement-signup"><div className="container announcement-grid"><div><span className="eyebrow">The signal</span><h2>Get the next<br /><em>official word.</em></h2></div><div><p>Sign up for confirmed announcements, development updates and community news from NEWCOMER.</p>{submitted ? <div className="signup-success"><Check size={16} /> You’re on the list. We’ll only send official updates.</div> : <form className="signup-form" onSubmit={onSubmit}><input aria-label="Email address" required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Email address" /><button className="button button-primary" type="submit" disabled={subscribe.isPending}>{subscribe.isPending ? <Loader2 className="spin" size={15} /> : <Send size={15} />} Subscribe</button></form>}{subscribe.error && <p className="form-error">{subscribe.error.message}</p>}<small>By subscribing, you agree to receive NEWCOMER announcements and community updates. To unsubscribe, contact the team through support.</small></div></div></section>;
}

function EmptyState({ icon, title, copy }: { icon?: React.ReactNode; title: string; copy: string }) {
  return <div className="empty-state">{icon && <span className="empty-icon">{icon}</span>}<h3>{title}</h3><p>{copy}</p></div>;
}


function PlayerHubPage() {
  const auth = trpc.auth.me.useQuery();
  const hub = trpc.account.profile.useQuery(undefined, { enabled: Boolean(auth.data) });
  const save = trpc.account.updateProfile.useMutation({ onSuccess: () => hub.refetch() });
  const [form, setForm] = useState({ handle: "", bio: "", favoriteArea: "", notifications: true });
  useEffect(() => {
    const profile = hub.data?.profile;
    if (profile) setForm({ handle: profile.handle, bio: profile.bio, favoriteArea: profile.favoriteArea, notifications: profile.notifications === 1 });
  }, [hub.data?.profile]);
  if (auth.isLoading) return <div className="admin-loading"><Loader2 className="spin" /></div>;
  if (!auth.data) return <><SiteHeader active="/player" /><main><PageIntro eyebrow="Player hub" title="Your place in the city." copy="Sign in to manage your player profile and see the activity currently connected to your NEWCOMER account." /><section className="container player-login-card"><LockKeyhole size={24} /><h2>Sign in to continue.</h2><p>Your profile uses the same secure account as the daily wheel and announcements.</p><Link className="button button-primary" href="/account">Create account / sign in <ArrowRight size={16} /></Link></section></main><Footer settings={DEFAULT_SETTINGS} /></>;
  const entries = hub.data?.entries ?? [];
  const wins = hub.data?.wins ?? [];
  const submit = (event: FormEvent) => { event.preventDefault(); save.mutate(form); };
  return <><SiteHeader active="/player" /><main><PageIntro eyebrow="Player hub" title={`Welcome back${auth.data.name ? `, ${auth.data.name}` : ""}.`} copy="A private account space for your profile, daily wheel activity and future player records. Unsupported stats stay clearly marked until a real game service exists." /><section className="container player-hub-grid"><div className="player-profile-card"><div className="player-avatar">{(auth.data.name || "N").slice(0, 1).toUpperCase()}</div><div><span className="eyebrow">Player profile</span><h2>{form.handle || auth.data.name || "NEWCOMER player"}</h2><p>{form.bio || "No profile bio added yet."}</p></div><span className="status-pill">{auth.data.role === "admin" ? "admin" : "account"}</span></div><div className="player-stats-grid"><div><span>Wheel entries</span><strong>{entries.length}</strong><small>Recorded account activity</small></div><div><span>Wins</span><strong>{wins.length}</strong><small>Confirmed prize records</small></div><div><span>Playtime</span><strong>—</strong><small>Not connected yet</small></div><div><span>Achievements</span><strong>—</strong><small>Not connected yet</small></div></div><div className="player-panel"><div className="card-head"><div><span className="eyebrow">Customise</span><h2>Your profile</h2></div></div><form className="player-form" onSubmit={submit}><div className="form-row"><label>Public handle<input maxLength={40} value={form.handle} onChange={e => setForm({ ...form, handle: e.target.value })} placeholder="How should the community know you?" /></label><label>Favourite area<input maxLength={120} value={form.favoriteArea} onChange={e => setForm({ ...form, favoriteArea: e.target.value })} placeholder="e.g. Inner city" /></label></div><label>Bio<textarea rows={4} maxLength={240} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="A short player bio" /></label><label className="check-label"><input type="checkbox" checked={form.notifications} onChange={e => setForm({ ...form, notifications: e.target.checked })} /> Receive account and community notifications</label><button className="button button-primary" type="submit" disabled={save.isPending}>{save.isPending ? <Loader2 className="spin" size={15} /> : <Save size={15} />} Save profile</button>{save.error && <p className="form-error">{save.error.message}</p>}</form></div><div className="player-panel"><div className="card-head"><div><span className="eyebrow">Recent activity</span><h2>Account record</h2></div></div>{entries.length || wins.length ? <div className="activity-list">{entries.slice(0, 5).map(entry => <div key={`entry-${entry.id}`}><span className="activity-dot" /><div><strong>Wheel entry submitted</strong><small>{entry.displayName} · {entry.entryDate}</small></div></div>)}{wins.slice(0, 5).map(win => <div key={`win-${win.id}`}><span className="activity-dot is-win" /><div><strong>{win.displayName === "[NO WINNER]" ? "No winner draw" : "Giveaway won"}</strong><small>{win.winnerDate} · {win.prize}</small></div></div>)}</div> : <EmptyState title="No activity recorded yet." copy="Your daily wheel activity will appear here when you use the account." />}</div></section></main><Footer settings={DEFAULT_SETTINGS} /></>;
}

function GameInfoPage({ settings }: { settings: SiteSettings }) {
  return <><SiteHeader active="/game-info" /><main><PageIntro eyebrow="Game information" title="The facts first." copy="A clear guide to what NEWCOMER is, what is confirmed and what is still being developed." /><section className="container info-grid"><article><span className="eyebrow">01 / Gameplay direction</span><h2>Grounded open-world exploration.</h2><p>NEWCOMER is planned as a realistic open-world game inspired by Melbourne, Australia. The current direction focuses on a specific city atmosphere and believable environmental detail.</p></article><article><span className="eyebrow">02 / Confirmed</span><h2>What we can say now.</h2><div className="info-list"><div><span>Setting</span><strong>Melbourne-inspired Australia</strong></div><div><span>Status</span><strong>{settings.releaseStatus}</strong></div><div><span>Release</span><strong>{settings.releaseDate || "To be announced"}</strong></div><div><span>Platforms</span><strong>{settings.platforms || "To be announced"}</strong></div></div></article></section><section className="container info-sections"><div className="section-heading"><span className="eyebrow">Player guide</span><span className="section-index">NO INVENTED MECHANICS</span></div><div className="guide-grid"><article><span>01</span><h3>Beginner guide</h3><p>The in-game onboarding, controls and tutorials have not been officially published yet. This section will update when the team can confirm them.</p></article><article><span>02</span><h3>Vehicles and equipment</h3><p>No vehicle roster or equipment list has been confirmed. We will publish real details instead of filling this page with guesses.</p></article><article><span>03</span><h3>Maps and locations</h3><p>The world is inspired by Melbourne, but a final map and location list is not available yet.</p></article></div></section><section className="container faq-section"><span className="eyebrow">FAQ</span><h2>Useful answers<br /><em>without the filler.</em></h2><div className="faq-list"><details open><summary>When is NEWCOMER planned to release?</summary><p>{settings.releaseDate || "The date is not confirmed yet."}</p></details><details><summary>What platforms will it launch on?</summary><p>{settings.platforms || "Platform availability has not been confirmed yet."}</p></details><details><summary>Is this a Roblox game?</summary><p>No. NEWCOMER is its own project and this website does not use Roblox-specific systems.</p></details></div></section></main><Footer settings={settings} /></>;
}

function DevelopmentPage({ data }: { data: ReturnType<typeof usePublicData> }) {
  return <><SiteHeader active="/development" /><main><PageIntro eyebrow="Development centre" title="Build notes, not hype." copy="The official home for progress updates, roadmap signals, patch notes and known limitations." /><section className="container development-status"><div><span className="eyebrow">Current phase</span><h2>In development.</h2><p>NEWCOMER is being shaped in public carefully. Confirmed updates appear below as they are ready to share.</p></div><div className="status-meter"><span>Public information level</span><strong>Early signal</strong><div><i /></div><small>Roadmap dates and feature commitments will be added when they are confirmed.</small></div></section><section className="container roadmap-section"><div className="section-heading"><span className="eyebrow">Roadmap</span><span className="section-index">NO DATES INVENTED</span></div><div className="roadmap-grid"><article><span className="roadmap-index">01</span><h3>World direction</h3><strong>In progress</strong><p>Melbourne-inspired environments, atmosphere and grounded visual language.</p></article><article><span className="roadmap-index">02</span><h3>Gameplay systems</h3><strong>Not announced</strong><p>Mechanics and systems will be listed here once they are officially confirmed.</p></article><article><span className="roadmap-index">03</span><h3>Release preparation</h3><strong>Planned</strong><p>Current planned release date: 31 Dec 2026. Availability details remain subject to change.</p></article></div></section><section className="container development-updates"><div className="section-heading"><span className="eyebrow">Patch notes and announcements</span><span className="section-index">{data.news.length} PUBLISHED</span></div>{data.news.length ? <div className="update-list">{data.news.map((item, i) => <UpdateRow key={item.id ?? item.title} item={item} index={i} />)}</div> : <EmptyState icon={<Sparkles size={18} />} title="No development notes yet." copy="Published news updates will automatically appear here." />}</section><section className="container known-issues"><span className="eyebrow">Known issues</span><h2>Nothing logged<br /><em>publicly yet.</em></h2><p>Known issues will be listed here once the team has a confirmed public report.</p></section></main><Footer settings={data.settings} /></>;
}

function PublicPage({ data, path }: { data: ReturnType<typeof usePublicData>; path: string }) {
  const settings = data.settings;
  if (path === "/overview") return <><SiteHeader active={path} /><main><PageIntro eyebrow="01 / The project" title="A city with weight." copy={settings.overview} /><section className="container overview-page-grid"><div className="overview-copy"><p className="lead">NEWCOMER is an upcoming realistic open-world game inspired by Melbourne, Australia.</p><p>NEWCOMER is focused on a grounded Melbourne-inspired world where the city feels specific, lived-in and worth exploring. The visual direction leans into wet streets, tram corridors, tight laneways, brick terraces and the quiet details between major landmarks.</p><p>The project is still in development, so we are keeping mechanics and platform details honest. This page will become the source of truth as more of the game is confirmed.</p><div className="fact-list"><div><span>SETTING</span><strong>Melbourne / Australia</strong></div><div><span>GENRE</span><strong>To be announced</strong></div><div><span>STATUS</span><strong>In development</strong></div></div></div><div className="overview-image"><img src={FALLBACK_ASSETS.tram} alt="Melbourne tram at dawn" /><span>REFERENCE FRAME / CITY AT FIRST LIGHT</span></div></section><section className="container feature-block"><div className="section-heading"><span className="eyebrow">What is confirmed</span><span className="section-index">02 — 02</span></div><div className="feature-empty"><div className="feature-number">—</div><div><h2>Features will be announced<br /><em>when they are real.</em></h2><p>We won’t pad the page with invented mechanics or placeholder promises. Check back for official information.</p></div></div></section></main><Footer settings={settings} /></>;
  if (path === "/gallery") return <><SiteHeader active={path} /><main><PageIntro eyebrow="02 / Visual archive" title="The city, observed." copy="A growing archive of Melbourne-inspired material, now including two realistic in-engine gameplay scenes made for the NEWCOMER world." /><section className="container gameplay-gallery"><div className="section-heading"><div><span className="eyebrow">Gameplay captures</span><h2>Built to feel <em>lived in.</em></h2></div><span className="section-index">REALTIME / 001</span></div><div className="gameplay-gallery-grid"><figure><img src={GAMEPLAY_ASSETS.laneway} alt="Realistic NEWCOMER gameplay capture of a rainy Melbourne-inspired laneway" /><figcaption><span>CAPTURE 01 / INNER CITY</span><strong>After the rain</strong><small>Wet asphalt, warm shop light and the close-up texture of a lived-in laneway.</small></figcaption></figure><figure><img src={GAMEPLAY_ASSETS.tram} alt="Realistic NEWCOMER gameplay capture of a Melbourne tram street" /><figcaption><span>CAPTURE 02 / TRAM CORRIDOR</span><strong>Blue-hour service</strong><small>Overhead wires, brick terraces and a tram line cutting through the evening.</small></figcaption></figure></div></section><section className="container full-gallery">{data.gallery.length ? data.gallery.map((item, i) => <GalleryCard key={item.id ?? item.title} item={item} index={i} large={i === 0} />) : <EmptyState title="No media published yet." copy="The gallery is ready for official images and video when they are available." />}</section><section className="container gallery-support"><span className="eyebrow">Keep the project moving</span><h2>Like the direction?</h2><p>Support the work behind NEWCOMER and help fund more grounded city details, environments and development time.</p><a className="button button-primary" href="https://buymeacoffee.com/vihaansaini" target="_blank" rel="noreferrer">Buy Me a Coffee <ExternalLink size={15} /></a></section></main><Footer settings={settings} /></>;
  if (path === "/updates") return <><SiteHeader active={path} /><main><PageIntro eyebrow="03 / Development log" title="Build in public, carefully." copy="Official news and development updates from the NEWCOMER team. No rumours, no filler — only what is ready to share." /><section className="container updates-page">{data.news.length ? data.news.map((item, i) => <UpdateRow key={item.id ?? item.title} item={item} index={i} />) : <EmptyState icon={<Sparkles size={18} />} title="The log is quiet for now." copy="Official development updates will appear here when they are ready to share." />}</section></main><Footer settings={settings} /></>;
  if (path === "/release") return <><SiteHeader active={path} /><main><PageIntro eyebrow="04 / Release" title="31 Dec 2026." copy="The current planned release date for NEWCOMER." /><section className="container release-page-card"><div className="release-card-mark">N<span>/</span>R</div><div className="release-card-content"><span className="eyebrow">Current status</span><h2>{settings.releaseStatus}</h2><p className="release-description">{settings.releaseDescription}</p><div className="release-card-meta"><div><span>Release date</span><strong>{settings.releaseDate || "TBA"}</strong></div><div><span>Platforms</span><strong>{settings.platforms || "TBA"}</strong></div></div><Link href="/community" className="button button-primary">Get announcements <ArrowRight size={16} /></Link></div></section><section className="container release-visuals"><div><img src={FALLBACK_ASSETS.industrial} alt="Melbourne industrial edge at dusk" /><span>REFERENCE FRAME / CITY EDGE</span></div><div><img src={FALLBACK_ASSETS.coast} alt="Australian coastal road near Melbourne" /><span>REFERENCE FRAME / BEYOND THE CITY</span></div></section></main><Footer settings={settings} /></>;
  if (path === "/store" || path === "/preorder") return <><SiteHeader active={path === "/preorder" ? "/preorder" : path} /><main><PageIntro eyebrow="05 / Store" title={data.products.length ? "Not available yet." : "Nothing for sale. Yet."} copy={data.products.length ? "Game passes and store items are not available yet. Official availability will be announced here when confirmed." : "Store details and pricing will only appear here once official products are announced."} /><section className="container store-page">{data.products.length ? data.products.map(product => <ProductCard key={product.id ?? product.name} product={product} />) : <EmptyState icon={<LockKeyhole size={18} />} title="No products announced." copy="Prices are editable by the project admin and will remain unlisted until confirmed." />}</section></main><Footer settings={settings} /></>;
  if (path === "/wheel") return <WheelPage />;
  if (path === "/account") return <AccountPage />;
  if (path === "/player") return <PlayerHubPage />;
  if (path === "/game-info") return <GameInfoPage settings={settings} />;
  if (path === "/development") return <DevelopmentPage data={data} />;
  if (path === "/community") return <CommunityPage settings={settings} />;
  if (path === "/contact") return <ContactPage settings={settings} />;
  return <HomePage data={data} />;
}

function ProductCard({ product }: { product: Product }) {
  return <article className="product-card"><div className="product-art"><span>NEWCOMER / STORE</span><Sparkles size={28} /></div><div className="product-body"><span className="eyebrow">{product.platform}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-footer"><strong>{product.price || "TBA"} {product.currency}</strong><span>NOT AVAILABLE YET</span></div><span className="button button-outline product-cta product-cta-disabled" aria-disabled="true">NOT AVAILABLE YET</span></div></article>;
}

function AccountPage() {
  const register = trpc.content.registerAccount.useMutation();
  const login = trpc.account.login.useMutation();
  const utils = trpc.useUtils();
  const { data: currentUser } = trpc.auth.me.useQuery();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [saved, setSaved] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (mode === "signup") register.mutate(form, { onSuccess: () => { setSaved(true); utils.auth.me.invalidate(); } });
    else login.mutate({ email: form.email, password: form.password }, { onSuccess: () => { setSaved(true); utils.auth.me.invalidate(); } });
  };
  const pending = register.isPending || login.isPending;
  return <><SiteHeader active="/account" /><main><PageIntro eyebrow="Account / Wheel access" title={mode === "signup" ? "Create your account." : "Sign in to NEWCOMER."} copy={mode === "signup" ? "Create an account with a password, then use it to enter the daily wheel. Phone is optional." : "Sign in with your NEWCOMER email and password. Admin accounts will see the ADMIN tab."} /><section className="container account-page"><div className="account-card"><div className="account-switch"><button className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setSaved(false); }}>Create account</button><button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setSaved(false); }}>Sign in</button></div>{saved ? <div className="account-success"><div className="signup-success"><Check size={16} /> {mode === "signup" ? "Account created." : "Signed in."}</div><h2>{currentUser?.role === "admin" ? "Admin access ready." : "You’re signed in."}</h2><p>{currentUser?.role === "admin" ? "The ADMIN tab is now visible in the website navigation." : "You can now enter your name once per day on the wheel."}</p>{currentUser?.role === "admin" ? <Link className="button button-primary" href="/admin">Open admin panel <ArrowRight size={16} /></Link> : <Link className="button button-primary" href="/wheel">Enter today’s wheel <ArrowRight size={16} /></Link>}</div> : <><form className="account-form" onSubmit={onSubmit}>{mode === "signup" && <label>Name<input required minLength={2} maxLength={160} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>}<label>Email<input required type="email" maxLength={320} value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>{mode === "signup" && <label>Phone number <span>(optional)</span><input type="tel" maxLength={40} value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} placeholder="+61 ..." /></label>}<label>Password<input required type="password" minLength={8} maxLength={128} value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" /></label><button className="button button-primary" type="submit" disabled={pending}>{pending ? <Loader2 className="spin" size={15} /> : <ShieldCheck size={15} />} {mode === "signup" ? "Create account" : "Sign in"}</button>{(register.error || login.error) && <p className="form-error">{register.error?.message || login.error?.message}</p>}<small>Your password is stored securely. Admin access is shown only after the server confirms the account role.</small></form><div className="account-divider"><span>or</span></div><button className="button button-outline" onClick={startLogin}>Use Manus sign in <ArrowRight size={15} /></button><small className="account-hint">Existing admin account? Sign in with Manus first, then create your password account to link admin access securely.</small></>}</div></section></main><Footer settings={DEFAULT_SETTINGS} /></>;
}

function WheelPage() {
  const { data: user, isLoading: authLoading } = trpc.auth.me.useQuery();
  const wheel = trpc.wheel.state.useQuery();
  const enter = trpc.wheel.enter.useMutation({ onSuccess: () => wheel.refetch() });
  const [displayName, setDisplayName] = useState("");
  const state = wheel.data;
  const enterWheel = (event: FormEvent) => { event.preventDefault(); enter.mutate({ displayName }); };
  return <><SiteHeader active="/wheel" /><main><PageIntro eyebrow="Daily wheel" title="One day. One winner." copy="Create an account, enter your name once per day, and stay eligible for a free NEWCOMER game prize until the planned release." /><section className="container wheel-layout"><div className="wheel-visual"><div className="wheel-pointer" /><div className="wheel-circle"><div className="wheel-slice slice-one" /><div className="wheel-slice slice-two" /><div className="wheel-slice slice-three" /><div className="wheel-slice slice-four" /><div className="wheel-center">N<span>WIN</span></div></div><span className="wheel-caption">ADMIN SPIN / ONE WINNER DAILY</span></div><div className="wheel-entry-card"><span className="eyebrow">Today’s draw</span><h2>Win the game<br /><em>for free.</em></h2><p>Admins spin the wheel once per day. The selected name is removed from the day’s entries and recorded for prize fulfilment.</p>{authLoading ? <Loader2 className="spin" /> : !user ? <div className="wheel-login"><LockKeyhole size={20} /><strong>Create an account to enter.</strong><span>Save your name, email and optional phone first, then sign in.</span><Link className="button button-primary" href="/account">Create account / sign in <ArrowRight size={16} /></Link></div> : !state?.isOpen ? <EmptyState title="The wheel is closed." copy="The planned release date has passed and daily entries are no longer being accepted." /> : state?.hasEntered ? <div className="wheel-entered"><div className="signup-success"><Check size={16} /> You’re entered for today.</div><strong>{state.entryName}</strong><p>You can’t enter another name today. The admin wheel will determine one winner.</p></div> : <form className="wheel-form" onSubmit={enterWheel}><label>Your name for today<input required minLength={2} maxLength={120} value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder="Type your name once" /></label><button className="button button-primary" type="submit" disabled={enter.isPending}>{enter.isPending ? <Loader2 className="spin" size={15} /> : <Sparkles size={15} />} Enter today’s wheel</button><small>One entry per account per day. No edits after submitting.</small>{enter.error && <p className="form-error">{enter.error.message}</p>}</form>}</div></section><section className="container wheel-rules"><div><span className="eyebrow">01 / Eligibility</span><p>You need an authenticated account to enter. One account can submit one display name each day.</p></div><div><span className="eyebrow">02 / Admin spin</span><p>Only authorized admins can spin the wheel. The system enforces one winner per day.</p></div><div><span className="eyebrow">03 / Prize</span><p>Winners are recorded in the admin dashboard and receive the game free from the project team.</p></div></section></main><Footer settings={DEFAULT_SETTINGS} /></>;
}

function CommunityPage({ settings }: { settings: SiteSettings }) {
  const links = [{ label: "Discord", icon: <MessageCircle size={20} />, url: settings.discordUrl }, { label: "Instagram", icon: <Instagram size={20} />, url: settings.instagramUrl }, { label: "YouTube", icon: <Youtube size={20} />, url: settings.youtubeUrl }];
  return <><SiteHeader active="/community" /><main><PageIntro eyebrow="Community" title="Stay close to the signal." copy="Official community and social channels will carry the next confirmed word from the project." /><section className="container social-grid">{links.map(link => <a key={link.label} className={`social-card ${link.url ? "available" : "unavailable"}`} href={link.url || "#"} onClick={e => !link.url && e.preventDefault()}>{link.icon}<div><span>{link.url ? "Official channel" : "Not published"}</span><h3>{link.label}</h3></div><ArrowUpRight /></a>)}</section><AnnouncementSignup /><section className="community-callout container"><span className="eyebrow">Community note</span><h2>No fake links.<br /><em>No dead ends.</em></h2><p>We will only publish destinations that are live and officially managed. If you have a community, press or partnership enquiry, use the support form.</p><Link className="button button-primary" href="/contact">Contact the team <Mail size={16} /></Link></section></main><Footer settings={settings} /></>;
}

function ContactPage({ settings }: { settings: SiteSettings }) {
  const submit = trpc.content.submitSupport.useMutation();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const onSubmit = (e: FormEvent) => { e.preventDefault(); submit.mutate(form, { onSuccess: () => { setSent(true); setForm({ name: "", email: "", subject: "", message: "" }); } }); };
  return <><SiteHeader active="/contact" /><main><PageIntro eyebrow="Support / Contact" title="Open a line." copy={settings.supportNote} /><section className="container contact-grid"><div className="contact-aside"><span className="eyebrow">Direct</span><h2>Questions,<br /><em>properly routed.</em></h2><p>For support, press, partnership and community enquiries, send a note using the form. The project team will review it from the official inbox.</p>{settings.contactEmail && <a className="contact-email" href={`mailto:${settings.contactEmail}`}><Mail size={16} /> {settings.contactEmail}</a>}</div><form className="support-form" onSubmit={onSubmit}><div className="form-row"><label>Name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label><label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label></div><label>Subject<input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What can we help with?" /></label><label>Message<textarea required rows={7} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your message..." /></label><button className="button button-primary" type="submit" disabled={submit.isPending}>{submit.isPending ? <Loader2 className="spin" size={16} /> : sent ? <Check size={16} /> : <Send size={16} />}{sent ? "Message received" : "Send message"}</button>{submit.error && <p className="form-error">{submit.error.message}</p>}</form></section></main><Footer settings={settings} /></>;
}

function AdminPage() {
  const { data: user, isLoading: authLoading } = trpc.auth.me.useQuery();
  const adminData = trpc.admin.data.useQuery(undefined, { enabled: user?.role === "admin" });
  const [tab, setTab] = useState("settings");
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<"gallery" | "news" | "product" | null>(null);
  const [draft, setDraft] = useState<MediaItem | NewsItem | Product | null>(null);
  const utils = trpc.useUtils();
  const saveSettings = trpc.admin.saveSettings.useMutation({ onSuccess: () => { setMessage("Settings saved."); utils.admin.data.invalidate(); } });
  const saveGallery = trpc.admin.saveGallery.useMutation({ onSuccess: () => { setMessage("Gallery item saved."); utils.admin.data.invalidate(); setEditing(null); } });
  const saveNews = trpc.admin.saveNews.useMutation({ onSuccess: () => { setMessage("Update saved."); utils.admin.data.invalidate(); setEditing(null); } });
  const saveProduct = trpc.admin.saveProduct.useMutation({ onSuccess: () => { setMessage("Store item saved."); utils.admin.data.invalidate(); setEditing(null); } });
  const deleteGallery = trpc.admin.deleteGallery.useMutation({ onSuccess: () => utils.admin.data.invalidate() });
  const deleteNews = trpc.admin.deleteNews.useMutation({ onSuccess: () => utils.admin.data.invalidate() });
  const deleteProduct = trpc.admin.deleteProduct.useMutation({ onSuccess: () => utils.admin.data.invalidate() });

  useEffect(() => { if (adminData.data) { setSettings(adminData.data.settings); setGallery(adminData.data.gallery.map(item => ({ ...item, published: item.published === 1, mediaType: item.mediaType as "image" | "video" }))); setNews(adminData.data.news.map(item => ({ ...item, published: item.published === 1, publishedAt: item.publishedAt?.toISOString() ?? null }))); setProducts(adminData.data.products.map(item => ({ ...item, published: item.published === 1 }))); } }, [adminData.data]);

  if (authLoading) return <div className="admin-loading"><Loader2 className="spin" /></div>;
  if (!user) return <AdminGate title="Admin access" copy="Sign in with the authorized project account to manage NEWCOMER content." action="Sign in" onClick={startLogin} />;
  if (user.role !== "admin") return <AdminGate title="Access denied" copy="This account is authenticated but does not have administrator permissions." action="Return home" onClick={() => window.location.assign("/")} />;

  const editItem = (type: "gallery" | "news" | "product", item?: MediaItem | NewsItem | Product) => {
    setEditing(type);
    setDraft(item ?? (type === "gallery" ? { title: "", description: "", imageUrl: "https://", mediaType: "image", published: false, sortOrder: gallery.length } : type === "news" ? { title: "", excerpt: "", body: "", imageUrl: "https://", published: false, publishedAt: null } : { name: "", description: "", price: "", currency: "AUD", platform: "TBA", availability: "TBA", purchaseUrl: "", published: false }));
  };
  const renderEditor = () => {
    if (!editing || !draft) return null;
    const type = editing;
    const set = (key: string, value: string | boolean | number | null) => setDraft({ ...draft, [key]: value } as typeof draft);
  return <div className="modal-backdrop"><div className="admin-modal"><div className="modal-head"><div><span className="eyebrow">Edit / {type}</span><h2>{type === "gallery" ? "Gallery media" : type === "news" ? "Development update" : "Store item"}</h2></div><button className="icon-button" onClick={() => setEditing(null)}><X /></button></div>{type === "gallery" && <><label>Title<input value={(draft as MediaItem).title} onChange={e => set("title", e.target.value)} /></label><label>Description<textarea value={(draft as MediaItem).description} onChange={e => set("description", e.target.value)} /></label><label>Image or video URL<input value={(draft as MediaItem).imageUrl} onChange={e => set("imageUrl", e.target.value)} /></label><div className="form-row"><label>Type<select value={(draft as MediaItem).mediaType} onChange={e => set("mediaType", e.target.value)}><option value="image">Image</option><option value="video">Video</option></select></label><label>Sort order<input type="number" value={(draft as MediaItem).sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} /></label></div><Toggle checked={(draft as MediaItem).published} onChange={v => set("published", v)} label="Published" /></>}{type === "news" && <><label>Title<input value={(draft as NewsItem).title} onChange={e => set("title", e.target.value)} /></label><label>Excerpt<textarea value={(draft as NewsItem).excerpt} onChange={e => set("excerpt", e.target.value)} /></label><label>Body<textarea rows={8} value={(draft as NewsItem).body} onChange={e => set("body", e.target.value)} /></label><label>Image URL<input value={(draft as NewsItem).imageUrl} onChange={e => set("imageUrl", e.target.value)} /></label><Toggle checked={(draft as NewsItem).published} onChange={v => set("published", v)} label="Published" /></>}{type === "product" && <><label>Name<input value={(draft as Product).name} onChange={e => set("name", e.target.value)} /></label><label>Description<textarea value={(draft as Product).description} onChange={e => set("description", e.target.value)} /></label><div className="form-row"><label>Price<input value={(draft as Product).price} onChange={e => set("price", e.target.value)} placeholder="TBA" /></label><label>Currency<input value={(draft as Product).currency} onChange={e => set("currency", e.target.value)} /></label></div><div className="form-row"><label>Platform<input value={(draft as Product).platform} onChange={e => set("platform", e.target.value)} /></label><label>Availability<input value={(draft as Product).availability} onChange={e => set("availability", e.target.value)} /></label></div><label>Purchase URL<input type="url" value={(draft as Product).purchaseUrl ?? ""} onChange={e => set("purchaseUrl", e.target.value)} placeholder="https://buy.stripe.com/..." /></label><Toggle checked={(draft as Product).published} onChange={v => set("published", v)} label="Published" /></>}<button className="button button-primary modal-save" onClick={() => type === "gallery" ? saveGallery.mutate(draft as MediaItem) : type === "news" ? saveNews.mutate(draft as NewsItem) : saveProduct.mutate(draft as Product)}><Save size={16} /> Save changes</button></div></div>;
  };

  return <><div className="admin-shell"><aside className="admin-sidebar"><Logo light /><div className="admin-user"><ShieldCheck size={16} /><div><span>Signed in as</span><strong>{user.name || user.email || "Admin"}</strong></div></div><nav className="admin-nav">{[["settings", "Site settings", <Settings2 size={16} />], ["gallery", "Gallery media", <Film size={16} />], ["news", "News & updates", <Sparkles size={16} />], ["products", "Store pricing", <Plus size={16} />], ["messages", "Support inbox", <Mail size={16} />], ["subscribers", "Announcement list", <Send size={16} />], ["wheel", "Daily wheel", <Sparkles size={16} />]].map(([id, label, icon]) => <button key={id as string} className={tab === id ? "active" : ""} onClick={() => setTab(id as string)}>{icon}<span>{label}</span></button>)}</nav><Link href="/" className="admin-exit">View public site <ExternalLink size={14} /></Link></aside><main className="admin-main"><div className="admin-topbar"><div><span className="eyebrow">NEWCOMER / ADMIN</span><h1>{tab === "settings" ? "Site settings" : tab === "gallery" ? "Gallery media" : tab === "news" ? "News & updates" : tab === "products" ? "Store pricing" : tab === "subscribers" ? "Announcement list" : tab === "wheel" ? "Daily wheel" : "Support inbox"}</h1></div>{message && <span className="save-note"><Check size={14} /> {message}</span>}</div>{tab === "settings" && <SettingsPanel settings={settings} setSettings={setSettings} onSave={() => saveSettings.mutate(settings)} />}{tab === "gallery" && <CollectionPanel kind="gallery" items={gallery} onAdd={() => editItem("gallery")} onEdit={item => editItem("gallery", item)} onDelete={id => deleteGallery.mutate({ id })} />}{tab === "news" && <CollectionPanel kind="news" items={news} onAdd={() => editItem("news")} onEdit={item => editItem("news", item)} onDelete={id => deleteNews.mutate({ id })} />}{tab === "products" && <CollectionPanel kind="product" items={products} onAdd={() => editItem("product")} onEdit={item => editItem("product", item)} onDelete={id => deleteProduct.mutate({ id })} />}{tab === "messages" && <MessagePanel messages={adminData.data?.messages ?? []} />}{tab === "subscribers" && <SubscriberPanel subscribers={adminData.data?.subscribers ?? []} />}{tab === "wheel" && <AdminWheelPanel wheel={adminData.data?.wheel} />}</main></div>{renderEditor()}</>;
}

function AdminGate({ title, copy, action, onClick }: { title: string; copy: string; action: string; onClick: () => void }) { return <div className="admin-gate"><Logo /><div className="gate-card"><LockKeyhole size={24} /><span className="eyebrow">Secure area</span><h1>{title}</h1><p>{copy}</p><button className="button button-primary" onClick={onClick}>{action} <ArrowRight size={16} /></button><Link href="/" className="text-link">Return to public site</Link></div></div>; }

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) { return <button type="button" className={`toggle-row ${checked ? "checked" : ""}`} onClick={() => onChange(!checked)}><span className="toggle"><span /></span>{label}<span className="toggle-state">{checked ? "ON" : "OFF"}</span></button>; }

function SettingsPanel({ settings, setSettings, onSave }: { settings: SiteSettings; setSettings: (s: SiteSettings) => void; onSave: () => void }) { const update = (key: keyof SiteSettings, value: string) => setSettings({ ...settings, [key]: value }); return <div className="settings-panel"><div className="admin-card"><div className="card-head"><div><span className="eyebrow">Public copy</span><h2>What visitors see</h2></div><button className="button button-primary" onClick={onSave}><Save size={16} /> Save settings</button></div><label>Overview<textarea rows={5} value={settings.overview} onChange={e => update("overview", e.target.value)} /></label><label>Support note<textarea rows={3} value={settings.supportNote} onChange={e => update("supportNote", e.target.value)} /></label></div><div className="admin-card"><div className="card-head"><div><span className="eyebrow">Release</span><h2>Honest by default</h2></div></div><p className="admin-helper">The current planned date is 31 Dec 2026. Keep this editable if the official schedule changes.</p><div className="form-row"><label>Status<input value={settings.releaseStatus} onChange={e => update("releaseStatus", e.target.value)} /></label><label>Date<input value={settings.releaseDate} onChange={e => update("releaseDate", e.target.value)} /></label></div><label>Description<textarea rows={4} value={settings.releaseDescription} onChange={e => update("releaseDescription", e.target.value)} /></label><label>Platforms<input value={settings.platforms} onChange={e => update("platforms", e.target.value)} /></label></div><div className="admin-card"><div className="card-head"><div><span className="eyebrow">Community</span><h2>Official links</h2></div></div><div className="form-row"><label>Discord URL<input value={settings.discordUrl} onChange={e => update("discordUrl", e.target.value)} placeholder="https://discord.com/..." /></label><label>Contact email<input value={settings.contactEmail} onChange={e => update("contactEmail", e.target.value)} /></label></div><div className="form-row"><label>Instagram URL<input value={settings.instagramUrl} onChange={e => update("instagramUrl", e.target.value)} /></label><label>YouTube URL<input value={settings.youtubeUrl} onChange={e => update("youtubeUrl", e.target.value)} /></label></div></div></div>; }

function CollectionPanel({ kind, items, onAdd, onEdit, onDelete }: { kind: "gallery" | "news" | "product"; items: Array<MediaItem | NewsItem | Product>; onAdd: () => void; onEdit: (item: MediaItem | NewsItem | Product) => void; onDelete: (id: number) => void }) { return <div className="admin-card collection-panel"><div className="card-head"><div><span className="eyebrow">Editable content</span><h2>{items.length ? `${items.length} item${items.length > 1 ? "s" : ""}` : "No items yet"}</h2></div><button className="button button-primary" onClick={onAdd}><Plus size={16} /> Add {kind === "gallery" ? "media" : kind === "news" ? "update" : "product"}</button></div>{items.length ? <div className="collection-list">{items.map((item, index) => <div className="collection-row" key={item.id ?? index}><div className="collection-thumb">{"imageUrl" in item && item.imageUrl ? <img src={item.imageUrl} alt="" /> : <span>{index + 1}</span>}</div><div className="collection-copy"><strong>{"title" in item ? item.title : item.name}</strong><span>{"published" in item && item.published ? "Published" : "Draft"}{"platform" in item ? ` · ${item.platform}` : ""}</span></div><button className="icon-button" onClick={() => onEdit(item)}><Settings2 size={16} /></button>{item.id && <button className="icon-button danger" onClick={() => onDelete(item.id!)}><Trash2 size={16} /></button>}</div>)}</div> : <EmptyState title={`No ${kind} published or drafted.`} copy="Use the add button to create the first editable item." />}</div>; }

function MessagePanel({ messages }: { messages: Array<{ id: number; name: string; email: string; subject: string; message: string; status: string; createdAt: Date }> }) { return <div className="admin-card message-panel"><div className="card-head"><div><span className="eyebrow">Inbound</span><h2>{messages.length ? `${messages.length} support message${messages.length > 1 ? "s" : ""}` : "No messages yet"}</h2></div></div>{messages.length ? <div className="message-list">{messages.map(message => <article key={message.id} className="message-card"><div><span className="eyebrow">{new Date(message.createdAt).toLocaleDateString("en-AU")}</span><h3>{message.subject}</h3><p>{message.message}</p></div><div className="message-meta"><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a><span className="status-pill">{message.status}</span></div></article>)}</div> : <EmptyState icon={<Mail size={18} />} title="Inbox is clear." copy="Messages submitted from the support page will appear here." />}</div>; }

function SubscriberPanel({ subscribers }: { subscribers: Array<{ id: number; email: string; createdAt: Date }> }) {
  const broadcast = trpc.admin.broadcast.useMutation();
  const [form, setForm] = useState({ subject: "", title: "", body: "" });
  const [sentCount, setSentCount] = useState<number | null>(null);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    broadcast.mutate(form, { onSuccess: result => { setSentCount(result.sent); setForm({ subject: "", title: "", body: "" }); } });
  };
  return <div><div className="admin-card broadcast-card"><div className="card-head"><div><span className="eyebrow">Resend broadcast</span><h2>Send an official update</h2></div></div><p className="admin-helper">This sends to every subscriber in the list using the configured Resend sender. Double-check the copy before sending.</p><form onSubmit={onSubmit}><div className="form-row"><label>Subject<input required value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} placeholder="NEWCOMER update" /></label><label>Email title<input required value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="A new signal from the project" /></label></div><label>Message<textarea required rows={6} value={form.body} onChange={event => setForm({ ...form, body: event.target.value })} placeholder="Write the announcement..." /></label><button className="button button-primary" type="submit" disabled={broadcast.isPending || !subscribers.length}>{broadcast.isPending ? <Loader2 className="spin" size={15} /> : <Send size={15} />} Send to {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}</button>{sentCount !== null && <p className="signup-success"> <Check size={15} /> Sent to {sentCount} subscriber{sentCount === 1 ? "" : "s"}.</p>}{broadcast.error && <p className="form-error">{broadcast.error.message}</p>}</form></div><div className="admin-card message-panel"><div className="card-head"><div><span className="eyebrow">Announcements</span><h2>{subscribers.length ? `${subscribers.length} subscriber${subscribers.length > 1 ? "s" : ""}` : "No subscribers yet"}</h2></div></div>{subscribers.length ? <div className="message-list">{subscribers.map(subscriber => <article key={subscriber.id} className="message-card"><div><span className="eyebrow">Joined {new Date(subscriber.createdAt).toLocaleDateString("en-AU")}</span><h3>{subscriber.email}</h3><p>Subscribed to official announcements and community updates.</p></div><div className="message-meta"><a href={`mailto:${subscriber.email}`}>Email subscriber</a><span className="status-pill">active</span></div></article>)}</div> : <EmptyState icon={<Send size={18} />} title="The list is clear." copy="New announcement signups will appear here." />}</div></div>;
}

type AdminWheelData = {
  today: string;
  releaseDate: string;
  entries: Array<{ id: number; displayName: string; createdAt: Date }>;
  winners: Array<{ id: number; winnerDate: string; displayName: string; prize: string; fulfilled: number; createdAt: Date }>;
};

function AdminWheelVisual({ entries, disabled, onSpin }: { entries: AdminWheelData["entries"]; disabled: boolean; onSpin: () => void }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const segmentAngle = entries.length ? 360 / entries.length : 360;
  const spin = () => {
    if (disabled || spinning || !entries.length) return;
    const winnerIndex = Math.floor(Math.random() * entries.length);
    const target = 360 - (winnerIndex * segmentAngle + segmentAngle / 2);
    setSpinning(true);
    setRotation(rotation + 360 * 6 + target);
    window.setTimeout(() => {
      setSpinning(false);
      onSpin();
    }, 3600);
  };
  const gradient = entries.length
    ? `conic-gradient(${entries.map((_, index) => `${index % 2 ? "#242424" : "#e45b25"} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`).join(", ")})`
    : "#1a1a1a";
  return <div className="admin-wheel-visual-wrap">
    <div className="admin-wheel-pointer" aria-hidden="true" />
    <div className={`admin-wheel ${spinning ? "is-spinning" : ""}`} style={{ transform: `rotate(${rotation}deg)`, background: gradient }}>
      {entries.map((entry, index) => {
        const angle = index * segmentAngle + segmentAngle / 2;
        return <span className="admin-wheel-label" key={entry.id} style={{ transform: `rotate(${angle}deg) translateY(-42%) rotate(90deg)` }} title={entry.displayName}>{entry.displayName.length > 16 ? `${entry.displayName.slice(0, 15)}…` : entry.displayName}</span>;
      })}
      <button className="admin-wheel-center" onClick={spin} disabled={disabled || spinning || !entries.length}>{spinning ? <Loader2 className="spin" size={18} /> : <><Sparkles size={16} /><span>SPIN</span></>}</button>
    </div>
  </div>;
}

function AdminWheelPanel({ wheel }: { wheel?: AdminWheelData }) {
  const utils = trpc.useUtils();
  const spin = trpc.admin.spinWheel.useMutation({ onSuccess: () => utils.admin.data.invalidate() });
  const markFulfilled = trpc.admin.markWinnerFulfilled.useMutation({ onSuccess: () => utils.admin.data.invalidate() });
  const todayWinner = wheel?.winners.find(winner => winner.winnerDate === wheel.today);
  const entries = wheel?.entries ?? [];
  const handleSpin = () => spin.mutate();
  return <div className="wheel-admin-grid"><div className="admin-card admin-wheel-card"><div className="card-head"><div><span className="eyebrow">{wheel?.today ?? "Today"}</span><h2>Daily spin</h2></div><span className="status-pill">admin only</span></div><p className="admin-helper">Every unselected daily entry stays on the wheel, including [NO WINNER] slots. If a user has entered on multiple days, each entry remains separate and only the selected entry is removed.</p><AdminWheelVisual entries={entries} disabled={spin.isPending || Boolean(todayWinner)} onSpin={handleSpin} /><div className="wheel-admin-stats"><div><span>Entries on wheel</span><strong>{entries.length}</strong></div><div><span>Release date</span><strong>{wheel?.releaseDate ?? "31 Dec 2026"}</strong></div></div>{todayWinner && <div className="winner-callout"><span className="eyebrow">{todayWinner.displayName === "[NO WINNER]" ? "Draw result" : "Today’s winner"}</span><strong>{todayWinner.displayName}</strong><span>{todayWinner.prize}</span></div>}{spin.error && <p className="form-error">{spin.error.message}</p>}</div><div className="admin-card"><div className="card-head"><div><span className="eyebrow">Live entries</span><h2>{entries.length ? "Entries still on the wheel" : "No entries yet"}</h2></div></div>{entries.length ? <div className="wheel-entry-list">{entries.map((entry, index) => <div className="wheel-entry-row" key={entry.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{entry.displayName}</strong><small>{new Date(entry.createdAt).toLocaleDateString("en-AU")}</small></div>)}</div> : <EmptyState icon={<Sparkles size={18} />} title="Waiting for entries." copy="Names appear here after signed-in users enter the daily wheel." />}</div><div className="admin-card wheel-winners-card"><div className="card-head"><div><span className="eyebrow">Prize fulfilment</span><h2>Winner history</h2></div></div>{wheel?.winners.length ? <div className="wheel-entry-list">{wheel.winners.map(winner => <div className="winner-history-row" key={winner.id}><div><strong>{winner.displayName}</strong><span>{winner.winnerDate} · {winner.prize}</span></div><button className={`status-pill ${winner.fulfilled ? "is-fulfilled" : ""}`} disabled={winner.displayName === "[NO WINNER]"} onClick={() => markFulfilled.mutate({ id: winner.id, fulfilled: !winner.fulfilled })}>{winner.fulfilled ? "Fulfilled" : "Mark fulfilled"}</button></div>)}</div> : <EmptyState title="No winners yet." copy="Completed daily spins will be recorded here." />}</div></div>;
}

function usePublicData() {
  const query = trpc.content.site.useQuery();
  return query.data ?? DEFAULT_SITE_DATA;
}

export default function Home() {
  const [location] = useLocation();
  const data = usePublicData();
  if (location === "/admin") return <AdminPage />;
  return <PublicPage data={data} path={location} />;
}

function ArrowUpRight({ size = 16 }: { size?: number }) { return <ArrowRight size={size} className="arrow-up-right" />; }

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
import { FALLBACK_ASSETS, DEFAULT_SETTINGS, type MediaItem, type NewsItem, type Product, type SiteSettings } from "@shared/content";
import { startLogin } from "../const";
import { trpc } from "../lib/trpc";

const orange = "#f05d23";

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
  const links = [
    ["Overview", "/overview"],
    ["Gallery", "/gallery"],
    ["Updates", "/updates"],
    ["Release", "/release"],
    ["Store", "/store"],
  ];
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Logo />
        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={active === href ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>
          ))}
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

function EmptyState({ icon, title, copy }: { icon?: React.ReactNode; title: string; copy: string }) {
  return <div className="empty-state">{icon && <span className="empty-icon">{icon}</span>}<h3>{title}</h3><p>{copy}</p></div>;
}

function PublicPage({ data, path }: { data: ReturnType<typeof usePublicData>; path: string }) {
  const settings = data.settings;
  if (path === "/overview") return <><SiteHeader active={path} /><main><PageIntro eyebrow="01 / The project" title="A city with weight." copy={settings.overview} /><section className="container overview-page-grid"><div className="overview-copy"><p className="lead">NEWCOMER is an upcoming realistic open-world game inspired by Melbourne, Australia.</p><p>The official feature set, platforms and release details have not been announced. This page will become the source of truth as the project moves forward.</p><div className="fact-list"><div><span>SETTING</span><strong>Melbourne / Australia</strong></div><div><span>GENRE</span><strong>To be announced</strong></div><div><span>STATUS</span><strong>In development</strong></div></div></div><div className="overview-image"><img src={FALLBACK_ASSETS.tram} alt="Melbourne tram at dawn" /><span>REFERENCE FRAME / CITY AT FIRST LIGHT</span></div></section><section className="container feature-block"><div className="section-heading"><span className="eyebrow">What is confirmed</span><span className="section-index">02 — 02</span></div><div className="feature-empty"><div className="feature-number">—</div><div><h2>Features will be announced<br /><em>when they are real.</em></h2><p>We won’t pad the page with invented mechanics or placeholder promises. Check back for official information.</p></div></div></section></main><Footer settings={settings} /></>;
  if (path === "/gallery") return <><SiteHeader active={path} /><main><PageIntro eyebrow="02 / Visual archive" title="The city, observed." copy="A growing archive of atmospheric Melbourne-inspired visual material. Official gameplay captures will appear here as they are released." /><section className="container full-gallery">{data.gallery.length ? data.gallery.map((item, i) => <GalleryCard key={item.id ?? item.title} item={item} index={i} large={i === 0} />) : <EmptyState title="No media published yet." copy="The gallery is ready for official images and video when they are available." />}</section></main><Footer settings={settings} /></>;
  if (path === "/updates") return <><SiteHeader active={path} /><main><PageIntro eyebrow="03 / Development log" title="Build in public, carefully." copy="Official news and development updates from the NEWCOMER team. No rumours, no filler — only what is ready to share." /><section className="container updates-page">{data.news.length ? data.news.map((item, i) => <UpdateRow key={item.id ?? item.title} item={item} index={i} />) : <EmptyState icon={<Sparkles size={18} />} title="The log is quiet for now." copy="Official development updates will appear here when they are ready to share." />}</section></main><Footer settings={settings} /></>;
  if (path === "/release") return <><SiteHeader active={path} /><main><PageIntro eyebrow="04 / Release" title="When it is ready." copy="Release information will be published here as soon as it is official." /><section className="container release-page-card"><div className="release-card-mark">N<span>/</span>R</div><div className="release-card-content"><span className="eyebrow">Current status</span><h2>{settings.releaseStatus}</h2><div className="release-card-meta"><div><span>Release date</span><strong>{settings.releaseDate || "TBA"}</strong></div><div><span>Platforms</span><strong>{settings.platforms || "TBA"}</strong></div></div><p>Sign up to the community channels for future announcements. There is no release date to share yet.</p><Link href="/community" className="button button-primary">Find the community <ArrowRight size={16} /></Link></div></section></main><Footer settings={settings} /></>;
  if (path === "/store") return <><SiteHeader active={path} /><main><PageIntro eyebrow="05 / Store" title="Nothing for sale. Yet." copy="Store details and pricing will only appear here once official products are announced." /><section className="container store-page">{data.products.length ? data.products.map(product => <ProductCard key={product.id ?? product.name} product={product} />) : <EmptyState icon={<LockKeyhole size={18} />} title="No products announced." copy="Prices are editable by the project admin and will remain unlisted until confirmed." />}</section></main><Footer settings={settings} /></>;
  if (path === "/community") return <CommunityPage settings={settings} />;
  if (path === "/contact") return <ContactPage settings={settings} />;
  return <HomePage data={data} />;
}

function ProductCard({ product }: { product: Product }) {
  return <article className="product-card"><div className="product-art"><span>NEWCOMER / STORE</span><Sparkles size={28} /></div><div className="product-body"><span className="eyebrow">{product.platform}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-footer"><strong>{product.price || "TBA"} {product.currency}</strong><span>{product.availability}</span></div></div></article>;
}

function CommunityPage({ settings }: { settings: SiteSettings }) {
  const links = [{ label: "Discord", icon: <MessageCircle size={20} />, url: settings.discordUrl }, { label: "Instagram", icon: <Instagram size={20} />, url: settings.instagramUrl }, { label: "YouTube", icon: <Youtube size={20} />, url: settings.youtubeUrl }];
  return <><SiteHeader active="/community" /><main><PageIntro eyebrow="Community" title="Stay close to the signal." copy="Official community and social channels will carry the next confirmed word from the project." /><section className="container social-grid">{links.map(link => <a key={link.label} className={`social-card ${link.url ? "available" : "unavailable"}`} href={link.url || "#"} onClick={e => !link.url && e.preventDefault()}>{link.icon}<div><span>{link.url ? "Official channel" : "Not published"}</span><h3>{link.label}</h3></div><ArrowUpRight /></a>)}</section><section className="community-callout container"><span className="eyebrow">Community note</span><h2>No fake links.<br /><em>No dead ends.</em></h2><p>We will only publish destinations that are live and officially managed. If you have a community, press or partnership enquiry, use the support form.</p><Link className="button button-primary" href="/contact">Contact the team <Mail size={16} /></Link></section></main><Footer settings={settings} /></>;
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
    setDraft(item ?? (type === "gallery" ? { title: "", description: "", imageUrl: "https://", mediaType: "image", published: false, sortOrder: gallery.length } : type === "news" ? { title: "", excerpt: "", body: "", imageUrl: "https://", published: false, publishedAt: null } : { name: "", description: "", price: "", currency: "AUD", platform: "TBA", availability: "TBA", published: false }));
  };
  const renderEditor = () => {
    if (!editing || !draft) return null;
    const type = editing;
    const set = (key: string, value: string | boolean | number | null) => setDraft({ ...draft, [key]: value } as typeof draft);
    return <div className="modal-backdrop"><div className="admin-modal"><div className="modal-head"><div><span className="eyebrow">Edit / {type}</span><h2>{type === "gallery" ? "Gallery media" : type === "news" ? "Development update" : "Store item"}</h2></div><button className="icon-button" onClick={() => setEditing(null)}><X /></button></div>{type === "gallery" && <><label>Title<input value={(draft as MediaItem).title} onChange={e => set("title", e.target.value)} /></label><label>Description<textarea value={(draft as MediaItem).description} onChange={e => set("description", e.target.value)} /></label><label>Image or video URL<input value={(draft as MediaItem).imageUrl} onChange={e => set("imageUrl", e.target.value)} /></label><div className="form-row"><label>Type<select value={(draft as MediaItem).mediaType} onChange={e => set("mediaType", e.target.value)}><option value="image">Image</option><option value="video">Video</option></select></label><label>Sort order<input type="number" value={(draft as MediaItem).sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} /></label></div><Toggle checked={(draft as MediaItem).published} onChange={v => set("published", v)} label="Published" /></>}{type === "news" && <><label>Title<input value={(draft as NewsItem).title} onChange={e => set("title", e.target.value)} /></label><label>Excerpt<textarea value={(draft as NewsItem).excerpt} onChange={e => set("excerpt", e.target.value)} /></label><label>Body<textarea rows={8} value={(draft as NewsItem).body} onChange={e => set("body", e.target.value)} /></label><label>Image URL<input value={(draft as NewsItem).imageUrl} onChange={e => set("imageUrl", e.target.value)} /></label><Toggle checked={(draft as NewsItem).published} onChange={v => set("published", v)} label="Published" /></>}{type === "product" && <><label>Name<input value={(draft as Product).name} onChange={e => set("name", e.target.value)} /></label><label>Description<textarea value={(draft as Product).description} onChange={e => set("description", e.target.value)} /></label><div className="form-row"><label>Price<input value={(draft as Product).price} onChange={e => set("price", e.target.value)} placeholder="TBA" /></label><label>Currency<input value={(draft as Product).currency} onChange={e => set("currency", e.target.value)} /></label></div><div className="form-row"><label>Platform<input value={(draft as Product).platform} onChange={e => set("platform", e.target.value)} /></label><label>Availability<input value={(draft as Product).availability} onChange={e => set("availability", e.target.value)} /></label></div><Toggle checked={(draft as Product).published} onChange={v => set("published", v)} label="Published" /></>}<button className="button button-primary modal-save" onClick={() => type === "gallery" ? saveGallery.mutate(draft as MediaItem) : type === "news" ? saveNews.mutate(draft as NewsItem) : saveProduct.mutate(draft as Product)}><Save size={16} /> Save changes</button></div></div>;
  };

  return <><div className="admin-shell"><aside className="admin-sidebar"><Logo light /><div className="admin-user"><ShieldCheck size={16} /><div><span>Signed in as</span><strong>{user.name || user.email || "Admin"}</strong></div></div><nav className="admin-nav">{[["settings", "Site settings", <Settings2 size={16} />], ["gallery", "Gallery media", <Film size={16} />], ["news", "News & updates", <Sparkles size={16} />], ["products", "Store pricing", <Plus size={16} />], ["messages", "Support inbox", <Mail size={16} />]].map(([id, label, icon]) => <button key={id as string} className={tab === id ? "active" : ""} onClick={() => setTab(id as string)}>{icon}<span>{label}</span></button>)}</nav><Link href="/" className="admin-exit">View public site <ExternalLink size={14} /></Link></aside><main className="admin-main"><div className="admin-topbar"><div><span className="eyebrow">NEWCOMER / ADMIN</span><h1>{tab === "settings" ? "Site settings" : tab === "gallery" ? "Gallery media" : tab === "news" ? "News & updates" : tab === "products" ? "Store pricing" : "Support inbox"}</h1></div>{message && <span className="save-note"><Check size={14} /> {message}</span>}</div>{tab === "settings" && <SettingsPanel settings={settings} setSettings={setSettings} onSave={() => saveSettings.mutate(settings)} />}{tab === "gallery" && <CollectionPanel kind="gallery" items={gallery} onAdd={() => editItem("gallery")} onEdit={item => editItem("gallery", item)} onDelete={id => deleteGallery.mutate({ id })} />}{tab === "news" && <CollectionPanel kind="news" items={news} onAdd={() => editItem("news")} onEdit={item => editItem("news", item)} onDelete={id => deleteNews.mutate({ id })} />}{tab === "products" && <CollectionPanel kind="product" items={products} onAdd={() => editItem("product")} onEdit={item => editItem("product", item)} onDelete={id => deleteProduct.mutate({ id })} />}{tab === "messages" && <MessagePanel messages={adminData.data?.messages ?? []} />}</main></div>{renderEditor()}</>;
}

function AdminGate({ title, copy, action, onClick }: { title: string; copy: string; action: string; onClick: () => void }) { return <div className="admin-gate"><Logo /><div className="gate-card"><LockKeyhole size={24} /><span className="eyebrow">Secure area</span><h1>{title}</h1><p>{copy}</p><button className="button button-primary" onClick={onClick}>{action} <ArrowRight size={16} /></button><Link href="/" className="text-link">Return to public site</Link></div></div>; }

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) { return <button type="button" className={`toggle-row ${checked ? "checked" : ""}`} onClick={() => onChange(!checked)}><span className="toggle"><span /></span>{label}<span className="toggle-state">{checked ? "ON" : "OFF"}</span></button>; }

function SettingsPanel({ settings, setSettings, onSave }: { settings: SiteSettings; setSettings: (s: SiteSettings) => void; onSave: () => void }) { const update = (key: keyof SiteSettings, value: string) => setSettings({ ...settings, [key]: value }); return <div className="settings-panel"><div className="admin-card"><div className="card-head"><div><span className="eyebrow">Public copy</span><h2>What visitors see</h2></div><button className="button button-primary" onClick={onSave}><Save size={16} /> Save settings</button></div><label>Overview<textarea rows={5} value={settings.overview} onChange={e => update("overview", e.target.value)} /></label><label>Support note<textarea rows={3} value={settings.supportNote} onChange={e => update("supportNote", e.target.value)} /></label></div><div className="admin-card"><div className="card-head"><div><span className="eyebrow">Release</span><h2>Honest by default</h2></div></div><p className="admin-helper">Leave fields as TBA or unannounced until the details are confirmed. These values appear across the public site.</p><div className="form-row"><label>Status<input value={settings.releaseStatus} onChange={e => update("releaseStatus", e.target.value)} /></label><label>Date<input value={settings.releaseDate} onChange={e => update("releaseDate", e.target.value)} /></label></div><label>Platforms<input value={settings.platforms} onChange={e => update("platforms", e.target.value)} /></label></div><div className="admin-card"><div className="card-head"><div><span className="eyebrow">Community</span><h2>Official links</h2></div></div><div className="form-row"><label>Discord URL<input value={settings.discordUrl} onChange={e => update("discordUrl", e.target.value)} placeholder="https://discord.com/..." /></label><label>Contact email<input value={settings.contactEmail} onChange={e => update("contactEmail", e.target.value)} /></label></div><div className="form-row"><label>Instagram URL<input value={settings.instagramUrl} onChange={e => update("instagramUrl", e.target.value)} /></label><label>YouTube URL<input value={settings.youtubeUrl} onChange={e => update("youtubeUrl", e.target.value)} /></label></div></div></div>; }

function CollectionPanel({ kind, items, onAdd, onEdit, onDelete }: { kind: "gallery" | "news" | "product"; items: Array<MediaItem | NewsItem | Product>; onAdd: () => void; onEdit: (item: MediaItem | NewsItem | Product) => void; onDelete: (id: number) => void }) { return <div className="admin-card collection-panel"><div className="card-head"><div><span className="eyebrow">Editable content</span><h2>{items.length ? `${items.length} item${items.length > 1 ? "s" : ""}` : "No items yet"}</h2></div><button className="button button-primary" onClick={onAdd}><Plus size={16} /> Add {kind === "gallery" ? "media" : kind === "news" ? "update" : "product"}</button></div>{items.length ? <div className="collection-list">{items.map((item, index) => <div className="collection-row" key={item.id ?? index}><div className="collection-thumb">{"imageUrl" in item && item.imageUrl ? <img src={item.imageUrl} alt="" /> : <span>{index + 1}</span>}</div><div className="collection-copy"><strong>{"title" in item ? item.title : item.name}</strong><span>{"published" in item && item.published ? "Published" : "Draft"}{"platform" in item ? ` · ${item.platform}` : ""}</span></div><button className="icon-button" onClick={() => onEdit(item)}><Settings2 size={16} /></button>{item.id && <button className="icon-button danger" onClick={() => onDelete(item.id!)}><Trash2 size={16} /></button>}</div>)}</div> : <EmptyState title={`No ${kind} published or drafted.`} copy="Use the add button to create the first editable item." />}</div>; }

function MessagePanel({ messages }: { messages: Array<{ id: number; name: string; email: string; subject: string; message: string; status: string; createdAt: Date }> }) { return <div className="admin-card message-panel"><div className="card-head"><div><span className="eyebrow">Inbound</span><h2>{messages.length ? `${messages.length} support message${messages.length > 1 ? "s" : ""}` : "No messages yet"}</h2></div></div>{messages.length ? <div className="message-list">{messages.map(message => <article key={message.id} className="message-card"><div><span className="eyebrow">{new Date(message.createdAt).toLocaleDateString("en-AU")}</span><h3>{message.subject}</h3><p>{message.message}</p></div><div className="message-meta"><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a><span className="status-pill">{message.status}</span></div></article>)}</div> : <EmptyState icon={<Mail size={18} />} title="Inbox is clear." copy="Messages submitted from the support page will appear here." />}</div>; }

function usePublicData() {
  const query = trpc.content.get.useQuery();
  return query.data ?? { settings: DEFAULT_SETTINGS, gallery: [], news: [], products: [] };
}

export default function Home() {
  const [location] = useLocation();
  const data = usePublicData();
  if (location === "/admin") return <AdminPage />;
  return <PublicPage data={data} path={location} />;
}

function ArrowUpRight({ size = 16 }: { size?: number }) { return <ArrowRight size={size} className="arrow-up-right" />; }

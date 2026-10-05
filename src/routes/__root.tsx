import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import dwpLogo from "@/assets/dwp-logo-white-lockup.svg";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Pagina non trovata</h2>
        <p className="mt-2 text-sm text-muted-foreground">La pagina richiesta non esiste o è stata spostata.</p>
        <Button asChild className="mt-6"><Link to="/">Torna alla Home</Link></Button>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Questa pagina non si è caricata</h1>
        <p className="mt-2 text-sm text-muted-foreground">Si è verificato un problema. Puoi riprovare o tornare alla Home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={() => { router.invalidate(); reset(); }}>Riprova</Button>
          <Button asChild variant="outline"><Link to="/">Torna alla Home</Link></Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "DataWisePartners" },
      { property: "og:image", content: "https://www.datawisepartners.it/dwp-social-v4.jpg" },
      { property: "og:image:width", content: "256" },
      { property: "og:image:height", content: "256" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:secure_url", content: "https://www.datawisepartners.it/dwp-social-v4.jpg" },
      { property: "og:image:alt", content: "DWP — DataWisePartners" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:image", content: "https://www.datawisepartners.it/dwp-social-v4.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500&display=swap" },
      { rel: "icon", href: "/dwp-favicon-v4.png", type: "image/png", sizes: "64x64" },
      { rel: "apple-touch-icon", href: "/dwp-favicon-v4.png", sizes: "64x64" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="it"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Soluzioni" },
  { to: "/come-lavoriamo", label: "Come lavoriamo" },
  { to: "/about", label: "Chi siamo" },
  { to: "/contact", label: "Contatti" },
] as const;

function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-primary-foreground/15 bg-primary/95 text-primary-foreground backdrop-blur-md">
      <div className="site-container flex h-[4.5rem] items-center justify-between">
        <Link to="/" aria-label="DataWisePartners, Home" className="brand-lockup"><img src={dwpLogo} alt="DataWisePartners" /></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigazione principale">
          {NAV_LINKS.map((link) => <Link key={link.label} to={link.to} activeOptions={{ exact: link.to === "/" }} activeProps={{ className: "bg-primary-foreground/10 text-primary-foreground" }} className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/65 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground">{link.label}</Link>)}
        </nav>
        <Button asChild className="hidden bg-accent text-accent-foreground hover:bg-accent/90 lg:inline-flex"><Link to="/contact">Parliamone</Link></Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground lg:hidden" aria-label={open ? "Chiudi menu" : "Apri menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="border-t border-primary-foreground/15 bg-primary px-4 py-4 lg:hidden" aria-label="Navigazione mobile"><div className="mx-auto flex max-w-7xl flex-col">{NAV_LINKS.map((link) => <Link key={link.label} to={link.to} onClick={() => setOpen(false)} className="border-b border-primary-foreground/15 px-2 py-3 text-base font-medium text-primary-foreground">{link.label}</Link>)}<Button asChild className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/contact" onClick={() => setOpen(false)}>Parliamone</Link></Button></div></nav>}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="site-container py-14 sm:py-16">
        <div className="grid gap-10 border-b border-footer-foreground/15 pb-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div><img src={dwpLogo} alt="DataWisePartners — Dati intelligenti per decisioni sagge" className="footer-logo" /><p className="mt-5 max-w-2xl text-base leading-7 text-footer-foreground/65">Rendiamo l'azienda leggibile, collegabile e governata: pronta a cogliere le opportunità dell'AI, oggi e domani.</p></div>
          <nav className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm" aria-label="Navigazione footer">{NAV_LINKS.map((link) => <Link key={link.label} to={link.to} className="text-footer-foreground/65 transition-colors hover:text-footer-foreground">{link.label}</Link>)}</nav>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-footer-foreground/50 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} DataWisePartners</span><div className="flex gap-6"><Link to="/privacy" className="transition-colors hover:text-footer-foreground">Privacy Policy</Link><Link to="/cookies" className="transition-colors hover:text-footer-foreground">Cookie Policy</Link></div></div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <QueryClientProvider client={queryClient}><div className="flex min-h-screen flex-col"><SiteHeader /><main className="flex-1"><Outlet /></main><SiteFooter /></div></QueryClientProvider>;
}

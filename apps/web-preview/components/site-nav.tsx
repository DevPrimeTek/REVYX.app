import Link from 'next/link';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leads', label: 'Leads' },
  { href: '/properties', label: 'Properties' },
  { href: '/deals', label: 'Deals' },
  { href: '/manager', label: 'Manager' },
  { href: '/admin', label: 'Admin' },
] as const;

export function SiteNav({ active }: { active?: string }) {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-30 h-14 px-sp4 flex items-center justify-between border-b border-border bg-navy-deep/95 backdrop-blur-md"
    >
      <Link href="/dashboard" className="flex items-center gap-sp2">
        <span className="font-display text-[22px] tracking-wide text-gold">REVYX</span>
        <span className="label-mono hidden md:inline">Real Estate Execution Intelligence</span>
      </Link>
      <ul className="hidden lg:flex items-center gap-sp1">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={cn(
                'inline-flex h-9 items-center px-sp3 rounded-md text-[13px] transition-colors duration-fast',
                active === l.href
                  ? 'bg-navy-hover text-text-h'
                  : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
              )}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-sp2">
        <span className="badge-mono text-text-muted hidden md:inline">demo · M0.S2</span>
        <Link
          href="/login"
          className="inline-flex h-9 items-center px-sp3 rounded-md border border-border-light text-[13px] text-text-h hover:bg-navy-hover transition-colors duration-fast"
        >
          Sign out
        </Link>
      </div>
    </nav>
  );
}

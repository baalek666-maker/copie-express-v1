// Empty states illustrés (SVG inline, zéro dépendance)

export function EmptyEvaluationsIllustration({ className = 'h-40 w-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="hsl(var(--muted))" />
      <rect x="55" y="60" width="90" height="110" rx="6" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" />
      <line x1="70" y1="85" x2="130" y2="85" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="70" y1="105" x2="120" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="70" y1="125" x2="125" y2="125" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="70" y1="145" x2="100" y2="145" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <circle cx="155" cy="55" r="20" fill="hsl(var(--primary))" />
      <path d="M150 55l4 4 8-8" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmptyCopiesIllustration({ className = 'h-40 w-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="hsl(var(--muted))" />
      <rect x="65" y="50" width="50" height="65" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" transform="rotate(-8 90 82)" />
      <rect x="80" y="55" width="50" height="65" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" transform="rotate(4 105 87)" />
      <rect x="70" y="70" width="50" height="65" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
      <line x1="82" y1="90" x2="108" y2="90" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="82" y1="105" x2="100" y2="105" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="82" y1="120" x2="105" y2="120" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function EmptySearchIllustration({ className = 'h-32 w-32' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="hsl(var(--muted))" />
      <circle cx="90" cy="90" r="30" stroke="hsl(var(--muted-foreground))" strokeWidth="3" />
      <line x1="113" y1="113" x2="135" y2="135" stroke="hsl(var(--muted-foreground))" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
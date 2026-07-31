import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Redeviens un prof.
          <br />
          <span className="text-primary italic font-serif">Pas une machine à cliquer.</span>
        </h1>

        <p className="text-xl text-muted-foreground">
          Brevet blanc, bac blanc, contrôles au fil de l&apos;année —
          <strong> 90 copies en 30 secondes.</strong> Tu valides, tu fermes l&apos;ordi.
          Tu retrouves ta famille, ton cœur de métier, ta vie.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
          >
            Commencer (10 copies gratuites) →
          </Link>
          <Link
            href="/pricing"
            className="px-6 py-3 border border-border rounded-md font-medium hover:bg-secondary"
          >
            Voir les tarifs
          </Link>
        </div>

        <div className="text-sm text-muted-foreground space-y-2 pt-8 border-t">
          <p>✓ 10 copies gratuites · ✓ Sans carte bancaire · ✓ RGPD + données en Europe</p>
          <p className="text-xs">Outil de saisie administrative · Non destiné aux épreuves officielles</p>
        </div>
      </div>
    </main>
  );
}
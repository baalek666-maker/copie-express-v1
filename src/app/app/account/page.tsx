import { createServerSupabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const subscriptionActive = userData?.subscription_status === 'active';

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Mon compte</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><span className="text-muted-foreground">Nom :</span> {userData?.full_name || '—'}</div>
          <div><span className="text-muted-foreground">Email :</span> {user.email}</div>
          <div><span className="text-muted-foreground">Académie :</span> {userData?.academy || '—'}</div>
          <div><span className="text-muted-foreground">Matière :</span> {userData?.subject?.join(', ') || '—'}</div>
          <div><span className="text-muted-foreground">Niveaux :</span> {userData?.school_level?.join(', ') || '—'}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>
            {subscriptionActive ? 'Tu profites de l\'accès illimité.' : 'Tu utilises le forfait Découverte.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {subscriptionActive ? (
            <>
              <Badge variant="success">✓ Abonnement actif</Badge>
              <p className="text-sm">
                Forfait : <strong>{userData?.subscription_plan}</strong> ·{' '}
                Renouvellement : {new Date(userData?.subscription_expires_at).toLocaleDateString('fr-FR')}
              </p>
              <Button variant="outline" asChild>
                <Link href="/app/billing">Gérer mon abonnement</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm">
                Copies utilisées : <strong>{userData?.trial_copies_count || 0} / 10</strong>
              </p>
              <Button asChild>
                <Link href="/pricing">Passer à un forfait</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Données personnelles (RGPD)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>Conformément au RGPD, tu peux à tout moment :</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Exporter toutes tes données</li>
            <li>Supprimer ton compte et toutes les données associées</li>
            <li>Demander la rectification de données inexactes</li>
          </ul>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm">Exporter mes données</Button>
            <Button variant="destructive" size="sm">Supprimer mon compte</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
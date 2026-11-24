import type { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = { title: 'Connexion', description: 'Connecte-toi à Copie Express ou crée ton compte : 5 copies offertes, sans carte bancaire.', alternates: { canonical: '/login' } };

// Force le rendu côté serveur pour éviter le pré-rendering statique
// (besoin des variables d'env Supabase côté client)
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return <LoginForm />;
}
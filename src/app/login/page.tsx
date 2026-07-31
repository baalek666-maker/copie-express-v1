import LoginForm from './login-form';

// Force le rendu côté serveur pour éviter le pré-rendering statique
// (besoin des variables d'env Supabase côté client)
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return <LoginForm />;
}
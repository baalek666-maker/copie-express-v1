import { redirect } from 'next/navigation';

// /signup → redirect vers /login
// L'auth Supabase magic link crée automatiquement un compte si l'email n'existe pas
// Pas besoin de page séparée
export default function SignupPage() {
  redirect('/login?new=1');
}

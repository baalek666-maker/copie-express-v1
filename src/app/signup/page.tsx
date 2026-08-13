import { redirect } from 'next/navigation';

// /signup → redirect vers /login
// Email/mdp classique : le signup se fait directement dans LoginForm
// /signup redirige vers /login?new=1 pour afficher le formulaire d'inscription
export default function SignupPage() {
  redirect('/login?new=1');
}

import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Recommander à un collègue' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

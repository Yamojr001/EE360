import { redirect } from 'next/navigation';

export default function Home() {
  // Server-side redirect - always go to /home
  redirect('/home');
}

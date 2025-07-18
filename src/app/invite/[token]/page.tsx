// app/invite/[token]/page.tsx
import { redirect } from 'next/navigation';
import { InvitePageClient } from './InvitePageClient';

interface InvitePageProps {
  params: { token: string };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/invite?token=${token}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        redirect('/invite/invalid');
      }
      if (response.status === 410) {
        redirect('/invite/expired');
      }
      redirect('/invite/error');
    }

    const inviteData = await response.json();
    return <InvitePageClient inviteData={inviteData} token={token} />;

  } catch (error) {
    console.error('Error fetching invite data:', error);
    redirect('/invite/error');
  }
}
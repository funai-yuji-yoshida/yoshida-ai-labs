import type { Metadata } from 'next';
import { AssessmentProvider } from '@/contexts/AssessmentContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI活用成熟度診断',
  description: '個人と組織のAI活用レベルを診断し、推奨アクションを提示します',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AssessmentProvider>{children}</AssessmentProvider>
      </body>
    </html>
  );
}

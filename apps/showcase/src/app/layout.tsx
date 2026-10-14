import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'ZENITH — Team No. 5 | mPOWER Placement Training Showcase',
  description:
    'Official Evaluator Showcase for Team No. 5 (ZENITH) in the mPOWER Placement Training Program. Verified curriculum delivery, live competition standings, and growth metrics.',
  keywords: ['ZENITH', 'Team 5', 'mPOWER', 'Placement Training', 'Scoreboard', 'Leaderboard'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

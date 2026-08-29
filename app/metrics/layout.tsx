import type { Metadata } from 'next';
import './metrics.css';

export const metadata: Metadata = {
  title: 'Metrics Dashboard | सनातन परिवार',
  robots: { index: false, follow: false, nocache: true },
};

export default function MetricsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

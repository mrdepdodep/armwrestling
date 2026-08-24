import Link from 'next/link';

export const metadata = { title: 'Сторінку не знайдено · Arm Helper' };

export default function NotFound() {
  return (
    <div className="page-header" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <h1 className="page-header-title">404</h1>
      <p className="page-header-desc">Такої сторінки не існує.</p>
      <p style={{ marginTop: '1rem' }}>
        <Link href="/">На головну</Link>
      </p>
    </div>
  );
}

'use client';

export default function Error({ reset }) {
  return (
    <div className="page-header" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <h1 className="page-header-title">Щось пішло не так</h1>
      <p className="page-header-desc">Спробуй перезавантажити сторінку.</p>
      <p style={{ marginTop: '1rem' }}>
        <button onClick={() => reset()}>Спробувати ще раз</button>
      </p>
    </div>
  );
}

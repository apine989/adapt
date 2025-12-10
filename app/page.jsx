export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#e5e7eb' }}>
      <div style={{ maxWidth: 640, width: '100%', padding: '2.5rem', background: '#020617', borderRadius: '1rem', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', border: '1px solid #1f2937' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>AdApt</h1>
        <p style={{ marginBottom: '1.5rem', color: '#cbd5f5' }}>
          AI ad campaign generator for small e-commerce brands. Log in, pick a product, and get a full campaign plan in minutes.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <a
            href="/signup"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 999,
              border: 'none',
              background: '#2563eb',
              color: '#f9fafb',
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center',
              minWidth: 140
            }}
          >
            Get Started
          </a>
          <a
            href="/login"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: 999,
              border: '1px solid #64748b',
              background: 'transparent',
              color: '#e2e8f0',
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center',
              minWidth: 140
            }}
          >
            Log In
          </a>
        </div>
      </div>
    </main>
  );
}

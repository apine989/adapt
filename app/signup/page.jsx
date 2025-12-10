'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/dashboard');
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#e5e7eb' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '2rem', background: '#020617', borderRadius: '1rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid #1f2937' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Create your AdApt account</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #475569', background: '#020617', color: '#e5e7eb' }}
          />
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #475569', background: '#020617', color: '#e5e7eb' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.75rem',
              padding: '0.6rem 1rem',
              borderRadius: 999,
              border: 'none',
              background: '#2563eb',
              color: '#f9fafb',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        {error && <p style={{ marginTop: '0.5rem', color: '#f97373' }}>{error}</p>}
        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#94a3b8' }}>
          Already have an account? <a href="/login" style={{ color: '#38bdf8' }}>Log in</a>
        </p>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [goal, setGoal] = useState('brand_awareness');
  const [budget, setBudget] = useState('low');
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [result, setResult] = useState(null);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (!data || !data.user) {
        router.push('/login');
      } else {
        setCheckingAuth(false);
      }
    }
    check();
  }, [router]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setProductsLoading(true);
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) {
          throw new Error();
        }
        const json = await res.json();
        setProducts(json);
        if (json.length > 0) {
          setSelectedProductId(String(json[0].id));
        }
      } catch (e) {
        setProductsError('Could not load products.');
      } finally {
        setProductsLoading(false);
      }
    }
    loadProducts();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setGenerateError('');
    if (!selectedProductId) {
      setGenerateError('Please select a product.');
      return;
    }
    const product = products.find(p => String(p.id) === String(selectedProductId));
    if (!product) {
      setGenerateError('Selected product not found.');
      return;
    }
    setLoadingGenerate(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product,
          goal,
          budget
        })
      });
      if (!res.ok) {
        throw new Error();
      }
      const json = await res.json();
      setResult(json);
    } catch (e) {
      setGenerateError('There was a problem generating the campaign.');
    } finally {
      setLoadingGenerate(false);
    }
  }

  if (checkingAuth) {
    return (
      <main style={{ minHeight: '100vh', padding: '2rem', background: '#020617', color: '#e5e7eb' }}>
        <p>Checking session...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', background: '#020617', color: '#e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 960, margin: '0 auto 1rem' }}>
        <h1>AdApt Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 999,
            border: '1px solid #64748b',
            background: 'transparent',
            color: '#e2e8f0',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Log out
        </button>
      </div>
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          gap: '1.5rem'
        }}
      >
        <div style={{ padding: '1.5rem', background: '#020617', borderRadius: '1rem', border: '1px solid #1f2937', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Campaign Setup</h2>
          {productsLoading ? (
            <p>Loading products...</p>
          ) : productsError ? (
            <p>{productsError}</p>
          ) : (
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label>Product</label>
              <select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #475569', background: '#020617', color: '#e5e7eb' }}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} (${p.price})
                  </option>
                ))}
              </select>

              <label>Marketing goal</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: 999, border: '1px solid #475569', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="goal" value="brand_awareness" checked={goal === 'brand_awareness'} onChange={e => setGoal(e.target.value)} />
                  Brand awareness
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: 999, border: '1px solid #475569', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="goal" value="conversions" checked={goal === 'conversions'} onChange={e => setGoal(e.target.value)} />
                  Conversions
                </label>
              </div>

              <label>Budget level</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: 999, border: '1px solid #475569', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="budget" value="low" checked={budget === 'low'} onChange={e => setBudget(e.target.value)} />
                  Low
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: 999, border: '1px solid #475569', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="budget" value="medium" checked={budget === 'medium'} onChange={e => setBudget(e.target.value)} />
                  Medium
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: 999, border: '1px solid #475569', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="budget" value="high" checked={budget === 'high'} onChange={e => setBudget(e.target.value)} />
                  High
                </label>
              </div>

              <button
                type="submit"
                disabled={loadingGenerate}
                style={{
                  marginTop: '1rem',
                  padding: '0.7rem 1rem',
                  borderRadius: 999,
                  border: 'none',
                  background: '#22c55e',
                  color: '#022c22',
                  fontWeight: 600,
                  cursor: loadingGenerate ? 'default' : 'pointer',
                  opacity: loadingGenerate ? 0.7 : 1
                }}
              >
                {loadingGenerate ? 'Generating...' : 'Generate campaign'}
              </button>
              {generateError && <p style={{ marginTop: '0.5rem', color: '#f97373' }}>{generateError}</p>}
            </form>
          )}
        </div>

        <div style={{ padding: '1.5rem', background: '#020617', borderRadius: '1rem', border: '1px solid #1f2937', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Campaign Results</h2>
          {!result && <p>Fill in the form and generate a campaign to see results here.</p>}
          {result && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Product and audience analysis</h3>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', background: '#020617', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #1f2937', fontSize: '0.9rem' }}>
                  {result.productAnalysis}
                </pre>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Strategy</h3>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', background: '#020617', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #1f2937', fontSize: '0.9rem' }}>
                  {result.strategy}
                </pre>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Ad creatives</h3>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', background: '#020617', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #1f2937', fontSize: '0.9rem' }}>
                  {result.creatives}
                </pre>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Schedule and KPIs</h3>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', background: '#020617', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #1f2937', fontSize: '0.9rem' }}>
                  {result.schedule}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

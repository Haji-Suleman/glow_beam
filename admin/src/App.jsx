import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { PRODUCTS, formatPrice } from '../../Store/Products/Products';
import { ADDONS } from '../../Store/cartConfig';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const KEY_NAME = 'admin_key';

export default function AdminProducts() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_NAME) || '');
  const [input, setInput] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const headers = { 'X-Admin-Key': key };

  const load = useCallback(async () => {
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/admin/products`, { headers: { 'X-Admin-Key': key } });
      if (res.status === 401) {
        sessionStorage.removeItem(KEY_NAME);
        setKey('');
        throw new Error('Wrong admin key');
      }
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setProducts(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { load(); }, [load]);

  const login = (e) => {
    e.preventDefault();
    sessionStorage.setItem(KEY_NAME, input.trim());
    setKey(input.trim());
    setInput('');
  };

  const importFromCode = async () => {
    const items = [
      ...PRODUCTS.map((p) => ({
        slug: p.slug, kind: 'product', name: p.name, price: p.price || 0,
        image: typeof p.image === 'string' ? p.image : '',
        colors: p.colors || [], sizes: p.sizes || [],
        gallery: (p.gallery || []).filter((g) => typeof g === 'string'),
      })),
      ...Object.values(ADDONS).map((a) => ({
        slug: a.slug || a.id, kind: 'addon', name: a.name.split(' — ')[0],
        price: a.price, compare_price: a.compare, image: a.image,
      })),
    ];
    try {
      const res = await fetch(`${API}/api/admin/products/import`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error(`Import failed (${res.status})`);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!key) {
    return (
      <form className="adm-login" onSubmit={login}>
        <h1>Admin</h1>
        <input type="password" placeholder="Admin key" value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
        <button type="submit">Sign in</button>
        {error && <p className="adm-err">{error}</p>}
      </form>
    );
  }

  const shown = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="adm">
      <header className="adm-head">
        <h1>Products <span>{products.length}</span></h1>
        <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="button" onClick={load}>Refresh</button>
        <button type="button" onClick={importFromCode}>Import from code</button>
        <button type="button" onClick={() => { sessionStorage.removeItem(KEY_NAME); setKey(''); }}>Sign out</button>
      </header>

      {error && <p className="adm-err">{error}</p>}
      {loading && <p>Loading…</p>}
      {!loading && products.length === 0 && !error && (
        <p>No products yet. Click “Import from code” once.</p>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Type</th><th>Slug</th><th>Price</th><th>Colors</th><th>Sizes</th></tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td><img src={p.image} alt="" /></td>
                <td>{p.name}</td>
                <td>{p.kind}</td>
                <td><code>{p.slug}</code></td>
                <td>
                  {formatPrice(p.price)}
                  {p.compare_price > p.price && <s>{formatPrice(p.compare_price)}</s>}
                </td>
                <td>{(p.colors || []).join(', ')}</td>
                <td>{(p.sizes || []).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
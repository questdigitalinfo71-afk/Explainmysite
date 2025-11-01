
import React, { useState } from 'react';

export default function Home(){
  const [url, setUrl] = useState('');
  const [extra, setExtra] = useState('');
  const [out, setOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string>('');

  React.useEffect(()=>{
    const saved = typeof window!=='undefined' ? localStorage.getItem('llmProvider') : '';
    if(saved) setProvider(saved);
  },[]);

  const submit = async (e: React.FormEvent)=>{
    e.preventDefault();
    setLoading(true); setOut('');
    const res = await fetch('/api/generate-script', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ url, extraPrompt: extra, providerPref: provider || undefined })
    });
    const data = await res.json();
    setLoading(false);
    setOut(data?.content || data?.error || 'No content');
  };

  const link = { marginLeft: 8 };

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>ExplainMySite</h1>
      <p style={{ color: '#555' }}>Paste a website URL and generate an explanatory video script. Supports OpenAI & Gemini.</p>
      <form onSubmit={submit} style={{ display:'grid', gap: 12, marginTop: 16 }}>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" required
          style={{ padding: 12, borderRadius: 12, border:'1px solid #ddd' }} />
        <textarea value={extra} onChange={e=>setExtra(e.target.value)} placeholder="Extra prompt (pricing, FAQ, comparisons)…"
          style={{ padding: 12, borderRadius: 12, border:'1px solid #ddd', minHeight: 120 }} />
        <button disabled={loading} style={{ padding: '12px 16px', borderRadius: 12, border:'0', background:'#111', color:'#fff', fontWeight:600 }}>
          {loading ? 'Generating…' : 'Generate Script'}
        </button>
      </form>
      {out && <section style={{ whiteSpace:'pre-wrap', background:'#f8f8f8', marginTop:16, padding:16, borderRadius:12, border:'1px solid #eee' }}>{out}</section>}
      <div style={{marginTop:24}}>
        <a href='/admin'>Admin</a>
        <a href='/about' style={link}>About</a>
        <a href='/contact' style={link}>Contact</a>
        <a href='/terms' style={link}>Terms</a>
        <a href='/privacy' style={link}>Privacy</a>
      </div>
    </main>
  );
}

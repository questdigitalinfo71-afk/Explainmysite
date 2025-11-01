
import React from 'react';

export default function Admin(){
  const [provider, setProvider] = React.useState<string>('');

  React.useEffect(()=>{
    const saved = typeof window!=='undefined' ? localStorage.getItem('llmProvider') : '';
    if(saved) setProvider(saved);
  },[]);

  const save = ()=>{
    if(typeof window!=='undefined') localStorage.setItem('llmProvider', provider);
    alert('Saved! Provider preference stored in your browser.');
  };

  return (
    <main style={{ maxWidth: 700, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Admin (Provider Preference)</h1>
      <p style={{ color:'#555' }}>Pick the provider. Keys must be set in Vercel env variables.</p>
      <div style={{ display:'grid', gap: 8, marginTop: 16 }}>
        <label><input type='radio' name='p' checked={provider==='openai'} onChange={()=>setProvider('openai')} /> Use OpenAI</label>
        <label><input type='radio' name='p' checked={provider==='gemini'} onChange={()=>setProvider('gemini')} /> Use Gemini</label>
        <label><input type='radio' name='p' checked={provider===''} onChange={()=>setProvider('')} /> Auto (first available)</label>
        <button onClick={save} style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, border: 0, background:'#111', color:'#fff', fontWeight:600 }}>Save</button>
      </div>
    </main>
  );
}


export type Provider = 'openai' | 'gemini' | 'demo';
export function pickProvider(pref?: Provider): Provider {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  if (pref && ((pref === 'openai' && hasOpenAI) || (pref === 'gemini' && hasGemini))) return pref;
  if (hasOpenAI) return 'openai';
  if (hasGemini) return 'gemini';
  return 'demo';
}
export async function generateScript({ url, extraPrompt, provider }:{ url:string; extraPrompt?:string; provider:Provider }){
  const prompt = [
    `Analyze this site: ${url}.`,
    `Extract title, meta, headings, features, pricing, audience.`,
    `Write a friendly 60–180s video script (Intro, Features, Pricing/Value, CTA).`,
    `Keep it strictly about the site.`,
    extraPrompt ? `Extension: ${extraPrompt}` : ``
  ].join('\n');
  if (provider==='openai'){
    const apiKey = process.env.OPENAI_API_KEY!;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
      body: JSON.stringify({ model:'gpt-4o-mini', messages:[{role:'user', content: prompt}], temperature:0.7 })
    });
    if(!res.ok) throw new Error(`OpenAI error ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No content returned.';
  }
  if (provider==='gemini'){
    const apiKey = process.env.GEMINI_API_KEY!;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{role:'user', parts:[{text: prompt}]}] })
    });
    if(!res.ok) throw new Error(`Gemini error ${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p)=>p.text).join('\n');
    return text || 'No content returned.';
  }
  return 'DEMO SCRIPT\nNo API keys found. Add OPENAI_API_KEY or GEMINI_API_KEY in Vercel.';
}

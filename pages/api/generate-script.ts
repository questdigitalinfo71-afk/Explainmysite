
import type { NextApiRequest, NextApiResponse } from 'next';
import { pickProvider, generateScript } from '../../../lib/llm';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
    const { url, extraPrompt, providerPref } = req.body || {};
    if(!url) return res.status(400).json({error:'URL is required'});
    const provider = pickProvider(providerPref);
    const content = await generateScript({ url, extraPrompt, provider });
    return res.status(200).json({ provider, content });
  }catch(e:any){
    return res.status(500).json({ error: e.message || 'Server error'});
  }
}

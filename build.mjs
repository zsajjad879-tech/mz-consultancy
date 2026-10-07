import fs from 'node:fs';
import crypto from 'node:crypto';
const raw=process.env.RENDER_EXTERNAL_URL||process.env.SITE_URL;
if(!raw)throw Error('Set SITE_URL to the verified Render service URL before building.');
const origin=new URL(raw).origin;if(!origin.startsWith('https://'))throw Error('HTTPS origin required.');
fs.mkdirSync('public',{recursive:true});
for(const name of ['index.html','style.css','privacy.html','terms.html','invoice-follow-up-guide.html','workspace-status.html','404.html','robots.txt','sitemap.xml','pilot-brief.txt']){
 let s=fs.readFileSync(name,'utf8').replaceAll('__SITE_ORIGIN__',origin);
 if(name.endsWith('.html')){
  const schema=s.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const hash=schema?" 'sha256-"+crypto.createHash('sha256').update(schema).digest('base64')+"'":'';
  const policy="default-src 'none'; script-src 'self'"+hash+"; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests";
  s=s.replace('<meta name="viewport"',`<meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="referrer" content="no-referrer"><meta name="viewport"`);
 }
 fs.writeFileSync('public/'+name,s);
}
console.log('Public site built for '+origin+'. Customer accounts are not yet available.');

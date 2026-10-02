import fs from 'node:fs';
import {parseEnv} from 'node:util';
import postgres from 'postgres';
import {verifyPassword} from 'better-auth/crypto';
const env=parseEnv(fs.readFileSync('.env','utf8'));
const baseline=JSON.parse(fs.readFileSync('final-check-before-uiux/manifest.json','utf8'));
const result={checkedAt:new Date().toISOString(),operation:'Read-only credential equality and local sign-in diagnosis; no values or hashes recorded',accounts:[]};
let client;
try {
 client=postgres(env.DATABASE_URL,{max:1,onnotice:()=>undefined});
 const rows=await client`SELECT u.email, a.password, app.status FROM auth_users u JOIN auth_accounts a ON a.user_id=u.id AND a.provider_id='credential' JOIN application_accounts app ON app.auth_user_id=u.id WHERE u.email IN ${client(baseline.accounts.map(a=>a.email))}`;
 for(const row of rows)result.accounts.push({email:row.email,status:row.status,currentConfiguredPasswordMatches:await verifyPassword({hash:row.password,password:env.AUTH_SEED_PASSWORD})});
 result.demoRows=rows.length;
 result.otherCredentialRows=Number((await client`SELECT COUNT(*) AS count FROM auth_users u JOIN auth_accounts a ON a.user_id=u.id AND a.provider_id='credential' WHERE u.email NOT IN ${client(baseline.accounts.map(a=>a.email))}`)[0].count);
 const r=await fetch('http://localhost:3000/api/auth/sign-in/email',{method:'POST',headers:{origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({email:baseline.accounts[0].email,password:env.AUTH_SEED_PASSWORD})});
 const b=await r.json();result.directAuth={status:r.status,message:b.message||b.error||null,setsCookie:!!r.headers.get('set-cookie')};
} catch {result.error='Read-only diagnosis could not complete; secret-bearing database/library details suppressed.';} finally {if(client)await client.end();}
fs.writeFileSync(new URL('./login-diagnosis.json',import.meta.url),JSON.stringify(result,null,2));console.log(JSON.stringify(result));

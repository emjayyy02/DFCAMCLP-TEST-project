/* Isolated network failure QA; no account, credential or membership changes. */
const fs=require('node:fs'),path=require('node:path');
const {parseEnv}=require('node:util');
const {chromium}=require('C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const env=parseEnv(fs.readFileSync('.env','utf8')),base='http://localhost:3000';
const result={startedAt:new Date().toISOString(),cases:[]};
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try {for(const failure of ['network-abort','http-503']){
  const c=await b.newContext({viewport:{width:375,height:812}});await c.addInitScript(()=>localStorage.setItem('dfcamclp.demoDisclosure.ackVersion','fd7-v1'));
  const login=await c.request.post(base+'/api/portal-login',{headers:{origin:base},data:{email:'student.test@example.invalid',password:env.AUTH_SEED_PASSWORD,portal:'STUDENT'}});if(!login.ok())throw new Error('Login HTTP '+login.status());
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/account',{waitUntil:'networkidle'});
  await p.route('**/api/auth/sign-out',r=>failure==='network-abort'?r.abort('failed'):r.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'Temporary audit-injected service failure',code:'SERVICE_UNAVAILABLE'})}));
  await p.getByRole('button',{name:'Sign out',exact:true}).click();await p.waitForTimeout(1200);
  const location=new URL(p.url()).pathname,state=await p.evaluate(()=>({buttons:[...document.querySelectorAll('button')].filter(e=>/Signing out|Sign out/.test(e.textContent)).map(e=>({text:e.textContent,disabled:e.disabled})),alerts:[...document.querySelectorAll('[role="alert"]')].map(e=>e.textContent.trim()).filter(Boolean)}));
  const file='signout-'+failure+'-result-375.png';await p.screenshot({path:path.join(__dirname,file),fullPage:true,animations:'disabled'});
  await p.unroute('**/api/auth/sign-out');await p.goto(base+'/student',{waitUntil:'networkidle'});const protectedAfter=new URL(p.url()).pathname,stillAuthenticated=await p.locator('summary.account-trigger').count()===1;
  const item={failure,location,state,protectedAfter,stillAuthenticated,pageErrors:errors,capture:file,pass:state.alerts.length>0&&state.buttons.some(e=>!e.disabled)&&location!=='/login'};result.cases.push(item);
  await p.goto(base+'/account',{waitUntil:'networkidle'});await p.getByRole('button',{name:'Sign out',exact:true}).click();await p.waitForURL(/\/login/);await p.goto(base+'/student',{waitUntil:'networkidle'});item.normalCleanupRevokedSession=new URL(p.url()).pathname==='/login';await c.close();
  fs.writeFileSync(path.join(__dirname,'signout-failure.json'),JSON.stringify(result,null,2));
 }} finally {await b.close();}
 console.log(JSON.stringify(result));
})().catch(e=>{console.error(e.message);process.exitCode=1;});

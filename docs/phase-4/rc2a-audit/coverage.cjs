/* Read-only product coverage. Changes below are isolated browser demo state. */
const fs = require('node:fs');
const path = require('node:path');
const {parseEnv} = require('node:util');
const {chromium} = require('C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'http://localhost:3000';
const env = parseEnv(fs.readFileSync('.env', 'utf8'));
const accounts = JSON.parse(fs.readFileSync('final-check-before-uiux/manifest.json', 'utf8')).accounts;
const result = {startedAt:new Date().toISOString(), preview:'Existing compiled production preview; Next start on port 3000', checks:[], errors:[], captures:[]};
const save = () => fs.writeFileSync(path.join(__dirname,'coverage.json'),JSON.stringify(result,null,2));
function check(name, pass, detail) { result.checks.push({name,pass,detail}); save(); }
async function go(p, route) { const r=await p.goto(base+route,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); return r; }
async function inspect(p) { return p.evaluate(()=>({heading:document.querySelector('h1')?.textContent.trim(), width:innerWidth, documentWidth:document.documentElement.scrollWidth, bodyWidth:document.body.scrollWidth, brokenImages:[...document.images].filter(i=>!i.naturalWidth).length})); }
async function cap(p, name) { const file=name+'-'+p.viewportSize().width+'.png'; await p.screenshot({path:path.join(__dirname,file),fullPage:true,animations:'disabled'}); result.captures.push({file,route:new URL(p.url()).pathname+new URL(p.url()).search,viewport:p.viewportSize()}); save(); }
async function tabs(p, name) { const list=p.getByRole('tab').filter({visible:true}); const names=await list.allTextContents(); for (let i=0;i<names.length;i++) { const tab=p.getByRole('tab',{name:names[i],exact:true}).filter({visible:true}); await tab.click(); await p.waitForTimeout(40); check(name+' tab '+names[i],await tab.getAttribute('aria-selected')==='true' && await p.getByRole('tabpanel').filter({visible:true}).count()===1); } }
let browser;
async function run() {
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const pages=new Map();
 for (const a of accounts) {
  const c=await browser.newContext({viewport:{width:1440,height:900},timezoneId:'Asia/Manila'});
  await c.addInitScript(()=>localStorage.setItem('dfcamclp.demoDisclosure.ackVersion','fd7-v1'));
  const login=await c.request.post(base+'/api/portal-login',{headers:{origin:base},data:{email:a.email,password:env.AUTH_SEED_PASSWORD,portal:a.memberships[0].portal}});
  check(a.group+' login',login.ok(),login.status());
  const p=await c.newPage(); p.setDefaultTimeout(10000); p.on('pageerror',e=>{result.errors.push({group:a.group,message:e.message});save();}); pages.set(a.group,p);
  for(const route of a.allowedRoutes) { const response=await go(p,route); const info=await inspect(p); check(a.group+' allowed '+route,response.status()===200 && !!info.heading && info.documentWidth<=info.width && info.brokenImages===0,{status:response.status(),...info}); }
 }
 console.log('All nine role-specific route sets inspected.');
 const applicant=pages.get('applicant');
 for(const route of accounts.find(a=>a.group==='applicant').allowedRoutes.filter(r=>r.startsWith('/applicant'))) {
  await go(applicant,route);
  for(const scenario of ['draft','submitted','documents','eligible','scheduled','awaiting','notQualified','passed','coe','cor']) {
   await applicant.getByRole('combobox',{name:'Demo scenario'}).filter({visible:true}).selectOption(scenario); await applicant.waitForTimeout(40);
   const info=await inspect(applicant); check('Applicant '+scenario+' '+route,!!info.heading && info.documentWidth<=info.width && info.brokenImages===0,info);
   if(['/applicant/application','/applicant/dcat','/applicant/enrollment'].includes(route)) await tabs(applicant,scenario+' '+route);
  }
 }
 console.log('All ten Applicant scenarios and their route tabs inspected.');
 const student=pages.get('student'); await go(student,'/student/academics'); await tabs(student,'Student academics');
 await student.getByRole('tab',{name:'Schedule',exact:true}).click(); const schedule=await student.locator('main').innerText();
 await student.getByRole('button',{name:'Next week',exact:true}).click(); check('Student schedule next week',(await student.locator('main').innerText())!==schedule);
 await student.getByRole('button',{name:'Previous week',exact:true}).click(); check('Student schedule previous week',(await student.locator('main').innerText())===schedule);
 await go(student,'/student/calendar'); const calendar=await student.locator('.student-calendar-toolbar h2').innerText(); await student.getByRole('button',{name:'Next month',exact:true}).click(); check('Student next month',(await student.locator('.student-calendar-toolbar h2').innerText())!==calendar); await student.getByRole('button',{name:'Previous month',exact:true}).click(); check('Student previous month',(await student.locator('.student-calendar-toolbar h2').innerText())===calendar); await student.setViewportSize({width:375,height:812}); await cap(student,'student-calendar');
 await go(student,'/student/enrollment'); const previews=student.getByRole('button',{name:/View sample/}).filter({visible:true}); const previewNames=await previews.allTextContents(); check('Student sample document controls exist',previewNames.length>0);
 for(const name of previewNames) { await student.getByRole('button',{name:name.trim(),exact:true}).filter({visible:true}).click(); check('Student '+name.trim()+' document preview',await student.locator('dialog[open]').count()===1); await student.keyboard.press('Escape'); check('Student '+name.trim()+' document Escape',await student.locator('dialog[open]').count()===0); }
 const records=pages.get('records'); await go(records,'/records/applicants?record=DEMO-APP-002'); await tabs(records,'Records applicant detail'); await records.setViewportSize({width:375,height:812}); await cap(records,'records-applicant-detail');
 for(const route of ['/records/applicants?record=not-a-record','/records/students?record=not-a-record']) {await go(records,route);check('Invalid entity '+route,/not found/i.test(await records.locator('main').innerText()));}
 const ops=pages.get('school-admin'); await go(ops,'/operations/facilities?ticket=FAC-26037'); const status=ops.locator('#ticket-status'); const originalStatus=await status.inputValue(); await status.selectOption('Resolved'); await ops.getByLabel('Completion note',{exact:true}).fill('Fictional QA completion note.'); let writeRequests=[]; ops.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writeRequests.push({method:r.method(),path:new URL(r.url()).pathname});}); await ops.getByRole('button',{name:'Save demo status',exact:true}).click(); check('Facilities local status save',(await status.inputValue())==='Resolved' && await ops.getByRole('button',{name:'Save demo status',exact:true}).isDisabled()); check('Facilities has no persistence request',writeRequests.length===0,writeRequests); await ops.reload({waitUntil:'networkidle'}); check('Facilities local status resets on reload',(await status.inputValue())===originalStatus);
 await ops.setViewportSize({width:375,height:812}); await cap(ops,'operations-ticket-detail');
 for(const route of ['/operations/student-services?request=SS-26041','/operations/employees?employee=EMP-DEMO-014']) {await go(ops,route);const info=await inspect(ops);check('Operations entity '+route,!!info.heading && info.documentWidth<=info.width,info);await cap(ops,route.includes('student-services')?'operations-service-detail':'operations-employee-detail');}
 result.finishedAt=new Date().toISOString(); result.summary={checks:result.checks.length,failed:result.checks.filter(c=>!c.pass).length,pageErrors:result.errors.length,captures:result.captures.length};save();console.log(JSON.stringify(result.summary));await browser.close();
}
run().catch(async e=>{result.errors.push({fatal:e.message});save();console.error(e.message);if(browser)await browser.close();process.exitCode=1;});

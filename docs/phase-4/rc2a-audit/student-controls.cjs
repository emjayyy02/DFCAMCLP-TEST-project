/* Focused semantic verification after a whole-main-text calendar assertion proved too broad. */
const fs=require('node:fs'),path=require('node:path'),{parseEnv}=require('node:util');
const {chromium}=require('C:/Users/silve/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='http://localhost:3000',env=parseEnv(fs.readFileSync('.env','utf8'));
const result={startedAt:new Date().toISOString(),checks:[],errors:[],captures:[]};
const save=()=>fs.writeFileSync(path.join(__dirname,'student-controls.json'),JSON.stringify(result,null,2));
function check(name,pass,detail){result.checks.push({name,pass,detail});save();}
let browser;
async function run(){
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const c=await browser.newContext({viewport:{width:375,height:812},timezoneId:'Asia/Manila'});await c.addInitScript(()=>localStorage.setItem('dfcamclp.demoDisclosure.ackVersion','fd7-v1'));
 const login=await c.request.post(base+'/api/portal-login',{headers:{origin:base},data:{email:'student.test@example.invalid',password:env.AUTH_SEED_PASSWORD,portal:'STUDENT'}});check('Student login',login.ok());const p=await c.newPage();p.on('pageerror',e=>{result.errors.push(e.message);save();});
 await p.goto(base+'/student/calendar',{waitUntil:'networkidle'});const month=p.locator('.student-calendar-toolbar h2'),initial=await month.innerText();await p.getByRole('button',{name:'Next month',exact:true}).click();check('Next month changes displayed month',(await month.innerText())!==initial);await p.getByRole('button',{name:'Previous month',exact:true}).click();check('Previous month restores displayed month',(await month.innerText())===initial,{initial,returned:await month.innerText()});
 const selected=await p.locator('.student-calendar-day[aria-pressed="true"]').getAttribute('aria-label');check('Month navigation selects first day per existing behavior',/\b1\b/.test(selected),selected);
 await p.goto(base+'/student/enrollment',{waitUntil:'networkidle'});const names=await p.getByRole('button',{name:/View sample/}).filter({visible:true}).allTextContents();check('Both sample document actions present',names.length===2,names);
 for(const name of names){const b=p.getByRole('button',{name:name.trim(),exact:true}).filter({visible:true});await b.click();check(name.trim()+' opens',await p.locator('dialog[open]').count()===1);check(name.trim()+' sample disclosure',/sample|no official/i.test(await p.locator('dialog[open]').innerText()));const file=name.includes('COR')?'student-cor-preview-375.png':'student-coe-preview-375.png';await p.screenshot({path:path.join(__dirname,file),fullPage:true,animations:'disabled'});result.captures.push(file);save();await p.keyboard.press('Escape');check(name.trim()+' closes',await p.locator('dialog[open]').count()===0);check(name.trim()+' returns focus',await b.evaluate(e=>e===document.activeElement));}
 result.finishedAt=new Date().toISOString();result.summary={checks:result.checks.length,failed:result.checks.filter(c=>!c.pass).length,pageErrors:result.errors.length};save();console.log(JSON.stringify(result.summary));await browser.close();
}
run().catch(async e=>{result.errors.push({fatal:e.message});save();if(browser)await browser.close();console.error(e.message);process.exitCode=1;});

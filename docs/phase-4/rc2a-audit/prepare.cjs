/* Audit evidence only. Derives fresh runners without changing the historical originals. */
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const out = __dirname;
if(process.argv.includes('--disclosure')) {
 const target=path.join(out,'disclosure');fs.mkdirSync(target,{recursive:true});
 let s=fs.readFileSync('docs/phase-4/fd8-after/verify.cjs','utf8');
 s=s.replace('http://localhost:3108','http://localhost:3000').replace('docs/phase-4/fd8-after','docs/phase-4/rc2a-audit/disclosure').replace('Microsoft Edge Chromium, isolated production preview on port 3108','Installed Microsoft Edge Chromium, preserved current preview on port 3000');
 fs.writeFileSync(path.join(target,'verify.cjs'),s);
 console.log('Prepared fresh disclosure/legal regression evidence.');process.exit(0);
}
function hashSource() {
 const files=[];
 for(const d of ['src','scripts','public','drizzle']) if(fs.existsSync(d)) {
  function walk(p){for(const i of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,i.name);if(i.isDirectory())walk(f);else files.push(f);}}walk(d);
 }
 for(const f of ['package.json','pnpm-lock.yaml','next.config.ts','tsconfig.json','next-env.d.ts','AGENTS.md','DFCAMCLP.md','compose.yaml'])if(fs.existsSync(f))files.push(f);
 return Object.fromEntries(files.sort().map(f=>[f.replaceAll('\\','/'),crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
}
if(process.argv.includes('--after')) {
 const before=JSON.parse(fs.readFileSync(path.join(out,'source-integrity-before.json'),'utf8')), after=hashSource();
 const changed=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(f=>before[f]!==after[f]);
 fs.writeFileSync(path.join(out,'source-integrity-after.json'),JSON.stringify({files:Object.keys(after).length,changed,hashes:after},null,2));console.log(JSON.stringify({files:Object.keys(after).length,changed}));process.exit(changed.length?1:0);
}
if(!fs.existsSync(path.join(out,'source-integrity-before.json')))fs.writeFileSync(path.join(out,'source-integrity-before.json'),JSON.stringify(hashSource(),null,2));
fs.writeFileSync(path.join(out,'provenance.json'),JSON.stringify({startedAt:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),dirtyStatus:execFileSync('git',['status','--short'],{encoding:'utf8'}),preview:'Preexisting http://localhost:3000; preserved',browser:'Installed Microsoft Edge Chromium / installed Playwright',note:'Derived FD6/M7 runners execute fresh current behavior; original evidence is preserved. Known acknowledgement is set only in these isolated compatibility contexts; separate supplement uses fresh origins.'},null,2));
for(const name of ['run-qa.cjs','interactions.cjs','extra-checks.cjs']) {
 let source=fs.readFileSync('docs/phase-4/fd6-after/'+name,'utf8');
 if(name==='run-qa.cjs') {
  source=source.replace('docs/phase-4/fd6-after','docs/phase-4/rc2a-audit');
  const launchEnd='  const pages = new Map(),';
  source=source.replace(launchEnd,`  const originalContext = browser.newContext.bind(browser);
  browser.newContext = async (...args) => {const c=await originalContext(...args);await c.addInitScript(()=>{localStorage.setItem('dfcamclp.demoDisclosure.ackVersion','fd7-v1');});return c;};
${launchEnd}`);
  // Relative before links are retained in a separate explicit provenance map.
 }
 fs.writeFileSync(path.join(out,name),source);
}
let m7=fs.readFileSync('docs/phase-4/m7-final-rc/run-qa.cjs','utf8').replace('docs/phase-4/m7-final-rc/runtime-checks.json','docs/phase-4/rc2a-audit/route-checks.json');
m7=m7.replace('  const contexts = new Map();',`  const originalContext = browser.newContext.bind(browser);
  browser.newContext = async (...args) => {const c=await originalContext(...args);await c.addInitScript(()=>{localStorage.setItem('dfcamclp.demoDisclosure.ackVersion','fd7-v1');});return c;};
  const contexts = new Map();`);
fs.writeFileSync(path.join(out,'route-checks.cjs'),m7);
console.log('Prepared isolated current-source QA; source hashes captured.');

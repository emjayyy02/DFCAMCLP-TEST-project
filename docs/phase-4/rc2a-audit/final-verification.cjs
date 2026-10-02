/* Documentation/evidence checks only. Never print configured secret values. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{parseEnv}=require('node:util');
const documents=['docs/phase-4/P4-RC2A-FINAL-DEMO-QA-AUDIT.md','docs/phase-4/P4-RC2B-DEFECT-FIX-PLAN.md','docs/phase-4/P4-ROADMAP.md','docs/phase-4/rc2a-audit/README.md'];
const brokenLinks=[];
for(const file of documents){const source=fs.readFileSync(file,'utf8');for(const match of source.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)){const target=match[1];if(!/^(?:https?:|codex:|\/)/.test(target)&&!fs.existsSync(path.resolve(path.dirname(file),target)))brokenLinks.push({file,target});}}
const files=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const name=path.join(dir,entry.name);if(entry.isDirectory())walk(name);else files.push(name);}}walk(__dirname);
const env=parseEnv(fs.readFileSync('.env','utf8'));const protectedValues=Object.entries(env).filter(([key,value])=>/(?:PASSWORD|AUTH_SECRET|DATABASE_URL)/.test(key)&&value.length>5).map(([,value])=>value);
const secretHits=[];for(const file of new Set([...documents,...files.filter(f=>/\.(?:json|md|cjs|mjs)$/.test(f))])){const source=fs.readFileSync(file,'utf8');if(protectedValues.some(value=>source.includes(value)))secretHits.push(path.relative(process.cwd(),file));}
const integrity=JSON.parse(fs.readFileSync(path.join(__dirname,'source-integrity-after.json'),'utf8'));
const result={checkedAt:new Date().toISOString(),documents:documents.map(file=>({file,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')})),brokenLinks,configuredSecretLiteralHits:secretHits,sourceFiles:integrity.files,sourceChanges:integrity.changed,images:files.filter(f=>f.endsWith('.png')).length,pass:brokenLinks.length===0&&secretHits.length===0&&integrity.changed.length===0};
fs.writeFileSync(path.join(__dirname,'final-verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({pass:result.pass,brokenLinks,configuredSecretLiteralHits:secretHits,sourceFiles:result.sourceFiles,sourceChanges:result.sourceChanges,images:result.images}));if(!result.pass)process.exitCode=1;

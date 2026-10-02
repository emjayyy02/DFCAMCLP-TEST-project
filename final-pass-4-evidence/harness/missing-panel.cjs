/* eslint-disable @typescript-eslint/no-require-imports -- Reuse the established capture helpers for one omitted historical state. */
const fs = require("node:fs");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "capture.cjs"), "utf8");
const prefix = source.slice(0, source.lastIndexOf("\n(async () => {"));
const task = `
(async () => {
 browser = await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const context = await browser.newContext({viewport:manifest.desktop});
 const page = setupPage(await context.newPage());
 await page.goto(base+'/login');
 await page.getByRole('button',{name:'View demo accounts',exact:true}).click();
 await shot(page,'public','Sign in - Approved demo accounts',{state:'demo-accounts-dialog'});
 manifest.completedAt=new Date().toISOString();
 manifest.totalViews=manifest.captures.length;
 manifest.totalPNGs=manifest.captures.reduce((n,c)=>n+c.files.length,0);
 manifest.postCaptureIntegrity={checkedFiles:baselineFiles.length,changed:baselineFiles.filter(f=>hash(f)!==baseline[f])};
 save();makeIndex();await browser.close();
})().catch(e=>{console.error(safeError(e));process.exit(1);});
`;
new Function("require", prefix + task)(require);

from pathlib import Path

destination = Path('final-pass-4-evidence/harness')
destination.mkdir(parents=True, exist_ok=True)
helpers = r'''
function setupPage(page) {
 const original = page.goto.bind(page); let visits=0;
 page.goto=async(...args)=>{
  const response=await original(...args); visits++;
  if(!(visits===1 && args[0]===base+'/')) await acknowledgeDisclosure(page);
  return response;
 };
 return page;
}
async function applicantEntry(page) {
 await page.getByLabel('Applicant type').selectOption('Freshman');
 await page.getByLabel('Application cycle').selectOption('DCAT 2027');
 await page.getByLabel('First-choice program',{exact:false}).selectOption('BSBA');
 await shot(page,'public','Applicant entry - BSBA major selection',{state:'conditional-form'});
 await page.getByLabel('BSBA major',{exact:false}).selectOption({index:1});
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await shot(page,'public','Applicant entry - Personal details',{state:'entry-personal'});
 for(const [name,value] of Object.entries({firstName:'Juan',lastName:'Dela Cruz',birthDate:'2008-05-12',nationality:'Filipino'})) await page.locator('[name="'+name+'"]').fill(value);
 await page.getByLabel('Sex',{exact:false}).selectOption('Male');
 await page.getByRole('button',{name:'Add demo photo',exact:true}).click();
 await page.locator('input[type="file"]').setInputFiles({name:'fictional-preview.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aCioAAAAASUVORK5CYII=','base64')});
 await page.getByRole('button',{name:'Use photo',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 for(const [name,value] of Object.entries({email:'juan.delacruz@example.invalid',mobile:'09170000000',guardian:'Rosa Dela Cruz',guardianContact:'09170000001',city:'Sample City',barangay:'Barangay 12'})) await page.locator('[name="'+name+'"]').fill(value);
 await shot(page,'public','Applicant entry - Contact details',{state:'entry-contact'});
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await shot(page,'public','Applicant entry - Review',{state:'entry-review'});
 for(const input of await page.locator('input[type="checkbox"]').all()) await input.check();
 await page.getByRole('button',{name:'Generate demo account',exact:true}).click();
 await shot(page,'public','Applicant entry - Preview result',{state:'entry-preview'});
}
'''
for kind in ['capture', 'coverage', 'supplement']:
    source = Path('C:/Users/silve/AppData/Local/Temp') / ('human-gallery-' + kind + '.cjs')
    text = source.read_text(encoding='utf-8')
    rules = '@typescript-eslint/no-require-imports' + (', @typescript-eslint/no-unused-vars' if kind != 'capture' else '')
    text = '/* eslint-disable ' + rules + ' -- Established self-contained browser capture recipes retain shared helpers. */\n' + text
    text = text.replace("path.join(root,'final-check-before-uiux','.__final-pass-2')", "path.join(root,'final-check-pass-4')")
    text = text.replace("base='http://localhost:3000'", "base='http://localhost:3001'")
    text = text.replace("!f.startsWith('final-check-before-uiux/')", "!f.startsWith('final-check-before-uiux/') && !f.startsWith('final-check-pass-4/') && !f.startsWith('final-pass-4-evidence/')")
    text = text.replace('page=await ctx.newPage()', 'page=setupPage(await ctx.newPage())').replace('page = await ctx.newPage()', 'page = setupPage(await ctx.newPage())')
    text = text.replace("['mobile-360x800',{width:360,height:800}]", "['mobile-360x800',{width:360,height:800}],['mobile-320x812',{width:320,height:812}]")
    text = text.replace("'/disclaimer','/acceptable-use'", "'/about-developer','/disclaimer','/acceptable-use'")
    start = text.index(" await page.getByLabel('Full name'")
    end = text.index(" await page.goto(base+'/account/recovery'", start)
    text = text[:start] + ' await applicantEntry(page);\n' + text[end:]
    text = text.replace("const btn=page.locator('main button[type=\"submit\"]').first();", "const btn=page.getByRole('button',{name:'Preview recovery email',exact:true});")
    text = text.replace("'Screenshot Demo'", "'Juan Dela Cruz'")
    text = text.replace("screenshot.demo@example.invalid", "juan.delacruz@example.invalid")
    text = text.replace("# Final check before UI/UX", "# Final check — Pass 4")
    text = text.replace('No application source, styling, fixtures, schema, or existing local changes were edited.', 'Captured after the approved Final Pass 4 changes; historical corpus preserved separately.')
    text = text.replace('async function acknowledgeDisclosure(page){', helpers + '\nasync function acknowledgeDisclosure(page){')
    (destination / (kind + '.cjs')).write_text(text, encoding='utf-8')
(destination / 'run.cjs').write_text('/* eslint-disable @typescript-eslint/no-require-imports -- Established browser capture harness. */\nconst cp=require("node:child_process"),path=require("node:path");for(const kind of ["capture","coverage","supplement"]) cp.execFileSync(process.execPath,[path.join(__dirname,kind+".cjs")],{stdio:"inherit"});\n',encoding='utf-8')
print('Prepared separate current corpus harness.')

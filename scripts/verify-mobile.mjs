import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'C:/Users/shuqi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
const screens = ['homepage', 'headquarters', 'member', 'department', 'research'];
const output = 'output/playwright/responsive';
await mkdir(output, { recursive: true });
try {
  const cases = [[320,568,'no-preference'],[375,844,'no-preference'],[414,896,'no-preference'],[640,800,'no-preference'],[768,1024,'no-preference'],[844,390,'no-preference'],[375,667,'reduce']];
  for (const [width, height, reducedMotion] of cases.filter(([width]) => !process.env.MIN_WIDTH || width >= Number(process.env.MIN_WIDTH))) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: true, hasTouch: true, reducedMotion });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const tag = `${width}-${height}-${reducedMotion}`;
    await page.goto('http://127.0.0.1:4174/', { waitUntil: 'networkidle' });
    await page.locator('#entry-menu-toggle').tap();
    await page.locator('#entry-menu-close').tap();
    await page.locator('#enter-button').tap();
    await page.waitForFunction(() => document.querySelector('#auth-screen').getAttribute('aria-hidden') === 'false');
    await page.waitForTimeout(1200);
    const auth = await page.locator('#auth-screen').evaluate(el => ({overflow: el.scrollWidth-el.clientWidth, height: el.scrollHeight-el.clientHeight}));
    assert.equal(auth.overflow, 0, `${tag}: auth horizontal overflow`);
    await page.screenshot({path:`${output}/${tag}-auth.png`});
    await page.waitForFunction(() => document.querySelector('#homepage-screen').getAttribute('aria-hidden') === 'false');
    for (const [index, name] of screens.entries()) {
      const screen = page.locator(`#${name}-screen`);
      if (index) await page.locator(`#${screens[index-1]}-screen .side-nav__item`).nth(index).tap();
      await page.waitForTimeout(1500);
      assert.equal(await screen.getAttribute('aria-hidden'), 'false');
      await screen.evaluate(el => el.scrollTop = 0);
      await page.screenshot({path:`${output}/${tag}-${name}-top.png`});
      const geometry = await screen.evaluate(el => {
        const rect = e => e.getBoundingClientRect().toJSON();
        const header = el.querySelector('.brand-mark');
        const content = el.querySelector('[class$="screen__content"]');
        const nav = el.querySelector('.side-nav');
        const footer = el.querySelector('.screen-footer');
        const blocks = [...content.children].filter(e => e.getBoundingClientRect().height > 0).map(rect);
        return { overflow: el.scrollWidth-el.clientWidth, header:rect(header), blocks, nav:rect(nav),footer:rect(footer) };
      });
      assert.equal(geometry.overflow, 0, `${tag} ${name}: horizontal overflow`);
      assert.ok(geometry.footer.top >= geometry.nav.bottom - 1, `${tag} ${name}: footer overlaps navigation`);
      if (index) {
        assert.ok(geometry.blocks[0].top >= geometry.header.bottom-1, `${tag} ${name}: header overlap`);
        for (let i=1; i<geometry.blocks.length;i++) assert.ok(geometry.blocks[i].top >= geometry.blocks[i-1].bottom-1, `${tag} ${name}: content overlap`);
      }
      if (name === 'homepage') {
        await page.locator('[data-quick-link="email"]').tap();
        const modal = page.locator('.info-modal__panel');
        assert.equal(await modal.evaluate(el => el.scrollWidth-el.clientWidth),0);
        await page.screenshot({path:`${output}/${tag}-modal.png`});
        await page.locator('#info-modal-close').tap();
      }
      if (name === 'member') {
        const titles = new Set();
        for (let i=0;i<6;i++) {
          const card = page.locator('.member-card.is-active');
          titles.add(await card.locator('h3').textContent());
          assert.ok(await card.evaluate(el => [...el.querySelectorAll('h3,p')].every(e => e.scrollWidth <= e.clientWidth+1 && e.getBoundingClientRect().bottom <= el.getBoundingClientRect().bottom)), `${tag}: clipped member text`);
          await page.locator('#member-next').tap();
          await page.waitForTimeout(650);
        }
        assert.equal(titles.size,6);
        await page.locator('#member-prev').tap();
      }
      if (name === 'department') {
        for (let i=0;i<5;i++) {
          await page.locator('.department-cluster--left .department-card').nth(i).tap();
          await page.waitForTimeout(350);
          assert.ok(await page.locator('.department-panel__title').evaluate(el => el.scrollWidth <= el.clientWidth+1), `${tag}: clipped project title`);
        }
        await page.locator('.department-panel').scrollIntoViewIfNeeded();
        await page.screenshot({path:`${output}/${tag}-department-detail.png`});
      }
      if (name === 'research') {
        for (let i=0;i<3;i++) {
          await page.locator('[data-research]').nth(i).tap();
          await page.waitForTimeout(350);
          assert.ok(await page.locator('[data-research]').nth(i).evaluate(el => el.classList.contains('is-active')));
        }
      }
      await screen.locator('.screen-footer').scrollIntoViewIfNeeded();
      await page.screenshot({path:`${output}/${tag}-${name}-bottom.png`});
      assert.ok(await screen.locator('.screen-footer').evaluate(el => el.getBoundingClientRect().bottom <= innerHeight+1), `${tag} ${name}: unreachable footer`);
      results.push({tag,name,horizontalOverflow:geometry.overflow,footerGap:geometry.footer.top-geometry.nav.bottom});
    }
    await page.locator('#research-screen .side-nav__item').first().tap();
    assert.equal(await page.locator('#homepage-screen').getAttribute('aria-hidden'),'false');
    assert.deepEqual(errors,[]);
    console.log(`PASS ${tag}: five pages, intro/menu/modal, six cards, five project selections, three research tabs`);
    await page.close();
  }
  const desktop = await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  await desktop.goto('http://127.0.0.1:4174/',{waitUntil:'networkidle'});
  for (const name of ['enter',...screens]) {
    if (name !== 'enter') await desktop.evaluate(name => window[{homepage:'showHomepage',headquarters:'showHeadquarters',member:'showMember',department:'showDepartment',research:'showResearch'}[name]](), name);
    await desktop.waitForTimeout(300);
    const dimensions = () => desktop.locator(`#${name}-screen`).evaluate(el => [el,...el.querySelectorAll('header,nav,footer,button,article,aside,h2')].map(e => e.getBoundingClientRect().toJSON()));
    const enabled = await dimensions();
    await desktop.locator('link[href$="mobile.css"]').evaluate(el => el.disabled=true);
    assert.deepEqual(await dimensions(),enabled,`Desktop layout changed: ${name}`);
    await desktop.locator('link[href$="mobile.css"]').evaluate(el => el.disabled=false);
    await desktop.screenshot({path:`${output}/desktop-${name}.png`});
  }
  console.log('PASS desktop: mobile stylesheet does not change 1440px geometry');
  await desktop.close();
} finally {
  await browser.close();
  await writeFile(`${output}/results.json`, JSON.stringify(results,null,2));
}

const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'C:/Users/shuqi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core');

async function pin(page, selector, time) {
  await page.locator(selector).evaluate((el, t) => {
    el.getAnimations({ subtree: true }).forEach(animation => {
      animation.pause();
      animation.currentTime = t;
    });
  }, time);
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const errors = [];
  try {
    for (const [width, height] of [[1440, 900], [1920, 1080], [1024, 768], [768, 1024], [320, 740], [375, 844], [414, 896]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push({ message: message.text(), location: message.location() }); });
      await page.goto('http://127.0.0.1:4174/');
      await page.locator('.logo-stage.is-playing').waitFor();
      if (width === 1440) {
        const values = [];
        for (const time of [450, 650, 1450, 2250, 3050, 3850, 4400, 7300, 12000, 18000]) {
          await pin(page, '.logo-stage', time);
          values.push(await page.locator('.logo-stage__image--white').evaluate(el => ({ opacity: Number(getComputedStyle(el).opacity), filter: getComputedStyle(el).filter })));
        }
        assert.equal(new Set(values.map(value => value.filter)).size, 1, 'Logo filter must never cycle hues');
        assert(values.every((value, i) => i === 0 || value.opacity >= values[i - 1].opacity), 'White handoff must be monotonic');
        assert(values.slice(-4).every(value => value.opacity === 1), 'White logo must stay opaque');
        const halo = await page.locator('.logo-stage__glow').evaluate(el => el.getAnimations().find(a => a.animationName === 'entryHaloPulse').effect.getTiming().delay);
        assert.equal(halo, 450);
        console.log('Logo opacity samples', values.map(value => value.opacity));
      }
      await page.locator('#enter-button').click();
      await page.waitForFunction(() => document.querySelector('#auth-screen').getAttribute('aria-hidden') === 'false');
      const auth = await page.locator('#auth-screen').boundingBox();
      await page.waitForFunction(() => document.querySelector('#homepage-screen').getAttribute('aria-hidden') === 'false');
      if (width === 1440) {
        for (const time of [450, 1100, 1900, 3200]) {
          await pin(page, '#homepage-screen', time);
          await page.screenshot({ path: `output/playwright/growth-${time}.png` });
        }
      } else {
        await pin(page, '#homepage-screen', 3500);
      }
      const geometry = await page.locator('#homepage-screen').evaluate(screen => {
        const scene = screen.querySelector('.homepage-visual');
        const box = scene.getBoundingClientRect();
        const badPaths = [...scene.querySelectorAll('.homepage-visual__orange-svg path, .homepage-visual__data-svg path, .homepage-visual__data-svg circle')].filter(path => {
          const rect = path.getBBox();
          const padding = Number.parseFloat(getComputedStyle(path).strokeWidth) / 2;
          return rect.x - padding < 0 || rect.y - padding < 0 || rect.x + rect.width + padding > 620 || rect.y + rect.height + padding > 760;
        }).length;
        return { badPaths, overflow: screen.scrollWidth - screen.clientWidth, sceneWidth: box.width, frame: screen.getBoundingClientRect().toJSON() };
      });
      assert.equal(geometry.badPaths, 0, 'All painted paths must fit the viewBox');
      assert(geometry.overflow <= 1, 'Homepage must not overflow horizontally');
      assert(geometry.sceneWidth > 150, 'Scene must remain visible');
      assert(Math.abs(auth.width - geometry.frame.width) < 1, 'Auth and home frames must align');
      if (width <= 414) {
        await page.locator('.homepage-visual').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `output/playwright/growth-mobile-${width}.png` });
        await page.locator('#homepage-screen .side-nav__item').last().scrollIntoViewIfNeeded();
        assert(await page.locator('#homepage-screen .side-nav__item').last().isVisible());
      }
      console.log(`${width}x${height}`, geometry);
      await page.close();
    }

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:4174/');
    await page.locator('#enter-button').click();
    await page.waitForFunction(() => document.querySelector('#auth-screen').getAttribute('aria-hidden') === 'false');
    await page.locator('#replay-intro').click();
    await page.waitForTimeout(3000);
    assert.equal(await page.locator('#homepage-screen').getAttribute('aria-hidden'), 'true', 'Replay must cancel pending homepage transition');
    await page.locator('#enter-button').click();
    await page.waitForFunction(() => document.querySelector('#homepage-screen').getAttribute('aria-hidden') === 'false');
    const reduced = await page.locator('#homepage-screen').evaluate(el => ({
      running: el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length,
      paths: [...el.querySelectorAll('.homepage-visual__orange-path')].map(p => getComputedStyle(p).strokeDashoffset),
      navigationOpacity: getComputedStyle(el.querySelector('.side-nav')).opacity,
    }));
    assert.equal(reduced.running, 0);
    assert.equal(reduced.navigationOpacity, '1');
    assert(reduced.paths.every(value => Number.parseFloat(value) === 0));
    await page.screenshot({ path: 'output/playwright/growth-reduced.png' });
    await page.locator('#homepage-replay').click();
    assert.equal(await page.locator('#enter-screen').getAttribute('aria-hidden'), 'false');
    assert.deepEqual(errors, []);
    console.log('PASS: containment, logo handoff, frames, mobile navigation, replay and reduced motion');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

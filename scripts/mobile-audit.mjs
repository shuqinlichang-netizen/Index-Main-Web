import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
const { chromium } = createRequire(import.meta.url)("C:/Users/shuqi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

const screens = [
  ["homepage", "#homepage-screen"],
  ["experience", "#headquarters-screen"],
  ["capabilities", "#member-screen"],
  ["projects", "#department-screen"],
  ["education", "#research-screen"],
];
const show = { experience: "showHeadquarters", capabilities: "showMember", projects: "showDepartment", education: "showResearch" };
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const all = [];
try {
  for (const width of [375, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("http://127.0.0.1:4174/", { waitUntil: "networkidle" });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `output/playwright/mobile-${width}-entry.png`, fullPage: true });
    await page.locator('#entry-menu-toggle').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `output/playwright/mobile-${width}-menu.png` });
    await page.locator('#entry-menu-close').click();
    await page.locator("#enter-button").click();
    await page.waitForFunction(() => document.querySelector("#auth-screen").getAttribute("aria-hidden") === "false");
    await page.waitForTimeout(1250);
    await page.screenshot({ path: `output/playwright/mobile-${width}-auth.png`, fullPage: true });
    await page.waitForFunction(() => document.querySelector("#homepage-screen").getAttribute("aria-hidden") === "false");

    for (const [name, selector] of screens) {
      if (show[name]) await page.evaluate((fn) => window[fn](), show[name]);
      await page.waitForTimeout(3500);
      await page.screenshot({ path: `output/playwright/mobile-${width}-${name}.png`, fullPage: true });
      const report = await page.locator(selector).evaluate((screen) => {
        const sr = screen.getBoundingClientRect();
        const descendants = [...screen.querySelectorAll("*")];
        const overflow = descendants.filter((element) => {
          const r = element.getBoundingClientRect();
          return r.width > 1 && (r.left < sr.left - 1 || r.right > sr.right + 1);
        }).slice(0, 12).map((element) => ({ className: String(element.className), rect: element.getBoundingClientRect().toJSON() }));
        const controls = [...screen.querySelectorAll("button, a")].filter((element) => {
          const r = element.getBoundingClientRect();
          return getComputedStyle(element).visibility !== "hidden" && getComputedStyle(element).display !== "none" && r.width > 0 && r.height > 0;
        }).map((element) => ({ className: String(element.className), text: element.textContent.trim().slice(0, 24), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }));
        return { screen: sr.toJSON(), scrollWidth: screen.scrollWidth, clientWidth: screen.clientWidth, scrollHeight: screen.scrollHeight, clientHeight: screen.clientHeight, overflow, controls };
      });
      if (name === "homepage") {
        await page.locator('.homepage-visual').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `output/playwright/mobile-${width}-homepage-art.png` });
        await page.locator('#homepage-screen .side-nav__item').last().scrollIntoViewIfNeeded();
        await page.screenshot({ path: `output/playwright/mobile-${width}-homepage-nav.png` });
        await page.locator('[data-quick-link="email"]').click();
        await page.waitForTimeout(650);
        await page.screenshot({ path: `output/playwright/mobile-${width}-modal.png`, fullPage: true });
        report.modal = await page.locator("#info-modal").evaluate((modal) => ({ visible: modal.getAttribute("aria-hidden"), rect: modal.querySelector(".info-modal__panel").getBoundingClientRect().toJSON() }));
        await page.locator("#info-modal-close").click();
      }
      if (name === "capabilities") {
        try {
          await page.locator("#member-next").click({ timeout: 1800 });
          report.nextClickable = true;
        } catch (error) {
          report.nextClickable = false;
          report.nextError = error.message.split('\n')[0];
        }
        await page.waitForTimeout(700);
        report.activeCard = await page.locator(".member-card.is-active").evaluate((card) => ({ title: card.querySelector(".member-card__title")?.textContent, rect: card.getBoundingClientRect().toJSON() }));
      }
      if (name === "projects") {
        await page.locator(".department-card").nth(1).click({ timeout: 1800 });
        await page.waitForTimeout(350);
        report.panel = await page.locator(".department-panel").evaluate((panel) => ({ title: panel.querySelector(".department-panel__title")?.textContent, rect: panel.getBoundingClientRect().toJSON() }));
        await page.mouse.move(width / 2, 600);
        await page.mouse.wheel(0, 1200);
        await page.waitForTimeout(450);
        report.afterScroll = await page.locator('.department-panel').boundingBox();
        await page.screenshot({ path: `output/playwright/mobile-${width}-projects-scroll.png` });
      }
      if (name === "education") {
        await page.locator("[data-research]").nth(1).click();
        await page.waitForTimeout(350);
        report.research = await page.locator(".research-info").evaluate((panel) => ({ visible: getComputedStyle(panel).display, rect: panel.getBoundingClientRect().toJSON() }));
      }
      all.push({ width, name, report });
      console.log(JSON.stringify({ width, name, horizontal: report.scrollWidth - report.clientWidth, vertical: report.scrollHeight - report.clientHeight, nextClickable: report.nextClickable }));
    }
    all.push({ width, errors });
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile('output/playwright/mobile-audit.json', JSON.stringify(all, null, 2));
console.log('Saved output/playwright/mobile-audit.json');

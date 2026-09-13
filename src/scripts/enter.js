const enterScreen = document.getElementById("enter-screen");
const enterButton = document.getElementById("enter-button");
const entryMenu = document.getElementById("entry-menu");
const entryMenuToggle = document.getElementById("entry-menu-toggle");
const entryMenuClose = document.getElementById("entry-menu-close");
const entryCtas = Array.from(document.querySelectorAll("[data-entry-cta]"));
const logoStage = document.querySelector(".logo-stage");
const logoLottieContainer = document.getElementById("logo-lottie");
const logoFallback = document.getElementById("logo-fallback");
const authScreen = document.getElementById("auth-screen");
const authTypeLine = document.getElementById("auth-type-line");
const replayButton = document.getElementById("replay-intro");
const homepageScreen = document.getElementById("homepage-screen");
const homepageReplay = document.getElementById("homepage-replay");
const headquartersScreen = document.getElementById("headquarters-screen");
const headquartersEnter = document.getElementById("headquarters-enter");
const memberScreen = document.getElementById("member-screen");
const departmentScreen = document.getElementById("department-screen");
const researchScreen = document.getElementById("research-screen");
const memberCards = Array.from(document.querySelectorAll("[data-card]"));
const memberPrev = document.getElementById("member-prev");
const memberNext = document.getElementById("member-next");
const departmentCards = Array.from(document.querySelectorAll(".department-card"));
const departmentPanelMode = document.getElementById("department-panel-mode");
const departmentPanelTitle = document.getElementById("department-panel-title");
const departmentPanelSubtitle = document.getElementById("department-panel-subtitle");
const departmentPanelCopy = document.getElementById("department-panel-copy");
const departmentPanelLink = document.getElementById("department-panel-link");
const departmentPanel = document.querySelector(".department-panel");
const researchOpen = document.getElementById("research-open");
const researchInfoSwitches = Array.from(document.querySelectorAll("[data-research]"));
const researchProgressGrid = document.getElementById("research-progress-grid");
const researchProgressValue = document.getElementById("research-progress-value");
const researchStatus = document.getElementById("research-status");
const researchTitle = document.getElementById("research-title");
const researchSubtitle = document.getElementById("research-subtitle");
const researchCopy = document.getElementById("research-copy");
const researchLink = document.getElementById("research-link");
const researchInfo = document.getElementById("research-info");
const quickLinkButtons = Array.from(document.querySelectorAll("[data-quick-link]"));
const infoModal = document.getElementById("info-modal");
const infoModalEyebrow = document.getElementById("info-modal-eyebrow");
const infoModalTitle = document.getElementById("info-modal-title");
const infoModalValue = document.getElementById("info-modal-value");
const infoModalCopy = document.getElementById("info-modal-copy");
const infoModalOpen = document.getElementById("info-modal-open");
const infoModalClose = document.getElementById("info-modal-close");
const infoModalBackdrop = document.querySelector("[data-modal-close]");

const homepageNavButtons = homepageScreen ? homepageScreen.querySelectorAll(".side-nav__item") : [];
const headquartersNavButtons = headquartersScreen ? headquartersScreen.querySelectorAll(".side-nav__item") : [];
const memberNavButtons = memberScreen ? memberScreen.querySelectorAll(".side-nav__item") : [];
const departmentNavButtons = departmentScreen ? departmentScreen.querySelectorAll(".side-nav__item") : [];
const researchNavButtons = researchScreen ? researchScreen.querySelectorAll(".side-nav__item") : [];

const typeTarget = "PERMISSION AUTHORIZED";
const introSeenKey = "miru-resume-intro-seen";
let typeTimer;
let entryTransitionTimer;
let homepageTransitionTimer;
let memberIndex = 0;
let modalValue = "";
let activeResearchIndex = 0;
let logoAnimationReady = false;
let logoAnimationFrame;
let researchProgressFrame;

const siteConfig = {
  links: {
    blog: "https://github.com/shuqinlichang-netizen",
    github: "https://github.com/shuqinlichang-netizen",
    article2: "#",
    article3: "#",
    article4: "#",
    article5: "#",
  },
  contact: {
    email: "shuqinlichang@gmail.com",
    qq: "3223471462",
  },
};

const researchItems = [
  {
    status: "R-1 / PRIMARY FOCUS",
    title: "AI 编程面试小助手",
    subtitle: "LOCAL MODEL / RAG / DUAL-CHANNEL DESIGN",
    copy: "基于 LangChain4j、Ollama 和 RAG 的智能问答项目，优先使用本地模型，再按状态降级到云端推理。",
    link: siteConfig.links.article4,
  },
  {
    status: "R-2 / SECONDARY ARCHIVE",
    title: "校园失物招领平台",
    subtitle: "CAMPUS SERVICE / AI SEARCH",
    copy: "面向校园场景的失物招领平台，重点在真实业务流程、语义检索与系统组织能力。",
    link: siteConfig.links.article3,
  },
  {
    status: "R-3 / NOTE SYSTEM",
    title: "技术笔记 / Matt Pocock Skills",
    subtitle: "READING NOTE / METHOD ARCHIVE",
    copy: "承接阅读记录、技术梳理和方法总结，用更轻的方式补足项目之外的长期积累。",
    link: siteConfig.links.article5,
  },
];

const quickLinkConfig = {
  blog: {
    type: "link",
    url: siteConfig.links.blog,
  },
  github: {
    type: "link",
    url: siteConfig.links.github,
  },
  email: {
    type: "modal",
    eyebrow: "EMAIL",
    title: "PRIMARY CONTACT",
    value: siteConfig.contact.email,
    openLabel: "OPEN MAIL CLIENT",
    openHref: `mailto:${siteConfig.contact.email}`,
  },
  qq: {
    type: "modal",
    eyebrow: "QQ",
    title: "INSTANT CONTACT",
    value: siteConfig.contact.qq,
    openLabel: "CLOSE",
    openHref: "#",
  },
};

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) {
    node.textContent = value;
  }
}

function setHtml(selector, value) {
  const node = document.querySelector(selector);
  if (node) {
    node.innerHTML = value;
  }
}

function applyCopyUpdates() {
  const copy = window.siteCopy || {};
  const links = siteConfig.links;

  document.querySelectorAll(".brand-mark__title").forEach((title) => {
    title.textContent = copy.brandTitle || "MIRU";
  });

  document.querySelectorAll(".brand-mark").forEach((brand) => {
    const meta = brand.querySelectorAll(".brand-mark__meta");
    if (meta[0]) meta[0].textContent = copy.brandMeta?.[0] || "CREATIVE EDITING";
    if (meta[1]) meta[1].textContent = copy.brandMeta?.[1] || "QUALITY ASSURANCE";
  });

  document.querySelectorAll(".screen-footer__report-link").forEach((link) => {
    link.href = `mailto:${siteConfig.contact.email}`;
    link.textContent = siteConfig.contact.email;
  });

  document.querySelectorAll(".screen-footer").forEach((footer) => {
    const records = footer.querySelectorAll(".screen-footer__record");
    if (records[0]) {
      records[0].href = siteConfig.links.github;
      records[0].textContent = "GITHUB / MIRU";
    }
    if (records[1]) {
      records[1].href = `mailto:${siteConfig.contact.email}`;
      records[1].textContent = "QQ / 3223471462";
    }
    const identity = footer.querySelector(".screen-footer__brand span");
    if (identity) identity.textContent = "MIRU PERSONAL RESUME";
  });

  setText(".enter-panel__title", copy.enter?.title || "ENTER RESUME OS");
  setText(".enter-panel__copy", copy.enter?.copy || "");
  setText(".enter-panel__hint", copy.enter?.hint || "");
  setText(".auth-screen__subcopy", copy.auth?.subcopy || "");

  if (copy.homepage?.titleHtml) {
    setHtml(".homepage-copy__title", copy.homepage.titleHtml);
  }

  const homepageLines = document.querySelectorAll(".homepage-copy__summary .homepage-copy__line");
  (copy.homepage?.lines || []).forEach((text, index) => {
    if (homepageLines[index]) {
      homepageLines[index].textContent = text;
    }
  });

  if (copy.headquarters?.summaryHtml) {
    setHtml(".headquarters-copy__summary", copy.headquarters.summaryHtml);
  }

  if (copy.headquarters?.statusHtml) {
    setHtml(".headquarters-copy__status-value", copy.headquarters.statusHtml);
  }

  document.querySelectorAll(".member-card__desc").forEach((desc, index) => {
    const text = copy.memberDescriptions?.[index];
    if (text) {
      desc.textContent = text;
    }
  });

  departmentCards.forEach((card, index) => {
    const item = copy.department?.[index];
    if (!item) {
      return;
    }

    card.dataset.panelMode = item.mode || "CAPABILITY MATRIX";
    card.dataset.panelTitle = item.title || "";
    card.dataset.panelSubtitle = item.subtitle || "";
    card.dataset.panelCopy = item.copy || "";
    card.dataset.link = item.linkKey && links[item.linkKey] ? links[item.linkKey] : "";
  });

  (copy.research?.items || []).forEach((item, index) => {
    if (!researchItems[index]) {
      return;
    }

    researchItems[index] = {
      ...researchItems[index],
      status: item.status || researchItems[index].status,
      title: item.title || researchItems[index].title,
      subtitle: item.subtitle || researchItems[index].subtitle,
      copy: item.copy || researchItems[index].copy,
      link: item.linkKey && links[item.linkKey] ? links[item.linkKey] : researchItems[index].link,
    };
  });

  setText(".research-panel__title", copy.research?.panelTitle || "");
  setText(".research-panel__name", "Miru.");
  setText(".research-progress__label", copy.research?.progressLabel || "");
  setText(".research-panel__quote", copy.research?.quote || "");

  if (copy.contactModal?.emailTitle) {
    quickLinkConfig.email.title = copy.contactModal.emailTitle;
  }

  if (copy.contactModal?.qqTitle) {
    quickLinkConfig.qq.title = copy.contactModal.qqTitle;
  }
}

function runTypewriter() {
  if (!authTypeLine) {
    return;
  }

  window.clearTimeout(typeTimer);
  authTypeLine.textContent = "";

  let index = 0;

  const step = () => {
    authTypeLine.textContent = typeTarget.slice(0, index);
    index += 1;

    if (index <= typeTarget.length) {
      typeTimer = window.setTimeout(step, 58);
    }
  };

  step();
}

function showAuthScreen() {
  if (!authScreen) {
    return;
  }

  if (enterScreen) {
    enterScreen.classList.add("is-dismissed");
    enterScreen.setAttribute("aria-hidden", "true");
  }

  authScreen.classList.add("is-visible");
  authScreen.setAttribute("aria-hidden", "false");
  runTypewriter();
  window.localStorage.setItem(introSeenKey, "1");

  window.clearTimeout(homepageTransitionTimer);
  homepageTransitionTimer = window.setTimeout(() => {
    showHomepage();
  }, 2800);
}

function showHomepage() {
  if (!homepageScreen || !authScreen) {
    return;
  }

  if (enterScreen) {
    enterScreen.classList.add("is-dismissed");
    enterScreen.setAttribute("aria-hidden", "true");
  }

  authScreen.classList.remove("is-visible");
  authScreen.setAttribute("aria-hidden", "true");
  homepageScreen.classList.add("is-visible");
  homepageScreen.setAttribute("aria-hidden", "false");
}

function showHeadquarters() {
  if (!headquartersScreen) {
    return;
  }

  if (homepageScreen) {
    homepageScreen.classList.remove("is-visible");
    homepageScreen.setAttribute("aria-hidden", "true");
  }

  if (memberScreen) {
    memberScreen.classList.remove("is-visible");
    memberScreen.setAttribute("aria-hidden", "true");
  }

  if (departmentScreen) {
    departmentScreen.classList.remove("is-visible");
    departmentScreen.setAttribute("aria-hidden", "true");
  }

  headquartersScreen.classList.add("is-visible");
  headquartersScreen.setAttribute("aria-hidden", "false");
}

function showMember() {
  if (!memberScreen) {
    return;
  }

  if (homepageScreen) {
    homepageScreen.classList.remove("is-visible");
    homepageScreen.setAttribute("aria-hidden", "true");
  }

  if (headquartersScreen) {
    headquartersScreen.classList.remove("is-visible", "is-transitioning");
    headquartersScreen.setAttribute("aria-hidden", "true");
  }

  if (departmentScreen) {
    departmentScreen.classList.remove("is-visible");
    departmentScreen.setAttribute("aria-hidden", "true");
  }

  memberScreen.classList.add("is-visible");
  memberScreen.setAttribute("aria-hidden", "false");
  updateMemberCarousel();
}

function showDepartment() {
  if (!departmentScreen) {
    return;
  }

  if (homepageScreen) {
    homepageScreen.classList.remove("is-visible");
    homepageScreen.setAttribute("aria-hidden", "true");
  }

  if (headquartersScreen) {
    headquartersScreen.classList.remove("is-visible", "is-transitioning");
    headquartersScreen.setAttribute("aria-hidden", "true");
  }

  if (memberScreen) {
    memberScreen.classList.remove("is-visible");
    memberScreen.setAttribute("aria-hidden", "true");
  }

  departmentScreen.classList.add("is-visible");
  departmentScreen.setAttribute("aria-hidden", "false");
}

function showResearch() {
  if (!researchScreen) {
    return;
  }

  if (homepageScreen) {
    homepageScreen.classList.remove("is-visible");
    homepageScreen.setAttribute("aria-hidden", "true");
  }

  if (headquartersScreen) {
    headquartersScreen.classList.remove("is-visible", "is-transitioning");
    headquartersScreen.setAttribute("aria-hidden", "true");
  }

  if (memberScreen) {
    memberScreen.classList.remove("is-visible");
    memberScreen.setAttribute("aria-hidden", "true");
  }

  if (departmentScreen) {
    departmentScreen.classList.remove("is-visible");
    departmentScreen.setAttribute("aria-hidden", "true");
  }

  researchScreen.classList.add("is-visible");
  researchScreen.setAttribute("aria-hidden", "false");
  restartResearchProgress();
}

function updateDepartmentPanel(card) {
  if (!card || !departmentPanelTitle || !departmentPanelSubtitle || !departmentPanelCopy || !departmentPanelLink || !departmentPanelMode) {
    return;
  }

  if (departmentPanel) {
    departmentPanel.classList.remove("is-refreshing");
    void departmentPanel.offsetWidth;
    departmentPanel.classList.add("is-refreshing");
    window.setTimeout(() => {
      departmentPanel.classList.remove("is-refreshing");
    }, 280);
  }

  departmentCards.forEach((item) => item.classList.remove("is-active"));
  card.classList.add("is-active");

  departmentPanelMode.textContent = card.dataset.panelMode || "CAPABILITY MATRIX";
  departmentPanelTitle.textContent = card.dataset.panelTitle || "";
  departmentPanelSubtitle.textContent = card.dataset.panelSubtitle || "";
  departmentPanelCopy.textContent = card.dataset.panelCopy || "";

  const link = card.dataset.link;
  if (link) {
    departmentPanelLink.textContent = "OPEN ENTRY";
    departmentPanelLink.href = link;
    departmentPanelLink.setAttribute("aria-disabled", "false");
    departmentPanelLink.classList.add("is-link");
  } else {
    departmentPanelLink.textContent = "INFORMATION ONLY";
    departmentPanelLink.href = "#";
    departmentPanelLink.setAttribute("aria-disabled", "true");
    departmentPanelLink.classList.remove("is-link");
  }
}

function updateMemberCarousel() {
  if (!memberCards.length) {
    return;
  }

  memberCards.forEach((card, index) => {
    card.classList.remove("is-active", "is-prev", "is-next", "is-far-prev", "is-far-next");

    const total = memberCards.length;
    let diff = index - memberIndex;

    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) card.classList.add("is-active");
    else if (diff === -1) card.classList.add("is-prev");
    else if (diff === 1) card.classList.add("is-next");
    else if (diff === -2) card.classList.add("is-far-prev");
    else if (diff === 2) card.classList.add("is-far-next");
  });
}

function updateResearch(index) {
  const item = researchItems[index];
  if (!item || !researchStatus || !researchTitle || !researchSubtitle || !researchCopy || !researchLink) {
    return;
  }

  if (researchInfo) {
    researchInfo.classList.remove("is-refreshing");
    void researchInfo.offsetWidth;
    researchInfo.classList.add("is-refreshing");
    window.setTimeout(() => {
      researchInfo.classList.remove("is-refreshing");
    }, 300);
  }

  activeResearchIndex = index;

  researchInfoSwitches.forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
  });

  researchStatus.textContent = item.status;
  researchTitle.textContent = item.title;
  researchSubtitle.textContent = item.subtitle;
  researchCopy.textContent = item.copy;
  researchLink.href = item.link;
  restartResearchProgress();
}

function restartResearchProgress() {
  if (!researchProgressGrid || !researchProgressValue) {
    return;
  }

  researchProgressGrid.classList.remove("is-animating");
  researchProgressValue.textContent = "0%";

  if (researchProgressFrame) {
    cancelAnimationFrame(researchProgressFrame);
  }

  void researchProgressGrid.offsetWidth;
  researchProgressGrid.classList.add("is-animating");

  const start = performance.now();
  const duration = 1020;

  function tick(now) {
    const elapsed = Math.min(now - start, duration);
    const progress = elapsed / duration;
    researchProgressValue.textContent = `${Math.round(progress * 100)}%`;

    if (elapsed < duration) {
      researchProgressFrame = requestAnimationFrame(tick);
    }
  }

  researchProgressFrame = requestAnimationFrame(tick);
}

function openInfoModal(config) {
  if (!infoModal || !infoModalEyebrow || !infoModalTitle || !infoModalValue || !infoModalCopy || !infoModalOpen) {
    return;
  }

  modalValue = config.value || "";
  infoModalEyebrow.textContent = config.eyebrow || "CONTACT";
  infoModalTitle.textContent = config.title || "";
  infoModalValue.textContent = modalValue;
  infoModalOpen.textContent = config.openLabel || "OPEN";
  infoModalOpen.href = config.openHref || "#";
  infoModal.classList.add("is-visible");
  infoModal.setAttribute("aria-hidden", "false");
}

function closeInfoModal() {
  if (!infoModal) {
    return;
  }

  infoModal.classList.remove("is-visible");
  infoModal.setAttribute("aria-hidden", "true");
}

async function setupLogoAnimation() {
  if (!logoFallback || logoAnimationReady) return;

  logoAnimationReady = true;
  logoFallback.classList.remove("is-hidden");
  if (logoStage) logoStage.classList.remove("is-fallback");

  // Decode both copies before starting their shared animation clock.
  await Promise.all(Array.from(logoStage.querySelectorAll("img"), image => image.decode().catch(() => {})));
  replayLogoAnimation();
}

function replayLogoAnimation() {
  if (!logoFallback) return;

  if (logoAnimationFrame) {
    cancelAnimationFrame(logoAnimationFrame);
  }

  logoFallback.classList.remove("is-visible");
  logoStage?.classList.remove("is-playing");
  void logoFallback.offsetWidth;
  logoAnimationFrame = requestAnimationFrame(() => {
    logoFallback.classList.add("is-visible");
    logoStage?.classList.add("is-playing");
  });
}


function resetIntro() {
  window.clearTimeout(entryTransitionTimer);
  window.clearTimeout(homepageTransitionTimer);
  window.clearTimeout(typeTimer);
  if (authScreen) {
    authScreen.classList.remove("is-visible");
    authScreen.setAttribute("aria-hidden", "true");
  }

  if (enterScreen) {
    enterScreen.classList.remove("is-transitioning");
    enterScreen.classList.remove("is-dismissed");
    enterScreen.setAttribute("aria-hidden", "false");
  }

  if (enterButton) {
    enterButton.classList.remove("is-activated");
  }

  if (homepageScreen) {
    homepageScreen.classList.remove("is-visible");
    homepageScreen.setAttribute("aria-hidden", "true");
  }

  if (headquartersScreen) {
    headquartersScreen.classList.remove("is-visible", "is-transitioning");
    headquartersScreen.setAttribute("aria-hidden", "true");
  }

  if (memberScreen) {
    memberScreen.classList.remove("is-visible");
    memberScreen.setAttribute("aria-hidden", "true");
  }

  if (departmentScreen) {
    departmentScreen.classList.remove("is-visible");
    departmentScreen.setAttribute("aria-hidden", "true");
  }

  if (researchScreen) {
    researchScreen.classList.remove("is-visible");
    researchScreen.setAttribute("aria-hidden", "true");
  }

  if (authTypeLine) {
    authTypeLine.textContent = typeTarget;
  }

  replayLogoAnimation();
}


if (enterButton && enterScreen) {
  enterButton.addEventListener("click", () => {
    if (enterScreen.classList.contains("is-transitioning")) return;
    enterButton.classList.add("is-activated");
    enterScreen.classList.add("is-transitioning");

    entryTransitionTimer = window.setTimeout(() => {
      showAuthScreen();
    }, 520);
  });
}

function setEntryMenu(open) {
  if (!entryMenu || !entryMenuToggle) {
    return;
  }

  entryMenu.classList.toggle("is-open", open);
  entryMenu.setAttribute("aria-hidden", String(!open));
  entryMenuToggle.setAttribute("aria-expanded", String(open));
  entryMenuToggle.setAttribute("aria-label", open ? "Close entry navigation" : "Open entry navigation");
}

if (entryMenuToggle) {
  entryMenuToggle.addEventListener("click", () => {
    setEntryMenu(!entryMenu?.classList.contains("is-open"));
  });
}

if (entryMenuClose) {
  entryMenuClose.addEventListener("click", () => setEntryMenu(false));
}

entryMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setEntryMenu(false));
});

entryCtas.forEach((cta) => {
  cta.addEventListener("click", () => {
    setEntryMenu(false);
    enterButton?.click();
  });
});

if (homepageReplay) {
  homepageReplay.addEventListener("click", () => {
    window.localStorage.removeItem(introSeenKey);
    resetIntro();
  });
}

if (replayButton) {
  replayButton.addEventListener("click", resetIntro);
}

quickLinkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.quickLink;
    const config = quickLinkConfig[key];
    if (!config) {
      return;
    }

    if (config.type === "link" && config.url) {
      window.open(config.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (config.type === "modal") {
      openInfoModal(config);
    }
  });
});

if (homepageScreen) {
  const headquartersNavButton = homepageNavButtons[1];
  if (headquartersNavButton) {
    headquartersNavButton.addEventListener("click", showHeadquarters);
  }

  const memberNavButton = homepageNavButtons[2];
  if (memberNavButton) {
    memberNavButton.addEventListener("click", showMember);
  }

  const departmentNavButton = homepageNavButtons[3];
  if (departmentNavButton) {
    departmentNavButton.addEventListener("click", showDepartment);
  }

  const researchNavButton = homepageNavButtons[4];
  if (researchNavButton) {
    researchNavButton.addEventListener("click", showResearch);
  }
}

if (headquartersScreen) {
  const homepageNavButton = headquartersNavButtons[0];
  if (homepageNavButton) {
    homepageNavButton.addEventListener("click", () => {
      headquartersScreen.classList.remove("is-visible", "is-transitioning");
      headquartersScreen.setAttribute("aria-hidden", "true");
      homepageScreen.classList.add("is-visible");
      homepageScreen.setAttribute("aria-hidden", "false");
    });
  }

  const memberNavButton = headquartersNavButtons[2];
  if (memberNavButton) {
    memberNavButton.addEventListener("click", showMember);
  }

  const departmentNavButton = headquartersNavButtons[3];
  if (departmentNavButton) {
    departmentNavButton.addEventListener("click", showDepartment);
  }

  const researchNavButton = headquartersNavButtons[4];
  if (researchNavButton) {
    researchNavButton.addEventListener("click", showResearch);
  }
}

if (memberScreen) {
  const homepageNavButton = memberNavButtons[0];
  if (homepageNavButton) {
    homepageNavButton.addEventListener("click", () => {
      memberScreen.classList.remove("is-visible");
      memberScreen.setAttribute("aria-hidden", "true");
      homepageScreen.classList.add("is-visible");
      homepageScreen.setAttribute("aria-hidden", "false");
    });
  }

  const headquartersNavButton = memberNavButtons[1];
  if (headquartersNavButton) {
    headquartersNavButton.addEventListener("click", () => {
      memberScreen.classList.remove("is-visible");
      memberScreen.setAttribute("aria-hidden", "true");
      headquartersScreen.classList.add("is-visible");
      headquartersScreen.setAttribute("aria-hidden", "false");
    });
  }

  const departmentNavButton = memberNavButtons[3];
  if (departmentNavButton) {
    departmentNavButton.addEventListener("click", showDepartment);
  }

  const researchNavButton = memberNavButtons[4];
  if (researchNavButton) {
    researchNavButton.addEventListener("click", showResearch);
  }
}

if (departmentScreen) {
  const homepageNavButton = departmentNavButtons[0];
  if (homepageNavButton) {
    homepageNavButton.addEventListener("click", () => {
      departmentScreen.classList.remove("is-visible");
      departmentScreen.setAttribute("aria-hidden", "true");
      homepageScreen.classList.add("is-visible");
      homepageScreen.setAttribute("aria-hidden", "false");
    });
  }

  const headquartersNavButton = departmentNavButtons[1];
  if (headquartersNavButton) {
    headquartersNavButton.addEventListener("click", () => {
      departmentScreen.classList.remove("is-visible");
      departmentScreen.setAttribute("aria-hidden", "true");
      headquartersScreen.classList.add("is-visible");
      headquartersScreen.setAttribute("aria-hidden", "false");
    });
  }

  const memberNavButton = departmentNavButtons[2];
  if (memberNavButton) {
    memberNavButton.addEventListener("click", () => {
      departmentScreen.classList.remove("is-visible");
      departmentScreen.setAttribute("aria-hidden", "true");
      memberScreen.classList.add("is-visible");
      memberScreen.setAttribute("aria-hidden", "false");
      updateMemberCarousel();
    });
  }

  const researchNavButton = departmentNavButtons[4];
  if (researchNavButton) {
    researchNavButton.addEventListener("click", showResearch);
  }
}

if (researchScreen) {
  const homepageNavButton = researchNavButtons[0];
  if (homepageNavButton) {
    homepageNavButton.addEventListener("click", () => {
      researchScreen.classList.remove("is-visible");
      researchScreen.setAttribute("aria-hidden", "true");
      homepageScreen.classList.add("is-visible");
      homepageScreen.setAttribute("aria-hidden", "false");
    });
  }

  const headquartersNavButton = researchNavButtons[1];
  if (headquartersNavButton) {
    headquartersNavButton.addEventListener("click", showHeadquarters);
  }

  const memberNavButton = researchNavButtons[2];
  if (memberNavButton) {
    memberNavButton.addEventListener("click", showMember);
  }

  const departmentNavButton = researchNavButtons[3];
  if (departmentNavButton) {
    departmentNavButton.addEventListener("click", showDepartment);
  }
}

if (headquartersEnter && headquartersScreen) {
  headquartersEnter.addEventListener("click", () => {
    headquartersScreen.classList.add("is-transitioning");

    window.setTimeout(() => {
      headquartersScreen.classList.remove("is-transitioning");
      window.open(siteConfig.links.blog, "_blank", "noopener,noreferrer");
    }, 980);
  });
}

if (memberPrev) {
  memberPrev.addEventListener("click", () => {
    memberIndex = (memberIndex - 1 + memberCards.length) % memberCards.length;
    updateMemberCarousel();
  });
}

if (memberNext) {
  memberNext.addEventListener("click", () => {
    memberIndex = (memberIndex + 1) % memberCards.length;
    updateMemberCarousel();
  });
}

memberCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    memberIndex = index;
    updateMemberCarousel();
  });
});

departmentCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    updateDepartmentPanel(card);
  });

  card.addEventListener("focus", () => {
    updateDepartmentPanel(card);
  });

  if (card.classList.contains("is-link")) {
    card.addEventListener("click", () => {
      const { link } = card.dataset;
      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
      }
    });
  }
});

researchInfoSwitches.forEach((button, index) => {
  button.addEventListener("click", () => updateResearch(index));
});

applyCopyUpdates();
updateMemberCarousel();
if (departmentCards.length) {
  updateDepartmentPanel(departmentCards[0]);
}
updateResearch(0);

if (researchOpen) {
  researchOpen.addEventListener("click", () => {
    const target = researchItems[activeResearchIndex] || researchItems[0];
    window.open(target.link, "_blank", "noopener,noreferrer");
  });
}

if (infoModalCopy) {
  infoModalCopy.addEventListener("click", async () => {
    if (!modalValue) {
      return;
    }

    try {
      await navigator.clipboard.writeText(modalValue);
      infoModalCopy.textContent = "COPIED";
      window.setTimeout(() => {
        infoModalCopy.textContent = "COPY";
      }, 1200);
    } catch {
      infoModalCopy.textContent = "FAILED";
      window.setTimeout(() => {
        infoModalCopy.textContent = "COPY";
      }, 1200);
    }
  });
}

if (infoModalClose) {
  infoModalClose.addEventListener("click", closeInfoModal);
}

if (infoModalBackdrop) {
  infoModalBackdrop.addEventListener("click", closeInfoModal);
}

// Always start from the entry screen after a full page refresh.
// The intro state is intentionally not restored from localStorage so the
// entry animation and authorization sequence can be experienced each time.
if (enterScreen) {
  enterScreen.classList.remove("is-dismissed", "is-transitioning");
  enterScreen.setAttribute("aria-hidden", "false");
}

if (authScreen) {
  authScreen.classList.remove("is-visible");
  authScreen.setAttribute("aria-hidden", "true");
}

if (homepageScreen) {
  homepageScreen.classList.remove("is-visible");
  homepageScreen.setAttribute("aria-hidden", "true");
}

setupLogoAnimation();

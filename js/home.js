// home.js — landing page logic: loads content/home.json, runs the
// typewriter, then reveals the summary + quick links.

import { fetchJSON, el } from "./render.js";
import { typewrite } from "./typewriter.js";
import { initLayout } from "./layout.js";

async function init() {
  initLayout();

  const typewriterEl = document.getElementById("hero-typewriter");
  const summaryEl = document.getElementById("hero-summary");
  const linksEl = document.getElementById("hero-links");

  try {
    const data = await fetchJSON("./content/home.json");

    await typewrite(typewriterEl, data.typewriter, 42);

    summaryEl.textContent = data.summary;
    summaryEl.classList.add("is-visible");

    if (Array.isArray(data.quickLinks) && data.quickLinks.length) {
      linksEl.append(
        ...data.quickLinks.map((link) => el("a", { href: link.href }, [link.label]))
      );
      linksEl.classList.add("is-visible");
    }
  } catch (err) {
    console.error(err);
    typewriterEl.textContent = "Welcome to my little corner on the Internet.";
    summaryEl.textContent =
      "Content failed to load. Please make sure you're viewing this site over http(s), not file://.";
    summaryEl.classList.add("is-visible");
  }
}

init();

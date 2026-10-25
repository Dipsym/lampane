/*
 * Homepage section pop-ups for Soumyadip Kundu's portfolio.
 * Upload this file beside index.html and site.css.
 * The existing index.html already includes: <script src="site.js"></script>
 */
(function () {
  'use strict';

  // This behaviour is intended for the minimalist landing page only.
  if (!document.body.classList.contains('landing-home')) return;

  var PAGE_FILES = new Set([
    'biography.html',
    'research.html',
    'publications.html',
    'travel.html',
    'contact.html'
  ]);

  var activeRequest = 0;
  var lastFocused = null;
  var closeTimer = null;

  var style = document.createElement('style');
  style.textContent = `
    .site-popover {
      display: none;
      position: fixed;
      inset: 0;
      width: min(900px, calc(100vw - 32px));
      height: min(790px, calc(100dvh - 36px));
      max-width: 900px;
      max-height: calc(100dvh - 36px);
      padding: 0;
      border: 1px solid rgba(178,205,235,.24);
      border-radius: 18px;
      overflow: hidden;
      color: #f1f6fc;
      background: #07111f;
      box-shadow: 0 28px 100px rgba(0,0,0,.56), 0 0 0 1px rgba(108,230,255,.035);
      opacity: 0;
      transform: translateY(18px) scale(.975);
      transition: opacity .24s ease, transform .28s cubic-bezier(.2,.72,.2,1);
    }
    .site-popover[open] {
      display: flex;
      flex-direction: column;
    }
    .site-popover[open].is-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .site-popover::backdrop {
      background: rgba(2,7,13,0);
      -webkit-backdrop-filter: blur(0);
      backdrop-filter: blur(0);
      transition: background .24s ease, backdrop-filter .24s ease;
    }
    .site-popover[open].is-visible::backdrop {
      background: rgba(2,7,13,.73);
      -webkit-backdrop-filter: blur(6px);
      backdrop-filter: blur(6px);
    }
    .site-popover-bar {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      min-height: 56px;
      padding: 10px 15px 10px 21px;
      border-bottom: 1px solid rgba(178,205,235,.15);
      background: rgba(7,17,31,.96);
    }
    .site-popover-caption {
      overflow: hidden;
      color: #9fb4ca;
      font-family: "DM Mono", monospace;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: .14em;
      line-height: 1.5;
      text-overflow: ellipsis;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .site-popover-close {
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      padding: 0;
      border: 1px solid rgba(178,205,235,.2);
      border-radius: 50%;
      color: #f1f6fc;
      background: rgba(255,255,255,.035);
      font: 24px/1 system-ui, sans-serif;
      cursor: pointer;
      transition: transform .2s ease, color .2s ease, border-color .2s ease, background .2s ease;
    }
    .site-popover-close:hover {
      transform: rotate(90deg);
      color: #6ce6ff;
      border-color: rgba(108,230,255,.6);
      background: rgba(108,230,255,.08);
    }
    .site-popover-scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      overscroll-behavior: contain;
      scrollbar-color: rgba(108,230,255,.35) #07111f;
      scrollbar-width: thin;
    }
    .site-popover-content {
      opacity: 1;
      transform: translateY(0);
      transition: opacity .16s ease, transform .16s ease;
    }
    .site-popover-content.is-switching {
      opacity: 0;
      transform: translateY(5px);
    }
    .site-popover-content .page-main { animation: none !important; }
    .site-popover-content .page-hero { padding: 38px 0 30px; }
    .site-popover-content .page-hero h1 { font-size: clamp(34px, 5vw, 58px); }
    .site-popover-content .page-hero .lead { font-size: 14px; line-height: 1.85; }
    .site-popover-content .content { padding: 38px 0 48px; }
    .site-popover-content .wrap { width: min(var(--max, 1160px), calc(100% - 42px)); }
    .site-popover-content .section-head { margin-bottom: 27px; }
    .site-popover-content .footer { display: none; }
    .site-popover-loading {
      display: grid;
      min-height: 250px;
      place-items: center;
      padding: 36px;
      color: #a2b2c8;
      font: 11px "DM Mono", monospace;
      letter-spacing: .12em;
      text-align: center;
      text-transform: uppercase;
    }
    .site-popover-spinner {
      width: 24px;
      height: 24px;
      margin: 0 auto 15px;
      border: 1px solid rgba(108,230,255,.23);
      border-top-color: #6ce6ff;
      border-radius: 50%;
      animation: site-popover-spin .7s linear infinite;
    }
    @keyframes site-popover-spin { to { transform: rotate(360deg); } }
    .site-popover-error { padding: 35px 25px; color: #d0dced; text-align: center; }
    .site-popover-error strong { display: block; color: #ffc77a; margin-bottom: 8px; }
    body.site-popover-open { overflow: hidden; }
    @media (max-width: 760px) {
      .site-popover {
        width: calc(100vw - 18px);
        height: calc(100dvh - 18px);
        max-height: calc(100dvh - 18px);
        border-radius: 13px;
      }
      .site-popover-bar { min-height: 50px; padding-left: 15px; }
      .site-popover-content .page-hero { padding: 30px 0 24px; }
      .site-popover-content .content { padding: 29px 0 38px; }
      .site-popover-content .wrap { width: calc(100% - 30px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .site-popover, .site-popover::backdrop, .site-popover-close,
      .site-popover-content { transition: none !important; }
      .site-popover-spinner { animation-duration: 1.5s; }
    }
  `;
  document.head.appendChild(style);

  var dialog = document.createElement('dialog');
  dialog.className = 'site-popover';
  dialog.setAttribute('aria-label', 'Portfolio section');
  dialog.innerHTML = `
    <div class="site-popover-bar">
      <div class="site-popover-caption" id="site-popover-title">Portfolio</div>
      <button class="site-popover-close" type="button" aria-label="Close panel" title="Close">×</button>
    </div>
    <div class="site-popover-scroll">
      <div class="site-popover-content">
        <div class="site-popover-loading"><div><div class="site-popover-spinner"></div>Loading section</div></div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  var titleElement = dialog.querySelector('#site-popover-title');
  var scrollElement = dialog.querySelector('.site-popover-scroll');
  var contentElement = dialog.querySelector('.site-popover-content');
  var closeButton = dialog.querySelector('.site-popover-close');

  function loadingMarkup() {
    return '<div class="site-popover-loading"><div><div class="site-popover-spinner"></div>Loading section</div></div>';
  }

  function isAllowedPage(url) {
    return url.origin === window.location.origin && PAGE_FILES.has(url.pathname.split('/').pop());
  }

  function showDialog() {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (!dialog.open) {
      dialog.showModal();
      document.body.classList.add('site-popover-open');
    }
    window.requestAnimationFrame(function () {
      dialog.classList.add('is-visible');
      closeButton.focus({ preventScroll: true });
    });
  }

  function closeDialog() {
    if (!dialog.open) return;
    dialog.classList.remove('is-visible');
    if (closeTimer) window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(function () {
      if (dialog.open) dialog.close();
    }, 230);
  }

  function cleanPageTitle(parsed, url) {
    var h1 = parsed.querySelector('.page-hero h1, .page-main h1, main h1');
    var title = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!title) title = (parsed.title || url.pathname.split('/').pop()).replace(/\s*[·|—-].*$/, '').trim();
    return title || 'Portfolio';
  }

  async function openPage(href) {
    var url = new URL(href, window.location.href);
    if (!isAllowedPage(url)) {
      window.location.href = url.href;
      return;
    }

    lastFocused = document.activeElement;
    var requestId = ++activeRequest;
    showDialog();
    titleElement.textContent = 'Loading section';
    contentElement.classList.add('is-switching');
    contentElement.innerHTML = loadingMarkup();
    scrollElement.scrollTop = 0;

    try {
      var response = await fetch(url.href, { credentials: 'same-origin' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var html = await response.text();
      var parsed = new DOMParser().parseFromString(html, 'text/html');
      var sourceMain = parsed.querySelector('main.page-main, main#main, main');
      if (!sourceMain) throw new Error('No main content found');
      if (requestId !== activeRequest) return;

      var sectionTitle = cleanPageTitle(parsed, url);
      var page = sourceMain.cloneNode(true);
      page.removeAttribute('id');
      page.classList.add('site-popover-page');

      titleElement.textContent = sectionTitle;
      contentElement.innerHTML = '';
      contentElement.appendChild(page);
      contentElement.classList.remove('is-switching');
      scrollElement.scrollTop = 0;
    } catch (error) {
      if (requestId !== activeRequest) return;
      titleElement.textContent = 'Section unavailable';
      contentElement.classList.remove('is-switching');
      contentElement.innerHTML = '<div class="site-popover-error"><strong>Could not load this section.</strong>Please check that the HTML page is uploaded to the same GitHub Pages repository, then refresh the homepage.</div>';
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('.landing-nav a, .site-popover-content a');
    if (!link) return;
    if (!document.body.classList.contains('landing-home') && !link.closest('.site-popover')) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    var url;
    try { url = new URL(link.href, window.location.href); }
    catch (_) { return; }
    if (!isAllowedPage(url)) return;

    event.preventDefault();
    openPage(url.href);
  });

  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', function (event) {
    // Clicking the dimmed area outside the panel closes the dialog.
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('cancel', function (event) {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('close', function () {
    document.body.classList.remove('site-popover-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
    }
  });
})();

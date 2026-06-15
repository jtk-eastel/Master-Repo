// =============================================================
// EASTELPRENEUR WHITE-LABEL TEMPLATE LOADER
// Jangan ubah file ini kecuali perlu. Tukar branding di site-config.js.
// =============================================================
(function(){
  const cfg = window.SITE_CONFIG || {};
  const defaults = {
    brandName: 'Eastel X Izzue',
    shortBrandName: 'Izzue',
    mentorName: 'Izzue',
    mentorTitle: 'EastelPreneur',
    mentorId: 'E-0064823',
    whatsappNumber: '601175947174',
    whatsappText: 'NakTahuCaraMula',
    ctaText: 'Nak Tahu Cara Mula',
    logoSrc: 'assets/brand/logo-izzue.png',
    mentorPhotoSrc: 'assets/brand/mentor-izzue.png',
    ogImageSrc: 'assets/brand/og-izzue.png',
    footerBrandCopy: 'Prepaid harian. Data besar. Sistem app. Peluang bina jaringan pengguna dengan lebih tersusun.',
    copyrightName: 'Eastel X Izzue'
  };
  const C = Object.assign({}, defaults, cfg);
  function depthPrefix(){
    const path = window.location.pathname.replace(/\/$/, '');
    const parts = path.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    const subPages = ['eastel','calculator','esk','pelan-pemasaran','faq'];
    return subPages.includes(last) ? '../' : '';
  }
  const prefix = depthPrefix();
  function asset(path){
    if(!path) return '';
    if(/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
    return prefix + path.replace(/^\.\//,'').replace(/^\//,'');
  }
  function waLink(){
    return `https://api.whatsapp.com/send/?phone=${encodeURIComponent(C.whatsappNumber)}&text=${encodeURIComponent(C.whatsappText)}&type=phone_number&app_absent=0`;
  }
  function replaceTextNode(node){
    if(!node || !node.nodeValue) return;
    let txt = node.nodeValue;
    txt = txt.replace(/Eastel X Tok ABAK/g, C.brandName);
    txt = txt.replace(/Tok ABAK/g, C.mentorName);
    txt = txt.replace(/E-0003466/g, C.mentorId);
    node.nodeValue = txt;
  }
  function walkText(root){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const p = node.parentElement;
        if(!p) return NodeFilter.FILTER_REJECT;
        if(['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceTextNode);
  }
  function updateMeta(selector, attr, replacer){
    document.querySelectorAll(selector).forEach(el => {
      const val = el.getAttribute(attr);
      if(val) el.setAttribute(attr, replacer(val));
    });
  }
  document.addEventListener('DOMContentLoaded', function(){
    walkText(document.body);
    if(document.title) document.title = document.title.replace(/Eastel X Tok ABAK/g, C.brandName).replace(/Tok ABAK/g, C.mentorName);
    updateMeta('meta[name="description"], meta[property="og:description"]', 'content', v => v.replace(/Eastel X Tok ABAK/g, C.brandName).replace(/Tok ABAK/g, C.mentorName));
    updateMeta('meta[property="og:title"], meta[name="twitter:title"]', 'content', v => v.replace(/Eastel X Tok ABAK/g, C.brandName).replace(/Tok ABAK/g, C.mentorName));
    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(m => m.setAttribute('content', asset(C.ogImageSrc)));
    const link = waLink();
    document.querySelectorAll('a[href*="api.whatsapp.com"], a[data-wa]').forEach(a => {
      a.href = link;
      a.setAttribute('aria-label', C.ctaText);
      const span = a.querySelector('span');
      if(span) span.textContent = C.ctaText;
      else if(a.textContent.trim().match(/Nak Tahu Cara Mula|Cara Mula/i)) {
        const img = a.querySelector('img');
        if(img){ a.innerHTML = ''; a.appendChild(img); a.appendChild(document.createTextNode(C.ctaText)); }
        else a.textContent = C.ctaText;
      }
    });
    document.querySelectorAll('img[src*="logo-eastel"], img[alt*="Eastel X"], .brand img, .footer-brand img').forEach(img => {
      img.src = asset(C.logoSrc);
      img.alt = C.brandName;
    });
    document.querySelectorAll('img[src*="tok-abak"], img[alt*="Tok ABAK"]').forEach(img => {
      img.src = asset(C.mentorPhotoSrc);
      img.alt = C.mentorName;
    });
    document.querySelectorAll('.mentor-id-card h3').forEach(el => el.textContent = C.mentorName);
    document.querySelectorAll('.mentor-id-card p').forEach(el => el.textContent = `${C.mentorTitle} • ${C.mentorId}`);
    document.querySelectorAll('.footer-brand p').forEach(el => {
      if(el.textContent.includes('Prepaid harian')) el.textContent = C.footerBrandCopy;
    });
    document.querySelectorAll('.footer-bottom span:first-child').forEach(el => {
      el.textContent = `© 2026 ${C.copyrightName || C.brandName}. All rights reserved.`;
    });
  });
})();

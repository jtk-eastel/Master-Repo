// =============================================================
// EASTELPRENEUR WHITE-LABEL TEMPLATE LOADER
// Jangan ubah file ini kecuali perlu. Tukar branding di site-config.js.
// =============================================================
(function(){
  const cfg = window.SITE_CONFIG || {};
  const defaults = {
    brandName: 'Eastel X SIMCARD AJAIB',
    shortBrandName: 'Nama Leader',
    mentorName: 'Nama Leader',
    mentorTitle: 'EastelPreneur',
    mentorId: 'E-XXXXXXX',
    whatsappNumber: '601175947174',
    whatsappText: 'NakTahuCaraMula',
    ctaText: 'Nak Tahu Cara Mula',
    logoSrc: 'assets/brand/logo-leader.png',
    mentorPhotoSrc: 'assets/brand/mentor-photo.png',
    ogImageSrc: 'assets/brand/og-image.png',
    homeHeroLead: 'Eastel ialah produk telco harian yang mudah difahami: SIM, data, reload dan app. Nama Leader bantu korang mula dengan cara yang lebih tersusun — guna dulu, faham produk, kemudian bina jaringan pengguna.',
    footerBrandCopy: 'Prepaid harian. Data besar. Sistem app. Peluang bina jaringan pengguna dengan lebih tersusun.',
    copyrightName: 'Eastel X SIMCARD AJAIB'
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
  function applyCopy(txt){
    return txt
      .replace(/Eastel X Tok ABAK/g, C.brandName)
      .replace(/Tok ABAK/g, C.mentorName)
      .replace(/Eastel X Izzue/g, C.brandName)
      .replace(/Izzue/g, C.mentorName)
      .replace(/Eastel X SIMCARD AJAIB/g, C.brandName)
      .replace(/Nama Leader/g, C.mentorName)
      .replace(/E-0003466/g, C.mentorId)
      .replace(/E-0064823/g, C.mentorId)
      .replace(/E-XXXXXXX/g, C.mentorId);
  }
  function replaceTextNode(node){
    if(!node || !node.nodeValue) return;
    node.nodeValue = applyCopy(node.nodeValue);
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
    if(document.title) document.title = applyCopy(document.title);
    updateMeta('meta[name="description"], meta[property="og:description"]', 'content', v => applyCopy(v));
    updateMeta('meta[property="og:title"], meta[name="twitter:title"]', 'content', v => applyCopy(v));
    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(m => m.setAttribute('content', asset(C.ogImageSrc)));
    const lead = document.querySelector('[data-home-hero-lead]');
    if(lead && C.homeHeroLead) lead.textContent = C.homeHeroLead;
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
    document.querySelectorAll('img[src*="logo-izzue"], img[src*="logo-leader"], img[src*="logo-eastel"], img[alt*="Eastel X"], .brand img, .footer-brand img').forEach(img => {
      img.src = asset(C.logoSrc);
      img.alt = C.brandName;
    });
    document.querySelectorAll('img[src*="mentor-izzue"], img[src*="mentor-photo"], img[src*="tok-abak"], img[alt*="Izzue"], img[alt*="Tok ABAK"], .mentor-id-card img').forEach(img => {
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

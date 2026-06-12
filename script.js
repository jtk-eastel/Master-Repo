(function(){
  const WA_LINK = 'https://api.whatsapp.com/send/?phone=601175947174&text=NakTahuCaraMula&type=phone_number&app_absent=0';
  const money = (n) => 'RM' + Number(n || 0).toLocaleString('en-MY',{minimumFractionDigits: Number(n)%1 ? 2 : 0, maximumFractionDigits:2});
  const pct = (n) => Math.min(100, Math.max(0, n)).toFixed(0) + '%';

  document.querySelectorAll('[data-wa]').forEach(a => a.href = WA_LINK);

  const menuBtn = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if(menuBtn && menu){
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded','false');
    }));
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count || 0);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let started = false;
    const countIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const dur = 900;
        const tick = now => {
          const p = Math.min(1, (now - start) / dur);
          const val = Math.round(target * (1 - Math.pow(1-p, 3)));
          el.textContent = prefix + val.toLocaleString('en-MY') + suffix;
          if(p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, {threshold:.6});
    countIO.observe(el);
  });

  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const icon = item.querySelector('.faq-icon');
    if(!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      if(icon) icon.textContent = isOpen ? '−' : '+';
    });
  });

  const calcRoot = document.querySelector('[data-income-calculator]');
  if(calcRoot){
    const rates = {1:.13,2:.03,3:.08,4:.015,5:.015,6:.015,7:.015,8:.015,9:.01,10:.01,11:.01,12:.01,13:.01};
    const rankMax = {elite:3, ambassador:8, senior:13};
    const groups = [
      {title:'Level 1-3: Asas', from:1, to:3},
      {title:'Level 4-8: Ambassador Unlock', from:4, to:8},
      {title:'Level 9-13: Senior Ambassador Unlock', from:9, to:13}
    ];
    const grid = calcRoot.querySelector('[data-level-groups]');
    const rankInput = calcRoot.querySelector('[data-rank]');
    const reloadInput = calcRoot.querySelector('[data-reload]');
    const customWrap = calcRoot.querySelector('[data-custom-wrap]');
    const customInput = calcRoot.querySelector('[data-custom-reload]');
    const resultUsers = calcRoot.querySelector('[data-result-users]');
    const resultReload = calcRoot.querySelector('[data-result-reload]');
    const resultCommission = calcRoot.querySelector('[data-result-commission]');
    const ambassadorBar = calcRoot.querySelector('[data-ambassador-bar]');
    const seniorBar = calcRoot.querySelector('[data-senior-bar]');
    const ambassadorText = calcRoot.querySelector('[data-ambassador-text]');
    const seniorText = calcRoot.querySelector('[data-senior-text]');
    const breakdown = calcRoot.querySelector('[data-breakdown]');

    function buildLevels(){
      grid.innerHTML = '';
      groups.forEach(g => {
        const group = document.createElement('section');
        group.className = 'level-group';
        group.innerHTML = `<h3>${g.title}</h3><div class="level-grid"></div>`;
        const inner = group.querySelector('.level-grid');
        for(let i=g.from;i<=g.to;i++){
          const card = document.createElement('article');
          card.className = 'level-card';
          const def = i===1 ? 10 : i===2 ? 100 : i===3 ? 1000 : 0;
          card.innerHTML = `<label><span>L${i}</span><small>${(rates[i]*100).toFixed(i<=3?0:1)}%</small></label><input type="number" min="0" inputmode="numeric" value="${def}" data-level="${i}" aria-label="Level ${i} pengguna aktif">`;
          inner.appendChild(card);
        }
        grid.appendChild(group);
      });
    }
    function reloadValue(){
      if(reloadInput.value === 'custom') return Math.max(0, Number(customInput.value || 0));
      return Number(reloadInput.value || 35);
    }
    function setPreset(type){
      const vals = {5:{1:5,2:25,3:125},10:{1:10,2:100,3:1000},manual:{1:10,2:100,3:1000}}[type] || {1:10,2:100,3:1000};
      calcRoot.querySelectorAll('[data-level]').forEach(inp => {
        const lvl = Number(inp.dataset.level);
        inp.value = vals[lvl] || 0;
      });
      calcRoot.querySelectorAll('[data-preset]').forEach(btn => btn.classList.toggle('active', btn.dataset.preset === type));
      calc();
    }
    function calc(){
      const maxLevel = rankMax[rankInput.value] || 3;
      const reload = reloadValue();
      let totalUsers = 0, totalReload = 0, totalCommission = 0;
      const rows = [];
      calcRoot.querySelectorAll('[data-level]').forEach(inp => {
        const lvl = Number(inp.dataset.level);
        const users = Math.max(0, Number(inp.value || 0));
        const card = inp.closest('.level-card');
        const unlocked = lvl <= maxLevel;
        card.classList.toggle('unlocked', unlocked);
        card.classList.toggle('locked', !unlocked);
        totalUsers += users;
        totalReload += users * reload;
        const commission = unlocked ? users * reload * rates[lvl] : 0;
        totalCommission += commission;
        if(users || lvl <= 3) rows.push({lvl,users,rate:rates[lvl],commission,unlocked});
      });
      resultUsers.textContent = totalUsers.toLocaleString('en-MY');
      resultReload.textContent = money(totalReload);
      resultCommission.textContent = money(totalCommission);
      const ambPct = Math.min(100, totalCommission / 500 * 100);
      const senPct = Math.min(100, totalCommission / 3500 * 100);
      ambassadorBar.style.width = pct(ambPct);
      seniorBar.style.width = pct(senPct);
      ambassadorText.textContent = pct(ambPct) + ' ke RM500';
      seniorText.textContent = pct(senPct) + ' ke RM3,500';
      breakdown.innerHTML = rows.map(r => `<div class="breakdown-row"><span>L${r.lvl} • ${r.users.toLocaleString('en-MY')} pengguna • ${(r.rate*100).toFixed(r.lvl<=3?0:1)}%</span><b>${r.unlocked ? money(r.commission) : 'Locked'}</b></div>`).join('');
    }
    buildLevels();
    calcRoot.addEventListener('input', calc);
    rankInput.addEventListener('change', calc);
    reloadInput.addEventListener('change', () => { customWrap.hidden = reloadInput.value !== 'custom'; calc(); });
    calcRoot.querySelectorAll('[data-preset]').forEach(btn => btn.addEventListener('click', () => setPreset(btn.dataset.preset)));
    setPreset('10');
  }

  const eskRoot = document.querySelector('[data-esk-calculator]');
  if(eskRoot){
    const rates = {l1:128,l2:38,l3:28};
    const inputs = ['l1','l2','l3'].reduce((acc,k)=>{acc[k]=eskRoot.querySelector(`[data-esk-${k}]`); return acc;},{});
    const outs = ['l1','l2','l3'].reduce((acc,k)=>{acc[k]=eskRoot.querySelector(`[data-esk-result-${k}]`); return acc;},{});
    const total = eskRoot.querySelector('[data-esk-total]');
    function setPreset(type){
      const vals = {conservative:{l1:3,l2:9,l3:27},10:{l1:10,l2:100,l3:1000},30:{l1:30,l2:900,l3:27000}}[type] || {l1:10,l2:100,l3:1000};
      Object.keys(inputs).forEach(k => inputs[k].value = vals[k]);
      eskRoot.querySelectorAll('[data-esk-preset]').forEach(btn => btn.classList.toggle('active', btn.dataset.eskPreset === type));
      calc();
    }
    function calc(){
      let grand = 0;
      Object.keys(inputs).forEach(k => {
        const val = Math.max(0, Number(inputs[k].value || 0)) * rates[k];
        grand += val;
        outs[k].textContent = money(val);
      });
      total.textContent = money(grand);
    }
    eskRoot.addEventListener('input', calc);
    eskRoot.querySelectorAll('[data-esk-preset]').forEach(btn => btn.addEventListener('click', () => setPreset(btn.dataset.eskPreset)));
    setPreset('10');
  }
})();

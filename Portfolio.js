/* ============================================================
   Anjali Rajawat — Portfolio interactions
   Vanilla JS + GSAP (optional; the page works fully without it)
   ============================================================ */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const $ = (s, c = document) => c.querySelector(s)
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s))

  document.documentElement.classList.add('js')
  document.body.classList.add('loading')

  // ---------- Loader ----------
  const loader = $('#loader')
  const bar = $('#loaderBar')
  const loaderText = $('#loaderText')
  const loaderMsgs = ['> connecting to SQL Server…', '> loading DevExtreme grids…', '> checking approvals…', '> ready.']
  let pct = 0, msg = 0
  const tick = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18, 90)
    bar.style.width = pct + '%'
    const m = Math.min(Math.floor(pct / 30), loaderMsgs.length - 2)
    if (m !== msg) { msg = m; loaderText.textContent = loaderMsgs[m] }
  }, 120)
  let finished = false
  function finishLoading() {
    if (finished) return
    finished = true
    clearInterval(tick)
    bar.style.width = '100%'
    loaderText.textContent = loaderMsgs[loaderMsgs.length - 1]
    setTimeout(() => {
      loader.classList.add('done')
      document.body.classList.remove('loading')
      heroIntro()
    }, reduceMotion ? 0 : 350)
  }
  window.addEventListener('load', finishLoading)
  setTimeout(finishLoading, 3000) // never block the page on slow assets

  function heroIntro() {
    if (!window.gsap || reduceMotion) return
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-title .word', { yPercent: 110, duration: 1, stagger: 0.1 })
      .from('.hero-anim', { y: 26, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.65')
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('#year').textContent = new Date().getFullYear()

    // ---------- Live IST clocks ----------
    const fmt = (opts) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour12: false, ...opts })
    const hm = fmt({ hour: '2-digit', minute: '2-digit' })
    const hms = fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const clocks = () => {
      const now = new Date()
      $('#navClock').textContent = hm.format(now)
      $('#footClock').textContent = hm.format(now)
      $('#cardClock').textContent = hms.format(now)
    }
    clocks()
    setInterval(clocks, 1000)

    // ---------- Mobile menu ----------
    const menuBtn = $('#menuBtn')
    const navLinks = $('#navLinks')
    const setMenu = (open) => {
      navLinks.classList.toggle('open', open)
      menuBtn.setAttribute('aria-expanded', open)
      menuBtn.innerHTML = open ? '<i class="bx bx-x"></i>' : '<i class="bx bx-menu"></i>'
    }
    menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')))
    $$('a', navLinks).forEach((a) => a.addEventListener('click', () => setMenu(false)))
    // Close the mobile menu on outside tap, Escape, or when resizing up to desktop
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !e.target.closest('#navLinks, #menuBtn')) setMenu(false)
    })
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false) })
    window.matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches) setMenu(false) })

    // ---------- Keyboard shortcut: C → contact ----------
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'c' || e.key === 'C') {
        $('#contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      }
    })

    // ---------- Scroll: navbar, progress, scroll-spy ----------
    const navbar = $('#navbar')
    const progress = $('#scrollProgress')
    const sections = $$('main section[id]')
    const links = $$('.nav-links a')
    let ticking = false
    function onScroll() {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      navbar.classList.toggle('scrolled', y > 30)
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`
      let current = ''
      sections.forEach((s) => { if (y >= s.offsetTop - 160) current = s.id })
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + current))
      ticking = false
    }
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true } }, { passive: true })
    onScroll()

    // ---------- Typing ----------
    const phrases = ['building approval workflows', 'writing T-SQL that scales', 'designing DevExtreme grids', 'making flows reusable']
    const typingEl = $('#typing')
    if (!reduceMotion) {
      let p = 0, i = phrases[0].length, deleting = true
      const type = () => {
        const word = phrases[p]
        typingEl.textContent = word.slice(0, i)
        let delay = deleting ? 35 : 75
        if (!deleting && i === word.length) { deleting = true; delay = 1900 }
        else if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 300 }
        else i += deleting ? -1 : 1
        setTimeout(type, delay)
      }
      setTimeout(type, 3200)
    }

    // ---------- Pipeline highlight cycle ----------
    const pipeSteps = $$('.pipe-step')
    let pipeI = 0
    const lightPipe = () => {
      pipeSteps.forEach((s, idx) => s.classList.toggle('on', idx === pipeI))
      pipeI = (pipeI + 1) % pipeSteps.length
    }
    lightPipe()
    if (!reduceMotion) setInterval(lightPipe, 1100)

    // ---------- Reveal on scroll ----------
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target
        const siblings = $$('.reveal', el.parentElement)
        el.style.transitionDelay = Math.min(Math.max(siblings.indexOf(el), 0), 5) * 80 + 'ms'
        el.classList.add('in')
        if (el.classList.contains('phase-bar')) el.classList.add('lit')
        revealIO.unobserve(el)
        setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.transitionDelay = '' }, 1400)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    $$('.reveal').forEach((el) => revealIO.observe(el))

    // ---------- Counters ----------
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target
        const to = parseFloat(el.dataset.to)
        const dec = parseInt(el.dataset.dec || '0', 10)
        const dur = reduceMotion ? 1 : 1600
        const start = performance.now()
        const step = (now) => {
          const t = Math.min((now - start) / dur, 1)
          el.textContent = (to * (1 - Math.pow(1 - t, 3))).toFixed(dec)
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        countIO.unobserve(el)
      })
    }, { threshold: 0.5 })
    $$('.count').forEach((el) => countIO.observe(el))

    // ---------- Case study: item-request lifecycle ----------
    const stages = [
      {
        t: 'Pick a product group', d: 'The user starts a new item request by choosing the product group.',
        v: `<div class="m-title"><i class="bx bx-plus-circle"></i> New Item Request</div>
          <div class="m-field"><label>product_group</label><div class="m-input focus">Select a group… <i class="bx bx-chevron-down"></i></div>
          <div class="m-options"><div>Group A</div><div class="sel">Group B</div><div>Group C</div><div>Spare parts</div></div></div>`,
      },
      {
        t: 'Form renders from metadata', d: 'The configuration engine reads the group\'s metadata and builds the right fields and validations. No hard-coded screen.',
        v: `<div class="m-grid2"><div><div class="m-field"><label>metadata (Group B)</label>
          <div class="m-code">{ <span class="s">"fields"</span>: [
    <span class="s">"Name"</span>, <span class="s">"Size"</span>,
    <span class="s">"Unit"</span>, <span class="s">"HSN"</span> ],
  <span class="s">"required"</span>: [<span class="s">"Name"</span>, <span class="s">"HSN"</span>],
  <span class="s">"nameTemplate"</span>:
    <span class="s">"{Name} {Size}"</span> }</div></div></div>
          <div><div class="m-field"><label>Name *</label><div class="m-input"></div></div>
          <div class="m-field"><label>Size</label><div class="m-input"></div></div>
          <div class="m-field"><label>Unit</label><div class="m-input">Select… <i class="bx bx-chevron-down"></i></div></div>
          <div class="m-field"><label>HSN *</label><div class="m-input"></div></div></div></div>`,
      },
      {
        t: 'Live duplicate check', d: 'As the user types, similar items already in the master are shown, so duplicates never get created.',
        v: `<div class="m-title"><i class="bx bx-search-alt"></i> Item details</div>
          <div class="m-field"><label>Name *</label><div class="m-input warn focus">Sample Item 100<span class="caret"></span></div></div>
          <div class="m-alert"><i class="bx bx-error"></i><div><b>2 similar items found</b><br>Sample Item 100 (existing) · Sample Item 110 (existing)</div></div>
          <div class="m-field" style="margin-top:12px"><label>generated_item_name</label><div class="m-input ok">Sample Item 100 · 1 Unit <span class="auto">template ✓</span></div></div>`,
      },
      {
        t: 'HSN fills in GST', d: 'Choosing the HSN code pulls the tax data from the HSN master automatically.',
        v: `<div class="m-title"><i class="bx bx-receipt"></i> Tax details</div>
          <div class="m-grid2"><div class="m-field"><label>HSN *</label><div class="m-input ok">HSN code <i class="bx bx-check"></i></div></div>
          <div class="m-field"><label>GST rate</label><div class="m-input ok">from HSN master <span class="auto">auto ✓</span></div></div></div>
          <div class="m-alert good"><i class="bx bx-check-circle"></i><div>All validations passed. Ready to save.</div></div>`,
      },
      {
        t: 'Send for approval', d: 'The saved request appears in the grid with a one-click "Send for Approval" action.',
        v: `<div class="m-title"><i class="bx bx-grid-alt"></i> My item requests</div>
          <table class="m-table"><thead><tr><th>REQ</th><th>ITEM</th><th>STATUS</th><th></th></tr></thead><tbody>
          <tr><td>#1041</td><td>Item X</td><td><span class="pill ok">Approved</span></td><td></td></tr>
          <tr class="hl"><td>#1042</td><td>Sample Item 100</td><td><span class="pill draft">Draft</span></td><td><span class="m-btn"><i class="bx bx-send"></i> Send for Approval</span></td></tr>
          </tbody></table>`,
      },
      {
        t: 'Only the right people see it', d: 'Through the UserMaster employee-allocation mapping, only the creator and their reporting HOD can see the request.',
        v: `<div class="m-title"><i class="bx bx-shield-quarter"></i> Who can see request #1042?</div>
          <div class="m-users"><div class="m-user yes"><i class="bx bx-user-check"></i>Creator<small>raised it</small></div>
          <div class="m-user yes"><i class="bx bx-user-voice"></i>Reporting HOD<small>approves it</small></div>
          <div class="m-user no"><i class="bx bx-user-x"></i>Other users<small>hidden</small></div></div>`,
      },
      {
        t: 'Approved and posted', d: 'The HOD approves it and the new item is posted to the item master, ready for purchase and production.',
        v: `<div class="m-title"><i class="bx bx-badge-check"></i> Item master</div>
          <table class="m-table"><thead><tr><th>REQ</th><th>ITEM</th><th>STATUS</th></tr></thead><tbody>
          <tr><td>#1041</td><td>Item X</td><td><span class="pill ok">Posted</span></td></tr>
          <tr class="hl"><td>#1042</td><td>Sample Item 100</td><td><span class="pill ok"><i class="bx bx-check"></i> Approved · Posted</span></td></tr>
          </tbody></table>
          <div class="m-alert good"><i class="bx bx-party"></i><div>Item created without a hard-coded screen, a duplicate, or a manual tax entry.</div></div>`,
      },
    ]
    const stageList = $('#stageList')
    const stageView = $('#stageView')
    const stageProgress = $('#stageProgress')
    const playBtn = $('#stagePlay')
    const stageCaption = $('#stageCaption')
    stageList.innerHTML = stages.map((s, i) =>
      `<li><button class="stage-btn" role="tab" data-i="${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span><b>${s.t}</b><small>${s.d}</small></span></button></li>`).join('')
    const stageBtns = $$('.stage-btn', stageList)
    const STAGE_MS = 4200
    let cur = 0, playing = !reduceMotion, startT = 0, raf = 0, inView = false
    function showStage(i) {
      cur = i
      stageBtns.forEach((b, j) => {
        b.classList.toggle('active', j === i)
        b.classList.toggle('done', j < i)
        b.setAttribute('aria-selected', j === i)
      })
      stageView.innerHTML = `<div class="mock-in">${stages[i].v}</div>`
      stageCaption.textContent = `${i + 1}/${stages.length} · ${stages[i].d}`
      // On phones the stage list is a horizontal scroller: keep the active stage in view (without moving the page)
      if (stageList.scrollWidth > stageList.clientWidth) {
        const b = stageBtns[i].parentElement
        stageList.scrollTo({ left: b.offsetLeft - stageList.offsetLeft - 8, behavior: reduceMotion ? 'auto' : 'smooth' })
      }
      startT = performance.now()
    }
    function loopStage(now) {
      if (playing && inView) {
        const t = Math.min((now - startT) / STAGE_MS, 1)
        stageProgress.style.width = t * 100 + '%'
        if (t >= 1) showStage((cur + 1) % stages.length)
      } else {
        startT = now - (parseFloat(stageProgress.style.width) || 0) / 100 * STAGE_MS
      }
      raf = requestAnimationFrame(loopStage)
    }
    const setPlaying = (p) => {
      playing = p
      playBtn.innerHTML = p ? '<i class="bx bx-pause"></i>' : '<i class="bx bx-play"></i>'
      playBtn.setAttribute('aria-label', p ? 'Pause demo' : 'Play demo')
    }
    stageBtns.forEach((b) => b.addEventListener('click', () => {
      showStage(+b.dataset.i)
      stageProgress.style.width = '0%'
      setPlaying(false)
    }))
    playBtn.addEventListener('click', () => setPlaying(!playing))
    new IntersectionObserver(([e]) => { inView = e.isIntersecting }, { threshold: 0.3 }).observe($('.demo'))
    setPlaying(playing)
    showStage(0)
    raf = requestAnimationFrame(loopStage)

    // ---------- Before / After ----------
    const baStage = $('.ba-stage')
    $$('.ba-toggle button').forEach((b) => b.addEventListener('click', () => {
      $$('.ba-toggle button').forEach((x) => x.classList.toggle('active', x === b))
      baStage.dataset.state = b.dataset.ba
    }))

    // ---------- Architecture explorer ----------
    const layers = [
      { h: 'Browser UI', p: 'The screens people use all day: grids, forms and modals.', li: ['DevExtreme dxDataGrid, dxSelectBox, dxDateBox, dxButton', 'jQuery event handling and dynamic forms', 'Dependent dropdowns (ProductionUnit → Department)', 'Bootstrap 5 responsive layouts'] },
      { h: 'AJAX', p: 'The page talks to the server without reloading.', li: ['JSON requests to web-service methods', 'Live duplicate / similar-item checks as the user types', 'Grid data loading and in-grid actions', 'Client-side validation before any call goes out'] },
      { h: 'ASMX Web Services', p: 'Business logic in VB.NET on ASP.NET (.NET Framework 4.8).', li: ['Save, approval and posting logic', 'Role-based visibility through the UserMaster mapping', 'Shared flag-driven workflow for Item and Spare', 'Clean, parameterized data flow to the database'] },
      { h: 'SQL Server', p: 'Where the data lives, and where it has to be right.', li: ['Schema design for masters and requests', 'Multi-table joins and EXISTS-based filters', 'Bulk verification across hundreds of records', 'Stored-procedure integration and query optimization'] },
    ]
    const archDetail = $('#archDetail')
    const archNodes = $$('.arch-node')
    const showLayer = (i) => {
      archNodes.forEach((n, j) => { n.classList.toggle('active', j === i); n.setAttribute('aria-selected', j === i) })
      const L = layers[i]
      archDetail.innerHTML = `<div class="mock-in"><span class="kicker mono">layer ${i + 1} / 4</span><h3>${L.h}</h3><p>${L.p}</p></div>
        <ul class="mock-in">${L.li.map((x) => `<li>${x}</li>`).join('')}</ul>`
    }
    archNodes.forEach((n) => n.addEventListener('click', () => showLayer(+n.dataset.layer)))
    showLayer(0)

    // ---------- Stack filter ----------
    $$('.stack-tabs button').forEach((b) => b.addEventListener('click', () => {
      $$('.stack-tabs button').forEach((x) => x.classList.toggle('active', x === b))
      const c = b.dataset.cat
      $$('#stackGrid .skill-card').forEach((card) => card.classList.toggle('dim', c !== 'all' && card.dataset.cat !== c))
    }))

    // ---------- Pointer-only effects ----------
    if (finePointer && !reduceMotion) {
      const dot = $('#cursorDot'), ring = $('#cursorRing')
      let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my
      window.addEventListener('pointermove', (e) => {
        document.body.classList.add('has-cursor')
        mx = e.clientX; my = e.clientY
        dot.style.transform = `translate(${mx}px, ${my}px)`
      })
      const loop = () => {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18
        ring.style.transform = `translate(${rx}px, ${ry}px)`
        requestAnimationFrame(loop)
      }
      loop()
      document.addEventListener('pointerover', (e) => { if (e.target.closest('a, button, .tilt, summary')) ring.classList.add('hover') })
      document.addEventListener('pointerout', (e) => { if (e.target.closest('a, button, .tilt, summary')) ring.classList.remove('hover') })

      $$('.tilt').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect()
          const x = e.clientX - r.left, y = e.clientY - r.top
          card.style.setProperty('--mx', x + 'px')
          card.style.setProperty('--my', y + 'px')
          card.style.transform = `perspective(900px) rotateX(${((y / r.height) - 0.5) * -5}deg) rotateY(${((x / r.width) - 0.5) * 5}deg) translateY(-4px)`
        })
        card.addEventListener('pointerleave', () => { card.style.transform = '' })
      })

      $$('.magnetic').forEach((btn) => {
        btn.addEventListener('pointermove', (e) => {
          const r = btn.getBoundingClientRect()
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`
        })
        btn.addEventListener('pointerleave', () => { btn.style.transform = '' })
      })
    }

    // ---------- GSAP scroll effects ----------
    if (window.gsap && window.ScrollTrigger && !reduceMotion) {
      gsap.registerPlugin(ScrollTrigger)
      gsap.fromTo('#tlFill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 70%', end: 'bottom 60%', scrub: true } })
      gsap.to('.b1', { yPercent: 40, ease: 'none', scrollTrigger: { scrub: true, start: 0, end: 'max' } })
      gsap.to('.b2', { yPercent: -30, ease: 'none', scrollTrigger: { scrub: true, start: 0, end: 'max' } })
      gsap.to('.id-card', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } })
    }

    // ---------- Certificate lightbox ----------
    const lightbox = $('#lightbox')
    const certOpen = $('#certOpen')
    const lbClose = $('#lbClose')
    const closeLb = () => { lightbox.hidden = true; document.body.style.overflow = ''; certOpen.focus() }
    certOpen.addEventListener('click', () => { lightbox.hidden = false; document.body.style.overflow = 'hidden'; lbClose.focus() })
    lbClose.addEventListener('click', closeLb)
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb() })
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLb() })

    // ---------- Contact form → mail client ----------
    const form = $('#contactForm')
    const note = $('#formNote')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      let ok = true
      ;['name', 'email', 'message'].forEach((n) => {
        const input = form.elements[n]
        const v = input.value.trim()
        const valid = v && (n !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        input.parentElement.classList.toggle('invalid', !valid)
        if (!valid) ok = false
      })
      if (!ok) { note.textContent = 'Please fill in your name, a valid email and a message.'; return }
      const f = form.elements
      const subject = encodeURIComponent('Portfolio enquiry from ' + f.name.value.trim())
      const body = encodeURIComponent(`Name: ${f.name.value.trim()}\nEmail: ${f.email.value.trim()}\nCompany: ${f.company.value.trim()}\n\n${f.message.value.trim()}`)
      window.location.href = `mailto:anjalirajawat712@gmail.com?subject=${subject}&body=${body}`
      note.textContent = 'Opening your email app…'
    })
  })
})()

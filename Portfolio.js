/* ============================================================
   Anjali Rajawat — Portfolio interactions
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById('menuBtn')
  const navLinks = document.getElementById('navLinks')
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'))
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => navLinks.classList.remove('open')),
  )

  // ---------- Navbar shrink + to-top ----------
  const navbar = document.getElementById('navbar')
  const toTop = document.getElementById('toTop')
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30)
    toTop.classList.toggle('show', window.scrollY > 500)
  })

  // ---------- Typing effect ----------
  const roles = ['.NET Full-Stack Developer', 'ASP.NET Web Forms Developer', 'SQL Server Developer', 'ERP Web Developer']
  const typingEl = document.getElementById('typing')
  let r = 0, i = 0, deleting = false
  function type() {
    const word = roles[r]
    typingEl.textContent = word.slice(0, i)
    if (!deleting && i < word.length) {
      i++
    } else if (deleting && i > 0) {
      i--
    } else {
      if (!deleting) { deleting = true; setTimeout(type, 1400); return }
      deleting = false
      r = (r + 1) % roles.length
    }
    setTimeout(type, deleting ? 55 : 110)
  }
  type()

  // ---------- Project filter ----------
  const filterBtns = document.querySelectorAll('.filters button')
  const cards = document.querySelectorAll('.pcard')
  filterBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      const f = btn.dataset.filter
      cards.forEach((c) => {
        const show = f === 'all' || c.dataset.cat === f
        c.classList.toggle('hide', !show)
      })
    }),
  )

  // ---------- Scroll-spy (active nav link) ----------
  const sections = document.querySelectorAll('section[id]')
  const links = document.querySelectorAll('.nav-links a')
  window.addEventListener('scroll', () => {
    let current = ''
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id
    })
    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + current))
  })

  // ---------- Reveal on scroll + animate skill bars ----------
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          e.target.querySelectorAll('.bar > span').forEach((b) => (b.style.width = b.dataset.w))
          io.unobserve(e.target)
        }
      })
    },
    { threshold: 0.15 },
  )
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

  // ---------- Contact form -> email ----------
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault()
    const f = this
    const body = encodeURIComponent(
      `Name: ${f.name.value}\nEmail: ${f.email.value}\nPhone: ${f.phone.value}\nAddress: ${f.address.value}\n\n${f.message.value}`,
    )
    const subject = encodeURIComponent('Portfolio enquiry from ' + f.name.value)
    window.location.href = `mailto:anjalirajawat712@gmail.com?subject=${subject}&body=${body}`
  })
})

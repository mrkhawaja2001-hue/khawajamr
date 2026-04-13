import { useState, useEffect, useRef, Fragment } from "react";
import emailjs from "@emailjs/browser";
import { data } from "./data/portfolio";
import { emailjsConfig, isEmailJsConfigured } from "./config/emailjs";

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    const word = words[idx];
    const speed = deleting ? 45 : 85;
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, char + 1));
        if (char + 1 === word.length) setTimeout(() => setDeleting(true), 2000);
        else setChar(char + 1);
      } else {
        setText(word.slice(0, char - 1));
        if (char - 1 === 0) { setDeleting(false); setIdx((idx + 1) % words.length); setChar(0); }
        else setChar(char - 1);
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [char, deleting, idx, words]);
  return <span className="typer">{text}<span className="cursor">|</span></span>;
}

function SignLogo({ size = 48 }) {
  return (
    <img
      src="/sign.png"
      alt="Khawaja MR"
      style={{
        height: size,
        width: "auto",
        filter: "brightness(0) saturate(100%) invert(40%) sepia(90%) saturate(500%) hue-rotate(340deg) brightness(95%)",
        objectFit: "contain",
        cursor: "pointer",
      }}
    />
  );
}

function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229,72,29,${d.alpha})`; ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x; const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(229,72,29,${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} className="particles-canvas" />;
}

function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const move = e => { if (ref.current) { ref.current.style.left = e.clientX + "px"; ref.current.style.top = e.clientY + "px"; } };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} className="cursor-glow" />;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["About", "Skills", "Experience", "Projects", "Education", "Contact"];
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = id => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar__logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <SignLogo size={scrolled ? 36 : 44} />
      </div>
      <div className={`navbar__links ${menuOpen ? "open" : ""}`}>
        {links.map(l => <button key={l} className="navbar__link" onClick={() => go(l)}>{l}</button>)}
        <a href="mailto:khawaja.mr@hotmail.com" className="navbar__cta"><span className="dot-live" />Hire Me</a>
      </div>
      <button className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>
    </nav>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);
  return (
    <section className="hero" id="hero">
      <Particles />
      <CursorGlow />
      <div className="hero__bg-word" aria-hidden>MEDIA</div>
      <div className={`hero__inner ${loaded ? "loaded" : ""}`}>
        {/* LEFT */}
        <div className="hero__left">
          <div className="hero__badge"><span className="dot-live" />Available for Projects</div>
          <h1 className="hero__name">
            <span className="line1">Khawaja</span>
            <span className="line2">Mutti<em>-ur-</em>Rehman</span>
          </h1>
          <p className="hero__role">I'm a <Typewriter words={data.roles} /></p>
          <p className="hero__loc">◉ Rawalpindi, Pakistan</p>
          <div className="hero__btns">
            <button className="btn btn--primary" onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })}>View My Work ↓</button>
            <button className="btn btn--ghost" onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>Get In Touch</button>
          </div>
        </div>

        {/* RIGHT — photo */}
        <div className="hero__right">
          <div className="hero__photo-wrap">
            <div className="ring ring-1" /><div className="ring ring-2" /><div className="ring ring-3" />
            <div className="hero__photo-frame">
              <img src="/profile.jpg" alt="Khawaja Mutti-ur-Rehman" className="hero__photo" />
              <div className="hero__photo-shine" />
            </div>
            <div className="float-badge float-tl"><span>🎙️</span><span>Podcast Host</span></div>
            <div className="float-badge float-br"><span>🎬</span><span>3+ Yrs Exp</span></div>
            <div className="float-badge float-tr"><span>📻</span><span>FM Radio</span></div>
          </div>
        </div>
      </div>

      <div className="hero__scroll-cue">
        <div className="scroll-mouse"><div className="scroll-wheel" /></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label, start }) {
  const count = useCountUp(value, 2200, start);
  return (
    <div className="stat-card">
      <div className="stat-val">{count}<span className="stat-suffix">{suffix}</span></div>
      <div className="stat-label">{label}</div>
      <div className="stat-line" />
    </div>
  );
}
function Stats() {
  const [ref, inView] = useInView(0.3);
  return (
    <div className="stats-wrap" ref={ref}>
      {data.stats.map((s, i) => <StatCard key={i} {...s} start={inView} />)}
    </div>
  );
}

function About() {
  const [ref, inView] = useInView();
  return (
    <section className={`section about ${inView ? "vis" : ""}`} id="about" ref={ref}>
      <div className="sec-label">01 — About Me</div>
      <div className="about__grid">
        <div className="about__text">
          <h2 className="sec-title">Telling Stories That <span className="acc">Matter</span></h2>
          <p className="about__bio">{data.bio}</p>
          <div className="contact-rows">
            {[
              { icon: "✉", label: "Email", val: data.email, href: `mailto:${data.email}` },
              { icon: "📞", label: "Phone", val: data.phone },
              { icon: "📍", label: "Base", val: data.location },
            ].map((c, i) => (
              <div className="c-row" key={i}>
                <span className="c-icon">{c.icon}</span>
                <span className="c-label">{c.label}</span>
                {c.href ? <a href={c.href}>{c.val}</a> : <span>{c.val}</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="about__visual">
          <div className="about__photo-card">
            <img src="/about.webp" alt="Khawaja MR" className="about__photo" />
            <div className="about__photo-footer">
              <img src="/sign.png" alt="sig" className="about__sig" />
              <span>Media Specialist - Katana Agency</span>
            </div>
          </div>
          <div className="sw-box">
            <div className="sw-title">Software Expertise</div>
            <div className="sw-tags">
              {data.software.map((s, i) => <span key={i} className="sw-tag">{s}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [ref, inView] = useInView(0.1);
  return (
    <section className={`section skills ${inView ? "vis" : ""}`} id="skills" ref={ref}>
      <div className="sec-label">02 — Skills</div>
      <h2 className="sec-title">What I <span className="acc">Bring</span> to the Table</h2>
      <div className="skills-grid">
        {data.skills.map((s, i) => (
          <div key={i} className="sk-bar" style={{ transitionDelay: `${i * 60}ms` }}>
            <div className="sk-bar__top">
              <span className="sk-name">{s.name}</span>
              <span className="sk-pct">{s.level}%</span>
            </div>
            <div className="sk-track">
              <div className="sk-fill" style={{ width: inView ? `${s.level}%` : "0%", transitionDelay: `${i * 80}ms` }}>
                <div className="sk-glow" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  const [ref, inView] = useInView();
  return (
    <section className={`section exp ${inView ? "vis" : ""}`} id="experience" ref={ref}>
      <div className="sec-label">03 — Work Experience</div>
      <h2 className="sec-title">My <span className="acc">Journey</span></h2>
      <div className="timeline">
        {data.experience.map((e, i) => (
          <div className="tl-item" key={i} style={{ transitionDelay: `${i * 150}ms` }}>
            <div className="tl-dot"><div className="tl-dot-core" /></div>
            <div className="tl-card">
              <div className="tl-header">
                <div>
                  <h3 className="tl-role">{e.role}</h3>
                  <div className="tl-co">{e.company}</div>
                </div>
                <div className="tl-meta">
                  {e.current && <span className="live-badge"><span className="live-pulse" />Live</span>}
                  <span className="tl-period">{e.period}</span>
                </div>
              </div>
              <ul className="tl-list">
                {e.highlights.map((h, j) => <li key={j} style={{ transitionDelay: `${j * 50}ms` }}>{h}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const TC = { film: "#e5481d", podcast: "#ff7a45", event: "#c73f18", social: "#ff9066" };
const TI = { film: "🎬", podcast: "🎙️", event: "🎤", social: "📱" };
const TL = { film: "Film", podcast: "Podcast", event: "Event", social: "Social" };

function Projects() {
  const [filter, setFilter] = useState("all");
  const [ref, inView] = useInView(0.1);
  const filtered = filter === "all" ? data.projects : data.projects.filter(p => p.type === filter);
  return (
    <section className={`section proj ${inView ? "vis" : ""}`} id="projects" ref={ref}>
      <div className="sec-label">04 — Projects</div>
      <h2 className="sec-title">Production <span className="acc">Highlights</span></h2>
      <div className="filters">
        {["all", "film", "podcast", "event", "social"].map(f => (
          <button key={f} className={`f-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All Works" : `${TI[f]} ${TL[f]}`}
          </button>
        ))}
      </div>
      <div className="proj-grid">
        {filtered.map((p, i) => {
          const delay = { animationDelay: `${i * 55}ms` };
          const body = (
            <>
              <div className="proj-card__stripe" style={{ background: TC[p.type] }} />
              <div className="proj-card__ico" style={{ background: TC[p.type] + "22", color: TC[p.type] }}>{TI[p.type]}</div>
              <div className="proj-card__info">
                <div className="proj-card__name">{p.name}</div>
                <div className="proj-card__cat">{p.category}</div>
              </div>
              <div className="proj-card__arr" style={{ color: TC[p.type] }}>↗</div>
            </>
          );
          return p.url ? (
            <a
              key={`${p.name}-${i}`}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="proj-card"
              style={delay}
              aria-label={`${p.name} (opens in new tab)`}
            >
              {body}
            </a>
          ) : (
            <div key={`${p.name}-${i}`} className="proj-card" style={delay}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Education() {
  const [ref, inView] = useInView();
  return (
    <section className={`section edu ${inView ? "vis" : ""}`} id="education" ref={ref}>
      <div className="sec-label">05 — Education & Certifications</div>
      <h2 className="sec-title">Academic <span className="acc">Background</span></h2>
      <div className="edu-grid">
        <div>
          <h3 className="edu-sub">Education</h3>
          {data.education.map((e, i) => (
            <div className="edu-card" key={i} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="edu-year">{e.period}</div>
              <div className="edu-deg">{e.degree}</div>
              <div className="edu-inst">{e.institution} — {e.location}</div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="edu-sub">Certifications</h3>
          {data.certifications.map((c, i) => (
            <div className="edu-card" key={i} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="edu-year">{c.year}</div>
              <div className="edu-deg">{c.name}</div>
              <div className="edu-inst">{c.issuer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState(null);
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const send = async e => {
    e.preventDefault();
    const { name, email, message } = form;
    if (!name?.trim() || !email?.trim() || !message?.trim()) return;
    if (!isEmailJsConfigured()) {
      setSendErr("Add VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY to your .env file (see src/config/emailjs.js).");
      return;
    }
    setSending(true);
    setSendErr(null);
    try {
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          user_name: name.trim(),
          user_email: email.trim(),
          message: message.trim(),
          /* Default EmailJS / many templates use from_name — fixes “A message by ___ has been received” */
          from_name: name.trim(),
          from_email: email.trim(),
          to_email: data.email,
          reply_to: email.trim(),
        },
        { publicKey: emailjsConfig.publicKey },
      );
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      const msg = err?.text || err?.message || "Could not send. Please try again.";
      setSendErr(msg);
    } finally {
      setSending(false);
    }
  };
  return (
    <section className={`section contact ${inView ? "vis" : ""}`} id="contact" ref={ref}>
      <div className="sec-label">06 — Get In Touch</div>
      <h2 className="sec-title">Let's <span className="acc">Create</span> Together</h2>
      <div className="contact-grid">
        <div className="contact-info">
          <p className="contact-tagline">Have a project in mind? Let's craft something unforgettable.</p>
          {[
            { icon: "✉", label: "Email", val: data.email, href: `mailto:${data.email}` },
            { icon: "📞", label: "Phone", val: data.phone },
          ].map((c, i) => (
            <div className="ct-card" key={i}>
              <div className="ct-icon">{c.icon}</div>
              <div>
                <div className="ct-label">{c.label}</div>
                {c.href ? <a href={c.href}>{c.val}</a> : <span>{c.val}</span>}
              </div>
            </div>
          ))}
        </div>
        <form className="contact-form" onSubmit={send}>
          <input name="name" placeholder="Your Name" value={form.name} onChange={onChange} autoComplete="name" />
          <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={onChange} autoComplete="email" />
          <textarea name="message" placeholder="Tell me about your project..." rows={5} value={form.message} onChange={onChange} />
          {sendErr && <p className="contact-form__err" role="alert">{sendErr}</p>}
          {!isEmailJsConfigured() && (
            <p className="contact-form__hint">Email sending uses EmailJS. Copy <code>.env.example</code> to <code>.env</code> and add your template ID and public key.</p>
          )}
          <button className="btn btn--primary" style={{ width: "100%" }} type="submit" disabled={sending}>
            {sent ? "✓ Message sent!" : sending ? "Sending…" : "Send Message →"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <SignLogo size={56} />
        </div>
        <p className="footer-name">Khawaja Mutti-ur-Rehman</p>
        <p className="footer-role">Media Producer & Digital Content Specialist · Rawalpindi, Pakistan</p>
        <div className="footer-contacts">
          {data.social.map((s, i) => (
            <Fragment key={s.id}>
              {i > 0 && <span>·</span>}
              <a href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
            </Fragment>
          ))}
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Khawaja MR · All rights reserved</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RoomProvider } from "../liveblocks.config";
import { LiveList } from "@liveblocks/client";
import DrawingCanvas from "../components/DrawingCanvas";
import useIsMobile from "../hooks/useIsMobile";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function About() {
  const isMobile = useIsMobile();

  return (
    <RoomProvider
      id="portfolio-about-drawing"
      initialStorage={{ strokes: new LiveList([]) }}
    >
      <div style={{ position: "relative" }}>
        {!isMobile && <DrawingCanvas />}
        <motion.section
          style={{
            ...styles.about,
            gridTemplateColumns: isMobile ? "1fr" : "minmax(280px, 420px) 1fr",
            gap: isMobile ? 32 : 80,
          }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {/* Portrait — below canvas so you can draw over it */}
          <div style={{ ...styles.portrait, maxWidth: isMobile ? 280 : "none", margin: isMobile ? "0 auto" : "0", position: "relative", zIndex: 0 }}>
            <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
              <defs>
                <pattern id="ap" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="14" height="14" fill="#f4f4f4" />
                  <line x1="0" y1="0" x2="0" y2="14" stroke="#ececec" strokeWidth="7" />
                </pattern>
              </defs>
              <rect width="400" height="500" fill="url(#ap)" />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                fontFamily="ui-monospace, Menlo, monospace" fontSize="13" fill="#9a9a9a"
                letterSpacing="2">[ portrait ]</text>
            </svg>
          </div>

          {/* Copy — pointer events none so drawing passes through */}
          <div style={{ ...styles.copy, fontSize: isMobile ? 17 : 19, position: "relative", zIndex: 20, pointerEvents: "none" }}>
            <p style={{ ...styles.lede, fontSize: isMobile ? 20 : 24 }}>
              Designer and engineer building cool things and creative solutions.
            </p>
            <p>Based in Sydney, AU. Computer Science graduate from UNSW. I build websites and apps, mostly things I find genuinely interesting.</p>

            <dl style={styles.meta}>
              <dt style={styles.dt}>Based</dt><dd style={styles.dd}>Sydney, AU</dd>
              <dt style={styles.dt}>Status</dt><dd style={styles.dd}>Independent &middot; Open to work</dd>
              <dt style={styles.dt}>Tools</dt><dd style={styles.dd}>Anything is possible.</dd>
            </dl>

            {/* Contact prompt — re-enable pointer events just for links */}
            <div style={{ ...styles.contactRow, pointerEvents: "auto" }}>
              <Link to="/contact" style={styles.contactLink}>
                Want to build something cool? Get in touch&nbsp;&rarr;
              </Link>
              <div style={styles.socials}>
                <a href="mailto:lachlonfelizardo@gmail.com" style={styles.socialIcon} title="Email">
                  <MailIcon />
                </a>
                <a href="https://instagram.com/lachlonfelz" target="_blank" rel="noopener" style={styles.socialIcon} title="Instagram">
                  <InstagramIcon />
                </a>
                <a href="https://x.com/lachlonf" target="_blank" rel="noopener" style={styles.socialIcon} title="X / Twitter">
                  <XIcon />
                </a>
                <a href="https://github.com/lachlonf" target="_blank" rel="noopener" style={styles.socialIcon} title="GitHub">
                  <GitHubIcon />
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* blank drawing zone — desktop only */}
        {!isMobile && (
          <motion.div
            style={styles.drawZone}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <p style={styles.drawPrompt}>draw anything! (desktop only)</p>
          </motion.div>
        )}
      </div>
    </RoomProvider>
  );
}

const styles = {
  about: {
    display: "grid",
    alignItems: "start",
  },
  portrait: {
    width: "100%",
    aspectRatio: "4 / 5",
    background: "#f4f4f4",
  },
  copy: {
    lineHeight: 1.55,
    maxWidth: "56ch",
  },
  lede: {
    lineHeight: 1.4,
    marginBottom: "1.2em",
    marginTop: 0,
    fontWeight: 500,
  },
  meta: {
    marginTop: 28,
    marginBottom: 36,
    fontSize: 13,
    color: "var(--ink-soft)",
    display: "grid",
    gridTemplateColumns: "100px 1fr",
    rowGap: 8,
    columnGap: 24,
    maxWidth: 480,
  },
  dt: { color: "var(--ink-soft)" },
  dd: { margin: 0, color: "var(--ink)" },
  drawZone: {
    marginTop: 80,
    height: "100vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 48,
    pointerEvents: "none",
  },
  drawPrompt: {
    margin: 0,
    fontSize: 13,
    letterSpacing: "0.15em",
    color: "var(--ink-soft)",
    userSelect: "none",
  },
  contactRow: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  contactLink: {
    fontSize: 15,
    color: "var(--ink)",
    textDecoration: "underline",
    textUnderlineOffset: 4,
    fontWeight: 500,
  },
  socials: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  socialIcon: {
    color: "var(--ink-soft)",
    display: "flex",
    alignItems: "center",
    transition: "color 120ms",
  },
};

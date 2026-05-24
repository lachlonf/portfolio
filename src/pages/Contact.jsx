import { motion } from "framer-motion";
import useIsMobile from "../hooks/useIsMobile";

const links = [
  { label: "Email",      href: "mailto:lachlonfelizardo@gmail.com",   text: "lachlonfelizardo@gmail.com" },
  { label: "Instagram",  href: "https://instagram.com/lachlonfelz",   text: "@lachlonfelz" },
  { label: "Twitter / X",href: "https://x.com/lachlonf",              text: "@lachlonf" },
  { label: "GitHub",     href: "https://github.com/lachlonf",         text: "github.com/lachlonf" },
];

export default function Contact() {
  const isMobile = useIsMobile();
  return (
    <motion.section
      style={styles.contact}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <p style={styles.intro}>Got something to build, break, or just say hi? My inbox is open.</p>
      <ul style={styles.list}>
        {links.map((l) => (
          <li key={l.label} style={{ ...styles.item, gridTemplateColumns: isMobile ? "80px 1fr auto" : "140px 1fr auto", gap: isMobile ? 12 : 24 }}>
            <span style={styles.k}>{l.label}</span>
            <a href={l.href} style={styles.v} target={l.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener">
              {l.text}
            </a>
            <span style={styles.arrow}>&rarr;</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

const styles = {
  contact: { maxWidth: 720, fontSize: "1.1875rem", lineHeight: 1.55 },
  intro: { fontSize: "1.625rem", lineHeight: 1.35, margin: "0 0 48px", maxWidth: "24ch" },
  list: { listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid var(--rule)" },
  item: {
    display: "grid",
    gridTemplateColumns: "140px 1fr auto",
    padding: "18px 0",
    borderBottom: "1px solid var(--rule)",
    alignItems: "baseline",
    gap: 24,
  },
  k: { fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" },
  v: { fontSize: "1.125rem", color: "var(--ink)", transition: "color 120ms" },
  arrow: { fontSize: "1rem", color: "var(--ink-soft)" },
};

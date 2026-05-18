import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useIsMobile from "../hooks/useIsMobile";

const palette = ["#efe7dd", "#e6ebe4", "#e9e6f0"];

const projects = [
  { title: "Dontfoulshai", year: "2026", desc: "Can you guard the two-time MVP without fouling?", url: "", comingSoon: false },
  { title: "ELEVTE",       year: "2026", desc: "",    url: "",  comingSoon: true  },
  { title: "???",          year: "2026", desc: "",    url: "",  comingSoon: true  },
];

function PlaceholderThumb({ i, comingSoon }) {
  const bg = palette[i % palette.length];
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <pattern id={`p${i}`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="22" height="22" fill={bg} />
          <line x1="0" y1="0" x2="0" y2="22" stroke="rgba(0,0,0,0.04)" strokeWidth="11" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill={`url(#p${i})`} />
      {comingSoon && (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          fontFamily="ui-monospace, Menlo, monospace" fontSize="14" fill="rgba(0,0,0,0.3)"
          letterSpacing="4">COMING SOON</text>
      )}
    </svg>
  );
}

export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(null);
  const isMobile = useIsMobile();

  const open = (i) => setActiveIdx(i);
  const close = () => setActiveIdx(null);

  return (
    <>
      <motion.section
        style={{ ...styles.grid, gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "32px 0" : "48px 40px" }}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        {projects.map((p, i) => (
          <div
            key={p.title}
            style={{ ...styles.project, opacity: activeIdx === i ? 0 : 1 }}
            onClick={() => open(i)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open(i)}
            role="button"
            tabIndex={0}
          >
            <div style={styles.thumb}>
              <PlaceholderThumb i={i} comingSoon={p.comingSoon} />
            </div>
            <div style={styles.label}>
              <span style={styles.title}>{p.title}</span>
              <span style={styles.year}>{p.year}</span>
            </div>
            {(p.desc || p.comingSoon) && (
              <div style={styles.desc}>{p.desc || "Coming soon"}</div>
            )}
          </div>
        ))}
      </motion.section>

      <AnimatePresence>
        {activeIdx !== null && (
          <Viewer
            project={projects[activeIdx]}
            idx={activeIdx}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Viewer({ project, onClose }) {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (header) {
      header.style.opacity = "0";
      header.style.pointerEvents = "none";
    }
    return () => {
      if (header) {
        header.style.opacity = "";
        header.style.pointerEvents = "";
      }
    };
  }, []);

  return (
    <>
      <motion.div
        style={styles.scrim}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.26 }}
        onClick={onClose}
      />
      <motion.div
        style={styles.stage}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.26, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div style={styles.stageHead}>
          <span style={styles.vTitle}>{project.title}</span>
          <button onClick={onClose} style={styles.vClose}>Close ×</button>
        </div>
        <div style={styles.frameWrap}>
          {project.comingSoon || !project.url ? (
            <div style={styles.comingSoon}>
              <span style={styles.comingSoonLabel}>Coming soon</span>
            </div>
          ) : (
            <iframe
              title={project.title}
              src={project.url}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              style={styles.iframe}
            />
          )}
        </div>
      </motion.div>
    </>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "48px 40px",
    maxWidth: 1600,
  },
  project: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    cursor: "pointer",
    transition: "opacity 200ms ease",
  },
  thumb: {
    width: "100%",
    aspectRatio: "4 / 3",
    background: "#f4f4f4",
    overflow: "hidden",
    transition: "transform 200ms ease",
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    fontSize: 14,
  },
  title: { color: "var(--ink)" },
  year: { color: "var(--ink-soft)", fontVariantNumeric: "tabular-nums" },
  desc: { fontSize: 13, color: "var(--ink-soft)", maxWidth: "38ch", lineHeight: 1.5 },

  scrim: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "rgba(255,255,255,0.86)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },
  stage: {
    position: "fixed",
    inset: 0,
    zIndex: 101,
    display: "grid",
    gridTemplateRows: "auto 1fr",
    padding: "24px 40px 40px",
    pointerEvents: "none",
  },
  stageHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "8px 0 16px",
    fontSize: 14,
    pointerEvents: "auto",
  },
  vTitle: { fontSize: 18, color: "var(--ink)" },
  vClose: {
    background: "none",
    border: "none",
    padding: "6px 10px",
    fontSize: 13,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  frameWrap: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    background: "#fafafa",
    pointerEvents: "auto",
  },
  comingSoon: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
  },
  comingSoonLabel: {
    fontFamily: "ui-monospace, Menlo, monospace",
    fontSize: 13,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--ink-soft)",
  },
  iframe: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: 0,
    background: "#fff",
    display: "block",
  },
};

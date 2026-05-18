import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

export default function SiteHeader() {
  const nameRef = useRef(null);
  const barRef = useRef(null);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    function fitName() {
      const bar = barRef.current;
      const name = nameRef.current;
      if (!bar || !name) return;
      const style = getComputedStyle(bar);
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const available = bar.clientWidth - padding;
      name.style.fontSize = "200px";
      const ratio = available / name.scrollWidth;
      name.style.fontSize = Math.floor(200 * ratio) + "px";
    }
    fitName();
    window.addEventListener("resize", fitName);
    return () => window.removeEventListener("resize", fitName);
  }, []);

  return (
    <header style={styles.header} className="site-header">
      <div ref={barRef} style={{ ...styles.nameBar, padding: isMobile ? "12px 16px 4px" : "18px 40px 6px" }}>
        <h1 ref={nameRef} style={styles.name}>LACHLON FELIZARDO</h1>
      </div>
      <nav style={{ ...styles.tabs, padding: isMobile ? "10px 16px 16px" : "14px 40px 22px", gap: isMobile ? 24 : 40 }}>
        {["about", "projects", "contact"].map((tab) => (
          <NavLink
            key={tab}
            to={`/${tab}`}
            style={({ isActive }) => ({
              ...styles.tab,
              color: isActive ? "var(--ink)" : "var(--ink-soft)",
            })}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {location.pathname === `/${tab}` && <span style={styles.tabUnderline} />}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "transparent",
    transition: "opacity 220ms ease",
  },
  nameBar: {
    padding: "18px 40px 6px",
  },
  name: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 900,
    fontStretch: "condensed",
    fontSize: "200px",
    lineHeight: 0.86,
    letterSpacing: "-0.045em",
    margin: 0,
    color: "var(--ink)",
    whiteSpace: "nowrap",
    userSelect: "none",
  },
  tabs: {
    display: "flex",
    gap: 40,
    padding: "14px 40px 22px",
    fontSize: 15,
    letterSpacing: "0.02em",
  },
  tab: {
    cursor: "pointer",
    transition: "color 120ms ease",
    padding: "4px 0",
    position: "relative",
    textDecoration: "none",
  },
  tabUnderline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -2,
    height: 1,
    background: "var(--ink)",
    display: "block",
  },
};

import { Navigate, Route, Routes } from "react-router-dom";
import SiteHeader from "./components/SiteHeader";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import useIsMobile from "./hooks/useIsMobile";

export default function App() {
  const isMobile = useIsMobile();
  return (
    <>
      <SiteHeader />
      <main style={{ ...styles.main, padding: isMobile ? "24px 16px 100px" : "40px 40px 120px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/about" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </>
  );
}

const styles = {
  main: {
    padding: "40px 40px 120px",
    minHeight: "80vh",
    position: "relative",
  },
};

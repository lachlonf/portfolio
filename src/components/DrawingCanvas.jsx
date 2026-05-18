import { useEffect, useRef, useState, useCallback } from "react";
import { useStorage, useMutation, useOthers } from "../liveblocks.config";

const COLORS = ["#111111", "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"];
const BRUSH_SIZES = [2, 4, 8, 16];
const ERASER = "ERASER";

function PencilIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "var(--ink)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function EraserIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "var(--ink-soft)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20H7L3 16l10-10 7 7-2.5 2.5" />
      <path d="M6.0001 17.0001 10 13" />
    </svg>
  );
}

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const currentStroke = useRef({ points: [], color: "#111", size: 4, eraser: false });

  const [drawMode, setDrawMode] = useState(false);
  const [color, setColor] = useState("#111111");
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState("pen"); // "pen" | "eraser"

  const strokes = useStorage((root) => root.strokes);
  const others = useOthers();

  const addStroke = useMutation(({ storage }, stroke) => {
    storage.get("strokes").push(stroke);
  }, []);

  const clearCanvas = useMutation(({ storage }) => {
    storage.get("strokes").clear();
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !strokes) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (const stroke of strokes) {
      if (!stroke.points || stroke.points.length < 2) continue;
      ctx.save();
      ctx.beginPath();
      if (stroke.eraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = stroke.size * 4;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(stroke.points[0].x * w, stroke.points[0].y * h);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x * w, stroke.points[i].y * h);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [strokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function updateSize() {
      const w = canvas.offsetWidth;
      const h = canvas.parentElement
        ? Math.max(canvas.parentElement.scrollHeight, window.innerHeight)
        : window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      redraw();
    }
    const observer = new ResizeObserver(updateSize);
    observer.observe(canvas.parentElement || document.body);
    updateSize();
    return () => observer.disconnect();
  }, [redraw]);

  useEffect(() => { redraw(); }, [redraw]);

  // Non-passive touchmove so preventDefault() actually stops page scroll while drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e) => { if (drawMode) e.preventDefault(); };
    canvas.addEventListener("touchmove", handler, { passive: false });
    return () => canvas.removeEventListener("touchmove", handler);
  }, [drawMode]);

  // Esc exits draw mode; Shift+Alt+C clears (admin only)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setDrawMode(false);
      if (e.shiftKey && e.altKey && e.key === "C") clearCanvas();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [clearCanvas]);

  // Normalise to 0–1 so strokes align across screen sizes
  const getNormPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) / canvas.width,
      y: (src.clientY - rect.top) / canvas.height,
    };
  };

  const toPx = (pt, canvas) => ({ x: pt.x * canvas.width, y: pt.y * canvas.height });

  const isEraser = tool === "eraser";

  const startDraw = useCallback((e) => {
    if (!drawMode) return;
    isDrawing.current = true;
    const pos = getNormPos(e);
    lastPoint.current = pos;
    currentStroke.current = { points: [pos], color, size: brushSize, eraser: isEraser };
  }, [drawMode, color, brushSize, isEraser]);

  const draw = useCallback((e) => {
    if (!isDrawing.current || !drawMode) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getNormPos(e);
    const last = toPx(lastPoint.current, canvas);
    const cur  = toPx(pos, canvas);
    ctx.save();
    ctx.beginPath();
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = brushSize * 4;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(cur.x, cur.y);
    ctx.stroke();
    ctx.restore();
    currentStroke.current.points.push(pos);
    lastPoint.current = pos;
  }, [drawMode, color, brushSize, isEraser]);

  const endDraw = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentStroke.current.points.length > 1) {
      addStroke(currentStroke.current);
    }
    currentStroke.current = { points: [], color, size: brushSize, eraser: isEraser };
  }, [addStroke, color, brushSize, isEraser]);

  const liveCount = others.length + 1;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 10,
          cursor: drawMode ? (isEraser ? "cell" : "crosshair") : "default",
          pointerEvents: drawMode ? "auto" : "none",
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />

      <div style={styles.floater}>
        {drawMode && (
          <div style={styles.toolbar}>
            {/* Colors — only shown in pen mode */}
            {!isEraser && (
              <div style={styles.row}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      ...styles.swatch,
                      background: c,
                      outline: color === c ? "2px solid #111" : "2px solid transparent",
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            )}
            <div style={styles.row}>
              {BRUSH_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setBrushSize(s)}
                  style={{
                    ...styles.sizeBtn,
                    fontWeight: brushSize === s ? 700 : 400,
                    color: brushSize === s ? "var(--ink)" : "var(--ink-soft)",
                  }}
                >
                  {s}px
                </button>
              ))}
            </div>
            {/* Pen / Eraser toggle */}
            <div style={styles.row}>
              <button
                onClick={() => setTool("pen")}
                style={{ ...styles.toolBtn, background: !isEraser ? "var(--ink)" : "transparent", color: !isEraser ? "#fff" : "var(--ink-soft)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Pen
              </button>
              <button
                onClick={() => setTool("eraser")}
                style={{ ...styles.toolBtn, background: isEraser ? "var(--ink)" : "transparent", color: isEraser ? "#fff" : "var(--ink-soft)" }}
              >
                <EraserIcon active={isEraser} />
                Erase
              </button>
            </div>
          </div>
        )}

        <div style={styles.bottomRow}>
          <span style={styles.liveCount}>
            <span style={styles.dot} />
            {liveCount}
          </span>
          <button
            onClick={() => setDrawMode((m) => !m)}
            title={drawMode ? "Exit draw mode (Esc)" : "Draw on this page"}
            style={{
              ...styles.pencilBtn,
              background: drawMode ? "var(--ink)" : "#fff",
              color: drawMode ? "#fff" : "var(--ink)",
            }}
          >
            <PencilIcon active={drawMode} />
            <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}>
              {drawMode ? "Done" : "Draw"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  floater: {
    position: "fixed",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    pointerEvents: "none",
  },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    pointerEvents: "auto",
  },
  liveCount: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(6px)",
    border: "1px solid var(--rule)",
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 12,
    color: "var(--ink-soft)",
    userSelect: "none",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
  },
  pencilBtn: {
    height: 40,
    borderRadius: 999,
    border: "1px solid var(--rule)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    cursor: "pointer",
    transition: "background 150ms, color 150ms",
    padding: "0 16px",
  },
  toolbar: {
    background: "#fff",
    border: "1px solid var(--rule)",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    pointerEvents: "auto",
  },
  row: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    padding: 0,
    flexShrink: 0,
  },
  sizeBtn: {
    background: "none",
    border: "none",
    padding: "2px 6px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  toolBtn: {
    border: "1px solid var(--rule)",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 5,
    transition: "background 120ms, color 120ms",
  },
};

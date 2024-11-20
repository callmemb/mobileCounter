import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useCallback, useRef, useState } from "react";

type CircularSliderProps = { onChange?: (value: number) => void };

export default function CircularSlider({ onChange }: CircularSliderProps) {
  const [value, setValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const startSpyingOnMovement = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const handlePointerMove = (em: PointerEvent) => {
      em.preventDefault();
      em.stopPropagation();
      if (containerRef.current && anchorRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const angle = Math.atan2(em.clientY - center.y, em.clientX - center.x);
        const degrees = (angle * 180) / Math.PI;
        const value = Math.round(degrees + 180);
        setValue(value);
      }
    };
    const stopSpyingOnMovement = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopSpyingOnMovement);
      setValue(150);
      setIsDragging(false);
      if (onChange) {
        onChange(value);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopSpyingOnMovement);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopSpyingOnMovement);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "grid",
        placeItems: "center",
        position: "relative",
        borderRadius: "50%",
        borderColor: "primary.main",
        borderStyle: "solid",
        borderWidth: 1,
        width: "100%",
        aspectRatio: 1,
        touchAction: "none",
        background: `conic-gradient(from -90deg at 50% 50%, #f00 0%, #f00 var(--deg), transparent var(--deg))`,
        transition: `--deg ${isDragging ? "0s" : "0.5s"}`,
        "--deg": `${value}deg`,
      }}
      >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          position: "relative",
          borderRadius: "50%",
          borderColor: "primary.main",
          borderStyle: "solid",
          borderWidth: 1,
          width: "80%",
          height: "80%",
          aspectRatio: 1,
          touchAction: "none",
          background: `conic-gradient(from -90deg at 50% 50%, #f00 0%, #f00 var(--deg), transparent var(--deg))`,
          transition: `--deg ${isDragging ? "0s" : "0.5s"}`,
          "--deg": `${value+20}deg`,
        }}
      >
        + {value}
      </Box>
      <Box
        ref={anchorRef}
        sx={{
          position: "absolute",
          overflow: "visible",
          width: "50%",
          left: "0",
          top: "50%",
          transformOrigin: "right",
          transform: `rotate(${value}deg)`,
          height: 0,
          display: "flex",
          alignItems: "center",
          transition: `transform ${isDragging ? "0s" : "0.5s"}`,
        }}
      >
        <Box
          onPointerDown={startSpyingOnMovement}
          sx={{
            position: "absolute",
            transform: `rotate(${-value}deg) scale(${isDragging ? 1 : 1.2})`,
            transition: `transform ${isDragging ? "0s" : "0.5s"}`,
            width: "20%",
            borderRadius: "50%",
            aspectRatio: 1 / 1,
            backgroundColor: "primary.main",
            margin: 0,
            padding: 0,
            border: "none",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Add />
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Creating css property used for the rotation of the circular slider
 * Error expected on hot-reload, but should not affect the application.
 */
try {
  window.CSS.registerProperty({
    name: "--deg",
    syntax: "<angle>",
    inherits: false,
    initialValue: "0deg",
  });
} catch (error) {
  console.warn("This error should only show in developer mode:", error);
}

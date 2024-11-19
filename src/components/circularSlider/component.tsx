import React, { useRef, useState } from "react";

interface CircularSliderProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  maxValue?: number;
  minValue?: number;
}

export default function CircularSlider({
  size = 200,
  strokeWidth = 20,
  color = "#007AFF",
  maxValue = 100,
  minValue = 0,
}: CircularSliderProps) {
  const [value,setValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizeAngle = (angle: number): number => {
    // Convert to -180 to 180 range
    let normalized = angle;
    if (normalized > 180) normalized -= 360;
    
    // Clamp angle between -225 and 45 degrees
    if (normalized < -225) normalized = -225;
    if (normalized > 45) normalized = 45;
    
    return normalized;
  };

  const getAngleFromCoordinates = (x: number, y: number): number => {
    const center = size / 2;
    const deltaX = x - center;
    const deltaY = y - center;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return normalizeAngle(angle);
  };

  const angleToValue = (angle: number): number => {
    // Map -225 to 45 degree range to minValue-maxValue range
    const normalizedAngle = angle + 225; // Shift range to 0-270
    return minValue + (normalizedAngle / 270) * (maxValue - minValue);
  };

  const valueToAngle = (value: number): number => {
    // Map value to -225 to 45 degree range
    const percentage = (value - minValue) / (maxValue - minValue);
    return (percentage * 270) - 225;
  };

  const handlePointerMove = (event: React.PointerEvent | PointerEvent) => {
    if (!isDragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const angle = getAngleFromCoordinates(x, y);
    const newValue = angleToValue(angle);
    setValue(Math.round(Math.max(minValue, Math.min(maxValue, newValue))));
  };

  const currentAngle = valueToAngle(value);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  return (
    <div
      ref={containerRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: "relative",
        touchAction: "none",
      }}
      onPointerDown={() => setIsDragging(true)}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
    >
      <svg width={size} height={size}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${2 * Math.PI * radius * 0.75}`}
          strokeDashoffset={`${2 * Math.PI * radius * 0.25}`}
          transform={`rotate(-225 ${center} ${center})`}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${2 * Math.PI * radius * 0.75}`}
          strokeDashoffset={`${2 * Math.PI * radius * (0.75 - (currentAngle + 225) / 360)}`}
          transform={`rotate(-225 ${center} ${center})`}
        />
      </svg>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  angleToPosition,
  positionToAngle,
  valueToAngle,
  angleToValue,
} from "./circularGeometry";
import "./style.css";

const defaultHandlerContent = <div>+</div>;

const defaultAngleType = {
  direction: "cw",
  axis: "-y",
} as const;

type CircularSliderProps = {
  size?: number;
  minValue?: number;
  startAngle?: number;
  endAngle?: number;
  angleType?: {
    direction: "cw" | "ccw";
    axis: "+x" | "-x" | "+y" | "-y";
  };
  handlerSize?: number;
  handlerContent?: React.ReactNode;
  options?: React.ReactNode[];
  isDone?: boolean;
  onSubmit: (value: number) => void;
  defaultValue?: number;
  maxValue?: number;
  stepSize?: number;
  children?: React.ReactNode;
};

/**
 * CircularSlider component allows users to select a value by rotating a handler around a circular track.
 * @param props - Properties to configure the CircularSlider.
 */
export default function CircularSlider(props: CircularSliderProps) {
  const {
    size = 200,
    minValue = 0,
    startAngle = 100,
    endAngle = 350,
    angleType = defaultAngleType,
    handlerSize = 45,
    handlerContent = defaultHandlerContent,
    options = [],

    isDone = false,
    onSubmit,
    defaultValue = 50,
    maxValue = 100,
    stepSize = 1,
    children,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const blocked = useRef(true);

  const [value, setValue] = useState(defaultValue);
  const [isMoving, setMoving] = useState(false);

  const safeStartAngle = useMemo(() => {
    return startAngle > 100 ? startAngle : 100;
  }, [startAngle]);

  const safeEndAngle = useMemo(() => {
    return endAngle < 350 ? endAngle : 350;
  }, [endAngle]);

  const optionPosition = useMemo(() => {
    const step = 90 / options.length;
    return options.map((o, i) => {
      const handle1Position = angleToPosition(
        { degree: step * i + 90 + step / 2, ...angleType },
        size / 2,
        size - handlerSize
      );
      return handle1Position;
    });
  }, [options, size]);

  useEffect(() => {
    setTimeout(() => (blocked.current = false), 200);
  }, []);

  useEffect(() => {
    if (blocked.current || isMoving) {
      return;
    }
    blocked.current = true;
    setTimeout(() => (blocked.current = false), 400);
    if (value) {
      onSubmit(value * stepSize);
    }
    setValue(defaultValue);
  }, [isMoving]);

  /**
   * Handles mouse down event to start moving the handler.
   * @param ev - Mouse event.
   */
  const onMouseDown = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      ev.preventDefault();
      setMoving(true);
      if (containerRef.current) {
        window.addEventListener("mousemove", handleMousePosition);
        window.addEventListener("mouseup", removeMouseListeners);
      }
    },
    [containerRef.current]
  );

  /**
   * Removes mouse event listeners.
   */
  const removeMouseListeners = useCallback(() => {
    setMoving(false);
    if (containerRef.current) {
      window.removeEventListener("mousemove", handleMousePosition);
      window.removeEventListener("mouseup", removeMouseListeners);
    }
  }, [containerRef.current]);

  /**
   * Handles mouse move event to update the handler position.
   * @param ev - Mouse event.
   */
  const handleMousePosition = (ev: MouseEvent) => {
    const x = ev.clientX;
    const y = ev.clientY;
    processSelection(x, y);
  };

  /**
   * Processes the selection based on the given x and y coordinates.
   * @param x - X coordinate.
   * @param y - Y coordinate.
   */
  const processSelection = useCallback((x: number, y: number) => {
    const c = containerRef.current;
    if (!c) {
      return;
    }
    // Find the coordinates with respect to the SVG
    const svgPoint = c.getBoundingClientRect();
    const point = { x: x - svgPoint.left, y: y - svgPoint.top };
    const angle = positionToAngle(point, size, angleType);
    const value = angleToValue({
      angle,
      minValue,
      maxValue,
      startAngle: safeStartAngle,
      endAngle: safeEndAngle,
    });
    setValue(Math.round(value));
  }, []);

  /**
   * Handles touch events to update the handler position.
   * @param ev - Touch event.
   */
  const onTouch = useCallback(
    (ev: React.TouchEvent<HTMLDivElement>) => {
      const touch = ev.changedTouches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      processSelection(x, y);
      if (ev.type === "touchend" || ev.type === "touchcancel") {
        setMoving(false);
      } else {
        setMoving(true);
      }
    },
    [processSelection]
  );

  const handle1Position = useMemo(() => {
    const handle1Angle = valueToAngle({
      value: value,
      minValue,
      maxValue,
      startAngle: safeStartAngle,
      endAngle: safeEndAngle,
    });

    return angleToPosition(
      { degree: handle1Angle + 90, ...angleType },
      size / 2,
      size - handlerSize
    );
  }, [value, size]);

  const globalClass = useMemo(() => {
    let ret = "circularSlider";
    if (isMoving) {
      ret = `${ret} active`;
    }
    if (isDone) {
      ret = `${ret} done`;
    }
    return ret;
  }, [isMoving, isDone]);

  return (
    <div
      ref={containerRef}
      className={globalClass}
      style={{
        height: size,
        width: size,
      }}
      role="slider"
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-valuenow={value}
      aria-label="Circular slider"
      tabIndex={0}
    >
      <div className="arc" />

      <div
        className="point"
        
        style={{
          height: handlerSize,
          width: handlerSize,
          bottom: handle1Position.x,
          left: handle1Position.y,
        }}
        onClick={(ev) => ev.stopPropagation()}
        onMouseDown={onMouseDown}
        // onMouseEnter={onMouseEnter}
        onTouchStart={onTouch}
        onTouchEnd={onTouch}
        onTouchMove={onTouch}
        onTouchCancel={onTouch}
        role="button"
        aria-label="Handler"
        tabIndex={0}
      >
        {handlerContent}
      </div>

      <div className="options">
        {options.map((btn, i) => {
          const position = optionPosition[i] || optionPosition[0];
          return (
            <span
              key={i}
              style={{
                bottom: position.x,
                left: position.y,
              }}
              role="button"
              tabIndex={0}
            >
              {btn}
            </span>
          );
        })}
      </div>

      <div className="content">
        <div className="value" aria-live="polite" aria-atomic="true" role="status">+&nbsp;{value * stepSize}</div>
        <div className="children" aria-label='label' >{children}</div>
      </div>
    </div>
  );
}

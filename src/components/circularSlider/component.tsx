import { useCallback, useMemo, useRef, useState } from "react";
import {
  angleToPosition,
  valueToAngle,
  processSelection,
} from "./circularGeometry";
import "./style.css";

const defaultHandlerContent = <div>+</div>;

type CircularSliderProps = {
  size?: number;
  minValue?: number;
  startAngle?: number;
  endAngle?: number;
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
    handlerSize = 45,

    minValue = 0,
    maxValue = 100,
    defaultValue = 50,

    startAngle = 100,
    endAngle = 350,

    handlerContent = defaultHandlerContent,
    options = [],
    onSubmit,
    isDone = false,
    stepSize = 1,
    children,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

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
      const pointePosition = angleToPosition(
        step * i + 90 + step / 2,
        size / 2,
        size - handlerSize
      );
      return pointePosition;
    });
  }, [options, size]);

  /**
   * Handles pointer events to update the handler position.
   * @param ev - Pointer event.
   */
  const handlePointerEvent = useCallback(
    (ev: React.PointerEvent<HTMLDivElement>) => {
      ev.preventDefault();
      setMoving(true);
      if (containerRef.current) {
        const handlePointerMove = (ev: PointerEvent) => {
          const value = processSelection(
            ev.clientX,
            ev.clientY,
            containerRef.current as HTMLElement,
            size,
            minValue,
            maxValue,
            safeStartAngle,
            safeEndAngle
          );
          setValue(value);
        };
        const handlePointerUp = (ev: PointerEvent) => {
          setMoving(false);
          const value = processSelection(
            ev.clientX,
            ev.clientY,
            containerRef.current as HTMLElement,
            size,
            minValue,
            maxValue,
            safeStartAngle,
            safeEndAngle
          );
          if (value) {
            onSubmit(value * stepSize);
          }
          setValue(defaultValue);
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerup", handlePointerUp);
        };

        window.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerup", handlePointerUp);
        };
      }
    },
    [
      onSubmit,
      size,
      stepSize,
      minValue,
      maxValue,
      safeStartAngle,
      safeEndAngle,
      defaultValue,
    ]
  );

  const pointePosition = useMemo(() => {
    const handle1Angle = valueToAngle({
      value: value,
      minValue,
      maxValue,
      startAngle: safeStartAngle,
      endAngle: safeEndAngle,
    });

    return angleToPosition(handle1Angle, size / 2, size - handlerSize);
  }, [
    value,
    minValue,
    maxValue,
    safeStartAngle,
    safeEndAngle,
    size,
    handlerSize,
  ]);

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
          bottom: pointePosition.x,
          left: pointePosition.y,
        }}
        onClick={(ev) => ev.stopPropagation()}
        onPointerDown={handlePointerEvent}
        role="button"
        aria-label="Handler"
        tabIndex={0}
        touch-action="none"
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
        <div
          className="value"
          aria-live="polite"
          aria-atomic="true"
          role="status"
        >
          +&nbsp;{value * stepSize}
        </div>
        <div className="children" aria-label="label">
          {children}
        </div>
      </div>
    </div>
  );
}

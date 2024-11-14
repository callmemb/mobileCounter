import { useCallback, useMemo, useRef, useState } from "react";
import {
  angleToPosition,
  valueToAngle,
  processSelection,
  debounce,
  minMax,
} from "./utils";
import "./style.css";

const defaultHandlerContent = <div>+</div>;
const maxAngleForStep = 15;
const startAngle = 100 ;
const endAngle = 350 ;
const midPointAngle = (startAngle + endAngle) / 2;

type Option = {
  label: React.ReactNode;
  onClick: () => void;
};

type CircularSliderProps = {
  size?: number;
  minValue?: number;
  startAngle?: number;
  endAngle?: number;
  handlerSize?: number;
  handlerContent?: React.ReactNode;
  options?: Option[];
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
    size = 220,
    handlerSize = 50,

    minValue = 0,
    maxValue = 100,
    defaultValue = 50,

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

  const stepNumberPerSide = (maxValue - minValue) / 2;

  const safeStartAngle = useMemo(() => {
    return Math.max(
      startAngle,
      midPointAngle - (stepNumberPerSide * maxAngleForStep)
    );
  }, [stepNumberPerSide]);

  const safeEndAngle = useMemo(() => {
    return Math.min(
      endAngle,
      midPointAngle + (stepNumberPerSide * maxAngleForStep)
    );
  }, [stepNumberPerSide]);

  const optionPosition = useMemo(() => {
    const step = 90 / options.length;
    const distanceBasedOnOptionNumber = minMax(
      (options.length - 2) * 15,
      handlerSize * 0.8,
      handlerSize * 1.2
    );
    return options.map((_o, i) => {
      const pointePosition = angleToPosition(
        step * i + step / 2,
        size / 2,
        size - distanceBasedOnOptionNumber
      );
      return pointePosition;
    });
  }, [options, size, handlerSize]);

  /**
   * Handles pointer events to update the handler position.
   * @param ev - Pointer event.
   */
  const handlePointerEvent = useCallback(
    (ev: React.PointerEvent<HTMLDivElement>) => {
      ev.preventDefault();
      /** moved variable
       * Tracking if pointer was moved.
       * Allow to submit with default value if pointer was clicked.
       */
      let moved = false;
      setMoving(true);
      if (containerRef.current) {
        const handlePointerMove = debounce(
          (ev: PointerEvent) => {
            moved = true;
            const value = processSelection(
              ev.clientX,
              ev.clientY,
              containerRef.current as HTMLElement,
              size,
              minValue,
              maxValue,
              safeStartAngle,
              safeEndAngle,
              stepSize
            );
            setValue(value);
          },
          0,
          false
        );

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
            safeEndAngle,
            stepSize
          );
          if (value) {
            if (moved) {
              onSubmit(value);
            } else {
              onSubmit(defaultValue);
            }
          }
          setValue(defaultValue);
          moved = false;
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerup", handlePointerUp);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
          moved = false;
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
      >
        {handlerContent}
      </div>

      <div className="options">
        {options.map((option, i) => {
          const position = optionPosition[i] || optionPosition[0];
          return (
            <button
              key={i}
              style={{
                bottom: position.x,
                left: position.y,
                height: handlerSize * 0.9,
                width: handlerSize * 0.9,
              }}
              role="button"
              disabled={isMoving}
              tabIndex={0}
              onClick={option.onClick}
            >
              {option.label}
            </button>
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
          +&nbsp;{value}
        </div>
        <div className="children" aria-label="label">
          {children}
        </div>
      </div>
    </div>
  );
}

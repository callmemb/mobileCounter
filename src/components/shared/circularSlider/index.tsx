import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonProps,
  Fab,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import ArmHoldingTrigger from "./armHoldingTrigger";
import ProgressBar from "./progressBar";

import "./cssDynamicVariables";
import CounterValueInput from "./counterValueInput";

const MIN_DEG = 0;
const MAX_DEG = 270;
const MIN_MAX_DEG_DELTA = MAX_DEG - MIN_DEG;
/** half point on neutral zone of circle */
const BREAKING_POINT_TO_LOOP_DEG_BACK_TO_ZERO = MAX_DEG + (360 - MAX_DEG) / 2;

const shadowColor = "rgba(255,255,255,.5)";
const textShadow = {
  "h6, span": {
    backgroundColor: "rgba(255,255,255,.2)",
    borderRadius: 1,
    paddingInline: '1em',
    paddingBlock: '.3em'
  },
  textShadow: `
          -2px -2px 14px ${shadowColor},
          -2px -2px 14px ${shadowColor},
          0px  -2px 14px ${shadowColor},
          0px  -2px 14px ${shadowColor},
          2px  -2px 14px ${shadowColor},
          2px  -2px 14px ${shadowColor},
          -2px  0px 14px ${shadowColor},
          -2px  0px 14px ${shadowColor},
          1px   0px 2px ${shadowColor},
          1px   0px 2px ${shadowColor},
          -1px  1px 2px ${shadowColor},
          -1px  1px 2px ${shadowColor},
          0px   1px 2px ${shadowColor},
          0px   1px 2px ${shadowColor},
          1px   1px 2px ${shadowColor};
          1px   1px 2px ${shadowColor};
          `,
};

type CircularSliderProps = {
  onChange: (value: number) => void;
  stepsGoal: number;
  cumulatedSteps: number;
  defaultStep: number;
  minStep: number;
  maxStep: number;
  stepSize: number;
  unitName?: string;
  label: string;
  id: string;
  bgImage?: string;
  tools: {
    id: string;
    icon: React.ReactNode;
    label: string;
    color?: ButtonProps["color"];
    action: () => void;
  }[];
};

export default function CircularSlider({
  onChange,
  cumulatedSteps = 0,
  stepsGoal = 0,
  bgImage,
  // step is current counter value
  defaultStep = 10,
  minStep = 0,
  maxStep = 10,
  stepSize = 1,
  unitName = "",
  label,
  id,
  tools,
}: CircularSliderProps) {
  const theme = useTheme();

  const stepUnitInDeg = useMemo(() => {
    return MIN_MAX_DEG_DELTA / (maxStep - minStep);
  }, [maxStep, minStep]);

  const minStepInDeg = useMemo(
    () => stepUnitInDeg * minStep,
    [stepUnitInDeg, minStep]
  );

  const maxStepInDeg = useMemo(
    () => stepUnitInDeg * maxStep,
    [stepUnitInDeg, maxStep]
  );

  const defaultStepsInDeg = useMemo(
    () => stepUnitInDeg * defaultStep,
    [stepUnitInDeg, defaultStep]
  );

  const [stepInDeg, setStepInDeg] = useState(defaultStepsInDeg);

  const steps = useMemo(
    () => Math.round(stepInDeg / stepUnitInDeg),
    [stepInDeg, stepUnitInDeg]
  );

  const stepValue = useMemo(() => steps * stepSize, [steps, stepSize]);

  const cumulatedStepUnitInDeg = useMemo(() => {
    return MIN_MAX_DEG_DELTA / stepsGoal;
  }, [stepsGoal]);

  const cumulatedStepsInDeg = useMemo(() => {
    return cumulatedStepUnitInDeg * cumulatedSteps;
  }, [cumulatedSteps, cumulatedStepUnitInDeg]);

  const stepInCumulatedUnitInDeg = useMemo(() => {
    return steps * cumulatedStepUnitInDeg;
  }, [steps, cumulatedStepUnitInDeg]);

  const rangeArenas = useMemo(() => {
    const stepSize = stepUnitInDeg < 15 ? 15 : stepUnitInDeg;
    const gapColor = theme.palette.grey[300];
    const stepColor = "transparent";
    let currentDeg = stepSize / 2;
    const arr = [
      { color: theme.palette.primary.main, value: MIN_DEG },
      { color: theme.palette.primary.main, value: MIN_DEG + 1 },
      { color: stepColor, value: currentDeg - 1 },
      { color: gapColor, value: currentDeg - 1 },
    ];
    while (currentDeg < MAX_DEG - stepSize) {
      arr.push({ color: gapColor, value: currentDeg });
      arr.push({ color: stepColor, value: currentDeg });
      currentDeg += stepSize;
      arr.push({ color: stepColor, value: currentDeg - 1 });
      arr.push({ color: gapColor, value: currentDeg - 1 });
    }
    arr.push({ color: gapColor, value: currentDeg });
    arr.push({ color: stepColor, value: stepSize / 2 + currentDeg });
    arr.push({ color: gapColor, value: MAX_DEG });
    arr.push({ color: gapColor, value: MAX_DEG + 1 });
    return arr.map((a) => ({ ...a, value: `${a.value}deg` }));
  }, [stepUnitInDeg, theme.palette.grey, theme.palette.primary.main]);

  const toolsWithRotation = useMemo(() => {
    const gap = 90 / (tools.length + 1);
    return tools.map(({ id, label, icon, color = "secondary", action }, i) => {
      return (
        <ArmHoldingTrigger
          key={id}
          stepInDeg={(i + 0.8) * -gap}
          triggerButton={
            <Tooltip title={label}>
              <Button
                variant="outlined"
                size="small"
                color={color}
                sx={{
                  padding: 0.8,
                  minWidth: 0,
                  borderColor: theme.palette.grey[300],
                  borderRadius: "50%",
                }}
                onClick={action}
              >
                {icon}
              </Button>
            </Tooltip>
          }
        />
      );
    });
  }, [tools, theme.palette.grey]);

  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const startSpyingOnMovement = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);

      let stepInDeg = defaultStepsInDeg;
      const handlePointerMove = (em: PointerEvent) => {
        em.preventDefault();
        em.stopPropagation();
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
          const angle = Math.atan2(
            em.clientY - center.y,
            em.clientX - center.x
          );
          let degrees = (angle * 180) / Math.PI + 180;
          if (degrees > BREAKING_POINT_TO_LOOP_DEG_BACK_TO_ZERO) {
            degrees = 0;
          }
          const newStepInDeg = Math.max(
            Math.min(degrees, maxStepInDeg),
            minStepInDeg
          );

          setStepInDeg(newStepInDeg);
          stepInDeg = newStepInDeg;
        }
      };
      const stopSpyingOnMovement = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", stopSpyingOnMovement);
        setStepInDeg(defaultStepsInDeg);
        setIsDragging(false);
        onChange?.(Math.round(stepInDeg / stepUnitInDeg) * stepSize);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", stopSpyingOnMovement);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", stopSpyingOnMovement);
      };
    },
    [
      defaultStepsInDeg,
      maxStepInDeg,
      minStepInDeg,
      onChange,
      stepSize,
      stepUnitInDeg,
    ]
  );

  return (
    <Box
      id={id}
      ref={containerRef}
      sx={{
        display: "grid",
        placeItems: "center",
        position: "relative",
        borderRadius: "50%",
        width: "80%",
        aspectRatio: 1,
        touchAction: "none",
        border: `1px solid`,
        borderColor: theme.palette.grey[300],
        background: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ProgressBar
        key="grayBg"
        onRadius={101}
        size={4}
        ranges={[
          { color: theme.palette.grey[300], value: `${MIN_DEG}deg` },
          { color: theme.palette.grey[300], value: `${MAX_DEG}deg` },
        ]}
        sx={{
          transition: `--value-deg ${isDragging ? "0s" : "0.5s"}`,
        }}
      />
      <ProgressBar
        key="scale"
        onRadius={100}
        size={12}
        ranges={rangeArenas}
        sx={{
          transition: `--value-deg ${isDragging ? "0s" : "0.5s"}`,
        }}
      />
      <ProgressBar
        key="active"
        onRadius={100}
        size={3}
        ranges={[
          { color: theme.palette.secondary.main, value: "var(--value-deg)" },
        ]}
        sx={{
          transition: `--value-deg ${isDragging ? "0s" : "0.5s"}`,
          "--value-deg": `${stepInDeg}deg`,
        }}
      />
      <ProgressBar
        key="cumulated"
        onRadius={96}
        size={5}
        ranges={[
          { color: theme.palette.primary.main, value: `var(--value2-deg)` },
          {
            color: theme.palette.secondary.main,
            value: `calc( min(var(--value2-deg) + var(--value-deg) , ${MAX_DEG}deg) )`,
          },
        ]}
        sx={{
          transition: `--value-deg 0.5s, --value2-deg ${isDragging ? "0s" : "0.5s"}`,
          "--value-deg": `${isDragging ? stepInCumulatedUnitInDeg : 0}deg`,
          "--value2-deg": `${Math.min(cumulatedStepsInDeg, MAX_DEG)}deg`,
        }}
      />

      <Box // value
        aria-hidden
        sx={{
          position: "absolute",
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          aspectRatio: 1,
          textAlign: "center",
          overflow: "clip",
          width: "85%",
          ...textShadow,
        }}
      >
        <Box
          sx={{
            opacity: isDragging ? 1 : 0,
            transform: `translateX(${isDragging ? "0" : "-50%"})`,
            transition: "opacity 0.5s, transform 0.5s",
          }}
        >
          <Typography variant="h6">
            + {stepValue} {unitName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {cumulatedSteps * stepSize + stepValue} / {stepsGoal * stepSize}{" "}
            {unitName}
          </Typography>
        </Box>
      </Box>

      <Box // label
        sx={{
          position: "absolute",
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          aspectRatio: 1,
          width: "85%",
          fontOversize: "ellipsis",
          textAlign: "center",
          overflow: "clip",
          ...textShadow,
        }}
      >
        <Box
          sx={{
            opacity: isDragging ? 0 : 1,
            transform: `translateX(${isDragging ? "50%" : "0%"})`,
            transition: "opacity 0.5s, transform 0.5s",
          }}
        >
          <Typography variant="h6">{label}</Typography>
          <Typography variant="caption" color="text.secondary">
            {cumulatedSteps >= stepsGoal
              ? "Goal reached"
              : `${cumulatedSteps * stepSize} / ${stepsGoal * stepSize} ${unitName}`}
          </Typography>
        </Box>
      </Box>

      <Box // input
        onFocus={() => {
          containerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }}
        sx={{
          opacity: 0,
          position: "absolute",
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          aspectRatio: 1,
          // background: theme.palette.background.paper,
          transition: "opacity 0.5s",
          width: "80%",
          overflow: "hidden",
          ">*": {
            transition: "top 0.5s",
            pointerEvents: "none",
            position: "absolute",
            top: "150%",
            transform: "translateY(-50%)",
          },
          "&:focus-within": {
            opacity: 1,
            ">*": {
              top: "50%",
            },
          },
        }}
      >
        <CounterValueInput
          label={label}
          minStep={minStep}
          maxStep={maxStep}
          stepSize={stepSize}
          defaultStep={defaultStep}
          onChange={onChange}
        />
      </Box>

      <ArmHoldingTrigger
        stepInDeg={stepInDeg}
        isDragging={isDragging}
        startSpyingOnMovement={startSpyingOnMovement}
        triggerButton={
          <Fab
            tabIndex={-1}
            color="primary"
            variant="circular"
            size="small"
            aria-hidden="true"
            sx={{
              ...(isDragging
                ? {
                    transform: "scale(.7)",
                    cursor: "initial",
                    "&:hover": {
                      background: theme.palette.primary.main,
                    },
                  }
                : { transform: "scale(1)", cursor: "grabbing" }),
              transition: "transform 0.5s, background 0.5s",
              border: `1px solid ${theme.palette.secondary.main}`,
            }}
          >
            <Add />
          </Fab>
        }
      />

      {toolsWithRotation}
    </Box>
  );
}

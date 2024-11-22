import { Box } from "@mui/material";

type ArmHoldingTriggerProps = {
  stepInDeg: number;
  isDragging?: boolean;
  startSpyingOnMovement?: (e: React.PointerEvent) => void;
  triggerButton: React.ReactNode;
};

export default function ArmHoldingTrigger({
  stepInDeg,
  isDragging,
  startSpyingOnMovement,
  triggerButton,
}: ArmHoldingTriggerProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        overflow: "visible",
        width: "50%",
        left: "0",
        top: "50%",
        transformOrigin: "right",
        transform: `rotate(${stepInDeg}deg)`,
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
          transform: `rotate(${-stepInDeg}deg)`,
          transition: `transform ${isDragging ? "0s" : "0.5s"}`,
          width: "2%",
          display: "grid",
          placeItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {triggerButton}
      </Box>
    </Box>
  );
}

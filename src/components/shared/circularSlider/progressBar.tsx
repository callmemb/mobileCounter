import { Box, BoxProps } from "@mui/material";

type ProgressBarProps = {
  onRadius: number;
  ranges: Array<{ color: string; value: number | string }>;
  size?: number;
  sx?: BoxProps["sx"];
};

export default function ProgressBar({
  onRadius,
  ranges,
  sx,
  size = 3,
}: ProgressBarProps) {
  const rangesC: string = ranges
    .map(({ color, value }, index) => {
      return `${color} ${value}, ${ranges[index + 1]?.color || "transparent"} ${value}`;
    })
    .join(", ");

  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        position: "absolute",
        width: `${onRadius}%`,
        aspectRatio: 1,
        borderRadius: "50%",
        padding: `${size}px`,
        background: `conic-gradient(from -90deg at 50% 50%, 
          ${rangesC}, 
          transparent ${ranges[ranges.length - 1].value})`,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        ...sx,
      }}
    />
  );
}

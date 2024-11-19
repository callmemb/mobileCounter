import { useContext } from "react";
import { ShortcutContext } from "./shortcutContext";
import { Box, Button, styled, ButtonProps } from "@mui/material";

type ShortcutButton = {
  id: string;
  onClick: () => void;
  isSelected?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: ButtonProps["color"];
  disabled?: ButtonProps["disabled"];
};

export default function ShortcutButton({
  id,
  icon,
  color,
  disabled,
  children,
  isSelected,
  onClick,
}: ShortcutButton) {
  const { side, idOfHoveredItem } = useContext(ShortcutContext);
  const isHover = idOfHoveredItem === id;

  return (
    <SlidingButton
      data-shortcut-id={id}
      className={`${side} ${isHover ? "hover" : ""}`}
      variant={isSelected ? "contained" : "outlined"}
      color={color}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {icon} <Box className="label">{children}</Box>
    </SlidingButton>
  );
}

const SlidingButton = styled(Button)(({ theme }) => ({
  minWidth: 35,
  display: "flex",
  gap: ".3rem",
  height: "round(2.4rem, 1px)", // antyaliasing problem fixer.
  "&:disabled": {
    pointerEvents: "auto",
  },
  "&.left": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
  },
  "&.right": {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
  },
  [theme.containerQueries.down(270)]: {
    "&.left": {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 0,
      ".label": {
        left: "99%",
        clipPath: "inset(-5px -5px -5px -1px)",
        transformOrigin: "left",
        borderRadius: "0 4px 4px 0",
        borderRightWidth: 1,
        borderLeftWidth: 0,
      },
    },
    "&.right": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeftWidth: 0,
      ".label": {
        right: "99%",
        clipPath: "inset(-5px -1px -5px -5px)",
        transformOrigin: "right",
        borderRadius: "4px 0 0 4px",
        borderRightWidth: 0,
        borderLeftWidth: 1,
      },
    },
    "&.hover, &:hover, &:focus": {
      ".label": {
        transform: "scale(1,1)",
      },
    },
    ".label": {
      height: "inherit",
      whiteSpace: "nowrap",
      position: "absolute",
      background: "inherit",
      padding: "inherit",
      boxShadow: "inherit",
      border: "inherit",
      willChange: "transform",
      transform: "scale(0,1)",
      transition: "transform 0.2s",
      transitionDelay: "0.15s",
      display: "flex",
      alignItems: "center",
    },
  },
}));

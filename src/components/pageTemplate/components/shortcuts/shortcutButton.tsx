import { useContext } from "react";
import { ShortcutContext } from "./shortcutContext";
import { Box, Button, styled } from "@mui/material";
import { motion } from "motion/react";

type ShortcutButton = {
  id: string;
  onClick: () => void;
  isSelected?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export default function ShortcutButton({
  id,
  icon,
  children,
  isSelected,
  onClick,
}: ShortcutButton) {
  const { side, idOfHoveredItem } = useContext(ShortcutContext);
  const isHover = idOfHoveredItem === id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{  opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SlidingButton
        data-shortcut-id={id}
        className={`${side} ${isHover ? "hover" : ""} ${
          isSelected ? "selected" : ""
        }`}
        variant="contained"
        onClick={onClick}
      >
        {icon} <Box className="label">{children}</Box>
      </SlidingButton>
    </motion.div>
  );
}

const SlidingButton = styled(Button)(({ theme }) => ({
  minWidth: 35,
  display: "flex",
  gap: 1,
  "&.left": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  "&.right": {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  [theme.containerQueries.down(270)]: {
    "&.left": {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      ".label": {
        left: "99%",
        clipPath: "inset(-5px -5px -5px -1px)",
        transformOrigin: "left",
        borderRadius: "0 4px 4px 0",
      },
    },
    "&.right": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      ".label": {
        right: "99%",
        clipPath: "inset(-5px -1px -5px -5px)",
        transformOrigin: "right",
        borderRadius: "4px 0 0 4px",
      },
    },
    "&.hover, &:hover, &:focus": {
      ".label": {
        transform: "scale(1,1)",
      },
    },
    ".label": {
      position: "absolute",
      backgroundColor: "inherit",
      padding: "inherit",
      boxShadow: "inherit",
      transform: "scale(0,1)",
      transition: "transform 0.2s",
    },
  },
}));

import { useContext, useState } from "react";
import { Collapse, Box } from "@mui/material";

import { ReactNode } from "react";
import { Menu } from "@mui/icons-material";
import ShortcutButton from "./shortcutButton";
import { ShortcutContext } from "./shortcutContext";

export default function ShortcutMenuButton({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [open, setOpen] = useState(false);
  const { side } = useContext(ShortcutContext);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <ShortcutButton
        id="menu"
        color="secondary"
        icon={<Menu />}
        onClick={handleToggle}
      >
        {open ? "Close" : "Open"} Menu
      </ShortcutButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: side === "right" ? "flex-start" : "flex-end",
          }}
        >
          {children}
        </Box>
      </Collapse>
    </>
  );
}

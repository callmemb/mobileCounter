import React from "react";
import ShortcutPanel from "./components/shortcuts/shortcutPanel";
import { Box, Paper } from "@mui/material";

type PageTemplateProps = {
  children: React.ReactNode | React.ReactNode[] | undefined;
  label: string | null;
  leftOptions?: React.ReactNode | React.ReactNode[];
  rightOptions?: React.ReactNode | React.ReactNode[];
  staticOptions?: React.ReactNode | React.ReactNode[];
};

export const PageTemplate: React.FC<PageTemplateProps> = ({
  children = [],
  label = null,
  leftOptions = [],
  rightOptions = [],
  staticOptions = [],
}) => {
  const leftRef = React.useRef<HTMLDivElement>(null);
  const rightRef = React.useRef<HTMLDivElement>(null);

  return (
    <Box
      height="100dvh"
      sx={{
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns:
          "minmax(50px, 1fr) minmax(0px, 340px) minmax(50px, 1fr)",
      }}
    >
      <Box
        ref={leftRef}
        component="nav"
        sx={{
          py: 1,
          gridColumn: "1 / 3",
          gridRow: "1",
          display: "grid",
          gridTemplateColumns: "subgrid",
          overflow: "auto",
          scrollbarWidth: "none",
        }}
      >
        <Box sx={{ gridColumn: "1", position: "relative", zIndex: 3 }}>
          <ShortcutPanel side="left" scrollableRef={leftRef}>
            {leftOptions}
          </ShortcutPanel>
        </Box>
      </Box>

      <Box
        ref={rightRef}
        component="aside"
        sx={{
          py: 1,
          gridColumn: "2 / 4",
          gridRow: "1",
          display: "grid",
          gridTemplateColumns: "subgrid",
          overflow: "auto",
          scrollbarWidth: "none",
        }}
      >
        <Box sx={{ gridColumn: "3", position: "relative", zIndex: 3 }}>
          <ShortcutPanel side="right" scrollableRef={rightRef}>
            {staticOptions}
            {label ? (
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  writingMode: "vertical-rl",
                  fontSize: 40,
                  padding: "20px 0px",
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                {label}
              </Box>
            ) : null}
            <hr />
            {rightOptions}
          </ShortcutPanel>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          p: 0.3,
          gridColumn: "2 / 3",

          gridRow: "1",
          zIndex: 0,
          position: "relative",
        }}
      >
        <Paper
          sx={{
            height: "100%",
            width: "100%",
            p: 2,
            zIndex: 1,
            position: "relative",
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default PageTemplate;

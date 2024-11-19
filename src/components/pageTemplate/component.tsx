import React from "react";
import ShortcutPanel from "./components/shortcuts/shortcutPanel";
import { Box, Paper, Typography } from "@mui/material";

type PageTemplateProps = {
  children: React.ReactNode | React.ReactNode[] | undefined;
  label?: string;
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
        gridTemplateRows: "1fr",
        gridTemplateColumns:
          "minmax(60px, 1fr) minmax(0px, 340px) minmax(60px, 1fr)",
      }}
    >
      <Box
        component="main"
        sx={{
          gridColumn: "2",
          gridRow: "1",
          zIndex: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Paper
          sx={{
            maxHeight: "100%",
            minHeight: "100%",
            height: "100%",
            width: "100%",
            p: 1,
            zIndex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              overflow: "auto",
              scrollbarWidth: "1px",
              px: 1,
              py: 2,
            }}
          >
            {children}
          </Box>
        </Paper>
      </Box>

      <Box
        ref={rightRef}
        component="aside"
        sx={{
          py: 2,
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
              <Typography
                variant="h4"
                sx={{
                  position: "sticky",
                  top: 0,
                  writingMode: "vertical-rl",
                  padding: "20px 0px",
                  lineHeight: 1,
                  fontWeight: 700,
                  userSelect: "none",
                }}
              >
                {label}
              </Typography>
            ) : null}
            <Box sx={{ height: '1rem' }} />
            {rightOptions}
          </ShortcutPanel>
        </Box>
      </Box>

      <Box
        ref={leftRef}
        component="nav"
        sx={{
          py: 2,
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
    </Box>
  );
};

export default PageTemplate;

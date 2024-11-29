import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Menu,
  MenuItem,
  TextField,
  Box,
  InputAdornment,
  Grid2,
} from "@mui/material";
import { debounce } from "../../../lib/debounce";
import DynamicIcon from "../../dynamicIcon/component";
import { IconNameType, searchForIconNames } from "../../../iconRelatedConsts";
import TextInput, { TextInputProps } from "./textInput";

type IconPickerProps = Omit<TextInputProps, "onChange"> & {
  value?: string;
  onChange?: (value: IconNameType | "") => void;
};

export default function IconPicker({
  value,
  onChange,
  onBlur,
  ...props
}: IconPickerProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuWidth, setMenuWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const icons = useMemo(() => {
    return searchForIconNames(searchTerm);
  }, [searchTerm]);

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuWidth(event.currentTarget.offsetWidth);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // because TS is awesome....
    const syntheticEvent = new FocusEvent(
      "blur"
    ) as unknown as React.FocusEvent<HTMLInputElement>;
    onBlur?.(syntheticEvent);
  };

  const handleSelectIcon = (iconName: IconNameType | "") => {
    onChange?.(iconName);
    handleClose();
  };

  // Focus search input when menu opens
  useEffect(() => {
    if (anchorEl) {
      // Wait for Menu to mount and TextField to be ready
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      setSelectedIndex(0);
    }
  }, [anchorEl]);

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!anchorEl && event.currentTarget instanceof HTMLElement) {
        handleClick(event as unknown as React.MouseEvent<HTMLElement>);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Don't handle navigation if typing in search
    if (document.activeElement === searchInputRef.current) {
      return;
    }

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, icons.length - 1));
        break;
      case "ArrowLeft":
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        // If we're at the top row, focus search input
        if (selectedIndex < 4) {
          searchInputRef.current?.focus();
        } else {
          setSelectedIndex((prev) => Math.max(prev - 4, 0));
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 4, icons.length - 1));
        break;
      case "Enter":
        if (
          document.activeElement !== searchInputRef.current &&
          icons[selectedIndex]
        ) {
          event.preventDefault();
          handleSelectIcon(icons[selectedIndex]);
        }
        break;
      case "Escape":
        handleClose();
        break;
    }
  };

  return (
    <>
      <TextInput
        onClick={handleClick}
        onKeyDown={handleInputKeyDown}
        fullWidth
        value={value}
        {...props}
        slotProps={{
          input: {
            readOnly: true,
            role: "combobox",
            "aria-expanded": Boolean(anchorEl),
            "aria-haspopup": "true",
            startAdornment: value ? (
              <InputAdornment position="start">
                <DynamicIcon icon={value} color="primary" />
              </InputAdornment>
            ) : null,
          },
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onKeyDown={handleKeyDown}
        slotProps={{
          paper: {
            style: {
              width: menuWidth,
              maxWidth: "none",
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 1, outline: "none" }}>
          <TextField
            inputRef={searchInputRef}
            size="small"
            fullWidth
            placeholder="Search icons..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </Box>
        <Box sx={{ p: 1 }}>
          <Grid2 container spacing={1}>
            {icons.map((name, index) => (
              <Grid2 size={3} key={name}>
                <MenuItem
                  onClick={() => handleSelectIcon(name)}
                  selected={index === selectedIndex}
                  sx={{
                    justifyContent: "center",
                    minHeight: "48px",
                    width: "100%",
                  }}
                >
                  <DynamicIcon icon={name} color="primary" />
                </MenuItem>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Menu>
    </>
  );
}

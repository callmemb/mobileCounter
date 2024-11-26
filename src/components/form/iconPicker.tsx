import React, { useState, useMemo, forwardRef } from "react";
import {
  Menu,
  MenuItem,
  TextField,
  Box,
  InputAdornment,
  Grid2,
} from "@mui/material";
import { debounce } from "../../lib/debounce";
import DynamicIcon from "../dynamicIcon/component";
import { IconNameType, searchForIconNames } from "../../iconRelatedConsts";
import TextInput, { TextInputProps } from "./textInput";

type IconPickerProps = {
  value?: string;
  onChange?: (value: IconNameType | "") => void;
} & TextInputProps;

const IconPicker = forwardRef<HTMLDivElement, IconPickerProps>(
  ({ value = "", onChange, ...props }, ref) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

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
    };

    const handleSelectIcon = (iconName: IconNameType | "") => {
      onChange?.(iconName);
      handleClose();
    };

    return (
      <div ref={ref}>
        <TextInput
          onClick={handleClick}
          value={value}
          fullWidth
          {...props}
          slotProps={{
            input: {
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  {value ? <DynamicIcon icon={value} color="primary" /> : null}
                </InputAdornment>
              ),
            },
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
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
          <Box sx={{ p: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search icons..."
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </Box>
          <Box sx={{ p: 1 }}>
            <Grid2 container spacing={1}>
              {icons.map((name) => (
                <Grid2 size={3} key={name}>
                  <MenuItem
                    onClick={() => handleSelectIcon(name)}
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
      </div>
    );
  }
);

export default IconPicker;

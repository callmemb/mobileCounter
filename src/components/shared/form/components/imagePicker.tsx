import React, { useState, useRef } from "react";
import {
  Menu,
  MenuItem,
  TextField,
  Box,
  InputAdornment,
  Grid2,
  IconButton,
  Stack,
  Typography,
  Checkbox,
  Button,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { debounce } from "../../../../lib/debounce";
import BaseInput, { BaseInputProps } from "./baseInput";
import { store } from "../../../../store";
import { Image, Image as ImageType } from "../../../../definitions";
import { useFieldContext } from "../context";

type ImagePickerProps = Omit<BaseInputProps, "onChange">
export default function ImagePicker({
  ...props
}: ImagePickerProps) {

  const {
    handleBlur,
    handleChange,
    state: {
      value,
      meta: { errors, isTouched },
    },
  } = useFieldContext<string>();

  const errorMessage = isTouched ? errors.map((e) => e.message).join(",") : "";


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuWidth, setMenuWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<Set<string>>(new Set());
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedImage = store.useImage(value);

  const ITEMS_PER_PAGE = 9;
  const ITEMS_PER_ROW = 3;

  const { images: filteredImages, hasMore } = store.useImages(
    searchTerm,
    page,
    ITEMS_PER_PAGE
  );

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on new search
  }, 300);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuWidth(event.currentTarget.offsetWidth);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPage(1);
    setSearchTerm("");
    handleBlur?.();
  };

  const handleSelectImage = (imageId: ImageType["id"]) => {
    handleChange?.(imageId); // Store ID instead of URL
    handleClose();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const image = await store.addImage(file);
        handleSelectImage(image?.id as Image["id"]);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!anchorEl && event.currentTarget instanceof HTMLElement) {
        handleClick(event as unknown as React.MouseEvent<HTMLElement>);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (document.activeElement === searchInputRef.current) {
      return;
    }

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        if (
          (selectedIndex + 1) % ITEMS_PER_ROW === 0 &&
          filteredImages.length === ITEMS_PER_PAGE
        ) {
          handleNextPage();
          setSelectedIndex(selectedIndex - (ITEMS_PER_ROW - 1));
        } else {
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredImages.length - 1)
          );
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (selectedIndex % ITEMS_PER_ROW === 0 && page > 1) {
          handlePrevPage();
          setSelectedIndex(selectedIndex + (ITEMS_PER_ROW - 1));
        } else {
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (selectedIndex < ITEMS_PER_ROW) {
          setSelectedIndex(-1);
          searchInputRef.current?.focus();
        } else {
          setSelectedIndex((prev) => Math.max(prev - ITEMS_PER_ROW, 0));
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev === -1
            ? 0
            : Math.min(prev + ITEMS_PER_ROW, filteredImages.length - 1)
        );
        break;
      case "Enter":
        if (
          document.activeElement !== searchInputRef.current &&
          filteredImages[selectedIndex]
        ) {
          event.preventDefault();
          handleSelectImage(filteredImages[selectedIndex].id);
        }
        break;
      case "Escape":
        handleClose();
        break;
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleChange?.('');
  };

  const toggleManageMode = () => {
    setIsManageMode(!isManageMode);
    setSelectedToDelete(new Set());
  };

  const handleDeleteSelected = async () => {
    try {
      for (const imageId of selectedToDelete) {
        const {errorMessage} = await store.deleteImage(imageId);
        if (errorMessage) {
          setDeleteError(errorMessage);
          return; // Stop deletion process on first error
        }
        if (imageId === value) {
          handleChange?.('');
        }
      }
      setSelectedToDelete(new Set());
      setIsManageMode(false);
      setDeleteError(null);
    } catch (error) {
      setDeleteError('Failed to delete images');
      console.error("Failed to delete images:", error);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    const newSelected = new Set(selectedToDelete);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedToDelete(newSelected);
  };

  return (
    <>
      <BaseInput
        onClick={handleClick}
        onKeyDown={handleInputKeyDown}
        fullWidth
        errorMessage={errorMessage}
        // Display filename but keep ID as actual value
        inputProps={{
          value: selectedImage?.name || ''
        }}
        value={value}
        {...props}
        slotProps={{
          input: {
            readOnly: true,
            role: "combobox",
            "aria-expanded": Boolean(anchorEl),
            "aria-haspopup": "true",
            startAdornment: selectedImage?.data ? (
              <InputAdornment position="start">
                <img
                  src={selectedImage.data}
                  alt="Selected"
                  style={{ width: 24, height: 24, objectFit: "cover" }}
                />
              </InputAdornment>
            ) : null,
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileUpload}
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
        <Box sx={{ p: 1, display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            inputRef={searchInputRef}
            size="small"
            fullWidth
            placeholder="Search images..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <IconButton
            size="small"
            onClick={toggleManageMode}
            color={isManageMode ? "primary" : "default"}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
          >
            <AddIcon />
          </IconButton>
        </Box>
        {isManageMode && selectedToDelete.size > 0 && (
          <Box sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}>
            <Stack spacing={1}>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleDeleteSelected}
                fullWidth
              >
                Delete Selected ({selectedToDelete.size})
              </Button>
              {deleteError && (
                <Alert severity="error" onClose={() => setDeleteError(null)}>
                  {deleteError}
                </Alert>
              )}
            </Stack>
          </Box>
        )}
        <Box sx={{ p: 1 }}>
          <Grid2 container spacing={1}>
            {filteredImages.map((image, index) => (
              <Grid2 size={12 / ITEMS_PER_ROW} key={image.id}>
                <MenuItem
                  onClick={() => isManageMode 
                    ? toggleImageSelection(image.id)
                    : handleSelectImage(image.id)
                  }
                  selected={index === selectedIndex}
                  sx={{
                    justifyContent: "center",
                    minHeight: "48px",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {image?.data && (
                    <>
                      <img
                        src={image.data}
                        alt=""
                        style={{
                          width: "100%",
                          height: "48px",
                          objectFit: "cover",
                          opacity: isManageMode ? 0.7 : 1,
                        }}
                      />
                      {isManageMode && (
                        <Checkbox
                          checked={selectedToDelete.has(image.id)}
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      )}
                    </>
                  )}
                </MenuItem>
              </Grid2>
            ))}
          </Grid2>
        </Box>
        <Box sx={{ p: 1, borderTop: 1, borderColor: "divider" }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              size="small"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body2">Page {page}</Typography>
            <IconButton
              size="small"
              onClick={handleNextPage}
              disabled={!hasMore}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Stack>
        </Box>
      </Menu>
    </>
  );
}

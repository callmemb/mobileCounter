import { Suspense } from "react";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import DownloadingIcon from "@mui/icons-material/Downloading";
import iconMap, { IconNameType } from "../../iconRelatedConsts";
import { SvgIconProps } from "@mui/material";

type DynamicIconProps = {
  icon: IconNameType | string;
} & SvgIconProps;

export default function DynamicIcon({ icon, ...iconProps }: DynamicIconProps) {
  const SelectedIcon = iconMap?.[icon as IconNameType] ?? AutoAwesome;

  return (
    <Suspense fallback={<DownloadingIcon {...iconProps} />}>
      <SelectedIcon {...iconProps} />
    </Suspense>
  );
}

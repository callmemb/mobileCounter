import { Stack } from "@mui/material";
import React, { PropsWithChildren } from "react";

const StackLayoutForFields: React.FC<PropsWithChildren> = ({ children }) => {
  return <Stack gap={1}>{children}</Stack>;
};

export default StackLayoutForFields;

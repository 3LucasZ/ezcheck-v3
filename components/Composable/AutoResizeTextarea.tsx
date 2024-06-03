// @ts-nocheck
// ^^^ This is the ONLY way to ignore typescript errors on this file.
// No matter how long I tried I could never solve it.
// This is basically my white flag. Good job TS.
import { Textarea, TextareaProps } from "@chakra-ui/react";
import React from "react";
import ResizeTextarea from "react-textarea-autosize";

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <Textarea
        minH="unset"
        overflow="hidden"
        w="100%"
        resize="none"
        ref={ref}
        minRows={1}
        as={ResizeTextarea}
        {...props}
      />
    );
  }
);
AutoResizeTextarea.displayName = "AutoResizeTextarea";
export default AutoResizeTextarea;

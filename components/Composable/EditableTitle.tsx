import { responsiveHeaderFontSize } from "services/constants";
import AutoResizeTextarea from "./AutoResizeTextarea";

//value, onchanged, disabled
export default function EditableTitle({ ...props }) {
  return (
    <AutoResizeTextarea
      maxLength={100}
      fontSize={responsiveHeaderFontSize}
      display={"block"}
      _disabled={{ color: "black", borderColor: "white" }}
      textAlign={"center"}
      sx={{ opacity: "1" }}
      py={"5px"}
      {...props}
    />
  );
}

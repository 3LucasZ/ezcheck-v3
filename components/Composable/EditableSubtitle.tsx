import AutoResizeTextarea from "components/Composable/AutoResizeTextarea";

//value, onChange, isDisabled, placeholder
export default function EditableSubtitle({ ...props }) {
  return (
    <AutoResizeTextarea
      maxLength={250}
      _disabled={{ color: "black", borderColor: "white" }}
      fontSize={["xs", "xs", "sm", "md", "lg", "xl"]}
      sx={{ opacity: "1" }}
      {...props}
    />
  );
}

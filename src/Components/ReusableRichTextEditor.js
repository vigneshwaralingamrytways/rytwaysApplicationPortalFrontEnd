// components/common/ReusableRichTextEditor.js
import React from "react";
import ReactQuill from "react-quill";
import { Controller } from "react-hook-form";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = ["bold", "italic", "underline", "list", "bullet", "link"];

const ReusableRichTextEditor = ({
  name,
  control,
  label,
  error,
  validation,
  horizontal = false,
  classes,
}) => {
  return (
    <div className={horizontal ? classes?.horizontal : undefined}>
      <label
        htmlFor={name}
        className={horizontal ? classes?.horizontallabel : undefined}
        style={{
          whiteSpace: horizontal ? "wrap" : "normal",
          minWidth: horizontal ? "210px" : "auto",
        }}
      >
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        rules={{ required: validation }}
        render={({ field: { onChange, value } }) => (
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={value || ""}
            onChange={onChange}
            style={{ minHeight: "150px", marginBottom: "10px" }}
          />
        )}
      />

      {error && <small className="text-danger">{error.message}</small>}
    </div>
  );
};

export default ReusableRichTextEditor;

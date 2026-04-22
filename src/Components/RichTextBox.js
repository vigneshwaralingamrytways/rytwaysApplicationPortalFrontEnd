import React, { useState } from 'react'
import classes from "./RichTextBox.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextBox = () => {

    const [text, setText] = useState("");

  return (
    <div className={classes.container}>
        <label>Description</label>
      <ReactQuill
        theme="snow"
        value={text}
        onChange={setText}
        placeholder="Enter rich text here..."
        style={{ height: "200px", marginBottom: "30px" }}
      />

      <h5>Preview Output:</h5>
      <div
        style={{ border: "1px solid #ccc", padding: "10px" }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
        
    </div>
  )
}

export default RichTextBox
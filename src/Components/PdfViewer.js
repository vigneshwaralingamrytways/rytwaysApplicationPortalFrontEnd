import React from "react";
import Popupcard from "../UI/cards/Popupcard";

const PdfViewer = ({ pdfUrl }) => {
  return (
  <Popupcard title="View PDF">
    <div
      style={{
        position: "relative",
      }}
      onContextMenu={(e) => e.preventDefault()} // Disable right-click globally
      onCopy={(e) => e.preventDefault()} // Prevent copying
      onCut={(e) => e.preventDefault()} // Prevent cutting
    >
      <iframe
        src={pdfUrl}
        width="100%"
        height="8400px"
        frameBorder="0"
        title="PDF Viewer"
        style={{
          border: "none",
      //    pointerEvents: "none", // Prevent interaction with the iframe
        }}
      ></iframe>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
         height:"8400px",
          background: "transparent",
          pointerEvents: "none",
        }}
      ></div>
    </div>
    </Popupcard>
  );
};

export default PdfViewer;

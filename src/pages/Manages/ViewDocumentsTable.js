import React from "react";
import * as FaIcons from "react-icons/fa";

const ViewdDocumentsTable = (showFormHandler, documents) => {
  return [
    {
      title: "Document Type",
      align: "left",
      val: "documentType",
      render: (rowData) => <span>{rowData?.documentType || "-"}</span>,
    },
    {
      title: "Document Title",
      align: "left",
      val: "documentTitle",
      render: (rowData) => <span>{rowData?.documentTitle || "-"}</span>,
    },
    {
      title: "Date",
      align: "left",
      val: "Date",
      render: (rowData) => {

        const dateItem = rowData?.documentsFeilds?.find(
          (item) => item.feildName === "Date"
        );
        return <span>{dateItem?.feildValue || "-"}</span>;
      },

    },
    // {
    //   title: "Date",
    //   align: "left",
    //   val: "documentTitle",
    //   render: (rowData) => <span>{rowData?.documentFeilds?.ate || "-"}</span>,
    // },
    {
      title: "Download PDF",
      align: "center",
      render: (rowData) => (
        <span
          style={{ cursor: "pointer", color: "blue", }}
          title="Download PDF"
          onClick={showFormHandler(rowData)}
        >
          <FaIcons.FaFilePdf />
        </span>
      ),
    },
  ];
};

export default ViewdDocumentsTable;

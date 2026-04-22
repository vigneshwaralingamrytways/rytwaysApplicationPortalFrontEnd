import React from "react";
import * as FaIcons from "react-icons/fa";

const BankStatementTable = (showFormHandler, actions) => [
    {
        title: "Month",
        align: "left",
        val: "month",
        render: (rowData) => <span>{rowData.month}</span>,
    },
    {
        title: "Year",
        align: "left",
        val: "year",
        render: (rowData) => <span>{rowData.year}</span>,
    },
    {
        title: "Description",
        align: "left",
        val: "description",
        render: (rowData) => <span>{rowData.description}</span>,
    },
   
    {
        title: "Download",
        align: "center",
        render: (rowData) => (
            <>
                <span
                    style={{ cursor: "pointer", color: "blue",  }}
                    onClick={showFormHandler(rowData, actions[0])}
                >
                    <FaIcons.FaDownload />
                </span>

            </>
        ),
    },




    {
        title: "Delete",
        align: "center",
        render: (rowData) => (
            <>
                <span
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={showFormHandler(rowData, actions[1])}
                >
                    <FaIcons.FaTrash />
                </span>
            </>
        ),
    },]

export default BankStatementTable;

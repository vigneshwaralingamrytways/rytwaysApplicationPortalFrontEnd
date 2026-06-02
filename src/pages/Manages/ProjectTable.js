import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
//same like curencymastertable.js
const ProjectTable = (showFormHandler, actions) => {



    return [


        // {
        //     title: "Seq No",
        //     align: "right",
        //     val: "expenseSeqNo",
        //     render: (rowData) => <span>{rowData?.ExpensSeqNo}</span>,
        // },
        {
            title: "Customer Name",
            align: "left",
            val: "customerName",
            render: (rowData) => <span>{rowData?.customer?.customerName}</span>,
        },


        {
            title: "project name",
            align: "left",
            val: "projectName",
            render: (rowData) => <span>{rowData?.projectName}</span>,
        },
        {
            title: "project Catagory",
            align: "left",
            val: "projectCatagory",
            render: (rowData) => <span>{rowData?.projectCategory?.projectCatagoryName}</span>,
        },
        {
            title: "Project Type",
            align: "left",
            val: "projectType",
            render: (rowData) => (
                <span>{rowData?.projectType?.projecTypeName}</span>
            ),
        },
        {
            title: "project Value",
            align: "left",
            val: "projectValue",
            render: (rowData) => <span>{rowData?.projectValue}</span>,
        },

        // {
        //     title: "Status ",
        //     align: "left",
        //     val: "status",
        //     render: (rowData) => <span>{rowData?.Status}</span>,
        // },

        {
            title: "Upload",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[2])}
                    >
                        <FaIcons.FaUpload />
                    </span>

                </>
            ),
        },
        {
            title: "Bill",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[3])}
                    >
                        <FaIcons.FaMoneyBill />
                    </span>

                </>
            ),
        },
        {
            title: "Projet Propasal",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[4])}
                    >
                        <FaIcons.FaProjectDiagram />
                    </span>

                </>
            ),
        },

        {
            title: "Pdf",
            align: "center",
            render: (rowData,index) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={showFormHandler(rowData, actions[5],index)}
                    >
                        <FaIcons.FaPrint />
                    </span>
                </>
            ),
        },
        {
            title: "Edit",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[0])}
                    >
                        <FaIcons.FaEdit />
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
        },

    ];
};

export default ProjectTable;
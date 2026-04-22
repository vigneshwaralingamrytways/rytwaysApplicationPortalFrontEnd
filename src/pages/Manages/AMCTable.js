import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
//same like curencymastertable.js
 const AMCTable = (showFormHandler, actions) => {
   
   
   
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
            val: "projectDesc",
            render: (rowData) => <span>{rowData?.projectName}</span>,
        },
         {
            title: "project Catagory",
            align: "left",
            val: "projectCatagory",
            render: (rowData) => <span>{rowData?.projectCategory?.projectCatagoryName}</span>,
        },
         {
            title: "project Type",
            align: "left",
            val: "eprojectType",
            render: (rowData) => <span>{rowData?.projectType?.projecTypeName}</span>,
        },
          {
            title: "project Start Date",
            align: "left",
            val: "projectStartDate",
            render: (rowData) => <span>{rowData?.projectStartDate}</span>,
        },
         {
            title: "project End Date",
            align: "left",
            val:"projectEndDate",
            render: (rowData) => <span>{rowData?.projectEndDate}</span>,
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
            title: "Renewal",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[6])}
                    >
                        <FaIcons.FaRecycle/>
                    </span>
                   
                </>
            ),
        },

        {
            title: "Upload",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[5])}
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
                        onClick={showFormHandler(rowData, actions[4])}
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
                        onClick={showFormHandler(rowData, actions[3])}
                    >
                        <FaIcons.FaProjectDiagram />
                    </span>
                   
                </>
            ),
        },
          {
                    title: "Pdf",
                    align: "center",
                    render: (rowData) => (
                        <>
                            <span
                                style={{ cursor: "pointer", color: "red" }}
                                onClick={showFormHandler(rowData, actions[8])}
                            >
                                <FaIcons.FaPrint />
                            </span>
                        </>
                    ),
                },
        // {
        //     title: "Edit",
        //     align: "center",
        //     render: (rowData) => (
        //         <>
        //             <span
        //                 style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
        //                 onClick={showFormHandler(rowData, actions[0])}
        //             >
        //                 <FaIcons.FaEdit />
        //             </span>
                   
        //         </>
        //     ),
        // },

       
        // {
        //     title: "Delete",
        //     align: "center",
        //     render: (rowData) => (
        //         <>
        //               <span
        //                 style={{ cursor: "pointer", color: "red" }}
        //                 onClick={showFormHandler(rowData, actions[1])}
        //             >
        //                 <FaIcons.FaTrash />
        //             </span>
        //         </>
        //     ),
        // },
    ];
};

export default AMCTable;
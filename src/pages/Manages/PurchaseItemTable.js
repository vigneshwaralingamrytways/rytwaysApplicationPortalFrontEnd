import React from "react";
import * as FaIcons from "react-icons/fa";

const PurchaseItemTable = (showFormHandler, actions,serviceType) => {
    return [

        //    {
        //         title: "S.No",
        //         align: "left",
        //         val: "sNo",
        //         render: (rowData) => <span>{rowData?.sNo}</span>,
        //     },
        {
              title: "Item Description",
            align: "left",
            val: "itemDescription",

            render: (rowData) => <span>{rowData?.itemDescription}</span>,
        },

        // {
        //     title: "SAC Code",
        //     align: "right",
        //     val: "sacCode",
        //     render: (rowData) => <span>{rowData?.sacCode}</span>,
        // },
        // {
        //     title: "Service Type",
        //     align: "left",
        //     val: "serviceTypeName",
        //     render: (rowData) => <span>{rowData?.manageServiceType?.serviceTypeName}</span>,
        // },
         {
            title: "Service Type",
            align: "left",
            val: "serviceTypeId",
            render: (rowData) => {
                const service = serviceType?.find(
                    (s) => String(s.value) === String(rowData?.serviceTypeId)
                );
                return <span>{service?.label || "-"}</span>;
            },
        },
        {
            title: "Amount",
            align: "right",
            val: "amount",
            render: (rowData) => <span>{rowData?.amount}</span>,
        },
        {
            title: "Tax (%)",
            align: "right",
            val: "tax",
            render: (rowData) => <span>{rowData?.tax}%</span>,
        },
        // {
        //     title: "CGST",
        //     align: "right",
        //     val: "cgstAmount",
        //     render: (rowData) => {
        //         // return (

        //         <span style={{ display: "flex", justifyContent: 'space-between', width: '100%' }}>
        //             <span style={{ textAlign: 'right' }}>  test</span>
        //             <span style={{ textAlign: 'right' }}>  test2</span>
        //         </span>



        //         // )            ;
        //     }
        // },
        // {
        //     title: "SGST",
        //     align: "right",
        //     // val: "sgstAmount",
        //     // render: (rowData) => <span>{rowData?.sgstAmount}</span>,

        // },
        // {
        //     title: "IGST",
        //     align: "right",
        //     val: "igstAmount",
        //     render: (rowData) => <span>{rowData?.igstAmount}</span>,
        // },
        {
            title: "Total",
            align: "right",
            val: "netTotal",
            render: (rowData) => <span>{rowData?.netTotal}</span>,
        },
        {
            title: "Edit",
            align: "left",
            render: (rowData) => (
                <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={showFormHandler(rowData, actions[0])}
                >
                    <FaIcons.FaEdit />
                </span>
            ),
        },
        {
            title: "Delete",
            align: "center",
            render: (rowData) => (
                
                
                
                <span
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={showFormHandler(rowData, actions[1])}
                >
                    <FaIcons.FaTrash />
                </span>
            ),
        },

    ];
};

export default PurchaseItemTable;

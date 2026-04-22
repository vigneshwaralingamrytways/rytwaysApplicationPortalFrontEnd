import React from "react";
import * as FaIcons from "react-icons/fa";

const SalesItemTable = (showFormHandler, actions,serviceType) => {
    return [
     
        // {
        //     title: "SAC Code",
        //     align: "center",
        //     val: "sacCode",
        //     render: (rowData) => <span>{rowData?.sacCode}</span>,
        // },
           {
            title: "Description",
            align: "left",
            val: "itemDescription",
            render: (rowData) => <span>{rowData?.itemDescription}</span>,
        },
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
        //         return (
        //             <span>
        //                 <span>{rowData?.cgstTaxRate}</span>
        //                 <span>{rowData?.cgstAmount}</span>
        //             </span>
        //         );
        //     }
        // },
        // {
        //     title: "SGST",
        //     align: "right",
        //     val: "sgstAmount",
        //     render: (rowData) => {
        //         return (
        //             <span>
        //                 <span>{rowData?.sgstTaxRate}</span>
        //                 <span>{rowData?.sgstAmount}</span>
        //             </span>
        //         );
        //     }
        // },
        // {
        //     title: "IGST",
        //     align: "right",
        //     val: "igstAmount",
        //     render: (rowData) => {
        //         return (
        //             <span>
        //                 <span>{rowData?.igstTaxRate}</span>
        //                 <span>{rowData?.igstAmount}</span>
        //             </span>
        //         );
        //     }
        // },

        {
            title: "Net Total",
            align: "right",
            val: "netTotal",
            render: (rowData) => <span>{rowData?.netTotal}</span>,
        },

            {
              title: "Edit",
              align: "center",
              render: (row) => (
                <span
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={showFormHandler(row, actions[0])}
                >
                  <FaIcons.FaEdit />
                </span>
              ),
            },
            {
              title: "Delete",
              align: "center",
              render: (row) => (
                <span
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={showFormHandler(row, actions[1])}
                >
                  <FaIcons.FaTrash />
                </span>
              ),
            },
    ];
};

export default SalesItemTable;

import React from 'react';
import * as FaIcons from 'react-icons/fa';

export const InvoiceDetailsTable = (showFormHandler, showAddIcon = false, showDeleteIcon = false, deleted = "") => {

    return [
        {
            title: "Invoice No",
            align: "left",
            val: "invoiceNo",
            render: (row) => <span>{row.invoiceHeader?.invoiceNo}</span>,
        },
        {
            title: "Invoice Date",
            align: "left",
            val: "invoiceDate",
            render: (row) => <span>{row.invoiceHeader?.invoiceDate}</span>,
        },
        {
            title: "Customer Name",
            align: "left",
            val: "customerName",
            render: (row) => (
                <span>{row.invoiceHeader?.customer?.customerName}</span>
            ),
        },
        {
            title: "Gross Amount",
            align: "right",
            render: (row) => <span>{row.paymentDetails?.grossAmount}</span>,
        },
        {
            title: "Total GST",
            align: "right",
            render: (row) => <span>{row.paymentDetails?.totalGst}</span>,
        },
        {
            title: "Net Total",
            align: "right",
            render: (row) => <span>{row.paymentDetails?.netTotal}</span>,
        },
        // {
        //     title: "Paid Amount",
        //     align: "right",
        //     val: "paidAmount",
        //     render: (row) => <span>{row.paymentDetails?.paidAmount}</span>,
        // },
        {
            title: "Balance Amount",
            align: "right",
            val: "balanceAmount",
            render: (row) => <span>{row.paymentDetails?.balanceAmount}</span>,
        }, ...(showAddIcon ? [{
            title: 'Add',
            align: 'center',
            render: rowData => (
                rowData?.isSaved ? <FaIcons.FaCheck style={{ color: "green" }} /> :
                    <FaIcons.FaPaperPlane onClick={showFormHandler(rowData, "Add")} style={{ cursor: "pointer" }} />
            )
        }] : []),
        ...(showDeleteIcon ? [{
            title: 'Delete',
            align: 'center',
            render: rowData => (
                <FaIcons.FaTrash onClick={showFormHandler(rowData, deleted)} style={{ cursor: "pointer", color: 'red' }} />
            )
        }] : []),
    ];
};

export default InvoiceDetailsTable;
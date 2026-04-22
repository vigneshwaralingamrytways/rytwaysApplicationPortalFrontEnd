import React from "react";
import * as FaIcons from "react-icons/fa";

const ViewTransactionTable = (showFormHandler, actions, isReconcile, selectedTransactionId, onDebitTypeChange, isMapped) => {
    const columns = [];
    if (isMapped) {
        columns.push(
            {
                title: "Customer Name",
                align: "center",
                render: (rowData) => <span>{rowData?.customer?.customerName}</span>,
            },
            {
                title: "Voucher No",
                align: "center",
                name: "voucherNo",
                render: (rowData) => <span>{rowData?.voucherNo}</span>,
            },

            {
                title: "Account No",
                align: "center",
                render: (rowData) => <span>{rowData?.companyBankAccount?.accountNo}</span>,
            },
            {
                title: "Transaction Date",
                align: "left",
                render: (rowData) => <span>{rowData?.transactionDate}</span>,
            },
            {
                title: "Total Amount",
                align: "right",
                render: (rowData) => <span>{rowData?.totalAmount}</span>,
            },
            {
                title: "Tds",
                align: "right",
                render: (rowData) => <span>{rowData?.tds}</span>,
            },
            {
                title: "Balance Amount",
                align: "right",
                render: (rowData) => <span>{rowData?.balanceAmount || 0}</span>,
            },
            // {
            //     title: "Transaction Type",
            //     align: "left",
            //     render: (rowData) => <span>{rowData?.transactionType}</span>,
            // }
        );

    }
    if (!isReconcile && !isMapped) {
        columns.push(
            {
                title: "Transaction Date",
                align: "left",
                render: (rowData) => <span>{rowData?.transDate}</span>,
            },
            {
                title: "Transaction Party",
                align: "left",
                render: (rowData) => <span>{rowData?.transParty}</span>,
            },
            {
                title: "Amount",
                align: "right",
                render: (rowData) => (
                    <span style={{ color: rowData?.transType === "CR" ? "green" : "red" }}>
                        {rowData?.amount}
                    </span>
                ),
            },
            {
                title: "Type",
                align: "center",
                render: (rowData) => (
                    <span style={{ color: rowData?.transType === "CR" ? "green" : "red" }}  >
                        {rowData?.transType}
                    </span>
                ),
            },
            {
                title: "Bank",
                align: "center",
                render: (rowData) => <span>{rowData?.bank}</span>,
            },
           
              {
                title: "AccountNo",
                align: "center",
                render: (rowData) => <span>{rowData?.accountNo}</span>,
            },
           
            
            {
                title: "Transaction Description",
                align: "left",
                render: (rowData) => (
                    <span>{rowData?.transDesc}</span>
                ),
            },


        );
    }
    if (isMapped) {
        columns.push(
            {
                title: "Bank",
                align: "left",
                name: "bankName",
                render: (rowData) => <span>{rowData?.companyBankAccount?.bankName}</span>,
            },
            {
                title: "Status",
                align: "center",
                render: (rowData) => {
                    const status = Number(rowData?.statusId);
                    let text = "Not Mapped";
                    let color = "red";
                    if (status === 29) { text = "Mapped"; color = "green"; }
                    if (status === 30) { text = "Partially Mapped"; color = "orange"; }
                    if (status === 31) { text = "Not Mapped"; color = "red"; }

                    return <span style={{ color, fontWeight: "bold" }}>{text}</span>;
                }
            },

            {
                title: "Mapping",
                align: "center",
                render: (rowData) => {
                    if (Number(rowData?.statusId) === 29) {
                        return null;
                    }
                    return (
                        <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={showFormHandler(rowData, "Mapping")}
                        >
                            <FaIcons.FaConnectdevelop title="Link Transaction" />
                        </span>
                    );
                }
            },

            {
                title: "Mapped",
                align: "center",
                render: (rowData) => {
                    if (Number(rowData?.statusId) === 31) {
                        return null;
                    } return (
                        <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={showFormHandler(rowData, "MappedLink")}
                        >
                            <FaIcons.FaLink title="Link Transaction" />
                        </span>
                    );
                }
            }
            // 

        )
    }


    // columns.push({
    //     title: "Action",
    //     align: "center",
    //     render: (rowData) => {
    //         const isSelected =
    //             rowData.transactionId === selectedTransactionId;

    //         if (isReconcile && isSelected && rowData.transactionType === "DEBIT") {
    //             return (
    //                 <select
    //                     defaultValue=""
    //                     onChange={(e) => onDebitTypeChange(e.target.value)}
    //                 >
    //                     <option value="">Select</option>
    //                     <option value="PURCHASE">Purchase</option>
    //                     <option value="EXPENSE">Expense</option>
    //                 </select>
    //             );
    //         }
    //         return (
    //             <span
    //                 style={{ cursor: "pointer" }}

    //                 onClick={showFormHandler(rowData, actions[0])}
    //             >
    //                 <FaIcons.FaLink />
    //             </span>
    //         );
    //     },
    // });


    return columns;
};

export default ViewTransactionTable;

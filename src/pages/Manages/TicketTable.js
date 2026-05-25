
import React from "react";
import * as FaIcons from "react-icons/fa";
const TicketTable = (showFormHandler, actions, lists) => {
    const { ticketType, issueType, customerList } = lists || {};

    return [
        {
            title: "Ticket No",
            align: "left",
            val: "ticketNo",
            render: (rowData) => {

                return <span>{rowData?.ticketNo}</span>;
            },
        },
        {
            title: "Customer Name",
            align: "left",
            val: "customerName",
            render: (rowData) => {
                const customer = customerList?.find(c => c.value === rowData.customerId);
                return <span>{customer?.label || rowData?.customerName}</span>;
            }
        },

        {
            title: "Ticket Description",
            align: "left",
            val: "ticketDescription",
            render: (rowData) => <span>{rowData?.ticketDescription}</span>,
        },
        {
            title: "Ticket Type",
            align: "left",
            val: "ticketTypeName",
            render: (rowData) => {
                const type = ticketType?.find(t => t.value === rowData.ticketTypeId);
                return <span>{type?.label}</span>;
            }
        },
        {
            title: "Issue Type",
            align: "left",
            val: "issueTypeName",
            render: (rowData) => {
                const issue = issueType?.find(i => i.value === rowData.issueTypeId);
                return <span>{issue?.label}</span>;
            }
        },
        {
            title: "Priority Type",
            align: "left",
            val: "priorityType",
            render: (rowData) => <span>{rowData?.priorityType}</span>,
        }, {
            title: "Expected On",
            align: "left",
            val: "expectedTime",
            render: (rowData) => <span>{rowData?.expectedTime}</span>,
        },
        {
            title: "Ticket Raised By",
            align: "left",
            val: "ticketRaisedBy",
            render: (rowData) => <span>{rowData?.ticketRaisedBy}</span>,
        },
        {
            title: "Assign",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", }}
                        onClick={showFormHandler(rowData, actions[3])}
                    >
                        <FaIcons.FaHandHolding />
                    </span>

                </>
            ),
        },

        // {
        //     title: "Status",
        //     align: "left",
        //     val: "status",
        //     render: (rowData) => (
        //         <span style={{

        //         }}>
        //             {rowData?.status || rowData?.statusName || 'Open'}
        //         </span>
        //     ),
        // },


        {
            title: "Edit",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", }}
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
                        style={{ cursor: "pointer", color: "blue", }}
                        onClick={showFormHandler(rowData, actions[1])}
                    >
                        <FaIcons.FaTrash />
                    </span>

                </>
            ),
        },
    ];
};

export default TicketTable;
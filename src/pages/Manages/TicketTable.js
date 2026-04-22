
import React from "react";
import * as FaIcons from "react-icons/fa";

const TicketTable = (showFormHandler, actions, isManage) => {
    return [
  {
            title: "Ticket No",
            align: "left",
            val: "ticketNo",
            render: (rowData) => {

                return <span>{rowData?.ticketNo }</span>;
            },
        },
        {
            title: "Customer Name",
            align: "left",
            val: "customerName",
            render: (rowData) => <span>{rowData?.customer?.customerName || rowData?.customerName}</span>,
        },
      
        {
            title: "Ticket Description",
            align: "left",
            val: "ticketDescription",
            render: (rowData) => <span>{rowData?.ticketDescription }</span>,
        },
        {
            title: "Ticket Type",
            align: "left",
            val: "ticketTypeName",
            render: (rowData) => <span>{rowData?.ticketType?.ticketTypeName }</span>,
        },
        {
            title: "Issue Type",
            align: "left",
            val: "issueTypeName",
            render: (rowData) => <span>{rowData?.issueType?.issueTypeName}</span>,
        }, 
         {
            title: "Priority Type",
            align: "left",
            val: "priorityType",
            render: (rowData) => <span>{rowData?.priorityType}</span>,
        },  {
            title: "Expected Date",
            align: "left",
            val: "expectedDate",
            render: (rowData) => <span>{rowData?.expectedDate}</span>,
        },
        {
            title: "Ticket Raised By",
            align: "left",
            val: "ticketRaisedBy",
            render: (rowData) => <span>{rowData?.ticketRaisedBy }</span>,
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
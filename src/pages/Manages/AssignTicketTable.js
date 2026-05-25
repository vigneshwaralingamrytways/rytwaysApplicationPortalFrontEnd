import React from "react";
import * as FaIcons from "react-icons/fa";

const AssignTicketTable = (showFormHandler, actions) => {
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
       
        // {
        //     title: "Ticket Description",
        //     align: "left",
        //     val: "ticketDescription",
        //     render: (rowData) => <span>{rowData?.ticketDescription || rowData?.description}</span>,
        // },
        
        {
            title: "Issue Type",
            align: "left",
            val: "issueTypeName",
            render: (rowData) => <span>{rowData?.issueType?.issueTypeName}</span>,
        },
        {
            title: "Expected On",
            align: "left",
            val: "expectedTime",
            render: (rowData) => <span>{rowData?.expectedTime}</span>,
        },
        {
            title: "Assigned To",
            align: "left",
            val: "employeeName",
            render: (rowData) => <span>{rowData?.employee?.employeeName  }</span>,
        },
        {
            title: "Assigned On",
            align: "left",
            val: "assignedOnTime",
            render: (rowData) => <span>{rowData?.assignedOnTime}</span>,
        },
        {
            title: "Status",
            align: "left",
            value: "status",

            render: (row) => {
                const currentStatus = row.status;
                const handleChange = (e) => {
                    const newValue = e.target.value;
                    
                }
                return (
                    <select
                        value={currentStatus}
                        onChange={handleChange}
                    // disabled={true}
                    >
                        <option value="Not Received">open</option>
                        <option value="Partly Received">In Progress</option>
                        <option value="Received">Closed</option>
                    </select >

                );
            },
        },


        // {
        //     title: "Assign",
        //     align: "center",
        //     render: (rowData) => (
        //         <>
        //             <span
        //                 style={{ cursor: "pointer", color: "blue", }}
        //                 onClick={showFormHandler(rowData, actions[0])}
        //             >
        //                 <FaIcons.FaHandHolding />
        //             </span>

        //         </>
        //     ),
        // },
        // {
        //     title: "Start Time ",
        //     align: "center",
        //     render: (rowData) => (
        //         <>
        //             <span
        //                 style={{ cursor: "pointer", color: "blue", }}
        //                 onClick={showFormHandler(rowData, "Start")}
        //             >
        //                 <FaIcons.FaClock />
        //             </span>

        //         </>
        //     ),
        // },
         {
            title: "Edit",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", }}
                        onClick={showFormHandler(rowData, actions[1])}
                    >
                        <FaIcons.FaEdit/>
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
                        onClick={showFormHandler(rowData, actions[2])}
                    >
                        <FaIcons.FaTrash/>
                    </span>

                </>
            ),
        },

    ];
};

export default AssignTicketTable;
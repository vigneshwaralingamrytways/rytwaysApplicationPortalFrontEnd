import React from "react";
import * as FaIcons from "react-icons/fa";

const ManageTicketTable = (showFormHandler,
    actions,
    activityLogs,
    editingStatusId,
    setEditingStatusId) => {
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
            render: (rowData) => <span>{rowData?.customer?.customerName || rowData?.customerName}</span>,
        },

        // {
        //     title: "Ticket Description",
        //     align: "left",
        //     val: "ticketDescription",
        //     render: (rowData) => <span>{rowData?.ticketDescription || rowData?.description}</span>,
        // },
        // {
        //     title: "Type of Problem",
        //     align: "left",
        //     val: "problemType",
        //     render: (rowData) => <span>{rowData?.problemType}</span>,
        // },
        {
            title: "Issue Type",
            align: "left",
            val: "issueTypeName",
            render: (rowData) => <span>{rowData?.issueType?.issueTypeName}</span>,
        },
        // {
        //     title: "Expected Date",
        //     align: "left",
        //     val: "expectedDate",
        //     render: (rowData) => <span>{rowData?.expectedDate}</span>,
        // },
        {
            title: "Assigned To",
            align: "left",
            val: "employeeName",
            render: (rowData) => <span>{rowData?.employee?.employeeName}</span>,
        },
        {
            title: "Assigned On",
            align: "left",
            val: "assignedOnDate",
            render: (rowData) => <span>{rowData?.assignedOnDate}</span>,
        },
        {
            title: "Status",
            align: "left",
            value: "status",

            render: (rowData) => {
                const isEditing = editingStatusId === rowData.ticketId;
                const currentStatus = rowData.status?.statusName;
                const handleChange = (e) => {
                    const newStatus = e.target.value;
                    const logs = activityLogs?.[rowData.ticketId] || [];
                    const isRunning = logs.length > 0 && logs[logs.length - 1].endTime === null;

                    if (newStatus == "15" && isRunning) {
                        alert("Please stop the progress timer before marking as Completed!");
                        setEditingStatusId(null);
                        return
                    }

                    else if (newStatus === "28") {
                        showFormHandler(rowData, "Close")();
                    } else {
                        showFormHandler(rowData, "UpdateStatus")()(newStatus);
                    }
                    setEditingStatusId(null);
                };
                if (isEditing) {
                    return (
                        <select

                            value={rowData.status?.statusId || "13"}
                            onChange={handleChange}

                        >
                            <option value="13">Open</option>
                            <option value="14">In Progress</option>
                            <option value="15">Completed</option>
                            <option value="28">Closed</option>
                        </select>
                    );
                }
                return (
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => setEditingStatusId(rowData.ticketId)}
                    >
                        {rowData.status?.statusName}
                    </span>
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
        //     title: "Activate Work",
        //     align: "center",
        //     render: (rowData) => {
        //         const activatedOn = rowData.startedOn;

        //         if (activatedOn) {
        //             return <span>{activatedOn}</span>;
        //         }

        //         return (
        //             <span
        //                 style={{ cursor: "pointer", color: "red" }}
        //                 onClick={showFormHandler(rowData, "Activate")}
        //             >
        //                 <FaIcons.FaUser/>
        //             </span>
        //         );
        //     },
        // },
        {
            title: "Progress",
            align: "center",
            render: (rowData) => {
                const logs = activityLogs?.[rowData.ticketId] || [];


                const isComplete = rowData?.status?.statusId === 15 || rowData?.statusId === "15";
                if (isComplete) {
                    return (
                        <FaIcons.FaHourglassStart
                            style={{ color: "gray", cursor: "not-allowed" }}
                        />
                    )
                }


                if (logs.length === 0) {
                    return (
                        <FaIcons.FaHourglassStart
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={showFormHandler(rowData, "Start")}
                        />
                    );
                }

                const lastLog = logs[logs.length - 1];
                const isRunning = lastLog.endTime === null

                const handleClick = () => {
                    if (isComplete) return;
                    if (isRunning) {
                        showFormHandler(rowData, "Stop")();
                    } else {
                        showFormHandler(rowData, "Start")();
                    }
                };
                return (
                    <FaIcons.FaHourglassStart
                        style={{
                            color: isRunning ? "green" : "red",
                            cursor: "pointer"
                        }}
                        onClick={handleClick}
                    />
                );
                // <>
                //     <span
                //         style={{ cursor: "pointer", color: "blue", }}
                //         onClick={showFormHandler(rowData, "Stop")}
                //     >
                //         <FaIcons.FaClock />
                //     </span>

                // </>
            }
        },
        {
            title: "Log",
            align: "center",
            // render: (rowData) => (
            //     <>
            //         <span
            //             style={{ cursor: "pointer", color: "blue", }}
            //             onClick={showFormHandler(rowData, "ViewLog")}
            //         >
            //             <FaIcons.FaClock />
            //         </span>

            //     </>
            // ),
            render: (rowData) => {

                const hasLogs = (activityLogs?.[rowData.ticketId] || []).length > 0;
                return (
                    <span
                        style={{
                            cursor: hasLogs ? "pointer" : "not-allowed",
                            color: hasLogs ? "blue" : "gray",

                        }}
                        onClick={hasLogs ? showFormHandler(rowData, "ViewLog") : null}
                    >
                        <FaIcons.FaListUl />
                    </span>
                );
            }
        },

    ];
};

export default ManageTicketTable;
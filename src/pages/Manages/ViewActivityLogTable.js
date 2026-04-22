import React from "react";
import * as FaIcons from "react-icons/fa";
const ViewActivityLogTable = () => {
    return [
        {
            title: "Start Time",
            align: "left",
            render: (rowData) => <span>{rowData?.startTime}</span>,
        },
        {
            title: "End Time",
            align: "left",
            render: (rowData) => (
                <span >
                    {rowData?.endTime === null ? "Not yet completed" : rowData?.endTime}
                </span>
            )
        },
    ];
};

export default ViewActivityLogTable;

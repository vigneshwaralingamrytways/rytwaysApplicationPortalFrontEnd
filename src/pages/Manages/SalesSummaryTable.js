import React from "react";
import * as FaIcons from "react-icons/fa";
const SalesSummaryTable = () => {
    return [
        {
            title: "Days",
            align: "left",
            render: (rowData) => <span>{rowData?.name}</span>,
        },
        {
            title: "Amount",
            align: "left",
            render: (rowData) => (
                <span >
                    ₹ {rowData?.value}
                </span>
            )
        },
    ];
};

export default SalesSummaryTable;

import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
//same like querycommenttable.js
 const CurrencyMasterTable = (showFormHandler, actions) => {
   
   
   
    return [
        // {Type:"hidden",
        //     title: "id",
        //     align: "center",
        //     render: (rowData) => <span>{rowData?.id}</span>,
        // },
        {
            title: "Currency Name",
            align: "left",
            val: "currencyName",
            render: (rowData) => <span>{rowData?.currencyName}</span>,
        },
        {
            title: "Currency Rate",
            align: "right",
            val: "currencyRate",
            render: (rowData) => <span>{rowData?.currencyRate}</span>,
        },
        {
            title: "currencySymbol",
            align: "left",
            val: "currencySymbol",
            render: (rowData) => <span>{rowData?.currencySymbol}</span>,
        },
        {
            title: "Action",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[0])}
                    >
                        <FaIcons.FaEdit />
                    </span>
                    {/* <span
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={showFormHandler(rowData, actions[1])}
                    >
                        <FaIcons.FaTrash />
                    </span> */}
                </>
            ),
        },
         {
            title: "Action",
            align: "center",
            render: (rowData) => (
                <>
                    {/* <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[0])}
                    >
                        <FaIcons.FaEdit />
                    </span> */}
                    <span
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={showFormHandler(rowData, actions[1])}
                    >
                        <FaIcons.FaTrash />
                    </span>
                </>
            ),
        },

    ];
};

export default CurrencyMasterTable;

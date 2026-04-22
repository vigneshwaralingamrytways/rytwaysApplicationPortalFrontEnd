import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
//same like curencymastertable.js
const BankAccountsTable = (showFormHandler, actions, statusList) => {



    return [


        {
            title: "Bank Name",
            align: "right",
            val: "bankName",
            render: (rowData) => <span>{rowData?.bankName}</span>,
        },
        {
            title: "Account Number",
            align: "left",
            val: "accountNo",
            render: (rowData) => <span>{rowData?.accountNo}</span>,
        },


        {
            title: "Branch",
            align: "left",
            val: "branch",
            render: (rowData) => <span>{rowData?.branch}</span>,
        },

        {
            title: "Status",
            align: "left",
            val: "status",
            render: (rowData) => {

                const statusObj = statusList?.find((s) => s.statusId == rowData?.status);
                return <span>{statusObj?.statusName}</span>;
            },
        },

        
        
        {
            title: "Upload",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[3])}
                    >
                        <FaIcons.FaUpload />
                    </span>

                </>
            ),
        },
        {
            title: "Edit",
            align: "center",
            render: (rowData) => (
                <>
                    <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
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

export default BankAccountsTable;

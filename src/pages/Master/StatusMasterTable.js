import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
import StateMaster from "./StateMaster";
//same like curencymastertable.js
 const StatusMasterTable = (showFormHandler, actions) => {
   
   
   
    return [
        
        {
            title: "Status Name",
            align: "left",
            val: "statusName",
            render: (rowData) => <span>{rowData?.statusName}</span>,
        },
          
        {
            title: "Status Type",
            align: "left",
            val: "statusType",
            render: (rowData) => <span>{rowData?.statusType}</span>,
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

export default StatusMasterTable;

import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
import StateMaster from "./StateMaster";
//same like curencymastertable.js
 const IssueTypeTable = (showFormHandler, actions) => {
   
   
   
    return [
        
        {
            title: "Issue Type",
            align: "left",
            val: "issueTypeName",
            render: (rowData) => <span>{rowData?.issueTypeName}</span>,
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
                    {/* <span
                        style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                        onClick={showFormHandler(rowData, actions[0])}
                    >
                        <FaIcons.FaEdit /> */}
                    {/* </span> */}
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

export default IssueTypeTable;

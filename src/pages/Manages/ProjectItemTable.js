import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
//same like curencymastertable.js
const ProjectItemTable = (showFormHandler, actions) => {



    return [


         
        {
            title: "Description",
            align: "left",
            val: "description",
            render: (rowData) => <span>{rowData?.description}</span>,
        },
        {
            title: "Price INR",
            align: "left",
            val: "amount",
            render: (rowData) => <span>{rowData?.amount}</span>,
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

export default ProjectItemTable;
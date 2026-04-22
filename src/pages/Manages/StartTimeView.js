import React from "react";
import NewTable from "../../Components/NewTable/NewTable";
import StartTimeTable from "./ViewActivityLogTable";
import { Popupcard, classes } from "../../Components/CommonImports/CommonImports";
import ViewActivityLogTable from "./ViewActivityLogTable";

export default function StartTimeView({ rowData, onCancel,onEndClick }) {
    const tableData = [rowData];

    return (
        <div className={classes.container}>
            <Popupcard title="Ticket Progress" onClose={onCancel}>
                <NewTable
                    cols={ ViewActivityLogTable(onEndClick)}
                    data={tableData}
                    striped
                    title="Time Tracking"
                />
                <div style={{ padding: "10px", textAlign: "right" }}>
                    <button  onClick={onCancel}>
                        Close
                    </button>
                </div>
            </Popupcard>
        </div>
    );
}

import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
import {
    CreateForm,
    SimpleCard,
    Table,
    api,
    useFetch,
    alertActions,
    modalActions,
    useDispatch,
    useSelector,
    classes,
    Popupcard,
} from "../../Components/CommonImports/CommonImports";

const MarkAttendenceTable = (showFormHandler, actions, setAttendence, handleAttendanceChange, attendence, selectedDate) => {

    const { get, del, post, response, loading, error } = useFetch({ data: [] });


    return [

        {
            title: "Employee Name",
            align: "left",
            val: "employeedId",
            render: (rowData) => <span>{rowData?.employeeName}</span>,
        },
        {
            title: "Employee Department",
            align: "left",
            val: "departmentId",
            render: (rowData) => <span>{rowData?.departmentName}</span>,
        },
        {
            title: "Attendance",
            align: "left",
            val: "attendenceTypeName",
            render: (rowData) => (
                <select
                    
                    value={
                        rowData.attendenceTypeId ||
                        rowData.attendanceType?.attendenceTypeId ||
                        ""
                    }
                    onChange={(e) => {
                        const newTypeId = Number(e.target.value);
                        handleAttendanceChange(rowData, newTypeId);
                    }}
                >
                    <option value="">Select Status</option>
                   {attendence?.types?.map((t) => (
                            <option
                                key={t.attendenceTypeId}
                                value={t.attendenceTypeId}
                            >
                                {t.attendenceTypeName}
                            </option>
                        ))}
                </select>
            )
        }

        // {
        //     title: "Date",
        //     align: "left",
        //     val: "date",
        //     render: (rowData) => <span>{rowData?.date}</span>,
        // },
        // {
        //     title: "Attendence ",
        //     align: "left",
        //     val: "attendenceTypeName",
        // render: (rowData) => <span>{rowData?.attendenceTypeName}</span>,
        //     render: (rowData) => (
        //         <select
        //             value={rowData.attendenceTypeId}
        //             onChange={async (e) => {
        //                 const newTypeId = Number(e.target.value);


        //                 if (!rowData.markAttendanceId) {
        //                     const data = {
        //                         employee: { employeeId: rowData.employeeId },
        //                         department: { departmentId: rowData.departmentId },
        //                         attendanceType: { attendenceTypeId: newTypeId },
        //                         markAttendanceDate: selectedDate
        //                     };

        //                     const resp = await post(api + "/markAttendence/create", data);

        //                     if (response.ok) {
        //                         setAttendence(prev => ({
        //                             ...prev,
        //                             list: prev.list.map(r =>
        //                                 r.employeeId === rowData.employeeId
        //                                     ? {
        //                                         ...r,
        //                                         markAttendanceId: resp.markAttendanceId,
        //                                         attendenceTypeId: newTypeId
        //                                     }
        //                                     : r
        //                             )
        //                         }));
        //                     }
        //                 }


        //                 else {
        //                     const resp = await post(
        //                         api + `/markAttendence/update/${rowData.markAttendanceId}/${newTypeId}`
        //                     );


        //                     if (response.ok) {
        //                         setAttendence(prev => ({
        //                             ...prev,
        //                             list: prev.list.map(r =>
        //                                 r.markAttendanceId === resp.markAttendanceId
        //                                     ? {
        //                                         ...r,
        //                                         attendenceTypeId: newTypeId
        //                                     }
        //                                     : r
        //                             )
        //                         }));
        //                     }
        //                 }
        //             }}
        //         >
        //             {attendence.types.map(t => (
        //                 <option
        //                     key={t.attendenceTypeId}
        //                     value={t.attendenceTypeId}
        //                 >
        //                     {t.attendenceTypeName}
        //                 </option>
        //             ))}
        //         </select>
        //     )

        // },
        // {
        //     title: "Edit",
        //     align: "center",
        //     render: (rowData) => (
        //         <>
        //             <span
        //                 style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
        //                 onClick={showFormHandler(rowData, actions[0])}
        //             >
        //                 <FaIcons.FaEdit />
        //             </span>

        //         </>
        //     ),
        // },


        // {
        //     title: "Delete",
        //     align: "center",
        //     render: (rowData) => (
        //         <>
        //             {/* <span
        //                 style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
        //                 onClick={showFormHandler(rowData, actions[0])}
        //             >
        //                 <FaIcons.FaEdit /> */}
        //             {/* </span> */}
        //             <span
        //                 style={{ cursor: "pointer", color: "red" }}
        //                 onClick={showFormHandler(rowData, actions[1])}
        //             >
        //                 <FaIcons.FaTrash />
        //             </span>
        //         </>
        //     ),
        // },
    ];
};

export default MarkAttendenceTable;

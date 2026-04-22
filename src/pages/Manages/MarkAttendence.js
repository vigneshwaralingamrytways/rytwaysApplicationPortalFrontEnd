import React, { useCallback, useEffect, useState } from "react";
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
import MarkAttendenceTable from "./MarkAttendenceTable";

import NewTable from "../../Components/NewTable/NewTable";
import NewMarkAttendence from "./NewMarkAttendence";

const MarkAttendence = (props) => {

    const { get, del, post, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();

    const [attendence, setAttendence] = useState({
        list: [],
        types: []
    });

    const [attendanceTypes, setAttendanceTypes] = useState([]);

    const [defaultValues, setDefaultValues] = useState({});
    const [employeeList, setEmployeeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);

    const [showAlert, alertMessage, selectedData, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
        state.modalProps.selectedData,
    ]);



    const AlertHandler = (alertContent, alertType) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: !showAlert,
                alertMessage: alertContent,
                alertVariant: alertType,
            })
        );
    };
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );



    const loadDataForDate = async (dateToLoad) => {
        try {
            let types = attendence.types;
            if (types.length === 0) {
                types = await get(`${api}/attendenceType/getall?t=${Date.now()}`);
                setAttendence(prev => ({ ...prev, types }));
            }

            const presentObj = types.find(
                t => t.attendenceTypeName.toLowerCase() === "present"
            );
            const defaultAttedenceId = presentObj ? presentObj.attendenceTypeId : 83;

            let employees = employeeList;
            if (employees.length === 0) {
                get(`${api}/markAttendence/getall?t=${Date.now()}`);
                employees = await get(`${api}/manageEmployee/getall?t=${Date.now()}`);
                setEmployeeList(employees);
            }

            let allAttendance = await get(`${api}/markAttendence/getall?t=${Date.now()}`);

            // let dateAttendance = allAttendance.filter(
            //     a => a.markAttendanceDate === dateToLoad

            // );
            let dateAttendance = allAttendance.filter(a => {
                if (!a.markAttendanceDate) return false;
                return String(a.markAttendanceDate).split("T")[0] === dateToLoad;
            });
            if (!dateAttendance || dateAttendance.length === 0) {
                for (const emp of employees) {
                    await post(api + "/markAttendence/create", {
                        employee: { employeeId: emp.employeeId },
                        department: { departmentId: emp.department?.departmentId },
                        attendanceType: { attendenceTypeId: defaultAttedenceId },
                        markAttendanceDate: dateToLoad
                    });
                }

                allAttendance = await get(`${api}/markAttendence/getall?t=${Date.now()}`);
                dateAttendance = allAttendance.filter(
                    a => a.markAttendanceDate === dateToLoad
                );
            }

            // if (dateAttendance.length === 0&& employees.length > 0) {
            //     for (let i = 0; i < employees.length; i++) {
            //         const emp = employees[i];
            //         await post(api + "/markAttendence/create", {
            //             employee: { employeeId: emp.employeeId },
            //             department: { departmentId: emp.department?.departmentId },
            //             attendanceType: { attendenceTypeId: defaultAttedenceId },
            //             markAttendanceDate: dateToLoad
            //         });
            //     }




            //     allAttendance = await get(api + "/markAttendence/getall");
            //     dateAttendance = allAttendance.filter(
            //         a => a.markAttendanceDate === dateToLoad
            //     );
            // }

            const merged = employees.map(emp => {
                const att = dateAttendance.find(
                    a => a.employee?.employeeId === emp.employeeId
                );

                return {
                    employeeId: emp.employeeId,
                    employeeName: emp.employeeName,
                    departmentId: emp.department?.departmentId,
                    departmentName: emp.department?.departmentName,
                    markAttendanceId: att?.markAttendanceId || null,
                    attendenceTypeId:
                        att?.attendanceType?.attendenceTypeId || defaultAttedenceId,
                    attendanceType:
                        att?.attendanceType || { attendenceTypeId: defaultAttedenceId }
                };
            });

            setAttendence(prev => ({ ...prev, list: merged }));
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        loadDataForDate(selectedDate);

    }, [selectedDate]);
    // useEffect(() => {
    //     const loadEmployees = async () => {
    //         try {
    //             const data = await get(api + "/manageEmployee/getall");

    //             console.log(data);
    //             if (response.ok) {
    //                 setEmployeeList(data);
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     loadEmployees();
    // }, []);

    // useEffect(() => {
    //     const loadDepartments = async () => {
    //         try {
    //             const data = await get(api + "/department/department");

    //             console.log(data);
    //             if (response.ok) {
    //                 setDepartmentList(data);
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     loadDepartments();
    // }, []);

    // useEffect(() => {
    //     const loadAttendanceTypes = async () => {
    //         try {
    //             const data = await get(api + "/attendenceType/getall");
    //             console.log(data);
    //             if (response.ok) {
    //                 setAttendence(prev => ({
    //                     ...prev,
    //                     types: data
    //                 }));
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };

    //     loadAttendanceTypes();
    // }, []);

    // useEffect(() => {
    //     const loadAttendence = async () => {
    //         try {
    //             const data = await get(api + "/markAttendence/getall");
    //             console.log(data);
    //             if (response.ok) {
    //                 setAttendence(prev => ({
    //                     ...prev,
    //                     list: data
    //                 }));
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     loadAttendence();
    // }, []);

    const templateForFilter = {
        fields: [
            {

                title: "date",
                type: "date",
                name: "date",
                contains: "date",
                validationProps: "date is required",
               
            },]
    }
    const template = {
        fields: [
            {

                title: "Employee name",
                type: "select",
                name: "employeeId",
                contains: "text",
                options: employeeList,
                validationProps: "employee Name is required",
                inpprops: {}
            },
            {

                title: "Employee Department",
                type: "select",
                name: "employeeDepartmentId",
                contains: "text",
                options: departmentList,
                validationProps: "employee Department is required",
                inpprops: {},
            },
            {

                title: "date",
                type: "date",
                name: "date",
                contains: "date",
                validationProps: "date is required",
                inpprops: {}
            },
            {

                title: "Attendence Type",
                type: "select",
                name: "attendenceTypeId",
                contains: "text",
                options: attendence.types,
                validationProps: "attendence type is required",
                inpprops: {}
            },



        ]
    }

    // useEffect(() => {
    //     const loadData = async () => {
    //         const employees = await get(api + "/manageEmployee/getall");
    //         const attendance = await get(api + "/markAttendence/getall");
    //         console.log("empl:", employees)
    //         console.log("..attende", attendance)
    //         if (response.ok) {
    //             const merged = employees.map(emp => {
    //                 const att = attendance.find(
    //                     a => a.employee?.employeeId === emp.employeeId
    //                 );

    //                 return {
    //                     employeeId: emp.employeeId,
    //                     employeeName: emp.employeeName,
    //                     departmentId: emp.department?.departmentId,
    //                     departmentName: emp.department?.departmentName,

    //                     markAttendanceId: att?.markAttendanceId || null,
    //                     attendenceTypeId: att?.attendanceType?.attendenceTypeId || 1
    //                 };
    //             });


    //             console.log("..", merged)
    //             setAttendence(prev => ({
    //                 ...prev,
    //                 list: merged
    //             }));
    //         }
    //     };

    //     loadData();
    // }, []);


    //
    //     const saveAttendance = async (values) => {
    //     console.log("values comes for save data",values)
    //     const data = {
    //         employee: { employeeId: values.employeeId },
    //         department: { departmentId: values.departmentId },
    //         attendanceType: { attendenceTypeId: values.attendenceTypeId },
    //         markAttendanceDate: values.markAttendanceDate
    //     };
    // console.log("data to backend",data)
    //     const resp = await post(api + "/markAttendence/create", data);

    //     if (response.ok) {
    //         AlertHandler("Attendance saved", "success");

    //         setAttendence(prev => ({
    //             ...prev,
    //             list: [...prev.list, resp]
    //         }));
    //     } else {
    //         AlertHandler("Failed to save attendance", "danger");
    //     }
    // };


    //     // 
    const handleAttendanceChange = async (rowData, newTypeId) => {
        if (!rowData.markAttendanceId) {
            const data = {
                employee: { employeeId: rowData.employeeId },
                department: { departmentId: rowData.departmentId },
                attendanceType: { attendenceTypeId: newTypeId },
                markAttendanceDate: selectedDate
            };

            const resp = await post(api + "/markAttendence/create", data);

            if (resp && resp.markAttendanceId) {
                setAttendence(prev => ({
                    ...prev,
                    list: prev.list.map(r =>
                        r.employeeId === rowData.employeeId
                            ? {
                                ...r,
                                markAttendanceId: resp.markAttendanceId,
                                attendenceTypeId: newTypeId,
                                attendanceType: resp.attendanceType || { attendenceTypeId: newTypeId }
                            }
                            : r
                    )
                }));
            }
        } else {
            const resp = await post(
                api + `/markAttendence/update/${rowData.markAttendanceId}/${newTypeId}`,
                {}
            );

            if (resp && resp.markAttendanceId) {
                setAttendence(prev => ({
                    ...prev,
                    list: prev.list.map(r =>
                        r.markAttendanceId === rowData.markAttendanceId
                            ? {
                                ...r,
                                attendenceTypeId: newTypeId,
                                attendanceType: resp.attendanceType
                            }
                            : r
                    )
                }));
            }
        }
    };

    const rowWiseFields = 3;
    const rowColors = ["#fff"];
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;

        return true;


    }



    const handleFilterSubmit = (val) => {

        AlertHandler("filter clicked", "success")
    }
    // function onSubmit(val) {

    //     console.log("resp==>,", response)
    //     // savestate(val);
    //     handleFilterSubmit(val);
    // }


    // const searchDetails = async (values) => {
    //     console.log("values", values)
    //     // if(values.clicked=="Search"){
    //     //   const orderapi = "/country/searchCountry";
    //     try {
    //         const returnObject = await post(api + "/", values);
    //         console.log("state from filter", returnObject)
    //         if (returnObject.length > 0) {
    //             console.log("returnObject", returnObject)
    //             setAttendence(prev => ({
    //                 ...prev,
    //                 list: returnObject
    //             }));

    //         } else {
    //             setAttendence([])
    //         }
    //     }
    //     catch (err) {
    //         console.log("err:" + err)
    //         setAttendence([]);
    //     }
    //     // }
    // }

    const onSubmit = (values) => {
        // console.log("filter..", values)
        // if (values?.date) {
        //     setSelectedDate(values.date);

        // }
        const today = new Date().toISOString().split("T")[0];

        const selected = values?.date || today;
        console.log("filter..", selected);

        setSelectedDate(selected);
    };



    const actions = ["Edit", "Delete"];
    const showFormHandler = (item, action) => () => {
        console.log(action);
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};
        if (isEdit || action === "Add") {
            dispatch(
                modalActions.showModalHandler({
                    selectedData: { ...formData },
                    modalWidth: '48%',
                    modalLeft: '26%',
                    selectedForm: (
                        <NewMarkAttendence
                            selectedItem={formData}
                            onCancel={() => dispatch(modalActions.hideModalHandler())}
                            // savestate={savestate}
                            template={template}
                            validate={validate}
                        />
                    ),

                    showModal: true,
                })
            );
        }
        //  else if (action === "Delete") {
        //     deletestate(item.stateId);
        // }
    }




    return (
        <div className={classes.container}>
            <NewTable
                cols={MarkAttendenceTable(
                    showFormHandler,
                    actions,
                    setAttendence,
                    handleAttendanceChange,
                    attendence,
                    selectedDate

                )}
                data={attendence.list || []}
                striped

                rows={25}
                title={`Mark Attendance (${selectedDate})`}
                showPlusCircle={false}
                handleAddClick={showFormHandler({}, "Add")}
                // handleAddClick={savestate}

                template={templateForFilter}
                rowwise={rowWiseFields}
                validate={validate}
                onSubmit={onSubmit}
                onCancel={props.onCancel}
                buttonName="Search"
            />


            {/* </Popupcard> */}

        </div>
    )
}
export default MarkAttendence;
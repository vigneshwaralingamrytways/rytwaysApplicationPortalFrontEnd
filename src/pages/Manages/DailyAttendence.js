import React, { useCallback, useContext, useEffect, useState } from "react";
// import NewPayment from "./NewPayment";
import { format } from "date-fns";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Calender from "./Calender";
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
    AuthContext,
} from "../../Components/CommonImports/CommonImports";
// import attendenceNameMasterTable from "./attendenceNameMasterTable";
// import attendenceCatagoryTable from './attendenceCatagoryTable';

import NewTable from "../../Components/NewTable/NewTable";



import DailyAttendenceTable from "./DailyAttendenceTable";
import { AiOutlineConsoleSql } from "react-icons/ai";



// const dummyattendence = [
//     {
//         attendenceId: 1,
//         employeeName: "name1",
//         department: "dept1",
//         attendance: [
//             { date: "2025-12-01", status: "present" },
//             { date: "2025-12-02", status: "absent" },
//             { date: "2025-12-03", status: "present" },
//             { date: "2025-12-04", status: "leave" },
//             { date: "2025-12-05", status: "present" },
//         ],
//     },
//     {
//         attendenceId: 2,
//         employeeName: "name2",
//         department: "dept2",
//         attendance: [
//             { date: "2025-12-01", status: "absent" },
//             { date: "2025-12-02", status: "present" },
//             { date: "2025-12-03", status: "leave" },
//             { date: "2025-12-04", status: "present" },
//             { date: "2025-12-05", status: "half" },
//         ],
//     },
// ];

// const dummyCalendarData = [
//     { date: "2025-12-01", status: "present" },
//     { date: "2025-12-02", status: "absent" },
//     { date: "2025-02-03", status: "present" },
//     { date: "2025-02-04", status: "leave" },
//     { date: "2025-02-05", status: "present" },]



const DailyAttendence = (props) => {

    const { get, del, post, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();
    const authCtx = useContext(AuthContext)
    const uId = authCtx.userId
    const isAdmin = authCtx.roleId == "1"
    const uName = authCtx.userName;
    const [attendence, setattendence] = useState([]);
    const [defaultValues, setDefaultValues] = useState({});
    const [statusList, setStatusList] = useState([]);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [calendarData, setCalendarData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [originalData, setOriginalData] = useState([]);



    const [selectedDate, setSelectedDate] = useState(new Date());

    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
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

    const onCalendarClick = (row) => {

        const employee = attendence.find(a => a.employeeName === row.employeeName);
        if (employee) {

            setCalendarData(employee.attendance);
            setOpenCalendar(true);
        }
    };
    const handleCalendarClose = () => {
        setOpenCalendar(false);
    }




    const template = {
        fields: [

            {
                title: "Employee Name",
                type: "text",
                contains: "text",
                name: "employeeName",
                validationProps: "Employee Name is required",
                inpprops: {}
            },


            {
                title: "Department",
                type: "text",
                contains: "text",
                name: "department",
                validationProps: "Employee Department is required",
                inpprops: {}
            },



        ],
    }






    const templateforfilter = {
        fields: [


            {
                title: "Employee Name",
                type: "text",
                name: "employeeName",
            },

        ]
    };


    const loadStatuses = useCallback(async () => {
        const data = await get(`${api}/attendence/getStatuses?ts=${Date.now()}`);
        if (response.ok) {
            setStatusList(
                data.map((item) => ({
                    value: item.id,
                    label: item.name
                }))
            );
        } else {
            // AlertHandler("Failed to load status list", "danger");
        }
    }, [get, response]);

    // useEffect(() => {
    //   loadStatuses();
    // }, [loadStatuses]);


    const loadDailyAttendance = useCallback(async () => {
        try {
            const data = await get(`${api}/markAttendence/getall?ts=${Date.now()}`);
            const allEmployee = await get(`${api}/manageEmployee/getall?ts=${Date.now()}`);
            console.log("datas..", data)
            console.log("all epmyee datas..", allEmployee)
            if (!response.ok || !Array.isArray(data)) return;

            const grouped = {};

            data.forEach(item => {
                const empId = item.employee?.employeeId;
                const date = item.markAttendanceDate
                const status = item.attendanceType?.attendenceTypeName;
                if (!grouped[empId]) {
                    // grouped[empId] = {
                    //     employeeId: empId,
                    //     employeeName: item.employee?.employeeName,
                    //     department: item.employee?.department?.departmentName,
                    //     attendance: {}
                    // };
                    grouped[empId] = {};
                }

                // grouped[empId].attendance.push({
                //     date: item.markAttendanceDate,
                //     status: item.attendanceType?.attendenceTypeName
                // });
                // grouped[empId].attendance[date] = item.attendanceType?.attendenceTypeName;
                grouped[empId][date] = status;

            });


            const finalData = allEmployee.map(emp => {

                const empId = emp.employeeId;
                const myAttendance = grouped[empId] || {}
                const formattedAttendance = Object.keys(myAttendance).map(date => ({
                    date: date,
                    status: myAttendance[date]
                }));
                // const att = Object.keys(emp.attendance).map(date => ({
                //     date: date,
                //     status: emp.attendance[date]
                // }));
                return {
                    employeeId: emp.employeeId,
                    employeeName: emp.employeeName,
                    department: emp.department?.departmentName || "",
                    attendance: formattedAttendance
                };
            })


            console.log(" date for attende", finalData)
            setattendence(finalData);
            setOriginalData(finalData);
        } catch (err) {
            console.log(err);
        }
    }, [get]);




    const saveattendence = async (val) => {
        console.log("values for snet to backend:", val)
        if (val.attendenceId) {
            const updateattendence = await post(api + "/attendence/update/" + val.attendenceId, val)
            console.log("Update response:", updateattendence);
            if (response.ok) {
                AlertHandler("attendence updated ", "success");

                // attendence
                setattendence((prev) =>
                    prev.map((c) => (c.attendenceId === updateattendence.attendenceId ? updateattendence : c))
                );
                setDefaultValues({});

                console.log("update resp passed:", response)
            }
            else {
                // AlertHandler("updation failed", "danger");
                console.log("update resp failed:", response)
            }

        }
        else {
            const newattendence = await post(api + "/attendence/create", val);
            console.log("attendence resp :", newattendence)

            if (response.ok) {
                AlertHandler("attendence saved ", "success");
                setattendence([...attendence, newattendence])
                setDefaultValues({});
                console.log("resp==>:", response);
            }
            else {
                console.log("resp==>:", response);
                // AlertHandler("attendence not saved", "danger")
            }
        }
    }


    const rowWiseFields = 3;
    function validate() {

    }



    const deleteattendence = async (attendenceId) => {
        const deleted = await del(api + "/attendence/deleteone/" + attendenceId);
        console.log("deleted::" + deleted);
        if (response.ok) {

            console.log("resp==>,", response)

            AlertHandler("attendence deleted ", "success");
            setattendence((prev) => prev.filter((c) => c.attendenceId !== attendenceId));
        } else {
            console.log("resp==>,", response)
            // AlertHandler("Failed to delete attendence", "danger");
        }
    };

    // function onSubmit(val) {

    //     console.log("resp==>,", response)
    //     saveattendence(val);
    // }

    const searchDetails = async (values) => {
        console.log("values", values)
        // if(values.clicked=="Search"){
        //   const orderapi = "/attendence/searchattendence";
        try {
            const returnObject = await post(api + "/attendence/searchattendence", values);
            console.log("countrie from filter", returnObject)
            if (returnObject.length > 0) {
                console.log("returnObject", returnObject)
                setattendence(returnObject);
            } else {
                setattendence([])
            }
        }
        catch (err) {
            console.log("err:" + err)
            setattendence([]);
        }
        // }
    }

    function onSubmit(values) {
        console.log("Filter values:", values);

        if (!values || !values.employeeName) {
            setattendence(originalData);
            return;
        }

        const searchText = values.employeeName.toLowerCase();

        const filteredData = originalData.filter((item) =>
            item.employeeName?.toLowerCase().includes(searchText)
        );

        if (filteredData.length > 0) {
            setattendence(filteredData);
        } else {
            AlertHandler("No employee found", "warning");
            setattendence([]);
        }
    }










    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};
        const selectedType = formData?.attendenceType ?? "";

    };




    const actions = ["Present", "Half", "Absent", "Leave", "Calender"];


    const tableTitle = "Daily Attendance ";
    const loadMyAttendance = useCallback(async () => {
        console.log(" called my atendence")
        if (!uName) return;
        try {
            const data = await post(`${api}/manageEmployee/getAttendence?ts=${Date.now()}`, { personName: uName });
            if (response.ok && Array.isArray(data)) {
                const formatted = data.map((item, index) => ({
                    id: index,
                    date: item.markAttendanceDate,
                    status: item.attendanceType?.attendenceTypeName?.toLowerCase() || "present"
                }));
                console.log(" res for my attendece", formatted)
                setAttendanceData(formatted);
                setCalendarData(formatted);
            } else {
                console.log(" res for my attendece is Empty")
                setAttendanceData([]);
                setCalendarData([]);
            }
        } catch (err) {
            console.error("Personal dashboard fetch error stack:", err);
            setAttendanceData([]);
        }
    }, [uName, post]);
    useEffect(() => {
        if (isAdmin) {
            loadDailyAttendance();
        } else {
            loadMyAttendance();
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <div className={classes.container}>
                <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    height: "85vh"
                }}>
                    <div style={{ marginBottom: "15px" }}>
                        <h3 style={{ color: "#1976d2", fontWeight: "bold" }}>My Attendance Calendar</h3>
                    </div>
                    <Calender attendanceData={attendanceData} />
                </div>
            </div>
        );
    }
    else {
        return (
            <div className={classes.container}>

                {/* <Popupcard
                title="Add attendence" 

            > */}
                <NewTable


                    cols={DailyAttendenceTable({
                        showFormHandler,
                        actions,
                        onCalendarClick: onCalendarClick
                    }

                    )}
                    data={attendence}
                    striped

                    rows={25}
                    title={tableTitle}
                    // showPlusCircle={true}
                    handleAddClick={showFormHandler({}, "Add")}
                    template={templateforfilter}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Search"
                    rowWise={4}
                />

                <Modal
                    show={openCalendar}
                    onHide={handleCalendarClose}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: 'blue' }}>
                            Attendance { }
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '10px' }}>
                        {openCalendar && (
                            <Calender attendanceData={calendarData} />

                        )}  </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleCalendarClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
export default DailyAttendence;
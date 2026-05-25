import React, { useCallback, useEffect, useState } from "react";
// import NewPayment from "./NewPayment";
import { format, subDays, eachDayOfInterval, isSunday, isValid } from "date-fns";

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
// import attendenceNameMasterTable from "./attendenceNameMasterTable";
// import attendenceCatagoryTable from './attendenceCatagoryTable';

import NewTable from "../../Components/NewTable/NewTable";
import {
    startOfMonth,
    endOfMonth,


    min
} from "date-fns";



import ViewAttendenceTable from "./ViewAttendenceTable";
import { FaIcons } from "react-icons/fa";



//leave - blue
//absent -red
//present - green
//holiday- orange
//half - yellow



const ViewAttendence = (props) => {

    const { get, del, post, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();

    const [defaultValues, setDefaultValues] = useState({});
    const [statusList, setStatusList] = useState([]);

    const [attendenceTypes, setattendenceTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [department, setdepartment] = useState([])
    const [attendenceRows, setattendenceRows] = useState([]);

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

    const [selectedMonth, setSelectedMonth] = useState(() =>
        format(new Date(), "yyyy-MM")
    );



    const colors = {
        present: "green",
        absent: "red",
        leave: "blue",
        holiday: "orange",
        halfday: "yellow",
        loseofpay: "brown",
        onduty: "violet"
    };


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
                title: "select Month",
                type: "date",
                name: "month",
                contains: "date"
            },

        ]
    };
    const loadEmployees = useCallback(async () => {
        const data = await get(api + "/manageEmployee/getall");
        console.log("employess", data)
        if (response.ok) {
            setEmployees(data);
        }
    }, [get, response]);

    const loadMarkattendence = useCallback(async () => {
        const data = await get(api + "/markAttendence/getall");
        if (response.ok) {
            console.log("mark attendence", data)
            return data
        }else{
            return []
        }

    }, [get]);


    const loadattendenceTypes = useCallback(async () => {
        const data = await get(api + "/attendenceType/getall");
        console.log("data of att type ,", data)
        if (response.ok) {
            setattendenceTypes(data);
        }
    }, [get, response]);


    const loadDepartments = useCallback(async () => {
        const data = await get(api + "/department/department");
        console.log("data of dept   ,", data)
        if (response.ok) {
            setdepartment(data);
        }
    }, [get, response]);

    useEffect(() => {
        loadDepartments();

    }, []);

    useEffect(() => {
        loadEmployees();
        loadDepartments();
        loadattendenceTypes();
    }, []);


    const LoadattendenceRows = async () => {
        const marks = await loadMarkattendence();

        const today = new Date();
        const startDate = subDays(today, 29);
        const days = eachDayOfInterval({ start: startDate, end: today });

        const map = {};


        employees.forEach(emp => {

            map[emp.employeeId] = {
                employeeId: emp.employeeId,
                employeeName: emp.employeeName,
                departmentName: emp.department?.departmentName || "",

                attendence: {}
            };

            days.forEach(day => {
                const key = format(day, "dd/MM/yyyy");
                map[emp.employeeId].attendence[key] = "present";
            });
        });


        marks.forEach(item => {
            const empId = item.employee?.employeeId;
            console.log("att record:", item);





            if (map[empId]) {
                const rawDate = new Date(item.markAttendanceDate);

                if (!isValid(rawDate)) {
                    console.log("Invalid   date:", item.markAttendanceDate);
                    return;
                }
                const dateKey = format(rawDate, "dd/MM/yyyy");
                const statusType = item.attendanceType?.attendenceTypeName?.toLowerCase() || "present";

                map[empId].attendence[dateKey] = statusType;
            }
        });

        setattendenceRows(Object.values(map));
    };
    useEffect(() => {
        if (employees.length > 0) {
            LoadattendenceRows();
        }
    }, [employees]);

    const rowWiseFields = 3;
    function validate() {

    }

    function onSubmit(values) {
        if (!values || !values.month) return;

        const selected = new Date(values.month);

        if (!isValid(selected)) return;

        const monthYear = format(selected, "yyyy-MM");

        setSelectedMonth(monthYear);
    }


    // const getDaysForMonth = (selectedMonth) => {
    //     const today = new Date();
    //     const [year, month] = selectedMonth.split("-");

    //     const monthStart = startOfMonth(new Date(year, month - 1));
    //     const monthEnd = endOfMonth(monthStart);


    //     const endDate =
    //         format(today, "yyyy-MM") === selectedMonth
    //             ? today
    //             : monthEnd;

    //     let days = eachDayOfInterval({
    //         start: monthStart,
    //         end: endDate,
    //     });


    //     if (days.length > 30) {
    //         days = days.slice(days.length - 30);
    //     }

    //     return days;
    // };


    const getDaysForMonth = (selectedMonth) => {
        const today = new Date();
        const [year, month] = selectedMonth.split("-");

        const monthStart = startOfMonth(new Date(year, month - 1));
        const monthEnd = endOfMonth(monthStart);

        const endDate =
            format(today, "yyyy-MM") === selectedMonth
                ? today
                : monthEnd;

        return eachDayOfInterval({
            start: monthStart,
            end: endDate,
        });
    };









    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};
        const selectedType = formData?.attendenceType ?? "";

    };




    // const actions = ["Present", "Half", "Absent"];
    const actions = statusList.map(type => ({
        label: type.attendenceTypeName,
        value: type.attendenceTypeId
    }));

    // const today = new Date();
    // const startDate = subDays(today, 29);
    // const days = eachDayOfInterval({ start: startDate, end: today });
    // const tableTitle = "Daily attendence " + format(new Date(), "dd/MM/yyyy");
    const days = getDaysForMonth(selectedMonth);

    const tableDays =
        days.length > 0
            ? `Attendance : ${format(days[0], "dd/MM/yyyy")} - ${format(days[days.length - 1], "dd/MM/yyyy")}`
            : "Attendance";




    return (
        <div className={classes.container}>

            <NewTable


                cols={ViewAttendenceTable({
                    showFormHandler,
                    actions, days

                }

                )}
                data={attendenceRows}

                striped

                rows={25}
                title={tableDays}
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


            {/* </Popupcard> */}

        </div>
    )
}
export default ViewAttendence;
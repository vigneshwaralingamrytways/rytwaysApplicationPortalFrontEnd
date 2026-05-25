import React, { useCallback, useEffect, useState } from "react";
import {
    api,
    useFetch,
    alertActions,
    modalActions,
    useDispatch,
    useSelector,
    classes,
    Popupcard,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";

import AssignTicket from "./AssignTicket";
import ManageTicketTable from "./ManageTicketTable";
import StartTimeView from "./StartTimeView";
import ViewActivityLogTable from "./ViewActivityLogTable";

const ManageTicket = (props) => {
    const { get, del, post, put, response } = useFetch({ data: [] });
    const dispatch = useDispatch();

    const [ticketData, setTicketData] = useState([]);
    const [filteredTicketData, setFilteredTicketData] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [activityLogs, setActivityLogs] = useState({});

    // Slide States
    const [isSlideOpen, setIsSlideOpen] = useState(false);
    const [activeForm, setActiveForm] = useState(null);

    const [showAlert] = useSelector((state) => [
        state.alertProps.showAlert,
    ]);

    const [editingStatusId, setEditingStatusId] = useState(null);

    const handleActivateWork = async (item) => {
        const confirmActivate = window.confirm("Do you want to activate this work?");

        if (confirmActivate) {
            // const now = new Date().toLocaleString();
            const today = new Date().toISOString().split("T")[0];


            const data = await put(
                api + `/bookTickets/update/${today}/${item.ticketId}`
            );

            console.log("data from activate work", data)
            if (data && response.ok) {
                await loadTickets();
                AlertHandler("Work activated successfully", "success");
            }
            else {
                AlertHandler("Work activated failed", "danger");
                console.log("reposne", response)
            }

        }
    };



    const AlertHandler = (alertContent, alertType) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: !showAlert,
                alertMessage: alertContent,
                alertVariant: alertType,
            })
        );
    };

    const validate = () => true;

    const closeSlide = () => {
        setIsSlideOpen(false);
        setActiveForm(null);
    };




    const loadTickets = useCallback(async () => {
        const allTickets = await get(api + "/bookTickets/getAllAssignedTickets");
        console.log("all ticktes", allTickets)
        if (response.ok) {
            setTicketData(allTickets);
            setFilteredTicketData(allTickets);
        }

    }, [get, response]);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    useEffect(() => {
        if (ticketData.length > 0) {
            ticketData.forEach(ticket => {
                loadActivityLogs(ticket.ticketId);
            });
        }
    }, [ticketData]);


    // ============================
    // FILTER TEMPLATE
    // ============================
    const filterTemplate = {
        fields: [
            {
                title: "Customer Name",
                type: "select",
                name: "customerId",
                options: customerList,
            },
            {
                title: "From Date",
                type: "date",
                name: "fromDate",
            },
            {
                title: "To Date",
                type: "date",
                name: "toDate",
            },
            {
                title: "Status",
                type: "select",
                name: "statusId",
                options: statusList,
            },
            {
                title: "Issue Type",
                type: "select",
                name: "issueType",
                options: [
                    { value: "High", label: "High" },
                    { value: "Medium", label: "Medium" },
                    { value: "Low", label: "Low" }
                ],
            },
        ],
    };

    const ticketAssignTemplate = () => ({
        fields: [
            {
                title: "Assigned To",
                type: "select",
                name: "customerId",

                options: customerList,
                contains: "text",
                inpprops: {},
                validationProps: "Customer is required"
            },
            {
                title: "Assigned On Date",
                type: "date",
                name: "customerId",

                options: [],
                contains: "date",
                inpprops: {},
                validationProps: "Customer is required"
            },
            //  {
            //     title: "Completed Date",
            //     type: "date",
            //     name: "customerId",

            //     options: [],
            //     contains: "date",
            //     inpprops: {},
            //     validationProps: "Customer is required"
            // }, 
            //  {
            //     title: "Status",
            //     type: "select",
            //     // //value:statusId",
            //     name: "statusId",
            //     options: statusList,
            //     inpprops: {},
            //     validationProps: "Status is required"
            // },
            // {
            //     title: "Total Time Spend",
            //     type: "text",
            //     name: "customerId",

            //     options: [],
            //     contains: "text",
            //     inpprops: {},
            //     validationProps: "Customer is required"
            // },



        ]
    });

    const ticketTemplate = () => ({
        fields: [
            {
                title: "Customer Name",
                type: "select",
                name: "customerId",

                options: customerList,
                contains: "text",
                inpprops: {},
                validationProps: "Customer is required"
            },
            {
                title: "Ticket Date",
                type: "date",
                name: "ticketDate",
                contains: "date",
                inpprops: {},
                validationProps: "Ticket date is required"
            },
            {
                title: "Ticket Description",
                type: "text",
                //value:ticketDescription",
                name: "ticketDescription",
                contains: "text",
                inpprops: {},
                validationProps: "Description is required"
            },
            {
                title: "Type of Problem",
                type: "select",
                name: "problemType",

                contains: "text",
                options: [
                    { value: "Technical", label: "Technical" },
                    { value: "Billing", label: "Billing" },
                    { value: "General", label: "General" },
                    { value: "Other", label: "Other" }
                ],
                inpprops: {},
                validationProps: "Problem type is required"
            },
            {
                title: "Issue Type",
                type: "select",
                name: "issueType",
                // //value:issueType",
                contains: "text",
                options: [
                    { value: "High", label: "High" },
                    { value: "Medium", label: "Medium" },
                    { value: "Low", label: "Low" }
                ],
                inpprops: {},
                validationProps: "Issue type is required"
            },
            {
                title: "Ticket Raised By",
                type: "text",
                name: "raisedBy",
                contains: "text",
                inpprops: {},
                validationProps: "Raised by is required"
            },
            {
                title: "Status",
                type: "select",
                // //value:statusId",
                name: "statusId",
                options: statusList,
                inpprops: {},
                validationProps: "Status is required"
            },
            {
                title: "Remarks",
                type: "text",
                // //value:remarks",
                contains: "text",
                name: "remarks",
                inpprops: { md: 12, rows: 2 },
            },
        ],
    });

    const handleStartWork = async (item) => {
        const confirmStart = window.confirm("Do you want to start this work?");
        if (!confirmStart) return;


        const res = await post(api + `/activityLogs/startTime/${item.ticketId}`);
        console.log("res for start", res)
        if (res && response.ok) {
            AlertHandler("Work started successfully", "success");
            loadActivityLogs(item.ticketId);
        } else {
            AlertHandler("Failed to start work", "danger");
        }
    };
    const handleStopWork = async (item) => {
        const confirmStop = window.confirm("Do you want to stop this work?");
        if (!confirmStop) return;


        const res = await put(
            api + `/activityLogs/endTime/${item.ticketId}`
        );
        console.log("res for stop", res)

        if (res && response.ok) {
            AlertHandler("Work stopped successfully", "success");
            loadActivityLogs(item.ticketId);
        } else {
            AlertHandler("Failed to stop work", "danger");
        }
    };



    function onSubmit(values) {
        let filtered = [...ticketData];

        // Filter by Customer
        if (values.customerId) {
            filtered = filtered.filter(t =>
                t.customerId === values.customerId ||
                t.customer?.customerId === values.customerId
            );
        }

        if (values.fromDate) {
            const fromDate = new Date(values.fromDate).setHours(0, 0, 0, 0);
            filtered = filtered.filter(t =>
                new Date(t.ticketDate).setHours(0, 0, 0, 0) >= fromDate
            );
        }

        if (values.toDate) {
            const toDate = new Date(values.toDate).setHours(23, 59, 59, 999);
            filtered = filtered.filter(t =>
                new Date(t.ticketDate).getTime() <= toDate
            );
        }

        if (values.statusId) {
            filtered = filtered.filter(t =>
                t.statusId === values.statusId ||
                t.status?.statusId === values.statusId
            );
        }


        if (values.issueType) {
            filtered = filtered.filter(t =>
                t.issueType === values.issueType
            );
        }

        setFilteredTicketData(filtered);
    }
    const showActivityLog = async (item) => {


        const data = await get(api + `/activityLogs/ticket/${item.ticketId}`);
        const totalTime = await get(api + `/activityLogs/totalSpendTime/${item.ticketId}`);
        if (response.ok) {
            setActivityLogs(prev => ({
                ...prev,
                [item.ticketId]: data
            }));

            setActiveForm(
                <Popupcard title="Activity Log" showBack onBack={closeSlide}
                >
                    <NewTable
                        cols={ViewActivityLogTable()}
                        data={data}
                        title="Activity Log"
                    />
                    <p> Total Time Spend:{totalTime} </p>
                </Popupcard>
            );

            setIsSlideOpen(true);
        }

    };

    const loadActivityLogs = useCallback(async (ticketId) => {
        const data = await get(api + `/activityLogs/ticket/${ticketId}`);

        if (response.ok) {
            setActivityLogs(prev => ({
                ...prev,
                [ticketId]: data
            }));
        }
    }, [get, response]);


    const loadCustomers = useCallback(async () => {
        const data = await get(api + "/customer/getall");
        if (response.ok) {
            setCustomerList(
                data.map((item) => ({
                    label: item.customerName,
                    value: item.customerId,
                }))
            );
        }
    }, [get, response]);

    const loadEmployees = useCallback(async () => {
        const data = await get(api + "/manageEmployee/getall");
        console.log("all emp", data)
        if (response.ok) {
            setEmployeeList(
                data.map((item) => ({
                    label: item.employeeName,
                    value: item.employeeId,
                }))
            );
        }
    }, [get, response]);

    const loadStatuses = useCallback(async () => {
        const data = await get(api + "/status/getAllByStatusType/TICKET");
        console.log("status list", data)
        if (response.ok) {
            setStatusList(
                data.map((item) => ({
                    label: item.statusName,
                    value: item.statusId,
                }))
            );
        }
    }, [get, response]);

    useEffect(() => {
        loadCustomers();
        loadEmployees()
        loadStatuses();

    }, []);
    const handleCloseTicket = async (item) => {
        const remarks = window.prompt("Enter closing remarks:");

        if (!remarks) {
            AlertHandler("Remarks required to close ticket", "danger");
            return;
        }

        try {
            const notesRes = await put(`${api}/bookTickets/closeNotes/${item.ticketId}/${(remarks)}`);

            if (response.ok) {
                const statusUpdate = {
                    ...item,
                    statusId: 28,
                    completedOn: new Date().toISOString().split('T')[0]
                };

                await put(`${api}/bookTickets/update/${item.ticketId}`, statusUpdate);

                if (response.ok) {
                    AlertHandler("Ticket closed successfully", "success");
                    await loadTickets();
                }
            } else {
                AlertHandler("Failed to save closing notes", "danger");
            }
        } catch (error) {
            console.error("Close Error:", error);
            AlertHandler("Something went wrong while closing", "danger");
        }
    };


    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};


        // if (action === "Start") {
        //     handleStartTimeClick(item)();
        // }

        if (action === "Start") {
            handleStartWork(item);
        }
        if (action === "Stop") {
            handleStopWork(item);
        }
        if (action === "ViewLog") {
            showActivityLog(item)
        }
        if (action === "Activate") {
            handleActivateWork(item);
        }
        if (action === "UpdateStatus") {
            return async (newStatus) => {
                const statusUpdate = {
                    ...item,
                    statusId: newStatus
                };

                const result = await put(`${api}/bookTickets/update/${item.ticketId}`, statusUpdate);
                if (response.ok) {
                    setTicketData(prev =>
                        prev.map(t => t.ticketId === item.ticketId ? { ...t, status: result.status, statusId: newStatus } : t)
                    );
                    setFilteredTicketData(prev =>
                        prev.map(t => t.ticketId === item.ticketId ? { ...t, status: result.status, statusId: newStatus } : t)
                    );
                    AlertHandler("Status updated successfully", "success");
                }
                else {
                    AlertHandler("Failed to update status", "danger");
                }


            };
        }

        if (action === "Close") {
            handleCloseTicket(item);
        }
    };


    const actions = ["Activate", "ViewLog", "Start", "Stop"];
    const isManage = true


    return (
        <div className={classes.container}>

            {!isSlideOpen && (
                <NewTable
                    cols={ManageTicketTable(showFormHandler,
                        actions,
                        activityLogs,
                        editingStatusId,
                        setEditingStatusId)}
                    data={filteredTicketData}
                    striped
                    rows={25}
                    title="Manage Tickets"
                    // showPlusCircle={true}
                    // handleAddClick={showFormHandler({}, "Add")}
                    template={filterTemplate}
                    rowwise={4}
                    validate={validate}
                    onSubmit={onSubmit}
                    buttonName="Search"
                    onCancel={props.onCancel}
                />
            )}

            {/* Slide Popup for Add/Edit */}
            <div
                className={`${classes.sliderPopup} ${isSlideOpen ? classes.open : ""
                    }`}
            >
                {activeForm}
            </div>
        </div>
    );
};

export default ManageTicket;
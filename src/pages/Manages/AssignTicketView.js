import React, { useCallback, useEffect, useState } from "react";
import {
    api,
    useFetch,
    alertActions,
    modalActions,
    useDispatch,
    useSelector,
    classes,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";

import AssignTicket from "./AssignTicket";
import ManageTicketTable from "./ManageTicketTable";
import StartTimeView from "./StartTimeView";
import AssignTicketTable from "./AssignTicketTable";

const AssignTicketView = (props) => {
    const { get, del, post, put, response } = useFetch({ data: [] });
    const dispatch = useDispatch();
    const [timeTracking, setTimeTracking] = useState({});

    const [ticketData, setTicketData] = useState([]);
    const [filteredTicketData, setFilteredTicketData] = useState([]);


    const [customerList, setCustomerList] = useState([]);

    const [employeeList, setEmployeeList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [issueType, setIssueType] = useState([]);

    // Slide States
    const [isSlideOpen, setIsSlideOpen] = useState(false);
    const [activeForm, setActiveForm] = useState(null);

    const [showAlert] = useSelector((state) => [
        state.alertProps.showAlert,
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

    const validate = () => true;

    const closeSlide = () => {
        setIsSlideOpen(false);
        setActiveForm(null);
    };


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
        if (response.ok) {
            setStatusList(
                data.map((item) => ({
                    label: item.statusName,
                    value: item.statusId,
                }))
            );
        }
    }, [get, response]);
    const loadIsuueTypes = useCallback(async () => {
        const data = await get(api + "/issueType/getAll");
        if (response.ok && Array.isArray(data)) {
            setIssueType(
                data.map((item) => ({
                    label: item.issueTypeName,
                    value: item.issueTypeId,
                }))
            );
        }
        else {
            console.log("Issue types data is not an array:", data);
            setIssueType([]);
        }
    }, [get, response]);

    useEffect(() => {
        loadCustomers();
        loadEmployees();
        loadIsuueTypes();
        loadStatuses();
    }, []);


    const loadTickets = useCallback(async () => {
        const allTickets = await get(api + "/bookTickets/getAllAssignedTickets");
        if (response.ok) {
            setTicketData(allTickets);
            setFilteredTicketData(allTickets);
        }
    }, [get, response]);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);


    const saveTicket = async (values) => {
        if (!values.ticketId) {
            AlertHandler("Ticket ID missing", "danger");
            return;
        }

        const updated = await put(
            api + "/bookTickets/update/assignTicket/" + values.ticketId,
            values
        );

        if (response.ok) {
            AlertHandler("Assignment updated successfully", "success");
            loadTickets();
            closeSlide();
        } else {
            AlertHandler("Failed to update assignment", "danger");
        }
    };

    const deleteTicket = async (item) => {
        const data = await del(api + "/bookTickets/removeAssignment/" + item.ticketId);

        if (response.ok) {
            AlertHandler("Assignment removed successfully", "success");
            loadTickets();
        } else {
            AlertHandler("Failed to remove assignment", "danger");
        }
    };

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
                name: "issueTypeId",
                options: issueType,
            },
        ],
    };

    const ticketAssignTemplate = () => ({
        fields: [
            {
                title: "Assigned To",
                type: "select",
                name: "assignedTo",

                options: employeeList,
                contains: "text",
                inpprops: {},
                validationProps: "Customer is required"
            },
            {
                title: "Assigned On Date",
                type: "date",
                name: "assignedOnDate",

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
                name: "issueTypeId",
                // //value:issueType",
                contains: "text",
                options: issueType,
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

    const handleStartTimeClick = (item) => () => {
        const currentTracking = timeTracking[item.ticketId];

        if (currentTracking && currentTracking.endTime === "Running...") {
            setActiveForm(
                <StartTimeView
                    rowData={currentTracking}
                    onCancel={closeSlide}
                    onEndClick={handleEndTicket}
                />
            );
            setIsSlideOpen(true);
            return;
        }

        const confirmStart = window.confirm("Do you want to start this ticket?");
        if (confirmStart) {
            const now = new Date().toLocaleTimeString();
            const newTracking = {
                ...item,
                startTime: now,
                endTime: "Running..."
            };

            setTimeTracking(prev => ({
                ...prev,
                [item.ticketId]: newTracking
            }));

            setActiveForm(
                <StartTimeView
                    rowData={newTracking}
                    onCancel={closeSlide}
                    onEndClick={handleEndTicket}
                />
            );
            setIsSlideOpen(true);
        }
    };

    const handleEndTicket = (rowData) => {
        const end = new Date().toLocaleTimeString();
        const finishedTracking = { ...rowData, endTime: end };

        setTimeTracking(prev => ({
            ...prev,
            [rowData.ticketId]: finishedTracking
        }));

        setActiveForm(
            <StartTimeView
                rowData={finishedTracking}
                onCancel={closeSlide}
                onEndClick={handleEndTicket}
            />
        );
    };


    const handleStartTimeClicks = (item) => () => {

        const currentTracking = timeTracking[item.ticketId];
        const confirmStart = window.confirm("Do you want to start this ticket?");
        if (confirmStart) {
            const now = new Date().toLocaleString();
            const updatedItem = {
                ...item,
                startTime: now,
                endTime: "Running..."
            };
            setActiveForm(
                <StartTimeView
                    rowData={updatedItem}
                    onCancel={closeSlide}
                />
            );
            setIsSlideOpen(true);

        }

    };
    // ============================
    // SEARCH FILTER FUNCTION
    // ============================
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


        if (values.issueTypeId) {
            filtered = filtered.filter(t =>
                t.issueTypeId === values.issueTypeId
            );
        }

        setFilteredTicketData(filtered);
    }


    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};


        if (action === "Assign") {
            setActiveForm(
                <AssignTicket
                    selectedItem={formData}
                    saveTicket={saveTicket}
                    template={ticketAssignTemplate()}
                    validate={validate}
                    onCancel={closeSlide}
                />
            );
            setIsSlideOpen(true);
            return;
        }
        if (action === "Start") {
            handleStartTimeClick(item)();
        }
        if (action === "Edit") {
            setActiveForm(
                <AssignTicket
                    selectedItem={item}
                    saveTicket={saveTicket}
                    template={ticketAssignTemplate()}
                    validate={validate}
                    onCancel={closeSlide}
                />
            );
            setIsSlideOpen(true);
            return;
        }

        if (action === "Delete") {
            deleteTicket(item)
        }




    };


    const actions = ["Assign", "Edit", "Delete"];
    const isManage = true


    return (
        <div className={classes.container}>

            {!isSlideOpen && (
                <NewTable
                    cols={AssignTicketTable(showFormHandler, actions)}
                    data={filteredTicketData}
                    striped
                    rows={25}
                    title="Assigned Tickets"
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

export default AssignTicketView;
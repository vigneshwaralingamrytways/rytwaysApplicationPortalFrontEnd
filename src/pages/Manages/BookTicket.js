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
import TicketTable from "./TicketTable";
import NewTicket from "./NewTicket";
import AssignTicket from "./AssignTicket";

const BookTicket = (props) => {
    const { get, del, post, put, response } = useFetch({ data: [] });
    const dispatch = useDispatch();


    const [ticketData, setTicketData] = useState([]);
    const [filteredTicketData, setFilteredTicketData] = useState([]);


    const [customerList, setCustomerList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [issueType, setIssueType] = useState([]);
    const [ticketType, setTicketType] = useState([]);

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

    const validate = (watchValues, { setError, clearErrors }) => {
        if (watchValues.expectedTime) {
            const selectedTime = new Date(watchValues.expectedTime).getTime();
            const currentTime = new Date().getTime();

            if (selectedTime < currentTime) {
                setError("expectedTime", {
                    type: "manual",
                    message: "Expected Time cannot be in the past",
                });
            } else {
                clearErrors("expectedTime");
            }
        }
        return true;
    };

    const closeSlide = () => {
        setIsSlideOpen(false);
        setActiveForm(null);
    };

    const [employeeList, setEmployeeList] = useState([]);

    const loadEmployees = useCallback(async () => {
        const data = await get(api + `/manageEmployee/getall?t=${Date.now()}`);
        console.log("all emp,", data)
        if (response.ok) {
            setEmployeeList(
                data.map((e) => ({
                    label: e.employeeName,
                    value: e.employeeId,
                }))
            );
        }
    }, [get, response]);



    const loadIsuueTypes = useCallback(async () => {
        const data = await get(api + `/issueType/getAll?t=${Date.now()}`);
        if (response.ok) {
            setIssueType(
                data.map((item) => ({
                    label: item.issueTypeName,
                    value: item.issueTypeId,
                }))
            );
        }
    }, [get, response]);
    const loadTicketType = useCallback(async () => {
        const data = await get(api + `/ticketType/getAll?t=${Date.now()}`);
        if (response.ok) {
            setTicketType(
                data.map((item) => ({
                    label: item.ticketTypeName,
                    value: item.ticketTypeId,
                }))
            );
        }
    }, [get, response]);
    const loadCustomers = useCallback(async () => {
        const data = await get(api + `/customer/getall`);
        if (response.ok) {
            setCustomerList(
                data.map((item) => ({
                    label: item.customerName,
                    value: item.customerId,
                }))
            );
        }
    }, [get, response]);
    const loadStatuses = useCallback(async () => {
        const data = await get(api + `/status/getAllByStatusType/TICKET?t=${Date.now()}`);
        if (response.ok) {
            setStatusList(
                data.map((item) => ({
                    label: item.statusName,
                    value: item.statusId,
                }))
            );
        }
    }, [get, response]);




    const loadTickets = useCallback(async () => {
        const allTickets = await get(api + `/bookTickets/getAllTickets?t=${Date.now()}`);
        console.log("load all ticktes", allTickets)
        if (response.ok) {
            setTicketData(allTickets);
            setFilteredTicketData(allTickets);
        }
    }, [get, response]);

    useEffect(() => {
        loadCustomers();
        loadStatuses();
        loadIsuueTypes();
        loadEmployees();
        loadTickets();
        loadTicketType();
    }, []);


    const saveTicket = async (value) => {
        console.log(" values for save ", value)

        if (value.ticketId) {

            const updatedTicket = await put(
                api + `/bookTickets/update/${value.ticketId}?t=${Date.now()}`,
                value
            );
            console.log("update tkt", updatedTicket)
            if (response.ok) {
                AlertHandler("Ticket updated successfully", "success");

                setTicketData((prev) =>
                    prev.map((t) =>
                        t.ticketId === updatedTicket.ticketId
                            ? updatedTicket
                            : t
                    )
                );

                setFilteredTicketData((prev) =>
                    prev.map((t) =>
                        t.ticketId === updatedTicket.ticketId
                            ? updatedTicket
                            : t
                    )
                );

                setIsSlideOpen(false);
            }
            else {
                const errorMsg = response.data?.message || "Ticket Failed To Update";
                AlertHandler(errorMsg, "danger");
            }

        } else {

            const newTicket = await post(
                api + `/bookTickets/createTicket?t=${Date.now()}`,
                value
            );
            console.log("saved tkt", newTicket)
            if (response.ok) {
                AlertHandler("Ticket created successfully", "success");

                setTicketData((prev) => [...prev, newTicket]);
                setFilteredTicketData((prev) => [...prev, newTicket]);

                setIsSlideOpen(false);
            }
            else {
                const errorMsg = response.data?.message || "Ticket Failed To create";
                AlertHandler(errorMsg, "danger");
            }
        }
    };

    const deleteTicket = async (ticketId) => {
        const data = await del(
            api + `/bookTickets/delete/${ticketId}?t=${Date.now()}`
        );
        console.log(" deleetd", data)

        if (response.ok) {
            AlertHandler("Ticket deleted successfully", "success");

            setTicketData((prev) =>
                prev.filter((t) => t.ticketId !== ticketId)
            );

            setFilteredTicketData((prev) =>
                prev.filter((t) => t.ticketId !== ticketId)
            );
        }
    };



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
                options: issueType
            },
        ],
    };

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
            // {
            //     title: "Ticket Date",
            //     type: "date",
            //     name: "ticketDate",
            //     contains: "date",
            //     inpprops: {},
            //     validationProps: "Ticket date is required"
            // },
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
                title: "Ticket Type",
                type: "select",
                name: "ticketTypeId",

                contains: "text",
                options: ticketType,
                inpprops: {},
                validationProps: "Ticket type is required"
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
                title: "Priority Type",
                type: "select",
                name: "priorityType",
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
                title: "Expected On",
                type: "time",
                name: "expectedTime",
                contains: "time",
                inpprops: {
                    min: new Date().toISOString().split('T')[0]
                },
                validationProps: "Raised by is required"
            },
            {
                title: "Ticket Raised By",
                type: "text",
                name: "ticketRaisedBy",
                contains: "text",
                inpprops: {},
                validationProps: "Raised by is required"
            },
            // {
            //     title: "Status",
            //     type: "select",
            //     // //value:statusId",
            //     name: "statusId",
            //     options: statusList,
            //     inpprops: {},
            //     validationProps: "Status is required"
            // },
            // {
            //     title: "Remarks",
            //     type: "text",
            //     // //value:remarks",
            //     contains: "text",
            //     name: "remarks",
            //     inpprops: { md: 12, rows: 2 },
            // },
        ],
    });

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
            // {
            //     title: "Assigned On Date",
            //     type: "date",
            //     name: "assignedOnDate",

            //     options: [],
            //     contains: "date",
            //     inpprops: {},
            //     validationProps: " assignedOnDate is required"
            // },
            {
                title: "Assigned On time",
                type: "time",
                name: "assignedOnTime",

                options: [],
                contains: "time",
                inpprops: {},
                validationProps: "Assigned Time is Required"
            },

        ]
    });

    const assignTicket = async (value) => {

        const assignedTicket = await put(
            api + "/bookTickets/assignTicket/" + value.ticketId,
            value
        );

        if (response.ok) {
            AlertHandler("Ticket assigned successfully", "success");

            setTicketData((prev) =>
                prev.map((t) =>
                    t.ticketId === assignedTicket.ticketId
                        ? assignedTicket
                        : t
                )
            );

            setFilteredTicketData((prev) =>
                prev.map((t) =>
                    t.ticketId === assignedTicket.ticketId
                        ? assignedTicket
                        : t
                )
            );

            // setIsSlideOpen(false);
            closeSlide();
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


        if (values.issueTypeId) {
            filtered = filtered.filter(t =>
                t.issueTypeId === values.issueTypeId
            );
        }

        setFilteredTicketData(filtered);
    }


    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = action === "Assign" ? { ...item } :
            isEdit ? { ...item } : {};


        // ADD or EDIT
        if (action === "Add" || isEdit) {
            setActiveForm(
                <NewTicket
                    selectedItem={formData}
                    saveTicket={saveTicket}
                    template={ticketTemplate()}
                    validate={validate}
                    watchFields={["expectedTime"]}
                    onCancel={closeSlide}
                />
            );
            setIsSlideOpen(true);
            return;
        }
        if (action === "Assign") {
            setActiveForm(
                <AssignTicket
                    onClose={closeSlide}
                    selectedItem={formData}
                    saveTicket={assignTicket}
                    template={ticketAssignTemplate()}
                    validate={validate}
                    onCancel={closeSlide}
                />
            );
            setIsSlideOpen(true);
            return;
        }

        // DELETE
        if (action === "Delete") {
            deleteTicket(item.ticketId);
        }


    };


    const actions = ["Edit", "Delete", "View", "Assign"];

    // ============================
    // RETURN UI
    // ============================
    return (
        <div
            className={classes.container}
            style={{
                position: "relative",
                width: "100%",
                minHeight: "600px",
                overflow: "hidden"
            }}
        >
            {/* ? Ticket Table View ? */}
            <div
                style={{
                    transition: "0.4s ease",
                    opacity: isSlideOpen ? 0 : 1,
                    pointerEvents: isSlideOpen ? "none" : "auto",
                }}
            >
                <NewTable
                    cols={TicketTable(showFormHandler, actions, {
                        ticketType,
                        issueType,
                        customerList
                    })}
                    data={filteredTicketData}
                    striped
                    rows={25}
                    title="Book Tickets"
                    showPlusCircle={true}
                    handleAddClick={showFormHandler({}, "Add")}
                    template={filterTemplate}
                    rowwise={4}
                    validate={validate}
                    onSubmit={onSubmit}
                    buttonName="Search"
                    onCancel={props.onCancel}
                />
            </div>

            {/* ? Slide Popup View (Add/Edit) ? */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    background: "white",
                    transform: isSlideOpen ? "translateX(0%)" : "translateX(100%)",
                    transition: "0.4s ease-in-out",
                    zIndex: 999,
                    overflowY: "auto",
                }}
            >
                {isSlideOpen && activeForm}
            </div>
        </div>
    );
}
export default BookTicket;
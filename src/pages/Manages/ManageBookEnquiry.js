import React, { useCallback, useEffect, useState, useRef, useContext } from "react";
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
// import EnquiryNameMasterTable from "./bookEnquiryNameMasterTable";
// import Enquiry Table from './bookEnquiry Table';
// import Upload from "./Upload";
import NewTable from "../../Components/NewTable/NewTable";
import Upload from "./Upload";
// import EnquiryTable from "./bookEnquiryTable";
import NewEnquiry from "./NewEnquiry";
import BookEnquiryTable from "./BookEnquiryTable";
import ManageBookEnquiryTable from "./ManageBookEnquiryTable";
import { FaPaperPlane, FaTimes, FaDownload, FaUpload, FaTrash, FaComment } from "react-icons/fa";
// import styles from "./Module/CenterContainer.module.css";
import styles from "./Module/CenterContainer.module.css";
import AuthContext from "../../store/auth-context";

const ManageBookEnquiry = (props) => {

    const { get, del, post, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();
    const [statusList, setStatusList] = useState([]);
    const [Enquiry, setEnquiry] = useState([]);
    const [defaultValues, setDefaultValues] = useState({
        customerType: "EXISTING"
    });
    // const [customerType, setCustomerType] = useState("EXISTING");
    const [selectedChatEnquiry, setSelectedChatEnquiry] = useState(null);
    const authCtx = useContext(AuthContext);
    const userRole = authCtx.role;
    const isAdmin = (userRole || "").toString().trim().toLowerCase() === "1";
    console.log(" is admin", isAdmin, userRole)
    const loggedInUserId = authCtx.userId;
    const userName = authCtx.userName;
    console.log("username;", userName)
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [files, setFiles] = useState([]);

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



    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const formatTime = (timeString) => {
        if (!timeString) return "";
        try {
            const today = new Date().toISOString().split("T")[0];
            return new Date(`${today}T${timeString}`).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });
        } catch {
            return timeString;
        }
    };

    const loadStatuses = useCallback(async () => {
        const data = await get(api + "/status/getAllByStatusType/ENQUIRY");

        if (response.ok) {
            setStatusList(
                data.map((item) => ({
                    val: item.statusId,
                    label: item.statusName,
                }))
            );
        }
    }, [get, response]);

    useEffect(() => {
        loadStatuses();
    }, [loadStatuses]);

    const [userMap, setUserMap] = useState({});

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const allUsers = await get(api + "/users/getall");
                console.log("All users:", allUsers);

                const map = {};
                allUsers.forEach(u => {
                    map[u.userId] = u.userName;
                });

                setUserMap(map);
                console.log("User map:", map);
            } catch (err) {
                console.error("Error loading users:", err);
            }
        };

        loadUsers();
    }, []);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, showChat]);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([],
            { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const getUserNameById = (id) => {
        return userMap[id] || "user";
    };

    const loadMessages = async () => {
        if (!selectedChatEnquiry) return;
        setMessages([]);

        const res = await get(`${api}/chatBot/getAll?t=${Date.now()}`);
        console.log("all res ", res)
        const allMessages = Array.isArray(res)
            ? res : [];
        console.log("all msge ", allMessages)

        const filtered = allMessages.filter(
            m => m.enquiryId === selectedChatEnquiry.enquiryId
        );
        console.log("all refiltereds ", filtered)

        const formatted = filtered.flatMap(item => {
            const arr = [{
                from: "user",
                text: item.comment,
                commentId: item.commentId,
                time: item.commentTime,
                userName: getUserNameById(item.commentBy)
            }];

            if (item.response && item.response.trim() !== "") {
                arr.push({
                    from: "bot",
                    text: item.response,
                    commentId: item.commentId,
                    time: item.responseTime,
                    userName: getUserNameById(item.responseBy)
                });
            }
            return arr;
        });

        setMessages(formatted);
    };

    useEffect(() => {
        if (Object.keys(userMap).length === 0) return;
        if (showChat && selectedChatEnquiry) {
            loadMessages();
        }
    }, [userMap, showChat, selectedChatEnquiry]);

    // const handleSend = (text = input) => {
    //     if (!text.trim()) return;

    //     const userMessage = text.trim();
    //     const newMessages = [...messages, { from: "user", text: userMessage }];
    //     setMessages(newMessages);
    //     setInput("");

    //     // Delay the bot's response slightly for realism
    //     setTimeout(() => {
    //         let botReply = "";

    //         const lower = userMessage.toLowerCase();

    //         <div ref={messagesEndRef} />

    //         setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    //     }, 600);
    // };
    const handleSend = async () => {
        if (!input.trim() || !selectedChatEnquiry) return;

        const now = new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
        const value = {
            enquiryId: selectedChatEnquiry.enquiryId,
            comment: input,
            commentBy: loggedInUserId,
            commentTime: now,

        }
        console.log(" values", value)

        const saved = await post(api + "/chatBot/create", value);
        console.log("res".saved)

        if (response.ok) {
            const newUserMsg = {
                from: "user",
                text: saved.comment,
                time: saved.commentTime,
                commentId: saved.commentId,
                userName: getUserNameById(loggedInUserId)
            };

            setMessages(prev => [...prev, newUserMsg]);
            setInput("");
            await loadMessages();
        }
    };



    const handleDeleteMessage = async (commentId) => {
        await del(api + "/chatBot/delete/" + commentId);
        setMessages(prev => prev.filter(m => m.commentId !== commentId));
    };

    const handleDownload = () => {
        // const content = messages
        //   .map((m) => `${m.from === "user" ? "You" : "Assistant"}: ${m.text}`)
        //   .join("\n\n");

        const userMessages = messages.filter(m => m.from === "user");
        let csv = "CommentId,Comment\n";
        userMessages.forEach((msg, index) => {
            const cleanText = msg.text.replace(/"/g, '""');
            csv += `${index + 1},"${cleanText}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "FollowUp.csv";
        a.click();
        URL.revokeObjectURL(url);
    };


    const handleSubmit = async () => {
        if (!selectedType) {
            alert("Please select type");
            return;
        }

        if (files.length === 0) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("userId", loggedInUserId);

        if (selectedChatEnquiry) {
            formData.append("enquiryId", selectedChatEnquiry.enquiryId);
        }

        let endpoint = "";
        if (selectedType === "RESPONSE_XLSX") {
            endpoint = "/chatBot/upload";
        } else {
            alert("Invalid type selected");
            return;
        }

        try {
            const result = await post(api + endpoint, formData);

            if (response.ok) {
                alert("Uploaded Successfully");
                setShowUploadPopup(false);
                setFiles([]);

                if (selectedChatEnquiry) {
                    loadMessages(selectedChatEnquiry.enquiryId);
                }
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error("Upload Error:", err);
            alert("Upload failed");
        }
    };

    const [customerList, setCustomerList] = useState([]);
    const loadCustomers = useCallback(async () => {
        const data = await get(api + "/customer/getall");
        if (response.ok) {
            setCustomerList([
                {
                    label: "select",
                    value: ""
                }, ...
                data.map(c => ({
                    label: c.customerName,
                    value: c.customerId
                }))
            ]);
        }
    }, [get, response]);

    const template = {
        fields: [
            {
                title: "Customer Type",
                type: "select",
                name: "customerType",
                options: [
                    { label: "Select", value: "" },
                    { label: "Existing Customer", value: "EXISTING" },
                    { label: "New Customer", value: "NEW" },
                ],
                defaultValue: "EXISTING",
                inpprops: {},
            },

            {
                title: "Customer Name",
                type: "select",
                name: "customerId",
                options: customerList,
                validationProps: "Customer is required",
                dynamic: {
                    field: "customerType",
                    value: "EXISTING",
                },
                inpprops: {},
            },

            {
                title: "Customer Name",
                type: "text",
                name: "customerName",
                validationProps: "Customer name is required",
                dynamic: {
                    field: "customerType",
                    value: "NEW",
                },
                inpprops: {},

            },

            {
                title: "Enquiry Date",
                type: "date",
                name: "enquiryDate",
                inpprops: {},
                contains: "date",
                validationProps: "Enquiry date is required",
            },

            {
                title: "Enquiry Description",
                type: "text",
                name: "enquiryDescription",
                validationProps: "Description is required",
                inpprops: {},
            },
        ],
    };

    //load Enquiry from db
    const loadEnquiries = useCallback(async () => {
        // const allcountries = await get(api + "/bookEnquiry/getall");

        const allEnquirys = await get(`${api}/bookEnquiry/getall?t=${Date.now()}`);

        console.log("all Enquiry:", allEnquirys)
        // setEnquiry(allcountries);
        if (response.ok) {
            setEnquiry(allEnquirys);

        } else {
            console.log("res++>" + response);
            // AlertHandler("failed to get the Enquiry", "danger")
        }


    }, [get, response])

    useEffect(() => {
        loadEnquiries();
        loadCustomers();
    }, [loadEnquiries, loadCustomers]);



    const rowWiseFields = 3;
    const rowColors = ["#fff"];
    function validate() {

    }



    const deleteEnquiry = async (enquiryId) => {
        const deleted = await del(api + "/bookEnquiry/delete/" + enquiryId);
        console.log("deleted::" + deleted);
        if (response.ok) {

            console.log("resp==>,", response)

            AlertHandler("Enquiry deleted ", "success");
            setEnquiry((prev) => prev.filter((c) => c.enquiryId !== enquiryId));
        } else {
            console.log("resp==>,", response)
            AlertHandler("Failed to delete Enquiry", "danger");
        }
    };

    // function onSubmit(val) {

    //     console.log("resp==>,", response)
    //     saveEnquiry(val);
    // }

    const searchDetails = async (values) => {
        console.log("values", values)
        // if(values.clicked=="Search"){
        //   const orderapi = "/bookEnquiry/searchEnquiry";

    }


    const filterTemplate = {
        fields: [
            {
                title: "From Date",
                name: "fromDate",
                type: "date",
                inpprops: {},
            },
            {
                title: "To Date",
                name: "toDate",
                type: "date",
                inpprops: {},
            },
            {
                title: "Customer Name",
                name: "customerId",
                type: "select",
                options: customerList,
                inpprops: {},
            },
        ],
    };

    function onSubmit(values) {
        const { fromDate, toDate, customerId } = values;

        if (!fromDate && !toDate && !customerId) {
            setEnquiry(Enquiry);
            return;
        }

        const filtered = Enquiry.filter((item) => {
            const header = item;
            const itemCustomerId = header.customerId;

            const customerMatch = customerId ? String(itemCustomerId) === String(customerId) : true;

            let dateMatch = true;
            if (header.enquiryDate) {
                const itemDate = new Date(header.enquiryDate).setHours(0, 0, 0, 0);
                const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
                const to = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

                const isAfterFrom = from ? itemDate >= from : true;
                const isBeforeTo = to ? itemDate <= to : true;

                dateMatch = isAfterFrom && isBeforeTo;
            } else if (fromDate || toDate) {
                dateMatch = false;
            }

            return customerMatch && dateMatch;
        });

        setEnquiry(filtered);
    }


    const actions = ["Edit", "Delete", "FollowUp"];
    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};

        if (action === "Add" || isEdit) {
            dispatch(
                modalActions.showModalHandler({
                    selectedData: { ...formData },
                    modalWidth: "48%",
                    modalLeft: "26%",
                    showModal: true,

                    selectedForm: (
                        <NewEnquiry
                            selectedItem={formData}
                            onCancel={() => dispatch(modalActions.hideModalHandler())}
                            // saveEnquiry={saveEnquiry}
                            template={template}
                            validate={validate}
                            rows={4}
                        />
                    ),
                })
            );
        }

        if (action === "Delete") {
            deleteEnquiry(item.enquiryId);
        }
        if (action === "FollowUp") {
            setMessages([]);
            setShowChat(true);
            setSelectedChatEnquiry(item);
        }

    };
    const handleStatusChange = async (rowData, newStatusId) => {
        const payload = {
            ...rowData,
            statusId: newStatusId
        };
        await post(`${api}/bookEnquiry/update/${rowData.enquiryId}`, payload);

        if (response.ok) {
            // AlertHandler("Status updated successfully", "success");
            await loadEnquiries();
        } else {
            // AlertHandler("Failed to update status", "danger");
        }
    };

    return (
        <div className={classes.container}>

            {/* <Popupcard
                title="Add Enquiry" 

            > */}
            <NewTable
                cols={ManageBookEnquiryTable(
                    showFormHandler,
                    actions, statusList, handleStatusChange

                )}
                data={Enquiry}
                striped

                rows={25}
                title="Manage Enquiry"
                // showPlusCircle={true}
                handleAddClick={showFormHandler({}, "Add")}
                template={filterTemplate}
                rowwise={4}
                validate={validate}
                onSubmit={onSubmit}
                onCancel={props.onCancel}
                buttonName="Search"
            />


            {/* </Popupcard> */}


            {showChat && (
                <div className={styles.chatPopup} style={{ zIndex: 10000 }}>

                    <div className={styles.chatHeader}>
                        <h4>Follow Up</h4>
                        <div className={styles.chatActions}>
                            <FaDownload
                                className={styles.iconButton}
                                onClick={handleDownload}
                                title="Download Chat"
                            />

                            {isAdmin && (
                                <FaUpload
                                    className={styles.iconButton}
                                    onClick={() => setShowUploadPopup(true)}
                                    title="Upload Responses"
                                />
                            )}

                            <FaTimes
                                className={styles.closeIcon}
                                onClick={() => setShowChat(false)}
                                title="Close"
                            />
                        </div>
                    </div>

                    <div className={styles.chatBody}>
                        {/* {messages.map((msg, i) => (
                            <div key={i} className={msg.from === "user" ? styles.userMessage : styles.botMessage}>
                                <span>{msg.text}</span>
                            </div>
                        ))} */}
                        {messages.map((msg, i) => {
                            const isUser = msg.from === "user";
                            const hasReply = messages.some(
                                m => m.commentId === msg.commentId && m.from === "bot"
                            );

                            return (
                                <div
                                    key={`${msg.commentId}-${msg.from}`}
                                    className={isUser ? styles.userMessage : styles.botMessage}
                                >
                                    <div className={styles.msgHeader}>
                                        <strong>{msg.userName}</strong>
                                        <span className={styles.msgTime}>{msg.time}</span>
                                    </div>

                                    <div className={styles.msgText}>
                                        {msg.text}

                                        {isUser && !hasReply && (
                                            <FaTrash
                                                className={styles.deleteMsg}

                                                title="Delete message"
                                                onClick={() => handleDeleteMessage(msg.commentId)}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.chatInputArea}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button onClick={() => handleSend()}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
            {/* Upload POPUP */}
            {showUploadPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupCard}>
                        <h3 className={styles.popupTitle}>Upload Options</h3>

                        <label className={styles.popupLabel}>Type</label>
                        <select
                            className={styles.popupSelect}
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">Select Type</option>

                            <option value="RESPONSE_XLSX">Response</option>
                        </select>

                        <label className={styles.popupLabel}>Upload Documents</label>
                        <input
                            type="file"
                            className={styles.popupFile}

                            // onChange={(e) => setFiles([...e.target.files])}
                            // accept=".csv"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                setFiles([file]);

                            }}
                        />

                        <div className={styles.popupActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowUploadPopup(false)}>
                                Cancel
                            </button>
                            <button className={styles.submitBtn} onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
export default ManageBookEnquiry;
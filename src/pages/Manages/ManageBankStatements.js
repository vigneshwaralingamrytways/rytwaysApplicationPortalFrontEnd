import React, { useState, useEffect, useCallback } from "react";
import {
    api,
    useFetch,
    alertActions,
    modalActions,
    useDispatch,
    useSelector,
    classes,
} from "../../Components/CommonImports/CommonImports";
import { AnimatePresence, motion } from "framer-motion";

import NewTable from "../../Components/NewTable/NewTable";
import NewBankStatement from "./NewBankStatement";
import BankStatementTable from "./BankStatementTable";
import { saveAs } from 'file-saver';

const ManageBankStatements = (props) => {
    const { get, del, post, response } = useFetch({ data: [] });
    const dispatch = useDispatch();
    const [showSlider, setShowSlider] = useState(false);

    const [bankStatements, setBankStatements] = useState([]);
    const [bankaccounts, setBankAccounts] = useState([]);

    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);

    const AlertHandler = (msg, type) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: true,  // ? FIXED: Always true
                alertMessage: msg,
                alertVariant: type,
            })
        );
    };

    // ? FIXED: Clear slider on mount
    useEffect(() => {
        setShowSlider(false);
    }, []);

    const loadBankAccounts = useCallback(async () => {
        const res = await get(api + "/companyBankAccounts/getAll");
        console.log("loaded bank:", res)
        if (res) {
            setBankAccounts(res);
        }
    }, [get]);

    useEffect(() => {
        loadBankAccounts();
    }, [loadBankAccounts]);

    const templatefilter = {
        fields: [
            {
                title: "From Date",
                type: "date",
                name: "fromDate",
                contains: "date",
                inpprops: { format: "dd/mm/yyyy" },
                validationProps: "date is required"
            },
            {
                title: "To Date",
                type: "date",
                name: "toDate",
                contains: "date",
                inpprops: { format: "dd/mm/yyyy" },
                validationProps: "date is required"
            },
        ],
    };

    const template = {
        fields: [
            {
                title: "Date",
                type: "date",
                name: "date",
                contains: "date",
                inpprops: { format: "dd/mm/yyyy" },
                validationProps: "date is required"
            },
            {
                title: "Account No",
                type: "select",
                name: "bankId",
                contains: "text",
                options: bankaccounts?.map((s) => ({
                    value: s.companyBankAccountId,
                    label: s.accountNo,
                })) || [],
                validationProps: "Account No is required"
            },
            {
                title: "Description",
                type: "text",
                name: "description",
                contains: "text",
                validationProps: "Description is required"
            },
            {
                title: "File",
                type: "Document",
                name: "file",
                contains: "file",
                validationProps: "File is required"
            },
        ],
    };

    const loadBankStatements = useCallback(async () => {
        const allStatements = await get(`${api}/bankStatements/getAll?t=${Date.now()}`);
        console.log(" all statements ", allStatements)
        if (response.ok) {
            setBankStatements(allStatements);
        }
    }, [get, response]);

    useEffect(() => {
        loadBankStatements();
    }, [loadBankStatements]);

    const saveBankStatement = async (val) => {
        const formData = new FormData();
        formData.append("bankId", val.bankId);
        formData.append("date", val.date);
        formData.append("description", val.description);
        if (val.file) formData.append("file", val.file[0]);
        console.log("formdata", formData)
        const result = await post(api + "/bankStatements/create", formData);
        console.log("res", result)
        if (response.ok) {
            await loadBankStatements();
            AlertHandler("Bank Statement uploaded successfully", "success");
            setShowSlider(false);  // ? FIXED: Close slider after save
        } else {
            AlertHandler("Failed to upload Bank Statement", "danger");
        }
    };

    const handleDelete = async (item) => {
        await del(api + "/bankStatements/delete/" + item.bankStatementId);
        if (response.ok) {
            AlertHandler("Bank Statement deleted", "success");
            setBankStatements((prev) => prev.filter((c) => c.bankStatementId !== item.bankStatementId));
        } else {
            AlertHandler("Failed to delete", "danger");
        }
    };

    const handleDownload = async (rowData) => {
        try {
            const res = await get(api + `/bankStatements/download/${rowData.bankStatementId}`);
            if (response.ok) {
                const blob = await response.blob();
                saveAs(blob, rowData.fileName);
            } else {
                AlertHandler("Failed to download file", "danger");
            }
        } catch (err) {
            console.log("errors,e", err);
        }
    };

    const monthMap = {
        JANUARY: 1,
        FEBRUARY: 2,
        MARCH: 3,
        APRIL: 4,
        MAY: 5,
        JUNE: 6,
        JULY: 7,
        AUGUST: 8,
        SEPTEMBER: 9,
        OCTOBER: 10,
        NOVEMBER: 11,
        DECEMBER: 12,
    };

    const searchDetails = async (values) => {
        if (!values.fromDate || !values.toDate) {
            AlertHandler("Please select both From Date and To Date", "danger");
            return;
        }

        const from = new Date(values.fromDate);
        const to = new Date(values.toDate);
        const filtered = bankStatements.filter((statement) => {
            const stmtMonth = monthMap[statement.month.toUpperCase()];
            const stmtYear = Number(statement.year);

            const stmtNum = stmtYear * 12 + stmtMonth;
            const fromNum = from.getFullYear() * 12 + (from.getMonth() + 1);
            const toNum = to.getFullYear() * 12 + (to.getMonth() + 1);

            return stmtNum >= fromNum && stmtNum <= toNum;
        });

        setBankStatements(filtered);
    };

    const onSubmit = (values) => searchDetails(values);
    const validate = () => true;

    // ? FIXED: Only show slider, NO modal
    const showFormHandler = (item, action) => () => {
        if (action === "Download") {
            handleDownload(item);
            return;
        }

        if (action === "Delete") {
            handleDelete(item);
            return;
        }

        if (action === "Add") {
            setShowSlider(true);  // ? Only slider, no modal
            return;  // ? CRITICAL: Stop here
        }
    };

    const actions = ["Download", "Delete"];
    const getFirstDay = () => {
        const d = new Date();
        const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
        // return firstDay
        const yyyy = firstDay.getFullYear();
        const mm = String(firstDay.getMonth() + 1).padStart(2, "0");
        const dd = String(firstDay.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <div className={classes.container} style={{ position: "relative" }}>
            {/* ? TABLE */}
            <AnimatePresence>
                {!showSlider && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <NewTable
                            cols={BankStatementTable(showFormHandler, actions)}
                            data={bankStatements}
                            striped
                            rows={25}
                            title="Manage Bank Statements"
                            showPlusCircle={true}
                            handleAddClick={showFormHandler({}, "Add")}
                            template={templatefilter}
                            rowwise={2}
                            validate={validate}
                            onSubmit={onSubmit}
                            onCancel={props.onCancel}
                            buttonName="Search"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ? SLIDING POPUP ONLY */}
            <AnimatePresence>
                {showSlider && (
                    <motion.div
                        key="slider-form"  // ? FIXED: Unique key
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "transparent",
                            zIndex: 999,
                        }}
                    >
                        <NewBankStatement
                            key={`bank-form-${Date.now()}`}  // ? FIXED: Fresh form
                            selectedItem={{
                                date: getFirstDay()
                            }}
                            onCancel={() => setShowSlider(false)}
                            saveBankStatement={saveBankStatement}
                            template={template}
                            validate={validate}
                            rowwise={1}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageBankStatements;

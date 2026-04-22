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

import NewTable from "../../Components/NewTable/NewTable";
import BankAccountsTable from "./BankAccountsTable";
import NewBankAccounts from "./NewBankAccounts";
import UploadBankStatements from "./UploadBankStatements";

const ManageBankAccounts = (props) => {

    const { get, del, post, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();

    const [bankAccounts, setBankAccounts] = useState([]);
    const [defaultValues, setDefaultValues] = useState({});
    const [statusList, setStatusList] = useState([]);
    const [status, setStatus] = useState([]);
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


    //load status from db
    const loadStatuses = useCallback(async () => {
        const allstatus = await get(api + "/status/getall");
        const statusNames = allstatus.statusName;
        console.log("all status:", allstatus)

        if (response.ok) {
            setStatus(allstatus);

        } else {
            console.log("res++>" + response);
            AlertHandler("failed to get the status", "danger")
        }


    }, [get, response])

    useEffect(() => {
        loadStatuses();

    }, [loadStatuses]);


    const templatefilter = {
        fields: [
            {
                inpprops: {},
                title: "Bank Name",
                type: "text",
                name: "bankName",
                contains: "text",
                validationProps: "Bank name is required",
            },
        ]
    };


    const template = {
        fields: [
            {
                inpprops: {},
                title: "Bank Name",
                type: "text",
                name: "bankName",
                contains: "text",
                validationProps: "Bank Name is required",
            },
            {
                inpprops: {},
                title: "Account No",
                type: "text",
                name: "accountNo",
                contains: "text",
                validationProps: "Account Number is required",
            },
            {
                inpprops: {},
                title: "IFSC Code",
                type: "text",
                name: "ifscCode",
                contains: "text",
                validationProps: "IFSC Code is required",
            },
            {
                inpprops: {},
                title: "Branch",
                type: "text",
                name: "branch",
                contains: "text",
                validationProps: "Branch is required",
            },
            {
                inpprops: {},
                title: "Current Balance",
                type: "text",
                name: "currentBalance",
                contains: "text",
                validationProps: "Current Balance is required",
            },
            {
                inpprops: {},
                title: "Updated Date",
                type: "date",
                name: "updatedDate",
                contains: "date",
                validationProps: "Updated Date is required",
            },
            {
                inpprops: {},
                title: "Status",
                type: "select",
                name: "status",
                options: status?.map((s) => ({
                    value: s.statusId,
                    label: s.statusName,
                })) || [],
                validationProps: "Status is required",
            }
        ]
    };


    const loadBankAccounts = useCallback(async () => {
        const res = await get(api+"/bankaccounts/getAll");
        console.log("loaded bank:", res)
        if (res) {
            setBankAccounts(res);
        }
    }, [get]);

    useEffect(() => {
        loadBankAccounts();
    }, [loadBankAccounts]);

    // ? Delete bank account
    const deleteBankAccount = async (id) => {
        await del(api+`/bankaccounts/delete/${id}`);
        AlertHandler("Bank account deleted!", "success");
        loadBankAccounts();
    };


    const saveBankAccount = async (values) => {
        const val = {
...values,status:Number(values.status)
        }

        const res = await post(api+"/bankaccounts/create", val);
        console.log("res bank:", res, val)
        if (res) {




            if (val.bankId) {
                setBankAccounts((prev) => prev.map((item) =>
                    item.bankId === val.bankId ? val : item))
            }
            else {
                setBankAccounts((prev) => [...prev, res]);
            }
            dispatch(modalActions.hideModalHandler());
            AlertHandler("Bank account saved successfully!", "success");
        }
        else {
            AlertHandler("Bank account Not Saved", "danger");
        }
    };


    const searchBankAccounts = async (values) => {
        const res = await post("/bankaccounts/search", values);
        if (res?.data) setBankAccounts(res.data);
    };

    const onSubmit = (values) => {
        searchBankAccounts(values);
    };

    const validate = () => { };


    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};

        if (action === "Upload") {
            dispatch(
                modalActions.showModalHandler({
                    selectedData: formData,
                    modalWidth: "48%",
                    modalLeft: "26%",
                    showModal: true,
                    selectedForm: (
                        <UploadBankStatements
                            selectedItem={formData}
                            onCancel={() => dispatch(modalActions.hideModalHandler())}
                            saveBankAccount={saveBankAccount}
                            template={template}
                            validate={validate}
                        />
                    ),
                })
            );
            return;
        }

        if (action === "Delete") {
            deleteBankAccount(item.bankId);
            return;
        }

        if (action === "Add" || isEdit) {
            dispatch(
                modalActions.showModalHandler({
                    selectedData: formData,
                    modalWidth: "48%",
                    modalLeft: "26%",
                    showModal: true,

                    selectedForm: (
                        <NewBankAccounts
                            selectedItem={formData}
                            onCancel={() => dispatch(modalActions.hideModalHandler())}

                            template={template}
                            validate={validate}
                            onSubmit={saveBankAccount}

                        />
                    ),
                })
            );
        }
    };

    const actions = ["Edit", "Delete", "Add", "Upload"];

    return (
        <div className={classes.container}>
            <NewTable
                cols={BankAccountsTable(showFormHandler, actions, status)}
                data={bankAccounts}
                striped
                rows={25}
                title="Manage Bank Accounts"
                showPlusCircle={true}
                handleAddClick={showFormHandler({}, "Add")}
                template={templatefilter}
                rowwise={3}
                validate={validate}
                onSubmit={onSubmit}
                onCancel={props.onCancel}
                buttonName="Search"
            />
        </div>
    );
};

export default ManageBankAccounts;
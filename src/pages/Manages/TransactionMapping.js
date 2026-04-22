import React, { useState, useEffect, useCallback } from "react";
import useFetch from "use-http";
import Popupcard from "../../UI/cards/Popupcard";
import PopupSimpleCard from "../../UI/cards/PopupSimpleCard";
import CreateForm from "../../Components/Forms/CreateForm";
import { NewTable } from "../../Components/CommonImports/CommonImports";

import api from "../../Api";
import { useDispatch } from "react-redux";
import { alertActions } from "../../store/alert-slice";
import TransactionMappingTable from "./TransactionMappingTable";

const TransactionMapping = ({ selectedTransaction, onClose, validate }) => {
    const { get, post, response } = useFetch();
    const dispatch = useDispatch();

    const [salesInvoices, setSalesInvoices] = useState([]);
    const [selectedSalesIds, setSelectedSalesIds] = useState([]);


    const showAlert = (msg, type) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: true,
                alertMessage: msg,
                alertVariant: type,
            })
        );
    };


    const loadSalesInvoices = useCallback(async () => {
        const data = await get(api + "invoiceHeader/getAll/SALES");
        if (response.ok) {
            // setSalesInvoices(data || []);
        }
    }, [get, response]);

    useEffect(() => {
        loadSalesInvoices();
    }, [loadSalesInvoices]);
    const [transactionList, setTransactionList] = useState([]);

    useEffect(() => {
        const dummyTransactions = [
            {
                transactionDate: "2024-08-01",
                accountNo: "HDFC-001",
                amount: 10000,
                utilizedAmount: 4000,
            },
            {
                transactionDate: "2024-08-05",
                accountNo: "ICICI-002",
                amount: 8000,
                utilizedAmount: 3000,
            },
            {
                transactionDate: "2024-08-10",
                accountNo: "SBI-003",
                amount: 5000,
                utilizedAmount: 2000,
            },
        ];

        setTransactionList(dummyTransactions);
    }, []);


    const templateTransaction = {
        fields: [

            {
                title: "Transaction Date",
                type: "date",
                name: "transactionDate",
                contains: "date",
                inpprops: { md: 4 },
            },
            {
                title: "Account No",
                name: "accountNo",
                type: "select",
                contains: "text",
                options: [],
                inpprops: { md: 3 },
            },
            {
                title: "Transaction Amount",
                name: "amount",
                type: "select",
                contains: "text",
                options:[],
                inpprops: { md: 3, readOnly: true },
            },
            {
                title: "Utilized Amount",
                name: "utilizedAmount",
                type: "number",
                contains: "number",
                inpprops: {},
            },
        ],
    };


    const defaultValues = {
        transactionType: "CREDIT",
        transactionDate: selectedTransaction?.transactionDate,
        accountNo: selectedTransaction?.accountNo,
        amount: selectedTransaction?.amount || 0,
    };


    const onCheckBoxEvent = (row, checked) => {
        const id = row.invoiceHeader?.invoiceHeaderId;
        if (!id) return;

        setSelectedSalesIds((prev) =>
            checked ? [...prev, id] : prev.filter((x) => x !== id)
        );
    };


    const saveTransactionMapping = async (values) => {
        if (!selectedTransaction?.transactionId) {
            showAlert("Invalid transaction", "danger");
            return;
        }

        if (selectedSalesIds.length === 0) {
            showAlert("Select at least one Sales Invoice", "danger");
            return;
        }

        if (values.utilizedAmount > values.amount) {
            showAlert("Utilized amount cannot exceed transaction amount", "danger");
            return;
        }

        const val = {
            transactionId: selectedTransaction.transactionId,
            utilizedAmount: values.utilizedAmount,
            references: selectedSalesIds.map((id) => ({
                referenceId: id,
                referenceType: "SALES",
            })),
        };

        const res = await post(
            api + "bankTransaction/map-sales",
            val
        );

        if (response.ok) {
            showAlert("Sales mapped successfully", "success");
            onClose && onClose();
        } else {
            showAlert("Mapping failed", "danger");
        }
    };


    return (
        <Popupcard title="Sales Transaction Mapping">
            <CreateForm
                template={templateTransaction}
                defaultValues={defaultValues}
                validate={validate}
                onSubmit={saveTransactionMapping}
                buttonName="Save Mapping"
            />

            <PopupSimpleCard>
                <NewTable
                    cols={TransactionMappingTable()}

                    data={transactionList}
                    striped
                    rows={10}
                    showFilterIcon={false}

                />
            </PopupSimpleCard>
        </Popupcard>
    );
};

export default TransactionMapping;
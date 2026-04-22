import ViewTransaction from "../BankAccounts/ViewTransaction";
import NewSalesPayment from "./NewSalesPayment";


import React, { useCallback, useEffect, useState } from "react";
import {
    CreateForm,
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
const SalesPaymentReconsile = ({
    payment,
    onClose,

    validate,
    templatePayement, onPaymentSaved
}) => {

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [currentEditTxnId, setCurrentEditTxnId] = useState(null);
    const dispatch = useDispatch();
    const getLastWeekDate = () => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d;
    };
    const { get, del, post, response, loading, error } = useFetch({ data: [] });

    const [refreshKey, setRefreshKey] = useState(0);

    const handlePaymentSaved = () => {
        setRefreshKey(prev => prev + 1);

        if (onPaymentSaved) {
            onPaymentSaved();
        }
    };
    // const handleSubmit = (formValues) => {
    //     if (!selectedTransaction) {
    //         alert("Please select one transaction");
    //         return;
    //     }

    //     const val = {
    //         ...formValues,
    //         transactionId: selectedTransaction.transactionId,
    //            paymentDate: selectedTransaction.transactionDate,
    //     }
    //     console.log("values fro saving transa mappings",val)

    //     savepayment(val);
    //     onClose();
    // };

    return (
        <div className={classes.container}
        >

            <NewSalesPayment
                isReconcile={true}
                selectedItem={payment}
                selectedTransaction={selectedTransaction}
                // onSubmit={handleSubmit}
                onCancel={onClose}
                template={templatePayement}
                setSelectedTransactionId={setCurrentEditTxnId}
                validate={validate}
                onPaymentSaved={handlePaymentSaved}
            />




            {/* <div className="col-md-6" >
                    <ViewTransaction
                        isReconcile={true}
                        refreshKey={refreshKey}
                        fromDate={getLastWeekDate()}
                        toDate={new Date()}
                        singleSelect={true}
                        transactionTypeFilter="CREDIT"
                        onRowSelect={setSelectedTransaction}
                        selectedId={currentEditTxnId}
                    />
                </div> */}

        </div>
    );
};
export default SalesPaymentReconsile;

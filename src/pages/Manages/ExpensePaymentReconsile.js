import ViewTransaction from "../BankAccounts/ViewTransaction";
import NewExpensePayment from "./NewExpensePayment";
import React, { useState } from "react";
import {
    modalActions,
    useDispatch,
    classes,
} from "../../Components/CommonImports/CommonImports";

const ExpensePaymentReconsile = ({
    item,
    validate,
    templatePayement, onPaymentSaved, onClose
}) => {
    const getLastWeekDate = () => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d;
    };


    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [currentEditTxnId, setCurrentEditTxnId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handlePaymentSaved = () => {
        setRefreshKey(prev => prev + 1);
        if (onPaymentSaved) {
            onPaymentSaved();
        }
    };
    const dispatch = useDispatch();

    return (
        <div className={classes.container}>

            <NewExpensePayment
                isReconcile={true}
                selectedItem={item}
                //   selectedItem={item}
                expenseId={item?.expenseId}
                selectedTransaction={selectedTransaction}

                setSelectedTransactionId={setCurrentEditTxnId}

                template={templatePayement}
                validate={validate}
                onCancel={onClose}
                onPaymentSaved={handlePaymentSaved}
            />



        </div>
    );
};

export default ExpensePaymentReconsile;

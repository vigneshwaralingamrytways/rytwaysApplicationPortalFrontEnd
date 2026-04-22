import ViewTransaction from "../BankAccounts/ViewTransaction";
import NewPurchasePayment from "./NewPurchasePayment";
import React, { useState } from "react";
import {
    modalActions,
    useDispatch,
    classes,
} from "../../Components/CommonImports/CommonImports";

const PurchasePaymentReconsile = ({
    selectedItem,
    validate,
    templatePayement,onPaymentSaved,onClose
}) => {
    const [currentEditTxnId, setCurrentEditTxnId] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const dispatch = useDispatch();
    const [refreshKey, setRefreshKey] = useState(0);
    const handlePaymentSaved = () => {
        setRefreshKey(prev => prev + 1);
        setSelectedTransaction(null);
        setCurrentEditTxnId(null);
        onPaymentSaved()
    };
    return (
        <div className={classes.container}>
            

                {/* <div className="col-md-6"> */}
                    <NewPurchasePayment
                      key={refreshKey} 
                        isReconcile
                        selectedItem={selectedItem}
                        selectedTransaction={selectedTransaction}
                        template={templatePayement}
                        validate={validate}
                        setSelectedTransactionId={setCurrentEditTxnId}
                        onCancel={onClose}
                         onPaymentSaved={handlePaymentSaved} 
                    />
                {/* </div> */}

                {/* <div className="col-md-6">
                    <ViewTransaction
                     key={`txn-${refreshKey}`}
                      refreshKey={refreshKey}
                        isReconcile
                        singleSelect
                        transactionTypeFilter="DEBIT"
                        onRowSelect={setSelectedTransaction}
                        selectedId={currentEditTxnId}
                    />
                </div> */}

           
        </div>
    );
};

export default PurchasePaymentReconsile;

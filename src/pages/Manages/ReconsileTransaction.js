import React, { useCallback, useEffect, useState } from "react";
import {
    api,
    useFetch,
    classes,
    useDispatch,
    alertActions,
    CreateForm,
    Popupcard,
} from "../../Components/CommonImports/CommonImports";
 
import ViewTransaction from "../BankAccounts/ViewTransaction";


const ReconsileTransaction = () => {
    const { get, post, response } = useFetch({ data: [] });
    const dispatch = useDispatch();
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [debitType, setDebitType] = useState("");
    const [showDebitType, setShowDebitType] = useState(false);




    const validate = () => {

    }

    const template = {
        fields: [
            {
                title: "Transaction Type",
                name: "debitType",
                type: "radio",
                options: [
                    { value: "", label: "Select" },
                    { value: "PURCHASE", label: "Purchase" },
                    { value: "EXPENSE", label: "Expense" },
                ],
                validationProps: "Debit type is required",
                inpprops: {},
            },
        ],
    };

    const handleDebitTypeSubmit = (values) => {
        setDebitType(values.debitType);
    };

    return (

        // //left side
        // <div className="col-md-5">
        //     <ViewTransaction
        //      onSelectTransaction={setSelectedTransaction}
        //     />
        // </div>


        <div className={classes.container}>
            <div  >

                <div  >
                    <ViewTransaction
                        isReconcile={false}
                        isMapped={true}
                        // onTransactionSelect={(txn) => {
                        //     setSelectedTransaction(txn);
                        //     setDebitType("");
                        // }}
                        // onDebitTypeChange={setDebitType}
                        showCheckbox={false}
                        hideSNO={false}
                        onRowClick={(row) => {
                            setSelectedTransaction(row);

                            if (row.transactionType === "DEBIT") {
                                setShowDebitType(true);
                                setDebitType("");
                            } else {
                                setShowDebitType(false);
                            }
                        }}


                    />


                </div>

                {/* //right side
                <div className="col-md-5">
                    {!selectedTransaction && (
                        <div>Select a transaction</div>
                    )}

                    {selectedTransaction?.transactionType === "CREDIT" && (
                        <ManageSales />
                    )}



                    {selectedTransaction?.transactionType === "DEBIT" && 
                        
                          showDebitType && (   <Popupcard title="Select Transaction Type">
                                <CreateForm
                                    template={template}
                                    rowwise={3}
                                    defaultValues={{ debitType }}
                                    // onSubmit={handleDebitTypeSubmit}
                                    buttonName="Apply"
                                    validate={validate}
                                    onSubmit={(values) => {
                                        setDebitType(values.debitType);
                                        setShowDebitType(false);
                                    }}
                                // onSubmit={() => {}}
                                />

                            </Popupcard>
                          )}

  {selectedTransaction?.transactionType === "DEBIT" &&
            !showDebitType && (
              <>
                            {debitType === "PURCHASE" && (
                                <ManagePurchase
                                    transaction={selectedTransaction}
                                />
                            )}

                            {debitType === "EXPENSE" && (
                                <ExpenseManage
                                    transaction={selectedTransaction}
                                />
                            )}
                        </>
                    )}

                </div>*/}
            </div>

        </div>

    )
};

export default ReconsileTransaction;
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
import MakePaymentTable from "./MakePaymentTable";
import NewPayment from "./NewPayment";
import { Payments } from "@mui/icons-material";


const dummyPaymentItems = [
    {
        sNo: 1,
        paymentDate: "2025-11-21",
        paymentMode: "Cash",
        amount: 1000,
        tds: 50,
        paidAmount: "700",
        balanceAmount: "300",
        remark: "remarks1",
    },
    {
        sNo: 2,
        paymentDate: "2025-11-20",
        paymentMode: "Bank Transfer",
        amount: 5000,
        tds: 250,
        paidAmount: "1000",
        balanceAmount: "4000",
        remark: "rem",
    },
];


const MakePayment = () => {
    const { get, post, del, response } = useFetch({ data: [] });
    const dispatch = useDispatch();

    const [Payment, setPayment] = useState(dummyPaymentItems);

    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);

    const AlertHandler = (msg, type) => {
        dispatch(alertActions.showAlertHandler({
            showAlert: !showAlert,
            alertMessage: msg,
            alertVariant: type
        }));
    };


    const loadpayment = useCallback(async () => {
        const data = await get(api + "/makePayment/getAll");
        if (response.ok) setPayment(data);
    }, [get, response]);

    useEffect(() => {
        loadpayment();
    }, [loadpayment]);


    const template = {
        fields: [


            {
                title: "Payment Date",
                name: "date",
                type: "date",
                contains: "date",
                options: [],
                inpprops: { md: 3, },

            },

            {
                title: "Payment Mode",
                options: [],
                name: "itemDesc",
                type: "select",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },
            {
                options: [],
                title: "Invoice Amount",
                name: "itemDesc",
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },
            {
                options: [],
                title: "TDS",
                name: "itemDesc",
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },

            {
                options: [],
                title: "Balance Amount",
                name: "itemDesc",
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },
            {
                options: [],
                title: "Paid Amount",
                name: "itemDesc",
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Paid Amount is required"
            },
            {
                options: [],
                title: "Reference",
                name: "itemDesc",
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },
            {
                options: [],
                title: "Bank name",
                name: "itemDesc",
                type: "select",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },

            {
                options: [],
                title: "remark",//remarker
                name: "itemDesc",
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },

        ]
    }


    const savepayment = async (payment) => {
        let result;
        if (payment.id) {
            result = await post(api + "/payment/update/" + payment.id, payment);
        } else {
            result = await post(api + "/payment/create", payment);
        }
        if (response.ok) {
            AlertHandler("payment saved successfully", "success");
            loadpayment();
        } else {
            AlertHandler("Failed to save payment", "danger");
        }
    };


    const showFormHandler = (payment, action) => () => {
        const isEdit = action === "Edit";


        if (action === "Add" || isEdit) {
            dispatch(modalActions.showModalHandler({
                selectedData: payment,
                modalWidth: "70%",
                modalLeft: "15%",
                showModal: true,
                selectedForm: (
                    <NewPayment
                        selectedItem={payment}
                        savepayment={savepayment}

                        onCancel={() => dispatch(modalActions.hideModalHandler())}
                        template={template}
                        validate={validate}
                    />
                )
            }));
        }


        if (action === "Delete") {
            // deletepayment(payment.id);
        }
    };


    function onSubmit(values) {
        console.log("Search/filter values:", values);
    }
    function validate() {

    }

    
      const [paymentModeList, setPaymentModeList] = useState([]);
    
      const loadPaymentModes = useCallback(async () => {
        const res = await get(api + "/paymentMode/getall");
    console.log("paymentmode..",res)
        if (response.ok) {
          setPaymentModeList(
    
            res.map(pm => ({
              value: pm.paymenModetId,
              label: pm.paymentModeName
            }))
          );
        } else {
          setPaymentModeList([]);
        }
      }, [get, response]);
      useEffect(() => {
        loadPaymentModes();
      }, [loadPaymentModes]);
    

    const paymentFilterTemplate = {
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
                title: "Bank Name",
                name: "bankName",
                type: "select",
                options: Payment,
                inpprops: {},
            },
            {
                title: "Payment Mode",
                name: "paymentMode",
                type: "select",
                // options: [
                //     { value: "Cash", label: "Cash" },
                //     { value: "Bank Transfer", label: "Bank Transfer" },
                //     { value: "Cheque", label: "Cheque" },
                // ],
                options:paymentModeList,
                inpprops: {},
            },
        ],
    };

    const actions = ["Edit", "Delete", "Add", "Payment", "Doc"];

    return (
        <div className={classes.container}>
            <NewTable
                cols={MakePaymentTable(showFormHandler, actions)}
                data={Payment}
                striped
                title="View Payment"
                // showPlusCircle={true}
                // handleAddClick={showFormHandler({}, "Add")}
                template={paymentFilterTemplate}
                rowwise={3}
                rows={10}
                onSubmit={onSubmit}
                buttonName="Search"
                validate={validate}
            />
        </div>

    )
}
export default MakePayment;
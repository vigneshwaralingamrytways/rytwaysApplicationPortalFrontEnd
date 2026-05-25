import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./RichEditor.module.css";

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




import ProjectItemTable from "./ProjectItemTable";
import RichEditor from "./RichEditor";

export default function ProjectProposal(
    props
) {




    const { get, del, post, put, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [Project, setProject] = useState([]);
    const [formValues, setFormValues] = useState({});

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

    const template = {
        fields: [
            {

                // inpprops: {},
                colMdSize: 12,
                inpprops: {},
                title: "Scope of Work",
                type: "richtext",
                name: "scopeOfWork",
                contains: "textarea",
                // validationProps: "scope of Work is required",
            },
            {

                inpprops: {},
                // inpprops: { md: 12, rows: 20, minHeight: "300px" },
                title: "Payment Terms",
                type: "text",
                name: "paymentTerms",
                contains: "text",
                validationProps: "payment Terms is required",
            },
            {

                // inpprops: {},
                inpprops: {},
                title: "Notes ",
                type: "text",
                name: "notes",
                contains: "text",
                validationProps: "Notes is required",
            },

            {

                // inpprops: {},
                inpprops: {},
                title: "Quatation Date",
                type: "date",
                name: "quatationDate",
                contains: "date",
                // validationProps: "Quatation Date is required",
            },
        ]
    }


    const templatePaymentTerms = {
        fields: [
            {

                inpprops: {},
                // inpprops: { md: 12, rows: 20, minHeight: "300px" },
                title: "Payment Terms",
                type: "text",
                name: "paymentTerms",
                contains: "text",
                validationProps: "payment Terms is required",
            },
            {

                // inpprops: {},
                inpprops: {},
                title: "Notes ",
                type: "text",
                name: "notes",
                contains: "text",
                validationProps: "Notes is required",
            },
        ]
    }



    const templateItem = {
        fields: [
            {

                inpprops: {},
                title: "Description",
                type: "text",
                name: "description",
                contains: "text",
                validationProps: "scope of Work is required",
            },
            {

                inpprops: {},
                title: "amount",
                type: "text",
                name: "amount",
                contains: "text",
                validationProps: "scope of Work is required",
            },


        ]
    }

    function onSubmit(values) {
        console.log(values);

        if (!values.projectName || values.projectName.trim() === "") {
            loadProjects()
        }
        const filtered = Project.filter(p =>
            p.projectName.toLowerCase().includes(values.projectName.toLowerCase())
        );
        setProject(filtered);
    }

    //load Project from db
    const loadProjects = useCallback(async () => {
        // const allcountries = await get(api + "/Project/getall");

        const allProjects = await get(api + "/manageProject/getall?t=" + Date.now());

        console.log("all Project:", allProjects)

        // setProject(allcountries);
        if (response.ok) {
            setProject(allProjects);

        } else {
            console.log("res++>" + response);
            // AlertHandler("failed to get the Project", "danger")
        }

    }, [get, response])
    console.log("..projects", Project)
    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const rowWiseFields = 3;
    const rowColors = ["#fff"];
    function validate() {

    }


    const proposalCreate = async (values) => {

        const projectId = props.selectedItem.projectId;
        const scopeText = values.scopeOfWork;

        const val = {
            paymentTerms: values.paymentTerms,
            notes: values.notes,
            scopeOfWork: scopeText,
            quatationDate: values.quatationDate
        };
        const result = await post(api + `/manageProject/proposalCreate/${projectId}`, val);
        console.log("proposal create.", result)
        if (response.ok) {

            props.selectedItem.scopeOfWork = values.scopeOfWork;
            props.selectedItem.paymentTerms = values.paymentTerms;
            props.selectedItem.notes = values.notes;
            props.selectedItem.quatationDate = values.quatationDate;


            if (values.projectId) {

                AlertHandler("Proposal Updated Successfully", "success");
            } else {

                AlertHandler("Proposal Created Successfully", "success");
            }
        }
        else {
            if (values.projectId) {

                AlertHandler("Failed to update Propsal", "danger");
            }
            AlertHandler("Failed to Create Propsal", "danger");
        }

    };


    const savePaymentTerms = async (values) => {
        const projectId = props.selectedItem.projectId;
        const paymentTerms = values.paymentTerms;
        const notes = values.notes;
        const val = {
            paymentTerms: values.paymentTerms,
            notes: values.notes
        };
        const result = await post(api + `/manageProject/addPaymentTermsNotes/${projectId}`, val);
        console.log("updated scope of work..", result)
        if (response.ok) {
            AlertHandler("Payment terms Added Successfully", "success");
        }
        else {
            AlertHandler("Failed to add payment Terms", "danger");
        }

    };

    const loadItems = useCallback(async () => {
        const data = await get(api + "/projectProposalItem/getAllItem?t=" + Date.now());
        if (response.ok && data) {
            setItems(
                data.filter(
                    (i) => i.projectId === props.selectedItem.projectId
                )
            );
        }
    }, [get, response, props.selectedItem]);

    useEffect(() => {
        loadItems();
    }, [loadItems]);
    const saveItem = async (values) => {

        const url = `${api}/projectProposalItem/createItem?t=${Date.now()}`;
        const val = {
            ...values,
            projectId: props.selectedItem.projectId,
        }
        const res = await post(url, val);
        console.log(" values", val)
        if (response.ok) {

            AlertHandler(values.projectProposalItemId ? "Item updated" : "Item added", "success");
            setFormValues({});
            await loadItems();
        } else {
            AlertHandler("Add failed", "danger");
        }
    };


    const deleteItem = async (id) => {
        await del(api + "/projectProposalItem/delete/" + id);
        if (response.ok) {
            AlertHandler("Item deleted", "success");
            await loadItems();
        } else {
            AlertHandler("Delete failed", "danger");
        }
    };

    const showFormHandler = (item, action) => () => {
        if (action === "Delete") {
            deleteItem(item.projectProposalItemId);
        }

        if (action === "Edit") {
            setFormValues(item);

        }
    };



    const actions = ["Edit", "Delete"];


    return (
        <div className={classes.container}>
            <Popupcard
                title="Project Proposal"
                showBack onBack={props.onCancel}

            >
                {/* <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                    <label style={{ color: "#fff", marginBottom: "10px", display: "block" }}>Scope of Work</label>

                    <RichEditor
                        value={formValues.scopeOfWork}
                        onChange={(v) => setFormValues(prev => ({ ...prev, scopeOfWork: v }))}
                        readOnly={false}
                    />
                </div> */}
                <CreateForm
                    // template={{ fields: template.fields.filter(f => f.name !== "scopeOfWork") }}
                    template={template}
                    rowwise={3}
                    // defaultValues={{}}
                    defaultValues={props.selectedItem}
                    onSubmit={proposalCreate}
                    // onSubmit={(values) => proposalCreate({ ...values, scopeOfWork: formValues.scopeOfWork })}
                    onCancel={props.onCancel}
                    buttonName="Save"
                    validate={validate}
                />
                {/* <CreateForm
                    template={templatePaymentTerms}
                    rowwise={3}
                    // defaultValues={{}}
                    defaultValues={props.selectedItem}
                    onSubmit={savePaymentTerms}
                    onCancel={props.onCancel}
                    buttonName="Save"
                    validate={validate}
                /> */}

                <CreateForm
                    template={templateItem}
                    rowwise={3}
                    // defaultValues={props.selectedItem}
                    defaultValues={formValues}
                    onSubmit={saveItem}
                    onCancel={props.onCancel}
                    buttonName="Save"
                    validate={validate}
                />


                <NewTable
                    cols={ProjectItemTable(
                        showFormHandler,
                        actions

                    )}
                    data={items}
                    striped

                    rows={25}
                    title="Project proposal"
                    showPlusCircle={true}
                    handleAddClick={showFormHandler({}, "Add")}
                    // template={templatefilter}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Search"
                />
            </Popupcard>
        </div>
    );
}

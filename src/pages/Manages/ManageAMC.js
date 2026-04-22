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


// import NewProject from "./NewProject";
import NewProject from "./NewProject";
// import UploadProject from "./UploadProject";
// import ProjectTable from "./ProjectTable";
import NewBill from "./NewBill";
import AMCTable from "./AMCTable";
import Renewal from "./Renewal";
import UploadPayment from "./UploadPayment";
import Upload from "./Upload";
import { saveAs } from 'file-saver';
import ProjectProposal from "./ProjectProposal";
const ManageAMC = (props) => {

    const { get, del, post, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();

    const [Project, setProject] = useState([]);
    const [defaultValues, setDefaultValues] = useState({});
    // const [statusList, setStatusList] = useState([]);
    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);


    // ? SLIDE STATES
    const [isSlideOpen, setIsSlideOpen] = useState(false);
    const [activeForm, setActiveForm] = useState(null);
    // ? CLOSE SLIDE
    const closeSlide = () => {
        setIsSlideOpen(false);
        setActiveForm(null);
    };
    const AlertHandler = (alertContent, alertType) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: !showAlert,
                alertMessage: alertContent,
                alertVariant: alertType,
            })
        );
    };


    const [customerList, setCustomerList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [projectCategoryList, setProjectCategoryList] = useState([]);
    const [projectTypeList, setProjectTypeList] = useState([]);




    const loadCustomers = useCallback(async () => {
        const data = await get(api + "/customerMaster/getall?t=" + Date.now());
        if (response.ok) {
            setCustomerList(
                data.map(item => ({
                    label: item.customerName,
                    value: item.id
                }))
            );
        }
    }, [get, response]);
    const loadStatuses = useCallback(async () => {
        const data = await get(api + "/status/getall?t=" + Date.now());
        if (response.ok) {
            setStatusList(
                data.map(item => ({
                    label: item.statusName,
                    value: item.statusId
                }))
            );
        }
    }, [get, response]);
    const loadProjectCategories = useCallback(async () => {
        const data = await get(api + "/projectCategory/getall?t=" + Date.now());
        if (response.ok) {
            setProjectCategoryList(
                data.map(item => ({
                    label: item.projectCatagoryName,
                    value: item.projectCatagoryId
                }))
            );
        }
    }, [get, response]);
    const loadProjectTypes = useCallback(async () => {
        const data = await get(api + "/projectType/getall?t=" + Date.now());
        if (response.ok) {
            setProjectTypeList(
                data.map(item => ({
                    label: item.projecTypeName,
                    value: item.projectTypeId
                }))
            );
        }
    }, [get, response]);
    useEffect(() => {
        loadCustomers();
        loadStatuses();
        loadProjectCategories();
        loadProjectTypes();
    }, []);

    const templatefilter = {
        fields: [
            {

                inpprops: {}, title: "project Name",
                type: "text",
                name: "projectName",
                contains: "text",
                validationProps: "Project  catagoryname is required",
            },
        ]
    }

    const template = {
        fields: [
            // {

            //      inpprops: {}, title: "Seq no",
            //     type: "text",
            //     name: "seqNo",
            //     contains: "text",
            //     // validationProps: "Project name is required",
            // },
            {

                inpprops: {}, title: "Proj Enq Date",
                type: "date",
                name: "ProjectCatagory",
                contains: "date",
                validationProps: "Proj Enq Date is required",
            },

            {

                inpprops: {}, title: "Customer name",
                type: "select",
                name: "customerId",
                contains: "text",
                // options: [],
                options: customerList,
                validationProps: "Customer name is required",
            },
            //     ,
            {
                inpprops: {}, title: "Project Name",
                type: "text",
                name: "projectName",
                options: [],
                validationProps: "Project Name is required",
            }, {
                inpprops: {}, title: "Project Desc",
                type: "text",
                name: "projectDescription",
                options: [],
                validationProps: "Project Desc is required",
            },
            {
                inpprops: {}, title: "Project value",
                type: "text",
                name: "projectValue",
                options: [],
                validationProps: "Project value is required",
            },
            {
                inpprops: {}, title: "Project Start Date",
                type: "date",
                name: "projectStartDate",
                contains: "date",
                validationProps: "Project Start Date is required",
            }
            ,
            {
                inpprops: {}, inpprops: {}, title: "Project end date",
                type: "date",
                name: "Project end date",
                contains: "date",
                validationProps: "Project end date is required",
            },
            {
                inpprops: {}, title: "Status",
                type: "select",
                name: "statusId",
                contains: "text",
                validationProps: "Status is required",
                //   options:[
                //     {label:"select",val:""},
                //      {label:"discussion",val:"discussion"},
                //       {label:"confirmed",val:"confirmed"},
                //         {label:"rejected",val:"cancel"},
                //           {label:"cancel",val:"cancel"},

                //   ]
                options: statusList,
            },


            {
                inpprops: {}, title: "Invoiced Amount",
                type: "number",
                name: "invoicedAmount",
                contains: "number",
                validationProps: "invoice amount required",
            },


            {
                inpprops: {}, title: "project catagory",
                type: "select",
                name: "projectCategoryId",
                contains: "text",
                validationProps: "project catagory is required",
                //   options:[
                //     {label:"select",val:""},
                //    {label:"developement",val:"developement"},
                //       {label:"support",val:"support"},
                //         {label:"licence",val:"licence"},
                //           {label:"hardware",val:"hardware"},
                //            {label:"others",val:"others"},

                //   ]
                options: projectCategoryList,
            },

            {
                inpprops: {}, title: "project Type",
                type: "select",
                name: "projectTypeId",
                contains: "text",
                validationProps: "project Type is required",
                //   options:[
                //     {label:"select",val:""},
                //    {label:"OneTimeAMC",val:"OneTime"},
                //       {label:"AMC",val:"AMC"},

                //   ]
                options: projectTypeList,
            },

            // 
        ]
    }



    const handleProposalPdf = async (rowData) => {
        try {
            // const res = await get(api + `/invoiceHeader/print/${rowData.invoiceHeader?.invoiceHeaderId||rowData.invoiceHeaderId}`);
            const result = await get(api + `/manageProject/printProposal/${rowData.projectId}`);

            if (response.ok) {

                const blob = await response.blob();
                saveAs(blob, `Proposal_${rowData.projectName}.pdf`);
                AlertHandler("Proposal PDF Downloaded Successfully", "success");
            } else {
                AlertHandler("Failed to download file", "danger");
                console.log("fail to docnlods", response)
            }
        } catch (err) {
            console.log("errors,", err);
        }
    };
    //load Project from db
    const loadProjects = useCallback(async () => {
        // const allcountries = await get(api + "/Project/getall");
        try {
            const allProjects = await get(api + "/manageProject/getall?t=" + Date.now());

            console.log("all ProjectCat:", allProjects)
            // setProject(allcountries);
            if (response.ok) {


                const amcprojects = allProjects.filter(item => item.projectTypeId === 2)
                setProject(amcprojects);

            } else {
                console.log("res++>" + response);
                // AlertHandler("failed to get the Project", "danger")
            }
        }
        catch (err) {
            console.log("err", err)
        }

    }, [get, response])

    useEffect(() => {
        loadProjects();

    }, [loadProjects]);

    const saveProject = async (val) => {
        console.log("values of esp:", val)
        const result = await post(api + "/ProjectCatagory/create", val);
        console.log("sent fto backned expcat", result)
        if (response.ok) {
            if (val.ProjectCatagoryId) {
                setProject(prev => prev.map(x => (x.ProjectCatagoryId === val.ProjectCatagoryId ? result : x)))

                AlertHandler("updated", "success")
            }

            else {
                // setProject([...Project, result]);
                AlertHandler("created expe", "succuss")
            }
        }
        else {
            AlertHandler("save failed", "danger")
        }

    }


    const rowWiseFields = 3;
    const rowColors = ["#fff"];
    function validate() {

    }



    const deleteProject = async (ProjectCatagoryId) => {
        console.log("id", ProjectCatagoryId)
        const deleted = await del(api + "/ProjectCatagory/delete" + ProjectCatagoryId);
        console.log("deleted::" + deleted);
        if (response.ok) {

            console.log("resp==>,", response)

            AlertHandler("Project deleted ", "success");
            // setProject((prev) => prev.filter((c) => c.ProjectCatagoryId !== ProjectCatagoryId));
        } else {
            console.log("resp==>,", response)
            // AlertHandler("Failed to delete Project", "danger");
        }
    };

    // function onSubmit(val) {

    //     console.log("resp==>,", response)
    //     saveProject(val);
    // }
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



    //actionicon
    const actions = ["Edit", "Delete", "Add", "ProjectProposal", "Bill", "Upload", "Renewal", "EditRenewal", "Pdf"];


    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};

        if (action === "Add" || isEdit) {
            setActiveForm(
                <NewProject
                    selectedItem={formData}
                    onCancel={closeSlide}
                    saveProject={saveProject}
                    template={template}
                    validate={validate}
                    showFormHandler={showFormHandler}
                />

            );
            setIsSlideOpen(true);
            return;

        }

        if (action === "Delete") {
            deleteProject(item.ProjectCatagoryId);
        }

        //upload

        if (action === "Upload") {
            setActiveForm(
                <Upload
                    referenceId={item.projectId}
                    referenceType="PROJECT_AMC"
                    uploadTitle="PROJECT AMC Upload"

                    onCancel={closeSlide}
                    //  template={templatePayement} 
                    validate={validate}
                />
            )
            setIsSlideOpen(true);
            return;

        }

        if (action === "Bill") {
            setActiveForm(
                <NewBill
                    //  selectedItem={Project}
                    selectedItem={item}
                    //  saveProject={saveProject}
                    showFormHandler={showFormHandler}
                    actions={actions}
                    onCancel={closeSlide}
                    //  template={templatePayement} 
                    validate={validate}
                />
            )

            setIsSlideOpen(true);
            return;

        }
        ///renewal
        if (action === "Renewal") {
            setActiveForm(
                <Renewal
                    selectedItem={item}
                    //  saveProject={saveProject}
                    showFormHandler={showFormHandler}
                    actions={actions}
                     onCancel={async () => {
                        await loadProjects();
                        closeSlide();
                    }}
                    //  template={templatePayement} 
                    validate={validate}
                />
            )

            setIsSlideOpen(true);
            return;

        }


        if (action === "EditRenewal") {
            setActiveForm(
                <Renewal
                    selectedItem={item}
                    showFormHandler={showFormHandler}
                    actions={actions}
                    onCancel={async () => {
                        await loadProjects();
                        closeSlide();
                    }}
                />
            )

            setIsSlideOpen(true);
            return;
        }


        if (action === "ProjectProposal") {
            setActiveForm(
                <ProjectProposal
                    selectedItem={item}
                    //  saveProject={saveProject}
                    showFormHandler={showFormHandler}
                    actions={actions}
                    onSubmit={onsubmit}
                    onCancel={closeSlide}
                    //  template={templatePayement} 
                    validate={validate}
                />)
            setIsSlideOpen(true);
            return;

        }


        if (action === "Pdf") {

            handleProposalPdf(item);

        }
    };




    return (
        <div className={classes.container}>

            {/* <Popupcard
                title="Add Project" 

            > */}
            {!isSlideOpen && (
                <NewTable
                    cols={AMCTable(
                        showFormHandler,
                        actions

                    )}
                    data={Project}
                    striped

                    rows={25}
                    title="Manage AMC"
                    // showPlusCircle={true}
                    handleAddClick={showFormHandler({}, "Add")}
                    template={templatefilter}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Search"
                />)}


            {/* </Popupcard> */}

            {/* ? SLIDE POPUP */}
            <div
                className={`${classes.sliderPopup} ${isSlideOpen ? classes.open : ""
                    }`}
            >
                {activeForm}
            </div>
        </div>
    )
}
export default ManageAMC;
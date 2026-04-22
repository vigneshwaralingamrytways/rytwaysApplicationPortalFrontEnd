import React, { useCallback, useEffect, useState } from "react";
// import NewPayment from "./NewPayment";
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





import NewDefineSalaryStructure from "./NewDefineSalaryStructure";
import DefineSalaryStructureTable from "./DefineSalaryStructureTable";
import { motion, AnimatePresence } from "framer-motion";







const DefineSalaryStructure = (props) => {

    const { get, del, post,put, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();
    const [Request, setRequest] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const [defaultValues, setDefaultValues] = useState({});
    const [statusList, setStatusList] = useState([]);
    const [salaryDefine, setSalaryDefine] = useState([]);
    const [EmployeeRole, setEmployeeRole] = useState([])
    const [originalRoles, setOriginalRoles] = useState([]);

    const [isSlideOpen, setIsSlideOpen] = useState(false);
    const [activeForm, setActiveForm] = useState(null);
    const [componentType, setComponentType] = useState([])
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
                title: "Component Type",
                type: "select",
                contains: "text",
                name: "componentTypeId",

                validationProps: "type is required",
                inpprops: {},

                options: componentType,


            },
            {
                title: "Component Name",
                type: "text",
                contains: "text",
                name: "componentName",
                validationProps: "name is required",
                inpprops: {},

            },
            {
                title: "Component Value",
                type: "text",
                contains: "number",
                name: "componentValue",
                validationProps: "component Value is required",
                inpprops: {},

            },

        ],
    }






    const templateforfilter = {
        fields: [


            {
                title: "Employee Role",
                type: "select",
                name: "empRoleId",
                options: [
                    { label: "All", value: "" },
                    ...originalRoles.map(role => ({
                        label: role.empRoleName,
                        value: role.empRoleId
                    }))
                ],
            },

        ]
    };




    //load EmployeeRole from db
    const loadComponentTypes = useCallback(async () => {

        const allcomponenetTypes = await get(api + "/componentType/getall");

        console.log("all EmployeeRole:", allcomponenetTypes)
        // setEmployeeRole(allcountries);
        if (response.ok) {
            setComponentType(
                allcomponenetTypes.map((item) => ({
                    label: item.componentType,
                    value: item.componentTypeId
                }))
            );

        } else {
            console.log("res++>" + response);
            // AlertHandler("failed to get the EmployeeRole", "danger")
        }


    }, [get, response])

    useEffect(() => {
        loadComponentTypes();

    }, [loadComponentTypes]);

    const saveComponentType = async (values) => {
        const result = await post(
            api + "/componentType/create",
            values
        );

        if (response.ok) {
            AlertHandler("Component Type added", "success");
            setComponentType((prev) => [
                ...prev,
                {
                    label: result.componentType,
                    value: result.componentTypeId,
                },
            ]);
        } else {
            AlertHandler("Save failed", "danger");
        }
    };



    //load EmployeeRole from db
    const loadEmployeeRoles = useCallback(async () => {
        // const allcountries = await get(api + "/EmployeeRole/getall");
        const allEmployeeRoles = await get(api + "/employeeRole/getall");

        console.log("all EmployeeRole:", allEmployeeRoles)
        // setEmployeeRole(allcountries);
        if (response.ok) {
            setEmployeeRole(allEmployeeRoles);
            setOriginalRoles(allEmployeeRoles);

        } else {
            console.log("res++>" + response);
            // AlertHandler("failed to get the EmployeeRole", "danger")
        }


    }, [get, response])

    useEffect(() => {
        loadEmployeeRoles();

    }, [loadEmployeeRoles]);

    const loadSalaryDefines = useCallback(async () => {
        const data = await get(api + "/salaryDefine/getall");
        console.log("load the salary define", data)
        if (response.ok) {
            setSalaryDefine(data);
        }
    }, [get, response]);

    useEffect(() => {
        loadSalaryDefines();
    }, [loadSalaryDefines]);


    const saveSalaryDefine = async (val) => {
        console.log("values for save", val)
        // const values = {
        //     ...val,
        //     empRoleId: selectedItem.empRoleId
        // } 
        let result;

        if (val.salaryDefineId) {
            // UPDATE
            result = await put(api + "/salaryDefine/update/" + val.salaryDefineId, val);
        } else {
            // CREATE
            result = await post(api + "/salaryDefine/create", val);
        }

        console.log("res for save", result)
        if (response.ok) {
            AlertHandler("Salary structure saved", "success");
            setSalaryDefine((prev) => [...prev, result]);
            
            return result
        } else {
            AlertHandler("Failed to save", "danger");
        }
    };




    // useEffect(() => {
    //   loadStatuses();
    // }, [loadStatuses]);






    const rowWiseFields = 3;
    function validate() {

    }

    const deleteComponentType = async (val) => {
        const deleted = await del(
            api + "/componentType/delete/" + val.componentTypeId
        );

        if (response.ok) {
            AlertHandler("Deleted successfully", "success");
            setComponentType((prev) =>
                prev.filter(
                    (c) => c.value !== val.componentTypeId
                )
            );
        } else {
            AlertHandler("Delete failed", "danger");
        }
    };

    // function onSubmit(val) {

    //     console.log("resp==>,", response)
    //     saveRequest(val);
    // }

    function onSubmit(values) {
        console.log("Filter values:", values);

        if (!values?.empRoleId) {
            setEmployeeRole(originalRoles);
            return;
        }

        const roleId = Number(values.empRoleId);

        const filtered = originalRoles.filter(
            role => role.empRoleId === roleId
        );

        setEmployeeRole(filtered);
    }








    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};

        if (action === "Define" || action === "Edit") {

            setActiveForm(
                <NewDefineSalaryStructure
                    empRoleId={item.empRoleId}
                    selectedItem={formData}
                    onCancel={() => {
                        setIsSlideOpen(false);
                        setActiveForm(null);
                    }}
                    saveSalaryDefine={saveSalaryDefine}
                    template={template}
                    validate={validate}
                    salaryDefine={salaryDefine}
                    rowWiseFields={4}
                    showFormHandler={showFormHandler}
                    actions={actions}
                    title={`${item.empRoleName} - Define Salary Structure`}
                    reloadSalaryDefine={loadSalaryDefines}
                />
            );

            setIsSlideOpen(true);
            return;
        }

        if (action === "Delete") {
            deleteSalaryDefine(item);
        }
    };

    const deleteSalaryDefine = async (val) => {
        const deleted = await del(
            api + "/salaryDefine/delete/" + val.salaryDefineId
        );

        if (response.ok) {
            AlertHandler("Component deleted", "success");
            setSalaryDefine((prev) =>
                prev.filter((d) => d.salaryDefineId !== val.salaryDefineId)
            );
        } else {
            AlertHandler("Delete failed", "danger");
        }
    };


    const actions = ["Edit", "Delete", "Add", "Define"];

    return (
        <div
            className={classes.container}
            style={{
                position: "relative",
                minHeight: "100vh",
                overflow: "hidden"
            }}
        >

            <AnimatePresence mode="wait">

                {!isSlideOpen && (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                    >
                        <NewTable
                            cols={DefineSalaryStructureTable({
                                showFormHandler,
                                actions
                            })}
                            data={EmployeeRole}
                            striped
                            rows={25}
                            title="Define Salary Structure"
                            handleAddClick={showFormHandler({}, "Add")}
                            template={templateforfilter}
                            rowwise={rowWiseFields}
                            validate={validate}
                            onSubmit={onSubmit}
                            onCancel={props.onCancel}
                            buttonName="Search"
                            rowWise={4}
                        />
                    </motion.div>
                )}

                {isSlideOpen && (
                    <motion.div
                        key="slide"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.4 }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "#fff",
                            zIndex: 10,
                            overflowY: "auto"
                        }}
                    >
                        {activeForm}
                    </motion.div>
                )}

            </AnimatePresence>

        </div>
    );
}
export default DefineSalaryStructure;
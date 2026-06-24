import React, { useCallback, useEffect, useState } from 'react';
import {
    CreateForm,
    PopupSimpleCard,
    Popupcard,
    Table, alertActions,
    api,
    classes,
    modalActions,
    useDispatch,
    useFetch,
    useSelector
} from '../../../../Components/CommonImports/CommonImports';
import FunctionWizTable from '../Table/FunctionWizTable';
import { generateToken } from '../../../../Components/GenerateToken';



const rowWiseFields = 3;

function ProcCommWiz(props) {


    const { get, post, response, cache, loading, error } = useFetch({ data: [] });

    const [data, setData] = useState([]);
    const [defaultValue, setDefaultValue] = useState(props?.selectedItem || {});
    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);

    const [showModal, selectedForm, selectedData, modalWidth, modalLeft] = useSelector((state) => [
        state.modalProps.showModal,
        state.modalProps.selectedForm,
        state.modalProps.selectedData,
        state.modalProps.modalWidth,
        state.modalProps.modalLeft,
    ]);

    const dispatch = useDispatch();
    const AlertHandler = (alertContent, alertType) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: !showAlert,
                alertMessage: alertContent,
                alertVariant: alertType,
            })
        );
    };


    const loadInitialLists = useCallback(async () => {
        // const { ok } = response // BAD, DO NOT DO THIS
        const loadedLists = await post(api + "/functionMaster/functionMaster", { processId: props.selectedItem.processId, "random": generateToken() });
        console.log(loadedLists)
        if (loadedLists.length > 0) {
            setData([...loadedLists]);
        } else {
            setData([])
        }

        // console.log({...props.selectedItem})
    }, [get, response]);

    useEffect(() => {
        loadInitialLists();
    }, []);
    const handleDelete = async (values) => {

        console.log("values", values)

        const deleteFile = await post(api + "/functionMaster/delete", values)

        if (response.ok) {

            const deleteRecord = data.filter(item => item.functionId !== values.functionId);
            setData(deleteRecord);

            //   dispatch(modalActions.hideModalHandler());
            AlertHandler("Function Deleted Successfully", "success")
        } else {
            // dispatch(modalActions.hideModalHandler())
            AlertHandler("Function Details Failed To Delete", "danger")
        }

    }

    const actions = ["edit", "activityForm", "delete"];
    const showFormHandler = (item, action) => () => {
        if (action == "edit") {
            setDefaultValue({ ...item })
        } else if (action === "delete") {
            handleDelete(item)
        }
    };

    const template = {
        fields: [

            {
                title: "Type",
                type: 'select',
                name: 'commentType',
                contains: 'Select',
                options: [...props.commentType, { value: "Bug", label: "Bug" }],
                validationProps: "Value is required",
            }, {
                title: "Comment",
                type: "textarea",
                name: "issueComments",
                contains: "textarea",

                inpprops: { md: 8 },
            },
            {
                title: "Upload Document",
                type: "Document",
                name: "file",
                contains: "Document",
                inpprops: {
                    md: 4,
                },
            }, {
                title: "Remarks",
                type: "textarea",
                name: "remarks",
                contains: "textarea",
                inpprops: {
                    md: 8,
                },
            },
            {
                type: "hidden",
                name: "commentId",
                contains: "text",
                inpprops: {

                },
            }

        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }



    // function onSubmit(values) {
    //     values.commentStatus = values?.commentStatus || "Created"


    //     props.onSubmitTwo(values)


    // }
    async function onSubmit(values) {
        const commentPayload = {
            commentType: values.commentType,
            issueComments: values.issueComments,
            commentId: values.commentId,
            commentStatus: values?.commentStatus || "Created",
            issueId: props.selectedItem?.issueId || "",
            source: "Testing"
        };

        const savedCommentResult = await post(api + "/issueSolution/createComments", commentPayload);
        console.log(" sav res commnts", savedCommentResult)
        if (response.ok && savedCommentResult && savedCommentResult.commentId && values.file && values.file.length > 0) {
            const generatedCommentId = savedCommentResult.commentId;
            const formData = new FormData();

            for (let i = 0; i < values.file.length; i++) {
                formData.append("files", values.file[i]);
            }

            formData.append("reportType", "Activity");
            formData.append("remarks", values.remarks || "");
            formData.append("queryId", generatedCommentId);
            formData.append("filePath", "COMMENT/");

            const uploadResult = await post(api + "/queryDoc/uploadFile", formData);
            cache.clear();
            console.log(" file res", uploadResult)
            if (uploadResult && uploadResult.retValues && uploadResult.retValues.status === 1) {
                AlertHandler("Comment and Files Uploaded Successfully", "success");
                dispatch(modalActions.hideModalHandler());
                if (props.loadInitialCustomers) props.loadInitialCustomers();
            } else {
                AlertHandler("Comment Saved, but File Upload Failed", "danger");
            }
        } else if (response.ok && savedCommentResult) {
            AlertHandler("Comments Saved Successfully", "success");
            dispatch(modalActions.hideModalHandler());
            if (props.loadInitialCustomers) props.loadInitialCustomers();
        } else {
            AlertHandler("Comments Failed To Save", "danger");
        }
    }

    return (
        <div className={classes.container}>
            <Popupcard
                //     title="Sub Type"

                title={props.selectedItem.processName ? ` ${props.selectedItem.processName}  ` : 'Comment Details'}

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={defaultValue}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>


            </Popupcard>

        </div>
    );
}

export default ProcCommWiz;



import React, { useState, useEffect, useCallback } from 'react';
import {

    SearchCard,Popupcard,SimpleCard,PopupSimpleCard,CreateForm,Table,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider,classes,Row, Button, NavCreateForm
    } from '../../../Components/CommonImports/CommonImports';
import { saveAs } from 'file-saver';
import UploadTablewiz from './Table/UploadTablewiz';
import { generateToken } from '../../../Components/GenerateToken';

const rowWiseFields = 3;

function UploadFormWiz(props) {
    

    const { get, post,cache, response, loading, error } = useFetch({ data: [] });
    const [data,setData]=useState([])
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


    const handleDown = async (rowData) => {
        const download = window.location.origin     
        console.log("downloadapi",download) 
     // window.open(`${download}/downloads/SRIPATHI/ /Test/${rowData.filePath}/${rowData.generatedFileName}`,'_blank', 'noreferrer')
    }

    const handleDownloadab = async (rowData) => {
        const serverUrl = await get (`${api}/queryDoc/serverinfo`);
        console.log("downloadapi",serverUrl.baseUrl)
    if(response.ok && serverUrl.baseUrl){

        console.log("downloadapi",typeof(serverUrl.baseUrl))
    
        const filePath = rowData.filePath; // This will be like "Test/subfolder"
        const fileName = rowData.generatedFileName;
        console.log("path",window.location.origin);
        console.log("path",window.location);

        window.open(`${serverUrl.baseUrl}/downloads/SRIPATHI/Test/${rowData.filePath}/${rowData.generatedFileName}`);
    }
    };
    const handleDownload = async (rowData) => {
        try {
            const docReport = await post(api + '/queryDoc/downloadFile', 
                { reportDocId: rowData.reportDocId });
    
            // Log the entire response object for debugging
            
    
            if (docReport) {
                console.log("docReport",docReport)
             
                // const blob = await response.blob();
                // const fileName =rowData.fileName;
                // console.log("genereatedfile",fileName)
                //  saveAs(blob, fileName)
                const blob = await response.blob();
                const fileName = rowData.fileName;
                console.log("Generated file:", fileName);
    
                // Create a URL for the Blob object
                const url = window.URL.createObjectURL(blob);
    
                // Create a temporary <a> element
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;  // Set the download filename
                document.body.appendChild(link);
    
                // Programmatically click the link to trigger the download
                link.click();
    
                // Clean up the URL and remove the temporary link
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            } else {
                console.error('Error downloading the document: Response data is undefined.');
            }
        } catch (error) {
            console.error('Error during download:', error);
        }
    };
    
    
    const handleDelete = async (values) => {
      
        const deleteFile = await post(api+ '/queryDoc/delete', values)

        if (response.ok) {
           // dispatch(modalActions.hideModalHandler());
           setData(data.filter((cust) => cust.reportDocId != values.reportDocId))
          // props.loadInitialTransac()
            AlertHandler("Document Deleted Successfully","success")
          }else{
          dispatch(modalActions.hideModalHandler())
          AlertHandler("Document Details Failed To Delete","danger")
        }   
    
    }
    const actions = ["download","delete","status","payment","document"];
    const showFormHandler = (item, action) => () => {
        if (action === "download") {
            handleDownload(item)
        }else if (action === "delete") {
            handleDelete(item)
        }
      console.log(action);
      
    };

    const template = {
        fields: [
/* 
            {
                title: "Document Name",
                type: "text",
                name: "documentname",
                contains: "text",
                inpprops: {
                    md:4,
                },
            }, */
            {
                title: "Upload Document",
                type: "MultiDocument",
                name: "file",
                contains: "Document",
                inpprops: {
                    md:4,
                  },
              },{
                title: "Remarks",
                type: "textarea",
                name: "remarks",
                contains: "textarea",
                inpprops: {
                  md:8,
                },
              },
        ],
    };


    const loadInitialLists = useCallback(async () => {

        console.log("props?.docId", props?.docId)
        // const { ok } = response // BAD, DO NOT DO THIS
       const loadedLists = await post(api + "/queryDoc/getListByType",{"reportType":props?.reportType,"queryId":props?.docId,random:generateToken()});
       console.log(loadedLists)
       if(loadedLists.length>0){
        setData([...loadedLists]);
       } else{
        setData([])
       }
       
        // console.log({...props.selectedItem})
      }, [get, response]);
    
      useEffect(() => {
        loadInitialLists();
      }, []);
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

    const saveDetails = async (order) => {
        const orderapi = "/queryDoc/uploadFile";  // Adjusted endpoint
        const formData = new FormData();
    
        for (let i = 0; i < order.file.length; i++) { // Loop through selected files
            formData.append("files", order.file[i]);
        }

        console.log("reportType", props?.reportType, "remarks", order.remark, "queryId", order?.queryId, "filePath", props?.filePath);
    
        formData.append("reportType", props?.reportType);
        formData.append("remarks", order.remarks);
        formData.append("queryId", order?.queryId);
        formData.append("filePath", props?.filePath);
        
    
        console.log(orderapi);
        const returnObject = await post(api + orderapi, formData);
        cache.clear();
        console.log(returnObject);
    
        if (returnObject.retValues.status === 1) {
           // dispatch(modalActions.hideModalHandler());
           setData([...data, ...returnObject.retValues.reports])
           
            AlertHandler(returnObject.retValues.message, "success");
        } else {
            dispatch(modalActions.hideModalHandler());
            AlertHandler(returnObject.retValues.message, "danger");
        }
    };
    

    function onSubmit(values) {
       
// values.queryId= values.processId || values.functionId || values.activityId

values.queryId= props?.docId

console.log(" values docId ====>",values?.queryId);
      //  props.loadInitialTransac()
        saveDetails(values)


    }

    return (
        <div className={classes.container}>
            <Popupcard
              title={props.documentName ? `${props.documentName} File Uploaded` : "File Upload"}

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={props.selectedItem}
                    buttonName={props.docAcces === "Yes" ? "" : "Save"}

                ></CreateForm>

<PopupSimpleCard>
    
    <Table cols={UploadTablewiz(showFormHandler, actions)} 
data={data}   striped
       rows={10} /> </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default UploadFormWiz;



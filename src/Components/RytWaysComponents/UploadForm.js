import React, { useState, useEffect, useCallback } from 'react';

import FileUploadTable from './Table/FileUploadTable'
import { saveAs } from 'file-saver';
import  Popupcard from '../../UI/cards/Popupcard';
import PopupSimpleCard from '../../UI/cards/PopupSimpleCard';
import CreateForm from '../Forms/CreateForm';
import Table from '../../Components/tables/Table';
import useFetch, { Provider } from "use-http";
import { useSelector, useDispatch } from "react-redux";
import { modalActions } from "../../store/modal-Slice";
import { alertActions } from "../../store/alert-slice";
import api from "../../Api";
import classes from "./Upload.module.css";
    
const rowWiseFields = 2;

function UploadForm(props) {


    const { get, post, cache,response, loading, error } = useFetch({ data: [] });
    const [docs,setDocs]=useState([])
    const [showForm,setShowForm] = useState(props?.hideForm ? !props.hideForm : true)
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

    const loadInitialOptions1 = useCallback(async () => {
        // const { ok } = response // BAD, DO NOT DO THIS
       const loadedQuotes = await post(api + "/documents/getDocs",{longId:props.entryId,catName:props.entryType,rand:Math.random()});
       console.log(loadedQuotes)
       if(loadedQuotes.length>0){
        setDocs([...loadedQuotes]);
       } else{
        setDocs([])
       }
       
        // console.log({...props.selectedItem})
      }, [get, response]);
    
      useEffect(() => {
        loadInitialOptions1();
      }, []); // componentDidMount

      const handleDownload = async (rowData) => {
        try {
            const docReport = await post(api + '/documents/downloadFile', 
                { entryId: rowData.entryId,
                    entryType:rowData.entryType,
                    docId:rowData.docId});
    
            // Log the entire response object for 
            console.log("docReport",rowData)
            console.log("docReport",rowData.poQuotesId)
            if (docReport) {
               
              console.log("docReport",docReport)
              
               /*  const blob = await response.blob();
                const fileName =rowData.fileName;
                console.log("genereatedfile",fileName)
                 saveAs(blob, fileName) */
    
                 const blob = await response.blob();
                 const now = new Date();
                 const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getFullYear()).slice(-2)}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
         
                 // Generate the file name with the date
                 const fileName =rowData.fileName;
                  saveAs(blob, fileName)
    
              /*   const blob = await response.blob();
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
                document.body.removeChild(link); */
            } else {
                console.error('Error downloading the document: Response data is undefined.');
            }
        } catch (error) {
            console.error('Error during download:', error);
        }
    };

      const deleteDetails = async (entry) => {
        //  procMaps
        const materialEntryapi = "/documents/deleteDocs" 
        const returnObject = await post(api + materialEntryapi, entry);
        if (returnObject) {
         // array.filter(obj => obj.id !== id);
          setDocs(
            docs.filter((doc) =>
             doc.docId !== entry.docId
              
            )
          );
        } else {
       //   dispatch(modalActions.hideModalHandler());
          AlertHandler("Failed to Save the Details", "danger");
        }
      };
  

    const actions = ["Add","AddBooking","status","payment","document"];
    const showFormHandler = (item, action) => () => {
      if(action==="view"){
          handleDownload(item)
      }else if(action==="delete"){
        deleteDetails(item)
       }
      
    };

    const template = {
        fields: [

            {
                title: "Description",
                type: "text",
                name: "remarks",
                contains: "text",
                inpprops: {
                    md:4,
                },
            },
            {
                title: "Upload Document",
                type: "Document",
                name: "file",
                contains: "Document",
                inpprops: {
                    md:8,
                  },
              },{
                 type: "hidden",
                name: "entryType",
               value:props.entryType
              },{
                type: "hidden",
               name: "entryId",
              value:props.entryId
             },
        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
   }


    const saveDetails = async (order) => {
        //  procMaps
        const orderapi = "/documents/uploadFile"  ;
        const formData = new FormData();
        formData.append("file", order.file[0]);
        formData.append("entryId",order.entryId)
        formData.append("entryType",order.entryType)
        formData.append("remarks",order.remarks)
        console.log(orderapi);
        const returnObject = await post(api + orderapi, formData);
        cache.clear()
        console.log(returnObject);
        if (returnObject.retValues.status == 1) {
            dispatch(modalActions.hideModalHandler());
            AlertHandler(returnObject.retValues.message, "success");
        } else {
          dispatch(modalActions.hideModalHandler());
          AlertHandler(returnObject.retValues.message, "danger");
        }
      };

    function onSubmit(values) {
        console.log(values);
        saveDetails(values);
      }

    return (
        <div className={classes.container}>
            <Popupcard
                title="File Upload"

            >
               {showForm && <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>}

<PopupSimpleCard>
    
    <Table cols={FileUploadTable(showFormHandler, actions)} 
data={docs}   striped
       rows={10} /> </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default UploadForm;



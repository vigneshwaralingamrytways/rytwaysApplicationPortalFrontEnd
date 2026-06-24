import React, { useCallback, useEffect, useState } from 'react';
import {
  CreateForm,
  PopupSimpleCard,
  Popupcard,
  Table,
  alertActions,
  api,
  classes,
  modalActions,
  useDispatch,
  useFetch,
  useSelector
} from '../../Components/CommonImports/CommonImports';
import RoleTable from './MenuMaster/Table/RoleTable';

const rowWiseFields = 3;

function QueryCommentsForms(props) {
  const { get, post, response, loading, error } = useFetch({ data: [] });

  const [data, setData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([{ value: "", label: "Select" }]);

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
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
    if (response.ok) {
      
    }
  }, [get, response]);

  useEffect(() => {
    loadInitialLists();
  }, [loadInitialLists]);

  const saveFunction = async (values) => {
    const formData = new FormData();
    formData.append("typeId", values.typeId);
    formData.append("remarks", values.remarks);
    if (values.fileUpload) {
      formData.append("file", values.fileUpload);
    }
    if (values.activityFeatureId) {
      formData.append("activityFeatureId", values.activityFeatureId);
    }

    const saveUrl = "//save"; 
    const newDoc = await post(api + saveUrl, values); 

    if (response.ok) {
      if (values.activityFeatureId) {
        setData(data.map((doc) => doc.activityFeatureId === values.activityFeatureId ? values : doc));
        dispatch(modalActions.hideModalHandler());
        AlertHandler("Updated Successfully", "success");
      } else {
        setData([...data, newDoc]);
        dispatch(modalActions.hideModalHandler());
        AlertHandler("Created Successfully", "success");
      }
    } else {
      dispatch(modalActions.hideModalHandler());
      AlertHandler("Failed To Save Details", "danger");
    }
  };

  const handleDelete = async (values) => {
    const deleteRecord = await post(api + "/yourUrl/delete", values);
    if (response.ok) {
      const filteredData = data.filter(item => item.activityFeatureId !== values.activityFeatureId);
      setData(filteredData);
      AlertHandler("Deleted Successfully", "success");
    } else {
      dispatch(modalActions.hideModalHandler());
      AlertHandler("Failed To Delete", "danger");
    }
  };

  const actions = ["delete"];
  const showFormHandler = (item, action) => () => {
    if (action === "delete") {
      handleDelete(item);
    }
  };

  const template = {
    fields: [
      {
        title: 'Issue Type',
        type: 'select',
        name: 'typeId',
        contains: 'Select',
        options: typeOptions,
          inpprops:{}
      },
       {
        title: 'Comments',
        type: 'text',
        name: 'comment',
        contains: 'text',
        options: [],
        inpprops:{}
      },
      {
        title: 'File Upload',
        type: 'Document',
        name: 'file',
        contains: 'Document',
        inpprops: {
        //   accept: ".pdf,.doc,.docx,.jpg,.png"
        },
      },
      {
        title: 'Remarks',
        type: 'textarea',
        name: 'remarks',
        contains: 'textarea',
        inpprops: {
          
        },
      },
      {
        type: "hidden",
        name: "activityFeatureId",
        contains: "text",
        inpprops: {},
      },
    ],
  };

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  }

  function onSubmit(values) {
    values.activityId = values.activityId || props.selectedItem?.activityId;
    saveFunction(values);
  }

  return (
    <div className={classes.container}>
      <Popupcard
        title="Comment Details"
        showBack 
       onBack={props.onCancel}
      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Save"
        />

        
      </Popupcard>
    </div>
  );
}

export default QueryCommentsForms;
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
} from '../../Components/CommonImports/CommonImports';
import RoleTable from './MenuMaster/Table/RoleTable';




const rowWiseFields = 3;

function RoleForm(props) {


  const { get, post, response, loading, error } = useFetch({ data: [] });

  const [data, setData] = useState([]);
  const [userList, setUserList] = useState([{ value: "", label: "Select" }]);
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
    // const initUser = await get(api + "/roles/loadOptions")
    const initEmployees = await get(api + "/manageEmployee/getall")
    const loadedLists = await post(api + "/activityMaster/findByActivityId", { activityId: props.selectedItem.activityId, rand: Math.random() });
    console.log(loadedLists)
    if (response.ok) {
      setData([...loadedLists]);
      setUserList([{ value: "", label: "Select" }, ...initEmployees.map((emp) => ({
        value: emp.employeeId, label: emp.employeeName
     }))
      ]);
    }

    // console.log({...props.selectedItem})
  }, [get, response]);

  useEffect(() => {
    loadInitialLists();
  }, []);


  const saveFunction = async (values) => {


    const saveUrl = values.activityFeatureId > 0 ? '/activityMaster/createActivityRole' : '/activityMaster/createActivityRole'

    const newDoc = await post(api + saveUrl, values)

    if (response.ok) {



      if (values.activityFeatureId) {
        setData(data.map((doc) => doc.activityFeatureId === values.activityFeatureId ? values : doc))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Feature Updated Successfully", "success")
      } else {
        setData([...data, newDoc])
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Feature Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Feature Details Failed To Save", "danger")
    }
  }




  const handleDelete = async (values) => {

    console.log("values", values)

    const deleteFile = await post(api + "/docUserMaster/delete", values)

    if (response.ok) {
      //    dispatch(modalActions.hideModalHandler());

      const deleteRecord = data.filter(item => item.activityFeatureId !== values.activityFeatureId);
      setData(deleteRecord);

      AlertHandler("User Deleted Successfully", "success")
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("User Details Failed To Delete", "danger")
    }

  }
  const actions = ["delete"];
  const showFormHandler = (item, action) => () => {
    if (action === "delete") {
      handleDelete(item)
    }

  };

  const template = {
    fields: [
      {
        title: 'Employee Name',
        type: 'select',
        name: 'employeeId',
        contains: 'Select',
        options: userList,
      }, {
        type: "hidden",
        name: "activityFeatureId",
        contains: "text",
        inpprops: {

        },
      },

    ],
  };

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;




  }

  function onSubmit(values) {
    values.activityId = values.activityId || props.selectedItem.activityId
    saveFunction(values)


  }

  return (
    <div className={classes.container}>
      <Popupcard
        title="Add Role"
        showBack onBack={props.onCancel}


      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Save"

        ></CreateForm>

        <PopupSimpleCard>

          <Table cols={RoleTable(showFormHandler, actions)}
            data={data} striped
            rows={10} /> </PopupSimpleCard>
      </Popupcard>

    </div>
  );
}

export default RoleForm;



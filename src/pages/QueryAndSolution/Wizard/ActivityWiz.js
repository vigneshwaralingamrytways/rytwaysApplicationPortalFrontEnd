import React, { useCallback, useEffect, useState } from 'react';

import {
  CreateForm,
  SimpleCard,
  Table,
  alertActions,
  api,
  modalActions,
  useDispatch,
  useFetch,
  useSelector
} from '../../../Components/CommonImports/CommonImports';
import { generateToken } from '../../../Components/GenerateToken';
import RoleForm from '../RoleForm';
import ProcCommWiz from './Popup/ProcCommWiz';
import AddStatusWiz from './Popup/AddStatusWiz';
import * as FaIcons from "react-icons/fa";
import classes from "../../../Components/Wizard.module.css";
import QueryCommentsTable from '../QueryCommentsTable';
import UploadFormWiz from './UploadFormWiz';
import EditActivity from '../../../Components/SlidingMenu/EditActivity';
import Responsewiz from './Popup/Responsewiz';



const rowWiseFields = 1;
const rowWiseFieldsTwo = 3;
const rowColors = ["#fff"];
function ActivityWiz(props) {


  //const selectedItem = JSON.parse(props.location.state.selectedItem);

  const { get, post, response, loading, error } = useFetch({ data: [] });
  const activityId = useSelector((state) => state.sideBar.activityId);


  const processTittle = useSelector((state) => state.sideBar.processTittle);
  const functionTittle = useSelector((state) => state.sideBar.functionTittle);
  const activityTittle = useSelector((state) => state.sideBar.activityTittle);
  const releaseTrackId = useSelector((state) => state.activityTracker.releaseTrackId);


  const [data, setData] = useState([]);
  const [defaultValues, setDefaultValues] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [commentStatus, setCommentStatus] = useState([{ value: "", label: "Select" }]);
  const [step, setStep] = useState(1);
  const [prevWatchValues, setPrevWatchValues] = useState([]);
  const [issueId, setIssueId] = useState("");
  const [commentType, setCommentType] = useState([{ value: "", label: "Select" }]);
  const [initStatus, setInitStatus] = useState([{ value: "", label: "Select" }]);





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



  const editActivity = async (values) => {


    const saveUrl = values.activityId > 0 ? '/activityMaster/edit' : '/activityMaster/create'

    const newDoc = await post(api + saveUrl, values)

    if (response.ok) {


      if (values.activityId) {
        // setData(data.map((doc) => doc.activityId === values.activityId ? values : doc))
        // dispatch(modalActions.hideModalHandler())
        AlertHandler("Activity Updated Successfully", "success")
      } else {
        // setData([...data, newDoc])
        //  dispatch(modalActions.hideModalHandler())
        AlertHandler("Activity Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Activity Details Failed To Save", "danger")
    }
  }

  const actions = ["activityform", "processComments", "status", "upload", "commentUpload", "edit", "notes"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
    if (action === "activityform") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          /* modalWidth: '48%',
          modalLeft: '26%', */
          selectedForm: (
            <RoleForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}

            // saveFunction = {formSaveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "processComments") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '48%',
          modalLeft: '26%',
          selectedForm: (
            <ProcCommWiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              commentType={commentType}
              onSubmitTwo={onSubmitTwo}
            // saveFunction = {formSaveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "status") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '24%',
          modalLeft: '38%',
          selectedForm: (
            <AddStatusWiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              onSubmitTwo={onSubmitTwo}
              commentStatus={commentStatus}
            // saveFunction = {formSaveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "upload") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },

          selectedForm: (
            <UploadFormWiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              onSubmitTwo={onSubmitTwo}
              commentStatus={commentStatus}
              reportType={"ACTIVITY"}
              filePath={"ACTIVITY/"}
              docId={activityId}

            // saveFunction = {formSaveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "commentUpload") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },

          selectedForm: (
            <UploadFormWiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              onSubmitTwo={onSubmitTwo}
              commentStatus={commentStatus}
              reportType={"COMMENT"}
              filePath={"COMMENT/"}
              docId={item.commentId}
            // saveFunction = {formSaveFunction}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "edit") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          /* modalWidth: '48%',
          modalLeft: '26%', */
          selectedForm: (
            <EditActivity
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}

              saveFunction={editActivity}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "notes") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          /* modalWidth: '48%',
          modalLeft: '26%', */
          selectedForm: (
            <Responsewiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              onSubmitTwo={onSubmitTwo}


            />
          ),
          showModal: true,
        })
      );
    }
  }



  const template = {
    fields: [


      {  /* legend: `${activityTittle || "Details"}`, */
        title: "Current Practice",
        type: "richtext",
        name: "currentProblem",
        contains: "richtext",
        //validationProps: "projectDescribtion is required",
        inpprops: {
          // md: 3
        },
      },
      {  /* legend: `${activityTittle || "Details"}`, */
        title: "Solution",
        type: "richtext",
        name: "solution",
        contains: "richtext",
        //validationProps: "projectDescribtion is required",
        inpprops: {
          // md: 3
        },
      }, { /*  legend: `${processTittle || "Details"}`, */

        title: "Data Point",
        type: "richtext",
        name: "dataPoints",
        contains: "richtext",
        //validationProps: "projectDescribtion is required",
        inpprops: {
          // md: 3
        },
      }, { /*  legend: `${processTittle || "Details"}`, */

        title: "Controlls And Policy",
        type: "richtext",
        name: "controls",
        contains: "richtext",
        //validationProps: "projectDescribtion is required",
        inpprops: {
          // md: 3
        },
      }, {
        title: "Status",
        type: 'select',
        name: 'issueStatus',
        contains: 'Select',
        options: initStatus,
        validationProps: "Value is required",
      }



    ],
  };

  const templateNote = {
    fields: [


      {  /* legend: `${activityTittle || "Details"}`, */
        title: "Notes",
        type: "richtext",
        name: "issueNotes",
        contains: "richtext",
        //validationProps: "projectDescribtion is required",
        inpprops: {
          // md: 3
        },
      }],
  };


  const loadInitialCustomers = useCallback(async () => {

    console.log("issueType", activityTittle, "functionActivityId", activityId, "releaseTrackId", releaseTrackId,)
    // const { ok } = response // BAD, DO NOT DO THIS
    const initialUnit = await post(api + "/issueSolution/loadIssueSolutionActComments", { "issueType": "Activity", "functionActivityId": activityId, "releaseTrackId": releaseTrackId, "random": generateToken() });

    const loadQueryStatus = await post(api + "/queryStatus/loadOptions", { "statusType": "COMMENTS", "random": generateToken() });

    const loadType = await post(api + "/commentType/loadOptions", { "random": generateToken() });
    const loadStatus = await post(api + "/queryStatus/loadOptions", { "statusType": "ACTIVITY", "random": generateToken() });
//  const loadStatus = await post(api + "/commentStatus/loadOptions", { random: generateToken() });
    if (loadQueryStatus && loadQueryStatus.length > 0) {
      setCommentStatus([{ value: "", label: "Select" }, ...loadQueryStatus])
    }
    if (loadType && loadType.length > 0) {
      setCommentType([...commentType, ...loadType])
    }
    if (loadStatus && loadStatus.length > 0) {
      setInitStatus([{ value: "", label: "Select" }, ...loadStatus])
    }
    if (initialUnit) {

      setDefaultValues(initialUnit)
      // const filteredOrderItems = initialUnit?.commentList?.filter(p=>p?.source === "Release")
      setOrderItems(initialUnit?.commentList || []);
      setIssueId(initialUnit?.issueId || "");
      //  setQuality([...quality,...initialQuality]);
    } else {
      setDefaultValues({})
      setOrderItems([])
      setIssueId("")
    }
  }, [get, response, activityId]);

  useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount


      


  /* const loadInitialData = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const initialOrders = await post(api + "/issueSolution/getAllComments" ,{"id":Math.random(),"issueId":1});
    
   
      


    if (response.ok){
      setOrderItems(initialOrders);  
     
    }
    
        //  console.log(initialCusts)
  }, [get, response, issueId]);

  useEffect(() => {
       loadInitialData();
    
  }, []); // componentDidMount */

  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;

    if (
      watchValues.some(
        (value, index) =>
          value !== prevWatchValues[index] &&
          value !== "" &&
          value !== undefined
      )
    ) {

      setPrevWatchValues([...watchValues]);
    }
  }


  const saveFunction = async (pallet) => {

    const newTransac = await post(api + "/issueSolution/create", { ...pallet, random: generateToken() })

    if (response.ok) {

      setIssueId(newTransac?.issueId || "");
      setDefaultValues(newTransac)
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Query Saved Successfully", "success")

    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Query Failed To Save", "danger")

    }

  }
  const saveOrder = async (values) => {
    const newTransac = await post(api + "/issueSolution/createComments", values)


    if (response.ok) {
      if (values.commentId) {
        const updatedItem = orderItems.map(item => item.commentId == values.commentId ? newTransac : item)
        setOrderItems(updatedItem)
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Comments Updated Successfully", "success")
      } else {

        setOrderItems([...orderItems, newTransac]);
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Comments Saved Successfully", "success")
      }

    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Comments Failed To Save", "danger")

    }
  };


  function onSubmit(values) {
    // console.log(values);
    values.issueType = "Activity"
    values.functionActivityId = values.activityId || activityId;
    values.releaseTrackId = values.releaseTrackId || releaseTrackId;
    // console.log("values ====> test",activityId);
    // console.log("values ====> test",values);
    saveFunction(values)
  }

  function onSubmitRespond(values) {
    // console.log(values);
    values.issueType = "Activity"
    values.functionActivityId = values.activityId || activityId;
    values.releaseTrackId = values.releaseTrackId || releaseTrackId;
    values.issueStatus = "Responded"
    // console.log("values ====> test",activityId);
    // console.log("values ====> test",values);
    saveFunction(values)
  }

  function onSubmitTwo(values) {
    console.log(values);
    values.issueId = issueId
    values.source = "Release"
    console.log("values =====>", values);
    saveOrder(values)
  }


  const steps = [
    // { title: "Current Practice", icon: <FaIcons.FaUser color="#474746" /> },
    { title: "Comments", icon: <FaIcons.FaUser color="#474746" /> },
    // { title: "Notes", icon: <FaIcons.FaUser color="#474746" /> },
  ];

  const handleNext = () => step < steps.length && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);

  const renderContent = () => {
    switch (step) {
  //     case 1:
  //       return <div>


  //         <CreateForm
  //           template={template}
  //           rowwise={rowWiseFields}
  //           rowColors={rowColors}
  //           //   watchFields={[""]}
  //           validate={validate}
  //           onSubmit={onSubmit}
  //           onCancel={props.onCancel}
  //           defaultValues={defaultValues}
  //           /*  btButtons={<OrderItems
  //              saveOrder={saveOrder}
  //              orderItems={orderItems}
              
            
              
  //              />} */
  //           buttonName="Save"

  //         ></CreateForm>
  //         {/*
  //  <details  style={{ backgroundColor: 'white' }}>
  //    <summary>Instructions: ALL FIELDS ARE IMPORTANT AND NEEDS TO BE FILLED IN ORDER TO PROCESS THE ORDER</summary>
     
  //  </details>
   
  //                        */}
  //       </div>;
      case 1:
        return <div>
          {issueId && <Table
            cols={QueryCommentsTable(showFormHandler, actions)}
            data={orderItems}
            rows={10}


          />}</div>;
      // case 3:
      //   return <div>


      //     <CreateForm
      //       template={templateNote}
      //       rowwise={rowWiseFields}
      //       rowColors={rowColors}
      //       //   watchFields={[""]}
      //       validate={validate}
      //       onSubmit={onSubmitRespond}
      //       onCancel={props.onCancel}
      //       defaultValues={defaultValues}
      //       /*  btButtons={<OrderItems
      //          saveOrder={saveOrder}
      //          orderItems={orderItems}
              
            
              
      //          />} */
      //       buttonName="Save"

      //     ></CreateForm>

      //   </div>
    }
  };

  const totalSteps = steps.length;
  const completedPercent = ((step - 1) / (totalSteps - 1)) * 100;

  const handleAddClick = () => {
    // Placeholder for popup logic
    alert("Add icon clicked! Open popup here.");
  };

  return (
    <div className={classes.wizardContainer}>
      {/* Global Add Icon (top-right corner of the page) */}


      <div className={classes.iconTopRightGroup}>
        <FaIcons.FaUpload
          color="#00aaff"
          className={classes.uploadIconTopRight}
          onClick={showFormHandler({ activityId: activityId }, actions[3])}
        />
        <FaIcons.FaPlusCircle
          className={classes.addIconTopRight}
          color="#00aaff"

          onClick={showFormHandler({ activityId: activityId }, actions[0])}
        />
      </div>

      <div className={classes.stepper}>
        <div className={classes.stepLineTrack}></div>
        <div
          className={classes.stepLineOverlay}
          style={{ width: `${completedPercent}%` }}
        ></div>

        {steps.map((s, index) => {
          const current = index + 1;
          const isActive = step === current;
          return (
            <div
              className={classes.stepItem}
              key={current}
              onClick={() => setStep(current)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`${classes.stepIcon} ${isActive ? classes.activeIcon : ""
                  }`}
              >
                {s.icon}
              </div>
              <div
                className={`${classes.stepLabel} ${isActive ? classes.activeLabel : ""
                  }`}
              >
                {s.title}
              </div>
            </div>
          );
        })}
      </div>

      <div className={classes.wizardCard} style={step === 1 ? { maxWidth: "1150px"} : {}}>
        <div className={classes.greenHeader} style={step === 1 ? { maxWidth: "1150px"} : {}}>
          {` ${processTittle} / ${functionTittle} /  ${activityTittle}`}
          { /*  onClick={handleAddClick} */}
          {/* {step === 1 && (
            <FaIcons.FaEdit
              className={classes.addIconInside}
             
              onClick={showFormHandler({ activityId: activityId }, actions[5])}
            />
          )} */}
          {/* Add icon only for step 2 (Administration) */}
          {(step === 1 && issueId) && (
            <FaIcons.FaPlusCircle
              className={classes.addIconInside}
              /*  onClick={handleAddClick} */
              onClick={showFormHandler({ activityId: activityId }, actions[1])}
            />
          )}
        </div>

        <div className={classes.stepContent} style={step === 1 ? { maxWidth: "1150px"} : {}}>{renderContent()}</div>
      </div>

      <div className={classes.stepButtons}>
        <button onClick={handleBack} disabled={step === 1}>
          Back
        </button>
        <button onClick={handleNext} disabled={step === totalSteps}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivityWiz;



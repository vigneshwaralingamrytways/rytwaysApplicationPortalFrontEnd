import React, { useEffect, useCallback,useState} from 'react';
import CreateForm from '../../Components/Forms/CreateForm';
import useFetch, { Provider } from "use-http";
import Ctheme from '../../Components/Ctheme/Ctheme'
import { useForm } from 'react-hook-form';
import Simplcard from '../../UI/cards/SimpleCard'
import Table from '../../Components/tables/Table'
import IapprovalTable from './IapprovalTable'
import Popupcard from '../../UI/cards/Popupcard';
import PopupSimpleCard from '../../UI/cards/PopupSimpleCard';
import api from "../../Api";
import { useSelector, useDispatch } from "react-redux";
import { modalActions } from "../../store/modal-Slice";
import { alertActions } from "../../store/alert-slice";
const styles = {
  upper: {
    
    padding: "0", // Add the padding property here
  },
  upperRow: {
    
    padding: '0.5rem 1rem',
   
  },
  uppertitle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: '0',
    backgroundColor: Ctheme.colors.ttle,
  },
};
const rowWiseFields = 5;



function Csapproval(props) {
  const { register, setValue, getValues } = useForm();
  const [data, setData] = useState('');
  const [statusOptions, setStatusOptions] = useState([
    {value:'Approved', label:'Approve'},
    {value:'Reject', label:'Reject'}
  ]);
  const [selectedData,setSelectedData] = useState("")
  const { get, post, response, loading, error } = useFetch();
  const [appHist,setAppHist]=useState([])
  const[showApproval,setShowApproval] = useState(false)
  const[approval,setApproval]=useState({})
  const [defaultValues,setDefaultValues]= useState({})
  const [totalAmount, setTotalAmount]=useState(props.totalAmount);

  const loadInitialCustomers = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const loadedcusts = await post(api+"/approvalHist/listApprovals",{processName:props.processName,approvalProcessId:props.processId,random:Math.random()});
    if(props.selected.status == "Requested" || props.selected.status == "Verified"){
    const budgetamt = await post(api+"/materialPr/findBudget",{"unit":props?.selected?.unit,"budgetId":props?.selected?.budgetId,"purchaseRequestId":props.processId,random:Math.random()});
    //const loadedinputSheets = await get(api+"/inputSheet/sheets");
    console.log("budgetamt",budgetamt)
    console.log("status",)
    if(budgetamt){
      const isAvailableBudget = (Number(budgetamt.balanceAmount || 0)) >= Number(budgetamt.totalItemAmt || 0);

if (isAvailableBudget) {
  setStatusOptions([
    { value: 'Approved', label: 'Approve' },
    { value: 'Reject', label: 'Reject' }
  ]);
} else {
  setStatusOptions([
    { value: "", label: 'Select' },
    { value: 'Reject', label: 'Reject' }
  ]);
}

console.log("indent amt ==>", budgetamt)

      const userId =localStorage.getItem("userId")
      setDefaultValues({...budgetamt,"status": isAvailableBudget ? "Approved" : "","approvedBy":userId})
    }}
    console.log(loadedcusts)
    if(response.ok && loadedcusts.length > 0){

      console.log("loadedcusts =================>",loadedcusts)

    setAppHist(loadedcusts);
   
    }
    console.log({...props.selectedItem})
  }, []);

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const [showModal, selectedForm, selectedData1] = useSelector((state) => [
    state.modalProps.showModal,
    state.modalProps.selectedForm,
    state.modalProps.selectedData,
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

   useEffect(() => { loadInitialCustomers() }, [])
  const template = {
   // heading: props.title,
     fields: [
     ...((props.selected.status == "Requested" || props.selected.status == "Verified") ? [ {
      title: 'Budget Name',
      type: "disabled",
      name: 'totalBudget',
      contains:"text",
      value : defaultValues?.budgetMaster?.budgetName,
      inpprops:{
       
      },
       },  {   
        
        
      title: "Opening Amt",
      type: "disabled",
      name: "budgetAmount",
      contains: "text",
      inpprops: {},
  }, {   
        
        
    title: "Utilized Amt",
    type: "disabled",
    name: "utilized",
    contains: "text",
    inpprops: {},
}, {   
        
        
  title: "Balance Amt",
  type: "disabled",
  name: "balanceAmount",
  contains: "text",
  inpprops: {},
},{   
        
        
    title: "Indent Amt",
    type: "disabled",
    name: "totalItemAmt",
    contains: "text",
    inpprops: {},
},{   
        
        
  title: "Pipe Line Indent Amt",
  type: "disabled",
  name: "totalPipeItemAmount",
  contains: "text",
  inpprops: {},
}]:[]),{
            title: "Status",
            type: "select",
            name: "status",
            contains: "select",
            validationProps: "Status is required",
            options:statusOptions
        },{
        title: 'Remarks',
        type: 'textarea',
        name: 'approverRemarks',
        contains:"textarea",
        inpprops:{
          maxlength:128,
          md:6
        },
         },{
          type: 'hidden',
          name: 'approvedBy',
          contains:"hidden",
          value:localStorage.userId,
          inpprops:{
            maxlength:128,
            md:6
          },
           }
      ],
};
function validate(watchValues, errorMethods) {
  let { errors, setError, clearErrors } = errorMethods;
//[2,5]
   // Firstname validation
   if(watchValues[0] != "" && watchValues[0] !=selectedData){
    
     
     // console.log("demo",watchValues[0]);
  }
 
}


const showFormHandler = (item) => () => {
        setShowApproval(true)
        console.log("item for approval =====>", item)
        setApproval(item)
}
function onSubmit(values) {
  console.log("approved",values.status)
        if(values.status==='Approved'){
          values.approvalHistoryId = approval.approvalHistoryId
          values.isApproved =1
          values.id=approval.id
      }else{
        values.approvalHistoryId = approval.approvalHistoryId
        values.isCancelled =1
        values.id=approval.id
      }
      console.log("approval.appType",values)
        props.saveApprovalStatus(values)  // 
      
    //  props.saveFunction(values)
    }
console.log(localStorage.userId,localStorage.roleId,localStorage.departmentIds)
  return (
  <>
    
    {showApproval && 
    <Popupcard title={`Approval`}>
    {props.approvalForm}
    <CreateForm  
    template={template}
    defaultValues={defaultValues}
    rowwise={rowWiseFields}
    watchFields={[]}
    validate={validate}
    onSubmit={onSubmit} 
    onCancel={props.onCancel}
    buttonName="Save"
   
    styles={styles}
    >
    </CreateForm>
    </Popupcard>
    } 
      { !showApproval && 

<Popupcard title="Approval">
       <PopupSimpleCard md={12}>
        <Table
          cols={IapprovalTable(showFormHandler,localStorage.userId,localStorage.roleId,localStorage.departmentIds)}
          data={appHist}
          rows={10}
         
        />
        </PopupSimpleCard>
        </Popupcard>}
      
      </> 
  )
}

export default Csapproval



  
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  
    // Firstname validation
    if(watchValues['firstname'] === 'Admin'){
        if(!errors['firstname']){
            setError('firstname', {
                type: 'manual',
                message: 'You cannot use this first name'
            })
        }
    }else{
        if(errors['firstname'] && errors['firstname']['type'] === 'manual'){
            clearErrors('firstname');
        }
    }
  }
  

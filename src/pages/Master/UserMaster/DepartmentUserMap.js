import React, { useState, useEffect, useCallback } from 'react';

import UserDepartMapTable from './UserDepartMapTable';
import { useDispatch, useSelector } from 'react-redux';
import { alertActions } from '../../../store/alert-slice';
import { useFetch } from 'use-http';
import api from '../../../Api';
import { modalActions } from '../../../store/modal-Slice';
import Popupcard from '../../../UI/cards/Popupcard';
import CreateForm from '../../../Components/Forms/CreateForm';
import PopupSimpleCard from '../../../UI/cards/PopupSimpleCard';
import Table from '../../../Components/tables/Table';
import  classes from './customer.module.css'




const rowWiseFields = 2;

function DepartmentUserMap(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });

    const [data, setData] = useState([])
    const [prevWatchValues, setPrevWatchValues] = useState([]);

    const [selectedDepartment,setSelectedDepartment]=useState(false);
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

    const dispatch = useDispatch
    ();
    const AlertHandler = (alertContent, alertType) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: !showAlert,
                alertMessage: alertContent,
                alertVariant: alertType,
            })
        );
    };


    const loadInitialCustomers = useCallback(async () => {
        // const { ok } = response // BAD, DO NOT DO THIS
        const initialCusts = await post(api+'/userDepMap/userDepMap', ({userId:props.selectedItem.userId,random:Math.random(),}))
       
     
        if (response.ok) {
            setData(initialCusts);

            console.log("initialCusts",initialCusts)
        }
      }, [post, response]);
    
      useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount

      
    
      /* const  customerSave = async (Customer)=>{
        const newCustomer = await post(api+'/users/create', Customer)
        console.log("customers",newCustomer)
         if (response.ok) {
          if(Customer.userId){
            setCustomers(customers.map((cust) => cust.userId === Customer.userId ? Customer : cust))
        dispatch(modalActions.hideModalHandler())
            AlertHandler("User Updated Successfully","success")
          }else{
            setCustomers([...customers, newCustomer])
            console.log("newCustomer",newCustomer)
            dispatch(modalActions.hideModalHandler())
            AlertHandler("User Created Succesfully","success")
          }
        }else{
          dispatch(modalActions.hideModalHandler())
          AlertHandler("USer Details Failed To Save","danger")
        }
      }
 */

      const handleDelete = async (values) => {

        console.log("values",values)
      
        const deleteFile = await post(api+ "/userDepMap/delete", values)

        if (response.ok) {

          const deleteRecord = data.filter(item => item.userDeptMapId !== values.userDeptMapId);
          setData(deleteRecord);

         //   dispatch(modalActions.hideModalHandler());
            AlertHandler("User Department Deleted Successfully","success")
          }else{
          dispatch(modalActions.hideModalHandler())
          AlertHandler("User Department Details Failed To Delete","danger")
        }   
    
    }
    const actions = ["delete"];
    const showFormHandler = (item, action) => () => {
        if(action === "delete") {
            handleDelete(item)
        }

    };


    const template = {
        fields: [

            {
                title: "Department",
                type: "mulitioptions",
                name: "departmentIds",
                contains: "mulitioptions",
                inpprops: {
            isAvailable:selectedDepartment,
            errorMsg:"This department Already available."
                },
                options: props.depart,
            },
            {
                type: "hidden",
                name: "userDeptMapId",
                contains: "text",
                inpprops: {

                },
            },


        ],
    };

    const validateValues = async (departmentIds) => {
        const isInvalidSelection = data.some((item) =>
          departmentIds.includes(item.departmentId)
        );
      
        // Set selected department based on the invalid selection
        setSelectedDepartment(isInvalidSelection ? true : false);
      
        console.log(isInvalidSelection, "values", departmentIds);
      };
      
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
           validateValues(watchValues[0]);
            //   setUserType(watchValues[0])
            setPrevWatchValues([...watchValues]);
        }
    }


    const  dataSave = async (Customer)=>{
        console.log("data",Customer)
       // const userId = parseFloat(props.selectedItem.userId)
        const newCustomer = await post(api+'/userDepMap/create', Customer)
        console.log("data",newCustomer)
         if (response.ok) {
            setData([...data, ...newCustomer])
            //dispatch(modalActions.hideModalHandler())
            AlertHandler("User Department Updated Successfully","success")
         }
      }
    async function onSubmit(values) {
     
        // console.log("values  ==>", values)
         dataSave({...values, "userId":props?.selectedItem?.userId})
    }


    return (
        <div className={classes.container}>
            <Popupcard
                title={props?.selectedItem?.userName ? `Add ${props.selectedItem.userName} Departments `: "Add User Department"}

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    watchFields={["departmentIds"]}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                //    defaultValues={props.selectedItem}
                    buttonName="Save"

                ></CreateForm>

                <PopupSimpleCard>
                    <Table cols={UserDepartMapTable(showFormHandler, actions)}
                        data={data} striped
                        rows={10} />
                </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default DepartmentUserMap;



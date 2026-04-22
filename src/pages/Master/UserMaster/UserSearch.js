import React, { useState, useReducer, useEffect, useCallback } from "react";
import CreateForm from "../../../Components/Forms/CreateForm";
import SearchCard from "../../../UI/cards/SearchCard";
import Modal from "../../../UI/Modal/Modal";
import CustomerTable from "./UserTable";
import classes from "./orders.module.css";
import Table from "../../../Components/tables/Table";
import SimpleCard from "../../../UI/cards/SimpleCard";
import { Alert, Row, Col } from "react-bootstrap";
import UserForm from "./UserForm";
import { useSelector, useDispatch } from "react-redux";
import { modalActions } from "../../../store/modal-Slice";
import { alertActions } from "../../../store/alert-slice";
import api from "../../../Api";
import useFetch, { Provider } from "use-http";
import DepartmentUserMap from "./DepartmentUserMap";
import { generateToken } from "../../../Components/GenerateToken";
import NewTable from "../../../Components/New Table/NewTable";
import { filterActions } from '../../../store/filter-slice';
import UserActMapForm from "../../QueryAndSolution/UserActMapForm";


const rowWiseFields = 4;
const template = {
  fields: [
    {
      title: "User Name",
      type: "text",
      name: "userName",
      contains: "text",
      inpprops: {
        minlength: 0,
        maxlength: 30,
      },
    },
  ],
};
const actions = ["edit", "customerForm", "userDepartMap", "delete", "userActMap"];

function CustomerSearch(props) {
  const { get, post, put, response, loading, error } = useFetch({ data: [] });
  const [loadState, setLoadState] = useState(Math.random())
  const [customers, setCustomers] = useState([]);
  const [depart, setDepart] = useState([{ value: "", label: "Select" }]);
  const [departName, setDepartName] = useState([{ value: "Select", label: "Select" }]);
  const [roles, setRoles] = useState([{ value: "", label: "Select" }])
  // const filtersData = useSelector((state) => state.filter.filters)?.find(p => p.activityId === activityId);
  // const activityId = useSelector((state) => state.sideBar.activityId);
  // const [anchorEl, setAnchorEl] = useState(null);
  const [showModal, selectedForm, selectedData] = useSelector((state) => [
    state.modalProps.showModal,
    state.modalProps.selectedForm,
    state.modalProps.selectedData,
  ]);

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);
  // const [filters, setFilters] = useState(filtersData ? {
  //   customerName: filtersData?.customerName || '',
  //   activityId: filtersData?.activityId || ''
  // } : {
  //   customerName: '',
  //   activityId: ''
  // });
  const dispatch = useDispatch();
  // const handleFilterClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleFilterChange = (e) => {
  //   setFilters({ ...filters, [e.target.name]: e.target.value });
  // };

  // const handleApplyFilter = async () => {
  //   const orderapi = "/customerMaster/searchCustomers";
  //   const returnObject = await post(api + orderapi, { ...filters, "random": Math.random() });
  //   if (returnObject.length > 0) {
  //     setCustomers(returnObject)
  //   } else {
  //     setCustomers([])
  //   }
  //   // dispatch(
  //   //   filterActions.setFilters({
  //   //     ...filters, activityId: activityId
  //   //   })
  //   // )
  //   // handleClose();
  // };



  const loadInitialCustomers = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const initialCusts = await get(api + "/users/users");
    const initialRoles = await get(api + "/roles/loadOptions");
    const initialDepartments = await post(api + "/department/loadOptionsAll", { "random": generateToken() });
    const initialDepartmentsName = await post(api + "/department/loadOptionsAllByName", { "random": generateToken() });
    console.log("initialDepartments", initialDepartments)
    if (initialCusts) {
      setCustomers(initialCusts);
    }
    if (initialRoles) {
      setRoles([...roles, ...initialRoles])
    }
    if (initialDepartments) {
      setDepart([...depart, ...initialDepartments])
    }

    if (initialCusts.length > 0) {
      // if (filtersData && filtersData?.activityId === activityId) {
      //   const filtered = initialCusts.filter((item) => {
      //     return Object.entries(filtersData).every(([key, value]) => {
      //       if (["activityId"].includes(key)) return true;
      //       if (value === "" || value === null || value === undefined) return true;

      //       const itemValue = item[key] !== null && item[key] !== undefined ? item[key].toString().toLowerCase() : "";
      //       const filterValue = value.toString().toLowerCase();
      //       return itemValue.includes(filterValue);
      //     });
      //   });
        setCustomers(initialCusts);
      // }
    }
    if (initialDepartmentsName) {
      setDepartName([{ value: "Select", label: "Select" }, ...initialDepartmentsName])
    }
  }, [get, response, loadState]);

  useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount

  const customerSave = async (Customer) => {
    const newCustomer = await post(api + '/users/create', Customer)
    if (response.ok) {
      if (Customer.userId) {
        setCustomers(customers.map((cust) => cust.userId === Customer.userId ? Customer : cust))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("User Updated Successfully", "success")
      } else {
        setCustomers([...customers, newCustomer])
        dispatch(modalActions.hideModalHandler())
        AlertHandler("User Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("USer Details Failed To Save", "danger")
    }
  }
  const userEditSave = async (Customer) => {

    const newCustomer = await post(api + '/users/edit', Customer)
    if (response.ok) {
      if (Customer.userId) {
        setCustomers(customers.map((cust) => cust.userId === Customer.userId ? Customer : cust))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("User Updated Successfully", "success")
      } else {
        setCustomers([...customers, newCustomer])
        dispatch(modalActions.hideModalHandler())
        AlertHandler("User Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("USer Details Failed To Save", "danger")
    }
  }

  const handleDelete = async (Customer) => {
    const newCustomer = await put(api + '/users/deactivate', Customer)
    console.log("new customer", newCustomer)
    if (response.ok) {
      AlertHandler("User Deleted Succesfully", "success")
      setCustomers(customers.filter((cust) => cust.userId != Customer.userId))
    } else {
      AlertHandler("Failed to Delete", "danger")
    }
  }
  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType
      }
      )
    );
  }
  const showFormHandler = (item, action) => () => {
    console.log(action);
    if (action === "edit") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <UserForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              customerSave={userEditSave}
              roles={roles}
              depart={departName}

            />
          ),
          showModal: true,
        })
      );
    } else if (action === "customerForm") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <UserForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              customerSave={customerSave}
              roles={roles}
              depart={departName}
            />
          ),
          showModal: true,
        })
      );
    } else if (action === "userDepartMap") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '38%',
          modalLeft: '31%',

          selectedForm: (
            <DepartmentUserMap
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              customerSave={customerSave}
              roles={roles}
              depart={depart}
            /* consigneName = {consigneName} */
            />
          ),
          showModal: true,
        })
      );
    } else if (action == "delete") {
      handleDelete(item)
    }else if (action === "userActMap") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '75%',
          modalLeft: '15%',

          selectedForm: (
            <UserActMapForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              
              
            />
          ),
          showModal: true,
        })
      );
    }
  };

  return (
    <div className={classes.container}>
      {/* <SearchCard
        title="User Search"
        buttonName="Add"
        onHeaderClick={showFormHandler({}, "customerForm",[0,10,2])}
        bottonShow={showModal}
      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
        ></CreateForm>
      </SearchCard>
      <SimpleCard md={12}>
        <Table
          cols={CustomerTable(showFormHandler, actions)}
          data={customers}
          rows={10}
          striped
        />
      </SimpleCard> */}
      {/* <SearchCard
        title="Customer Search"
        buttonName="Add"
        onHeaderClick={() => showFormHandler({}, "Add")}
        buttonShow={showModal}
      > */}
        <NewTable
          cols={CustomerTable(
            showFormHandler,
            actions,
            () => AlertHandler("Please Verify Kyc Documents to create customer portal login.", "danger")
          )}
          data={customers}
          striped
          rows={25}
          title="Customer Search"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "edit")}
          template={template}           
          rowwise={rowWiseFields}       
          validate={validate}           
          onSubmit={onSubmit}           
          onCancel={props.onCancel}     
          buttonName="Search"
        />
      {/* </SearchCard> */}

    </div>
  );
}

export default CustomerSearch;

function onSubmit(values) {
  console.log("=====>",values);
}

function validate(watchValues, errorMethods) {
  let { errors, setError, clearErrors } = errorMethods;

  // Firstname validation
  if (watchValues["firstname"] === "Admin") {
    if (!errors["firstname"]) {
      setError("firstname", {
        type: "manual",
        message: "You cannot use this first name",
      });
    }
  } else {
    if (errors["firstname"] && errors["firstname"]["type"] === "manual") {
      clearErrors("firstname");
    }
  }
}

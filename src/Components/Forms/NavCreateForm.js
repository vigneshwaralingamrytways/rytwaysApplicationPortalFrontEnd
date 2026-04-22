import React, { useEffect, useState, useContext,useCallback } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
import classes from "./NavCreateForm.module.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AuthContext from "../../store/auth-context";
import { Navbar, Dropdown, Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import * as FaIcons from 'react-icons/fa';
import costSheetIcon from '../../images/cost.png';
import { alertActions } from '../../store/alert-slice';
import useFetch, { Provider } from "use-http";
import { useSelector, useDispatch } from 'react-redux';
import { moduleActions } from '../../store/module-slice';
import { Link, useHistory } from 'react-router-dom';
import api,{company} from "../../Api";
import Cpasswordmodal from "../../UI/Modal/Cpasswordmodal.";
import ChangePassword from "../../pages/ChangePassword/ChangePassword";
import { useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Typeahead from "react-bootstrap-typeahead/types/core/Typeahead";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
const getRowwise = (array, rowWise) => {
  let result = [],
    i = 0;
  while (i < array.length) result.push(array.slice(i, (i += rowWise)));
  //  i.log(result)
  return result;
};

const renderFields = (
  fields,
  rowwise,
  watchValues,
  register,
  errors,
  setValue, clearAutocomplete
) => {
  const mdSize = parseInt(12 / rowwise);
  const groupedFields = getRowwise(fields, rowwise);
  // console.log(groupedFields)

  return groupedFields.map((rowwiseFields) => (
    <Container>
      <Row>
        {rowwiseFields.map((field) => {
          let {
            title,
            type,
            name,
            contains,
            validationProps,
            dynamic,
            options,
            inpprops,
            value,
          } = field;

          let showField = dynamic
            ? watchValues[dynamic["field"]] === dynamic["value"]
            : true;

          if (!showField) return null;


          switch (type) {
            case 'autocomplete':
                          return (
                            <Col md={mdSize} key={name} >
                              <Form.Group>
                                <Form.Label htmlFor={name} className={classes.lebels}>{title}</Form.Label>
                                <Autocomplete
                                  id={name}
                                  options={options}
                                  disableClearable
                                  getOptionLabel={(option) => option.label}
                                  onChange={(event, newValue) => {
                                  
                                    setValue(name, newValue?.value || null);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      margin="dense"
                                       fullWidth
                                      error={!!errors[name]}
                                    />
                                  )}
                                />
                                {errors[name] && (
                                  <Form.Text className="text-danger">
                                    {errors[name]['message']}
                                  </Form.Text>
                                )}
                              </Form.Group>
                            </Col>
                          );
            case "text":
              return (
                <Col md={mdSize}>
                  {" "}
                  <Form.Group key={name}>
                    <Form.Label htmlFor={name} className={classes.lebels}>{title}</Form.Label>
                    <Form.Control
                      type={contains}
                      id={name}
                      {...register(name, { required: validationProps })}
                      minLength={inpprops.minlength}
                      maxLength={inpprops.maxlength}
                      // pattern={inpprops.pattern}
                      className={classes.formBorder}
                    />
                    {errors[name] && (
                      <Form.Text className="text-danger">
                        {errors[name]["message"]}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              );
            case "disabled":
              return (
                <Col md={mdSize}>
                  {" "}
                  <Form.Group key={name}>
                    <Form.Label htmlFor={name}>{title}</Form.Label>
                    <Form.Control
                      type={contains}
                      id={name}
                      {...register(name)}
                      readOnly
                      value={value}
                      disabled
                      className={classes.formBorder}
                    />
                  </Form.Group>
                </Col>
              );
            case "hidden":
              return (
                <Form.Group key={name}>
                  <Form.Control
                   type="hidden"
                    id={name}
                    {...register(name)}
                    value={value ? value : ""}
                    className={classes.formBorder}
                  />
                </Form.Group>
              );
            case "textarea":
              return (
                <Col md={inpprops.md}>
                  {" "}
                  <Form.Group key={name}>
                    <Form.Label htmlFor={name}>{title}</Form.Label>
                    <Form.Control
                      as={contains}
                      id={name}
                      {...register(name, { required: validationProps })}
                      maxLength={inpprops.maxlength}
                      className={classes.formBorder}
                    />
                    {errors[name] && (
                      <Form.Text className="text-danger">
                        {errors[name]["message"]}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              );
            case "number":
              return (
                <Col md={mdSize} >
                  {" "}
                  <Form.Group key={name} className={classes.lebels}>
                    <Form.Label htmlFor={name}>{title}</Form.Label>
                    <Form.Control
                      type={contains}
                      id={name}
                      min={inpprops?.min ? inpprops.min : 0}
                      step={inpprops?.step ? inpprops.step : 0.0000001}
                     max={(inpprops?.max || inpprops?.max >=0)  && inpprops.max }
                      {...register(name, { required: validationProps })}
                      className={classes.formBorder}
                    />
                    {errors[name] && (
                      <Form.Text className="text-danger">
                        {errors[name]["message"]}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              );
            case "date":
              return (
                <Col md={mdSize}>
                  {" "}
                  <Form.Group key={name}>
                    <Form.Label htmlFor={name} className={classes.lebels}>{title}</Form.Label>
                    <Form.Control
                      type={contains}
                      id={name}
                      format={inpprops.format}
                      {...register(name, { required: validationProps })}
                      className={classes.formBorder}
                    />
                    {errors[name] && (
                      <Form.Text className="text-danger">
                        {errors[name]["message"]}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              );
              case "checkboxdropdown":
                return (
                  <Col md={mdSize} key={name}>
                    <Form.Group>
                      <Form.Label htmlFor={name} className={classes.lebels}>{title}</Form.Label>
                      <FormControl sx={{ m: 1, width: "100%" }}>
                        <InputLabel id={`${name}-label`}>{title}</InputLabel>
                        <Select
                          labelId={`${name}-label`}
                          id={name}
                          multiple
                          value={watchValues[name] || []}
                          onChange={(event) => {
                            const selectedOptions = Array.from(event.target.options)
                              .filter((option) => option.selected)
                              .map((option) => option.value);
                            setValue(name, selectedOptions.length ? selectedOptions : null);
                          }}
                          
                        >
                          {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Checkbox
                                checked={watchValues[name] && watchValues[name].includes(option.value)}
                              />
                              <ListItemText primary={option.label} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              
            case 'typehead':
                return (
                  <Col md={mdSize}>   <Form.Group key={name}>
                  <Form.Label htmlFor={name} className={classes.lebels}>{title}</Form.Label>
                  <Typeahead
                   id={name}   {...register(name,{ required: validationProps })} className={classes.formBorder}
                    labelKey={name}
                   
                    options={options}
                    placeholder="Choose a state..."
               
                  />
                </Form.Group></Col>
                )
            case "select":
              return (
                <Col md={mdSize}>
                  {" "}
                  <Form.Group key={name}>
                    <Form.Label htmlFor={name} className={classes.lebels}>{title}</Form.Label>
                    <Form.Select
                      id={name}
                      {...register(name, { required: validationProps })}
                      className={classes.formBorder}
                    >
                      {options.map(({ value, label }, index) => (
                        <option value={value}>{label}</option>
                      ))}
                    </Form.Select>
                    {errors[name] && (
                      <Form.Text className="text-danger">
                        {errors[name]["message"]}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              );
            case "Document":
              return (
                <Col md={mdSize}>
                  {" "}
                  <Form.Group key={name}>
                    <Form.Label htmlFor={name} className={classes.lebels}>{title}</Form.Label>
                    <Form.Control
                      type="file"
                      id={name}
                      format={inpprops.format}
                      {...register(name, { required: validationProps })}
                      className={classes.formBorder}
                    />
                    {errors[name] && (
                      <Form.Text className="text-danger">
                        {errors[name]["message"]}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              );
            case "checkbox":
              return (
                <div key={name}>
                  <label>
                    <input
                      type="checkbox"
                      id={name}
                      {...register(name, { required: validationProps })}
                      className={classes.formBorder}
                    />
                    <span>{title}</span>
                    {errors[name] && (
                      <span className="red-text">
                        {errors[name]["message"]}
                      </span>
                    )}
                  </label>
                </div>
              );
            default:
              return (
                <div key={name}>
                  <span className="red-text">Invalid Field</span>
                </div>
              );
          }
        })}
      </Row>
    </Container>
  ));
};

function NavCreateForm({
  template, watchFields, rowwise, validate, onSubmit, onCancel,
  buttonName, btButtons, defaultValues, userDefbuttonName, styles,
  userDef, onHeaderClick, AddbuttonName, bottonShow

}) {
  // useEffect(() => { console.log({...values}) }, [])
  // const defValues = defaultValues;
  const userName = localStorage.getItem('userName');
  const [searchBar, setSearchBar] = useState(false);
  //const [defValues,setDefValues] = useState(defaultValues);
  const [clearAutocomplete, setClearAutocomplete] = useState(false);
  const authCtx = useContext(AuthContext);
  const showSearchbar = () => setSearchBar(!searchBar);
  //  let userId =authCtx.userId;

  let {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
    setError,
    clearErrors,
    setValue,
    reset,
    trigger
  } = useForm({
    defaultValues: { ...defaultValues },
  });
  let { heading, fields } = template;
  const hasFieldsData = fields && fields.length > 0;
  const containerClass = fields && fields.length > 0 ? classes.rightnav : classes.flexrowise;
  const isMobile = useMediaQuery('(max-width:600px)');
  fields = [
    ...fields,
    {
      type: "hidden",
      name: "updatedBy",
      contains: "hidden",
      value: localStorage.userId,
    },
  ];
  let watchValues = watchFields ? watch(watchFields) : watch([]);
  validate && validate(watchValues, { errors, setError, clearErrors });

  //console.log({...defaultValues})
  const resetForm = (defValues) => {
    var time = Date().toLocaleString();
    JSON.stringify(defaultValues) === "{}"
      ? reset({ time: Date().toLocaleString() })
      : reset(defaultValues);
  };

  useEffect(() => {
    resetForm(defaultValues);
  }, [defaultValues]);


  const onSubmitForm = (values, e) => {
    values.clicked = e.nativeEvent.submitter.name;
    console.log(e.nativeEvent.submitter.name)
    console.log(values);
    onSubmit(values);
    if (e.nativeEvent.submitter.name != "Search") {
      e.target.reset();
      setClearAutocomplete(true);
    }
    if (values.clicked === userDefbuttonName) {
      userDef(values);
    }
  };
  // For logout and dynamic userName

  const history = useHistory();
  const dispatch = useDispatch();
  const { get, post,request, response, loading, error} = useFetch({ data: [] });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const showChangePassword = () => {
    console.log('showIcTableHandler called');
    setShowModal(true);
  };
  const hideModalHandler = () => {
    setShowModal(false);
  };
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
  const resetPassword = async (user) => {
    const { oldPassword, newPassword } = user
    const userId = localStorage.getItem('userId');
    const valuesWithuserId = { password: oldPassword, newPassword: newPassword, userId: userId };
    const returnObj = await post(api + '/reset-password/change_password', valuesWithuserId)
    console.log("ret", returnObj)
    if (response.ok) {
      hideModalHandler()
      AlertHandler("Password Reset successfully.", "success")
    } else {
      AlertHandler("Password Does Not Match", "danger")
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };


  const isLoggedIn = authCtx.isLoggedIn;


  const handleLogout = async () => {
    const logout = await get(api + '/logout')
    console.log("log", logout)
    if (response.ok) {
      authCtx.logout();


    }

  };   // For logout and dynamic userName End

  const SearchiconBar = styled(Row)`
  
  @media (max-width: 600px) {
   
    display:${({ searchBar }) => (searchBar ? 'block' : 'none')};
  }

`;
const SearchiconBarTwo = styled(Row)`
  
@media (max-width: 600px) {
   
  display:${({ searchBar }) => (searchBar ? 'none' : 'block')};
}
@media (min-width: 601px) {
  display: none; // hide when the screen width is greater than 600px
}
`;




/* For Moudule Navigation */

let role = localStorage.getItem('roleId');;

const [modules,setModules] = useState([]);
const moduleId = useSelector((state) => state.sideBar.moduleId);
const loadInitialData = useCallback(async () => {
  // const { ok } = response // BAD, DO NOT DO THIS
  const initialModules = await post(api + "/loadMenu/loadModules",{"roleId":role});
  console.log(initialModules)
  if (response.ok) setModules(initialModules);
  //  console.log(initialCusts)
}, [get, response]);
//const modules = authCtx.modules;



useEffect(() => {
  loadInitialData();
}, []);

const addmodules = (selectedmodule) => {
  if (selectedmodule && selectedmodule.module && selectedmodule.module.modulePath) {
    // Dispatch an action to update the selected module in the Redux store
    dispatch(
      moduleActions.selectModuleId({
        moduleId: selectedmodule.module.moduleId,
      })
    );
    
    // Navigate to the selected module's page
    history.push(selectedmodule.module.modulePath);
  } else {
    console.error('Invalid module or module path');
  }
};

  return (
    <>
      <Row className={classes.formholder}>
        <Form
          onSubmit={handleSubmit(onSubmitForm)}

        >




          <div className={classes.searchcontainertitle}>


            {heading && (<div className={classes.title} >
              <p className={classes.heading}>{heading}</p>


            </div>


            )}


{hasFieldsData &&  ( 
            <div className={classes.searchcontainerbox}>
              <div className={classes.searchtextbox}>
                {renderFields(
                  fields,
                  rowwise,
                  watchValues,
                  register,
                  errors,
                  setValue, clearAutocomplete
                )}
              </div>
              <div className={classes.formbutton}>

                <Row>{btButtons && btButtons}</Row>
                <Row >
                  {buttonName && (
                    <Button type="submit" name={buttonName} className={classes.btn}>
                      <FaIcons.FaSearch />
                    </Button>
                  )}

                  {buttonName && (
                    <Button
                      type="button"
                      variant="danger" name="cancelButt"
                      className={classes.btn}
                      onClick={onCancel}
                    >
                      <FaIcons.FaRemoveFormat />
                    </Button>
                  )}
                  {userDefbuttonName && (
                    <Button
                      type="submit"
                      name={userDefbuttonName}
                      className={classes.btn}

                    >
                      {userDefbuttonName}
                    </Button>
                  )}
                </Row>
              </div>
            </div>
)}
   {/*      { hasFieldsData &&   (
          <SearchiconBar searchBar={searchBar}  onClick={() => hasFieldsData && showSearchbar()}>
              <div className={classes.searchbaricon}
              style={{
                fontSize: '1.5em',
                display: "flex",
                color: "black",
                alignItems: "center"
              }}><FaIcons.FaSearch style={{
                fontSize: '1rem',
                display: "flex",
                color: "black",
                alignItems: "center",
                cursor: "pointer"
              }} ></FaIcons.FaSearch></div>
              </SearchiconBar>
         )}
            */}
<div className={containerClass}>

<div className={`${searchBar ? classes.buttonArHide : classes.buttonArea}`}>
                {!bottonShow && <Button variant="primary" className={classes.addButton}
                  onClick={onHeaderClick}
                  style={{backgroundColor:"#d10000",color:"white"}}>
                  {AddbuttonName}</Button>}
              </div>
            {/*  { hasFieldsData && (
                <SearchiconBarTwo searchBar={searchBar}>
              <div className={classes.searchbaricon}
              onClick={() => hasFieldsData && showSearchbar()} style={{
                fontSize: '1.5em',
                display: "flex",
                color: "black",
                alignItems: "center"
              }}><FaIcons.FaSearch style={{
                fontSize: '1rem',
                display: "flex",
                color: "black",
                alignItems: "center",
                cursor: "pointer"
              }}></FaIcons.FaSearch></div>
              </SearchiconBarTwo>
            )} */}

              <div className={classes.userAdminIcon}>
                <div className={`d-flex justify-content-center align-items-center`}> <p
                  className={`d-flex justify-content-center align-items-center ${classes.uname}`}
                >{userName}</p>
                </div>
                <div className={classes.usericon}>
                  <Dropdown >
                    <Dropdown.Toggle
                      variant="secondary"
                      id="dropdown-basic"
                      className={`d-flex justify-content-center align-items-center ${classes.uiconBg}`}
                      bsPrefix="custom-toggle" // Add a custom prefix to the toggle element
                      toggleBsPrefix="toggle"

                    >
                      <img
                        src={costSheetIcon}
                        alt="Cost Sheet Icon"
                        className={classes.uicon}
                        style={{ backgroundColor: '#EFE4B0', border: '0px', outline: '0px' }}

                      />

                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ right: '0', left: 'auto' }}>
                      <Dropdown.Item onClick={showChangePassword}>
                        Change Password
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} >
                        <i className="fa fa-sign-out"></i> Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>


                </div>
           {/*     <div >
                  <Dropdown >
                    <Dropdown.Toggle
                      variant="none"
                      id="dropdown-basic"
                      className={`d-flex justify-content-center align-items-center `}
                      bsPrefix="custom-toggle" // Add a custom prefix to the toggle element
                      toggleBsPrefix="toggle"

                    >
                     <FaIcons.FaBars style={{color:"black"}}></FaIcons.FaBars >

                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ right: '0', left: 'auto' }}>
          {modules.map((module) => (
            <Dropdown.Item key={module.id} onClick={() => addmodules(module)}>
              {module.module.moduleName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
                  </Dropdown>


          </div> */}
              </div>
            </div>

          </div>



        </Form>
      </Row>
      {showModal && (
        <Cpasswordmodal onClose={hideModalHandler}>
          <ChangePassword onSubmit={resetPassword} />
        </Cpasswordmodal>
      )}  </>
  );
}
export default NavCreateForm;

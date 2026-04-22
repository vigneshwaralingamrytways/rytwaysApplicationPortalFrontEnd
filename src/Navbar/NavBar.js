import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaBars, FaUser } from 'react-icons/fa';
import { Navbar, Dropdown, Container, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { moduleActions } from '../store/module-slice';
import AuthContext from '../store/auth-context';
import Logo from '../images/sreepathylogin.jpg';
import ChangePassword from '../pages/ChangePassword/ChangePassword';
import styled from 'styled-components';
import classes from './NavBar.module.css';
import costSheetIcon from '../../src/images/cost.png';
import Cpasswordmodal from '../UI/Modal/Cpasswordmodal.';
import useFetch, { Provider } from "use-http";
import { alertActions } from '../store/alert-slice';
import api from '../Api'


function NavBar(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const moduleId = useSelector((state) => state.sideBar.moduleId);
  const { get, post, response, loading, error } = useFetch({ data: [] });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userName = localStorage.getItem('userName');

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

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const setModuleId = () => {
    props.onHide();
    dispatch(
      moduleActions.selectModuleId({
        moduleId: '',
      })
    );
    history.push('/modules');
  };
  const handleLogout = async () => {
    const logout = await get(api + '/logout')
    console.log("log", logout)
    if (response.ok) {
      authCtx.logout();


    }

  };
  return (
    <div className={classes.container}>
      <Row className={classes.formholder}>
      



          <div className={classes.searchcontainertitle}>


        <div className={classes.title} >
              <p className={classes.heading}>SRIPATHI PAPER AND BOARDS PVT LTD</p>


            </div>


          


          


            <div className={classes.flexrowise}>



              <div className={classes.userAdminIcon}>
                <div className={`d-flex justify-content-center align-items-center`}> <p
                  className={`d-flex justify-content-center align-items-center ${classes.uname}`}
                >{userName}</p>
                </div>
                <div className={classes.usericon}>
                  <Dropdown >
                    <Dropdown.Toggle
                      variant="primary"
                      id="dropdown-basic"
                      className={`d-flex justify-content-center align-items-center ${classes.uiconBg}`}
                      bsPrefix="custom-toggle" // Add a custom prefix to the toggle element
                      toggleBsPrefix="toggle"
                      style={{ backgroundColor: 'transparent', border: '0px', outline: '0px' }}
                    >
                      <img
                        src={costSheetIcon}
                        alt="Cost Sheet Icon"
                        className={classes.uicon}
                        style={{ backgroundColor: 'transparent', border: '0px', outline: '0px' }}

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

              </div>
            </div>

          </div>



        
      </Row>
      {showModal && (
        <Cpasswordmodal onClose={hideModalHandler}>
          <ChangePassword onSubmit={resetPassword} />
        </Cpasswordmodal>
      )}  </div>
  );
}

export default NavBar;

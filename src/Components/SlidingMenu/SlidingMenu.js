import React, { useEffect, useCallback, useState, useContext } from 'react';
import styles from "./SlidingMenu.module.css";
import {
  FaBeer, FaApple, FaAndroid, FaRocket, FaBolt, FaCloud, FaCube, FaKey, FaSignOutAlt, FaPlusCircle
} from "react-icons/fa";
import { useHistory } from 'react-router-dom';
import {
  CreateForm,
  SearchCard, SimpleCard,
  Table, alertActions,
  api,
  classes,
  modalActions,
  useDispatch,
  useFetch,
  useSelector, AuthContext
} from '../CommonImports/CommonImports';

import ProcessForm from '../../pages/QueryAndSolution/ProcessForm';
import { moduleActions } from '../../store/module-slice';
import CustomModal from './CustomModal';
import SlidingChangePassword from './SlidingChangePassword';
const icons = [FaBeer, FaApple, FaAndroid, FaRocket, FaBolt, FaCloud, FaCube];
const BATCH_SIZE = 5;

const SlidingMenu = () => {
  const [menuData, setMenuData] = useState([]);
  const [visibleMenus, setVisibleMenus] = useState([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [centerIndex, setCenterIndex] = useState(2);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const { post, get, response } = useFetch({ data: [] });

  const authCtx = useContext(AuthContext);

  const role = localStorage.getItem('roleId');
  const dispatch = useDispatch();
  const history = useHistory();

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true);
    setShowDropdown(false);
  };
  const closeChangePasswordModal = () => setShowChangePasswordModal(false);



  const loadInitialData = useCallback(async () => {
    const features = await post(api + "/activityMaster/loadProcess", { roleId: role });

    console.log("features ====>", features)
    if (response.ok && Array.isArray(features)) {
      const processMap = {};
      const processPathMap = {};
      console.log("features", features);

      features.forEach((item, i) => {
        const processName = item.process?.processName || `Process ${i + 1}`;
        const processPath = item.process?.processPath || `processPath ${i + 1}`;
        const module = item;

        if (!processMap[processName]) {
          processMap[processName] = [];
          processPathMap[processName] = processPath; // Store path by process
        }

        if (module) {
          processMap[processName].push({
            id: `item-${i}`,
            title: module.functionName || ``,
            path: module.functionPath || `/${i + 1}`,
            moduleId: module.functionId || '',
            processId: module.processId || '',
            processName: processName || ``,
            icon: icons[i % icons.length],
          });
        }
      });

      const menus = Object.entries(processMap).map(([title, items]) => ({
        title,
        items,
        processPath: processPathMap[title],
      }));

      setMenuData(menus);

      const firstBatch = menus.slice(0, BATCH_SIZE);
      const filledBatch = [...firstBatch];

      while (filledBatch.length < BATCH_SIZE) {
        filledBatch.push({ title: '', items: [], placeholder: true });
      }

      setVisibleMenus(filledBatch);
      setCenterIndex(Math.floor(filledBatch.length / 2));
    }
  }, [post, response, role]);

  useEffect(() => {


    dispatch(
      moduleActions.selectModuleId({
        processId: "",
        moduleId: "",
        activityId: "",
        functionPath: "",
        functionTittle: "",
        processTittle: "",
        activityTittle: "",

      })
    );

    loadInitialData();
  }, [loadInitialData, dispatch]);

  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

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

  const addProcess = (menu) => {
    const process = menu.items?.[0]?.processId; // Safe way to extract
    const processPath = menu.processPath;
    const proTittle = menu.title;
    console.log("processss ", process)
    if (process) {
      dispatch(
        moduleActions.selectModuleId({
          processId: process,
          processTittle: proTittle,
          moduleId: 1,
        })
      );
    }

    if (processPath) {
      history.push(processPath);
    }
  };


  const addmodules = (selectedmodule) => {
    console.log("test")
    dispatch(
      moduleActions.selectModuleId({
        moduleId: selectedmodule?.moduleId,
        functionPath: selectedmodule?.path,
        functionTittle: selectedmodule?.title,
        processTittle: selectedmodule?.processName,
      })
    );
    history.push(selectedmodule.path)
  };
  const formSaveFunction = async (values) => {


    const saveUrl = values.processId > 0 ? '/processMaster/create' : '/processMaster/create'

    const newDoc = await post(api + saveUrl, values)

    if (response.ok) {
      if (values.processId) {
        // setData(data.map((doc) => doc.processId === values.processId ? values : doc))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Process Updated Successfully", "success")
      } else {
        // setData([...data, newDoc])
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Process Created Succesfully", "success")
      }
    } else {
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Process Details Failed To Save", "danger")
    }
  }

  const actions = ["add", "delete", "functionForm"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
    if (action === "add") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '24%',
          modalLeft: '38%',
          selectedForm: (
            <ProcessForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}

              saveFunction={formSaveFunction}

            />
          ),
          showModal: true,
        })
      );
    }


  };
  const switchBatch = (dir) => {
    const totalBatches = Math.ceil(menuData.length / BATCH_SIZE);
    const newBatchIndex = dir === "right"
      ? Math.min(batchIndex + 1, totalBatches - 1)
      : Math.max(batchIndex - 1, 0);

    const start = newBatchIndex * BATCH_SIZE;
    const newBatch = menuData.slice(start, start + BATCH_SIZE);

    const filledBatch = [...newBatch];
    while (filledBatch.length < BATCH_SIZE) {
      filledBatch.push({ title: '', items: [], placeholder: true });
    }

    setBatchIndex(newBatchIndex);
    setVisibleMenus(filledBatch);
    setCenterIndex(Math.floor(filledBatch.length / 2));
  };

  const handleMenuClick = (clickedIndex) => {
    if (clickedIndex === centerIndex || visibleMenus[clickedIndex].placeholder) return;

    const offset = centerIndex - clickedIndex;
    const rotated = [...visibleMenus].map((_, i, arr) => {
      const newIndex = (i - offset + arr.length) % arr.length;
      return arr[newIndex];
    });

    setVisibleMenus(rotated);
  };

  const hideModalHandler = () => {
    setShowChangePasswordModal(false);
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
  const handleLogout = async () => {
    const logout = await get(api + '/logout')
    console.log("log", logout)
    if (response.ok) {
      authCtx.logout();


    }

  };
  return (
    <div className={styles.carouselWrapper}>
      {/* Header Info */}
      <div className={styles.headerInfo}>
        <div className={styles.companySection}>
          <div className={styles.companyName}>SRIPATHI PAPER AND BOARDS PVT LTD</div>
          <div className={styles.userInfo}>Admin</div>
        </div>
      </div>
      <div className={styles.carouselContainer}>
        <div className={styles.circleSmall}></div>
        <div className={styles.circleMedium}></div>
        <div className={styles.circleLarge}></div>

        <button className={styles.arrowButton} onClick={() => switchBatch("left")} disabled={batchIndex === 0}>
          &#8249;
        </button>

        <div className={styles.carouselTrack}>
          {visibleMenus.map((menu, index) => {
            let className = styles.menuCard;
            const isCenter = index === centerIndex;
            if (menu.placeholder) className += ` ${styles.disabled}`;
            else if (index === centerIndex) className += ` ${styles.center}`;
            else if (Math.abs(index - centerIndex) === 1) className += ` ${styles.side}`;

            return (
              <div key={menu.title || `placeholder-${index}`} className={className} onClick={() => handleMenuClick(index)}>
                <h3 onClick={isCenter ? () => addProcess(menu) : undefined} style={{ cursor: isCenter ? 'pointer' : 'default' }}>{menu.title || ''}</h3>
                <ul>
                  {menu.items.length > 0 ? (
                    menu.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.id}>
                          <Icon style={{ marginRight: 8 }} />
                          <span onClick={isCenter ? () => addmodules(item) : undefined}
                            style={{ cursor: isCenter ? 'pointer' : 'default', opacity: index === centerIndex ? 1 : 0.6 }} >{item.title}</span>
                        </li>
                      );
                    })
                  ) : (
                    <li style={{ opacity: 0.3, cursor: "not-allowed" }}></li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>

        <button
          className={styles.arrowButton}
          onClick={() => switchBatch("right")}
          disabled={(batchIndex + 1) * BATCH_SIZE >= menuData.length}
        >
          &#8250;
        </button>
      </div>


      {/* Logout Dropdown */}
      <div className={styles.logoutWrapper}>
        <div className={styles.logoutIcon} onClick={toggleDropdown}>
          <FaSignOutAlt size={24} />
        </div>

        {showDropdown && (
          <div className={styles.logoutDropdown}>
            <div onClick={openChangePasswordModal} className={styles.dropdownItem}>
              <FaKey style={{ marginRight: 8 }} /> Change Password
            </div>
            <div onClick={handleLogout} className={styles.dropdownItem}>
              <FaSignOutAlt style={{ marginRight: 8 }} /> Logout
            </div>
          </div>
        )}
      </div>


      {/* Add Icon - Bottom Right */}
      <div className={styles.addIcon} onClick={showFormHandler({}, actions[0])}>
        <FaPlusCircle size={28} />
      </div>

      {/* Popup Modal for Change Password */}
      <CustomModal show={showChangePasswordModal} onHide={closeChangePasswordModal}>
        <SlidingChangePassword onSubmit={resetPassword} />
      </CustomModal>

    </div>
  );
};

export default SlidingMenu;

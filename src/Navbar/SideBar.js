import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import SubMenu from "./SubMenu";
import api from "../Api";
import useFetch from "use-http";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { moduleActions } from "../store/module-slice";
import { useHistory } from "react-router-dom";
import Logo from "../images/rytways-logo(1).png";
import { DynamicSideMenu } from "./SidebarModulewise/DynamicSideMenu";
import MobileTopBar from "./MobileTopBar";
import { FaCommentDots } from "react-icons/fa";

const SideMenu = styled(Row)`margin: 0; padding: 0;`;
const SidebarNav = styled(Col)`
  background: #a72811ff;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 17.6%;
  z-index: 999;
  padding: 0;
  overflow-y: auto;
`;
const SidebarWrap = styled(Row)`width: 100%; display: block;`;
const LogoHeader = styled.div`
  display: flex;
  justify-content: center;
  margin: 2.5rem 0 1.5rem;
`;
const LogoImage = styled.img`
  width: 11rem;
  height: 4.8rem;
  cursor: pointer;
`;

function SideBar(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { post, response } = useFetch({ data: [] });

  const moduleId = useSelector((state) => state.sideBar.moduleId);
  const showAllActivities = useSelector(
    (state) => state.sideBar.showAllActivities
  );

  const roleId = Number(localStorage.getItem("roleId"));
  const userId = Number(localStorage.getItem("userId"));
  const [menu, setMenu] = useState([]);
  const isMobile = window.innerWidth <= 600;

  const loadInitialMenues = useCallback(async () => {
    const apiUrl = showAllActivities
      ? "/activityMaster/getAllActivitiesByRole"
      : "/activityMaster/getActivityByFunction";

    const res = await post(api + apiUrl, {
      functionId: moduleId,
      roleId,
      userId,
    });

    if (response.ok) setMenu(res);
  }, [post, response, moduleId, roleId, userId, showAllActivities]);

  useEffect(() => {
    loadInitialMenues();
  }, [loadInitialMenues]);

  const setModuleId = () => {
    const currentPath = history.location.pathname;

    // Only navigate if not already on process page
    if (currentPath !== "/processModule") {
      dispatch(moduleActions.selectModuleId({ moduleId: "" }));
      history.push("/processModule");
    }
  };

  const handleActivityClick = (activity) => {
    dispatch(moduleActions.selectActivityId({ activityId: activity.id }));
    if (isMobile) dispatch(moduleActions.setMobileNavVisible(true));
  };

  if (isMobile) return <MobileTopBar />;


  const BottomFixedContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: ${({ sidebarOpen }) => (sidebarOpen ? '17.6%' : '17.6%')};
    background-color: #d4fd52;
    z-index: 1001;
    padding: 0.5rem 0;
    display: flex;
    justify-content: center;
  
    @media (max-width: 600px) {
      width: ${({ sidebarOpen }) => (sidebarOpen ? '100%' : '0%')};
    }
  `;
  const IconContainer = styled.div`
    font-size: ${({ sidebarOpen }) => (sidebarOpen ? '1rem' : '2rem')};
    transition: font-size 0.3s ease;
    margin: ${({ sidebarOpen }) => (sidebarOpen ? 'auto 0' : 'auto')};
    display: flex;
    ${({ sidebarOpen }) => !sidebarOpen && 'justify-content: center;'}
    align-items: center;
    ${({ sidebarOpen }) => !sidebarOpen && 'padding: .2rem 0;'}
  `;

  const onClick = () => {
    history.push("/process/querySolutions")
  }
  return (
    <SideMenu>
      <SidebarNav>
        <LogoHeader>
          <LogoImage src={Logo} alt="Logo" onClick={setModuleId} />
        </LogoHeader>

        <SidebarWrap>
          {DynamicSideMenu(menu).map((item, idx) => (
            <SubMenu
              key={idx}
              item={item}
              sidebarOpen
              onClick={() => handleActivityClick(item)}
            />
          ))}
        </SidebarWrap>
        <BottomFixedContainer sidebarOpen={props.sidebar} onClick={() => onClick()} style={{ cursor: "pointer" }}>
          <IconContainer
            sidebarOpen={props.sidebar}
          >
            <FaCommentDots size={24} color="black" />
          </IconContainer>
        </BottomFixedContainer>
      </SidebarNav>
    </SideMenu>
  );
}

export default SideBar;

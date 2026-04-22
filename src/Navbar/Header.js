import React, { useContext } from "react";
import styled from "styled-components";
import SideBar from "./SideBar";
import AuthContext from "../store/auth-context";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const ContainerHeaderWrap = styled(Row)`margin: 0; width: 100%; max-width: 100%;`;
const NavWrap = styled(Col)`
  padding: 0;
  width: 100%;
  min-height: 100vh;
  transition: padding-left 0.3s ease, padding-top 0.3s ease;

  padding-left: ${({ showSidebar }) => (showSidebar ? "17.6%" : "0")};

  @media (max-width: 600px) {
    padding-left: 0 !important;
    padding-top: ${({ hideTopBar, isPopupOpen }) =>
    hideTopBar || isPopupOpen ? "0" : "64px"};
  }
`;

const Header = (props) => {
  const moduleId = useSelector((state) => state.sideBar.moduleId);
  const isPopupOpen = useSelector((state) => state.sideBar.isPopupOpen);
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const location = useLocation();

  // ? FIXED: Show sidebar ONLY on process/activity pages
  const currentPath = location.pathname;
  const isDashboard = currentPath === "/ReportDashboard";

  const shouldShowSidebar = isLoggedIn &&
    moduleId > 0 && !isDashboard &&
    !currentPath.match(/^\/(main|contacts|dashboard|)$/);

  const hideTopBar = location.pathname === "/processModule";

  console.log('Header Debug:', {
    isLoggedIn,
    moduleId,
    currentPath,
    showSidebar: shouldShowSidebar
  });

  return (
    <ContainerHeaderWrap>
      {shouldShowSidebar && <SideBar />}
      <NavWrap
        showSidebar={shouldShowSidebar}
        hideTopBar={hideTopBar}
        isPopupOpen={isPopupOpen}
      >
        {props.children}
      </NavWrap>
    </ContainerHeaderWrap>
  );
};

export default Header;

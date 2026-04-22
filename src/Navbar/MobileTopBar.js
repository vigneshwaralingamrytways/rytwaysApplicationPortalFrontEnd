import React from "react";
import styled from "styled-components";
import { FaArrowLeft } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = styled.div`
  height: 56px;
  width: 100%;
  background: #24c486ff;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  pointer-events: none;
`;

function MobileTopBar() {
  const history = useHistory();
  const location = useLocation();
  const isVisible = useSelector((state) => state.sideBar.isMobileNavVisible);

  if (location.pathname === "/processModule" || !isVisible) return null;

  return (
    <Navbar>
      <BackBtn onClick={() => history.goBack()}>
        <FaArrowLeft />
      </BackBtn>
      <Title>Rytways Technologies Pvt Ltd</Title>
    </Navbar>
  );
}

export default MobileTopBar;

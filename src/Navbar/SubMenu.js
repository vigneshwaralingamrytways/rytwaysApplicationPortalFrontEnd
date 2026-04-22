import React, { useState } from 'react';
import { Link,useHistory } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { Row } from 'react-bootstrap';
import { ui } from '../Api';
import { moduleActions } from '../store/module-slice';
import { useDispatch } from 'react-redux';

const hoverAnimation = keyframes`
  0% {
    background-color: #99aae4;
  }
  50% {
    background-color: #99aae4;
  }
  100% {
    background-color: #4662c9;
  }
`;

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  min-height: 48px;
  text-decoration: none;
  background-color: transparent;
  transition: background-color 0s ease;
  padding:.2rem 0;


  ${({ isHovered }) =>
    isHovered &&
    css`
      animation: ${hoverAnimation} .2s;
      background-color: #4662c9;
      color: white;
     
      
      
    `}
    &:hover {
      color: #ffffff;
      
      cursor: pointer;
    }
`;

const SidebarLabel = styled.span`
display: flex;
  ${({ sidebarOpen }) => !sidebarOpen && 'justify-content: center;'}
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '28px' : '0')};
  font-weight: 400;
  font-size: ${({ sidebarOpen }) => (sidebarOpen ? '1.2rem' : '0.9rem')};
  align-items: center;

  
`;
const SubSidebarLabel = styled.span`
display: flex;
  ${({ sidebarOpen }) => !sidebarOpen && 'justify-content: center;'}
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '10px' : '0')};
  font-weight: 400;
  font-size: ${({ sidebarOpen }) => (sidebarOpen ? '1.2rem' : '0.9rem')};
  align-items: center;

  
`;

const DropdownLink = styled(Link)`
  background: #2f3651;
  height: 60px;
  padding-left: .5rem;
  width: 100%;
  margin-right: 0px;
  border-right: 0px;
  display: flex;
  flex-direction: ${({ sidebarOpen }) => (sidebarOpen ? 'row' : 'column')};
  ${({ sidebarOpen }) => !sidebarOpen && 'justify-content: center;'};

  text-decoration: none;
  color: #f5f5f5;
  font-size: 1.1rem;
  width: 100%;
  &:hover {
    background: #a3b2f1;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const LinkContainer = styled.div`
  width: 100%;
  margin-right: 0px;
  border-right: 0px;
  display: flex;
  flex-direction: ${({ sidebarOpen }) => (sidebarOpen ? 'row' : 'column')};
  ${({ sidebarOpen }) => !sidebarOpen && 'justify-content: center;'};
  ${({ sidebarOpen }) => sidebarOpen && ' margin-left: 28px;'};
 
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
const SubIconContainer = styled.div`
  font-size: ${({ sidebarOpen }) => (sidebarOpen ? '1rem' : '1.2rem')};
  transition: font-size 0.3s ease;
  margin: ${({ sidebarOpen }) => (sidebarOpen ? 'auto 0' : 'auto')};
  display: flex;
  ${({ sidebarOpen }) => !sidebarOpen && 'justify-content: center;'}
  align-items: center;
  ${({ sidebarOpen }) => !sidebarOpen && 'padding: .2rem 0;'}
`;
const SubMenu = ({ item, sidebarOpen }) => {
  const history = useHistory();
  const [subnav, setSubnav] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const showSubnav = () => setSubnav(!subnav);


  const getTitleSubstring = (title) => {
    // Apply substring(0, 6) first
    let substringResult = title.substring(0, 7);

    // Check if substring contains a space
    if (substringResult.includes(' ')) {
      // If yes, perform split and return the first part
      return sidebarOpen ? title : substringResult.split(' ')[0];
    } else {
      // If no space, return the substring result
      return substringResult;
    }
  };


  const navigateToLink=(item)=>{
    history.push({
      pathname: item.path,
      state: {...item.data},
    });
  }

  const handleClick = () => {
    // handlesetActivity(item);
    if (item.subNav) {
      showSubnav();
    }

      dispatch(moduleActions.selectModuleId({ activityId: item.activityId, activityTittle: item.title }))
    
  };

  return (
    <>
      <SidebarLink
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        isHovered={isHovered}
        to={item.path}
        onClick={handleClick}
      >
          <LinkContainer sidebarOpen={sidebarOpen}>
          <IconContainer sidebarOpen={sidebarOpen}>{item.icon}</IconContainer>
          <SidebarLabel sidebarOpen={sidebarOpen}>
          {sidebarOpen ? item.title : getTitleSubstring(item.title)}
          </SidebarLabel>
        </LinkContainer>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            
            <DropdownLink to={item.path} key={index} onClick={()=>{navigateToLink(item)}} sidebarOpen={sidebarOpen}>
            <SubIconContainer sidebarOpen={sidebarOpen}>{item.icon}</SubIconContainer>
            <SubSidebarLabel sidebarOpen={sidebarOpen}>
          {sidebarOpen ? item.title : getTitleSubstring(item.title)}
          </SubSidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;
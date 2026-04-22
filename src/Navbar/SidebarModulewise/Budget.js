import React from 'react';
import styled from 'styled-components';

const CircleOutlineWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  background-color: white;  // Fix the typo here

  color: black;
  padding: 0.6em; 
  font-size: 0.7em;
  border-radius: 50%;
  font-weight: 900;
`;


const LetterIcon = ({ letter }) => (
  <CircleOutlineWrapper>
    {letter}
  </CircleOutlineWrapper>
);

/* export const Budget = [ */
export const Budget = (roleId) => [
  ...( ([1].includes(roleId))
  ? [
  /*   {
      title: 'Dashboard',
      path: '/budgetAmountView',
      icon:  <LetterIcon letter="D" />
    },  */
    {
      title: 'Dashboard',
      path: '/budgetDashBoard',
      icon:  <LetterIcon letter="D" />
    },
    {
      title: 'Budget Amount',
      path: '/budgetAmount',
      icon:  <LetterIcon letter="A" />
    }
  ]: [     {
    title: 'Budget Amount',
    path: '/budgetAmount',
    icon:  <LetterIcon letter="A" />
  }]),
  
];
import React, { useCallback, useEffect, useState } from 'react';
import api from '../Api';
import { useFetch } from 'use-http';
import { generateToken } from './GenerateToken';

const ConfirmationBudgetBox = ({
  message = "Do you want to amend this PR?",
  amendPr,
  onCancel,
  selected,
  approveButton = "Yes",
  cancelButton = "No"
}) => {

    const { get, post, response, loading, error } = useFetch({ data: [] });

    const[balanceBudget,setBalanceBudget] = useState("")
    const[budgetName,setBudgetName] = useState("")

  const onSubmit = () => {
    amendPr(selected);
  };
  const onCancelled = () => {
    onCancel(selected);
  };


  const loadInitialOptions1 = useCallback(async () => {
    console.log("department", selected?.purchaseRequest?.department,
        "unit", selected?.purchaseRequest?.unit, 
        "budgetId", selected?.purchaseRequest?.budgetId)
    const loadedBudget = await post(api + "/budgetAmount/findBudget", {
        department: selected?.purchaseRequest?.department,
        unit: selected?.purchaseRequest?.unit, 
        budgetId: selected?.purchaseRequest?.budgetId,
        random: generateToken()
      });
      if(response.ok){
console.log("loadedBudget", loadedBudget)
        const balance = parseFloat(loadedBudget?.balanceAmount ?? 0);
      const pipeTotal = parseFloat(loadedBudget?.totalPipeItemAmount ?? 0);
      const availBalance = balance - pipeTotal;
setBalanceBudget(availBalance)
setBudgetName(loadedBudget?.budgetName)
      }
  }, [get, response]);
  useEffect(() => {
    loadInitialOptions1();
    
  }, []);
  return (
    <div style={styles.container}>
      <p style={styles.message}>{message}</p>

      
        <p style={styles.budgetInfo}>
          <strong>Budget Name:</strong> {budgetName || "N/A"}
        </p>
      

      <p style={styles.budgetInfo}>
        <strong>Available Budget:</strong> : {balanceBudget ? balanceBudget.toFixed(2) : "0.00"}
      </p>

      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.button, backgroundColor: "#4CAF50" }}
          onClick={onSubmit}
        >
          {approveButton}
        </button>
        <button
          style={{ ...styles.button, backgroundColor: "#f44336" }}
          onClick={onCancelled}
        >
          {cancelButton}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ccc',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '450px',
    margin: '20px auto',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  message: {
    fontSize: '16px',
    marginBottom: '16px',
    fontWeight: '500',
  },
  budgetInfo: {
    fontSize: '15px',
    color: '#2c3e50',
    backgroundColor: '#f1f6f9',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '10px',
    border: '1px solid #dfe6e9',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '16px',
  },
  button: {
    padding: '10px 24px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default ConfirmationBudgetBox;
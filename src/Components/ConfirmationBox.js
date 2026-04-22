import React from 'react';

const ConfirmationBox = ({
  message = "Do you want to amend this PR?",
  amendPr,
  onCancel,
  selected,
  approveButton = "Yes",
  cancelButton = "No"
}) => {

  const onSubmit = () => {
    amendPr(selected);
  };
  const onCancelled = () => {
    onCancel(selected);
  };

  return (
    <div style={styles.container}>
        
      <p style={styles.message}>{message}</p>
      <div style={styles.buttonContainer}>
      {message && (
          <button style={{ ...styles.button, backgroundColor: "#4CAF50" }} onClick={onSubmit}>
           {approveButton}
          </button>
        )}
        <button style={{ ...styles.button, backgroundColor: "#f44336" }} onClick={onCancelled}>
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
    padding: '16px',
    maxWidth: '400px',
    margin: '20px auto',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  message: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },
  button: {
    padding: '8px 20px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default ConfirmationBox;

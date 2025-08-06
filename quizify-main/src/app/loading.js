'use client'
import React from 'react';

const Loading = ({ size = 'medium', text = 'Loading...', color = '#0077ff' }) => {
  const sizeMap = {
    small: '16px',
    medium: '32px',
    large: '48px'
  };

  const spinnerSize = sizeMap[size] || size;
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    spinner: {
      width: spinnerSize,
      height: spinnerSize,
      border: `4px solid rgba(0, 0, 0, 0.1)`,
      borderLeftColor: color,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    text: {
      marginTop: '10px',
      color: '#666',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
      {text && <div style={styles.text}>{text}</div>}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
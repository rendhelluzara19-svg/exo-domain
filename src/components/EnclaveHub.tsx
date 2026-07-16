import React from 'react';

export default function EnclaveHub() {
  return (
    <div style={{ padding: '50px', color: 'white', backgroundColor: '#000', minHeight: '100vh', textAlign: 'center' }}>
      <h1>Enclave Hub</h1>
      <p>Status: Online</p>
      <button 
        onClick={() => alert("System Active!")}
        style={{ padding: '20px', background: 'blue', color: 'white', marginTop: '20px', cursor: 'pointer' }}
      >
        TEST CONNECTION
      </button>
    </div>
  );
}

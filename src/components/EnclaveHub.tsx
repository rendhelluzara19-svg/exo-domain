import React from 'react';

export default function EnclaveHub() {
  return (
    <div style={{ padding: '50px', color: 'white', backgroundColor: '#000', minHeight: '100vh' }}>
      <h1>Enclave Hub Test</h1>
      <p>Kung nakikita mo ito, gumagana na ang component.</p>
      <button 
        onClick={() => alert("Test Click Successful!")}
        style={{ padding: '20px', background: 'green', color: 'white', marginTop: '20px', cursor: 'pointer' }}
      >
        CLICK ME TO TEST
      </button>
    </div>
  );
}

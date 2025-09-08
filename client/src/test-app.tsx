// Simple test component to debug rendering issues
function TestApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f0f9ff, #e0e7ff)',
      padding: '40px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          🚀 React is Working!
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          marginBottom: '24px'
        }}>
          This confirms that React is rendering successfully. Now testing components step by step...
        </p>

        <div style={{
          padding: '20px',
          background: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong style={{color: '#065f46'}}>✅ Working:</strong>
          <ul style={{marginTop: '8px', paddingLeft: '20px'}}>
            <li>React rendering</li>
            <li>JavaScript execution</li>
            <li>CSS styling</li>
            <li>HTML structure</li>
          </ul>
        </div>

        <div style={{
          padding: '20px',
          background: '#fef3c7',
          borderRadius: '8px'
        }}>
          <strong style={{color: '#92400e'}}>🔍 Next steps:</strong>
          <ul style={{marginTop: '8px', paddingLeft: '20px'}}>
            <li>Test routing (wouter)</li>
            <li>Test providers (Query, Helmet)</li>
            <li>Test layout components</li>
            <li>Test main pages</li>
          </ul>
        </div>

        <button 
          style={{
            marginTop: '24px',
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
          onClick={() => {
            console.log("Button clicked - JavaScript events working!");
            alert("Interactive elements working correctly!");
          }}
        >
          Test Interaction
        </button>
      </div>
    </div>
  );
}

export default TestApp;
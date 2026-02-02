import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Root level Error Boundary to prevent the app from disappearing on runtime errors
class GlobalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Rapid Parcel Runtime Exception:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          background: '#0f172a', 
          color: 'white', 
          fontFamily: 'sans-serif', 
          height: '100vh', 
          width: '100vw', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100000 
        }}>
          <h1 style={{ color: '#f59e0b', fontSize: '2.5rem', marginBottom: '10px' }}>System Critical Error</h1>
          <p style={{ opacity: 0.8, fontSize: '1.2rem' }}>The application logic failed during execution.</p>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', marginTop: '20px', maxWidth: '90%', overflow: 'auto', textAlign: 'left', border: '1px solid #334155' }}>
            <code style={{ color: '#ef4444', fontSize: '13px', whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</code>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '15px 30px', marginTop: '30px', background: '#f59e0b', color: 'black', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '900', fontSize: '16px', textTransform: 'uppercase' }}
          >
            Force Reboot
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const mountApp = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error("Rapid Parcel: FATAL - Root element missing from DOM");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <GlobalErrorBoundary>
          <App />
        </GlobalErrorBoundary>
      </React.StrictMode>
    );
    
    // Signal to the DOM that React has successfully started rendering
    // This allows the hard-coded CSS in index.html to hide the initial fallback
    document.body.classList.add('app-loaded');
    console.log("Rapid Parcel: Core system mounted.");
  } catch (err) {
    console.error("Rapid Parcel: Mount sequence failure:", err);
    container.innerHTML = `
      <div style="background:#0f172a; color:white; height:100vh; display:flex; align-items:center; justify-content:center; text-align:center; flex-direction:column; font-family:sans-serif;">
        <h2 style="color:#ef4444;">Mount Sequence Interrupted</h2>
        <p>${err}</p>
        <button onclick="window.location.reload()" style="margin-top:20px; padding:12px 24px; background:#f59e0b; color:black; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">Retry Boot</button>
      </div>
    `;
  }
};

// Execute bootstrapper immediately or when ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp();
} else {
  window.addEventListener('DOMContentLoaded', mountApp);
}
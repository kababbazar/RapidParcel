import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Root level Error Boundary for production safety
class GlobalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Rapid Parcel Critical Failure:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#111827', color: 'white', fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1 style={{ color: '#f59e0b', fontSize: '2rem' }}>System Malfunction</h1>
          <p style={{ opacity: 0.8, marginTop: '10px' }}>The Rapid Parcel engine encountered a critical runtime error.</p>
          <pre style={{ background: '#1f2937', padding: '15px', borderRadius: '8px', fontSize: '12px', marginTop: '20px', maxWidth: '80%', overflow: 'auto', color: '#ef4444' }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '12px 24px', marginTop: '30px', background: '#f59e0b', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reboot System
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <GlobalErrorBoundary>
          <App />
        </GlobalErrorBoundary>
      </React.StrictMode>
    );
    console.log("Rapid Parcel: Application instance started.");
  } catch (err) {
    console.error("Rapid Parcel: Mount sequence failed:", err);
    container.innerHTML = `<div style="color:white; background:#111827; padding:40px; text-align:center; height:100vh; display:flex; align-items:center; justify-content:center;">
      <div>
        <h2 style="color:#ef4444;">Mount Failure</h2>
        <p>${err}</p>
        <button onclick="window.location.reload()" style="margin-top:20px; padding:10px 20px; background:#f59e0b; color:black; border:none; border-radius:5px; cursor:pointer;">Retry</button>
      </div>
    </div>`;
  }
}
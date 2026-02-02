import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("Rapid Parcel Catch:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#111827', color: 'white', fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1 style={{ color: '#f59e0b' }}>Rapid Parcel: Critical System Error</h1>
          <p style={{ opacity: 0.8 }}>The application failed to render properly.</p>
          <pre style={{ background: '#1f2937', padding: '15px', borderRadius: '8px', fontSize: '12px', marginTop: '20px', maxWidth: '80%', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', marginTop: '30px', background: '#f59e0b', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Hard Reset System
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const render = () => {
  const container = document.getElementById('root');
  if (!container) return;
  
  try {
    const root = createRoot(container);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    console.log("Rapid Parcel: UI Mounted.");
  } catch (e) {
    console.error("Rapid Parcel: Mount Failed", e);
    container.innerHTML = `<div style="color:red; background:white; padding:20px; text-align:center;">Mount Failure: ${e}</div>`;
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  render();
} else {
  window.addEventListener('DOMContentLoaded', render);
}
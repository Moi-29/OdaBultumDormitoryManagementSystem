import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#dc2626', fontFamily: 'monospace', backgroundColor: '#fee2e2', height: '100vh', overflow: 'auto' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️ Application Crashed</h1>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fca5a5' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#b91c1c' }}>{this.state.error && this.state.error.toString()}</h2>
            <details style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#4b5563' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>View Component Stack</summary>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                Reload Page
              </button>
              <button onClick={() => { localStorage.clear(); window.location.reload() }} style={{ padding: '0.5rem 1rem', background: '#4b5563', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', marginLeft: '0.5rem' }}>
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)

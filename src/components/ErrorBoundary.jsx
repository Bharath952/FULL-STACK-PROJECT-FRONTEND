import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-view">
          <div className="container py-10 text-center">
            <h2 className="text-gradient">Something went wrong.</h2>
            <p className="text-secondary mt-1">We encountered an unexpected error. Please try refreshing the page.</p>
            <button 
              className="btn btn-primary mt-2" 
              onClick={() => window.location.reload()}
            >
              Refresh Explorer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

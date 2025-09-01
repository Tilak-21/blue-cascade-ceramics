import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId
    });

    // Log to monitoring service (Sentry is already included in dependencies)
    if (window.Sentry) {
      window.Sentry.withScope((scope) => {
        scope.setTag('errorBoundary', true);
        scope.setTag('errorId', errorId);
        scope.setContext('errorInfo', errorInfo);
        window.Sentry.captureException(error);
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-stone-900 mb-3">
              Something went wrong
            </h1>
            
            <p className="text-stone-600 mb-6">
              We apologize for the inconvenience. An unexpected error occurred while loading this page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.errorId && (
              <div className="bg-stone-100 rounded-lg p-3 mb-6 text-left">
                <p className="text-xs text-stone-600 mb-2">Error ID: {this.state.errorId}</p>
                <details className="text-xs text-stone-700">
                  <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                  <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-stone-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-stone-900 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-white border border-stone-300 text-stone-700 py-3 px-4 rounded-xl font-medium hover:bg-stone-50 transition-colors flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </button>
            </div>

            <p className="text-xs text-stone-500 mt-6">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
import React from "react";

interface IErrorBoundary {
  fallback: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<IErrorBoundary> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error,
    };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Application runtime error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="errorBoundary" role="alert">
          <h1>Something went wrong</h1>
          <p>
            The page could not be displayed right now. Please refresh the site or try again later.
          </p>
        </main>
      );
    }

    return this.props.children;
  }
}

import { Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/error-boundary.css';

class ErrorBoundaryCore extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(previousProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Application runtime error:', error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary" role="alert">
          <section className="error-boundary__card">
            <span className="error-boundary__eyebrow">Error temporal</span>
            <h1>No pudimos mostrar esta página</h1>
            <p>
              Ocurrió un problema al cargar esta sección. Puedes volver a la página anterior,
              regresar a una zona segura o intentar cargarla nuevamente.
            </p>
            <div className="error-boundary__actions">
              <button type="button" className="btn primary" onClick={this.reset}>
                Reintentar
              </button>
              <button type="button" className="btn secondary" onClick={this.props.onBack}>
                Volver atrás
              </button>
              <button type="button" className="btn" onClick={this.props.onSafePage}>
                {this.props.safePageLabel}
              </button>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundary({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const safePath = isAdminRoute ? '/admin' : '/';

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(safePath, { replace: true });
  };

  return (
    <ErrorBoundaryCore
      resetKey={`${location.key}:${location.pathname}:${location.search}`}
      onBack={goBack}
      onSafePage={() => navigate(safePath, { replace: true })}
      safePageLabel={isAdminRoute ? 'Ir al panel' : 'Ir al inicio'}
    >
      {children}
    </ErrorBoundaryCore>
  );
}

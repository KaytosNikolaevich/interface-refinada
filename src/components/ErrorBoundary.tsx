import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
          <span className="text-8xl mb-4" role="img" aria-label="Erro">😴</span>
          <h1 className="text-2xl font-black text-foreground mb-2">Ops!</h1>
          <p className="text-muted-foreground font-semibold mb-6 text-center">
            Algo deu errado. Vamos tentar de novo?
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-learning bg-primary text-primary-foreground flex items-center gap-2"
          >
            <span aria-hidden="true">🔄</span>
            <span>Tentar novamente</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

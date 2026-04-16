const PageLoader = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-background"
    role="status"
    aria-label="Carregando"
  >
    <div className="w-12 h-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
  </div>
);

export default PageLoader;

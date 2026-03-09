import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-6">
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl border border-error/20">
        <div className="card-body gap-4">
          <div className="flex items-center gap-3 text-error">
            <div className="p-2 bg-error/10 rounded-lg">
              <AlertTriangle size={28} />
            </div>
            <h2 className="card-title text-2xl font-bold">Error</h2>
          </div>

          <p className="text-base-content/70">
            Something went wrong. Please refresh the page and try again. Notify developers if it
            keeps happening.
          </p>

          <div className="collapse bg-base-200 rounded-box">
            <input type="checkbox" />
            <div className="collapse-title text-sm font-medium flex items-center gap-2">
              <Terminal size={14} /> Issue details (for developers)
            </div>
            <div className="collapse-content">
              <pre className="text-xs text-error font-mono whitespace-pre-wrap leading-relaxed">
                {error instanceof Error ? error?.message : JSON.stringify(error)}
              </pre>
            </div>
          </div>

          <div className="card-actions justify-end mt-4">
            <button className="btn btn-error btn-outline gap-2" onClick={resetErrorBoundary}>
              <RefreshCw size={18} />
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CatcherProps {
  children: React.ReactNode;
  onReset?: () => void;
}

export const Catcher = ({ children, onReset }: CatcherProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
      onError={(err) => console.error('[Catcher Log]:', err)}
    >
      {children}
    </ErrorBoundary>
  );
};

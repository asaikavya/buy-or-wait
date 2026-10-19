import type { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="mt-1 text-sm text-red-700">
        This page hit an unexpected error. Try again, or pick another page above.
      </p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
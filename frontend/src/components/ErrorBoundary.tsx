import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; message: string; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : "An unexpected error occurred." };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[LifeReplay AI] Render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <div className="mx-auto max-w-2xl px-4 py-16 text-center"><div className="rounded-2xl border border-rose-200 bg-rose-50 p-8"><h2 className="text-2xl font-black text-slate-950">Something went wrong</h2><p role="alert" className="mt-3 text-sm leading-6 text-rose-800">{this.state.message}</p><button type="button" onClick={() => this.setState({ hasError: false, message: "" })} className="mt-6 rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800">Try again</button></div></div>;
    }
    return this.props.children;
  }
}

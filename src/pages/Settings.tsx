import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex animate-fade-up items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-forest/10 text-brand-forest shadow-panel">
          <SettingsIcon size={20} aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-text-dark">Settings</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Manage system preferences, API endpoints, and credentials.</p>
        </div>
      </div>

      <div className="rounded-lg border border-brand-border bg-brand-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-text-dark mb-4">System Preferences</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-brand-text-dark">Mock Data Mode</h3>
            <p className="text-xs text-brand-text-muted mt-0.5">Currently enabled. Toggle this in the backend environment variables to enable live assessment APIs.</p>
          </div>
          <div className="border-t border-brand-border pt-4">
            <h3 className="text-sm font-medium text-brand-text-dark">Model Version</h3>
            <p className="text-xs text-brand-text-muted mt-0.5">HeritageGuard Predictor v2.4 (Latest)</p>
          </div>
          <div className="border-t border-brand-border pt-4">
            <h3 className="text-sm font-medium text-brand-text-dark">Teammate Integration</h3>
            <div className="mt-2 space-y-2 text-xs text-brand-text-muted">
              <p>• Member 1: API Endpoint (Risk Assessment)</p>
              <p>• Member 3: API Endpoint (CV Crack Detection)</p>
              <p>• Member 5: API Endpoint (Conservation Reports)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

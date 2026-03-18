import { useSyncStore } from '../services/syncService';

export function SyncIndicator() {
  const status = useSyncStore((s) => s.status);

  const dotClass = {
    disconnected: 'bg-gray-400',
    connected: 'bg-green-500',
    syncing: 'bg-blue-500 animate-pulse',
    error: 'bg-red-500',
  }[status];

  const label = {
    disconnected: null,
    connected: 'Synced',
    syncing: 'Syncing',
    error: 'Sync error',
  }[status];

  return (
    <div className="flex items-center gap-1.5 text-xs text-text-light">
      <span className={`inline-block w-2 h-2 rounded-full ${dotClass}`} />
      {label && <span className="hidden sm:inline">{label}</span>}
    </div>
  );
}

import { useEffect, useState } from 'react';

interface FreezeOverlayProps {
  trigger: boolean;
}

export function FreezeOverlay({ trigger }: FreezeOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        background:
          'radial-gradient(circle, rgba(147,197,253,0.6) 0%, rgba(219,234,254,0.8) 50%, rgba(147,197,253,0.4) 100%)',
        animation: 'freeze-flash 200ms ease-out forwards',
      }}
    />
  );
}

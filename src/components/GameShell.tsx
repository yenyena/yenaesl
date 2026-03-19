import { useRef, useCallback } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { GAMES } from '../constants/games';
import { useVocabStore } from '../stores/useVocabStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { ArrowLeftIcon, ZoomOutIcon, ZoomInIcon } from './icons';

export function GameShell() {
  const { gameId, uid } = useParams();
  const navigate = useNavigate();
  const game = GAMES.find((g) => g.id === gameId);
  const { getUnit } = useVocabStore();
  const unit = uid ? getUnit(uid) : undefined;
  const { zoomLevel, zoomIn, zoomOut } = useSettingsStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

  const isZoomed = zoomLevel > 1;

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const el = containerRef.current;
    if (!el) return;
    dragState.current = { isDragging: true, startX: e.clientX, startY: e.clientY, scrollLeft: el.scrollLeft, scrollTop: el.scrollTop };
    el.setPointerCapture(e.pointerId);
  }, [isZoomed]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const ds = dragState.current;
    if (!ds.isDragging) return;
    const el = containerRef.current;
    if (!el) return;
    el.scrollLeft = ds.scrollLeft - (e.clientX - ds.startX);
    el.scrollTop = ds.scrollTop - (e.clientY - ds.startY);
  }, []);

  const onPointerUp = useCallback(() => {
    dragState.current.isDragging = false;
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-60px)]">
      {/* Game top bar */}
      <div className="bg-surface shadow-card px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-lg cursor-pointer bg-transparent border-none p-2 rounded-button hover:bg-bg transition-colors text-text"
        >
          <ArrowLeftIcon size={20} /> Back
        </button>
        <div className="text-center">
          <span className="font-heading text-lg text-primary">
            {game?.name}
          </span>
          {unit && (
            <span className="text-text-light text-sm ml-2">
              {unit.month} — Week {unit.week}: {unit.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={zoomLevel <= 0.3}
            className="cursor-pointer bg-primary/10 text-primary border-none p-1.5 rounded-button hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-default"
            title="Zoom out"
          >
            <ZoomOutIcon size={18} />
          </button>
          <button
            onClick={zoomIn}
            disabled={zoomLevel >= 1.4}
            className="cursor-pointer bg-primary/10 text-primary border-none p-1.5 rounded-button hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-default"
            title="Zoom in"
          >
            <ZoomInIcon size={18} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-sm cursor-pointer bg-primary/10 text-primary border-none px-3 py-2 rounded-button font-bold hover:bg-primary/20 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Game content area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        style={{ cursor: isZoomed ? (dragState.current.isDragging ? 'grabbing' : 'grab') : 'default' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
          }}
        >
          <Outlet />
        </div>
      </div>

      {/* Bottom progress strip */}
      <div className="bg-surface border-t border-bg px-4 py-2 text-center text-text-light text-sm">
        Score &amp; progress area
      </div>
    </div>
  );
}

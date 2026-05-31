"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

interface ImageGalleryProps {
  images: ({ thumbnail: string; original: string } | undefined)[];
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.5;
const DOUBLE_TAP_DELAY = 300;
// If mouse moves more than this during a click, treat it as a drag not a click
const CLICK_MOVE_THRESHOLD = 5;

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panAtDragStart = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const lastPinchDist = useRef<number | null>(null);
  const prevIndexRef = useRef<number | null>(null);

  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { panRef.current = pan; }, [pan]);

  const resetZoomPan = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex !== prevIndexRef.current) {
      setIsLoading(true);
      prevIndexRef.current = selectedIndex;
    }
  }, [selectedIndex]);

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    resetZoomPan();
  }, [resetZoomPan]);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null && prev < images.length - 1 ? prev + 1 : prev,
    );
    resetZoomPan();
  }, [images.length, resetZoomPan]);

  const closeModal = useCallback(() => {
    setOpen(false);
    setSelectedIndex(null);
    resetZoomPan();
  }, [resetZoomPan]);

  const clampPan = useCallback((x: number, y: number, currentZoom: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const maxPanX = (el.clientWidth * (currentZoom - 1)) / 2;
    const maxPanY = (el.clientHeight * (currentZoom - 1)) / 2;
    return {
      x: Math.min(maxPanX, Math.max(-maxPanX, x)),
      y: Math.min(maxPanY, Math.max(-maxPanY, y)),
    };
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(MAX_ZOOM, parseFloat((prev + ZOOM_STEP).toFixed(1))));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(MIN_ZOOM, parseFloat((prev - ZOOM_STEP).toFixed(1)));
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open || selectedIndex === null) return;
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, open, showPrev, showNext, closeModal]);

  // Mouse wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !open) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev - e.deltaY * 0.005));
        if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
        return next;
      });
    };

  // Touch events
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !open) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist.current = Math.hypot(dx, dy);
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        dragStart.current = { x: midX, y: midY };
        panAtDragStart.current = panRef.current;
      } else if (e.touches.length === 1) {
        const now = Date.now();
        const isDoubleTap = now - lastTap.current < DOUBLE_TAP_DELAY && lastTap.current !== 0;
        if (isDoubleTap) {
          e.preventDefault();
          if (zoomRef.current > 1) { setZoom(1); setPan({ x: 0, y: 0 }); }
          else setZoom(2.5);
          lastTap.current = 0;
          isDragging.current = false;
          return;
        }
        lastTap.current = now;
        isDragging.current = true;
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panAtDragStart.current = panRef.current;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2 && lastPinchDist.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const delta = dist - lastPinchDist.current;
        lastPinchDist.current = dist;
        setZoom((prev) => {
          const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta * 0.01));
          if (next <= MIN_ZOOM) setPan({ x: 0, y: 0 });
          return next;
        });
      } else if (e.touches.length === 1 && isDragging.current && zoomRef.current > 1) {
        const dx = e.touches[0].clientX - dragStart.current.x;
        const dy = e.touches[0].clientY - dragStart.current.y;
        setPan(clampPan(
          panAtDragStart.current.x + dx,
          panAtDragStart.current.y + dy,
          zoomRef.current,
        ));
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) lastPinchDist.current = null;
      if (e.touches.length === 0) isDragging.current = false;
      if (e.touches.length === 1) {
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panAtDragStart.current = panRef.current;
        isDragging.current = true;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [open, clampPan]);

  // ── Mouse drag-to-pan on the container (captures pointer even off-image) ──
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (zoomRef.current <= 1) return;
    hasDragged.current = false;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    panAtDragStart.current = pan;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.hypot(dx, dy) > CLICK_MOVE_THRESHOLD) hasDragged.current = true;
    setPan(clampPan(panAtDragStart.current.x + dx, panAtDragStart.current.y + dy, zoom));
  };

  const onPointerUp = () => { isDragging.current = false; };

  // ── Single click on the IMAGE WRAPPER toggles zoom ────────────────────────
  const onImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasDragged.current) return; // was a drag, not a click
    if (zoomRef.current > 1) resetZoomPan();
    else setZoom(2.5);
  }, []);

  const imageCursor = zoom > 1
    ? isDragging.current ? "grabbing" : "grab"
    : "zoom-in";

  const imageTransform = `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`;

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, index) => {
          if (!img) return null;
          return (
            <div
              key={index}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border transition-transform duration-50 hover:scale-105"
              onClick={() => { setSelectedIndex(index); setOpen(true); }}
            >
              <Image
                src={img.thumbnail}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={index % 2 === 0 ? "/blur.webp" : "/dark-blur.jpeg"}
              />
            </div>
          );
        })}
      </div>

      <Dialog.Root
        open={open}
        onOpenChange={(isOpen: boolean) => {
          setOpen(isOpen);
          if (!isOpen) { setSelectedIndex(null); resetZoomPan(); }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90" />
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-default">
            <VisuallyHidden>
              <Dialog.Description>Image viewer for blog photos.</Dialog.Description>
            </VisuallyHidden>
            <Dialog.Title asChild>
              <VisuallyHidden>Image viewer</VisuallyHidden>
            </Dialog.Title>

            {/* ── Top bar ── */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
              <p className="text-sm font-semibold text-white drop-shadow">
                {selectedIndex !== null ? `${selectedIndex + 1} / ${images.length}` : ""}
              </p>
              <Dialog.Close
                onClick={closeModal}
                className="rounded-full bg-black/60 p-2 text-white cursor-pointer hover:bg-black/80"
              >
                <X className="h-6 w-6" />
              </Dialog.Close>
            </div>

            {/* ── Image area — default cursor, drag captured here ── */}
            <div
              ref={containerRef}
              className="relative flex h-full w-full items-center justify-center overflow-hidden"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              {isLoading && (
                <div className="h-[70vh] w-[85vw] max-w-5xl animate-pulse rounded-lg bg-gray-700" />
              )}

              {/* Image wrapper — zoom cursor + single-click zoom only on the actual photo */}
              {selectedIndex !== null && images[selectedIndex] && (
                <div
                  ref={imageWrapRef}
                  className="absolute inset-0"
                  style={{ cursor: imageCursor }}
                  onClick={onImageClick}
                >
                  <Image
                    src={images[selectedIndex]!.original}
                    alt={`Full image ${selectedIndex + 1}`}
                    fill
                    loading="eager"
                    sizes="100vw"
                    className="rounded-lg object-contain select-none pointer-events-none"
                    style={{
                      opacity: isLoading ? 0 : 1,
                      transform: imageTransform,
                      transition: isDragging.current
                        ? "none"
                        : "transform 0.15s ease, opacity 0.3s",
                    }}
                    onLoad={() => setIsLoading(false)}
                    draggable={false}
                  />
                </div>
              )}

              {containRect && !isLoading && (
                <div
                  className="absolute z-10"
                  style={{
                    left: containRect.left,
                    top: containRect.top,
                    width: containRect.width,
                    height: containRect.height,
                    cursor: imageCursor,
                  }}
                  onClick={onImageOverlayClick}
                />
              )}
            </div>

            {/* ── Prev arrow ── */}
            {selectedIndex !== null && selectedIndex > 0 && (
              <button
                onClick={showPrev}
                className="absolute left-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white cursor-pointer hover:bg-black/80 md:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* ── Next arrow ── */}
            {selectedIndex !== null && selectedIndex < images.length - 1 && (
              <button
                onClick={showNext}
                className="absolute right-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white cursor-pointer hover:bg-black/80 md:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* ── Zoom controls ── */}
            {!isLoading && (
              <div className="absolute bottom-10 right-4 z-50 flex flex-col overflow-hidden rounded-lg shadow-lg md:bottom-8 md:right-6">
                <button
                  onClick={zoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  className="flex items-center justify-center bg-black/60 px-3 py-2 text-white hover:bg-black/80 disabled:opacity-30 border-b border-white/20 cursor-pointer disabled:cursor-default"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={zoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  className="flex items-center justify-center bg-black/60 px-3 py-2 text-white hover:bg-black/80 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

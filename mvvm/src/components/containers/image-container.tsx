"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: ({ thumbnail: string; original: string } | undefined)[];
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const DOUBLE_TAP_DELAY = 300;

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panAtDragStart = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const lastPinchDist = useRef<number | null>(null);

  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { panRef.current = pan; }, [pan]);

  const resetZoomPan = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

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

  useEffect(() => {
    if (selectedIndex !== null) setIsLoading(true);
  }, [selectedIndex]);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !open) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev - e.deltaY * 0.001));
        if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !open) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist.current = Math.hypot(dx, dy);
      } else if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
          if (zoomRef.current > 1) { setZoom(1); setPan({ x: 0, y: 0 }); }
          else { setZoom(2.5); }
          lastTap.current = 0;
          return;
        }
        lastTap.current = now;
        if (zoomRef.current > 1) {
          isDragging.current = true;
          dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          panAtDragStart.current = panRef.current;
        }
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
      } else if (e.touches.length === 1 && isDragging.current) {
        const dx = e.touches[0].clientX - dragStart.current.x;
        const dy = e.touches[0].clientY - dragStart.current.y;
        const clamped = clampPan(
          panAtDragStart.current.x + dx,
          panAtDragStart.current.y + dy,
          zoomRef.current,
        );
        setPan(clamped);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) lastPinchDist.current = null;
      if (e.touches.length === 0) isDragging.current = false;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [open, clampPan]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (zoom <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    panAtDragStart.current = pan;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan(clampPan(panAtDragStart.current.x + dx, panAtDragStart.current.y + dy, zoom));
  };

  const onPointerUp = () => { isDragging.current = false; };

  const onDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (zoom > 1) resetZoomPan();
    else setZoom(2.5);
  };

  const imageTransform = `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`;
  const imageCursor = zoom > 1 ? (isDragging.current ? "grabbing" : "grab") : "default";

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
          <Dialog.Content className="fixed inset-0 z-50 flex flex-col items-center justify-center">
            <VisuallyHidden>
              <Dialog.Description>Image viewer for blog photos.</Dialog.Description>
            </VisuallyHidden>
            <Dialog.Title asChild>
              <VisuallyHidden>Image viewer</VisuallyHidden>
            </Dialog.Title>

            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
              <p className="text-sm font-semibold text-white">
                {selectedIndex !== null ? `${selectedIndex + 1} / ${images.length}` : ""}
              </p>
              <Dialog.Close
                onClick={closeModal}
                className="rounded-full bg-black/60 p-2 text-white hover:cursor-pointer hover:bg-black/80"
              >
                <X className="h-6 w-6" />
              </Dialog.Close>
            </div>

            <div
              ref={containerRef}
              className="relative flex h-full w-full items-center justify-center overflow-hidden"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onDoubleClick={onDoubleClick}
            >
              {isLoading && (
                <div className="h-[70vh] w-[85vw] max-w-5xl animate-pulse rounded-lg bg-gray-700" />
              )}

              {images[selectedIndex!] && (
                <Image
                  key={selectedIndex}
                  src={images[selectedIndex!]?.original as string}
                  alt={`Full image ${selectedIndex! + 1}`}
                  fill
                  loading="eager"
                  sizes="100vw"
                  className="rounded-lg object-contain select-none"
                  style={{
                    opacity: isLoading ? 0 : 1,
                    transform: imageTransform,
                    cursor: imageCursor,
                    transition: isDragging.current
                      ? "none"
                      : "transform 0.15s ease, opacity 0.3s",
                  }}
                  onLoad={() => setIsLoading(false)}
                  draggable={false}
                />
              )}
            </div>

            {selectedIndex !== null && selectedIndex > 0 && (
              <button
                onClick={showPrev}
                className="absolute left-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 md:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {selectedIndex !== null && selectedIndex < images.length - 1 && (
              <button
                onClick={showNext}
                className="absolute right-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 md:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {!isLoading && zoom === 1 && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none select-none text-xs text-white/50">
                Scroll or pinch to zoom · Double-tap to zoom in
              </p>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

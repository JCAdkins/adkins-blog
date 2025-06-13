"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: ({ thumbnail: string; original: string } | undefined)[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const showPrev = () =>
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));

  const showNext = () =>
    setSelectedIndex((prev) =>
      prev !== null && prev < images.length - 1 ? prev + 1 : prev
    );

  const closeModal = () => {
    setOpen(false);
    setSelectedIndex(null);
  };

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
  }, [selectedIndex, open]);

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, index) => {
          if (!img || img === undefined) return null;
          return (
            <div
              key={index}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border transition-transform duration-50 hover:scale-105"
              onClick={() => {
                setSelectedIndex(index);
                setOpen(true);
              }}
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

      {/* Shared Dialog */}
      <Dialog.Root
        open={open}
        onOpenChange={(isOpen: boolean) => {
          setOpen(isOpen);
          if (!isOpen) setSelectedIndex(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <Dialog.Title asChild>
              <VisuallyHidden>Image viewer</VisuallyHidden>
            </Dialog.Title>

            <div className="relative max-h-[90vh]">
              {/* Close */}
              <Dialog.Close className="absolute top-4 right-4 z-50 rounded-full bg-black/60 p-2 text-white hover:cursor-pointer hover:bg-black/80">
                <X className="h-6 w-6" />
              </Dialog.Close>

              {/* Prev */}
              {selectedIndex! > 0 && (
                <button
                  onClick={showPrev}
                  className="absolute top-1/2 left-4 z-50 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Image */}
              {images[selectedIndex!] ? (
                <Image
                  src={images[selectedIndex!]?.original as string}
                  alt={`Full image ${selectedIndex! + 1}`}
                  width={800}
                  height={600}
                  loading="eager"
                  className="max-h-[80vh] w-auto rounded-lg object-contain"
                />
              ) : null}

              {/* Next */}
              {selectedIndex! < images.length - 1 && (
                <button
                  onClick={showNext}
                  className="absolute top-1/2 right-4 z-50 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}

              {/* Image count indicator (centered in the image) */}
              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-bold text-white">
                {selectedIndex! + 1} / {images.length}
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

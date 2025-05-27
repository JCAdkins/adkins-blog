"use client";

import React, { useRef, useState, useEffect, ChangeEvent } from "react";

interface FileDropZoneProps {
  fileType: string[];
  files: File[];
  setFiles: (files: File[]) => void;
}

export default function FileDropZone({
  fileType,
  setFiles,
  files,
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayMessage, setDisplayMessage] = useState<React.ReactNode>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const validateInput = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => fileType.includes(file.type));

    if (validFiles.length === 0) {
      setDisplayMessage(
        <p className="text-sm text-red-500">No valid image files selected.</p>,
      );
      return;
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  // Update parent with uploaded files
  useEffect(() => {
    setFiles(uploadedFiles);
  }, [uploadedFiles]);

  // Remove file by index
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex h-32 items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-100 px-4 text-center text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500">
        <input
          ref={inputRef}
          name="dropzone_files"
          id="dropzone_files"
          type="file"
          multiple
          className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
          onChange={validateInput}
        />
        <p className="pointer-events-none text-sm">
          Drag and drop or click to upload image(s)
        </p>
      </div>

      {displayMessage && <div className="mt-2">{displayMessage}</div>}

      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {previews.map((url, idx) => (
            <div
              key={idx}
              className="relative max-h-1/4 max-w-1/4 overflow-hidden rounded-md border border-gray-300 shadow-sm dark:border-gray-600"
            >
              <img
                src={url}
                alt={`Preview ${idx}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => removeFile(idx)}
                type="button"
                className="bg-opacity-70 hover:bg-opacity-90 absolute top-0 right-0 rounded-bl-md bg-black px-1 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

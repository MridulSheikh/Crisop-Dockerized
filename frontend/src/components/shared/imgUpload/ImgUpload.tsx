"use client";

import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";

const MAX_SIZE = 2 * 1024 * 1024;

type Props = {
  value?: File[];
  onChange: (files: File[]) => void;
  max_file?: number;
};

const ImgUpload = ({ value = [], onChange, max_file = 5 }: Props) => {
  const MAX_FILES = max_file;

  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles?.length > 0) {
        alert("Some files rejected (size/type)");
      }

      const newFiles = acceptedFiles.filter(
        (newFile) =>
          !value.some(
            (file) =>
              file.name === newFile.name &&
              file.size === newFile.size &&
              file.lastModified === newFile.lastModified
          )
      );

      if (newFiles.length !== acceptedFiles.length) {
        alert("Duplicate file skipped");
      }

      if (value.length + newFiles.length > MAX_FILES) {
        alert(`Max ${MAX_FILES} images allowed`);
        return;
      }

      onChange([...value, ...newFiles]);
    },
    [value, onChange, MAX_FILES]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: MAX_SIZE,
  });

  const removeFile = (target: File) => {
    onChange(
      value.filter(
        (file) =>
          !(
            file.name === target.name &&
            file.size === target.size &&
            file.lastModified === target.lastModified
          )
      )
    );
  };

  // memory cleanup
  useEffect(() => {
    const urls = value.map((file) => URL.createObjectURL(file));

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [value]);

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed cursor-pointer transition ${
          isDragActive ? "border-primary bg-muted" : "border-gray-300"
        }`}
      >
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <input {...getInputProps()} />
          <UploadCloud className="w-10 h-10 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop images here..."
              : `Drag & drop (Max ${MAX_FILES}, 2MB each)`}
          </p>
        </CardContent>
      </Card>

      {(value?.length ?? 0) > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((file) => {
            const preview = URL.createObjectURL(file);

            return (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="relative border rounded-lg overflow-hidden"
              >
                <img
                  src={preview}
                  alt={file.name}
                  className="w-full h-32 object-cover"
                />

                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1"
                  onClick={() => removeFile(file)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {(value?.length ?? 0)} / {MAX_FILES} uploaded
      </p>
    </div>
  );
};

export default ImgUpload;

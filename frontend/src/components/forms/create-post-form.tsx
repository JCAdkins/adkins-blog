"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "../ui/progress-indicator";
import FileDropZone from "../inputs/file-drop-zone";

interface CreatePostFormProps {
  action: (formData: FormData) => Promise<void>;
}

export default function CreatePostForm({ action }: CreatePostFormProps) {
  const [step, setStep] = useState(0);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    content: "",
    featured: false,
    images: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    const { name, type, value } = target;
    const checked = (target as HTMLInputElement).checked;

    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("description", formState.description);
    formData.append("content", formState.content);
    formData.append("featured", String(formState.featured));
    formState.images.forEach((file) => formData.append("images", file));
    await action(formData);
  };

  const steps = [
    <>
      <label className="text-sm font-medium">Title</label>
      <Input
        name="title"
        value={formState.title}
        onChange={handleChange}
        placeholder="Enter title"
      />
    </>,
    <>
      <label className="text-sm font-medium">Description</label>
      <textarea
        name="description"
        value={formState.description}
        onChange={handleChange}
        className="border-input bg-background min-h-[120px] w-full rounded-md border p-2 text-sm"
        placeholder="Enter description"
      />
    </>,
    <>
      <label className="text-sm font-medium">Content</label>
      <textarea
        name="content"
        value={formState.content}
        onChange={handleChange}
        className="border-input bg-background min-h-[200px] w-full rounded-md border p-2 text-sm"
        placeholder="Write your content..."
      />
    </>,
    <>
      <label className="flex items-center gap-2 text-sm font-medium">
        <Input
          type="checkbox"
          name="featured"
          checked={formState.featured}
          onChange={handleChange}
        />
        Featured Post
      </label>
    </>,
    <FileDropZone
      fileType={[
        "image/svg+xml",
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ]}
      files={formState.images}
      setFiles={(files: File[]) =>
        setFormState((prev) => ({ ...prev, images: files }))
      }
    />,
  ];

  return (
    <div className="space-y-6">
      <form
        action={async () => {
          if (step === steps.length - 1) {
            await handleSubmit();
          } else {
            setStep((s) => s + 1);
          }
        }}
      >
        <div className="space-y-2">{steps[step]}</div>
        <div className="mt-4 flex justify-between">
          {step > 0 ? (
            <Button type="button" onClick={() => setStep((s) => s - 1)}>
              Previous
            </Button>
          ) : (
            <div className="invisible">Previous</div>
          )}
          <ProgressIndicator steps={steps.length} currentStep={step} />
          <Button type="submit">
            {step === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </form>
    </div>
  );
}

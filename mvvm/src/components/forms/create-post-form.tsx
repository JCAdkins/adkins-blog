"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "../ui/progress-indicator";
import FileDropZone from "../inputs/file-drop-zone";
import { BlogGenre } from "@/models/blog/blogGenreModel";
import { uploadImages } from "@/lib/services/immich-service";
import { createBlog } from "@/lib/db/queries";

const genreOptions = [
  "educational",
  "excursion",
  "review",
  "comparison",
  "tutorial",
  "news",
] as const;

export default function CreatePostForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    content: "",
    genre: "" as BlogGenre | "",
    featured: false,
    images: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target;
    const { name, type, value } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = (session as any)?.token;
      if (!token) throw new Error("Unauthorized");

      // 1. Upload images first
      const imageUrls = await uploadImages(formState.images);

      // 2. Create the blog post with returned image data
      await createBlog({
        title: formState.title,
        description: formState.description,
        genre: formState.genre,
        content: formState.content,
        featured: String(formState.featured),
        images: imageUrls,
      });

      router.push("/admin");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create blog post");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    <div key={1}>
      <label className="text-sm font-medium">Title</label>
      <Input
        name="title"
        value={formState.title}
        onChange={handleChange}
        placeholder="Enter title"
      />
    </div>,
    <div key={2}>
      <label className="text-sm font-medium">Description</label>
      <textarea
        name="description"
        value={formState.description}
        onChange={handleChange}
        className="border-input bg-background min-h-30 w-full rounded-md border p-2 text-sm"
        placeholder="Enter description"
      />
    </div>,
    <div key={3}>
      <label className="text-sm font-medium">Genre</label>
      <select
        name="genre"
        value={formState.genre}
        onChange={handleChange}
        className="border-input bg-background w-full rounded-md border p-2 text-sm"
      >
        <option value="">Select a genre</option>
        {genreOptions.map((genre) => (
          <option key={genre} value={genre}>
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </option>
        ))}
      </select>
    </div>,
    <div key={4}>
      <label className="text-sm font-medium">Content</label>
      <textarea
        name="content"
        value={formState.content}
        onChange={handleChange}
        className="border-input bg-background min-h-50 w-full rounded-md border p-2 text-sm"
        placeholder="Write your content..."
      />
    </div>,
    <div key={5}>
      <label className="flex items-center gap-2 text-sm font-medium">
        <Input
          type="checkbox"
          name="featured"
          checked={formState.featured}
          onChange={handleChange}
        />
        Featured Post
      </label>
    </div>,
    <FileDropZone
      key={6}
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
      {error && <p className="text-sm text-red-500">{error}</p>}
      <form
        onSubmit={async (e) => {
          if (step === steps.length - 1) {
            await handleSubmit(e);
          } else {
            e.preventDefault();
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
          <Button type="submit" disabled={submitting}>
            {step === steps.length - 1
              ? submitting
                ? "Submitting..."
                : "Submit"
              : "Next"}
          </Button>
        </div>
      </form>
    </div>
  );
}

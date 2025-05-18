"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic goes here
    console.log({ title, description, content, featured, images });
  };

  return (
    <div className="bg-header/60 mx-auto max-w-4xl rounded-xl p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Create New Blog Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Content</label>
          <textarea
            className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-rose-300 focus:outline-none"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <label htmlFor="featured" className="text-sm">
            Featured Post
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Upload Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file:bg-login hover:file:bg-login-hover block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:cursor-pointer"
          />
          {images.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
              {images.map((img, idx) => (
                <li key={idx}>{img.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-right">
          <Button type="submit" className="bg-login hover:bg-login-hover">
            Submit Post
          </Button>
        </div>
      </form>
    </div>
  );
}

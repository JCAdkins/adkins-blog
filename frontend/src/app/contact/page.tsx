"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real backend call
    console.log("Contact form submitted:", form);
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-6 text-4xl font-bold">Contact Me</h1>
      <p className="mb-8 text-lg text-gray-700">
        I'd love to hear from you! Whether you have a question, collaboration
        idea, or just want to say hello — feel free to drop a message below.
      </p>

      {submitted ? (
        <p className="text-lg text-green-600">
          Thank you! Your message has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-800"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-800"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}

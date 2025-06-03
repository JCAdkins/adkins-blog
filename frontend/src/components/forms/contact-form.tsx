"use client";

import { ContactAdmins } from "@/lib/services/contact-service";
import { User } from "next-auth";
import { useState } from "react";

type Props = {
  user?: User | null;
};

export default function ContactForm({ user }: Props) {
  console.log("user: ", user);
  const [form, setForm] = useState({
    name: "",
    email: user?.email ?? "",
    reason: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState<string>();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = user
      ? { message: form.message, reason: form.reason, user }
      : form;
    console.log("Contact form submitted:", payload);
    const contacted = await ContactAdmins(payload);
    setSubmitted(contacted.status);
  };

  return submitted ? (
    submitted === "success" ? (
      <p className="text-lg text-green-600">
        Thank you! Your message has been sent.
      </p>
    ) : (
      <p className="text-lg text-red-600">
        An error appears to have occurred. Please try again.
      </p>
    )
  ) : (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!user && (
        <>
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
        </>
      )}

      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-gray-800"
        >
          Reason for Contact
        </label>
        <select
          id="reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
        >
          <option value="" disabled>
            Select a reason
          </option>
          <option value="question">General Question</option>
          <option value="bug">Bug Report</option>
          <option value="collab">Collaboration</option>
          <option value="feedback">Feedback</option>
          <option value="other">Other</option>
        </select>
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
  );
}

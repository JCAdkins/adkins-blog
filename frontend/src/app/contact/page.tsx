import { auth } from "@/app/(auth)/auth";
import ContactForm from "@/components/forms/contact-form";

export default async function ContactPage() {
  const session = await auth(); // or however you get user
  const user = session?.user ?? null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-6 text-4xl font-bold">Contact Me</h1>
      <p className="mb-8 text-lg text-gray-700">
        I'd love to hear from you! Whether you have a question, collaboration
        idea, or just want to say hello — feel free to drop a message below.
      </p>
      <ContactForm user={user} />
    </div>
  );
}

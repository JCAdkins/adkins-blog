import { useContactViewModel } from "@/view-models/contact/useContactViewModel";
import { ContactView } from "@/views/contact/ContactView";

export default async function ContactPage() {
  const vm = await useContactViewModel();
  return <ContactView {...vm} />;
}

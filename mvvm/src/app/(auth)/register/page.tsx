"use client";

import { useRegisterViewModel } from "@/view-models/auth/useRegisterViewModel";
import { RegisterView } from "@/views/auth/RegisterView";

export default function Page() {
  const vm = useRegisterViewModel();

  return <RegisterView {...vm} />;
}

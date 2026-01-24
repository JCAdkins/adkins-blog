// app/(auth)/login/page.tsx
"use client";

import { useLoginViewModel } from "@/view-models/auth/useLoginViewModel";
import { LoginView } from "@/views/auth/LoginView";

const Page = () => {
  const vm = useLoginViewModel();

  return <LoginView {...vm} />;
};

export default Page;

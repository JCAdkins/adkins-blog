// app/(auth)/login/page.tsx
"use client";

import { useLoginViewModel } from "@/view-models/useLoginViewModel";
import { LoginView } from "@/views/auth/LoginView";

const Page = () => {
  const { email, isSuccessful, handleSubmit } = useLoginViewModel();

  return (
    <LoginView
      email={email}
      isSuccessful={isSuccessful}
      onSubmit={handleSubmit}
    />
  );
};

export default Page;

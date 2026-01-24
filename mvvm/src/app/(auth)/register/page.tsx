"use client";

import { useRegisterViewModel } from "@/view-models/useRegisterViewModel";
import { RegisterView } from "@/views/auth/RegisterView";

export default function Page() {
  const { email, username, isSuccessful, handleSubmit } =
    useRegisterViewModel();

  return (
    <RegisterView
      email={email}
      username={username}
      isSuccessful={isSuccessful}
      onSubmit={handleSubmit}
    />
  );
}

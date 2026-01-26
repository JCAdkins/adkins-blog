import { auth } from "@/app/(auth)/auth";

export const useContactViewModel = async () => {
  const session = await auth(); // or however you get user
  const user = session?.user ?? null;
  return { user };
};

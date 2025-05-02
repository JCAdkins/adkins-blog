import { usePathname } from "next/navigation";
import Form from "next/form";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AuthForm({
  action,
  children,
  defaultEmail = "",
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  const isRegisterPage = usePathname().includes("/register");

  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="font-normal text-zinc-600 dark:text-zinc-400"
        >
          Email Address
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="font-normal text-zinc-600 dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
        />
      </div>
      {isRegisterPage && (
        <>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="username"
              className="font-normal text-zinc-600 dark:text-zinc-400"
            >
              Username
            </Label>

            <Input
              id="username"
              name="username"
              className="bg-muted text-md md:text-sm"
              type="text"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="first_name"
              className="font-normal text-zinc-600 dark:text-zinc-400"
            >
              First Name (Optional)
            </Label>

            <Input
              id="first_name"
              name="first_name"
              className="bg-muted text-md md:text-sm"
              type="text"
              placeholder="First Name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="last_name"
              className="font-normal text-zinc-600 dark:text-zinc-400"
            >
              Last Name (Optional)
            </Label>

            <Input
              id="last_name"
              name="last_name"
              className="bg-muted text-md md:text-sm"
              type="text"
              placeholder="Last Name"
            />
          </div>
        </>
      )}
      {children}
    </Form>
  );
}

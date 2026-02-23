// This is the user that is returned from the db. It includes the password so make
// sure that is only used on the server and not passed on to the client

import { UUID } from "crypto";
import { UserSession } from "./userSession";

export type UserDb = {
  id: UUID;
  role: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  location?: string;

  profileVisibility?: "public" | "friends" | "private";
  activityVisible?: boolean;
  sessions: UserSession[];
};

import { UUID } from "crypto";
import { User } from "next-auth";

export type UserSession = {
  id: string;
  userId: UUID;
  user: User;

  device: string;
  browser: string;
  os?: string;

  city?: string;
  region?: string;
  country?: string;

  ipAddress?: string;

  createdAt: Date;
  lastActiveAt: Date;

  isCurrent: boolean;
};

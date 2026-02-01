import { UUID } from "crypto";

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  userId?: UUID;
}

export type EmailParams = {
  to: string[];
  subject: string;
  html: string;
};

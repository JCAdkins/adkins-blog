import { hash } from "bcryptjs";
import {
  createUserInDb,
  findUserInDb,
  getAllUsersInDb,
} from "../models/userModel.ts";

interface UserInput {
  email: string;
  username: string;
  password: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

export const createUserService = async (userData: UserInput) => {
  const hashedPassword = await hash(userData.password, 10);
  return await createUserInDb({
    ...userData,
    password: hashedPassword,
  });
};

// Find user by email
export const findUserByEmail = async (email: string) => {
  const user = await findUserInDb({ where: { email } });
  return user;
};

// Find user by email
export const findUserByUsername = async (username: string) => {
  const user = await findUserInDb({ where: { username } });
  return user;
};

export const getAllUsers = async () => {
  const users = await getAllUsersInDb();
  return users;
};

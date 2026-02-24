"use client";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// import { promoteUser, deleteUser, banUser, getUsers } from "@/lib/actions";
export const dynamic = "force-dynamic";

const promoteUser = (id: string) => console.log("Promoiting user: ", id);
const deleteUser = (id: string) => console.log("Deleting user: ", id);
const banUser = (id: string) => console.log("Banning user: ", id);

export default function UsersPage() {
  const { data } = useSession();
  const users = [data?.user];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>
      <ul>
        {users.map((user: User) => (
          <li key={user.id} className="mb-2">
            <div className="flex items-center justify-between">
              <span>{user.email}</span>
              <div className="space-x-2">
                {user.role !== "admin" && (
                  <button onClick={() => promoteUser(user.id)}>Promote</button>
                )}
                <button onClick={() => banUser(user.id)}>Ban</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
//

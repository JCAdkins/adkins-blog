import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="bg-sidebar w-64 space-y-4 p-4 text-black">
      <h2 className="text-xl font-bold">Admin</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/admin" className="hover:bg-amber-300">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin/posts" className="hover:bg-amber-300">
            Posts
          </Link>
        </li>
        <li>
          <Link href="/admin/users" className="hover:bg-amber-300">
            Users
          </Link>
        </li>
      </ul>
    </aside>
  );
}

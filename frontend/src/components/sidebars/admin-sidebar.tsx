import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="bg-sidebar w-64 space-y-4 p-4 text-black">
      <h2 className="text-xl font-bold">Admin</h2>
      <ul className="space-y-2">
        <Link href="/admin">
          <li className="hover:bg-header w-full rounded-sm p-2">Dashboard</li>
        </Link>
        <Link href="/admin/posts">
          <li className="hover:bg-header w-full rounded-sm p-2">Posts</li>
        </Link>
        <Link href="/admin/users">
          <li className="hover:bg-header w-full rounded-sm p-2">Users</li>
        </Link>
      </ul>
    </aside>
  );
}

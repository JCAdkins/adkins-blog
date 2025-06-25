"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CommentCard } from "../cards/comment-card";
import { CommentInput } from "../inputs/comment-input";
import { fetchBlogCommentsPaginated } from "@/lib/db/queries";
import { Comment } from "next-auth";

// const commentsTest = [
//   {
//     id: "95830-39485-34958-89940-49895",
//     content: "This is a test comment.",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     post: "Test post",
//     postId: "d2b9df6f-4076-4a35-a847-722455398992",
//     author: {
//       id: "d2b9df6f-4076-4a35-a847-722455398992",
//       email: "jordan.adkins111@gmail.com",
//       username: "JCAdkins24",
//     },
//     authorId: "d2b9df6f-4076-4a35-a847-722455398992",
//     parent: null,
//     parentId: null,
//     replies: [
//       {
//         id: "95830-39485-34958-89940-49895",
//         content: "This is a test comment.",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         post: "Test post",
//         postId: "d2b9df6f-4076-4a35-a847-722455398992",
//         author: {
//           id: "d2b9df6f-4076-4a35-a847-722455398992",
//           email: "jordan.adkins111@gmail.com",
//           username: "JCAdkins24",
//         },
//         authorId: "d2b9df6f-4076-4a35-a847-722455398992",
//         parent: null,
//         parentId: null,
//         replies: [
//           {
//             id: "95830-39485-34958-89940-49895",
//             content: "This is a test comment.",
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             post: "Test post",
//             postId: "d2b9df6f-4076-4a35-a847-722455398992",
//             author: {
//               id: "d2b9df6f-4076-4a35-a847-722455398992",
//               email: "jordan.adkins111@gmail.com",
//               username: "JCAdkins24",
//             },
//             authorId: "d2b9df6f-4076-4a35-a847-722455398992",
//             parent: null,
//             parentId: null,
//             replies: [],
//             likes: [],
//           },
//         ],
//         likes: [],
//       },
//       {
//         id: "95830-39485-34958-89940-49895",
//         content: "This is a test comment.",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         post: "Test post",
//         postId: "d2b9df6f-4076-4a35-a847-722455398992",
//         author: {
//           id: "d2b9df6f-4076-4a35-a847-722455398992",
//           email: "jordan.adkins111@gmail.com",
//           username: "JCAdkins24",
//         },
//         authorId: "d2b9df6f-4076-4a35-a847-722455398992",
//         parent: null,
//         parentId: null,
//         replies: [],
//         likes: [],
//       },
//     ],
//     likes: [],
//   },
//   {
//     id: "95830-39485-34958-89940-49895",
//     content: "This is a test comment.",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     post: "Test post",
//     postId: "d2b9df6f-4076-4a35-a847-722455398992",
//     author: {
//       id: "d2b9df6f-4076-4a35-a847-722455398992",
//       email: "jordan.adkins111@gmail.com",
//       username: "JCAdkins24",
//     },
//     authorId: "d2b9df6f-4076-4a35-a847-722455398992",
//     parent: null,
//     parentId: null,
//     replies: [],
//     likes: [],
//   },
// ];

export const CommentsSection = ({ blogId }: { blogId: string }) => {
  const [comments, setComments] = useState<globalThis.Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      const fetched = await fetchBlogCommentsPaginated({ blogId, page });
      console.log("fetched: ", fetched);
      setComments((prev) => [...prev, ...fetched.comments]);
      setTotalCount(fetched.totalCount);
      setLoading(false);
    };

    loadComments();
  }, [blogId, page]);

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({totalCount})</h3>
      {session && <CommentInput blogId={blogId} authorId={session.user.id} />}
      <div className="flex flex-col mt-6 gap-4">
        {comments.map((comment: any) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
        {!loading && (
          <button onClick={() => setPage((p) => p + 1)}>Load more</button>
        )}
      </div>
    </section>
  );
};

import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";
export function PostDetail({ post, appData, deleteMutation, updateMutation }) {
  const { data: comments, isLoading } = useQuery({
    queryKey: ["commentData", post.id],
    queryFn: () => fetchComments(post.id),
  });
  if (isLoading) {
    return <h1>loading...</h1>;
  }
  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && (
          <p class className="loading">
            Deleting the post
          </p>
        )}
        {deleteMutation.isError && (
          <p class className="error">
            Error Deleting the post: {deleteMutation.error.toString()}
          </p>
        )}
        {deleteMutation.isSuccess && (
          <p class className="success">
            Post was not deleted
          </p>
        )}
      </div>
      <div>
        <button onClick={() => updateMutation.mutate(post.id)}>
          Update title
        </button>
        {updateMutation.isSuccess && <p>Update title !!</p>}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {comments.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}

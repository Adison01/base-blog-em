import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;
export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (postId)=>deletePost(postId)
  })
  const updateMutation = useMutation({
    mutationFn: (postId)=>updatePost(postId)
  });

  useEffect(()=>{
  let  nextPage = currentPage+1
    queryClient.prefetchQuery({
      queryKey: ["post", nextPage],
      queryFn:  () => fetchPosts(nextPage)
    })
  }, [currentPage, queryClient])
  const { data: appData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['post', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000,
  })

  if (isLoading) {
    return <h1>Data is Loading ...</h1>
  }
  return (
    <>
      <ul>
        {appData.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={
              
              () =>{
                updateMutation.reset();
                deleteMutation.reset();
                setSelectedPost(post)
              } }
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} 
        onClick={() => { setCurrentPage((previousValue) => previousValue - 1) }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => { setCurrentPage((previousValue) => previousValue + 1) }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} appData={appData} deleteMutation={deleteMutation} updateMutation= {updateMutation}/>}
    </>
  );
}

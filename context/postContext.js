import React, { createContext, useState, useContext } from "react";
import axiosInstance from "../utils/axios";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [doctor, setDoctors] = useState([]);
  const [comments, setComments] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/post");
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axiosInstance.get(`/post/${postId}/comments`);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get("/doctors");
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const addComment = async (postId, newComment) => {
    if (newComment.trim() === "") return;
    try {
      const res = await axiosInstance.post(`/comment`, {
        comment: newComment,
        postId: postId,
      });
      if (res.data.success) {
        fetchComments(postId); // Refresh comments after adding a new one
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        fetchPosts,
        addComment,
        fetchDoctors,
        doctor,
        comments,
        fetchComments,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);

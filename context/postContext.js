// src/context/PostContext.js

import React, { createContext, useState, useContext } from "react";
import axiosInstance from "../utils/axios";
import { Alert } from "react-native";
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

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

  const addComment = async (postId, newComment) => {
    if (newComment.trim() === "") return;
    try {
      await axiosInstance.post(`/comment`, {
        comment: newComment,
        postId: postId,
      });
      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <PostContext.Provider value={{ posts, fetchPosts, addComment }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);

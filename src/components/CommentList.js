import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import axiosInstance from "../../utils/axios";
import tw from "twrnc";

export default function CommentList({ postId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/post/${postId}/comments`);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      setError("Error fetching comments");
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeMore = () => {
    setShowAllComments(!showAllComments);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      {comments.slice(0, showAllComments ? comments.length : 2).map((el) => (
        <View key={el._id} style={tw`gap-2`}>
          <Text style={tw`text-sm text-gray-600`}>
            Нэр: {el.createUser.name}
          </Text>
          <Text
            style={tw`text-sm text-blue-400 mt-1 ml-2 border p-2 rounded-sm border-gray-300 mb-5`}
          >
            Сэтгэгдэл: {el.comment}
          </Text>
        </View>
      ))}
      {comments.length > 2 && (
        <Button
          title={showAllComments ? "Show Less" : "See More"}
          onPress={handleSeeMore}
        />
      )}
    </View>
  );
}

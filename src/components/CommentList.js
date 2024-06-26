import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { usePostContext } from "../../context/postContext";

export default function CommentList({ postId }) {
  const { fetchComments, comments } = usePostContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        await fetchComments(postId);
      } catch (err) {
        setError("Error fetching comments");
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [fetchComments, postId]);

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
      {comments.slice(0, showAllComments ? comments.length : 2).map((el, i) => (
        <View key={i} style={tw`gap-2`}>
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

import { View, Text, Button } from "react-native";
function LogoutScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Та гарахдаа итгэлтэй байна уу</Text>
      <Button
        title="Гарах"
        onPress={() => {
          navigation.navigate("Login");
        }}
      />
    </View>
  );
}
export default LogoutScreen;

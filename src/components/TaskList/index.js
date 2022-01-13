import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { Entypo } from "@expo/vector-icons";

export default function TaskList({ data, deleteItem, editItem}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ marginRight: 10 }} onPress={()=>{deleteItem(data.key)}}>
        <Entypo name="trash" size={24} color="#ffff" />
      </TouchableOpacity>
      <View style={{ paddingRight: 10 }}>
        <TouchableWithoutFeedback onPress={()=>{editItem(data)}}>
          <Text style={{ color: "#fff", paddingRight: 10 }}>{data.nome}</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#121212",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
  },
});

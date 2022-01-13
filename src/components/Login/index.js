import React, { useState } from "react";

import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import app from "../../services/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login({changeStatus}) {
  const [type, setType] = useState("Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  function handleLogin() {
    if (type === "Login") {
      // Aqui fazemos o login do usuário
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          changeStatus(user.uid)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage)
        });
    } else {
      //Aqui cadastramos o usuário
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          alert('usuario criado');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage)
        });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Email</Text>
      <TextInput
        style={styles.logInput}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Text>Password</Text>
      <TextInput
        style={styles.logInput}
        placeholder="*******"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity
        style={[
          styles.logAction,
          { backgroundColor: type === "Login" ? "#141414" : "#3ea6f2" },
        ]}
        onPress={handleLogin}
      >
        <Text style={{ color: "#fff" }}>
          {type === "Login" ? "Acessar" : "Cadastrar"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setType(type === "Login" ? "Cadastrar" : "Login")}
      >
        <Text style={{ textAlign: "center" }}>
          {type === "Login" ? "Cadastrar" : "Já possui uma conta?"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  logInput: {
    backgroundColor: "#2121",
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#141414",
    marginBottom: 20,
  },
  logAction: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});

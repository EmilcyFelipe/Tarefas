import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard
} from "react-native";

import Login from "./src/components/Login";
import TaskList from "./src/components/TaskList";

import app from "./src/services/firebase";
import {  
  child,
  getDatabase, 
  onValue, 
  push, 
  ref, 
  set,
} from "firebase/database";
import { getAuth } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([])

  const [newTask, setNewTask] = useState('');

  const database = getDatabase();
  const auth = getAuth();
  

  useEffect(()=>{
    function getUser(){
      if(!user){
        return;
      }
      const dbRef = ref(database, 'tarefas/'+user);
      onValue(dbRef,(snapshot)=>{
        setTasks([]);
        snapshot?.forEach((childItem)=>{
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }
          setTasks(oldTasks => [...oldTasks, data])
        })
        
      },{onlyOnce:true})
      
    }
    getUser();
  },[user])
  
  function handleAdd() {
    if(newTask === ''){
      return;
    }
    let tarefas = ref(database, 'tarefas/'+user);
    let chave = push(tarefas).key;
    tarefas = ref(database,'tarefas/'+user+'/'+chave)
    set(tarefas,{
      nome: newTask
    }).then(()=>{
      let data = {
        key: chave,
        nome: newTask
      };
      setTasks(oldTasks => [...oldTasks, data])
    })
    
    

    Keyboard.dismiss();
    setNewTask('')
  }

  function handleDelete(key) {
    console.log(key);
  }

  function handleEdit(data) {
    console.log("Item clicado", data);
  }

  if (!user) {
    return <Login changeStatus={(user) => setUser(user)} />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerTask}>
        <TextInput onChangeText={(text)=>setNewTask(text)} value={newTask}style={styles.input} placeholder="O que vai fazer hoje?" />
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TaskList
            data={item}
            deleteItem={handleDelete}
            editItem={handleEdit}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: "#f2f6fc",
  },
  containerTask: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#141414",
    height: 45,
  },
  buttonAdd: {
    height: 45,
    backgroundColor: "#141414",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});

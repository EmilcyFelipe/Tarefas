import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
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
  remove, 
  set,
  update,
} from "firebase/database";

import { Feather } from '@expo/vector-icons';


export default function App() {
  const [user, setUser] = useState(null);
  
  const inputRef = useRef(null);
  const [tasks, setTasks] = useState([])

  const [newTask, setNewTask] = useState('');
  const [ key, setKey ] = useState('');

  const database = getDatabase();
  

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

    // Usuario quer editar uma tarefa.
    if(key !== ''){
      let tarefas = ref(database, 'tarefas/'+user+'/'+key)
      update(tarefas,{nome:newTask})
      .then(()=>{
        const tasksIndex = tasks.findIndex((item)=> item.key === key);
        let taskClone = tasks;
        taskClone[tasksIndex].nome = newTask;
        setTasks([...taskClone]);
      })
      Keyboard.dismiss();
      setNewTask('');
      setKey('');
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
    console.log(key)
    let tarefas = ref(database, 'tarefas/'+user+'/'+key);
    remove(tarefas)
    .then(()=>{
      const findTasks = tasks.filter( item => item.key !== key);
      setTasks(findTasks);
    })
  }

  function handleEdit(data) {
    setKey(data.key);
    setNewTask(data.nome);
    inputRef.current.focus();
    
  }

  function cancelEdit(){
    setKey('');
    setNewTask('');
    Keyboard.dismiss();
  }

  if (!user) {
    return <Login changeStatus={(user) => setUser(user)} />;
  }
  return (
    <SafeAreaView style={styles.container}>
      {key!=='' && (<View style={styles.editMessage}>
        <TouchableOpacity onPress={cancelEdit}>
          <Feather name="x-circle" size={24} color="#ff0000" />
        </TouchableOpacity>
        <Text style={{color: '#ff0000', marginLeft: 5}}>Voce está editando uma tarefa</Text>
      </View>)}

      <View style={styles.containerTask}>
        <TextInput ref={inputRef} onChangeText={(text)=>setNewTask(text)} value={newTask}style={styles.input} placeholder="O que vai fazer hoje?" />
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
  editMessage:{
    flexDirection: 'row',
    marginBottom:10
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

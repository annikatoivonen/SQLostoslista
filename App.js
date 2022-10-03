import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, Button, Flatlist } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SQLite from'expo-sqlite';

const db = SQLite.openDatabase('coursedb.db');

export default function App() {

  const [credit, setCredit] = useState('');
  const [title, setTitle] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists course (id integer primary key not null, credits text, title text);');
  }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => { 
      tx.executeSql('insert into course (credits, title) values (?, ?);', [credit, title]);
      }, null, updateList)}

  const updateList = () => {  
    db.transaction(tx => {
      tx.executeSql('select * from course;', [], (_, result) => {
        console.log(result);
      setCourses(result.rows._array);
      }
      );   
    }, null, null);
  }

  const deleteItem = (id) => {
      db.transaction(
      tx => {
        tx.executeSql('delete from course where id = ?;', [id]);
    }, null, updateList)}

    const listSeparator = () => {
      return (
        <View
          style={{
            height: 5,
            width: "80%",
            backgroundColor: "#fff",
            marginLeft: "10%"
          }}
        />
      );
    };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
        style={styles.input}
        placeholder="Product"
        onChangeText={text => setTitle(text)}
        value={title}>
        </TextInput>
        <TextInput
        style={styles.input}
        placeholder="Amount"
        onChangeText={text => setCredit(text)}
        value={credit}>
        </TextInput>
        <Button
        title="SAVE"
        onPress={saveItem}>
        </Button>
        <StatusBar style="auto" />
      </View>
        <Flatlist
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
        <View>
        <Text>{item.title},{item.credit}</Text>
        <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>bought</Text>
        </View>}
        data={courses}
        ItemSeparatorComponent={listSeparator}
        />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1, 
    width: 250,
    padding: 10,
    margin:10,
  },
  
});

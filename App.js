import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, Button, FlatList, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SQLite from'expo-sqlite';

const db = SQLite.openDatabase('coursedb.db');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists list (id integer primary key not null, products text, amount text);');
  }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => { 
      tx.executeSql('insert into list (products, amount) values (?, ?);', [product, amount]);
      }, null, updateList)}

  const updateList = () => {  
    db.transaction(tx => {
      tx.executeSql('select * from list;', [], (_, result) => {
        console.log(result);
      setList(result.rows._array);
      }
      );   
    }, null, null);
  }

  const deleteItem = (id) => {
      db.transaction(
      tx => {
        tx.executeSql('delete from list where id = ?;', [id]);
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
      <View style={{flex: 1, justifyContent:'center'}}>
        <TextInput
        style={styles.input}
        placeholder="Product"
        onChangeText={setProduct}
        value={product}>
        </TextInput>
        <TextInput
        style={styles.input}
        placeholder="Amount"
        onChangeText={setAmount}
        value={amount}>
        </TextInput>
        <Button
        title="SAVE"
        onPress={saveItem}>
        </Button>
        <StatusBar style="auto" />
      </View>
        <View style={{flex:2}}>
        <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
        <View style={{flexDirection:'row'}}>
        <Text>{item.products}, {item.amount}</Text>
        <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}> bought</Text>
        </View>}
        data={list}
        ItemSeparatorComponent={listSeparator}
        />
      </View>
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

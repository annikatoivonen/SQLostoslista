import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, FlatList, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SQLite from'expo-sqlite';
import { Header } from'react-native-elements';
import { Icon, Input, Button, ListItem } from'react-native-elements';

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
            height: 7,
            width: "100%",
            backgroundColor: "#fff",
            borderBottomWidth:0.5,
            padding:10,
          }}
        />
      );
    };

  return (
    <View style={styles.container}>
      <Header
      centerComponent={{text: 'SHOPPING LIST', color: 'white'}}/>
      <View style={{flex: 1, justifyContent:"center"}}>
        <Input
        style={styles.input}
        placeholder="Product"
        label="PRODUCT"
        onChangeText={setProduct}
        value={product}>
        </Input>
        <Input
        label="AMOUNT"
        placeholder="Amount"
        onChangeText={setAmount}
        value={amount}>
        </Input>
        <View style={{flexDirection:"row", justifyContent:"center"}}>
        <Button
        raised icon={{name: 'save', type:'feather', color:'white'}}
        title="SAVE"
        color="black"
        onPress={saveItem}>
        </Button>
        </View>
        <StatusBar style="auto" />
      </View>
        <View style={{flex:2, marginLeft:10, marginRight:10}}>
        <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{flexDirection:'column'}}>
        <Text style={{fontSize:16, fontWeight:'700', marginTop:10}}>{item.products}</Text>
        <Text>{item.amount}</Text>
          </View>
        <Icon 
        style={{marginTop:10}}
        type="foundation"
        name="trash"
        color="red"
        size={30}
        onPress={() => deleteItem(item.id)}></Icon>
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
  },

  
});

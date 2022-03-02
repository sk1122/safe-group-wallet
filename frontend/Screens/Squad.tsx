import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Squad = ({route}) => {
  const groupAddress = ((route || {}).params || {}).emittedAddress;
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const getTransactions = async () => {
      const result = await axios.post(
        'https://api.thegraph.com/subgraphs/name/sk1122/safe-wallet-factory',
        {
          query: `{
            transactions(where: {emitted_address: "${groupAddress}"}) {
              id
              destination
              value
              data
              confirmed_addresses
              rejected_addresses
              executed
              emitted_address
            }
          }`,
          variables: {
            address: '0x47a98db02bfe3596e9b7bf44d7698716f2ff645a',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(result);
      if ((((result || {}).data || {}).data || {}).transactions) {
        setTransactions((((result || {}).data || {}).data || {}).transactions);
      }
    };
    getTransactions();
  }, []);
  return (
    <View>
      <Text style={styles.text}>
        Group: {((route || {}).params || {}).emittedAddress}
      </Text>
      {(transactions || []).length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={({item}) => (
            //   <EachWallet title={item.id} emittedAddress={item.emittedAddress} />
            <View style={styles.item}>
              <Text style={styles.title}>{item.id}</Text>
              <Text style={styles.text}>
                Confirmed {item.confirmed_addresses.length}
              </Text>
              <Text style={styles.text}>
                Rejected {item.rejected_addresses.length}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.text}>NO TRANSACTIONS</Text>
      )}
    </View>
  );
};

export default Squad;

const styles = StyleSheet.create({
  text: {fontSize: 12, color: 'black'},
  item: {
    backgroundColor: '#cccccc',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 22,
  },
});

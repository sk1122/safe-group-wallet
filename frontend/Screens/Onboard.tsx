import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboard = ({navigation, route}) => {
  const [wallets, setWallets] = useState([]);
  const walletAddress = ((route || {}).params || {}).walletAddress || '';
  let connector = ((route || {}).params || {}).walletConnect
    ? useWalletConnect()
    : null;
  useEffect(() => {
    const get_users_safe = async () => {
      const wallets = await axios.post(
        'https://api.thegraph.com/subgraphs/name/sk1122/safe-wallet-factory',
        {
          query: `{
            users(where: {owner: "${walletAddress}"}) {
                id
                owner
                amount_invested
                user_role
                emitted_address
            }
            }`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (wallets.data.data.users.length > 0) {
        setWallets(wallets.data.data.users);
      }
    };
    get_users_safe();
  }, []);

  const createWallet = () => {
    navigation.navigate('Create', {
      walletAddress,
      walletConnect: ((route || {}).params || {}).walletConnect,
    });
  };

  const joinWallet = emittedAddress => {
    if (emittedAddress) {
      navigation.navigate('Squad', {
        emittedAddress,
        walletConnect: ((route || {}).params || {}).walletConnect,
      });
    }
  };

  const logout = () => {
    if (((route || {}).params || {}).walletConnect) {
      connector.killSession();
    } else {
      AsyncStorage.removeItem('key');
    }
    navigation.replace('Login');
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Wallet Address: {walletAddress}</Text>
      <Text style={styles.text}>{'\n Groups:'}</Text>
      {(wallets || []).length === 0 && (
        <Text style={styles.text}>No groups created</Text>
      )}
      <FlatList
        data={wallets}
        renderItem={({item}) => (
          //   <EachWallet title={item.id} emittedAddress={item.emittedAddress} />
          <Pressable
            onPress={() => {
              joinWallet(item.emitted_address);
            }}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.id}</Text>
            </View>
          </Pressable>
        )}
        keyExtractor={item => item.id}
      />
      <Button title={'Create'} onPress={() => createWallet()} />
    </View>
  );
};

export default Onboard;

const styles = StyleSheet.create({
  text: {color: 'black'},
  item: {
    backgroundColor: '#cccccc',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  button: {
    backgroundColor: '#cccccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

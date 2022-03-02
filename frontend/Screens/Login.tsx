import {useWalletConnect} from '@walletconnect/react-native-dapp';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import OpenloginReactNativeSdk, {
  LoginProvider,
  OpenloginNetwork,
} from '@web3auth/react-native-sdk';

import {ethers} from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  center: {alignItems: 'center', justifyContent: 'center'},
  // eslint-disable-next-line react-native/no-color-literals
  white: {backgroundColor: 'white'},
  button: {
    backgroundColor: '#cccccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default function Login({navigation}): JSX.Element {
  const connector = useWalletConnect();
  const [user, setUser] = useState({});
  const [walletAddress, setWalletAddres] = useState(
    '',
    // '0xC42f6B8716b6028abb9Aff51d2FD754729191840',
  );
  const [key, setKey] = useState('');

  const getKey = async () => {
    const k = await AsyncStorage.getItem('key');
    setKey(k);
  };

  useEffect(() => {
    getKey();

    OpenloginReactNativeSdk.init({
      // Your clientId obtained from OpenLogin dashboard.
      clientId:
        'BAXd-XLeEgMU5VMsvaeQN0DleUMfApoGuFIPspHE-w3Ztfzuo1VKQog8KFishtk_299wK5Y2ogEa_AO70-kXRhs',
      // TESTNET is currently broken on iOS.
      network: OpenloginNetwork.MAINNET,
      // redirectUrl only applies for Android SDK, it is designated by iOS SDK in iOS, which is \(bundleId)://auth
      redirectUrl: 'com.safe://auth',
    })
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log('error:', err));
  }, []);

  useEffect(() => {
    if (!!key && !(((connector || {}).session || {}).accounts || [])[0]) {
      const walletAddress = new ethers.Wallet(key);
      navigation.replace('Onboard', {
        walletConnect: false,
        walletAddress: walletAddress.address,
      });
    }
    if (
      !key &&
      connector.connected &&
      (((connector || {}).session || {}).accounts || []).length > 0
    ) {
      navigation.replace('Onboard', {
        walletConnect: true,
        walletAddress: (((connector || {}).session || {}).accounts || [])[0],
      });
    }
  }, [key, connector]);

  useEffect(() => {
    if ((user as any).privKey) {
      AsyncStorage.setItem('key', (user as any).privKey);
      const walletAddress = new ethers.Wallet((user as any).privKey);
      if ((walletAddress as any).address) {
        setWalletAddres((walletAddress as any).address);
      }
    }
  }, [user]);

  useEffect(() => {
    if (walletAddress) {
      navigation.replace('Onboard', {
        walletConnect: false,
        walletAddress,
      });
    }
  }, [walletAddress]);

  const connectWallet = React.useCallback(() => {
    connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  return (((connector || {}).session || {}).accounts || []).length > 0 ? (
    <ActivityIndicator />
  ) : (
    <View style={[StyleSheet.absoluteFill, styles.center, styles.white]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          OpenloginReactNativeSdk.login({})
            .then(result => {
              setUser(result);
            })
            .catch(err => console.log(`error: ${err}`));
        }}>
        <Text>Connect with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={connectWallet}>
        <Text>Connect with WalletConnect</Text>
      </TouchableOpacity>
      {!!connector.connected && (
        <>
          <TouchableOpacity style={styles.button} onPress={killSession}>
            <Text>Kill Session</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

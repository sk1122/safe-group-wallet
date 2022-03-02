import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import '@ethersproject/shims';
import {ethers} from 'ethers';
import {abi} from '../../contracts/createWalletABI';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Create = ({navigation, route}) => {
  const [amount, setAmount] = useState('0.1');
  const [votes, setVotes] = useState('2');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const connector = useWalletConnect();

  const createWallet = async () => {
    setError('');
    setIsLoading(true);
    if (
      Number(amount) &&
      Number(votes) &&
      (members || []).length > 0 &&
      ((route || {}).params || {}).walletAddress
    ) {
      // Connect to the network
      let signer = null;
      if (((route || {}).params || {}).walletConnect) {
        const provider = new WalletConnectProvider({
          rpc: {
            80001: 'https://polygon-mumbai.g.alchemy.com/v2/Oghn-I8AdHSS9w4DD5k6D6-B8nTuva-I',
          },
          chainId: 80001,
          connector: connector,
          qrcode: false,
        });
        await provider.enable();
        const ethers_provider = new ethers.providers.Web3Provider(provider);
        signer = ethers_provider.getSigner();
      } else {
        let key = await AsyncStorage.getItem('key');
        let provider = ethers.getDefaultProvider(
          'https://polygon-mumbai.g.alchemy.com/v2/Oghn-I8AdHSS9w4DD5k6D6-B8nTuva-I',
        );
        signer = new ethers.Wallet(key, provider);
      }
      const contract = new ethers.Contract(
        '0xB31B0320f9918E8ce2f26BCc7F3651a6508E4702',
        abi,
        signer,
      );
      try {
        let wallet = await contract.create_wallet(parseInt(votes), members, {
          value: ethers.utils.parseEther(amount),
        });
        wallet = await wallet.wait();
        setIsLoading(false);

        navigation.replace('Onboard', {
          walletAddress: ((route || {}).params || {}).walletAddress,
          walletConnect: ((route || {}).params || {}).walletConnect,
        });
      } catch (e) {
        console.log(e);
        setError(e.toString());
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setError('Amount, Required votes and atleast one member is mandatory');
    }
  };

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [amount, votes, members]);

  const addMember = () => {
    setMembers(prev => {
      return [...prev, ''];
    });
  };

  const deleteMembers = index => {
    setMembers(prev => {
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <ScrollView style={styles.form}>
      <Text style={styles.text}>Create</Text>

      <View style={styles.field}>
        <Text style={styles.text}>Amount (ETH):</Text>

        <TextInput
          key={'amount'}
          style={styles.textInput}
          placeholder={'Enter Amount'}
          placeholderTextColor={'white'}
          keyboardType="numeric"
          value={amount.toString()}
          onChangeText={setAmount}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.text}>Required Votes:</Text>
        <TextInput
          key={'votes'}
          style={styles.textInput}
          placeholder={'Enter Required Votes'}
          placeholderTextColor={'white'}
          keyboardType="numeric"
          value={votes.toString()}
          onChangeText={setVotes}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.text}>Members:</Text>
        <TextInput
          key={`owner-0`}
          style={styles.membersInput}
          placeholderTextColor={'white'}
          value={((route || {}).params || {}).walletAddress}
          editable={false}
        />
        {Array.from(
          Array((members || []).length > 0 ? (members || []).length : 1),
          (member, index) => (
            <View style={styles.members} key={`view-${index}`}>
              <TextInput
                key={`member-${index}`}
                style={styles.membersInput}
                placeholder={`Enter Member ${index + 1} Address`}
                placeholderTextColor={'white'}
                value={members[index] || ''}
                editable={true}
                onChangeText={text => {
                  setMembers(prev => {
                    let update = [...prev];
                    if (index < update.length) {
                      update[index] = text;
                    } else {
                      update.push(text);
                    }
                    return [...update];
                  });
                }}
              />

              <View style={styles.membersButton} key={`button-view-${index}`}>
                <Button
                  key={`button-${index}`}
                  title=" - "
                  onPress={() => deleteMembers(index)}
                />
              </View>
            </View>
          ),
        )}
        <TouchableOpacity
          onPress={() => {
            addMember();
          }}>
          <Text style={styles.add}>Add member</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Button
          title="Create"
          onPress={() => {
            createWallet();
          }}
        />
        <ActivityIndicator animating={isLoading} size="small" color="#26abff" />
      </View>
      <Text style={styles.danger}>{error || ''}</Text>
    </ScrollView>
  );
};

export default Create;

const styles = StyleSheet.create({
  form: {
    height: '100%',
    // justifyContent: 'center',
  },
  field: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: 'black',
  },
  textInput: {
    width: '100%',
    backgroundColor: '#cccccc',
    color: 'black',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  danger: {
    color: 'red',
  },
  add: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
  members: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  membersInput: {
    padding: 5,
    fontSize: 12,
    width: '90%',
    backgroundColor: '#cccccc',
    color: 'black',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  membersButton: {
    height: 30,
    alignSelf: 'center',
  },
});

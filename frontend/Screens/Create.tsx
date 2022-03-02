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

const Create = ({navigation, route}) => {
  const [amount, setAmount] = useState('0.1');
  const [votes, setVotes] = useState('2');
  const [members, setMembers] = useState([
    ((route || {}).params || {}).walletAddress,
  ]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      let provider = ethers.getDefaultProvider(
        'https://polygon-mumbai.g.alchemy.com/v2/Oghn-I8AdHSS9w4DD5k6D6-B8nTuva-I',
      );

      const signer = new ethers.Wallet(
        ((route || {}).params || {}).walletAddress || '',
        provider,
      );
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
        const walletAddress = new ethers.Wallet(
          ((route || {}).params || {}).walletAddress || '',
        );
        setIsLoading(false);

        navigation.push('Onboard', {
          walletAddress: (walletAddress || {}).address,
          walletConnect: ((route || {}).params || {}).walletConnect,
        });
      } catch (e) {
        console.log(e);
        setError(e.toString());
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setError('Enter amount and required votes');
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
                editable={index == 0 ? false : true}
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
              {index !== 0 && (
                <View style={styles.membersButton} key={`button-view-${index}`}>
                  <Button
                    key={`button-${index}`}
                    title=" - "
                    onPress={() => deleteMembers(index)}
                  />
                </View>
              )}
            </View>
          ),
        )}
        <TouchableOpacity onPress={addMember}>
          <Text style={styles.add}>Add member</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Button title="Create" onPress={createWallet} />
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
    color: 'white',
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
    color: 'white',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  membersButton: {
    height: 30,
    alignSelf: 'center',
  },
});

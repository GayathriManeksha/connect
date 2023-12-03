import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigation = useNavigation();

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleIdChange = (value) => {
    setId(value);
  };

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token stored successfully');
      console.log(token)

      // Decode the token to get user details

      // const decodedToken = jwt_decode(token);
      // const { name, id } = decodedToken;

      // Store user details in AsyncStorage
      // await AsyncStorage.setItem('userId', id);
      // await AsyncStorage.setItem('username', name);

    } catch (error) {
      console.error('Failed to store token', error);
    }
  };

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // const userId = await AsyncStorage.getItem('userId');
      // const username = await AsyncStorage.getItem('username');
      if (token) {
        console.log('Token retrieved successfully');
        return token;
      } else {
        console.log('Token not found');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve token', error);
      return null;
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Failed to remove token', error);
    }
  };

 
  const handleButtonPress = () => {
    axios.post('https://backendshg-0jzh.onrender.com/login', { name, id })
      .then(response => {
        // Handle the response from the server
        // setName({ name });
        // console.log(name);
        console.log(response)
        if (response.data.status) {
          // Login successful, navigate to the next screen
          const token = response.data.token;
          storeToken(token)

          navigation.navigate('list');
        } else {
          console.log('login unsuccessful');
        }
      })
      .catch(error => {
        console.log('error');
      });

  };

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Text style={styles.loginText1}>Login</Text>
        <TextInput
          style={styles.inputname}
          placeholder="Enter Name"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={handleNameChange}
        />
        <TextInput
          style={styles.inputname}
          placeholder="Enter Id"
          placeholderTextColor="#fff"
          value={id}
          secureTextEntry={true}
          onChangeText={handleIdChange}
        />
        <TouchableOpacity style={styles.loginbtn} onPress={handleButtonPress}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background color
    alignItems: 'center',
    justifyContent: 'center',
    width:400,
  },
  label: {
    borderWidth: 2,
    borderColor: '#fff', // White border color
    width: 270,
    height: 500,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputname: {
    width: 243,
    height: 41,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    lineHeight: 18,
    color: '#fff', // White text color
    padding: 10,
    fontSize: 12,
    borderWidth: 0.5,
    borderColor: '#ddd', // Slightly lighter color for borders
    marginTop: 10,
  },
  loginbtn: {
    backgroundColor: '#fff', // White background color
    borderRadius: 10,
    padding: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: 40,
  },
  loginText: {
    color: '#000', // Black text color
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText1: {
    top: -100,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text color
  },
});
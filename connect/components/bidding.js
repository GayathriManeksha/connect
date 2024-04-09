import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from "jwt-decode";

import { useNavigation } from '@react-navigation/native';
import Modal from "./Modal";
import socket from "../utils/socket";

const { width } = Dimensions.get('window');

const Bidding = ({ route }) => {
  const { workerId } = route.params;
  console.log(workerId)
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [uid, setUId] = useState('');
  const [username, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [roomId, setRoomId] = useState('');
  const [uname, setuName] = useState('');
  const [messages, setMessages] = useState([]);
  const [accepted,setAccepted]=useState(false);
  const [label, setLabel] = useState("");
  const [timer, setTimer] = useState(300);
  const [amount, setAmount] = useState(""); 
  const [sub, setSub] = useState(false);
  const generateID = () => Math.random().toString(36).substring(2, 10);

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwtDecode(token);
        console.log("decodeToken",decodedToken)
        setUserName(decodedToken.username);
        setUId(decodedToken.userId);
        console.log("uid", uid)
        console.log("username", username);
      } else {
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Failed to retrieve token', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await retrieveToken();
    };
    fetchData();
  }, []);


  // useEffect(() => {
  //   console.log("Hey")
  //   socket.on('room', (message) => {
  //     console.log(message)
  //   })
  //   socket.on('newMessage', (message) => {
  //     console.log('Received message in the room:', message);
  //     // Handle the received message, e.g., display it in the UI
  //   });
  // }, [socket])

  useEffect(() => {
    console.log("Hey from socket");
    socket.on('newMessage', (newMessage) => {
      console.log('Received message in the room:', newMessage);
      // Handle the received message, e.g., display it in the UI
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    // Cleanup function to unsubscribe from socket
    return () => {
      socket.off('newMessage');
    };
  }, []);

  useEffect(() => {
    async function fetchData(){
      try {
        if (uid) {
          console.log({uid,workerId})
          // const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/emp/chat`,
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/emp/chat`, {
            
            userId: workerId,
            workerId:uid,
          });
          socket.emit("createRoom", response.data.chatId);
          console.log('Chat opened successfully', response.data);
          setRoomId(response.data.chatId);
          setuName(response.data.uName)
          setMessages(response.data.messages)
        }

      } catch (error) {
        console.error('Error adding request:', error);
      }
    }
    fetchData();
  }, [uid])

 

  const closeBid = () => {
    // Implement your logic for closing bid here
    
  };
  const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };

  // Function to handle sending message
  const sendMessage = () => {
    console.log("message",message)
    if (message.trim() !== '') {
      const currentTime = getCurrentTime();
      const newMessage = {
        Fid: generateID(),   
        sender: { role: 'user' },
        contentType: 'text',
        content: { text: message },
        timestamp: currentTime
      };
      console.log("roomId",roomId)
      socket.emit('message', { room_id: roomId, newMessage})
      setMessages([...messages, newMessage]);
      console.log(messages)
      setMessage('');
    }

  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = () => {
    console.log({ amount });
    setLabel(`Amount: $${amount}`);
  };


  setInterval(() => {
    setCurrentTime(getCurrentTime());
  }, 60000);
  const [visible, setVisible] = useState(false);

  const handleAccept=(amt,id)=>{
    setAccepted(true);
    setLabel(amt);
    const currentTime = getCurrentTime();
    const BidData = {
      amount: parseInt(amt) ,
      timestamp:currentTime,
      chatId:id,
      userId: uid,
      workerId,
    };
    // Emit the bid message via socket
    socket.emit('accept', { room_id: roomId, BidData } );

    console.log(accepted);
    setVisible(false);
  }

  const handleReject=()=>{

  }
  const handleConfirm=()=>{
    navigation.navigate('details');
  }

  setInterval(() => {
    setCurrentTime(getCurrentTime());
  }, 60000);
  // const [visible, setVisible] = useState(false);

  const handleCreateBid = () => {
    console.log({ amount });
    setLabel(`Amount: $${amount}`);
    setSub(true);
    const currentTime = getCurrentTime();
    const newBidMessage = {
      id: generateID(),
      sender: { role: 'user' },
      contentType: 'bid',
      content: { bidAmount: parseInt(amount) },
      timestamp: currentTime
    };
    // Emit the bid message via socket
    socket.emit('message', { room_id: roomId, newMessage: newBidMessage },); 
    // Add the bid message to the messages state
    setMessages([...messages, newBidMessage]);
    // Reset the input field and close the modal
    setMessage('');
    setVisible(false);
  };
  const onClose=()=>{}
const closeModal = () => setVisible(false);

return (
  <View style={styles.container}>
    <View style={styles.head}>
      <Text style={styles.heading}>Chat With {uname}</Text>
      <TouchableOpacity style={styles.sendButton} onPress={() => setVisible(true) } disabled={accepted} >
        <Text style={styles.sendButtonText}>Bid</Text>
      </TouchableOpacity>
    </View>
    <View>
      
      {/* <View style={styles.profileIcon}>
        <Text>Profile Icon</Text>
      </View> */}

      {
        accepted &&     
        <View style={styles.popuplabelContainer}>
        <Text style={styles.whiteText}>user accepted the Request</Text>
        <Text style={styles.labelText}> {label}</Text>      
        <View style={styles.acceptRejectContainer}>
            <Pressable style={styles.acceptButton} onPress={handleConfirm}>
              <Text style={styles.modaltext1} >CONFIRM</Text>
            </Pressable>
            <Pressable style={styles.acceptButton} onPress={handleReject}>
              <Text style={styles.modaltext1}>CLOSE</Text>
            </Pressable>
        </View>        
      </View>
      
      }

      <ScrollView style={styles.chatContainer}>
        {messages?.map((msg) => (
          msg.contentType === "text" ? (<View key={msg.id} style={styles.messageContainer}>
            <View style={styles.profileIcon}>
              {/* Profile Icon */}
              {/* You can place your profile icon component here */}
              {/* <Text>Profile Icon</Text> */}
            </View>
            <View style={styles.messageContent}>
              {/* Time */}
              <Text style={styles.timeText}>{msg.timestamp}</Text>
              {/* Message Text */}
              <Text style={styles.messageText}>{msg.content.text}</Text>

            </View>
          </View>) :
          (<View key={msg.id}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>{label}</Text>
                  <Text style={styles.timerText}>
                    Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
                  </Text>
                  <View style={styles.acceptRejectContainer}>
                    <Pressable style={styles.acceptButton} onPress={closeBid}>
                      <Text style={styles.modaltext}>ACCEPT</Text>
                    </Pressable>
                    <Pressable style={styles.rejectButton} onPress={closeBid}>
                      <Text style={styles.modaltext}>REJECT</Text>
                    </Pressable>
                  </View>
                </View> 
            </View>)
        ))}
      </ScrollView>
      {/* Bidding Chat Messages */}

      {visible ? 
      // <Modal setVisible={setVisible} roomId={roomId} /> 
      <View style={styles.modalContainer}>
          <Text style={styles.modalsubheading}>Enter the Amount</Text>
          <TextInput
              style={styles.modalinput}
              placeholder='Amount...'
              onChangeText={(value) => setAmount(value)}
          />

          <View style={styles.modalbuttonContainer}>
              <Pressable style={styles.modalbutton} onPress={handleCreateBid}>
                  <Text style={styles.modaltext}>CREATE</Text>
              </Pressable>
              <Pressable
                  style={[styles.modalbutton, { backgroundColor: "grey" }]}
                  onPress={closeModal}
              >
                  <Text style={styles.modaltext}>CANCEL</Text>
              </Pressable>
          </View>
          
          {/* {label !== "" && (

              <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>{label}</Text>
                  <Text style={styles.timerText}>
                      Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
                  </Text>
                  <View style={styles.acceptRejectContainer}>
                      <Pressable style={styles.acceptButton} onPress={closeModal}>
                          <Text style={styles.modaltext}>ACCEPT</Text>
                      </Pressable>
                      <Pressable style={styles.rejectButton} onPress={closeModal}>
                          <Text style={styles.modaltext}>REJECT</Text>
                      </Pressable>
                  </View>
              </View>
          )} */}
      </View>
      : ""}

      {/* Message Input and Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>

  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  head: {
    backgroundColor: 'white',
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
  },
  profileIcon: {
    marginRight: 10,
    // Profile icon styles
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
    color: 'blue', // Assuming this is for text color
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
    marginLeft: 20, // Add margin to messages to avoid overlap with label
  },
  messageContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 5,
  },
  messageText: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  timeText: {
    marginTop: 0,
    fontSize: 12,
    color: '#888',
    padding: 5,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    bottom: '17%',
    padding: '4%',
    marginTop:50,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  labelContainer: {
    marginTop: 20, // Adjusted margin top to create space between label and messages
    alignItems: "center",
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 10,
    margin:10,
  },
  labelText: {
    fontSize: 18,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  acceptRejectContainer: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  modaltext: {
    color: "#FFF",  
    fontSize: 16,
  },
  modaltext1: {
    color: "white",  
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalsubheading: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalinput: {
    height: 40,
    width: 250,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalbuttonContainer: {
    flexDirection: "row",
  },
  modalbutton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  modaltext: {
    color: "#FFF",
    fontSize: 16,
  }, 
  popuplabelContainer: {
    backgroundColor: 'grey',
    borderRadius: 15,
    margin: 10,
    height: '50%',
    marginTop: '65%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteText: { 
    color: 'white',
    fontSize:16,
    // Additional styles if needed
  }, 
  
});
 

export default Bidding;
import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";

const Bid = ({ setSub }) => {
    const [amount, setAmount] = useState("");
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [label, setLabel] = useState("");
    const closeBid = () => setSub(false);
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

    return (
        <View style={styles.modalContainer}>       
                
        </View>
    );
};

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    labelContainer: {
        marginTop: 20,
        alignItems: "center",
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        paddingVertical: 10,
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
};

export default Bid;
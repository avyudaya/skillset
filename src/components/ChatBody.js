import {
  Card,
  Button,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import Loading from "./Loading";
import ChatModal from "./ChatModal";

export default function ChatBody({
  name,
  ethAddress,
  avatar,
  isEndorsementReq,
  org,
  admin,
}) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState("");

  const handleChange = (e) => setMessage(e.target.value);

  const loadBlockChainData = async () => {
    setLoading(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    var key;
    const ethAddr = ethAddress;
    if (ethAddr < accounts[0]) {
      key = ethAddress + "#" + accounts[0];
    } else {
      key = accounts[0] + "#" + ethAddress;
    }
    await db
      .collection("chats")
      .doc(key)
      .collection("chatmessages")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) =>
        setChats(snapshot.docs.map((doc) => doc.data()))
      );
    setLoading(false);
  };

  useEffect(() => {
    const func = async () => {
      await loadBlockChainData();
    };
    func();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    var key;
    if (ethAddress < account) {
      key = ethAddress + "#" + account;
    } else {
      key = account + "#" + ethAddress;
    }
    setMessage('')
    await db.collection("chats").doc(key).collection("chatmessages").add({
      message: message,
      sender: account,
      receiver: ethAddress,
      timeStamp: new Date(),
    });
    
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage(e);
  };

  return loading ? (
    <Loading />
  ) : (
    <Card width="100%">
      
      <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              overflow: "auto",
              paddingLeft: "4px",
              paddingRight: "4px",
              paddingTop: "10px",
              height: "61vh",
            }}
          >
      {chats?.map((chat, index) => <ChatModal key={index} chat={chat} admin={admin} org={org} account={account} isEndorsementReq={isEndorsementReq}/>)}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: "50px",
          minWidth: "3rem",
        }}
      >
        <Input
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          style={{
            width: "100%",
          }}
          placeholder="Enter text..."
        />
        <Button size="md" colorScheme="pink" variant="ghost" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </Card>
  );
}

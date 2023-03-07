import { CardBody, useDisclosure } from "@chakra-ui/react";
import GetInfoModal from "./GetInfoModal";
const senderDesign = {
    position: "relative",
    fontSize: "1rem",
    padding: "10px",
    backgroundColor: "#c5c6c7",
    color: "black",
    borderRadius: "10px",
    width: "fit-content",
    marginBottom: "23px",
    maxWidth: "60%",
    boxShadow: "inset 0 0 3px black",
    marginLeft: "10px",
    cursor: "pointer",
  };
  
  const receiverDesign = {
    position: "relative",
    fontSize: "1rem",
    padding: "10px",
    backgroundColor: "rgba(0, 128, 128,.4)",
    borderRadius: "10px",
    width: "fit-content",
    marginBottom: "23px",
    marginLeft: "auto",
    color: "white",
    maxWidth: "60%",
    boxShadow: "inset 0 0 3px lightgray",
    marginRight: "10px",
    cursor: "pointer",
  };
  
export default function ChatModal({chat, admin, isEndorsementReq, org, account}){

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
        
        <GetInfoModal
          isOpen={isOpen}
          onClose={onClose}
          info={chat.info}
          admin={admin}
          isEndorsementReq={isEndorsementReq}
          org={org}
        />
      
        <p
            style={account !== chat.sender ? senderDesign : receiverDesign}
            onClick={onOpen}
          >
            {chat.sender !== "none" && (
              <>
                <small>
                  <b
                    style={{
                      color: account !== chat.sender ? "black" : "lightgray",
                      fontSize: "10px",
                      float: "left",
                      marginBottom: "3px",
                      wordBreak: "break-word",
                    }}
                  >
                    {chat.sender}
                  </b>
                </small>
                <br></br>
              </>
            )}
            <span style={{ float: "left" }}>{chat.message}</span>
            <br></br>
            <small
              style={{
                float: "right",
                color: account !== chat.sender ? "black" : "lightgray",
                fontSize: "10px",
              }}
            >
              {new Date(chat.timeStamp?.toDate()).toUTCString()}
            </small>
          </p>
        </>
    )
}
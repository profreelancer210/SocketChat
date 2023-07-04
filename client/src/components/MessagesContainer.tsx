import { useQuery, useSubscription } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MuiLoader } from "../assests/MUI/MuiLoader";
import { useAppContext } from "../context/appContext";
import {
  GET_CHAT_MESSAGES,
  GET_SUBSCRIPTION_MESSAGES,
} from "../graphql/queries/chatQueries";
import SingleMessage from "./SingleMessage";

interface IProps {
  toggleContactInfo: boolean;
}

const MessagesContainer = ({ toggleContactInfo }: IProps) => {
  type IMessage = {
    messageContent: string;
    sentBy?: string;
    sentAt: string;
    messageType: "text" | "image/png" | "image/jpeg" | null;
  };

  const { user, contact } = useAppContext();

  const [chatId, setChatId] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { data: chatData, loading } = useQuery(GET_CHAT_MESSAGES, {
    variables: { users: [user?.id, contact?.id] },
    onCompleted({ getChatMessages }) {
      setMessages(getChatMessages);
      setChatId(getChatMessages[0]?.chatId);
    },

    fetchPolicy: "network-only",
  });

  const { data: subscriptionData } = useSubscription(
    GET_SUBSCRIPTION_MESSAGES,
    {
      variables: { chatId },
    }
  );

  useEffect(() => {
    if (subscriptionData) {
      setMessages([...messages, subscriptionData?.messageCreated]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionData]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Wrapper toggleContactInfo={toggleContactInfo}>
        {loading ? (
          <Loading>
            <MuiLoader />
          </Loading>
        ) : messages.length < 1 ? (
          <NewContactContainer>
            <NewContactMessage>{`You and ${contact?.nickname} are now contacts! Say hello to each other`}</NewContactMessage>
          </NewContactContainer>
        ) : (
          <MessageContainer>
            {chatData &&
              messages?.map((message, index) => {
                return (
                  <div ref={scrollRef} key={index}>
                    <SingleMessage
                      type={
                        user?.id === message?.sentBy
                          ? "in_message"
                          : "out_message"
                      }
                      {...message}
                    />
                  </div>
                );
              })}
          </MessageContainer>
        )}
      </Wrapper>
    </>
  );
};

export default MessagesContainer;

const Wrapper = styled.div<{ toggleContactInfo: boolean }>`
  display: flex;
  width: ${(props) => (props.toggleContactInfo ? "60%" : "100%")};
  height: 80%;
  flex-direction: column;
  justify-content: flex-end;
`;

const MessageContainer = styled.div`
  position: relative;
  overflow-y: scroll;
  margin-bottom: 2rem;
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.15);
  }
  &::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
  }
  padding: 0 5rem;
`;

const Loading = styled.div`
  position: absolute;
  left: 65%;
  top: 50%;
  transform: translateX(-50%, -50%);
`;

const NewContactContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const NewContactMessage = styled.span`
  margin-bottom: 3rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  text-align: center;
  line-height: 25px;
  color: var(--primary-title);
  width: 50%;
`;

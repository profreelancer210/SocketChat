import styled from "styled-components";
import Logo from "../assests/dummy_images/Logo.png";
import { useAppContext } from "../context/appContext";
import {
  MessagesContainer,
  TextInputContainer,
  ChatHeader,
  ContactInfoBar,
  ChatImageUpload,
  DisplayChatImage,
} from "./";
import { useState } from "react";
import { useCloudinary } from "../utils/customHooks";
import { MuiLoader } from "../assests/MUI/MuiLoader";

const ChatsMain = () => {
  const [toggleContactInfo, setToggleContactInfo] = useState(false);
  const { isChatOpen, displayChatImage, user, chatImageUrl } = useAppContext();
  const { imageUrl, setImageUrl, uploadImage, uploadImageLoading } =
    useCloudinary();

  const backgroundImage = user?.backgroundImage;

  const toggleContactInfoHandler = () => {
    setToggleContactInfo(!toggleContactInfo);
  };

  return (
    <>
      {displayChatImage && <DisplayChatImage imageUrl={chatImageUrl} />}
      {imageUrl ? (
        <ChatImageUpload setImageUrl={setImageUrl} imageUrl={imageUrl} />
      ) : (
        <Wrapper>
          {isChatOpen ? (
            <>
              {uploadImageLoading ? (
                <ChatContainer backgroundImage={backgroundImage}>
                  <LoadingContainer>
                    <MuiLoader />
                  </LoadingContainer>
                </ChatContainer>
              ) : (
                <ChatContainer backgroundImage={backgroundImage}>
                  <ContactInfoContainer>
                    <ContactInfoBar
                      toggleContactInfo={toggleContactInfo}
                      toggleContactInfoHandler={toggleContactInfoHandler}
                    />
                  </ContactInfoContainer>
                  <ChatHeader
                    toggleContactInfoHandler={toggleContactInfoHandler}
                  />
                  <MessagesContainer toggleContactInfo={toggleContactInfo} />

                  <TextInputContainer
                    uploadImage={uploadImage}
                    toggleContactInfo={toggleContactInfo}
                    imageUrl={imageUrl}
                  />
                </ChatContainer>
              )}
            </>
          ) : (
            <Container>
              <Image src={Logo} />
              <Title>Messenger App</Title>
              <Text>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet
                facere, error temporibus facilis dolore accusamus? Maxime eum,
                aliquid et vel, ullam sapiente praesentium nam quae inventore,
                ex adipisci quos voluptatem?
              </Text>
            </Container>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default ChatsMain;

const Wrapper = styled.div`
  display: flex;
  width: 70%;
  background-color: var(--main-chat-clr);
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--main-chat-clr);
`;

const Image = styled.img`
  width: 350px;
  height: 250px;
`;

const Text = styled.p`
  margin-top: 1rem;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  width: 70%;
  color: var(--clr-grey-2);
`;

const Title = styled.h1`
  color: var(--chat-logo-title-clr);
  font-size: 32px;
  font-weight: 300;
  line-height: 37.5px;
`;

const ChatContainer = styled.div<{ backgroundImage?: string }>`
  width: 100%;
  overflow: hidden;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const LoadingContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ContactInfoContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: end;
`;

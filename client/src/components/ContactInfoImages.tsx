import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/appContext';
import { GET_CHAT_IMAGES } from '../graphql/queries/chatQueries';

interface Props {
  setTotalImages: React.Dispatch<React.SetStateAction<number>>;
  toggleContactInfo: boolean;
}

const ContactInfoImages = ({ setTotalImages, toggleContactInfo }: Props) => {
  const {
    user,
    contact,
    toggleChatImage,
    toggleChatImageUrl,
    displayChatImage,
  } = useAppContext();
  const [images, setImages] = useState<[]>([]);

  const { data } = useQuery(GET_CHAT_IMAGES, {
    variables: {
      users: [user?.id, contact?.id],
    },
    onCompleted({ getChatImages }) {
      setImages(getChatImages);
      setTotalImages(getChatImages.length);
    },
    skip: !toggleContactInfo,
    pollInterval: 500,
  });

  const onImageClick = (value: string) => {
    if (displayChatImage) {
      toggleChatImageUrl(value);
    } else {
      toggleChatImage();
      toggleChatImageUrl(value);
    }
  };

  return (
    <Wrapper>
      {data &&
        images?.map(({ messageContent }, index) => (
          <ImageList key={index}>
            <Image
              src={messageContent!}
              onClick={() => onImageClick(messageContent)}
            />
          </ImageList>
        ))}
    </Wrapper>
  );
};

export default ContactInfoImages;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  height: 100%;

  overflow-x: auto;
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.15);
  }
  &::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
  }
`;

const ImageList = styled.ul`
  display: flex;
  padding: 0.5rem;
`;

const Image = styled.img`
  width: 50px;
  cursor: pointer;
`;

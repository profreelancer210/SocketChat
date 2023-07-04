import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { useAppContext } from "../context/appContext";
import { ContactInfoImages } from ".";
import { useState } from "react";

interface IProps {
  toggleContactInfo: boolean;
  toggleContactInfoHandler: () => void;
}

const ContactInfoBar = ({
  toggleContactInfo,
  toggleContactInfoHandler,
}: IProps) => {
  const { contact } = useAppContext();
  const [totalImages, setTotalImages] = useState(0);

  return (
    <Wrapper toggleContactInfo={toggleContactInfo}>
      <Header>
        <CloseIcon
          onClick={toggleContactInfoHandler}
          style={{ color: "var(--clr-icon)", cursor: "pointer" }}
        />
        <ContactInfoHeader>Contact info</ContactInfoHeader>
      </Header>
      <ContactImageContainer>
        <ContactImage src={contact?.profileImage} />
        <ContactName>{contact?.nickname}</ContactName>
      </ContactImageContainer>
      <PhoneContainer>
        <Title>Phone Number</Title>
        <AboutInfo>{contact?.phone}</AboutInfo>
      </PhoneContainer>
      <AboutInfoContainer>
        <Title>About</Title>
        <AboutInfo>{contact?.aboutInfo}</AboutInfo>
      </AboutInfoContainer>
      <AboutInfoContainer>
        <Title>Media Shared: ({totalImages || 0})</Title>
        <ContactInfoImages
          setTotalImages={setTotalImages}
          toggleContactInfo={toggleContactInfo}
        />
      </AboutInfoContainer>
    </Wrapper>
  );
};

export default ContactInfoBar;

const Wrapper = styled.div<{ toggleContactInfo: boolean }>`
  width: ${(props) => (props.toggleContactInfo ? "30vw" : "0%")};
  opacity: ${(props) => (props.toggleContactInfo ? "1" : "0")};
  overflow-y: scroll;
  max-height: 95%;
  height: 95%;
  overflow-y: scroll;
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.15);
  }
  &::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
  }
  transition: all 0.2s ease-in-out;
  background-color: var(--clr-grey);
  position: fixed;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  min-height: 8vh;
  border-left: 1px solid var(--chat-left-border);
  align-items: center;
  justify-content: space-evenly;
  width: 50%;
`;

const ContactInfoHeader = styled.p`
  font-size: 18px;
  color: var(--contact-info-header);
`;

const ContactImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--contact-info-background);
  padding: 2rem;
`;
const ContactImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
`;

const ContactName = styled.h2`
  color: var(--contact-info-title);
  font-weight: 500;
  margin-top: 0.5rem;
`;

const AboutInfoContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  background-color: var(--contact-info-background);
  padding: 1rem 2rem;
`;

const PhoneContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  background-color: var(--contact-info-background);
  padding: 1rem 2rem;
`;

const Title = styled.p`
  font-weight: 300;
  margin-bottom: 1rem;
  color: var(--contact-info-title);
`;

const AboutInfo = styled.p`
  font-size: 18px;
  letter-spacing: 1px;
  color: var(--contact-info-about);
  overflow-wrap: break-word;
`;

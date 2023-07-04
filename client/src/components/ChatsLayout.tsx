import styled from 'styled-components';
import ChatsLeftBar from './ChatsLeftBar';
import ChatsMain from './ChatsMain';

const ChatsLayout = () => {
  return (
    <>
      <Wrapper>
        <ChatsLeftBar />
        <ChatsMain />
      </Wrapper>
    </>
  );
};

export default ChatsLayout;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

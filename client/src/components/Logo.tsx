import styled from 'styled-components';
import logo_2 from '../assests/dummy_images/logo_2.png';
const Logo = () => {
  return (
    <Wrapper>
      <LogoImage src={logo_2} />
      <Title>MESSENGER APP</Title>
    </Wrapper>
  );
};

export default Logo;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--app-primary-clr);
`;
const LogoImage = styled.img`
  width: 65px;
`;
const Title = styled.h1`
  color: white;
  margin-left: 0.5rem;
  font-weight: 400;
  letter-spacing: 1px;
`;

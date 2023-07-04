import styled from 'styled-components';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAppContext } from '../context/appContext';
import { MuiMenu } from '../assests/MUI/MuiMenu';
import { useEffect, useState } from 'react';

const UserHeader = () => {
  const { user, logoutUser, toggleProfileEdit } = useAppContext();

  const getStorageTheme = () => {
    let theme = 'light-theme';
    if (localStorage.getItem('theme')) {
      theme = localStorage.getItem('theme')!;
    }
    return theme;
  };
  const [theme, setTheme] = useState(getStorageTheme);

  const toggleTheme = () => {
    setTheme(theme === 'light-mode' ? 'dark-mode' : 'light-mode');
  };

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Wrapper>
      <ImageContainer>
        <Image
          onClick={toggleProfileEdit}
          className='avatar-image'
          src={user?.profileImage}
        />
      </ImageContainer>
      <IconContainer>
        <LogoutIcon className='icon' onClick={logoutUser} />
        <MuiMenu>
          <SettingsIcon className='icon' />
        </MuiMenu>
        {theme === 'light-mode' ? (
          <DarkModeIcon className='icon' onClick={toggleTheme} />
        ) : (
          <LightModeIcon className='icon' onClick={toggleTheme} />
        )}
      </IconContainer>
    </Wrapper>
  );
};

export default UserHeader;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--clr-grey);
  padding: 0.5rem 0;
  transition: all 0.2s;
  align-items: center;
  .icon {
    cursor: pointer;
    align-self: center;
    color: var(--clr-icon);
    &:hover {
      color: var(--clr-icon-2);
    }
  }
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
`;
const Image = styled.img`
  cursor: pointer;
`;

const IconContainer = styled.div`
  display: flex;
  width: 35%;
`;

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAppContext } from '../../context/appContext';
import { useCloudinary } from '../../utils/customHooks';
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE } from '../../graphql/mutations/userMutations';
import { GET_USER } from '../../graphql/queries/userQueries';

interface Props {
  children: React.ReactNode;
}

export const MuiMenu = ({ children }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { imageUrl, uploadImage } = useCloudinary();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const { toggleProfileEdit, logoutUser } = useAppContext();

  const [updateBackgroundImage] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [
      {
        query: GET_USER,
      },
    ],
    variables: {
      backgroundImage: imageUrl,
    },
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onProfileClick = () => {
    handleClose();
    toggleProfileEdit();
  };

  const changeBackgroundHandle = () => {
    if (inputRef) {
      inputRef?.current?.click();
    }
  };

  React.useEffect(() => {
    if (imageUrl) {
      updateBackgroundImage();
      handleClose();
    }
  }, [imageUrl, updateBackgroundImage]);

  const onImageUpload = (file: any) => {
    uploadImage(file);
  };

  const onLogout = () => {
    logoutUser();
    handleClose();
  };

  return (
    <div style={{ background: 'transparent', border: 'none', outline: 'none' }}>
      <Button
        sx={{
          ':hover': { backgroundColor: 'transparent' },
        }}
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {children}
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={onProfileClick}>Profile</MenuItem>
        <MenuItem onClick={changeBackgroundHandle}>Change background</MenuItem>
        <input
          onChange={(e) => onImageUpload(e.target.files)}
          ref={inputRef}
          type='file'
          style={{ display: 'none' }}
        />
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

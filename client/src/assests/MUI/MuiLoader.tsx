import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

export const MuiLoader = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
};

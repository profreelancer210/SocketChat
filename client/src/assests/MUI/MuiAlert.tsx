import { Alert, Stack } from '@mui/material';

type IAlert = {
  type: 'error' | 'warning' | 'info' | 'success';
  children: string | any;
};

export const MuiAlert = ({ type, children }: IAlert) => {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity={type} sx={{ alignSelf: 'center' }}>
        {children}
      </Alert>
    </Stack>
  );
};

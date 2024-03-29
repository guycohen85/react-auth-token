import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import Typography from '@mui/material/Typography';
import Joi from 'joi';
import { name } from '../utils/joiValidations';
import useUser from '../hooks/user/useUser';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import useUpdateUser from '../hooks/user/useUpdateUser';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import PageContainer from 'layout/PageContainer';

const schema = Joi.object({
  firstName: name,
  lastName: name,
});

export default function Profile() {
  const { user } = useUser();
  const { mutateUser, errorMutateUser, isSuccessMutateUser } = useUpdateUser(user?._id);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const {
    formState: { errors, isDirty },
    register,
    handleSubmit,
    reset,
  } = useForm({ resolver: joiResolver(schema) });

  const onSubmit = async (data) => {
    await mutateUser(data);
    reset(data);
  };

  useEffect(() => {
    if (isSuccessMutateUser) {
      setAlert({ type: 'success', message: 'update successful' });
    }
  }, [isSuccessMutateUser]);

  useEffect(() => {
    if (errorMutateUser) {
      setAlert({
        type: 'error',
        message: errorMutateUser.response?.data?.error?.message || errorMutateUser.message, // TODO: return from server the same path
      });
    }
  }, [errorMutateUser]);

  return (
    <PageContainer>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <ChildCareIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              {...register('firstName', { value: user.firstName })}
              helperText={errors.firstName?.message}
              error={!!errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              {...register('lastName', { value: user.lastName })}
              helperText={errors.lastName?.message}
              error={!!errors.lastName}
            />
          </Grid>
          {/* <Grid item xs={12}>
              <TextField fullWidth label="Email Address" value={user.email} disabled />
            </Grid> */}
        </Grid>
        <Button
          type="submit"
          disabled={!isDirty}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update
        </Button>
        {alert.type && <Alert severity={alert.type}>{alert.message}</Alert>}
      </Box>
    </PageContainer>
  );
}

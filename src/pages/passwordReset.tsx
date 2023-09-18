import { Container, Box, Avatar, Typography, TextField, Button, Alert, Snackbar } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useState } from "react";
import { useAuth } from "providers/AuthProvider";

const PasswordReset = () => {
    const [alert, setAlert] = useState({} as any)
    const [openAlert, setOpenAlert] = useState(false)
    const { resetPassword } = useAuth()
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const request = {
            oldPassword: data.get('oldPassword')!.toString(),
            newPassword: data.get('newPassword')!.toString()
        }
        const resp = await resetPassword(request.oldPassword, request.newPassword)
        setOpenAlert(true)
        setAlert(resp)
    };

    const handleClose = () => {
        setOpenAlert(false)
    };

    return (
        <Container component="main" maxWidth="xs" >
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert.status ?? "error"} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Box
                sx={{
                    borderRadius: '16px',
                    boxShadow: 3,
                    padding: 2,
                    backgroundColor: '#b2dfdb',//'#dedede',
                    color:'#004d40',
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, backgroundColor: '#004d40', color:'#e0f2f1'  }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">Password Reset</Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        id="oldPassword"
                        label="Old Password"
                        name="oldPassword"
                        autoComplete="old-password"
                        autoFocus
                    />
                    <TextField
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        name="newPassword"
                        label="New Password"
                        type="password"
                        id="newPassword"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, borderRadius: 16, backgroundColor:'#004d40', color:'#e0f2f1' }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default PasswordReset;
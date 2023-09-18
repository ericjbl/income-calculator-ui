import { Alert, Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, Snackbar, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useState } from "react";
import { useAuth } from "providers/AuthProvider";
import Image from "next/image";

const Login = () => {
    const [alert, setAlert] = useState({} as any)
    const [openAlert, setOpenAlert] = useState(false)

    const { logIn } = useAuth();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const request = {
            username: data.get('email')!.toString(),
            password: data.get('password')!.toString()
        }
        const resp = await logIn(request.username, request.password);
        console.log(resp);
        if(resp.IsAuthenticated) {
            setOpenAlert(false)
        }
        else{
            setOpenAlert(true)
            setAlert(resp)
        }  
    };

    const handleClose = () => {
        setOpenAlert(false)
    };

    return (
        <Container component="main" maxWidth="xs" >
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert.IsAuthenticated ?? "error"} sx={{ width: '100%' }}>
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
                <Image src="/Eligibee-bee.png"  alt="eligibee" height={300} width={300}/>

                {/* <Avatar alt="eligibee" src="/../../public/eligibee.jpg" /> */}
                    {/* <LockOutlinedIcon /> */}
                    {/* sx={{ m: 1, backgroundColor: '#004d40', color:'#e0f2f1'  }} */}
                {/* </Avatar> */}
                <Typography component="h1" variant="h5">Welcome to Eligibee!</Typography>
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
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        
                    />
                    <TextField
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    {/* <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    /> */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, borderRadius: 16, backgroundColor:'#004d40', color:'#e0f2f1' }}
                    >
                        Sign In
                    </Button>
                    {/* <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2" sx={{ color: '#004d40', "&:hover": {backgroundColor:'#00897b'} }}>
                                Forgot password?
                            </Link>
                        </Grid>
                    </Grid> */}
                </Box>

            </Box>


        </Container>

    )
}

(Login as any).requireAuthentication = false

export default Login;
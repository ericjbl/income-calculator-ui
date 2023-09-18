import React, { useState, useContext, useEffect, useCallback} from 'react';
import { useRouter } from 'next/router'
import UserContext from './UserContext';
import { login, refreshToken, passwordReset, logOut } from 'service/IncomeServices';

export function useAuth() {
  return useContext(UserContext);
}

const AuthProvider = ({children, requireAuth}: {children: React.ReactNode, requireAuth: boolean}) => {
    const [user, setUser] = useState({
        IsAuthenticated: false
    });
    const router = useRouter();

    const redirectToLogin = (withPath = true) => {
        router.push(`/login?redirectTo=${router.asPath}`);
    }

    useEffect(() => {
        console.log("useEffect", requireAuth);
        if(requireAuth) {
            let storageUserStr = localStorage.getItem('user');
            console.log(storageUserStr);
            if(storageUserStr === null) {
                redirectToLogin();
            } else {
                let storageUser = JSON.parse(storageUserStr);
                // console.log(window.atob(storageUser.access_token.split('.')[1]))
                // const access_token_exp = JSON.parse(window.atob(storageUser.access_token.split('.')[1])).exp
                // const refresh_token_exp = JSON.parse(window.atob(storageUser.refresh_token.split('.')[1])).exp
                // const currentTime = new Date().getTime()/1000
                // const timeToRefreshToken = access_token_exp - currentTime
                // const refreshTokenTime = refresh_token_exp - currentTime
                // if(timeToRefreshToken <= 0 && refreshTokenTime > 0)  {
                //     console.log('test')
                //     refreshLogIn(storageUser.refresh_token)
                // }
                if(!storageUser.IsAuthenticated) {
                    redirectToLogin();
                } else {
                    setUser(storageUser);
                }
            }
        } 
    },[requireAuth]);

    const refreshLogIn = async (refresh_token: string) => {
        const authData = await refreshToken(refresh_token)
        console.log(authData)
        if(authData.access_token) {
            localStorage.removeItem('user');
            authData.IsAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(authData));
            setUser(authData);
            return authData.access_token
        } else {
            console.log('logout')
            localStorage.removeItem('user');
            setUser({ IsAuthenticated: false });
            redirectToLogin();
        }
    }

    const logIn = async (username: string, password: string) => {
        console.log('login called');
        //call the service passing credential (email and password).
        //In a real App this data will be provided by the user from some InputText components.
        const authData = await login({
            username,
            password,
        });

        if(authData.access_token) {
            authData.IsAuthenticated = true
            window.localStorage.setItem('user', JSON.stringify(authData));
            setUser(authData);
            console.log('test')
            if(!authData.hasLoggedIn) {
                router.push('/passwordReset');
            }
            else {
                let redirectTo = router.query['redirectTo'] ?? '/home';
                if(Array.isArray(redirectTo)) {
                    redirectTo = redirectTo[0];
                }
        
                router.push(redirectTo);

            }
            
        } 
        
        return authData as any; // login failed, this will pass the failure message back to the caller
    };

    const logout = async () => {
        const resp = await logOut();
        if(resp.status === "success") {
            localStorage.removeItem('user');
            setUser({ IsAuthenticated: false });
            redirectToLogin();
        }
    };
    
    const resetPassword = async (oldPassword: string, newPassword: string) => {
        const resp = await passwordReset({ oldPassword, newPassword })
        if (resp. status === "success"){
            router.push('/') 
        } 
        return resp as any; 
    }

    return (
      //This component will be used to encapsulate the whole App,
      //so all components will have access to the Context
      <UserContext.Provider value={{user, logIn, logout, resetPassword, refreshLogIn}}>
        { user?.IsAuthenticated || !requireAuth ? children : "" }
      </UserContext.Provider>
    );
  };

  export default AuthProvider;

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

const AuthVerify = () => {
    const { refreshLogIn } = useAuth();
    
    useEffect(() => {

        setInterval(async () => {
            const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
            if(user) {
                await refreshLogIn(user.refresh_token)
            }
        },1000 * 60 * 19)
    },[])

    return(<></>)
}

export default AuthVerify;
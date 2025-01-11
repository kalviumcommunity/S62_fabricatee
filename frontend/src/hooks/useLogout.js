import axios from "../api/axios";
import useAuth from "./useAuth"

const useLogout = () =>{
    const {setAuth} = useAuth();

    const logout = async () =>{
        try{
            await axios('/api/user/auth/logout', {
                withCredentials: true
            })
            .then(()=>{
                setAuth({loggedIn:false, userId: null, accessToken: false});
                console.log("User Successfully Logged Out");
            })
            .catch((err)=>{
                console.log(err);
            })
        }catch(err){
            console.log(err);
        }
    }

    return logout;
}

export default useLogout;
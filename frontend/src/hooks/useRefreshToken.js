import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const {setAuth} = useAuth();

    const refresh = async() => {
        axios.get('/api/user/auth/refresh', {
            withCredentials: true,
        })
            .then((res)=>{
                setAuth(prev=>({...prev, loggedIn: true, userId: res.data?.userId, accessToken: res.data?.accessToken, isLoading: false, ...res.data}));
                return res.data.accessToken;
            })
            .catch((err)=>{
                console.log("error in refresh token, log in again");
                console.log(err?.response.data?.message);
            })
    }

    return refresh;
}

export default useRefreshToken;
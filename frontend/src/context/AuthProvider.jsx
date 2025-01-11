import { createContext, useEffect, useState } from 'react'

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({loggedIn:false, userId: null, accessToken: false});

    useEffect(()=>{
        console.log(auth);
    }, [auth]);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
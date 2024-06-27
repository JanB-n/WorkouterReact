import { createContext, useEffect, useState } from "react"

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    // const [auth, setAuth] = useState({});
    const [auth, setAuth] = useState({username: JSON.parse(localStorage.getItem("username")), token: JSON.parse(localStorage.getItem("token"))});
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("refresh")));

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
import React ,{useState} from 'react';

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
});

export default function AuthContextProvider(props) {
    const [isAuthenticated , setAuthenticated] = useState(false);

    function loginHandler() {
        setAuthenticated(true);
    }

    return <AuthContext.Provider value={{isAuth:isAuthenticated,login:loginHandler}}> 
        {props.children}
    </AuthContext.Provider>
}
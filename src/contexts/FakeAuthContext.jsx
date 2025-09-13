import { createContext, useContext, useReducer } from "react";

const AuthProvider = createContext()

const FAKE_USER = {
  name: "Maneesh",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
    user: null,
    isAuthenticated: false
}



function reducer(state, action) {
    switch(action.type) {
        case "login": 
            return {...state, user: action.payload, isAuthenticated: true}
        case "logout":
            return {...state, user: null , isAuthenticated: false}
        default:
            throw new Error("Unknown action type")    
    }
}

const AuthContext =({children})=> {

    const [state, dispatch] = useReducer(reducer, initialState)
    const {user, isAuthenticated} = state

    function login (email, password) {
        if(email === FAKE_USER.email){
            dispatch({type:"login", payload: FAKE_USER})
        }
    }

    function logout(){
        dispatch({type:"logout"})
    }

    return  <AuthProvider.Provider value={{user, isAuthenticated, login, logout} }>
                {children}
            </AuthProvider.Provider>
    }


function useAuth() {
    const context = useContext(AuthProvider)
    if (context === undefined){
        throw new Error("AuthContext was used outside AuthProvider")
    }
    return context
}

export {AuthContext, useAuth}
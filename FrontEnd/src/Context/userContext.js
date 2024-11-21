import {  createContext, useContext, useState } from "react";

export const UserContext = createContext();

export const useUserContext = () =>{
  return useContext(UserContext);
}


export const UserContextProvider = ({ children }) => {
  const dummy = localStorage.getItem("authToken");
  console.log(dummy,typeof(dummy))
  const [user,setUser] = useState(localStorage.getItem("authToken") || null);

  return <UserContext.Provider value={{user,setUser}}>
  {children}
  </UserContext.Provider>
}

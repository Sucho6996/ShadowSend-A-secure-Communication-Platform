import { useState } from "react";

const useLogin = () => {
    const [loading,setLoading] = useState(false);

    const login =(phNo,password)=>{
    const success = validate(phNo,password); // client side input validation

    if(!success) return ;

    try{
      console.log(phNo,password);
    } catch(e) {
      console.log(e);
    }
  } 
  return {loading,login};
}

const validate = (phNo,password) => {
  if(!phNo || !password) {
    console.error("No phone number or password");
    return false;
  }

  if(phNo < 1000000000 || phNo > 9999999999) {
    console.error("not a valid phone number")
  }

  

  return true;
}

export default useLogin;

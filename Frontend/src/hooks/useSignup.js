import { useState } from "react";

const useSignup = () => {
    const [loading,setLoading] = useState(false);

    const signup = async (name,phNo,password)=>{

      console.log(name,phNo,password);
    const success = validate(name,phNo,password); // client side input validation

    if(!success) return ;

    try{
      setLoading(true);
      console.log(name,phNo,password);

      const res = await fetch("http://localhost:8080/user/signup",{
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name,phNo,password
        })
      });

      console.log(res);
      const data = await res.json()
      console.log(data.body)

      if(data.error){
        throw new Error(data.error);
      }

    } catch(e) {
      console.error(e.message);
      console.log(e);
    } finally {
      setLoading(false);
    }
  } 
  return {loading,signup};
}

const validate = (name,phNo,password) => {
  if(!name || !phNo || !password) {
    console.error("Some inputs are missing");
    return false;
  }

  if(phNo < 1000000000 || phNo > 9999999999) {
    console.error("not a valid phone number")
  }

  

  return true;
}

export default useSignup;

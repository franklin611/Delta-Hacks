import './Login.css';


import { GoogleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { signInWithPhoneNumber, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleAuthProvider, db } from "../../utils/firebaseConfig";
import React, { useContext, useState } from "react";
import UserContext from "../userContext"

const Login = () => {
    const { user, setUser } = useContext(UserContext);

    const logOutUser = async () => {
        try{
            await signOut(auth);
        }catch (error){
            console.log(error);
        }
    }
    
    const signInUser = async () =>{
        try {
            const googleInfo = await signInWithPopup(auth, googleAuthProvider);
            
            const userObj = {
                id: googleInfo.user.uid,
                name: googleInfo.user.displayName,
                email: googleInfo.user.email
            };
        
              // Fetch the user from Firestore
            const ref = doc(db, "users", userObj.id);
            const snapshot = await getDoc(ref);
        
              if (snapshot.exists()) {
                const userData = snapshot.data();
                setUser({ ...userObj });
              } else {
                await setDoc(ref, { ...userObj });
                setUser({ ...userObj });
              }
        } catch (error) {
            console.log(error);
        }
    }
  
    return (
        <section className="login section">
            <div className='flex flex-col items-center justify-center'>            
                <h1 className='text-lg font-semibold'>Login Here</h1>
                <Button 
                    onClick={signInUser}
                    shape="round" icon={<GoogleOutlined />} size={'large'}>
                    Sign in with Google
                </Button>
                <Button 
                    onClick={logOutUser}
                    shape="round" icon={<GoogleOutlined />} size={'large'}>
                    Sign out of Google
                </Button>
            </div>
        </section>

    );
  };
  
  export default Login;
  
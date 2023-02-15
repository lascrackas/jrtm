import React, { useEffect, useState,useContext } from 'react'
import { collection, query, where, getDocs,getFirestore,onSnapshot } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { UserContext } from '../../Context/UserContext';
import { getAuth} from "firebase/auth";
import Header from '../Header/Header';
import { getFunctions, httpsCallable } from "firebase/functions";
import { Spinner } from '@chakra-ui/react'
const functions = getFunctions();

const firebaseConfig = {
    apiKey: "AIzaSyDKpSfKcaKOMGw287hrqP5Avpced7t7HhU",
    authDomain: "jh-interim-backend-11c5f.firebaseapp.com",
    projectId: "jh-interim-backend-11c5f",
    storageBucket: "jh-interim-backend-11c5f.appspot.com",
    messagingSenderId: "307732447685",
    appId: "1:307732447685:web:83ab3da886f0a1f0bc8bac",
    measurementId: "G-GC80GFM2V2"
  };

  const firebase = initializeApp(firebaseConfig);
  const db = getFirestore(firebase);
  const auth = getAuth();

const Admin = () => {

    const { user, setUser } = useContext(UserContext);
    const [userToValidate,setUserToValidate] = useState([]);
    const [loading,setLoading] = useState(false);

    const validateAgency = (user) => {
        setLoading(true);
        const validateAgcy = httpsCallable(functions, 'validateAgency');
        validateAgcy({userUid:user.id,email:user.email,firstName:user.firstName}).then(()=>{setLoading(false)}).catch(err=>setLoading(false))
    }

    const logout =async () => {
        auth.signOut()
        .then(()=>{
            console.log("logged out")
        } )
        .catch(err=>console.log(err))
    }

    useEffect(()=> {
        const getAgencies = async() => {
            const q = query(collection(db, "users"), where("role", "==", "agence"),where("status", "==", "pending"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const users = []
                querySnapshot.forEach((doc) => {
                    let user = doc.data();
                    user.id = doc.id;
                    users.push(user);
                });
              setUserToValidate(users);
            })
        }
        getAgencies();
    },[])

  return (
    <div>
        <Header section="admin"/>

        <div className='text-center'>
            <p className='text-2xl text-center mt-6'>Liste des agences a valider</p>
            {loading &&<Spinner size='xl' className="mt-2" />}
            {userToValidate.map((user,idx)=>
            (
            <div key={idx} className=" mt-6 text-xl border border-gray-300 p-2 rounded-sm  flex items-center justify-between w-2/4 mx-auto">
                <p className='uppercase'>{user.firstName+" "+user.lastName}</p>
                <button onClick={()=> validateAgency(user)} className='bg-green-400 py-1 px-2 text-white rounded-md'>Valider</button>
                </div>
            ))
            }
        </div>
    </div>
  )
}

export default Admin
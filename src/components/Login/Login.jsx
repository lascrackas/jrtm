import React,{useState} from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth,db } from '../../lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext'; 
import Signup from '../Signup/Signup';


const Login = ({setLoading}) => {

    const { user, setUser } = useContext(UserContext);
    const [loadingconnexion,setLoadingconnexion] = useState(false);
    const [login,setLogin] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

   

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoadingconnexion(true)
        signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in 
            const userUid = userCredential.user.uid;
            const userRef = doc(db, "users", userUid)
            const userSnap = await getDoc(userRef);
            if(userSnap.exists){
                console.log("dmdmdm")
                const userData = userSnap.data();
                userData.id = userSnap.id;
                setUser(userData)
                console.log(userData)
            }else{
                console.log("error")
            }
            setLoading(false);
            setLoadingconnexion(false);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoadingconnexion(false);
        });
      };

  return (
    <div>
        <h3 className='text-center mt-2 text-3xl font-semibold'>JTRM</h3>
        {login==="login" && 
            <div>
    
            <form onSubmit={handleSubmit} className="bg-white mt-4 p-6 w-2/4 mx-auto rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">Connexion</h2>
            <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="email">
                Email
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full border border-gray-400 p-2 rounded-lg"
                placeholder="Entrez votre email"
            />
            </div>
            <div className="mb-4">
            <label className="block font-medium mb-2" htmlFor="password">
                Mot de passe
            </label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full border border-gray-400 p-2 rounded-lg"
                placeholder="Entrez votre mot de passe"
            />
            </div>
            <p className='text-center'>
            <button
                type="submit"
                className="bg-indigo-500  text-white p-2 rounded-lg hover:bg-indigo-600"
            >
                {loadingconnexion?<span>Patientez</span>:<span>Connexion</span>}
            </button>
    
            </p>
            </form>
            <div className='flex items-center space-x-3 w-full justify-center'>
    
            <p className='text-center mt-6'>
                <button onClick={()=>setLogin('agence')} className='bg-black p-2 text-white text-xl rounded-md mb-6'>
                S'inscrire en tant qu'agence
                </button>
            </p>
            <p className='text-center'>
                <button onClick={()=>setLogin('interimaire')} className='bg-black p-2 text-white text-xl rounded-md'>
                S'inscrire en tant qu'interimaire
                </button>
            </p>
            </div>
        </div>
        }
        {login!=="login" &&
            <Signup role={login} setLogin={setLogin}/>
        }
    </div>
  )
}

export default Login
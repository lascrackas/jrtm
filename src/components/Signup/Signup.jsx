import React, { useState,useContext } from 'react'
import { httpsCallable } from "firebase/functions";
import { functions } from '../../lib/firebase';
import { UserContext } from '../../Context/UserContext';
import { doc,getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
const Signup = ({role,setLogin}) => {

  const { user, setUser } = useContext(UserContext);

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [firstName,setFirstName] = useState("")
    const [lastName,setLastName] = useState("")
    const [phone,setPhone] = useState("")
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("")

    const signup = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("")
        const createUser = httpsCallable(functions, 'createUsr');
        createUser({ email,password,firstName,lastName,phone,role })
        .then(async (userCredential) => {
          // Signed in 
          const userUid = userCredential.data.uid;
          const userRef = doc(db, "users", userUid)
          const userSnap = await getDoc(userRef);
          if(userSnap.exists){
              const userData = userSnap.data();
              userData.id = userSnap.id;
              setUser(userData)
          }else{
              console.log("error")
          }
          setLoading(false)
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError("veuillez remplir tout les champs")
          setLoading(false);
      });
    }
    

  return (
    <div>
        <form onSubmit={signup} className="bg-white mt-4 p-6 w-2/4 mx-auto rounded-lg shadow-md">
  <h2 className="text-xl font-medium mb-1">Inscription en tant qu'{role}</h2>
  <div className="mb-1">
    <label className="block font-medium mb-1" htmlFor="email">
      Email
    </label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={event => setEmail(event.target.value)}
      className="w-full border border-gray-400 p-1 rounded-lg"
      placeholder="Entrez votre email"
    />
  </div>
  <div className="mb-1">
    <label className="block font-medium mb-1" htmlFor="password">
      Mot de passe
    </label>
    <input
      id="password"
      type="password"
      value={password}
      onChange={event => setPassword(event.target.value)}
      className="w-full border border-gray-400 p-1 rounded-lg"
      placeholder="Entrez votre mot de passe"
    />
  </div>
  <div className="mb-1">
    <label className="block font-medium mb-1" htmlFor="firstname">
        Prenom
    </label>
    <input
      id="firstname"
      type="text"
      value={firstName}
      onChange={event => setFirstName(event.target.value)}
      className="w-full border border-gray-400 p-1 rounded-lg"
      placeholder="Entrez votre prenom"
    />
  </div>

  <div className="mb-1">
    <label className="block font-medium mb-1" htmlFor="lastname">
      Nom
    </label>
    <input
      id="lastname"
      type="text"
      value={lastName}
      onChange={event => setLastName(event.target.value)}
      className="w-full border border-gray-400 p-1 rounded-lg"
      placeholder="Entrez votre nom"
    />
  </div>
  <div className="mb-1">
    <label className="block font-medium mb-1" htmlFor="phone">
      Numero de telephone
    </label>
    <input
      id="phone"
      type="text"
      value={phone}
      onChange={event => setPhone(event.target.value)}
      className="w-full border border-gray-400 p-1 rounded-lg"
      placeholder="Entrez votre numero de telephone"
    />
  </div>
  <p className='text-center text-red-600 text-lg'>{error}</p>
  <p className='text-center mt-2'>
    <button
        type="submit"
        className="bg-indigo-500 p-2  text-white text-xl rounded-lg hover:bg-indigo-600"
    >
        {loading?<span>Patientez...</span>:<span>Inscription</span>}
    </button>
    <button onClick={()=> setLogin("login")} className='bg-black p-2 ml-2 text-white text-xl rounded-md'>Connexion</button>

  </p>
</form>

    </div>
  )
}

export default Signup
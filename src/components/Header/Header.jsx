import React,{useContext} from 'react'
import { UserContext } from '../../Context/UserContext';
import { auth } from '../../lib/firebase';

const Header = ({section}) => {

  const { user, setUser } = useContext(UserContext);


    const signout = ()=> {
        auth.signOut().then(() => {
            // Sign-out successful.
            console.log("logged out")
            setUser(null);
          }).catch((error) => {
            // An error happened.
            console.log(error)
          });
    }

    return (
        <header className="bg-slate-200 p-6 flex justify-between items-center">
          <h1 className="text-black text-3xl font-bold">JTRM</h1>
          <p className='text-lg capitalize text-black'>{section}</p>
          <button onClick={signout} className=" bg-black text-white font-bold py-2 px-4 rounded">
            Déconnexion
          </button>
        </header>
      );
}

export default Header
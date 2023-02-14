import Login from "./components/Login/Login";
import { useState,useEffect,useContext } from "react";
import { UserContext } from "./Context/UserContext";
import { doc, getDoc,getFirestore } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import Admin from "./components/Admin/Admin";
import Interimaire from "./components/Interimaire/Interimaire";
import Agence from './components/Agence/Agence';
import { auth,db } from "./lib/firebase";
function App() {


  const [user,setUser] = useState([]);
  const [loading,setLoading] = useState(false)

  useEffect(() => {

     const unsubscribe = auth.onAuthStateChanged(async(currentUser) => {
      if (currentUser) {
        const userUid = currentUser.uid;
        const userRef = doc(db, "users", userUid)
            const userSnap = await getDoc(userRef);
            if(userSnap.exists){
                const userData = userSnap.data();
                userData.id = userSnap.id;
                setUser(userData)
                console.log(userData)
        }else{
            console.log("error")
          
        }
        setLoading(false)
      } else {
        setUser(null);
        console.log(null)
        setLoading(false)
      }
    });
    return unsubscribe;
  }, []);
 
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div>
        {loading && <p>Loading</p>}
      </div>
          <div>
            {!loading &&user && user.role==="admin"&&
              <Admin />
            }

            {!loading &&user && user.role==="agence"&&
            <Agence />
            }

          {!loading &&user && user.role==="interimaire"&&
                      <Interimaire />
            }
            {!loading && !user && <Login setLoading={setLoading} />}
        </div>
    </UserContext.Provider>
    /*  <BrowserRouter>
        <Routes>
          <Route path="/" element={<Acceuil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/agence" element={<Agence />} />
          <Route path="/interimaire" element={<Interimaire />} />

        </Routes>
     
     </BrowserRouter> */
    

   /*  <div>
      {user &&
        <Header />
      }
      {user && !loading &&
      <p>Bienvenue {user.email}</p>
      }
      {!user && !loading &&
        <Signup />
      }
      {loading &&
      <p>loading...</p>}
    </div>
    ; */
    )

}

export default App;

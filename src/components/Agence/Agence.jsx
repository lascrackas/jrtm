import React, { useEffect, useState,useContext } from 'react';
import Header from '../Header/Header'
import { collection, query, where, getDocs } from "firebase/firestore";
import { httpsCallable } from 'firebase/functions';
import { db,functions } from '../../lib/firebase';
import { UserContext } from '../../Context/UserContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from '../MyDocument/MyDocument';
import { Spinner, useToast } from '@chakra-ui/react'
const Agence = () => {

  const [allUsers,setAllUsers] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [allContracts,setAllContracts] = useState([]);
  const [loading,setLoading]= useState(false);
  const toast = useToast();
  
  const sendContract = (interimaire) => {

    if(user.status==="pending"){
      toast({
        title: 'Compte en attente',
        description: "Veuillez attendre qu'un admin valide votre compte",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      return
    }
    setLoading(true);
    const sendContrt = httpsCallable(functions, 'sendContract');
    sendContrt({ userName:interimaire.firstName+" "+interimaire.lastName,userUid:interimaire.id,senderUid:user.id, agence:user.firstName+" "+user.lastName,date:new Date().toLocaleDateString()})
    .then(()=>{
      setLoading(false);
      toast({
        title: 'Contrat envoyé',
        description: "Le contrat a été envoyé a "+interimaire.firstName+" "+interimaire.lastName,
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    })
    .catch(()=>setLoading(false))
  }

  useEffect(()=> {

    const fetchContract = async() => {
      const querySnapshot = await getDocs(collection(db, "users",user.id,"contract"));
      const contracts = [];
      querySnapshot.forEach((contract) => {
        // doc.data() is never undefined for query doc snapshots
        let ctrat = contract.data();
        ctrat.id = contract.id;
        contracts.push(ctrat);
      });
      setAllContracts(contracts);
    }
    
    const fetchUsers = async() => {
      const q = query(collection(db, "users"), where("role", "==", "interimaire"));
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let user = doc.data();
        user.id = doc.id;
        users.push(user);
      });
      setAllUsers(users)
    }
    fetchContract();
    fetchUsers();
  },[user.id])

  return (
    <div>
      <Header section="agence"/>
      <div className=''>
        <div className=''>
          <div className='text-2xl italic text-center mb-6'>Contrats envoyés</div>
        {allContracts.map((contract,idx)=> {
          return (
            <div key={idx} className="border text-center border-gray-200 w-2/4 mx-auto  p-3 rounded-md mb-2">
              <p>Client : {contract.client}</p>
              <p>Interimaire: {contract.interimaire}</p>
              <p>date de debut : {contract.startDate}</p>
              <p>date de fin : {contract.endDate}</p>
              <p className='mb-2'>Mission acceptée ? : <span className='font-semibold text-lg'>{contract.accepted}</span></p>
              <div className='flex items-center space-x-2 justify-center'>
              <PDFDownloadLink document={<MyDocument data={contract} />} fileName={contract.interimaire+".pdf"}>
                {({ blob, url, loading, error }) => (<button className='bg-green-400 p-2 rounded-md text-white'>Voir le contrat</button>)}
              </PDFDownloadLink>
              </div>
            </div>
          )
        })}
        </div>
        <div className=' my-4 text-center'>{loading &&<Spinner  size="xl"/>}</div>
        <div className='mb-10'>
      <p className='text-2xl italic text-center mb-6'>Liste des interimaires</p>
          {allUsers.map(user=> {
            return (
            <div className='flex items-center justify-end space-x-6 mt-4 border border-gray-200 w-2/4 mx-auto p-2 rounded-md'>
              <p>{user.email}</p>
              <p><button onClick={()=>sendContract(user)} className='p-2 bg-green-400 text-white'>Envoyer le contrat</button></p>
              </div>
              )
          })} 

        </div>
      </div>
    </div>
  )
}

export default Agence
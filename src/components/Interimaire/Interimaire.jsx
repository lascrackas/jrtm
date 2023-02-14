import React, { useEffect, useState,useContext } from 'react'
import Header from '../Header/Header'
import { collection, query, where, getDocs } from "firebase/firestore";
import { httpsCallable } from 'firebase/functions';
import { db,functions } from '../../lib/firebase';
import { UserContext } from '../../Context/UserContext';
import { Document, Page, Text } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from '../MyDocument/MyDocument';
const Interimaire = () => {


  const { user, setUser } = useContext(UserContext);
  const [allContracts,setAllContracts] = useState([]);

  const accept = (contract) => {
    const acceptContract = httpsCallable(functions, 'acceptContrat');
    acceptContract({ contractId:contract.id,userUid:user.id,senderUid:contract.agenceUid })
    contract.accepted = "oui";
    let newContract = [...allContracts];
    setAllContracts(newContract)

  }

  const refuse = (contract) => {
    const refuseContract = httpsCallable(functions, 'refuseContract');
    refuseContract({ contractId:contract.id,userUid:user.id,senderUid:contract.agenceUid })
    contract.accepted = "non";
    let newContract = [...allContracts];
    setAllContracts(newContract)
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
    fetchContract();
  },[])


  return (
    <div>

<div>
      
    </div>

      <Header section="interimaire"/>
      <div className='text-2xl italic text-center mt-6'>Liste des contrats</div>

      <div className='flex flex-col mt-6 items-center justify-center'>
        {allContracts.map((contract,idx)=> {
          return (
            <div key={idx} className="border text-center border-gray-200 w-2/6 p-3 rounded-md mb-2">
              <p>Client : {contract.client}</p>
              <p>date de debut : {contract.startDate}</p>
              <p>date de fin : {contract.endDate}</p>
              <div className='flex items-center space-x-2 justify-center'>
              <PDFDownloadLink document={<MyDocument data={contract} />} fileName="my-document.pdf">
                {({ blob, url, loading, error }) => (<button className='bg-green-400 p-2 rounded-md text-white'>Voir le contrat</button>)}
              </PDFDownloadLink>
              {contract.accepted==="oui" &&
              <p>ACCEPTE</p>
              }
              {contract.accepted==="non"&&
              <p>REFUSE</p>
              }
              {contract.accepted==="En attente" &&
              <div>
                <button onClick={()=>accept(contract)} className='bg-green-400 p-2 rounded-md text-white'>Accepter</button>
                <button onClick={()=>refuse(contract)} className='bg-red-400 p-2 rounded-md text-white'>Refuser</button>
              </div>
              }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Interimaire
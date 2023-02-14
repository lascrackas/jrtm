const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const { v4: uuidv4 } = require('uuid');
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
/* exports.addUserToFirestore = functions.auth.user().onCreate((user) => {
    return admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName
    });
  }); */

  exports.createUsr = functions.https.onCall((data,context) => {

    return admin.auth().createUser({
        email: data.email,
        emailVerified: true,
        password: data.password,
        displayName: data.firstName+' '+data.lastName,
        disabled: false,
    }).then(
        async(userRecord) => {
            
            //update your db 
            let status ="";
            if(data.role==="agence")status="pending"
            else status="active"
            await admin.firestore().collection("users").doc(userRecord.uid).set({
                email:data.email,
                firstName:data.firstName,
                lastName:data.lastName,
                status:status,
                role:data.role

            })
            return userRecord;
        }).catch((error) => {
            console.log(error);
            return error
        });
    });


   exports.validateAgency = functions.https.onCall((data,context)=> {
        const agencyRef = admin.firestore().collection('users').doc(data.userUid);
        return agencyRef.update({status:"active"});
   })

   exports.sendContract = functions.https.onCall(async(data,context)=> {
    const senderRef = admin.firestore().collection("users").doc(data.senderUid); 
    const userRef = admin.firestore().collection("users").doc(data.userUid);
    const id = uuidv4();
    await senderRef.collection("contract").doc(id).set({
        agence:data.agence,
        agenceUid:data.senderUid,
        interimaire:data.userName,
        date:data.date,
        client:"McDonalds",
        startDate:"15/02/2023",
        endDate:"16/02/2023",
        accepted:"En attente"
    })
    return userRef.collection("contract").doc(id).set({
        agence:data.agence,
        agenceUid:data.senderUid,
        interimaire:data.userName,
        date:data.date,
        client:"McDonalds",
        startDate:"15/02/2023",
        endDate:"16/02/2023",
        accepted:"En attente"
    })
   })

   exports.acceptContrat = functions.https.onCall((data,context)=> {
    const contractUserRef = admin.firestore().collection("users").doc(data.userUid).collection('contract').doc(data.contractId);
    const contractSenderRef = admin.firestore().collection("users").doc(data.senderUid).collection('contract').doc(data.contractId);
    return contractUserRef.update({
        accepted:'oui'
    }).then(()=> {
        return contractSenderRef.update({
            accepted:'oui'
        }); 
    })
   })


   exports.refuseContract = functions.https.onCall(async(data,context)=> {
    const contractUserRef = admin.firestore().collection("users").doc(data.userUid).collection('contract').doc(data.contractId);
    const contractSenderRef = admin.firestore().collection("users").doc(data.senderUid).collection('contract').doc(data.contractId);
    await contractUserRef.update({
        accepted:'non'
    }); 
    return contractSenderRef.update({
        accepted:'non'
    }); 
   })
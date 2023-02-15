import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
/* const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
}); */

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
  },
  logo: {
    width: 100,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
  },
  value: {
    fontSize: 12,
    marginTop: 5,
  },
});

// Create Document Component
const MyDocument = ({data}) => (
/*   <Document>
    <Page size="A4" style={styles.page}>
    <View style={{}}>
        <Text>{data.agence}</Text>
        <Text>{data.date}</Text>
      </View>
      <View style={styles.section}>
        <Text>Client : {data.client}</Text>
      </View>
      <View style={styles.section}>
        <Text>Date de debut :{data.startDate}</Text>
      </View>
      <View style={styles.section}>
        <Text>Date de fin : {data.endDate}</Text>
      </View>
      <View>
        <Text>Mission acceptée :{data.accepted}</Text>
      </View>
    </Page>
  </Document> */

<Document>
<Page size="A4" style={styles.page}>

  {/* Ajout du nom de la société d'intérim */}
  <Text style={styles.title}>{data.agence}</Text>

  {/* Ajout de la date du jour */}
  <Text style={styles.value}>{data.date}</Text>

  {/* Ajout du nom du client */}
  <Text style={styles.label}>Nom du client :</Text>
  <Text style={styles.value}>{data.client}</Text>

  {/* Ajout du nom de l'intérimaire */}
  <Text style={styles.label}>Nom de l'intérimaire :</Text>
  <Text style={styles.value}>{data.interimaire}</Text>

  {/* Ajout de la date de début de la mission d'intérim */}
  <Text style={styles.label}>Date de début de la mission :</Text>
  <Text style={styles.value}>{data.startDate}</Text>

  {/* Ajout de la date de fin de la mission d'intérim */}
  <Text style={styles.label}>Date de fin de la mission :</Text>
  <Text style={styles.value}>{data.endDate}</Text>

  <Text>Mission acceptée :{data.accepted}</Text>

</Page>
</Document>
);

export default MyDocument;
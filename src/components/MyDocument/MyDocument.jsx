import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = ({data}) => (
  <Document>
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
  </Document>
);

export default MyDocument;
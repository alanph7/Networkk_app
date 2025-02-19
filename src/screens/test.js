import axiosInstance from "../../utils/axios";
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';


export default function Test() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/users/');
      setData(response.data);
    } catch (err) {
      setError(err.message);
      Alert.alert(
        'Network Error',
        'Could not connect to the server. Please check:\n\n' +
        '1. Your device and computer are on the same network\n' +
        '2. The backend server is running\n' +
        '3. The IP address is correct'
      );
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text>Networkk</Text>
          )}
        />
      )}
    </View>
  );
}
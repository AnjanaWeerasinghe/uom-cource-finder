import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.btn} onPress={() => dispatch(logoutUser())}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 24, fontWeight: '700' },
  email: { color: '#777', marginTop: 6 },
  btn: { backgroundColor: '#ef4444', padding: 12, borderRadius: 8, marginTop: 20 },
  btnText: { color: '#fff', fontWeight: '700' },
});

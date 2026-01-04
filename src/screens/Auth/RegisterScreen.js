import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../utils/validation';
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/authSlice";

export default function RegisterScreen({ navigation }) {
  const { control, handleSubmit } = useForm({
    defaultValues: { name: '', email: '', password: '' },
    resolver: yupResolver(registerSchema),
  });


const dispatch = useDispatch();
const onSubmit = data => dispatch(registerUser(data));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join us today</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange } }) => (
          <TextInput style={styles.input} placeholder="Name" value={value} onChangeText={onChange} />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange } }) => (
          <TextInput style={styles.input} placeholder="Email" value={value} onChangeText={onChange} />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    marginBottom: 8, 
    textAlign: 'center',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  input: { 
    borderWidth: 1.5, 
    borderColor: '#e2e8f0',
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  btn: { 
    backgroundColor: '#2563eb', 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 8,
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

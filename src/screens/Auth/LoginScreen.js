import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { error, loading } = useSelector(state => state.auth);

  const { control, handleSubmit } = useForm({
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = data => dispatch(loginUser(data));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
          />
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

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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
    marginBottom: 20,
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  linkText: {
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 15,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
});

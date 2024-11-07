import React, { useState } from 'react';
import { SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import logo from '../../assets/snack-icon.png';
import styles from '../styles/loginStyles';

const Login = ({ setLogged }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    setErrorMessage('');

    if (username.trim() === '' || password.trim() === '') {
      setErrorMessage('Por favor, preencha todos os campos.');
      setLogged(false)
      return;
    }

    if(username.trim() !== 'Admin' || password.trim() !== 'Admin'){
      setErrorMessage('Login ou senha incorretos.');
      setLogged(false)
      return;
    }
    setLogged(true);
  };

  return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        
        <View style={styles.formContainer}>
          <Image source={logo} style={styles.image} />
          <View style={styles.groupInputs}>
            <Text style={styles.text}>Login</Text>
            <TextInput 
              style={styles.input} 
              value={username}
              onChangeText={setUsername}
              placeholder="Digite seu login"
            />
            <Text style={styles.text}>Senha</Text>
            <TextInput 
              style={styles.input} 
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              secureTextEntry
            />
          </View>
          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <AntDesign name='login' size={24} color='black' />
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  );
};

export default Login;

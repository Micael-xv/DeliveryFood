import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function CadastroScreen({navigation}: {navigation: any}) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const nave = useNavigation();
  const handleCadastro = async () => {
    if (!username || !name || !cpf || !phone || !email || !password || !terms) {
      Alert.alert('Erro', 'Preencha todos os campos e concorde com os termos!');
      return;
    }

    try {
      console.log('Enviando dados:', {
        username,
        name,
        cpf,
        phone,
        email,
        password,
      });

      const response = await axios.post('http://192.168.68.113:3333/users/register', {
        username,
        name,
        cpf,
        phone,
        email,
        password,
      });

      console.log('Resposta da API:', response.data);

      if (response.data.success) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao cadastrar usuário!');
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer cadastro.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setTerms(!terms)} style={styles.checkbox}>
          {terms && <View style={styles.checkboxChecked} />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Eu concordo com os termos e condições</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => nave.navigate('Login')}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submitButton, !terms && styles.disabledButton]} onPress={handleCadastro} disabled={!terms}>
          <Text style={styles.buttonText}>Concluir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    width: 16,
    height: 16,
    backgroundColor: '#007BFF',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 16,
    backgroundColor: '#1565C0',
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    padding: 16,
    backgroundColor: 'green',
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
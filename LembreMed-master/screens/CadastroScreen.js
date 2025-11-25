import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AppThemeContext } from '../App';
import styles from './CadastroScreen.styles';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { scheme, fontSize } = useContext(AppThemeContext);

  const cadastrar = () => {
    if (nome.trim() && email.includes('@') && senha.length >= 6) {
      alert(`Cadastrado com sucesso!, ${nome}!`);
      navigation.navigate('BoasVindas', { nomeUsuario: nome });
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#222' : '#E8F5E9' }] }>
      <Text style={[styles.title, { fontSize, color: scheme === 'dark' ? '#fff' : '#2E7D32' }]}>Cadastro</Text>

      <TextInput
        style={[styles.input, { fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Nome"
        onChangeText={setNome}
        value={nome}
      />

      <TextInput
        style={[styles.input, { fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}
        placeholder="E-mail"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={[styles.input, { fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Senha (mín. 6 caracteres)"
        secureTextEntry
        onChangeText={setSenha}
        value={senha}
      />

      <TouchableOpacity style={styles.button} onPress={cadastrar}>
        <Text style={[styles.buttonText, { fontSize }]}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tem conta? Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}

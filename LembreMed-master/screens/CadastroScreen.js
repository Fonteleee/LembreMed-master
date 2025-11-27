
// Tela de cadastro e perfil do usuário
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import AppThemeContext from '../AppThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './CadastroScreen.styles';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  let { scheme, fontSize } = useContext(AppThemeContext);
  if (Platform.OS === 'web') scheme = 'light';

  // Busca dados do usuário salvo
  useEffect(() => {
    const buscarUsuario = async () => {
      const usuarioSalvo = await AsyncStorage.getItem('usuario');
      if(usuarioSalvo){
        const usuario = JSON.parse(usuarioSalvo);
        setNome(usuario.nome);
        setEmail(usuario.email);
      }
    };
    buscarUsuario();
  }, []);

  // Função para cadastrar usuário
  const cadastrar = async () => {
    if (nome.trim() && email.includes('@') && senha.length >= 6) {
      await AsyncStorage.setItem('usuario', JSON.stringify({ nome, email, senha }));
      alert(`Cadastrado com sucesso!, ${nome}!`);
      navigation.navigate('TelaPrincipal', { nomePaciente: nome });
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  };

  // Render da tela de cadastro/perfil
  return (
    <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#222' : '#f7f7f7' }] }>
      <Text style={[styles.title, { fontSize, color: scheme === 'dark' ? '#fff' : '#1976d2', fontWeight: 'bold' }]}>Perfil</Text>
      <Text style={{ fontSize, color: '#222', marginBottom: 8 }}>Nome: {nome}</Text>
      <Text style={{ fontSize, color: '#222', marginBottom: 8 }}>Email: {email}</Text>
      <TextInput
        style={[styles.input, { fontSize, color: '#222' }]}
        placeholder="Nome"
        onChangeText={setNome}
        value={nome}
      />
      <TextInput
        style={[styles.input, { fontSize, color: '#222' }]}
        placeholder="E-mail"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={[styles.input, { fontSize, color: '#222' }]}
        placeholder="Senha (mín. 6 caracteres)"
        secureTextEntry
        onChangeText={setSenha}
        value={senha}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: '#43a047', marginTop: 10 }]} onPress={cadastrar}>
        <Text style={{ color: '#fff', fontSize, fontWeight: 'bold' }}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

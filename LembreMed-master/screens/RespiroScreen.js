import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import AppThemeContext from '../AppThemeContext';

export default function RespiroScreen({ navigation }) {
  const { scheme: initialScheme, fontSize } = useContext(AppThemeContext);
  let scheme = initialScheme;
  if (Platform.OS === 'web') {
    scheme = 'light';
  }
  const animation = useRef(new Animated.Value(1)).current;
  const [fase, setFase] = useState('Inspire');
  const [contador, setContador] = useState(4);

  useEffect(() => {
    let timeout;
    if (fase === 'Inspire') {
      Animated.timing(animation, { toValue: 1.5, duration: 4000, useNativeDriver: true }).start();
      timeout = setTimeout(() => { setFase('Segure'); setContador(7); }, 4000);
    } else if (fase === 'Segure') {
      timeout = setTimeout(() => { setFase('Expire'); setContador(8); }, 7000);
    } else if (fase === 'Expire') {
      Animated.timing(animation, { toValue: 1, duration: 8000, useNativeDriver: true }).start();
      timeout = setTimeout(() => { setFase('Inspire'); setContador(4); }, 8000);
    }
    return () => clearTimeout(timeout);
  }, [fase]);

  useEffect(() => {
    let interval;
    if (contador > 0) {
      interval = setInterval(() => setContador(c => c - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [contador]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: scheme === 'dark' ? '#222' : '#f7f7f7' }}>
      <Text style={{ fontSize: fontSize + 8, marginBottom: 24, color: scheme === 'dark' ? '#fff' : '#1976d2', fontWeight: 'bold' }}>Respire</Text>
      <Animated.View style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: '#4caf50', opacity: 0.7, transform: [{ scale: animation }], justifyContent: 'center', alignItems: 'center', marginBottom: 32 }} />
      <Text style={{ fontSize: fontSize + 4, color: '#222', marginBottom: 12 }}>{fase}</Text>
      <Text style={{ fontSize: fontSize + 2, color: '#222', marginBottom: 24 }}>{contador > 0 ? contador : ''}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#1976d2', padding: 12, borderRadius: 24 }}>
        <Text style={{ color: '#fff', fontSize: fontSize }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

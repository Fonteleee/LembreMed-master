import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appearance, useColorScheme } from 'react-native';
import React, { createContext, useState } from 'react';
import * as Notifications from 'expo-notifications';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import TelaPrincipalScreen from './screens/TelaPrincipalScreen';
import AdicionarRemedioScreen from './screens/AdicionarRemedioScreen';
import BoasVindasScreen from './screens/BoasVindasScreen';
import HistoricoScreen from './screens/HistoricoScreen';
import RespiroScreen from './screens/RespiroScreen';

const Stack = createNativeStackNavigator();

export const AppThemeContext = createContext();

export default function App() {
  const scheme = useColorScheme();
  const [fontSize, setFontSize] = useState(18); // fonte padrão, pode ser alterada pelo usuário

  return (
    <AppThemeContext.Provider value={{ scheme, fontSize, setFontSize }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Entrar' }}
          />
          <Stack.Screen
            name="Cadastro"
            component={CadastroScreen}
            options={{ title: 'Cadastrar' }}
          />
          <Stack.Screen
            name="AdicionarRemedio"
            component={AdicionarRemedioScreen}
            options={{ title: 'Novo Remédio' }}
          />

          <Stack.Screen
            name="TelaPrincipal"
            component={TelaPrincipalScreen}
            options={{ title: 'Tela Principal' }}
          />
          <Stack.Screen
            name="BoasVindas"
            component={BoasVindasScreen}
            options={{ title: 'Boas Vindas' }}
          />
          <Stack.Screen
            name="Historico"
            component={HistoricoScreen}
            options={{ title: 'Histórico' }}
          />
          <Stack.Screen
            name="Respiro"
            component={RespiroScreen}
            options={{ title: 'Respire' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppThemeContext.Provider>
  );
}

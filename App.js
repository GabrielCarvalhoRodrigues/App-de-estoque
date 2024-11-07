import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InventoryView from './src/views/InventoryView';
import Login from './src/views/login';
import MenageInventory from './src/views/MenageInventory';

const Stack = createNativeStackNavigator();

const App = () => {
  const [logged, setLogged] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={logged ? "Inventory" : "Login"}>
        {logged ? (
          <>
            <Stack.Screen 
              name="Inventory" 
              options={{ headerShown: false }}
            >
              {(props) => <InventoryView {...props} setLogged={setLogged} />} 
            </Stack.Screen>
            <Stack.Screen 
              name="ManageInventory" 
              component={ManageInventory} 
              options={{ title: 'Gerenciar Estoque' }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            options={{ headerShown: false }}
          >
            {(props) => <Login {...props} setLogged={setLogged} />} 
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

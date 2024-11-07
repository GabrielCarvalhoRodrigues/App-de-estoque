import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ActionButton from '../../components/ActionButton';
import logo from "../../assets/snack-icon.png";
import styles from '../styles/inventoryStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const InventoryView = ({ setLogged, navigation }) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [inventoryDate, setInventoryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  function onDateChange(event, selectedDate) {
      if (event.type === 'set') {
        const currentDate = selectedDate || inventoryDate;
        setInventoryDate(currentDate);
      }
      setShowDatePicker(false);
    }

  const formattedDate = `${inventoryDate.getDate().toString().padStart(2, '0')}/${(inventoryDate.getMonth() + 1).toString().padStart(2, '0')}/${inventoryDate.getFullYear()}`;

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const addItem = () => {
    setErrorMessage('');
    const price = parsePrice(itemPrice);
    const quantity = parseInt(itemQuantity);
    if (itemName.trim() && !isNaN(price) && price > 0 && quantity > 0) {
      if (unit) {
        const newItem = { 
          key: items.length.toString(), 
          name: itemName, 
          quantity: quantity, 
          price, 
          itemDate: formattedDate,
          unit: unit
        };
        
        setItems([...items, newItem]);
  
        navigation.navigate('ManageInventory', { item: newItem });
  
        setItems([]);
  
        setInventoryDate(new Date());
        setItemName('');
        setItemPrice('');
        setItemQuantity('');
        setUnit('');
      } else {
        setErrorMessage('Por favor, selecione a unidade de medida.');
      }
    } else {
      setErrorMessage('Por favor, preencha todos os campos.');
    }
  };

  const deleteItem = (itemKey) => {
    setItems(items.filter(item => item.key !== itemKey));
  };

  const incrementQuantity = (itemKey) => {
    setItems(items.map(item => item.key === itemKey ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decrementQuantity = (itemKey) => {
    setItems(items.map(item => item.key === itemKey && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const calculateTotalValue = () => {
    const totalValue = items.reduce((total, item) => total + (item.quantity * item.price), 0);
    return formatPrice(totalValue);
  };

  const parsePrice = (price) => {
    return parseFloat(price.replace(/\./g, '').replace(',', '.'));
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <View style={styles.brandContainer}>
          <Image source={logo} style={styles.imageContainer} />
          <Text style={styles.companyName}>Empresa</Text>
        </View>
        <ActionButton icon='menu' onPress={toggleModal} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Menu</Text>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>DashBoard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => {
              Alert.alert('Atenção', 'Deseja mesmo sair desta pagina?', [
                {
                  text: 'Não',
                  style: 'cancel',
                },
                {
                  text: 'Sim',
                  onPress: () => {
                    toggleModal();
                    navigation.navigate('ManageInventory');
                  },
                },
              ]);
            }}>
              <Text style={styles.modalButtonText}>Estoque</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => {
              Alert.alert('Atenção', 'Deseja mesmo sair?', [
                {
                  text: 'Não',
                  style: 'cancel',
                },
                { text: 'Sim', onPress: () => { setLogged(false); toggleModal(); } }
              ]);
            }}>
              <Text style={styles.modalButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.formContainer}>
        <Text style={styles.header}>Gerenciamento de Estoque</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Data do inventário"
            value={formattedDate}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={inventoryDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Nome do item"
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          style={styles.input}
          placeholder="Preço do item (R$)"
          value={itemPrice}
          onChangeText={setItemPrice}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Unidades"
          value={itemQuantity}
          onChangeText={setItemQuantity}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={unit}
          onValueChange={(itemValue) => setUnit(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecionar unidade" value="" />
          <Picker.Item label="Quilos (kg)" value="kg" />
          <Picker.Item label="Litros (L)" value="L" />
          <Picker.Item label="Gramas (g)" value="g" />
        </Picker>

        {errorMessage !== '' && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.buttonText}>Adicionar Item</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name} (Quantidade: {item.quantity}, Preço: R$ {formatPrice(item.price)})</Text>
            <Text style={styles.itemText}>{item.itemDate}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => incrementQuantity(item.key)} style={styles.quantityButton}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => decrementQuantity(item.key)} style={styles.quantityButton}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem(item.key)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default InventoryView;

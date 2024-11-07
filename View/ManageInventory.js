import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, Modal, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import logo from "../../assets/snack-icon.png";
import styles from '../styles/ManageInventoryStyles';

const ManageInventory = ({ route }) => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemUnit, setItemUnit] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (route.params?.item) {
      const existingItem = items.find(item => item.key === route.params.item.key);
      if (!existingItem) {
        setItems(prevItems => [...prevItems, route.params.item]);
      }
    }
  }, [route.params?.item]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(item.price.toString());
    setItemUnit(item.unit);
    setItemQuantity(item.quantity.toString());
    toggleModal();
  };

  const saveEditedItem = () => {
    Alert.alert(
      'Atenção',
      'Você realmente deseja salvar as alterações?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Salvar',
          onPress: () => {
            if (itemName.trim() && itemPrice.trim() && itemUnit.trim() && itemQuantity.trim()) {
              const updatedItem = {
                ...editingItem,
                name: itemName,
                price: parseFloat(itemPrice.replace(',', '.')),
                unit: itemUnit,
                quantity: parseInt(itemQuantity),
              };
  
              setItems(items.map(item => (item.key === editingItem.key ? updatedItem : item)));
              toggleModal();
              clearForm();
            } else {
              Alert.alert('Erro', 'Preencha todos os campos corretamente.');
            }
          },
        },
      ]
    );
  };

  const deleteItem = (itemToDelete) => {
    Alert.alert(
      'Atenção',
      `Você realmente deseja deletar ${itemToDelete.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          onPress: () => setItems(items.filter(item => item.key !== itemToDelete.key)),
        },
      ]
    );
  };

  const incrementQuantity = (key) => {
    setItems(items.map(item => 
      item.key === key ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQuantity = (key) => {
    setItems(items.map(item => 
      item.key === key && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const clearForm = () => {
    setEditingItem(null);
    setItemName('');
    setItemPrice('');
    setItemUnit('');
    setItemQuantity('');
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <View style={styles.brandContainer}>
          <Image source={logo} style={styles.imageContainer} />
          <Text style={styles.Itenestoque}>ITENS EM ESTOQUE</Text>
        </View>
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name} (Quantidade: {item.quantity}, Preço: {formatPrice(item.price)})
            </Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => incrementQuantity(item.key)} style={styles.quantityButton}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => decrementQuantity(item.key)} style={styles.quantityButton}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem(item)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.key}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <TextInput 
            placeholder="Nome do Item"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />
          <TextInput 
            placeholder="Preço do Item"
            value={itemPrice}
            onChangeText={setItemPrice}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <TextInput 
            placeholder="Quantidade"
            value={itemQuantity}
            onChangeText={setItemQuantity}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput 
            placeholder="Unidade"
            value={itemUnit}
            onChangeText={setItemUnit}
            style={styles.input}
          />
          <TouchableOpacity style={styles.modalButton} onPress={saveEditedItem}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageInventory;

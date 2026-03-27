// SearchBar.js
import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const SearchBar = ({onSearch}) => {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (text) => {
    setInputValue(text);  // Update local state
    onSearch(text);       // Notify parent of the change
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        {/* search Icon */}
        <Icon name="search1" size={20} color="black" style={styles.icon} />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search for Contact"
          value={inputValue}
          onChangeText={handleInputChange} // Update input and trigger onSearch
        />
        {/* cross Icon */}
        {inputValue.length > 0 && (
          <Entypo
            name="cross"
            size={20}
            color="black"
            style={styles.icon}
            onPress={() => {
              setInputValue('');
            }}
          />
        )}
      </View>
    </View>
  );
};

export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    marginTop: 15,
  },
  searchBar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#d9dbda',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    width: '90%',
  },
  icon: {
    marginLeft: 10,
  },
});

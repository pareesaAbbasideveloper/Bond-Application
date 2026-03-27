import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

const CategoryMenu = ({changeCategory}) => {
  const [selectedCategory, setSelectedCategory] = useState('All'); // Track selected category

  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // Update selected category
    changeCategory(category); // Call the parent function
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
      }}>
      {['All', 'Friends', 'Family', 'Network'].map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.contacttypebuton,
            selectedCategory === category
              ? {backgroundColor: '#FA8055'} // Orange for selected
              : {backgroundColor: '#e9e9e8'}, // Default background
          ]}
          onPress={() => handleCategoryChange(category)}>
          <Text
            style={{
              color: selectedCategory === category ? 'white' : 'black', // White for selected, black otherwise
              textAlign: 'center',
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
            }}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CategoryMenu;

const styles = StyleSheet.create({
  contacttypebuton: {
    width: '22%',
    textAlign: 'center',
    borderRadius: 10,
    paddingVertical: 5,
  },
});

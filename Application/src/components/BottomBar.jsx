import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcons from 'react-native-vector-icons/AntDesign';
import {useIsFocused} from '@react-navigation/native';

const BottomBar = ({navigation, callFunction, onContactRedirect}) => {
  const switchScreen = location => {
    navigation.navigate(location);
  };

  // Get the current route name
  const {routes, index} = navigation.getState();
  const currentRoute = routes[index].name;

  function handleClick() {
    console.log(currentRoute);
    if (currentRoute == 'Contact') {
      callFunction(true);
    } else {
      onContactRedirect(true); // Call the function passed from the Main component
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        borderTopWidth: 1,
        paddingHorizontal: 20,
        borderTopColor: '#d9d9d9',
      }}>
      {/* Home Button */}
      <TouchableOpacity onPress={() => switchScreen('Main')}>
        <Icon
          style={[
            styles.BottomIcon,
            currentRoute === 'Main' && styles.activeIcon, // Highlight if active
          ]}
          name="home"></Icon>
        <Text
          style={[
            styles.BottomText,
            currentRoute === 'Main' && styles.activeText, // Highlight if active
          ]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Contacts Button */}
      <TouchableOpacity onPress={() => switchScreen('Contact')}>
        <AntIcons
          style={[
            styles.BottomIcon,
            currentRoute === 'Contact' && styles.activeIcon,
          ]}
          name="contacts"></AntIcons>
        <Text
          style={[
            styles.BottomText,
            currentRoute === 'Contact' && styles.activeText,
          ]}>
          Contacts
        </Text>
      </TouchableOpacity>

      {/* Add Button */}
      <TouchableOpacity
        style={{
          borderRadius: 80,
        }}
        onPress={() => handleClick()}>
        <AntIcons
          style={[
            styles.BottomIcon,
            {
              backgroundColor: '#e47f5b',
              color: 'white',
              padding: 15,
              borderRadius: 80,
            },
          ]}
          name="plus"></AntIcons>
      </TouchableOpacity>

      {/* Support Button */}
      <TouchableOpacity onPress={() => switchScreen('Support')}>
        <AntIcons
          style={[
            styles.BottomIcon,
            currentRoute === 'Support' && styles.activeIcon,
          ]}
          name="questioncircleo"></AntIcons>
        <Text
          style={[
            styles.BottomText,
            currentRoute === 'Support' && styles.activeText,
          ]}>
          Support
        </Text>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity onPress={() => switchScreen('Profile')}>
        <AntIcons
          style={[
            styles.BottomIcon,
            currentRoute === 'Profile' && styles.activeIcon,
          ]}
          name="user"></AntIcons>
        <Text
          style={[
            styles.BottomText,
            currentRoute === 'Profile' && styles.activeText,
          ]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  BottomIcon: {
    fontSize: 25,
    marginHorizontal: 'auto',
    color: 'black',
  },
  BottomText: {
    fontSize: 10,
  },
  activeIcon: {
    color: '#e47f5b', // Highlighted icon color
  },
  activeText: {
    color: '#e47f5b', // Highlighted text color
  },
});

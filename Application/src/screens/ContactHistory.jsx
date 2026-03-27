import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ContactImage from '../assests/contactImage.png';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ContactHistory = ({navigation, route}) => {
  const {data} = route.params; // Access the passed data here
  console.log(data);
  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon size={20} name="arrow-back" style={{color: '#FA8055'}}></Icon>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins',
              marginVertical: 'auto',
              color: 'black',
              marginLeft: 5,
            }}>
            Contact History
          </Text>
        </View>
      </View>
      <Image
          source={data.profilePic ? {uri: data.profilePic} : ContactImage}
        style={{
          width: 100,
          height: 100,
          borderRadius: 100,
          marginHorizontal: 'auto',
          marginTop: 30,
        }}></Image>
      <Text
        style={{
          fontFamily: 'Poppins-Medium',
          fontSize: 15,
          marginHorizontal: 'auto',
          marginTop: 10,
          color: 'black',
        }}>
        {data.name}
      </Text>
      <View>
        {data.lastContacted.map(e => {
          const dateOnly = e.split('T')[0];

          return (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderBottomColor: '#D7D7D7',
              }}>
              <AntDesign
                size={16}
                name="message1"
                style={{color: '#FA8055', marginRight: 5}}></AntDesign>

              <Text
                style={{color: '#6D6D6D', fontSize: 14, fontFamily: 'Poppins'}}>
                {dateOnly}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ContactHistory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfafa',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 5,
    fontSize: 18,
    color: '#FA8055',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#222222',
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  container: {
    backgroundColor: '#fcfafa',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 5,
    fontSize: 18,
    color: '#FA8055',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#222222',
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    borderColor: '#D7D7D7',
    borderWidth: 1,
  },
  dropdownItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  contacttypebuton: {
    backgroundColor: '#e9e9e8',
    width: '22%',
    textAlign: 'center',
    color: 'black',
    borderRadius: 10,
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});

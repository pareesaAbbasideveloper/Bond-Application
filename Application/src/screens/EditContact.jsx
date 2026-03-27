import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import {Dropdown} from 'react-native-element-dropdown';
import AntIcons from 'react-native-vector-icons/AntDesign';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import Contact from '../assests/contactImage.png';
import axios from 'axios';
import loadAndDecodeToken from '../components/LoadAndDecodeToken';
import {BASE_URL} from '../API/API';
import AlertBox from '../components/AlertBox';
import {Modal} from 'react-native';
import Loading from '../components/Loading';
const EditContact = ({navigation, route}) => {
  const [fetchData, setFetchData] = useState(route.params.data);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState();
  const [success, setSuccess] = useState();
  const [emojis, setEmojis] = useState([
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569963/Open_Peeps_-_Avatar_1_ynvevj.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/image_8_kfwpcq.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/Open_Peeps_-_Avatar_4_pwmvpn.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/Open_Peeps_-_Avatar_3_rzzceb.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/Open_Peeps_-_Avatar_jfxy7a.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/Open_Peeps_-_Avatar_2_tpp8lo.png',
  ]);
  const [selectedEmojis, setSelectedEmojis] = useState(fetchData.profilePic);

  const handleEmojiSelect = emoji => {
    setSelectedEmojis(emoji);
  };
  const switchScreen = (location, value) => {
    navigation.navigate(location, {data: value});
  };
  const toggleShowAlert = stateChange => {
    setShowAlert(stateChange);
    console.log(updatedData.data.data);
    switchScreen('ContactProfile', updatedData.data.data);
  };

  const [contactNumber, setContactNumber] = useState(
    route.params.data.contactNumber,
  );
  const [decodeData, setDecodeData] = useState();

  const [visibleDropdown, setVisibleDropdown] = useState({});
  const [isSelected, setSelection] = useState(false);
  const [recurringTime, setRecurringTime] = useState(
    fetchData.recurring.recurringTime,
  );
  const [recurringCustomTime, setRecurringCustomTime] = useState(
    fetchData.recurring.customDays,
  );
  const [customDays, setCustomDays] = useState(null);

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const data = [
    {label: 'Everyday', value: '0'},
    {label: 'Every 15 Days', value: '0.5'},
    {label: 'Every 1 month', value: '1'},
    {label: 'Every 2 month', value: '2'},
    {label: 'Every 3 month', value: '3'},
    {label: 'Custom Days', value: '10'},
  ];

  const toggleDropdown = displayName => {
    setVisibleDropdown(prev => ({
      ...prev,
      [displayName]: !prev[displayName],
    }));
  };
  const [email, setEmail] = useState(fetchData.email);
  //for react native date open
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(fetchData.category);

  // Define the category value that should trigger the orange background

  const [socialMedia, setSocialMedia] = useState(fetchData.socialMedia || ['']); // Initialize with existing links or a single empty input
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Function to handle changes in each input
  const handleSocialMediaChange = (text, index) => {
    const newSocialMedia = [...socialMedia];
    newSocialMedia[index] = text;
    setSocialMedia(newSocialMedia);
  };

  // Function to add a new input field
  const handleAddMoreLinks = () => {
    setSocialMedia([...socialMedia, '']); // Add an empty string to the array
  };

  // Function to get background color based on the selected category
  const getBackgroundColor = category => {
    return selectedCategory === category ? '#FA8055' : 'white'; // Orange if matched, white otherwise
  };

  if (fetchData.dateOfBirth) {
    var birthday = fetchData.dateOfBirth.split('T')[0];
  } else {
    var birthday = 'Not Available';
  }
  useEffect(() => {
    const handleLoadAndDecode = async () => {
      try {
        const decoded = await loadAndDecodeToken(); // Assuming loadAndDecodeToken does not require any parameters
        setDecodeData(decoded); // Assuming you want to log the decoded token
      } catch (error) {
        console.error('Error loading and decoding token:', error);
      }
    };
    handleLoadAndDecode();
  }, []);

  const EditContactDone = async () => {
    console.log({
      ContactID: fetchData._id,
      contactNumber: contactNumber,
      email: email,
      category: selectedCategory,
      recurring: recurringTime,
      socialMedia: socialMedia,
    });
    setLoading(true);
    const token = decodeData.token;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/editContacts`,
        {
          profilePic:selectedEmojis,
          ContactID: fetchData._id,
          contactNumber: contactNumber,
          email: email,
          category: selectedCategory,
          recurring: recurringTime,
          socialMedia: socialMedia,
          customDays: customDays,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.status);
      setUpdatedData(response);
      setLoading(false);
      setSuccess(true);
      setShowAlert(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = item => {
    setRecurringTime(item.value);
    setIsFocus(false);

    if (item.value === '10') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon style={styles.icon} name="arrow-back-outline" />
        </TouchableOpacity>
      </View>
      <Image
          source={selectedEmojis ? {uri: selectedEmojis} : Contact}
        style={{
          width: 100,
          height: 100,
          borderRadius: 100,
          marginHorizontal: 'auto',
        }}></Image>
      <Text
        style={{
          fontFamily: 'Poppins-Medium',
          fontSize: 15,
          marginHorizontal: 'auto',
          marginTop: 10,
          color: 'black',
        }}>
        {fetchData.name}
      </Text>
      <View style={{marginTop: 20}}>
        <Text style={{fontFamily: 'Poppins', color: 'black', marginBottom: 10}}>
          Select Emojis
        </Text>
        <FlatList
          data={emojis}
          horizontal
          renderItem={({item}) => (
            <TouchableOpacity
              style={
                selectedEmojis.includes(item)
                  ? styles.selectedEmoji
                  : styles.emoji
              }
              onPress={() => handleEmojiSelect(item)}>
              <Image
                source={{uri: item}}
                style={{width: 50, height: 50}}></Image>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
        <Text style={{fontFamily: 'Poppins', color: 'black'}}>
          Phone Number
        </Text>
        <TextInput
          value={String(contactNumber)} // Fallback to empty string if undefine
          onChangeText={text => setContactNumber(text)}
          style={{
            padding: 5,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#F2F2F2',
            marginTop: 5,
          }}></TextInput>
      </View>
      <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
        <Text style={{fontFamily: 'Poppins', color: 'black'}}>Email</Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          style={{
            padding: 5,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#F2F2F2',
            marginTop: 5,
          }}
          placeholder="example@gmail.com"></TextInput>
      </View>
      <View style={{marginTop: 20}}>
        <View>
          <Text style={{fontSize: 14, fontFamily: 'Poppins', color: '#222222'}}>
            Group
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 5,
              marginBottom: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('Friends');
              }}
              style={[
                styles.contacttypebuton,
                {backgroundColor: getBackgroundColor('Friends')}, // Orange if selectedCategory is "Friends"
              ]}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 14,
                }}>
                Friends
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('Family');
              }}
              style={[
                styles.contacttypebuton,
                {backgroundColor: getBackgroundColor('Family')}, // Orange if selectedCategory is "Family"
              ]}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 14,
                }}>
                Family
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('Network');
              }}
              style={[
                styles.contacttypebuton,
                {backgroundColor: getBackgroundColor('Network')}, // Orange if selectedCategory is "Network"
              ]}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 14,
                }}>
                Network
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={{fontSize: 14, fontFamily: 'Poppins', color: '#222222'}}>
            Get Notified
          </Text>
          {/* <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              tintColors={{true: '#F15927', false: 'F15927'}}
            />
            <Text
              style={{
                marginVertical: 'auto',
                fontSize: 14,
                fontFamily: 'Poppins',
                color: '#000000',
              }}>
              Repeating
            </Text>
          </View> */}
        </View>
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          onChange={handleChange}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={
            !isFocus
              ? recurringTime === 0
                ? 'Everyday'
                : recurringTime === 0.5
                ? 'Every 15 Days'
                : recurringTime === 10
                ? `Every ${recurringCustomTime || 'Custom'} Days`
                : `${recurringTime} Months`
              : '...'
          }
          searchPlaceholder="Search..."
          search={false}
          value={recurringTime}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          renderLeftIcon={() => (
            <AntIcons
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />

        {showCustomInput && (
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter custom number of days"
              keyboardType="numeric"
              value={customDays}
              onChangeText={setCustomDays}
            />
          </View>
        )}
      </View>
      <View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Poppins',
            color: '#222222',
            marginBottom: 10,
            marginTop: 20,
          }}>
          Birthdate{' '}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',

            padding: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e3e3d7',
          }}
          onPress={() => setOpen(true)}>
          <AntIcons
            style={styles.icon}
            color={'#e3e3d7'}
            name="calendar"
            size={20}
          />
          <Text style={{fontSize: 14, marginLeft: 5}}>{birthday}</Text>
        </TouchableOpacity>
        {/* <View style={{flexDirection: 'row'}}>
          <CheckBox
            value={isSelected}
            onValueChange={setSelection}
            size={10}
            tintColors={{true: '#F15927', false: 'F15927'}}
          />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Poppins',
              color: '#000000',
              marginVertical: 'auto',
            }}>
            Get notified in their birthday{' '}
          </Text>
        </View> */}
      </View>

      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          marginTop: 20,
          marginBottom: 30,
        }}>
        <Text style={{fontFamily: 'Poppins', color: 'black'}}>
          Social Media Link
        </Text>
        {socialMedia.map((link, index) => (
          <TextInput
            key={index}
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
              color: 'black',
            }}
            placeholder={`Social Media Link ${index + 1}`}
            value={link}
            onChangeText={text => handleSocialMediaChange(text, index)}
          />
        ))}

        <TouchableOpacity onPress={handleAddMoreLinks}>
          <Text
            style={{
              fontFamily: 'Poppins',
              color: '#FA8055',
              fontSize: 12,
              marginLeft: 'auto',
              marginTop: 10,
            }}>
            + Add More Links
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          EditContactDone();
        }}
        style={{
          marginBottom: 40,
          backgroundColor: '#FA8055',
          padding: 12,
          borderRadius: 10,
        }}>
        <Text style={{marginHorizontal: 'auto', color: 'white'}}>
          Save Changes
        </Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={showAlert}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}>
        <AlertBox
          callFunction={toggleShowAlert}
          title={'Your contact information was successfully edited.'}
          description={
            'Your contact information has been successfully updated in our records.'
          }
          success={success}
        />
      </Modal>
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EditContact;

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

  input: {
    height: 40,
    borderColor: '#e3e3d7',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  emoji: {
    padding: 20,
    margin: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedEmoji: {
    padding: 20,
    margin: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: '#d0ebff',
  },
});

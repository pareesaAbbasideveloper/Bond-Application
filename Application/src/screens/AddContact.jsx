import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntIcons from 'react-native-vector-icons/AntDesign';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import loadAndDecodeToken from '../components/LoadAndDecodeToken';
import axios from 'axios';
import {BASE_URL} from '../API/API';
import Loading from '../components/Loading';
import ContactAdded from '../components/ContactAdded';

const AddContact = ({navigation}) => {
  const [token, setToken] = useState(null);
  const [decodeData, setDecodeData] = useState();
  const [showAddContact, setShowAddContact] = useState(false);
  const [visibleDropdown, setVisibleDropdown] = useState({});
  const [isSelected, setSelection] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [socialMediaLinks, setSocialMediaLinks] = useState(['']); // State for social media links
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [numberError, setNumberError] = useState();
  const [emailError, setEmailError] = useState('');
  const [customDays, setCustomDays] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [emojis, setEmojis] = useState([
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569963/Open_Peeps_-_Avatar_1_ynvevj.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/image_8_kfwpcq.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/Open_Peeps_-_Avatar_4_pwmvpn.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/Open_Peeps_-_Avatar_3_rzzceb.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/Open_Peeps_-_Avatar_jfxy7a.png',
    'https://res.cloudinary.com/dmv503tlb/image/upload/v1736569962/Open_Peeps_-_Avatar_2_tpp8lo.png',
  ]);
  const [selectedEmojis, setSelectedEmojis] = useState('https://res.cloudinary.com/dmv503tlb/image/upload/v1736569963/Open_Peeps_-_Avatar_1_ynvevj.png');
  useEffect(() => {
    const handleLoadAndDecode = async () => {
      try {
        const decoded = await loadAndDecodeToken();
        setDecodeData(decoded);
      } catch (error) {
        console.error('Error loading and decoding token:', error);
      }
    };
    handleLoadAndDecode();
  }, []);

  const data = [
    {label: 'Everyday', value: '0'},
    {label: 'Every 15 Days', value: '0.5'},
    {label: 'Every 1 month', value: '1'},
    {label: 'Every 2 month', value: '2'},
    {label: 'Every 3 month', value: '3'},
    {label: 'Custom Days', value: '10'},
  ];

  const handleEmojiSelect = emoji => {
    
      setSelectedEmojis(emoji);
    
  };

  const validatePhoneNumber = number => {
    const phoneRegex = /^\+?[0-9]*$/; // Only allows numbers with an optional leading '+'
    if (!phoneRegex.test(number)) {
      setNumberError(
        'Please enter only numbers and an optional "+" at the beginning',
      );
    } else {
      setNumberError('');
    }
  };

  // Function to validate email
  const validateEmail = input => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
    if (!emailRegex.test(input)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleAddContact = async () => {
    // Run validation for the current phone number and email before submission
    validatePhoneNumber(phoneNumber);
    validateEmail(email);

    // Check if there are any errors
    if (numberError || emailError) {
      console.warn('Please fix validation errors before submitting');
      return; // Stop the function if there are errors
    }
    setLoading(true);
    const token = decodeData.token;
    const userId = decodeData.decodedToken._id;
    const contactInfo = {
      name: `${firstName} ${lastName}`,
      contactNumber: phoneNumber,
      profilePic:selectedEmojis,
      profileImage:selectedEmojis,
      email: email,
      socialMedia: socialMediaLinks, // Pass the array of links
      category: group,
      date: date,
      recurring: {
        date: Date.now(),
        recurringTime: value,
        customDays: customDays,
      },
      dateOfBirth: date,
    };
    console.log({
      userId,
      contactInfo,
    });
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/addContact`,
        {
          userId,
          contactInfo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLoading(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setGroup('');
      setPhoneNumber('');
      setSocialMediaLinks(['']); // Reset the links to the initial state
      setShowAddContact(true);
    } catch (error) {
      console.error('Error adding contact', error);
      setLoading(false);
    }
  };

  const handleAddMoreLinks = () => {
    setSocialMediaLinks([...socialMediaLinks, '']); // Add a new empty string for the new input field
  };

  const handleLinkChange = (index, text) => {
    const updatedLinks = [...socialMediaLinks];
    updatedLinks[index] = text; // Update the link at the specific index
    setSocialMediaLinks(updatedLinks);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.mainHeader}
        onPress={() => navigation.goBack()}>
        <Icon style={styles.icon} name="arrow-back-outline" />
        <Text style={styles.iconText}>Add New Contact</Text>
      </TouchableOpacity>
      <View style={{marginTop: 20}}>
        <Text style={{fontFamily: 'Poppins', color: 'black'}}>Select Emojis</Text>
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
              <Image source={{ uri: item }} style={{width:100 ,height:100}}></Image>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            First Name *
          </Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={text => setFirstName(text)}
          />
        </View>
        <View style={{flexDirection: 'column', width: '48%'}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            Last Name *
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={text => setLastName(text)}
          />
        </View>
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
            {['Friends', 'Family', 'Network'].map(groupName => (
              <TouchableOpacity
                key={groupName}
                style={[
                  styles.contacttypebuton,
                  group === groupName && {backgroundColor: '#d3d3d3'},
                ]}
                onPress={() => setGroup(groupName)}>
                <Text style={styles.contactTypeText}>{groupName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View>
          <Text style={{fontSize: 14, fontFamily: 'Poppins', color: '#222222'}}>
            Get Notified
          </Text>
        </View>
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search={false}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Repeating Options' : '...'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            if (item.value === '10') {
              setShowCustomInput(true);
            } else {
              setShowCustomInput(false);
            }
          }}
          renderLeftIcon={() => (
            <AntIcons
              style={[
                styles.icon,
                {marginRight: 5, marginLeft: 5, fontSize: 24},
              ]}
              color={isFocus ? 'blue' : 'black'}
              name="calendar"
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
      <View style={{marginTop: 20}}>
        <Text style={styles.label}>Birthdate</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setOpen(true)}>
          <AntIcons
            style={styles.icon}
            color={'#e3e3d7'}
            name="calendar"
            size={20}
          />
          <Text style={{marginLeft: 5, fontSize: 14}}>
            {date.toLocaleDateString('default', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={open}
          date={date}
          mode="date" // Day, month, and year selection
          onConfirm={selectedDate => {
            setOpen(false);
            setDate(selectedDate);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
      <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
        <Text style={{fontFamily: 'Poppins', color: 'black'}}>
          Phone Number
        </Text>
        <TextInput
          style={styles.input}
          placeholder="+10414241244"
          value={phoneNumber}
          onChangeText={text => {
            setPhoneNumber(text);
            validatePhoneNumber(text);
          }}
          keyboardType="phone-pad"
        />
        {numberError ? <Text style={{color: 'red'}}>{numberError}</Text> : null}
      </View>
      <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
        <Text style={{fontFamily: 'Poppins', color: 'black'}}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          value={email}
          onChangeText={text => {
            setEmail(text);
            validateEmail(text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={{color: 'red'}}>{emailError}</Text> : null}
      </View>

      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          marginTop: 20,
          marginBottom: 30,
        }}>
        <Text style={{fontFamily: 'Poppins', color: 'black'}}>
          Social Media Links
        </Text>
        {socialMediaLinks.map((link, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`https://www.example.com/link${index + 1}`}
            value={link}
            onChangeText={text => handleLinkChange(index, text)}
          />
        ))}
        <Text
          style={{
            fontFamily: 'Poppins',
            color: '#FA8055',
            fontSize: 12,
            marginLeft: 'auto',
            marginTop: 10,
          }}
          onPress={handleAddMoreLinks}>
          + Add More Links
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <Text style={styles.addButtonText}>Add Contact</Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={showAddContact}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}>
        <View style={styles.overlay}>
          <ContactAdded
            DoneFunction={() => setShowAddContact(false)}
            style={styles.popup}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#000',
  },
  iconText: {
    fontSize: 20,
    marginLeft: 10,
    color: '#000',
    fontFamily: 'Poppins',
  },
  input: {
    height: 40,
    borderColor: '#e3e3d7',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  dropdown: {
    height: 50,
    borderColor: '#e3e3d7',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contacttypebuton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  contactTypeText: {
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#F15927',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  popup: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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

export default AddContact;

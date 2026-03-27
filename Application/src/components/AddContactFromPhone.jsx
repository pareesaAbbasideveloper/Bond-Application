import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  Button,
  TextInput,
  PermissionsAndroid, Platform ,
  Modal
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import {Dropdown} from 'react-native-element-dropdown';
import SearchBar from 'react-native-dynamic-search-bar';
import Contacts from 'react-native-contacts';
import DatePicker from 'react-native-date-picker';
import Loading from './Loading';
const AddContactFromPhone = ({navigation}) => {
  const [contactList, setContactList] = useState([]);
  const [groupedContacts, setGroupedContacts] = useState({});
  const [visibleDropdown, setVisibleDropdown] = useState({});
  const [isSelected, setSelection] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading ,setLoading] = useState(true)
  const [group, setGroup] = useState('');
   const [numberError, setNumberError] = useState();
    const [emailError, setEmailError] = useState('');
    const [customDays, setCustomDays] = useState(null);
     const [phoneNumber, setPhoneNumber] = useState('');
      const [email, setEmail] = useState('');
      const [socialMediaLinks, setSocialMediaLinks] = useState(['']); // State for social media links
   
     
    const [showCustomInput, setShowCustomInput] = useState(false);
  const requestContactsPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app requires access to your contacts to display them.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Contacts permission granted');
          // Call function to access contacts here
        } else {
          console.log('Contacts permission denied');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestContactsPermission();
  }, []);
  const handleAddMoreLinks = () => {
    setSocialMediaLinks([...socialMediaLinks, '']); // Add a new empty string for the new input field
  };

  const handleAddContact = () => {
    console.log("a")
  }

  const handleLinkChange = (index, text) => {
    const updatedLinks = [...socialMediaLinks];
    updatedLinks[index] = text; // Update the link at the specific index
    setSocialMediaLinks(updatedLinks);
  };
  const data = [
    {label: 'Every 1 month', value: '1'},
    {label: 'Every 2 month', value: '2'},
    {label: 'Every 3 month', value: '3'},
  ];

  const toggleDropdown = displayName => {
    
    setLoading(true)
    setVisibleDropdown(prev => ({
      ...prev,
      [displayName]: !prev[displayName],
    }));
    setLoading(false)
  };

  //for react native date opener
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // Fetch contacts when the component mounts
    Contacts.getAll()
      .then(contacts => {
        setContactList(contacts);
      })
      .catch(error => {
        console.error('Failed to fetch contacts:', error);
      });
  }, []);

  useEffect(() => {
    if (contactList.length > 0) {
      const grouped = contactList.reduce((acc, contact) => {
        const displayName = contact.displayName || 'Unknown';
        const firstLetter = displayName.charAt(0).toUpperCase();

        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }

        acc[firstLetter].push(contact);
        return acc;
      }, {});

      // Sort the groups alphabetically by letter
      const sortedGroupedContacts = Object.keys(grouped)
        .sort()
        .reduce((acc, letter) => {
          acc[letter] = grouped[letter];
          return acc;
        }, {});

      setGroupedContacts(sortedGroupedContacts);
      setLoading(false)
    }
  }, [contactList]);

  // Convert groupedContacts to an array of sections
  const sections = Object.keys(groupedContacts).map(key => ({
    title: key,
    data: groupedContacts[key],
  }));

  const ContactItem = React.memo(({contact}) => {
  const displayName = contact.displayName || 'Unknown';

    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#D7D7D7',
        }}>
        <View
          style={{
            marginTop: 15,
            marginBottom: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 15, color: '#222222'}}>{displayName}</Text>
          <TouchableOpacity onPress={() => toggleDropdown(displayName)}>
            <AntIcons name="pluscircleo" size={20} style={{color: '#FA8055'}} />
          </TouchableOpacity>
        </View>
        {visibleDropdown[displayName] && (
          <View style={{}}>
           <View style={{marginTop: 20}}>
                       <View>
                         <Text
                           style={{fontSize: 14, fontFamily: 'Poppins', color: '#222222'}}>
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
                         <Text
                           style={{fontSize: 14, fontFamily: 'Poppins', color: '#222222'}}>
                           Get Notified
                         </Text>
                       </View>
                       <Dropdown
                   style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
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
                       style={[styles.icon , {marginRight:5 , marginLeft:5 ,fontSize:24}]}
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
                       {numberError ? (
                         <Text style={{color: 'red'}}>{numberError}</Text>
                       ) : null}
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
                       {emailError ? (
                         <Text style={{color: 'red'}}>{emailError}</Text>
                       ) : null}
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
          </View>
        )}
        
      </View>
    );
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mainHeader}
        onPress={() => navigation.goBack()}>
        <Icon style={styles.icon} name="arrow-back-outline" />
        <Text style={styles.iconText}>Add New Contact</Text>
      </TouchableOpacity>
      {/* <SearchBar
        placeholder="Search for Contact"
        onChangeText={setSearchTerm}
        value={searchTerm}
        style={{width: '100%', marginTop: 15}}
      /> */}
      <SectionList
    
        sections={sections}
        renderItem={({item}) => <ContactItem contact={item} />}
        renderSectionHeader={({section: {title}}) => (
          <Text style={{fontSize: 15, marginTop: 20, color: '#6D6D6D'}}>
            {title}
          </Text>
        )}
        keyExtractor={(item, index) => item.displayName + index}
        
      />
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
    </View>
    
  );
};

export default AddContactFromPhone;

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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
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
});

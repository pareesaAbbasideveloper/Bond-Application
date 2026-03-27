import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import contactImage from '../assests/contactImage.png';
import Icon from 'react-native-vector-icons/FontAwesome6';
import BottomBar from '../components/BottomBar.jsx'; // Adjust extensions as needed
import CategoryMenu from '../components/CategoryMenu.jsx'; // Adjust extensions as needed
import SearchBar from '../components/SearchBar.jsx'; // Adjust extensions as needed
import AddContact from '../components/AddContact.jsx';
import loadAndDecodeToken from '../components/LoadAndDecodeToken.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../API/API.jsx';
import Loading from '../components/Loading.jsx';
import {useFocusEffect} from '@react-navigation/native';

const Contact = ({navigation}) => {
  const [showContact, setShowContact] = useState(false);
  const [fetchedContact, setFetchedContact] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(''); // State for the search text
  const [filteredContacts, setFilteredContacts] = useState([]); // State for the filtered contacts

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, []),
  );

  const switchScreen = (location, value) => {
    navigation.navigate(location, {data: value});
  };

  const toggleContactDone = stateChange => {
    setShowContact(stateChange);
  };

  const [decodeData, setDecodeData] = useState();
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

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('token'); // Replace with your key
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/getallcontacts`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
        },
      );

      setFetchedContact(response.data);
      setFilteredContacts(response.data);
      setLoading(false);
    } catch (err) {
      console.log('Error', `Failed to post data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const changeCategory = value => {
    setCategory(value);
  };

  // Function to filter contacts based on the search query
  const handleSearch = text => {
    setSearchText(text);
    if (text === '') {
      setFilteredContacts(fetchedContact); // Show all contacts if search is empty
    } else {
      console.log('why');
      setFilteredContacts(
        fetchedContact.filter(contact =>
          contact.name.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }
  };
  console.log("this is me ",filteredContacts);

  // Filter contacts based on category and search text
  if (filteredContacts && filteredContacts.status !== 'failed') {
    filteredAndCategorizedContacts = (filteredContacts).filter(
      fetchData => category === 'All' || fetchData.category === category
    );
  } 
  console.log('this is fetched contact', fetchedContact);
  console.log('this is filtered contact', filteredAndCategorizedContacts);

  return (
    <>
      <ScrollView style={styles.maincontainer}>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 16, color: 'black', fontWeight: '600'}}>
            Contacts List
          </Text>

          {/* Search Bar component with dynamic search */}
          <SearchBar  onSearch={handleSearch} />
          <CategoryMenu changeCategory={changeCategory} />
        </View>

        <View style={{marginTop: 10}}>
          
              {Array.isArray(filteredAndCategorizedContacts) &&
                filteredAndCategorizedContacts.length > 0 &&
                filteredAndCategorizedContacts.map((fetchData, index) => {
                  const dateString = fetchData.recurring.date;
                  const date = new Date(dateString);
                  console.log('thi is date', date);
                  // Add one month safely
                  if (fetchData.recurring.recurringTime == 0) {
                    var addition = 1;
                    var currentMonth = date.getDate();
                    date.setDate(currentMonth + addition);
                  }else if(fetchData.recurring.recurringTime == 0.5){
                    var addition = 15; // Adding 15 days
                    var currentDay = date.getDate(); // Get the current day of the month
                    date.setDate(currentDay + addition); // Add 15 days to the current date                    
                  } else if(fetchData.recurring.recurringTime == 10){
                    var addition = fetchData.recurring.customDays; // Adding 15 days
                    var currentDay = date.getDate(); // Get the current day of the month
                    date.setDate(currentDay + addition); // Add 15 days to the current date                    
                  } else {
                    var addition = fetchData.recurring.recurringTime;
                    var currentMonth = date.getMonth();
                    date.setMonth(currentMonth + addition);
                    // Check if the new date is in the next month
                    if (date.getMonth() !== (currentMonth + addition) % 12) {
                      date.setDate(0); // Set to the last day of the previous month
                    }
                  }

                  const newFormattedDate = date.toISOString().split('T')[0];

                  const providedDate = new Date(newFormattedDate); // Replace with your provided date
                  const today = new Date();

                  // Set the time part to zero for both dates to only consider the date
                  today.setHours(0, 0, 0, 0);
                  providedDate.setHours(0, 0, 0, 0);

                  // Calculate the difference in milliseconds
                  const differenceInMilliseconds = providedDate - today;

                  // Convert milliseconds to days
                  const differenceInDays =
                    differenceInMilliseconds / (1000 * 60 * 60 * 24);
                    console.log('Profile Image:', fetchData.profileImage);

                  return (
                    <View
                    key={index} // Add a unique key using the index

                      style={{
                        marginTop: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          switchScreen('ContactProfile', fetchData)
                        }>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#ffffff',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 10,
                            marginTop: 10,
                          }}>
                          <Image
                            style={{width: 50, height: 50, borderRadius: 80}}
                            source={fetchData.profilePic ? { uri: fetchData.profilePic } : contactImage} 
                            />
                           <View style={{marginLeft: 10}}>
                            <Text
                              style={{
                                fontWeight: '700',
                                color: 'black',
                                fontSize: 17,
                              }}>
                              {fetchData.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginRight: 70,
                                }}>
                                <Icon name="bell" style={{color: '#e47f5b'}} />
                                <Text style={{fontSize: 12, marginLeft: 5}}>
                                  {differenceInDays} Days Left
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Icon
                                  name="message"
                                  style={{color: '#e47f5b'}}
                                />
                                <Text style={{fontSize: 12, marginLeft: 5}}>
                                  {newFormattedDate}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
           
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        visible={showContact}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}>
        <View style={styles.overlay}>
          <AddContact
            navigation={navigation}
            callFunction={toggleContactDone}
            style={styles.popup}
          />
        </View>
      </Modal>
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
      <BottomBar callFunction={toggleContactDone} navigation={navigation} />
    </>
  );
};

export default Contact;

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: '#fcfafa',
    paddingHorizontal: 20,
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

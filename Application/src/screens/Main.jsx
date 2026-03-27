import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';

import React, {useState, useEffect, useCallback} from 'react';
import * as Progress from 'react-native-progress';
import fire from '../assests/fire.png';
import stared from '../assests/star.png';
import wood from '../assests/wood.png';
import MessageTick from '../assests/MessageTick.png';
import axios from 'axios';
import BottomBar from '../components/BottomBar.jsx';
import MissedContactPopUp from '../components/MissedContactPopUp.jsx';
import ContactDone from '../components/ContactDone.jsx';
import OverDue from '../components/OverDue.jsx';
import UrgentToday from '../components/UrgentToday.jsx';
import UpcomingConnection from '../components/UpcomingConnection.jsx';
import {SwipeListView} from 'react-native-swipe-list-view';
import {FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../API/API.jsx';
import Loading from '../components/Loading.jsx';
import ContactRedirector from '../components/ContactRedirector.jsx';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler, Alert} from 'react-native';
import LevelUpCongrats from '../components/LevelUpCongrats.jsx';

const Main = ({navigation}) => {
  const [showContact, setShowContact] = useState(false);
  const [showLogCompleted, setShowLogCompleted] = useState(false);
  const [showlate, setShowLate] = useState(false);
  const [overDue, setOverDue] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [urgentToday, setUrgentToday] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [toggleDoneState, setToggleDoneState] = useState(false);
  const [contactRedirector, setContactRedirector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [decisionLoading, setDecisionLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [profileData, setProfileData] = useState();
  const [contactName, setContactName] = useState();
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, []),
  );
  const switchScreen = location => {
    navigation.navigate(location);
  };
  const toggleContactDone = async (stateChange, id, name) => {
    setShowContact(stateChange);
    if (id) {
      setSelectedContactId(id); // Store the selected contact's ID
      setContactName(name);
    }
  };

  const toggleContactRedirector = async stateChange => {
    setContactRedirector(stateChange);
  };

  const toggleDone = () => {
    setLoading(true);
    // Toggle the done state
    setToggleDoneState(prevState => !prevState);
  };

  toggleShowLogCompleted = () => {
    setShowLogCompleted(false);
  };

  const toggleShowLate = stateChange => {
    setShowLate(false);
  };

  const data = [
    {type: 'overdue'},
    {type: 'urgentToday'},
    {type: 'upcomingConnection'},
  ];

  const fetchData = async () => {
    setLoading(true); // Set general loading state

    const token = await AsyncStorage.getItem('token');
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    let profileDataWork = null;

    try {
      // Fetch profile data first
      const profileResponse = await fetch(`${BASE_URL}/api/v1/viewProfile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        profileDataWork = await profileResponse.json();

        setProfileData(profileDataWork);
        console.log('this is my profile', profileDataWork.data.Verified);
          if (profileDataWork.data.Verified == false) {
            console.log("A")
            navigation.navigate('GetCodeVerifyUser');
          }else if(profileDataWork.data.Verified == true){
            console.log("b")
            setDecisionLoading(false)
          }
        
     
      }
      // Fetch contact data
      const response = await axios.post(
        `${BASE_URL}/api/v1/filtercontacts`,
        {
          inputDate: formattedToday, // Adjust the key according to your API
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
        },
      );

      const combinedOverDueData = [
        ...response.data.OneMonth['Over Due'],
        ...response.data.TwoMonth['Over Due'],
        ...response.data.ThreeMonth['Over Due'],
        ...response.data.Daily['Over Due'],
        ...response.data.HalfMonth['Over Due'],
        ...response.data.CustomDate['Over Due'],
      ];
      const combinedUrgentTodayData = [
        ...response.data.OneMonth['Urgent Today'],
        ...response.data.TwoMonth['Urgent Today'],
        ...response.data.ThreeMonth['Urgent Today'],
        ...response.data.Daily['Urgent Today'],
        ...response.data.HalfMonth['Urgent Today'],
        ...response.data.CustomDate['Urgent Today'],
      ];
      const combinedUpComingData = [
        ...response.data.OneMonth['Upcoming data'],
        ...response.data.TwoMonth['Upcoming data'],
        ...response.data.ThreeMonth['Upcoming data'],
        ...response.data.Daily['Upcoming data'],
        ...response.data.HalfMonth['Upcoming data'],
        ...response.data.CustomDate['Upcoming data'],
      ];

      setOverDue(combinedOverDueData);
      setUrgentToday(combinedUrgentTodayData);
      setUpcoming(combinedUpComingData);
      setLoading(false);
      if (profileDataWork && profileDataWork.data.unburnedLog === 10) {
        setShowLogCompleted(true);
      }

      if (combinedOverDueData.length > 0) {
        setShowLate(true);
      }
    } catch (err) {
      console.log('Error', `Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false); // End general loading state
    }
  };

  useEffect(() => {
    fetchData();
  }, [toggleDoneState]);

  const filterDataByCategory = data => {
    if (selectedCategory === 'All') return data; // No filter for "All"
    return data.filter(item => item.category === selectedCategory); // Adjust the key if needed
  };
  useEffect(() => {
    // Listener for preventing back navigation on this screen
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      // Prevent the back navigation (either swipe or hardware button press)
      e.preventDefault();
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);
  if (decisionLoading) {
    return (
      <>
        <View></View>
        <Modal transparent={true} visible={decisionLoading} animationType="fade">
          <View style={styles.overlay}>
            <Loading />
          </View>
        </Modal>
      </>
    );
  } else {
    return (
      <>
        <FlatList
          style={styles.maincontainer}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <>
              <TouchableOpacity
                onPress={() => switchScreen('Gamification')}
                style={styles.bonfirecontainer}>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#222222',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Keep the bondfire up!
                  </Text>
                  <Text style={{fontSize: 11, fontFamily: 'Poppins-Light'}}>
                    Get in touch with your bonds to earn logs!
                  </Text>
                  <Progress.Bar
                    style={{
                      marginTop: 10,
                      backgroundColor: '#c5c5c5',
                      width: '100%',
                    }}
                    progress={0.3}
                    width={300}
                    height={10}
                    color={'#e47650'}
                    borderWidth={0}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginTop: 10,
                      justifyContent: 'flex-start',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 30, height: 30}}
                        source={stared}></Image>
                      <Text
                        key={profileData?.data.level}
                        style={{
                          marginLeft: 5,
                          fontWeight: '600',
                          color: '#e47650',
                          fontFamily: 'Poppins-Bold',
                          fontSize: 13,
                        }}>
                        {
                          // console.log("this is inside" , profileData?.data.level)
                          profileData?.data?.level
                        }
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 30, height: 30}}
                        source={wood}></Image>
                      <Text
                        style={{
                          marginLeft: 5,
                          fontWeight: '800',
                          color: '#e47650',
                          fontFamily: 'Poppins-Bold',
                          fontSize: 13,
                        }}>
                        {profileData?.data.burnedLog} /{' '}
                        {profileData?.data.unburnedLog}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{width: '20%', alignItems: 'center'}}>
                  <Image
                    style={{
                      width: '70%',
                      height: '50%',
                      marginLeft: 'auto',
                      marginVertical: 'auto',
                    }}
                    source={fire}></Image>
                </View>
              </TouchableOpacity>
              <View style={{marginTop: 20}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#222222',
                    fontWeight: '600',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  To Get in Touch Today
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                  }}>
                  {['All', 'Friends', 'Family', 'Network'].map(category => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      style={[
                        styles.contacttypebuton,
                        selectedCategory === category
                          ? {backgroundColor: '#FA8055'}
                          : {backgroundColor: '#e9e9e8'},
                      ]}>
                      <Text
                        style={{
                          color:
                            selectedCategory === category ? 'white' : 'black',
                          textAlign: 'center',
                          fontFamily: 'Poppins-Medium',
                          fontSize: 14,
                        }}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          }
          ListFooterComponent={
            <View>
              <View style={{marginTop: 20}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#222222',
                    fontWeight: '600',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Over Due
                </Text>
                {filterDataByCategory(overDue).map((overdue, index) => (
                  <View style={{marginTop: 5}} key={index}>
                    <SwipeListView
                      data={[{key: overdue._id}]} // Ensure each overdue item has a unique key
                      renderItem={() => <OverDue data={overdue} />}
                      renderHiddenItem={(data, rowMap) => (
                        <View
                          style={{
                            height: '85%',
                            backgroundColor: '#54B76C',
                            marginTop: 'auto',
                            borderRadius: 20,
                            width: '50%',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              toggleContactDone(true, overdue._id, overDue.name)
                            }
                            style={{marginVertical: 'auto'}}>
                            <Image
                              source={MessageTick}
                              style={{
                                width: 30,
                                height: 30,
                                marginRight: 'auto',
                                marginVertical: 'auto',
                                marginLeft: 25,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      leftOpenValue={75}
                    />
                  </View>
                ))}
              </View>
              <View style={{marginTop: 20}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#222222',
                    fontWeight: '600',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Urgent Today
                </Text>
                {filterDataByCategory(urgentToday).map((urgentToday, index) => (
                  <View
                    style={{
                      marginTop: 5,
                    }}>
                    <SwipeListView
                      data={[{key: '1'}]} // Provide some data here
                      renderItem={() => <UrgentToday data={urgentToday} />}
                      renderHiddenItem={(data, rowMap) => (
                        <View
                          style={{
                            height: '85%',
                            backgroundColor: '#54B76C',
                            marginTop: 'auto',
                            borderRadius: 20,
                            width: '50%',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              toggleContactDone(
                                true,
                                urgentToday._id,
                                urgentToday.name,
                              );
                            }}
                            style={{marginVertical: 'auto'}}>
                            <Image
                              source={MessageTick}
                              style={{
                                width: 30,
                                height: 30,
                                marginRight: 'auto',
                                marginVertical: 'auto',
                                marginLeft: 25,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      leftOpenValue={75}
                    />
                  </View>
                ))}
              </View>
              <View style={{marginTop: 20}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#222222',
                    fontWeight: '600',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Upcoming Connections
                </Text>

                {filterDataByCategory(upcoming).map((upcoming, index) => (
                  <View
                    style={{
                      marginTop: 5,
                    }}>
                    <UpcomingConnection data={upcoming} />
                  </View>
                ))}
              </View>
            </View>
          }
        />
        <Modal
          transparent={true}
          visible={false}
          animationType="fade"
          onRequestClose={() => setIsPopupVisible(false)}>
          <View style={styles.overlay}>
            <MissedContactPopUp style={styles.popup} />
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={showlate}
          animationType="fade"
          onRequestClose={() => setIsPopupVisible(false)}>
          <View style={styles.overlay}>
            <MissedContactPopUp
              callFunction={toggleShowLate}
              style={styles.popup}
            />
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={showContact}
          animationType="fade"
          onRequestClose={() => setIsPopupVisible(false)}>
          <View style={styles.overlay}>
            <ContactDone
              id={selectedContactId}
              name={contactName}
              callFunction={toggleContactDone}
              DoneFunction={toggleDone}
              style={styles.popup}
            />
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={showLogCompleted}
          animationType="fade"
          onRequestClose={() => setIsPopupVisible(false)}>
          <View style={styles.overlay}>
            <LevelUpCongrats
              callFunction={toggleShowLogCompleted}
              style={styles.popup}
            />
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={contactRedirector}
          animationType="fade"
          onRequestClose={() => setIsPopupVisible(false)}>
          <View style={styles.overlay}>
            <ContactRedirector
              callFunction={toggleContactRedirector}
              style={styles.popup}
            />
          </View>
        </Modal>
        <Modal transparent={true} visible={loading} animationType="fade">
          <View style={styles.overlay}>
            <Loading />
          </View>
        </Modal>
        <BottomBar
          navigation={navigation}
          onContactRedirect={toggleContactRedirector}
        />
      </>
    );
  }
};

export default Main;

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: '#fcfafa',
    paddingHorizontal: 20,
  },
  bonfirecontainer: {
    backgroundColor: 'white',
    marginTop: '8%',
    borderRadius: 10,
    padding: 12,
    flex: 1,
    flexDirection: 'row',
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

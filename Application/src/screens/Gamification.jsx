import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import AntIcons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BurnLog from '../assests/Burnlog.gif';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BASE_URL } from '../API/API';
import BottomBar from '../components/BottomBar';
import Loading from '../components/Loading';
import LevelUp from '../components/LevelUp';
const Gamification = ({navigation}) => {
  const levelImages = {
    1: require('../assests/wood.png'), // Replace with actual image paths
    2: require('../assests/table.png'),
    3: require('../assests/guitar.png'),
    // Add more levels if needed
  };

  // Ensure a default image in case the level doesn't match
  const getImageForLevel = level =>
    levelImages[level] || require('../assests/wood.png');

  const [number, setNumber] = useState(0); // state to store the number entered
  const [burnLog, setBurnLogs] = useState([1, 2, 3, 4, 5, 6, 7, 8 , 9 , 10]); // State to store burn logs dynamically
  // Memoize translationValues to avoid reinitializing them every render

  const [imageLayout, setImageLayout] = useState([]);
  const [data, setData] = useState();
  const [token, setToken] = useState('');
  const translationValueX = burnLog.map(() => useSharedValue(0));
  const translationValueY = burnLog.map(() => useSharedValue(0));
  const [levelUpModal , setLevelUpModal] =useState(false)
  console.log(burnLog);

  const [loading, setLoading] = useState(true);
  const [hiddenImages, setHiddenImages] = useState(
    Array(burnLog.length).fill(true),
  );

  const [log, setlog] = useState('');
  const [level, setLevel] = useState('');

  toggleLevelCompleted = () => {
    setLevelUpModal(false);
  }
  // Fetch token only once when the component is mounted
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };
    fetchToken();
  }, []); // This runs only once when the component is mounted

  // Fetch profile data when the token is updated
  useEffect(() => {
    if (token) {
      const fetchProfileData = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/v1/viewProfile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('this is response ', response);

          if (response.ok) {
            const data = await response.json();
            setData(data);
            setlog(data.data.burnedLog);
            setLevel(data.data.level);
            const numberOfLogs = data.data.unburnedLog - data.data.burnedLog;
            console.log(numberOfLogs)
            setHiddenImages(Array(10 - numberOfLogs).fill(true));
            setLoading(false)
          } else {
            console.error('Failed to fetch profile data:', response.status);
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };

      fetchProfileData();
    }
  }, [token]); // This effect runs when the token is set

  const logDone = async () => {
    //  setLoading(true)
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/burnedLogDone`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
        },
      );

      if (response.status == 200) {
      console.log("me here" , response.data.user.burnedLog)
      console.log(response.data.user.burnedLog)
      // setLoading(false)
      if(response.data.user.burnedLog == 0){
       setLevelUpModal(true)
       setLevel(level + 1);
       setlog(0)
       }else{
        setlog(log + 1)

       }
      }
    } catch (error) {
      console.log(error);
      seLoading(false)
    }
  };

  // Function to generate the dynamic array based on the number entered

  const [dropzoneLayout, setDropzoneLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const dropSuccess = index => {
    logDone();
    setHiddenImages(prevState => {
      const updatedState = [...prevState];
      updatedState[index] = true;
      return updatedState;
    });
  };
  const createPanGestureHandler = index => {
    return Gesture.Pan()
      .onUpdate(event => {
        translationValueX[index].value = event.translationX;
        translationValueY[index].value = event.translationY;
      })
      .onEnd(event => {
        console.log(dropzoneLayout);
        const dropX = dropzoneLayout.x;
        const dropY = dropzoneLayout.y + 100;

        console.log(
          'this is the work we need to figure out on Y',
          imageLayout[index].y - event.translationY,
        );

        console.log(
          'this is the height of image',
          imageLayout[index].y - event.translationY - imageLayout[index].height,
        );

        console.log(
          'this is the dropzone layout height',
          dropY + dropzoneLayout.height,
        );

        if (
          imageLayout[index] &&
          imageLayout[index].x + event.translationX >= dropX &&
          imageLayout[index].x +
            event.translationX +
            imageLayout[index].width <=
            dropX + dropzoneLayout.width &&
          imageLayout[index].y - event.translationY >= dropY &&
          imageLayout[index].y -
            event.translationY -
            imageLayout[index].height <=
            dropY + dropzoneLayout.height
        ) {
          runOnJS(dropSuccess)(index);
        } else {
          translationValueX[index].value = withSpring(0);
          translationValueY[index].value = withSpring(0);
        }
      });
  };

  const panGestureHandler = burnLog.map((item, index) =>
    createPanGestureHandler(index),
  );

  const animatedStyles = index => 
    useAnimatedStyle(() => {
      return {
        transform: [
          {translateX: translationValueX[index].value},
          {translateY: translationValueY[index].value},
        ],
      };
    });
  
    return (
      <>
        <ScrollView style={{paddingHorizontal: 20, paddingVertical: 20}}>
          <GestureHandlerRootView>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.leftBox}>
                <Text style={{marginRight: 10, fontSize: 16}}>Level</Text>
                <View style={styles.innerbox}>
                  <AntIcons style={{fontSize: 20}} name="star"></AntIcons>
                  <Text>{level}</Text>
                </View>
              </View>
              <View style={styles.leftBox}>
                <Text style={{marginRight: 10, fontSize: 16}}>Your Logs</Text>
                <View style={styles.innerbox}>
                  <Icon style={{fontSize: 20}} name="tree"></Icon>
                  <Text>{log}</Text>
                </View>
              </View>
            </View>

            <View style={{marginTop: 40}}>
              <Text
                style={{
                  fontWeight: 600,
                  color: '#FA8055',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                Drag & Drop into the fire
              </Text>
              <Image
                style={{
                  marginHorizontal: 'auto',
                  marginTop: 60,
                  borderWidth: 1,
                  width:100,
                  height:100
                  
                }}
                onLayout={event => {
                  console.log('Parent Layout:', event.nativeEvent.layout);

                  const {x, y, width, height} = event.nativeEvent.layout;
                  setDropzoneLayout({x, y, width, height});
                }}
                source={BurnLog}></Image>
            </View>
            <View style={styles.logContainer}>
              {Array.from({length: Math.ceil(burnLog.length / 4)}).map(
                (_, rowIndex) => (
                  <View key={rowIndex} style={styles.logRow}>
                    {burnLog
                      .slice(rowIndex * 5, rowIndex * 5 + 5)
                      .map((item, innerIndex) => {
                        const absoluteIndex = rowIndex * 5 + innerIndex; // Calculate the absolute index
                        return (
                          <GestureDetector
                            key={absoluteIndex}
                            gesture={panGestureHandler[absoluteIndex]}>
                            <Animated.Image
                              onLayout={event => {
                                const {width, x, y, height} =
                                  event.nativeEvent.layout;
                                const updatedLayout = [...imageLayout];
                                updatedLayout[absoluteIndex] = {
                                  width,
                                  x,
                                  y,
                                  height,
                                };
                                setImageLayout(updatedLayout);
                              }}
                              style={[
                                styles.logImage,
                                animatedStyles(absoluteIndex),
                                hiddenImages[absoluteIndex] && {opacity: 0}, // Hide the image if marked
                              ]}
                              source={getImageForLevel(level)} // Use the dynamic source based on level
                            />
                          </GestureDetector>
                        );
                      })}
                  </View>
                ),
              )}
            </View>
          </GestureHandlerRootView>
        </ScrollView>
        <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={levelUpModal}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}>
        <View style={styles.overlay}>
          <LevelUp
            callFunction={toggleLevelCompleted}
            style={styles.popup}
          />
        </View>
      </Modal>
        <BottomBar navigation={navigation} />
      </>
    );
  }


export default Gamification;

const styles = StyleSheet.create({
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logContainer: {
    marginTop:200
  },
  innerbox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  logImage: {
    width: 50,
    height: 35,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
});

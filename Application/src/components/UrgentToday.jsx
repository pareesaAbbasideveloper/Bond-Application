import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import contactImage from '../assests/contactImage.png';

const UrgentToday = ({data}) => {
  const dateString = data.recurring.date;
  const date = new Date(dateString);

  if (data.recurring.recurringTime == 0) {
    var addition = 1;
    var currentMonth = date.getDate();
    date.setDate(currentMonth + addition);
  }else if(data.recurring.recurringTime == 0.5){
    var addition = 15; // Adding 15 days
    var currentDay = date.getDate(); // Get the current day of the month
    date.setDate(currentDay + addition); // Add 15 days to the current date                    
  } else if(data.recurring.recurringTime == 10){
    var addition = data.recurring.customDays; // Adding 15 days
    var currentDay = date.getDate(); // Get the current day of the month
    date.setDate(currentDay + addition); // Add 15 days to the current date                    
  } else {
    var addition = data.recurring.recurringTime;
    var currentMonth = date.getMonth();
    date.setMonth(currentMonth + addition);
    // Check if the new date is in the next month
    if (date.getMonth() !== (currentMonth + addition) % 12) {
      date.setDate(0); // Set to the last day of the previous month
    }
  }

  const newFormattedDate = date.toISOString().split('T')[0];

  console.log(newFormattedDate);

  return (
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
        source={data.profilePic ? {uri: data.profilePic} : contactImage}
        ></Image>
      <View style={{marginLeft: 10}}>
        <Text
          style={{
            fontSize: 15,
            color: '#222222',
            fontWeight: 600,
            fontFamily: 'Poppins-Medium',
          }}>
          {data.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 3,
          }}>
          <Icon name="message" style={{color: '#FA8055'}}></Icon>
          <Text style={{fontSize: 12, marginLeft: 5}}>{newFormattedDate}</Text>
        </View>
      </View>
    </View>
  );
};

export default UrgentToday;

const styles = StyleSheet.create({});

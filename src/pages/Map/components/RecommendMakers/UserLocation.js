import {useAtom} from 'jotai';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import {userLocationInMakersAtom} from '../../../../utils/store';

export const UserLocation = () => {
  const [initCenter, setInitCenter] = useAtom(userLocationInMakersAtom);
  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:root');
    }
  };

  const requestLocationIosPermission = async () => {
    try {
      const granted = await Geolocation.requestAuthorization('whenInUse');
      console.log(granted, '22');
      if (granted === 'granted') {
        getLocation();
      } else {
        Alert.alert('커런트', '위치 사용을 위해 접근 권한을 허용해 주세요', [
          {
            text: '취소',
          },
          {
            text: '확인',
            onPress: () => {
              openAppSettings();
            },
          },
        ]);
        // console.log('Location permission denied.');
      }
    } catch (error) {
      console.log('Error requesting location permission: ', error);
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        //console.log(latitude, longitude, 'sffssf');
        setInitCenter({latitude: latitude, longitude: longitude});
        // if (setMyLocation)
        //   setMyLocation({latitude: latitude, longitude: longitude});
      },
      error => {
        console.error(error.code, error.message, '에러');
      },
      {enableHighAccuracy: true, timeout: 1500, maximumAge: 1000},
    );
  };

  const requestLocationAndroidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '커런트',
          message: `'정확한 위치' 접근 권한을 허용해 주세요`,
          buttonNeutral: '다음에 다시 묻기',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(position => {
          const {latitude, longitude} = position.coords;
          setInitCenter({
            latitude: latitude,
            longitude: longitude,
          });
          // if (setMyLocation)
          //   setMyLocation({latitude: latitude, longitude: longitude});
        });
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // setShow(true);
        // toast.toastEvent();
        // setTimeout(() => {
        //   setShow(false);
        // }, 3000);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    console.log('sksk');
    if (Platform.OS === 'ios') {
      requestLocationIosPermission();
    } else {
      requestLocationAndroidPermission();
    }
  }, []);
};

import {useNavigation} from '@react-navigation/native';
import {useAtom} from 'jotai';
import {useEffect, useLayoutEffect, useState} from 'react';
import React from 'react';
import {
  Alert,
  Keyboard,
  Linking,
  PermissionsAndroid,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import styled from 'styled-components';

import {UserLocation} from './UserLocation';
import {mapApis} from '../../../../api/map';
import {shareSpotApis} from '../../../../api/shareSpot';
import Toast from '../../../../components/Toast';
import Typography from '../../../../components/Typography';
import {
  userLocationAtom,
  userLocationInMakersAtom,
} from '../../../../utils/store';
import Location from '../../Location';
import Search from '../../Search';
import AddressList from '../AddressList';
import AddressShareSpotList from '../AddressShareSpotList';
import NoResult from '../NoResult';

export const PAGE_NAME = 'RECOMMEND_MAKERS_SEARCH_RESULT';
const SearchResult = ({route}) => {
  const from = route?.params?.from;
  const toast = Toast();
  const [show, setShow] = useState(false);
  const [screen, setScreen] = useState(true); // 검색 결과 유무 전환
  const [initCenter, setInitCenter] = useAtom(userLocationInMakersAtom);
  const [data, setData] = useState([]);
  const [focus, setFocus] = useState(false);
  const [text, setText] = useState('');

  const searchPress = async () => {
    const res = await mapApis.getMakersAddress(text, initCenter);

    setScreen(false);
    setData(res);
    setFocus(false);
  };

  useEffect(() => {
    if (from) {
      setText('');
      setData([]);
    }
  }, [from]);

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:root');
    }
  };

  const requestLocationIosPermission = async () => {
    try {
      const granted = await Geolocation.requestAuthorization('whenInUse');

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
        console.log(latitude, longitude, 'sffssf');
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
        setShow(true);
        toast.toastEvent();
        setTimeout(() => {
          setShow(false);
        }, 3000);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestLocationIosPermission();
    } else {
      requestLocationAndroidPermission();
    }
  }, []);

  return (
    <Wrap>
      <View style={{marginBottom: 8}}>
        <Search
          setFocus={setFocus}
          focus={focus}
          searchPress={searchPress}
          text={text}
          setText={setText}
        />
      </View>

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFocus(false);
        }}>
        <View style={{flex: 1}}>
          {/* 디폴드화면 */}

          {screen && (
            <ContentWrap>
              <ExampleText>이렇게 검색해보세요</ExampleText>
              <View style={{marginTop: 8}}>
                <Title>・ 도로명 + 건물번호</Title>
                <TitleExample> 예 {')'} 커런트 11길 1</TitleExample>
                <Title>・ 지역명 + 번지</Title>
                <TitleExample> 예 {')'} 커런트 11-1</TitleExample>
                <Title>・ 건물명,아파트명</Title>
                <TitleExample> 예 {')'} 커런트 아파트 111동</TitleExample>
                <Title>・ 음식점명</Title>
                <TitleExample> 예 {')'} 커런트 파스타 선릉점</TitleExample>
              </View>
            </ContentWrap>
          )}

          {/* 검색 결과 있음 */}
          {!screen && data?.length === 0 ? (
            <NoResult />
          ) : (
            <AddressList setFocus={setFocus} data={data} type={'makers'} />
          )}
        </View>
      </TouchableWithoutFeedback>
      {show && (
        <toast.ToastWrap
          message={`설정>권한 에서 '정확한 위치' 접근 권한을 허용해 주세요`}
          isHeader={false}
        />
      )}
    </Wrap>
  );
};

export default SearchResult;

const Wrap = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.grey[0]};
`;

const ContentWrap = styled.View`
  height: 100%;
  padding: 32px 24px;
  background-color: ${({theme}) => theme.colors.grey[8]};
`;

const ExampleText = styled(Typography).attrs({text: 'Title04SB'})`
  color: ${({theme}) => theme.colors.grey[2]};
`;

const Title = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme}) => theme.colors.grey[2]};
`;

const TitleExample = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme}) => theme.colors.grey[4]};
  padding-left: 20px;
  margin-bottom: 4px;
`;

const Contents = styled.View`
  border-bottom: 1px solid;
  border-bottom-width: 6px;
  border-color: ${({theme}) => theme.colors.grey[8]};
`;

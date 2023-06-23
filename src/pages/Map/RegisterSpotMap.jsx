import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAtom} from 'jotai';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import NaverMapView from 'react-native-nmap';
import {useQueryClient} from 'react-query';
import styled from 'styled-components/native';

import Info from './components/Info';
import Location from './LocationCircle';
import {PAGE_NAME as MapSearchResult} from './SearchResult';
import ArrowIcon from '../../assets/icons/Map/changeArrow.svg';
import FindIcon from '../../assets/icons/Map/find.svg';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import Typography from '../../components/Typography';
import {useGetAddress, useGetRoadAddress} from '../../hook/useMap';
import {height} from '../../theme';
import {registerMapZoomAtom, userLocationAtom} from '../../utils/store';
import {PAGE_NAME as MySpotDetailPage} from '../Spots/mySpot/DetailAddress';
import {PAGE_NAME as ApplySpotPage} from '../Spots/shareSpot/ApplySpot';

// latitude : 위도 (y) ,longitude :경도 (x)
export const PAGE_NAME = 'REGISTER_SPOT_MAP';
const RegisterSpotMap = ({route}) => {
  const paramLocation = route?.params?.center;
  const queryClient = useQueryClient();
  const mapRef = useRef(null);
  const toast = Toast();
  const [mapHeight, setMapHeight] = useState(0);
  const navigation = useNavigation();
  const [tab, setTab] = useState(false);
  const [show, setShow] = useState(false);
  const [move, setMove] = useState(false);
  const [zoom, setZoom] = useAtom(registerMapZoomAtom);
  const [showAddress, setShowAddress] = useState(false);
  // const [center, setCenter] = useState();
  const [initCenter, setInitCenter] = useAtom(userLocationAtom); // 기초 좌표 강남역
  // console.log(center, initCenter);
  const {data: roadAddress, refetch: roadAddressRefetch} = useGetRoadAddress(
    initCenter ? initCenter.longitude : 0,
    initCenter ? initCenter.latitude : 0,
  );
  // const {data: address, refetch: addressRefetch} = useGetAddress(
  //   roadAddress && roadAddress.roadAddress,
  // );

  const changAddress = () => {
    setShowAddress(prev => !prev);
  };

  const handleCameraChange = event => {
    const newCenter = {latitude: event.latitude, longitude: event.longitude};
    setZoom(event.zoom);
    if (move) {
      setInitCenter(newCenter);
    }
    setMove(false);
  };

  useEffect(() => {
    roadAddressRefetch();
  }, [initCenter, queryClient, roadAddressRefetch, showAddress]);
  // useEffect(() => {
  //   addressRefetch();
  // }, [roadAddress, initCenter, addressRefetch]);

  useFocusEffect(
    useCallback(() => {
      if (paramLocation !== undefined) {
        setInitCenter(paramLocation);
      }
      setZoom(18);
    }, [paramLocation, setInitCenter]),
  );
  const handleLayout = () => {
    mapRef.current.measure((x, y, width, height) => {
      setMapHeight(height);
    });
  };
  if (!initCenter || initCenter.latitude === 0 || !roadAddress) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  return (
    <Wrap>
      <Pressable
        style={{position: 'relative', marginTop: 8, marginBottom: 12}}
        onPress={() => {
          navigation.navigate(MapSearchResult, {
            name: 'registerSpot',
          });
        }}>
        <Icon />
        <Search>
          <PlaceHolderText>지번, 도로명, 건물명으로 검색</PlaceHolderText>
        </Search>
      </Pressable>

      <MapView ref={mapRef} onLayout={handleLayout}>
        <LocationButtonWrap>
          <Location
            setInitCenter={setInitCenter}
            setShow={setShow}
            toast={toast}
          />
        </LocationButtonWrap>
        {/* 탭 */}
        <InfoView tab={tab}>
          <Info
            onPressEvent={() => {
              setTab(true);
            }}
          />
        </InfoView>
        {initCenter && (
          <Pressable
            style={{flex: 1}}
            onPressIn={() => {
              if (Platform.OS === 'ios') setMove(true);
            }}>
            <NaverMapView
              minZoomLevel={6}
              maxZoomLevel={20}
              onTouch={() => {
                if (Platform.OS === 'android') setMove(true);
              }}
              scaleBar={false}
              zoomControl={false}
              center={{...initCenter, zoom: zoom}}
              style={{flex: 1}}
              onCameraChange={handleCameraChange}
            />
          </Pressable>
        )}
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            zIndex: 1,
            top: (mapHeight - 49 / 2) / 2,
          }}>
          <FastImage
            source={
              move ? require('./icons/pick.png') : require('./icons/marker.png')
            }
            style={{
              width: 36,
              height: 49,
            }}
          />
        </View>
      </MapView>

      {roadAddress?.roadAddress && (
        <AddressView>
          {showAddress ? (
            <AddressText>{roadAddress?.address}</AddressText>
          ) : (
            <AddressText>{roadAddress?.roadAddress}</AddressText>
          )}
          <ChangeAddressWrap onPress={changAddress} move={move}>
            <Arrow move={move} />
            {showAddress ? (
              <ChangeAddressText move={move}>도로명으로 보기</ChangeAddressText>
            ) : (
              <ChangeAddressText move={move}>지번으로 보기</ChangeAddressText>
            )}
          </ChangeAddressWrap>
          <ButtonWrap>
            <Button
              onPressEvent={() =>
                navigation.navigate(ApplySpotPage, {
                  address: roadAddress?.address,
                  roadAddress: roadAddress?.roadAddress,
                  showAddress: showAddress,
                  center: initCenter,
                  type: 'registerSpot',
                  from: 'application',
                })
              }
              label="이 위치에 신청"
              disabled={move || !tab}
              type={move || !tab ? 'map' : 'yellow'}
            />
          </ButtonWrap>
        </AddressView>
      )}

      {show && (
        <toast.ToastWrap
          message={`설정>권한 에서 '정확한 위치' 접근 권한을 허용해 주세요`}
          isHeader={false}
        />
      )}
    </Wrap>
  );
};

export default RegisterSpotMap;

const MapView = styled.View`
  flex: 1;
  background-color: 'red';
  width: 100%;
  position: relative;
`;

const Wrap = styled.SafeAreaView`
  flex: 1;
  background-color: ${({theme}) => theme.colors.grey[0]};
`;

const AddressView = styled.View`
  padding: 24px;
  padding-top: 16px;
  height: 198px;
`;
const AddressText = styled(Typography).attrs({text: 'Title03SB'})`
  color: ${({theme}) => theme.colors.grey[2]};
`;

const ChangeAddressWrap = styled.Pressable`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme, move}) => theme.colors.grey[8]};

  padding: 3px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const ChangeAddressText = styled(Typography).attrs({text: 'Button10R'})`
  color: ${({theme, move}) =>
    move ? theme.colors.grey[5] : theme.colors.grey[2]};
`;

const Arrow = styled(ArrowIcon)`
  margin-right: 8px;
  color: ${({move, theme}) =>
    move ? theme.colors.grey[5] : theme.colors.grey[2]};
`;

const ButtonWrap = styled.View`
  position: absolute;
  bottom: 35px;
  left: 24px;
`;
const Search = styled.View`
  margin: 0px 24px;
  background-color: ${({theme}) => theme.colors.grey[8]};
  padding: 11px 14px 11px 28px;
  border-radius: 8px;
  height: 44px;
`;

const PlaceHolderText = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme}) => theme.colors.grey[4]};
`;
const Icon = styled(FindIcon)`
  position: absolute;
  bottom: 14px;
  left: 32px;
  z-index: 1;
  margin-right: 4px;
`;

const InfoView = styled.Pressable`
  position: absolute;
  height: 100%;
  z-index: ${({tab}) => (tab ? 0 : 999)};
`;

const LocationButtonWrap = styled.View`
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 99;
`;

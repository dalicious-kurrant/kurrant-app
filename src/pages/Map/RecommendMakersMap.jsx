import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAtom} from 'jotai';
import React, {useCallback, useState} from 'react';
import {Pressable} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import styled from 'styled-components';

import {PAGE_NAME as AfterRecommendPage} from './components/RecommendMakers/AfterRecommend';
import {MarkerMarkerIcon} from '../../assets';
import CheckIcon from '../../assets/icons/BottomSheet/Checked.svg';
import RecommendIcon from '../../assets/icons/Spot/recommend.svg';
import Typography from '../../components/Typography';
import {
  useCancelRecommend,
  useGetRecommend,
  useSendRecommend,
} from '../../hook/useRecommendMakers';
import {useGroupSpotList} from '../../hook/useSpot';
import {userLocationAtom} from '../../utils/store';

// latitude : 위도 (y) ,longitude :경도 (x)
export const PAGE_NAME = 'RECOMMEND_MAKERS_MAP';
const RecommendMakersMap = ({route}) => {
  const paramsLocation = route?.params?.location;
  const name = route?.params?.name;
  const address = route?.params?.address;
  const placeData = route?.params?.data;
  const zipCode = route?.params?.zipCode;
  const navigation = useNavigation();
  const [zoom, setZoom] = useState(17);
  const [initCenter, setInitCenter] = useAtom(userLocationAtom); // 기초 좌표 강남역
  const [selectId, setSelectId] = useState(null);

  const handleCameraChange = event => {
    setZoom(event.zoom);
  };
  const {data: getRecommend, refetch} = useGetRecommend(Number(placeData.id));
  const {data: userSpotList} = useGroupSpotList();
  const {mutateAsync: sendRecommend} = useSendRecommend();
  const {mutateAsync: cancelRecommend} = useCancelRecommend();
  const listData = userSpotList.data.spotListResponseDtoList;

  const resData = getRecommend?.data;
  const spotListData = listData?.map(el => {
    return {
      clientName: el.clientName,
      spots: el.spots,
    };
  });

  const sendRecommendButton = async () => {
    const reqData = {
      kakaoStoreId: Number(placeData.id),
      name: placeData.place_name,
      phone: placeData.phone,
      address: {
        zipCode: zipCode,
        address1: placeData.road_address_name,
        address2: null,
        address3: placeData.address_name,
        latitude: placeData.y,
        longitude: placeData.x,
      },
      spotId: selectId,
    };

    await sendRecommend(reqData);
    navigation.navigate(AfterRecommendPage);
  };

  const cancelRecommendButton = async () => {
    const data = {
      kakaoStoreId: Number(placeData.id),
      spotId: resData?.recommendSpotId,
    };
    await cancelRecommend(data);
    setSelectId(null);
  };
  useFocusEffect(
    useCallback(() => {
      if (paramsLocation) {
        setInitCenter(paramsLocation);
      }

      refetch();
    }, [paramsLocation, refetch, setInitCenter]),
  );

  useFocusEffect(
    useCallback(() => {
      setZoom(17);
    }, []),
  );
  console.log(selectId, resData?.recommendSpotId);
  return (
    <Wrap>
      <MapView>
        <NaverMapView
          minZoomLevel={17}
          maxZoomLevel={17}
          scaleBar={false}
          zoomControl={false}
          center={{...initCenter, zoom: zoom}}
          style={{
            width: '100%',
            height: 128,
            overflow: 'hidden',
            borderRadius: 14,
          }}
          onCameraChange={handleCameraChange}>
          <Marker
            image={MarkerMarkerIcon}
            coordinate={paramsLocation}
            style={{width: 40, height: 40}}
          />
        </NaverMapView>
      </MapView>
      <InnerWrap>
        <NameText>{name}</NameText>
        <AddressText>{address + ' ' + name}</AddressText>
        <RecommendCount>
          <RecommendIcon />
          <RecommendCountText>
            {resData === null ? 0 : resData?.count}명
          </RecommendCountText>
        </RecommendCount>
      </InnerWrap>
      <Border />
      <SpotListWrap>
        <DeliverySpotText>배송 받을 스팟</DeliverySpotText>
        <SpotListView>
          {spotListData?.map(el =>
            el.spots.map(v => (
              <Pressable
                onPress={() => setSelectId(v.spotId)}
                key={v.spotId}
                disabled={resData?.recommendSpotId}>
                <SpotWrap>
                  <SpotText>{el.clientName + ' ' + v.spotName}</SpotText>
                  {(selectId === v.spotId ||
                    resData?.recommendSpotId === v.spotId) && <CheckIcon />}
                </SpotWrap>
                <ThinBorder />
              </Pressable>
            )),
          )}
        </SpotListView>
      </SpotListWrap>
      <ButtonWrap>
        {resData?.isRecommend ? (
          <RecommendCancelButton onPress={() => cancelRecommendButton()}>
            <RecommendButtonCancelText>추천 취소하기</RecommendButtonCancelText>
          </RecommendCancelButton>
        ) : (
          <RecommendButton
            disabled={selectId === null}
            onPress={sendRecommendButton}
            select={selectId}>
            <RecommendButtonText select={selectId}>
              추천하기
            </RecommendButtonText>
          </RecommendButton>
        )}
      </ButtonWrap>
    </Wrap>
  );
};

export default RecommendMakersMap;

const MapView = styled.View`
  padding: 24px;
`;
const Wrap = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.grey[0]};
`;

const InnerWrap = styled.View`
  padding: 0px 24px;
`;

const NameText = styled(Typography).attrs({text: 'Title03SB'})`
  color: ${({theme}) => theme.colors.grey[2]};
`;

const AddressText = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme}) => theme.colors.grey[4]};
`;

const DeliverySpotText = styled(Typography).attrs({text: 'Title04SB'})`
  color: ${({theme}) => theme.colors.grey[2]};
  padding: 0px 24px;
  margin-bottom: 16px;
`;

const SpotText = styled(Typography).attrs({text: 'Body05R'})`
  color: ${({theme}) => theme.colors.grey[2]};
  margin: 24px 0px;
`;

const ThinBorder = styled.View`
  background-color: #f5f5f5;
  height: 1px;
`;

const Border = styled.View`
  background-color: ${({theme}) => theme.colors.grey[8]};
  height: 6px;
  margin: 24px 0px;
`;

const RecommendCount = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const RecommendCountText = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme}) => theme.colors.grey[2]};
  margin-left: 8px;
`;

const RecommendButton = styled.Pressable`
  background-color: white;
  border: 1px solid;
  border-color: ${({select}) => (select ? '#BDBAC1' : '#e4e3e7')};
  border-radius: 100px;
  padding: 17px 0px;
  align-items: center;
  position: absolute;
  bottom: 35px;
  width: 100%;
`;
const RecommendButtonText = styled(Typography).attrs({text: 'BottomButtonSB'})`
  color: ${({theme, select}) =>
    select ? theme.colors.grey[2] : theme.colors.grey[6]};
`;
const RecommendButtonCancelText = styled(Typography).attrs({
  text: 'BottomButtonR',
})`
  color: ${({theme}) => theme.colors.grey[4]};
`;

const SpotListView = styled.ScrollView`
  padding: 0px 24px;
`;

const SpotListWrap = styled.View`
  flex: 1;
  margin-bottom: 90px;
`;

const ButtonWrap = styled.View`
  margin: 0px 24px;
`;

const SpotWrap = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RecommendCancelButton = styled.Pressable`
  position: absolute;
  bottom: 44px;
  width: 100%;
  align-items: center;
`;

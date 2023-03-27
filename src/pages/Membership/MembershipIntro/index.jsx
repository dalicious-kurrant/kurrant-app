import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  View,
} from 'react-native';
import styled from 'styled-components/native';

import Button from '../../../components/Button';
import Images from '../../../components/Image';
import FastImage from 'react-native-fast-image';
import {PAGE_NAME as MembershipJoinPageName} from '../MembershipJoin';
import useGroupSpots from '../../../biz/useGroupSpots';
import useMembership from '../../../biz/useMembership';
import useUserInfo from '../../../biz/useUserInfo';
import {BespinMembershipImage} from '../../../assets';

export const PAGE_NAME = 'P__MEMBERSHIP__INTRO';
const {width} = Dimensions.get('screen');
const Pages = ({route}) => {
  const params = route.params;
  const [height, setHeight] = useState(0);
  const [isImageLoading, setImageLoading] = useState(false);
  const [eventSpotLoading, setEventSpotLoading] = useState(false);
  const {isUserInfo, isUserInfoLoading} = useUserInfo();
  const {
    getMembershipHistory,
    readableAtom: {membershipHistory},
  } = useMembership();
  const navigation = useNavigation();
  useEffect(() => {
    const resizeImage = async () => {
      setImageLoading(true);
      await Image.getSize(
        params.isFounders
          ? 'https://asset.kurrant.co/img/common/foundersmembership.png'
          : 'https://asset.kurrant.co/img/common/kurrantmembership.png',
        (w, h) => {
          setHeight(h * (width / w));
        },
      );
      setImageLoading(false);
    };
    resizeImage();
  }, []);
  //베스핀 글로벌 체크
  useEffect(() => {
    const getHistory = async () => {
      setEventSpotLoading(true);
      await getMembershipHistory();
      setEventSpotLoading(false);
    };
    getHistory();
  }, [isUserInfo]);
  if (isImageLoading || isUserInfoLoading || eventSpotLoading) {
    return <ActivityIndicator size={'large'} />;
  }
  return (
    <Container>
      <ScrollView>
        <FastImage
          style={{width: width, height: height - 100}}
          source={
            isUserInfo?.email.includes('@bespinglobal.com') &&
            membershipHistory.length < 1
              ? BespinMembershipImage
              : {
                  uri: params.isFounders
                    ? 'https://asset.kurrant.co/img/common/foundersmembership.png'
                    : 'https://asset.kurrant.co/img/common/kurrantmembership.png',
                  priority: FastImage.priority.high,
                }
          }
        />
        <ButtonSame>
          {/* <Button type='yellow' label="멤버십 가입하기"  onPressEvent={()=>{
                    navigation.navigate(MembershipJoinPageName);
                  }}/> */}
          <View style={{width: width, height: 150}}></View>
        </ButtonSame>
      </ScrollView>
      <ButtonContainer>
        <Button
          type="yellow"
          label="멤버십 가입하기"
          onPressEvent={() => {
            navigation.navigate(MembershipJoinPageName);
          }}
        />
      </ButtonContainer>
    </Container>
  );
};

export default Pages;

const Container = styled.View`
  width: ${width}px;
  background-color: white;
`;

const ButtonSame = styled.View`
  margin-bottom: 24px;
  margin-left: 20px;
  margin-right: 20px;
`;
const ButtonContainer = styled.View`
  position: absolute;
  z-index: 2;
  bottom: 35px;
  padding-left: 20px;
  padding-right: 20px;
`;

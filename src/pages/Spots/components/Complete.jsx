import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import styled from 'styled-components';

import {
  alramButtonText,
  alramDscText,
  alramImage,
  alramTitleText,
  subButtonText,
} from './data';
import Close from '../../../assets/icons/Map/close20.svg';
import Button from '../../../components/Button';
import Typography from '../../../components/Typography';
import {useGetUserInfo} from '../../../hook/useUserInfo';
import {PAGE_NAME as MembershipIntroPageName} from '../../../pages/Membership/MembershipIntro';
import {SCREEN_NAME} from '../../../screens/Main/Bnb';
import {height} from '../../../theme';
import {PAGE_NAME as BuyMealPageName} from '../../Main/Bnb/BuyMeal/Main';
import {PAGE_NAME as SpotTypePage} from '../SpotType';

export const PAGE_NAME = 'COMPLETE_PAGE';
const Complete = ({route}) => {
  const navigation = useNavigation();

  const {
    data: {data: isUserInfo},
  } = useGetUserInfo();
  const type = route?.params?.type;
  console.log(type, 'type');
  const nextUseButton = () => {
    navigation.navigate(SCREEN_NAME);
  };

  const buyMealButton = () => {
    navigation.navigate(BuyMealPageName);
  };
  const membershipButton = () => {
    navigation.navigate(MembershipIntroPageName, {
      isFounders: isUserInfo?.leftFoundersNumber > 0,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {!(type === 'noAlramNoSpot' || type === 'noDeliveryNoSpot') && (
        <CloseButton onPress={nextUseButton}>
          <Close />
        </CloseButton>
      )}
      <Wrap showsVerticalScrollIndicator={false}>
        <Contents>
          <Title>{alramTitleText(type)}</Title>
          {alramImage(type)}
          <Desc>
            {type === 'usedMembership' && isUserInfo?.name}
            {alramDscText(type)}
          </Desc>
        </Contents>
      </Wrap>
      <ButtonWrap>
        <Button
          icon={type === 'mySpotCompleteMembership' && 'plus'}
          label={alramButtonText(type)}
          onPressEvent={() => {
            if (
              type === 'mySpotCompleteNotMembership' ||
              type === 'noAlarmNotUsedMembership' ||
              type === 'notUsedMembership' ||
              type === 'noSpot'
            ) {
              membershipButton();
            }
            if (type === 'noAlarmUsedMembership') {
              nextUseButton();
            }
            if (type === 'mySpotCompleteMembership') {
              buyMealButton();
            }
            if (
              type === 'noDeliveryNoSpot' ||
              type === 'sharSpotAppication' ||
              type === 'noAlramNoSpot'
            ) {
              navigation.navigate(SpotTypePage);
            }
          }}
        />
        <Pressable onPress={nextUseButton}>
          <ButtonText>{subButtonText(type)}</ButtonText>
        </Pressable>
      </ButtonWrap>
    </View>
  );
};

export default Complete;

const Wrap = styled.ScrollView`
  background-color: white;
  position: relative;
  margin-bottom: 120px;
`;

const Title = styled(Typography).attrs({text: 'Title02SB'})`
  color: ${({theme}) => theme.colors.grey[2]};
  text-align: center;
  margin-bottom: 24px;
`;
const Desc = styled(Typography).attrs({text: 'Body05R'})`
  color: ${({theme}) => theme.colors.grey[4]};
  text-align: center;
  margin-top: 24px;
`;

const Contents = styled.View`
  align-items: center;
  margin-top: ${height * 204}px;
  padding-bottom: 50px;
`;

const ButtonText = styled(Typography).attrs({text: 'BottomButtonR'})`
  color: ${({theme}) => theme.colors.grey[4]};
  margin-top: 21px;
`;

const ButtonWrap = styled.View`
  margin: 0px 20px;
  align-items: center;
  position: absolute;
  bottom: 51px;
`;

const CloseButton = styled.Pressable`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 24px;
  top: 52px;

  z-index: 1;
`;

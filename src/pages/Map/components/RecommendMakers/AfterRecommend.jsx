import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Pressable} from 'react-native';
import styled from 'styled-components';

import {PAGE_NAME as RecommendMakersMapPageName} from './SearchResult';
import AfterRecommendIcon from '../../../../assets/icons/Map/afterRecommend.svg';
import Button from '../../../../components/Button';
import Typography from '../../../../components/Typography';
import {SCREEN_NAME} from '../../../../screens/Main/Bnb';
export const PAGE_NAME = 'AFTER_RECOMMEND';

const AfterRecommend = () => {
  const navigation = useNavigation();
  return (
    <Wrap>
      <Contents>
        <RecommendCountText>
          메이커스 추천 완료!{'\n'}빨리 오픈하도록 노력할게요!
        </RecommendCountText>
        <AfterRecommendIcon />
      </Contents>
      <ButtonWrap>
        <Button
          label="메이커스 더 추천하기"
          onPressEvent={() =>
            navigation.navigate(RecommendMakersMapPageName, {
              from: 'completeRecommend',
            })
          }
        />
        <Pressable onPress={() => navigation.navigate(SCREEN_NAME)}>
          <ButtonText>홈으로 가기</ButtonText>
        </Pressable>
      </ButtonWrap>
    </Wrap>
  );
};

export default AfterRecommend;

const Wrap = styled.View`
  background-color: white;
  flex: 1;
`;

const RecommendCountText = styled(Typography).attrs({text: 'Title02SB'})`
  color: ${({theme}) => theme.colors.grey[2]};
  text-align: center;
  margin-bottom: 24px;
`;

const Contents = styled.View`
  align-items: center;
  padding-top: 115px;
  flex: 1;
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

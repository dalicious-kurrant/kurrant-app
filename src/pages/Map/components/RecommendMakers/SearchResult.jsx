import {useNavigation} from '@react-navigation/native';
import {useAtom} from 'jotai';
import {useEffect, useLayoutEffect, useState} from 'react';
import React from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import styled from 'styled-components';

import {mapApis} from '../../../../api/map';
import {shareSpotApis} from '../../../../api/shareSpot';
import Typography from '../../../../components/Typography';
import {userLocationAtom} from '../../../../utils/store';
import Location from '../../Location';
import Search from '../../Search';
import AddressList from '../AddressList';
import AddressShareSpotList from '../AddressShareSpotList';
import NoResult from '../NoResult';

export const PAGE_NAME = 'RECOMMEND_MAKERS_SEARCH_RESULT';
const SearchResult = ({route}) => {
  const from = route?.params?.from;
  const [screen, setScreen] = useState(true); // 검색 결과 유무 전환
  const [data, setData] = useState([]);
  const [focus, setFocus] = useState(false);
  const [text, setText] = useState('');

  const searchPress = async () => {
    const res = await mapApis.getMakersAddress(text);

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

  return (
    <Wrap>
      <View>
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

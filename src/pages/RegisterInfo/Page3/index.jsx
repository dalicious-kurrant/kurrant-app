import styled from 'styled-components';

import Button from '../../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';

import ProgressBar from '~components/ProgressBar7';

import {PAGE_NAME as RegisterInfoPage4PageName} from '../Page4';
import {finalRegisterAtom} from '../store';
import {useAtom} from 'jotai';
import Typography from '~components/Typography';
import ButtonContainer from '../components/button/ButtonContainer';

export const PAGE_NAME = 'P__REGISTER_INFO_PAGE3';

const Pages = () => {
  // const [clickAvaliable, setClickAvaliable] = useState(false);

  const [finalRegister, setFinalRegister] = useAtom(finalRegisterAtom);

  const navigation = useNavigation();

  const [page3Input, setPage2Input] = useState([]);

  // useEffect(() => {
  //   if (page3Input.length > 0) {
  //     setClickAvaliable(true);
  //   } else {
  //     setClickAvaliable(false);
  //   }
  // }, [page3Input]);

  const handlePress = () => {
    console.log({
      ...finalRegister,
      allergyInfo: page3Input.join(','),
    });
    setFinalRegister({
      ...finalRegister,
      allergyInfo: page3Input.join(','),
    });

    navigation.navigate(RegisterInfoPage4PageName);
  };

  const handleButtonClicked = list => {
    setPage2Input([...list]);
  };

  const [value, setValue] = useState('');

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <Container
      paddingHorizontal={20}
      styles={{
        position: 'relative',
      }}>
      <ScrollViewContainer showsVerticalScrollIndicator={false}>
        <ProgressBar progress={3} />

        <TitleWrap>
          <Title>알러지 정보</Title>
          <SemiTitle>복수선택이 가능해요</SemiTitle>
        </TitleWrap>

        <ButtonContainer
          dataList={[
            {id: 1, name: '잣'},
            {id: 2, name: '우유'},
            {id: 3, name: '오징어'},
            {id: 4, name: '호두'},
            {id: 5, name: '중국s'},
            {id: 6, name: '인도네아'},
            {id: 7, name: '인도sss네시아'},
            {id: 8, name: '한'},
            {id: 9, name: '중s국s'},
            {id: 10, name: '인도네아'},
          ]}
          callback={handleButtonClicked}
          marginBottom={'24px'}
        />

        <InputWrap>
          <InputTitle>기타 내용(선택)</InputTitle>

          <Input
            style={{
              textAlignVertical: 'top',
            }}
            value={value}
            onChangeText={setValue}
            multiline
            numberOfLines={20}
            placeholder={'추가적으로 다른 알러지가 있다면 알려주세요!'}
          />
        </InputWrap>
      </ScrollViewContainer>

      <ButtonNext
        size="full"
        label="다음"
        text={'BottomButtonSB'}
        onPressEvent={() => {
          handlePress();
        }}
      />
    </Container>
  );
};
export default Pages;

const Container = styled.View`
  flex: 1;
  padding: 35px 20px;
  align-items: center;
  background-color: #ffffff;
`;

const ScrollViewContainer = styled.ScrollView`
  width: 100%;
  /* height: 90%; */
  background-color: #ffffff;
`;

const ButtonNext = styled(Button)`
  position: relative;
  bottom: 20px;
`;

const TitleWrap = styled.View`
  width: 100%;
  margin-top: 29px;
  margin-bottom: 24px;
`;
const InputWrap = styled.View``;
const InputTitle = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme}) => theme.colors.grey[2]};
  margin-bottom: 8px;
`;
const Input = styled.TextInput`
  border: 1px solid ${props => props.theme.colors.grey[7]};
  padding: 17px 20px;
  height: 168px;
  border-radius: 14px;
`;

const Title = styled(Typography).attrs({text: 'Title04SB'})`
  color: ${({theme}) => theme.colors.grey[2]};
  margin-bottom: 8px;
`;
const SemiTitle = styled(Typography).attrs({text: 'CaptionR'})`
  color: ${({theme}) => theme.colors.grey[4]};
`;

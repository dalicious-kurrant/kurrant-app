import {Text} from 'react-native';
import styled from 'styled-components';

import Button from '../../../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';

import ProgressBar from '~components/ProgressBar7';

import {PAGE_NAME as RegisterInfoFinishPageName} from '../../Finish';
import {PAGE_NAME as RegisterInfoPage8PageName} from '../Page8';

import useGetRegisterInfo from '../../../../biz/useRegisterInfo/getRegisterIist/hook';

import {finalRegisterAtom} from '../../store';
import {useAtom} from 'jotai';
import {getUnselectedFoodIdList} from '../logic';

import TitleBox from '../components/TitleBox';
import ImageBox from '../components/ImageBox.jsx/ImageBox';
import {selectedFoodIdPage7Atom, unselectedFoodIdPage7Atom} from '../store';

// import TitleBox from '../components/TitleBox';
// import {
//   selectedFoodIdPage10Atom,
//   selectedFoodIdPage7Atom,
//   selectedFoodIdPage8Atom,
//   selectedFoodIdPage9Atom,
// } from '../../Page7/store';

export const PAGE_NAME = 'P__REGISTER_INFO_PAGE7';

const Pages = () => {
  const [finalRegister, setFinalRegister] = useAtom(finalRegisterAtom);
  const [clickAvaliable, setClickAvaliable] = useState(false);

  // const {getFoodImageList, foodImageList} = useGetRegisterInfo();
  const {getFoodImageList, foodImageListPage7} = useGetRegisterInfo();

  const [selectedFoodIdPage7, setSelectedFoodIdPage7] = useAtom(
    selectedFoodIdPage7Atom,
  );
  const [unselectedFoodIdPage7, setUnselectedFoodIdPage7] = useAtom(
    unselectedFoodIdPage7Atom,
  );

  useEffect(() => {
    getFoodImageList();
  }, []);

  // 뒤로 돌아올떄 체크된 그림들 다시 보이게 하기

  useEffect(() => {
    if (selectedFoodIdPage7.length >= 3) {
      setClickAvaliable(true);
    } else {
      setClickAvaliable(false);
    }
  }, [selectedFoodIdPage7]);

  const navigation = useNavigation();

  // useEffect(() => {
  //   console.log(finalRegister);
  // }, [finalRegister]);

  const handlePress = () => {
    // page7일떄, page8일떄
    // selecteedIdList비우기, final에 데이터 집어넣기, 다음 컴포넌트로 넘어가기

    const unselectedList = getUnselectedFoodIdList(
      selectedFoodIdPage7,
      foodImageListPage7,
    );

    // setUnselectedFoodIdPage7(unselectedList);

    // console.log('야야야야');

    // console.log({
    //   ...finalRegister,

    //   useSelectTextDataList: [
    //     {selectedFoodId: selectedFoodIdPage7, unselectedFoodId: unselectedList},
    //   ],
    // });

    setFinalRegister({
      ...finalRegister,

      userSelectTestDataList: [
        {
          selectedFoodId: selectedFoodIdPage7.join(','),
          unselectedFoodId: unselectedList.join(','),
        },
      ],
    });

    navigation.navigate(RegisterInfoPage8PageName);
  };

  //

  return (
    <Container
      paddingHorizontal={24}
      styles={{
        position: 'relative',
      }}>
      <ScrollViewContainer showsVerticalScrollIndicator={false}>
        <ProgressBar progress={7} />
        <TitleBox
          num={1}
          title={`아래 음식 중 마음에 드는 \n음식 3개를 선택해 주세요`}
        />

        {/* foodImageLIstPage가 undefined일 경우 */}

        {/* 로딩중일때 처리해야됨 */}

        {Array.isArray(foodImageListPage7) && foodImageListPage7.length > 0 ? (
          <ImageBox
            selectLimit={3}
            foodImageList={foodImageListPage7}
            selectedIdList={selectedFoodIdPage7}
            setSelectedIdList={setSelectedFoodIdPage7}
          />
        ) : (
          <Text>선택 가능한 음식 사진이 없습니다 관리자에게 문의해주세요</Text>
        )}
      </ScrollViewContainer>
      <ButtonNext
        size="full"
        label="다음"
        text={'BottomButtonSB'}
        disabled={!clickAvaliable}
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
  /* padding: 35px 20px; */
  /* padding: 15px 20px; */
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
  bottom: 35px;
`;

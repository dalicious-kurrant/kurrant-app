import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';

import Button from '../Button';
import Typography from '../Typography';

/**
 * @param {object} props
 * @param {boolean} props.modalVisible
 * @param {function} props.setModalVisible
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.buttonTitle1
 * @param {string} props.buttonTitle2
 * @param {'grey1' | 'grey2' | 'grey3' | 'grey7' | 'white' | 'yellow' | 'login'} props.buttonType1
 * @param {'grey1' | 'grey2' | 'grey3' | 'grey7' | 'white' | 'yellow' | 'login'} props.buttonType2
 * @param {function} props.onPressEvent1
 * @param {function} props.onPressEvent2
 * @returns
 */
const Component = props => {
  const { modalVisible, setModalVisible ,title='옵션 선택', description='',buttonTitle1="모달버튼" ,buttonTitle2="모달버튼" ,buttonType1="yellow" , buttonType2="grey2" ,onPressEvent1 = ()=> {},onPressEvent2} = props;
  //멀티 셀렉터시 이용
  // const [selected, setSelected] = useState(new Map());
  


  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const upY = useRef(new Animated.Value(0)).current;
  const [up, setUP] = useState(0);
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });
  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });
  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });


  useEffect(() => {
    if (props.modalVisible) {
      resetBottomSheet.start();
    }
  }, [props.modalVisible, resetBottomSheet]);
  useEffect(() => {
    const id = upY.addListener(state => {
      setUP(state.value);
    });
    return () => {
      upY.removeListener(id);
    };
  }, [up, upY]);
  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  };
  return (
    <Modal visible={modalVisible} animationType={'slide'} transparent>
      <Overlay>
        <TouchableWithoutFeedback onPress={closeModal}>
          <Background />
        </TouchableWithoutFeedback>
        <AnimatedView
          style={{
            transform: [{ translateY: translateY }],
            width: Dimensions.get('screen').width,
          }}>
          {/* <DragButton
            onPressIn={pressInUp}
            onPressOut={pressOutUp}>
            <DragButtonView/>
          </DragButton> */}
          <BottomSheetTitleView>
            <BottomSheetTitle>
              {title}
            </BottomSheetTitle>
            {description !== '' && <BottomSheetDecs>
              {description}
            </BottomSheetDecs>}
          </BottomSheetTitleView>
         {!onPressEvent2 ? 
         <Button label={buttonTitle1} size="modalFull" type={buttonType1} text={"Button09SB"} onPressEvent1={onPressEvent1}/>
         :
         <HalfBox>
          <ButtonMargin>
           <Button label={buttonTitle1} size="modalHalf"  type={buttonType1} text={"Button09SB"} onPressEvent={onPressEvent1}/>
          </ButtonMargin>
          <ButtonMargin>
           <Button label={buttonTitle2} size="modalHalf" type={buttonType2} text={"Button09SB"} onPressEvent={onPressEvent2}/>
          </ButtonMargin>
         </HalfBox>
         }
        </AnimatedView>
      </Overlay>
    </Modal>
  );
};

const Overlay =styled.View`
  position: relative;
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.7);
`
const Background = styled.View`
  flex: 1;
`

const AnimatedView = styled(Animated.View)`
  align-items: center;
  background-color: white;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding-top: 20px;
  padding-bottom: 56px;
`
const ButtonMargin = styled.View`
  margin: 0px 3px;
`
const BottomSheetTitleView = styled.View`
  width: 100%;
  padding:0px 24px;
  padding-top: 18px;
  align-items: center;
`;
const BottomSheetTitle = styled(Typography).attrs({text : 'Title03SB'})`
  margin-bottom: 6px;
  max-width:279px;
  text-align:center;
`;
const BottomSheetDecs = styled(Typography).attrs({text : 'Body06R'})`
  margin-bottom: 22px;
  max-width:279px;
  text-align:center;
`;
const HalfBox = styled.View`
  width: 100%;
  flex-direction:row;
  justify-content: center;
`

export default Component;
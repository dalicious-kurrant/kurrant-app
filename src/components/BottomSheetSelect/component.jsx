import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {it, th} from 'date-fns/locale';
import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  Pressable,
  PanResponder,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import CheckedIcon from '../../assets/icons/BottomSheet/Checked.svg';
import Label from '../Label';
import Typography from '../Typography';
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const BottomSheetSpot = props => {
  const {
    firstSnap = '35%',
    modalVisible,
    setModalVisible,
    title = '옵션 선택',
    description = '',
    data = {},
    selected,
    setSelected,
    onPressEvent = () => {},
    userSpotId,
    booleanValue,
    onPressEvent2 = () => {},
    setValue = () => {},
  } = props;
  //멀티 셀렉터시 이용
  // const [selected, setSelected] = useState(new Map());

  const navigation = useNavigation();

  const onSelect = useCallback(
    (id, text) => {
      //멀티 셀렉터시 이용
      // const newSelected = new Map(selected);
      // newSelected.set(id, !selected.get(id));
      if (setSelected) setSelected(id);
      if (setValue) setValue(text);
      setModalVisible(false);
    },
    [setModalVisible, setSelected],
  );

  const panY = useRef(new Animated.Value(screenHeight)).current;
  const [snap, setSnap] = useState(0);
  const [y, setY] = useState(0);
  const snapPoints = useMemo(() => [firstSnap, '90%'], [firstSnap]);
  const [contentScroll, setContentScroll] = useState(true);
  const [scrollStart, setScrollStart] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(10);

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 50,
    useNativeDriver: true,
  });
  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 50,
    useNativeDriver: true,
  });
  const list = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    }),
  );
  const handleSheetChange = useCallback(index => {
    setSnap(index);
  }, []);
  const handleSnapPress = useCallback(index => {
    list.current?.snapToIndex(index);
  }, []);
  const pressOutUp = e => {
    e.stopPropagation();
    const {pageY} = e.nativeEvent;
    if (pageY > y + 50) {
      if (snap === 0) {
        closeModal();
      } else {
        if (contentScroll && scrollStart == 0) {
          handleSnapPress(0);
        }
      }
    } else if (pageY < y - 50) {
      handleSnapPress(1);
    } else {
      if (contentScroll && scrollStart == 0) {
        handleSnapPress(0);
      }
    }
  };
  const pressInUp = e => {
    e.stopPropagation();
    const {pageY} = e.nativeEvent;
    setY(pageY);
  };

  useEffect(() => {
    if (props.modalVisible) {
      resetBottomSheet.start();
    }
  }, [props.modalVisible, resetBottomSheet]);
  console.log(data);
  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  };
  return (
    <Modal visible={modalVisible} animationType={'fade'} transparent>
      <Overlay onPressIn={pressInUp} onPressOut={pressOutUp}>
        <GestureHandlerRootView style={{height: '100%'}}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <Background />
          </TouchableWithoutFeedback>
          <BottomSheet
            ref={list}
            snapPoints={snapPoints}
            onChange={handleSheetChange}
            style={{
              marginBottom: 50,
            }}>
            <BottomSheetTitleView>
              <BottomSheetTitle>{title}</BottomSheetTitle>
              {description !== '' && (
                <BottomSheetDecs>{description}</BottomSheetDecs>
              )}
            </BottomSheetTitleView>
            <BottomSheetFlatList
              data={data}
              scrollEnabled={snap === 1}
              onScrollBeginDrag={e => {
                setScrollStart(e.nativeEvent.contentOffset.y);
              }}
              onMomentumScrollBegin={e => {
                if (scrollEnd === 0) {
                  handleSnapPress(0);
                }
              }}
              onScrollEndDrag={e => {
                setContentScroll(e.nativeEvent.contentOffset.y === 0);
                setScrollEnd(e.nativeEvent.contentOffset.y);
                if (e.nativeEvent.contentOffset.y === 0) {
                  if (contentScroll) {
                    handleSnapPress(0);
                  }
                }
              }}
              renderItem={({item}) => (
                <ContentItemContainer
                  onPressIn={pressInUp}
                  onPressOut={pressOutUp}
                  onPress={e => {
                    e.stopPropagation();
                    if (item.status === undefined || item.status === true) {
                      console.log(item);
                      onSelect(item.id, item.text);
                      onPressEvent(item.id);
                    }
                  }}>
                  {item?.status === undefined ? (
                    selected === item.id ? (
                      <ContentItemBox>
                        <ContentItemText>{item.text}</ContentItemText>
                        <CheckedIcon />
                      </ContentItemBox>
                    ) : (
                      <ContentItemText>{item.text}</ContentItemText>
                    )
                  ) : item?.status ? (
                    selected === item.id ? (
                      <ContentItemBox>
                        <ContentItemText>{item.text}</ContentItemText>
                        <CheckedIcon />
                      </ContentItemBox>
                    ) : (
                      <ContentItemText>{item.text}</ContentItemText>
                    )
                  ) : (
                    <ContentDisabledItemBox>
                      <LabelWrap>
                        <Label label={'품절'} />
                      </LabelWrap>
                      <ContentItemDiabledText>
                        {item.text}
                      </ContentItemDiabledText>
                    </ContentDisabledItemBox>
                  )}
                </ContentItemContainer>
              )}
              keyExtractor={item => item.id.toString()}
            />
            <ManagePressView />
          </BottomSheet>
        </GestureHandlerRootView>
        {booleanValue && (
          <ManagePressView
            onPress={() => {
              onPressEvent2(setModalVisible(false));
            }}>
            <ContentItemText>스팟 관리하기</ContentItemText>
          </ManagePressView>
        )}
      </Overlay>
    </Modal>
  );
};

const Overlay = styled.Pressable`
  position: relative;
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.7);
`;

const Background = styled.View`
  flex: 1;
`;

const AnimatedView = styled(Animated.View)`
  justify-content: center;
  align-items: center;
  background-color: white;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding-top: 20px;
`;

const DragButton = styled.TouchableOpacity`
  flex: 1;
`;

const DragButtonView = styled.View`
  background-color: white;
  width: 40px;
  height: 5px;
  border-radius: 10px;
`;

const BottomSheetTitleView = styled.View`
  width: 100%;
  padding: 0px 24px;
`;

const BottomSheetTitle = styled(Typography).attrs({text: 'Title03SB'})`
  margin-bottom: 6px;
`;

const BottomSheetDecs = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme}) => theme.colors.grey[4]};
`;

const ContentItemContainer = styled.Pressable`
  width: ${Dimensions.get('screen').width}px;
  height: 60px;
  padding: 19px 24px;
  padding-left: 40px;
`;

const ItemContainer = styled.View`
  width: ${Dimensions.get('screen').width}px;
  height: 60px;
  padding: 19px 24px;
`;

const ContentItemBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ContentDisabledItemBox = styled.View`
  flex-direction: row;
  align-items: center;
`;
const ContentItemText = styled(Typography).attrs({text: 'Body05R'})``;
const ContentItemDiabledText = styled(Typography).attrs({text: 'Body05R'})`
  color: ${({theme}) => theme.colors.grey[5]};
`;

const GroupName = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme}) => theme.colors.grey[4]};
`;
const LabelWrap = styled.View`
  margin-right: 8px;
`;
const Border = styled.View`
  width: 100%;
  height: 1px;
  margin-top: 12px;
  background-color: ${({theme}) => theme.colors.grey[8]};
`;

const ManagePressView = styled.Pressable`
  width: ${Dimensions.get('screen').width}px;
  height: 60px;
  padding: 19px 24px;
  background-color: white;
`;

export default BottomSheetSpot;

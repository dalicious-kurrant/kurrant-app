/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAtom, useAtomValue} from 'jotai';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  StatusBar,
  AppState,
  Platform,
  Linking,
  Text,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Sound from 'react-native-sound';
import VersionCheck from 'react-native-version-check';
import {useQueryClient} from 'react-query';
import styled, {css, useTheme} from 'styled-components/native';
import BottomModal from '~components/BottomModal';
import {BowlIcon} from '~components/Icon';
import {PAGE_NAME as mealDetailPageName} from '~pages/Main/Bnb/MealDetail/Main';

import MealInfoComponent from './MealInfoComponent/MealInfoComponent';
import {BespinMembers, FoundersMembers} from '../../../../../assets';
import ArrowIcon from '../../../../../assets/icons/Home/arrowDown.svg';
import BellIcon from '../../../../../assets/icons/Home/bell.svg';
import CalendarIcon from '../../../../../assets/icons/Home/calendar.svg';
import CsIcon from '../../../../../assets/icons/Home/cs.svg';
import MakerRecommendIcon from '../../../../../assets/icons/Home/makers.svg';
import MembershipIcon from '../../../../../assets/icons/Home/membership.svg';
import MembersIcon from '../../../../../assets/icons/Home/membersIcon.svg';
import PlusIcon from '../../../../../assets/icons/Home/plus.svg';
import QRIcon from '../../../../../assets/icons/Home/qr.svg';
import useAuth from '../../../../../biz/useAuth';
import {weekAtom} from '../../../../../biz/useBanner/store';
import useFoodDaily from '../../../../../biz/useDailyFood/hook';
import useGroupSpots from '../../../../../biz/useGroupSpots/hook';
import {isCancelSpotAtom} from '../../../../../biz/useGroupSpots/store';
import useMembership from '../../../../../biz/useMembership';
import Balloon from '../../../../../components/BalloonHome';
import BottomSheetSpot from '../../../../../components/BottomSheetSpot';
import Calendar from '../../../../../components/Calendar';
import ModalOneAnnouncement from '../../../../../components/ModalOneAnnouncement/ModalOneAnnouncement';
import QRCodeComponent from '../../../../../components/QRCode/QRCode';
import Toast from '../../../../../components/Toast';
import Typography from '../../../../../components/Typography';
import {
  useGetDailyfoodDateList,
  useGetDailyfoodList,
} from '../../../../../hook/useDailyfood';
import {useGetOrderMeal} from '../../../../../hook/useOrder';
import {useGetPopupList} from '../../../../../hook/usePopup';
import {useGroupSpotList} from '../../../../../hook/useSpot';
import {
  useGetPrivateMembership,
  useGetUserInfo,
} from '../../../../../hook/useUserInfo';
import {getStorage, setStorage} from '../../../../../utils/asyncStorage';
import {formattedWeekDate} from '../../../../../utils/dateFormatter';
import jwtUtils from '../../../../../utils/fetch/jwtUtill';
import {
  sseType6Atom,
  sseType7Atom,
} from '../../../../../utils/sse/sseLogics/store';
import useSse from '../../../../../utils/sse/sseLogics/useSse';
import SseRedDot from '../../../../../utils/sse/SseService/SseRedDot/SseRedDot';
import {mainDimAtom} from '../../../../../utils/store';
import {PAGE_NAME as ApartRegisterSpotPageName} from '../../../../Group/GroupApartment/SearchApartment/AddApartment/DetailAddress';
import {PAGE_NAME as GroupManagePageName} from '../../../../Group/GroupManage/SpotManagePage';
import {PAGE_NAME as RecommendMakersMapPageName} from '../../../../Map/components/RecommendMakers/SearchResult';
import {PAGE_NAME as MembershipInfoPageName} from '../../../../Membership/MembershipInfo';
import {PAGE_NAME as MembershipIntro} from '../../../../Membership/MembershipIntro';
import {PAGE_NAME as NotificationCenterName} from '../../../../NotificationCenter';
import useShowRegisterInfo from '../../../../RegisterInfo/ShowRegisterInfo/useShowRegisterInfo';
import {PAGE_NAME as PrivateInvitePageName} from '../../../../Spots/spotGuide/InviteSpot';
import {PAGE_NAME as SpotGuidePageName} from '../../../../Spots/spotGuide/SpotGuide';
import {PAGE_NAME as SpotTypePageName} from '../../../../Spots/SpotType';
import {PAGE_NAME as LoginPageName} from '../../../Login/Login';
import {PAGE_NAME as FAQListDetailPageName} from '../../../MyPage/FAQ';
import {PAGE_NAME as BuyMealPageName} from '../../BuyMeal/Main';
import {foodDeliveryTimeFilter} from '../../BuyMeal/util/time';
import {PAGE_NAME as DietRepoMainPageName} from '../../DietRepo/Main';
import useGetDietRepo from '../../DietRepo/useGetDietRepo';
import SkeletonUI from '../../Home/Skeleton';
import {PAGE_NAME as MealMainPageName} from '../../Meal/Main';

const GOOGLE_PLAY_STORE_LINK = 'market://details?id=com.dalicious.kurrant';
// 구글 플레이 스토어가 설치되어 있지 않을 때 웹 링크
const GOOGLE_PLAY_STORE_WEB_LINK =
  'https://play.google.com/store/apps/details?id=com.dalicious.kurrant';
// 애플 앱 스토어 링크
const APPLE_APP_STORE_LINK = 'itms-apps://itunes.apple.com/us/app/id1663407738';
// 애플 앱 스토어가 설치되어 있지 않을 때 웹 링크
const APPLE_APP_STORE_WEB_LINK = 'https://apps.apple.com/us/app/id1663407738';

export const PAGE_NAME = 'P_MAIN__BNB__HOME';
const Pages = () => {
  //

  const navigation = useNavigation();
  const themeApp = useTheme();
  const {setMorning, setLunch, setDinner, setDiningTypes} = useFoodDaily();
  const queryclient = useQueryClient();
  const [isVisible, setIsVisible] = useState(true);
  const [userGroupSpot, setUserGroupSpot] = useState();
  const [spotId, setSpotId] = useState();
  const weekly = useAtomValue(weekAtom);
  const {data: isUserInfo} = useGetUserInfo();
  const currentVersion = VersionCheck.getCurrentVersion();
  const [dailyfoodData, setDailyfoodData] = useState();
  const [selected, setSelected] = useState();
  const userName = isUserInfo?.data?.name;
  const userSpot = isUserInfo?.data?.spot;
  const userGroupName = isUserInfo?.data?.group;
  const userSpotId = isUserInfo?.data?.spotId;
  const clientId = isUserInfo?.data?.groupId;
  const spotNameCut = userSpot?.includes(null);
  const useSpotName = spotNameCut ? userSpot.split('null')[0] : userSpot;

  const [coinSound, setCoinSound] = useState(null);

  // const {data: dailyfoodData, refetch: dailyfoodRefetch} = useGetDailyfood(
  //   userSpotId,
  //   formattedWeekDate(new Date()),
  // );
  const [qrOpen, setQrOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [isOneAnnouncementModalVisible, setIsOneAnnouncementModalVisible] =
    useState(false);
  const [showDim, setShowDim] = useAtom(mainDimAtom);

  const [show, setShow] = useState(false);

  const [appState, setAppState] = useState();
  const [eventSpotLoading, setEventSpotLoading] = useState(false);
  const [isCancelSpot, setIsCancelSpot] = useAtom(isCancelSpotAtom);
  const toast = Toast();

  const isModalOpenAtLeastOnce = useRef(false);

  const {sseType5, confirmSseIsRead, sseHistory, sseHistoryRefetch} = useSse();
  const [sseType6] = useAtom(sseType6Atom);
  const [sseType7List, setSseType7List] = useState([]);
  const [sseType7] = useAtom(sseType7Atom);

  useEffect(() => {
    sseHistoryRefetch();
    refetchGroupSpotList();
  }, [!!sseType7.id]);

  useEffect(() => {
    const result = [
      ...new Set(
        sseHistory
          ?.filter(v => v.type === 7)
          .map(v => v.groupId)
          .filter(v => (v ? v : undefined)),
      ),
    ];
    setSseType7List(result ? result : []);
  }, [sseHistory]);

  useEffect(() => {
    if (!isModalOpenAtLeastOnce.current) {
      if (modalVisible) {
        isModalOpenAtLeastOnce.current = true;
      }
    } else {
      if (!modalVisible) {
        if (Array.isArray(sseType7List) && sseType7List.length > 0) {
          confirmSseIsRead({type: 7});
        }
      }
    }
  }, [modalVisible]);

  const VISITED_NOW_DATE = Math.floor(new Date().getDate());
  const nextWeek = weekly[1].map(el => formattedWeekDate(el));
  const {data: isPrivateMembership, refetch: privateMembershipRefetch} =
    useGetPrivateMembership();
  const intersection = nextWeek.filter(x => mealCheck?.includes(x));

  const date = formattedWeekDate(new Date());
  const {
    totalNutrition: {totalCalorie},
    dietRepoMainRefetch,
  } = useGetDietRepo(formattedWeekDate(new Date()), undefined, undefined);
  const {data: popupList} = useGetPopupList();

  const loadCoinSound = async () => {
    try {
      const sound = new Sound(
        require('../../../../../assets/sounds/coin.wav'),
        Platform.OS === 'android'
          ? Sound.MAIN_BUNDLE
          : Sound.MAIN_BUNDLE.bundlePath,
        error => {
          if (error) {
            return;
          }
        },
      );
      await sound.play();
      sound.release();
      setCoinSound(sound);
      return false;
    } catch (error) {
      throw error;
    }
  };
  const {
    getMembershipHistory,
    readableAtom: {membershipHistory},
  } = useMembership();
  const {
    data: orderMealList,
    refetch: orderMealRefetch,
    isFetching: orderMealListIsFetching,
  } = useGetOrderMeal(
    formattedWeekDate(weekly[0][0]),
    formattedWeekDate(
      weekly[weekly?.length - 1][weekly[weekly?.length - 1].length - 1],
    ),
  );
  const mealCheck = orderMealList?.data?.map(el => {
    return el.serviceDate;
  });
  const {
    saveFcmToken,
    readableAtom: {userRole},
  } = useAuth();
  const {
    // userGroupSpotCheck,
    // isUserGroupSpotCheck,
    userSpotRegister,
    groupSpotDetail,
  } = useGroupSpots();
  // const {
  //   data: dailyfoodDataList,
  //   refetch: dailyfoodListRefetch,
  //   isFetching: dailyfoodListIsFetching,
  // } = useGetDailyfoodList(
  //   selected !== undefined ? selected : isUserInfo?.data?.spotId,
  //   formattedWeekDate(weekly[0][0]),
  //   formattedWeekDate(weekly[weekly.length - 1][weekly[0].length - 1]),
  //   userRole,
  // );
  const {
    data: dailyfoodDataList,
    refetch: dailyfoodListRefetch,
    isFetching: dailyfoodListIsFetching,
  } = useGetDailyfoodDateList(
    selected !== undefined ? selected : isUserInfo?.data?.spotId,
    formattedWeekDate(weekly[0][0]),
    formattedWeekDate(weekly[weekly.length - 1][weekly[0].length - 1]),
    userRole,
  );
  const {data: isUserGroupSpotCheck, refetch: refetchGroupSpotList} =
    useGroupSpotList();
  useEffect(() => {
    if (isUserGroupSpotCheck?.data && navigation.isFocused()) {
      setUserGroupSpot(isUserGroupSpotCheck?.data);
    }
  }, [isUserGroupSpotCheck?.data]);

  useEffect(() => {
    const lunchData = dailyfoodData?.dailyFoodDtos.filter(
      x => x.diningType === 2,
    );
    const morningData = dailyfoodData?.dailyFoodDtos.filter(
      x => x.diningType === 1,
    );
    const dinnerData = dailyfoodData?.dailyFoodDtos.filter(
      x => x.diningType === 3,
    );
    setLunch(lunchData);
    setMorning(morningData);
    setDinner(dinnerData);
    setDiningTypes(
      dailyfoodDataList?.data?.diningTypes.map(dining => dining.diningType),
    );
  }, [dailyfoodData?.dailyFoodDtos, spotId, dailyfoodDataList?.data]);
  useEffect(() => {
    if (dailyfoodDataList?.data?.dailyFoodsByDate) {
      setMorning([]);
      setLunch([]);
      setDinner([]);
      const getDailyfoodData = dailyfoodDataList?.data?.dailyFoodsByDate.filter(
        v => v.serviceDate === formattedWeekDate(date),
      );
      setDailyfoodData(
        getDailyfoodData?.length > 0 ? getDailyfoodData[0] : null,
      );
    }
  }, [dailyfoodDataList?.data?.dailyFoodsByDate, date]);
  useEffect(() => {
    if (isUserInfo?.data && userGroupSpot && navigation.isFocused()) {
      if (
        isUserInfo?.data?.spotId === null &&
        userGroupSpot?.privateCount === 1
      ) {
        navigation.navigate(PrivateInvitePageName);
      } else if (
        isUserInfo?.data?.spotId === null &&
        (userGroupSpot?.shareSpotCount > 0 ||
          userGroupSpot?.mySpotCount > 0 ||
          userGroupSpot?.privateCount > 1)
      ) {
        setShowDim(true);
      } else if (
        isUserInfo?.data?.spotId === null &&
        userGroupSpot?.shareSpotCount === 0 &&
        userGroupSpot?.mySpotCount === 0 &&
        userGroupSpot?.privateCount === 0
      ) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: SpotGuidePageName,
            },
          ],
        });
      }
    }
  }, [isUserInfo?.data?.spotId, userGroupSpot]);
  useEffect(() => {
    if (selected) {
      dailyfoodListRefetch();
    }
  }, [selected]);

  useEffect(() => {
    if (
      isUserInfo?.data?.spotId === null &&
      (userGroupSpot?.shareSpotCount > 0 ||
        userGroupSpot?.mySpotCount > 0 ||
        userGroupSpot?.privateCount > 1) &&
      showDim === false
    ) {
      setModalVisible(true);
    }
  }, [showDim]);

  const handlePress = useCallback(async (url, alterUrl) => {
    // 만약 어플이 설치되어 있으면 true, 없으면 false
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // 설치되어 있으면
      await Linking.openURL(url);
    } else {
      // 앱이 없으면
      await Linking.openURL(alterUrl);
    }
  }, []);

  useEffect(() => {
    const handleShowModal = async () => {
      const VISITED_BEFORE_DATE = await getStorage('balloonTime');

      if (intersection.length === 0) {
        // setIsVisible(true);
      }
      if (
        intersection.length === 0 &&
        VISITED_BEFORE_DATE === VISITED_NOW_DATE
      ) {
        // setIsVisible(true);
      }
      if (
        intersection.length === 0 &&
        VISITED_BEFORE_DATE !== null &&
        VISITED_BEFORE_DATE !== VISITED_NOW_DATE
      ) {
        // setIsVisible(false);
      }
    };
    handleShowModal();

    if (coinSound === null) loadCoinSound();
  }, []);

  const closeBalloon = async () => {
    if (intersection.length === 0) {
      setIsVisible(false);
      const expiry = new Date();
      // +1일 계산
      const expiryDate = expiry.getDate() + 1;
      // 로컬스토리지 저장
      await setStorage('balloonTime', JSON.stringify(expiryDate));
    }
  };
  useEffect(() => {
    const getTokenData = async () => {
      const storage = JSON.parse(await getStorage('token'));
      return jwtUtils.isAuth(storage?.accessToken);
    };
    const getHistory = async () => {
      if (await getTokenData()) await getMembershipHistory();
    };
    getHistory();
  }, [isUserInfo?.data]);
  useFocusEffect(
    useCallback(() => {
      try {
        orderMealRefetch();
      } catch (e) {
        Alert.alert(e.toString()?.replace('error:'));
      }
    }, [isCancelSpot, appState]),
  );

  useEffect(() => {
    // checkPermission();
    // Check whether an initial notification is available
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage) {
        console.log(remoteMessage.data.page, '백그라운드');
        if (remoteMessage.data.page !== 'Home') {
          if (remoteMessage.data.page === 'BUY_MEAL_PAGE') {
            return navigation.navigate(remoteMessage.data.page, {
              date: date,
            });
          }
          if (remoteMessage.data.page === 'S_MAIN__REVIEW') {
            navigation.navigate(remoteMessage.data.page, {
              from: 'point',
              id: remoteMessage.data.reviewId,
            });
          }
          if (remoteMessage.data.page === 'P_MAIN__MYPAGE__WRITTENREVIEW') {
            return navigation.navigate('S_MAIN__REVIEW');
          }
          if (remoteMessage.data.page === 'P__MY_PAGE__PUBLIC_NOTICE') {
            return navigation.navigate('S_MAIN__NOTICE', {
              from: 'public',
            });
          }
          if (remoteMessage.data.page === 'P__MY_PAGE__SPOT_NOTICE') {
            return navigation.navigate('S_MAIN__NOTICE', {
              from: 'spot',
            });
          }
          navigation.navigate(remoteMessage.data.page);
        }
      }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(remoteMessage.data.page, '종료');
          if (remoteMessage.data.page !== 'Home') {
            if (remoteMessage.data.page === 'BUY_MEAL_PAGE') {
              return navigation.navigate(remoteMessage.data.page, {
                date: date,
              });
            }
            if (remoteMessage.data.page === 'S_MAIN__REVIEW') {
              navigation.navigate(remoteMessage.data.page, {
                from: 'point',
                id: remoteMessage.data.reviewId,
              });
            }
            if (remoteMessage.data.page === 'P_MAIN__MYPAGE__WRITTENREVIEW') {
              return navigation.navigate('S_MAIN__REVIEW');
            }
            if (remoteMessage.data.page === 'P__MY_PAGE__PUBLIC_NOTICE') {
              return navigation.navigate('S_MAIN__NOTICE', {
                from: 'public',
              });
            }
            if (remoteMessage.data.page === 'P__MY_PAGE__SPOT_NOTICE') {
              return navigation.navigate('S_MAIN__NOTICE', {
                from: 'spot',
              });
            }

            navigation.navigate(remoteMessage.data.page);
          }
        }
      });

    const unsubscribe = messaging().onMessage(async () => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, [navigation]);

  const anotherSpot = async id => {
    try {
      const res = await userSpotRegister({
        id: id,
      });
      if (res.data === null) {
        navigation.navigate(ApartRegisterSpotPageName, {id: id});
      } else {
        setShow(true);
        toast.toastEvent();
        setTimeout(() => {
          setShow(false);
        }, 2000);
      }
    } catch (err) {
      Alert.alert('스팟', err?.toString()?.replace('error: ', ''));
    }
  };

  const PressSpotButton = () => {
    if (userRole === 'ROLE_GUEST') {
      return Alert.alert(
        '로그인이 필요합니다',
        '해당 기능은 로그인 이후 사용할수 있습니다.',
        [
          {
            text: '취소',
            onPress: () => {},
          },
          {
            text: '확인',
            onPress: async () => {
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: LoginPageName,
                  },
                ],
              });
            },
            style: 'destructive',
          },
        ],
      );
    }
    if (userGroupSpot?.length !== 0) {
      setModalVisible(true);
    } else {
      navigation.navigate(SpotTypePageName);
    }
  };
  const closeModal = () => {
    setModalVisible2(false);
  };
  const groupManagePress = async () => {
    if (isUserInfo?.data?.spotId) {
      try {
        // await groupSpotDetail(userSpotId);
        navigation.navigate(GroupManagePageName, {
          id: userSpotId,
          clientId: clientId,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      Alert.alert('', '스팟을 선택해 주세요', [
        {
          text: '확인',
          onPress: () => {},
        },
      ]);
    }
  };
  const handleStatus = e => {
    setAppState(e);
  };

  const spotName =
    userGroupName?.length + userSpot?.length + 1 > 11 && userGroupName !== null
      ? userGroupName + '\n' + userSpot
      : userGroupName === null
      ? useSpotName
      : userGroupName + '\u00a0' + userSpot;

  useEffect(() => {
    const listener = AppState.addEventListener('change', handleStatus);

    return () => {
      listener.remove();
    };
  }, [isUserGroupSpotCheck]);

  // 팝업
  useEffect(() => {
    if (popupList !== undefined && popupList?.length !== 0 && userSpot) {
      setIsOneAnnouncementModalVisible(true);
    }
  }, [popupList, userSpot]);

  if (!isUserInfo?.data) {
    return <SkeletonUI />;
  }

  return (
    <SafeView
      style={{
        paddingTop: Math.round(StatusBar.currentHeight),
      }}>
      <View>
        {popupList?.length !== 0 && popupList !== undefined && (
          <ModalOneAnnouncement
            data={popupList}
            modalVisible={isOneAnnouncementModalVisible}
            setModalVisible={setIsOneAnnouncementModalVisible}
          />
        )}

        <BarWrap>
          <SpotName onPress={PressSpotButton}>
            <SpotNameText
              numberOfLines={userGroupName !== null ? 2 : 1}
              ellipsizeMode="tail">
              {isUserInfo?.data && !isUserInfo?.data?.spotId
                ? '스팟을 선택해 주세요'
                : spotName}
            </SpotNameText>
            <ArrowIcon />
            <SseRedDotType7
              // sseType7
              isSse={
                (!!sseType7.type && !sseType7.read) ||
                !!(sseType7List?.length > 0)
              }
              position={'absolute'}
              right={'-6px'}
              top={'-11px'}
            />
          </SpotName>
          <Icons>
            <SseRedDotType6
              // sseType6
              isSse={
                (!!sseType6.type && !sseType6.read) ||
                !!sseHistory?.find(v => v.type === 6)
              }
              position={'absolute'}
              right={'10px'}
              top={'4px'}>
              {/* 홈 알림 벨모양 Sse */}
              <BellIconPress
                onPress={() => {
                  confirmSseIsRead({type: 6});
                  navigation.navigate(NotificationCenterName);
                }}>
                <BellIcon />
              </BellIconPress>
            </SseRedDotType6>

            <CsIconPress
              onPress={() => {
                navigation.navigate(FAQListDetailPageName);
              }}>
              <CsIcon />
            </CsIconPress>
          </Icons>
        </BarWrap>
      </View>
      <ScrollViewWrap
        scrollEventThrottle={0}
        showsVerticalScrollIndicator={false}>
        <LargeTitle>
          {isUserInfo?.data?.nickname ?? userName}님{' '}
          {isUserInfo?.data?.nickname?.length > 5 && `\n`}안녕하세요!
        </LargeTitle>
        <MainWrap>
          {orderMealList?.data?.filter(order => order.serviceDate === date)
            .length === 0 ? (
            <NoMealInfo>
              <GreyTxt>오늘은 배송되는 식사가 없어요</GreyTxt>
            </NoMealInfo>
          ) : (
            <>
              {/* qr */}
              {/* {!orderMealListIsFetching && orderMealList?.data && (
                <>
                  <QRCodeComponent modal={qrOpen} setModal={setQrOpen} />
                  <QRView>
                    <QRText>오늘의 식사를 스캔해주세요</QRText>
                    <Pressable onPress={() => setQrOpen(true)}>
                      <QRIcon />
                    </Pressable>
                  </QRView>
                </>
              )} */}
              {orderMealList?.data?.map((m, idx) => {
                if (m.serviceDate === date)
                  return (
                    <React.Fragment key={`${m.id} ${idx}`}>
                      {m.orderItemDtoList.map(meal => {
                        return (
                          <MealInfoComponent
                            m={m}
                            meal={meal}
                            loadCoinSound={loadCoinSound}
                            dailyFoodId={meal.dailyFoodId}
                            coinSound={coinSound}
                            key={`${meal.id} ${meal.dailyFoodId}`}
                          />
                        );
                      })}
                    </React.Fragment>
                  );
              })}
            </>
          )}
          {/* 메이커스 추천 */}
          <MakerRecommendView
            onPress={() => navigation.navigate(RecommendMakersMapPageName)}>
            <MakersRecommendInnerView>
              <RecommendText>내가 아는 맛집</RecommendText>
              <RecommendBoldText>
                <RecommendBoldText bold>메이커스</RecommendBoldText>로 추천하기
              </RecommendBoldText>
            </MakersRecommendInnerView>
            <MakerRecommendIcon />
          </MakerRecommendView>
        </MainWrap>

        <Wrap>
          <MainWrap>
            <MealCalendar>
              <MealCalendarTitle>
                <CalendarIcon />
                <TitleText>식사일정</TitleText>
              </MealCalendarTitle>
              <Calendar
                isServiceDays={dailyfoodDataList?.data?.diningTypes}
                meal={orderMealList?.data}
                onPressEvent={() => navigation.navigate(MealMainPageName)}
              />
            </MealCalendar>
            {/* <CatorWrap>
            <Cator>
              <CatorIcon/>
              <TitleText>케이터링</TitleText>
            </Cator>
            <CountWrap>
              <Count>2</Count>
              <CountText>건</CountText>
            </CountWrap>
          </CatorWrap> */}

            {isUserInfo?.data?.isMembership ? (
              <MembershipWrap
                onPress={() => {
                  navigation.navigate(MembershipInfoPageName);
                }}>
                <Membership>
                  <MembershipIcon />
                  <TitleText>멤버십</TitleText>
                </Membership>
                <View>
                  <MembershipUsing>
                    {isUserInfo?.data?.membershipUsingPeriod}일째 이용중
                  </MembershipUsing>
                  {isUserInfo?.data?.foundersNumber < 5000 && (
                    <MembersWrap>
                      <MembersIcon />
                      <MembersText>
                        {isUserInfo?.data?.foundersNumber}번째 커런트파운더스
                      </MembersText>
                    </MembersWrap>
                  )}
                </View>
              </MembershipWrap>
            ) : isUserInfo?.data?.email.includes('@bespinglobal.com') &&
              membershipHistory.length < 1 ? (
              <MenbershipBanner
                onPress={() => {
                  if (isPrivateMembership?.data) {
                    setModalVisible2(true);
                  } else {
                    navigation.navigate(MembershipIntro, {
                      isFounders: isUserInfo?.data?.leftFoundersNumber > 0,
                    });
                  }
                }}>
                <MembershipImages source={BespinMembers} resizeMode={'cover'} />
              </MenbershipBanner>
            ) : isUserInfo?.data?.leftFoundersNumber > 0 ? (
              <MenbershipBanner
                onPress={() => {
                  if (isPrivateMembership?.data) {
                    setModalVisible2(true);
                  } else {
                    navigation.navigate(MembershipIntro, {
                      isFounders: isUserInfo?.data?.leftFoundersNumber > 0,
                    });
                  }
                }}>
                <MembershipImages
                  source={FoundersMembers}
                  resizeMode={'cover'}
                />
              </MenbershipBanner>
            ) : (
              <MenbershipBanner
                onPress={() => {
                  if (isPrivateMembership?.data) {
                    setModalVisible2(true);
                  } else {
                    navigation.navigate(MembershipIntro, {
                      isFounders: isUserInfo?.data?.leftFoundersNumber > 0,
                    });
                  }
                }}>
                <MembershipImage
                  source={require('../../../../../assets/images/membership.png')}
                  resizeMode="stretch"
                />
                <MembershipText>
                  멤버십 가입하고 <PointText>20%할인</PointText> 받기
                </MembershipText>
              </MenbershipBanner>
            )}

            {/* 아래주석 마켓 추가시 사용 */}
            {/* <MarketWrap>
            <Market>
              <MarketIcon/>
              <TitleText>마켓 상품</TitleText>
            </Market>
            <CountWrap>
              <Count>2</Count>
              <CountText>건</CountText>
            </CountWrap>
          </MarketWrap> */}

            {/* 식단 리포트 버튼 */}
            {/* <DietRepoPressable
              onPress={() => {
                navigation.navigate(DietRepoMainPageName);
              }}>
              <Wrap1>
                <BowlIcon />
                <DietRepoText>식단 리포트</DietRepoText>
              </Wrap1>

              <CalText>
                오늘{' '}
                {orderMealList?.data?.find(
                  v => v.serviceDate === toStringByFormatting(new Date()),
                )?.totalCalorie
                  ? orderMealList?.data?.find(
                      v => v.serviceDate === toStringByFormatting(new Date()),
                    )?.totalCalorie
                  : 0}{' '}
                kcal
              </CalText>
            </DietRepoPressable> */}
          </MainWrap>
        </Wrap>
      </ScrollViewWrap>

      {!!sseType5.userId && !sseType5.read && !!sseType5.content && (
        //다음주 식사는 구매하셨나요
        <BalloonPressable
          onPress={() => {
            // confirmBalloonClicked();
          }}>
          <Balloon label={sseType5.content} />
        </BalloonPressable>
      )}

      <ButtonWrap>
        <Button
          disabled={dailyfoodListIsFetching && !dailyfoodDataList?.data}
          status={!dailyfoodListIsFetching || dailyfoodDataList?.data}
          onPress={async () => {
            if (isUserInfo?.data?.spotId) {
              sseType5.userId &&
                !sseType5.read &&
                confirmSseIsRead({
                  type: 5,
                });

              navigation.navigate(BuyMealPageName);
              closeBalloon();
            } else {
              Alert.alert('식사구매', '스팟선택 후 식사를 구매해주세요');
            }

            // disconnectSse();
          }}>
          {(!dailyfoodListIsFetching || dailyfoodDataList?.data) && (
            <PlusIcon />
          )}
          <ButtonText
            status={!dailyfoodListIsFetching || dailyfoodDataList?.data}>
            {dailyfoodListIsFetching && !dailyfoodDataList?.data
              ? '식사 준비중...'
              : '식사 구매하기'}
          </ButtonText>
          {dailyfoodListIsFetching && !dailyfoodDataList?.data && (
            <ActivityIndicator color={themeApp.colors.grey[6]} />
          )}
        </Button>
      </ButtonWrap>
      <BottomModal
        modalVisible={modalVisible2}
        setModalVisible={setModalVisible2}
        title={`기업멤버십에 가입되어 있어요.`}
        description={
          '이미 멤버십 혜택이 적용 중이에요.\n개인멤버십 가입을 추가로 진행 할까요?'
        }
        buttonTitle1={'취소'}
        buttonType1="grey7"
        buttonTitle2={'확인'}
        buttonType2="grey2"
        onPressEvent1={closeModal}
        onPressEvent2={() => {
          closeModal();
          navigation.navigate(MembershipIntro, {
            isFounders: isUserInfo?.data?.leftFoundersNumber > 0,
          });
        }}
      />
      <BottomSheetSpot
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="배송 스팟 선택"
        // data={userGroupSpot?.spotListResponseDtoList}
        sseType7List={sseType7List}
        data={isUserGroupSpotCheck?.data.spotListResponseDtoList}
        selected={selected}
        setSelected={setSelected}
        userSpotId={userSpotId}
        onPressEvent={id => {
          anotherSpot(id);
        }}
        onPressEvent2={() => {
          groupManagePress();
        }}
        booleanValue
      />
      {show && (
        <toast.ToastWrap
          message={'스팟이 설정됐어요'}
          icon={'checked'}
          isHeader={false}
        />
      )}
    </SafeView>
  );
};

export default Pages;

const BoxWrap = css`
  width: 100%;
  border-radius: 14px;
  background-color: ${props => props.theme.colors.grey[0]};
  margin-bottom: 16px;
  padding: 16px;
`;

const BarDisplay = css`
  flex-direction: row;
  justify-content: space-between;
`;

const Display = css`
  flex-direction: row;
  align-items: center;
`;

const SafeView = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.grey[8]};
`;

const ScrollViewWrap = styled.ScrollView``;
const Wrap = styled.View`
  margin-bottom: 100px;
`;
const BarWrap = styled.View`
  ${BarDisplay};
  display: flex;
  margin: 10px 0px;
  padding: 0px 24px;

  align-items: center;
`;

const SpotName = styled.Pressable`
  ${Display};
  max-width: 220px;
`;

const Icons = styled.View`
  ${BarDisplay};
  //width: 68px;

  margin-right: -6px;
`;

const MainWrap = styled.View`
  align-items: center;
  margin: 0px 24px;
`;

const NoMealInfo = styled.View`
  ${BoxWrap};
  ${Display};
  justify-content: center;
`;

const MealCalendar = styled.View`
  width: 100%;
  border-radius: 14px;
  background-color: ${props => props.theme.colors.grey[0]};
  margin-bottom: 16px;
  padding: 16px;
  min-height: 130px;
  padding-bottom: 10px;
`;

const MealCalendarTitle = styled.View`
  ${Display};
`;

const MembershipWrap = styled.Pressable`
  ${Display};
  width: 100%;
  border-radius: 14px;
  background-color: ${props => props.theme.colors.grey[0]};
  margin-bottom: 16px;
  padding: 10px 16px 16px 16px;
  justify-content: space-between;
`;

const Membership = styled.View`
  flex-direction: row;
`;

const MenbershipBanner = styled.Pressable`
  width: 100%;
  height: 64px;
  margin-left: 24px;
  margin-right: 24px;
  margin-bottom: 16px;
`;

const MembershipImage = styled.Image`
  width: 100%;
  height: 64px;
  border-radius: 14px;
  position: relative;
`;
const MembershipImages = styled.Image`
  width: 100%;
  height: 64px;
  border-radius: 14px;
`;

const TitleText = styled(Typography).attrs({text: 'Body05SB'})`
  margin-left: 14px;
  color: ${props => props.theme.colors.grey[2]};
`;

const ButtonWrap = styled.View`
  position: absolute;
  bottom: 17px;
  width: 100%;
`;

// text
const LargeTitle = styled(Typography).attrs({text: 'LargeTitle'})`
  color: ${props => props.theme.colors.grey[1]};
  margin-top: 40px;
  margin-bottom: 20px;
  padding: 0px 24px;
`;

const SemiBoldTxt = styled(Typography).attrs({text: 'Body05SB'})`
  color: ${props => props.theme.colors.grey[2]};
`;

const GreyTxt = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme, status}) =>
    status === 9 ? theme.colors.blue[500] : theme.colors.grey[5]};
`;

const PointText = styled(Typography).attrs({text: 'Body05SB'})`
  color: ${props => props.theme.colors.green[500]};
`;

const SpotNameText = styled(Typography).attrs({text: 'BottomButtonSB'})`
  color: ${props => props.theme.colors.grey[2]};
  margin-right: 6px;
`;

const CountText = styled(Typography).attrs({text: 'Body05R'})`
  color: ${props => props.theme.colors.grey[5]};
  margin-left: 4px;
`;

const MembershipUsing = styled(CountText)`
  align-self: flex-end;
`;
const MembershipText = styled(SemiBoldTxt)`
  position: absolute;
  left: 24px;
  top: 20px;
`;

const Button = styled.Pressable`
  margin: 0px 24px;
  background-color: ${({theme, status}) =>
    status ? theme.colors.yellow[500] : theme.colors.grey[4]};
  border-radius: 100px;

  padding: 16px 0px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(Typography).attrs({text: 'BottomButtonSB'})`
  color: ${props =>
    props.status ? props.theme.colors.grey[1] : props.theme.colors.grey[6]};
  margin-left: 8px;
`;

const BalloonPressable = styled.Pressable`
  position: absolute;
  bottom: 80px;
  left: 28%;
`;

const MembersWrap = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colors.purple[100]};
  border: 0.5px solid ${({theme}) => theme.colors.purple[500]};
  border-radius: 7px;
  padding: 2px 6px;
  margin-top: 4px;
`;

const MembersText = styled(Typography).attrs({text: 'SmallLabel'})`
  color: ${({theme}) => theme.colors.purple[500]};
  margin-left: 2px;
`;

const BellIconPress = styled.Pressable`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
`;

const CsIconPress = styled.Pressable`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const SseRedDotType6 = styled(SseRedDot)``;
const SseRedDotType7 = styled(SseRedDot)``;
const DietRepoPressable = styled.Pressable`
  flex-direction: row;
  align-items: center;
  border-radius: 14px;
  background-color: white;
  padding: 21px 16px;
  width: 100%;
  justify-content: space-between;
`;

const Wrap1 = styled.View`
  flex-direction: row;
  align-items: center;
`;
const DietRepoText = styled(Typography).attrs({text: 'Body05SB'})`
  color: ${props => props.theme.colors.grey[2]};
  margin-left: 13px;
`;
const CalText = styled(Typography).attrs({text: 'Body06R'})`
  color: ${props => props.theme.colors.grey[2]};
`;

const QRView = styled.View`
  width: 100%;
  height: 64px;
  margin-left: 24px;
  margin-right: 24px;
  margin-bottom: 16px;
  background-color: white;
  border-radius: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
`;

const QRText = styled(Typography).attrs({text: 'Body05SB'})`
  color: ${props => props.theme.colors.grey[2]};
`;

const MakerRecommendView = styled.Pressable`
  background-color: white;
  width: 100%;
  border-radius: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 16px;
  margin-bottom: 16px;
`;

const MakersRecommendInnerView = styled.View`
  padding-top: 17px;
  //padding-bottom: 18px;
`;

const RecommendText = styled(Typography).attrs({text: 'CaptionR'})`
  color: ${props => props.theme.colors.grey[2]};
`;

const RecommendBoldText = styled(Typography).attrs({text: 'Title03SB'})`
  color: ${props =>
    props.bold ? props.theme.colors.purple[500] : props.theme.colors.grey[2]};
`;

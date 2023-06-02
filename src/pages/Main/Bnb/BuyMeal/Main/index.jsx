/* eslint-disable import/order */
import {Slider} from '@miblanchard/react-native-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useAtom, useAtomValue} from 'jotai';
import React, {useRef, useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PagerView from 'react-native-pager-view';
import Animateds from 'react-native-reanimated';
import styled, {css} from 'styled-components/native';

import QuestionCircleMonoIcon from '../../../../../assets/icons/QuestionCircleMonoIcon.svg';
import useAuth from '../../../../../biz/useAuth';
import {weekAtom, weekServiceAtom} from '../../../../../biz/useBanner/store';
import useFoodDaily from '../../../../../biz/useDailyFood/hook';
import {supportPriceAtom} from '../../../../../biz/useSupportPrice/store';
import useUserInfo from '../../../../../biz/useUserInfo/hook';
import {isUserInfoAtom} from '../../../../../biz/useUserInfo/store';
import Balloon from '../../../../../components/Balloon';
import BottomModal from '../../../../../components/BottomModal';
import Button from '../../../../../components/Button';
import BuyCalendar2 from '../../../../../components/BuyCalendar2';
import CalendarButton from '../../../../../components/CalendarButton';
import Label from '../../../../../components/Label';
import Typography from '../../../../../components/Typography';
import {useGetDailyfood} from '../../../../../hook/useDailyfood';
import {
  useAddShoppingBasket,
  useGetShoppingBasket,
} from '../../../../../hook/useShoppingBasket';
import {formattedWeekDate} from '../../../../../utils/dateFormatter';
import withCommas from '../../../../../utils/withCommas';
import {PAGE_NAME as LoginPageName} from '../../../Login/Login';
import {PAGE_NAME as MealCartPageName} from '../../MealCart/Main';
import {PAGE_NAME as MealDetailPageName} from '../../MealDetail/Main';
// import TossPayment from 'react-native-toss-payments';

import MealImage from '../components/MealImage';
import Modal from '../components/Modal';
import {useTheme} from 'styled-components';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';
import {useGetOrderMeal} from '../../../../../hook/useOrder';
import {height} from '../../../../../theme';

export const PAGE_NAME = 'BUY_MEAL_PAGE';

const screenHeight = Dimensions.get('window').height;
const AnimatedPagerView = Animateds.createAnimatedComponent(PagerView);

const Pages = ({route}) => {
  const params = route.params;
  const navigation = useNavigation();
  const diningRef = useRef();
  const MorningRef = useRef();
  const LunchRef = useRef();
  const DinnerRef = useRef();
  const pager = useRef();
  const themeApp = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [time, setTime] = useState('11:00');
  const [modalVisible4, setModalVisible4] = useState(false);
  const [startScroll, setStartScroll] = useState(0);
  const [sliderValue, setSliderValue] = useState(1);
  const [nowPage, setNowPage] = useState(1);
  const [selectFood, setSelectFood] = useState();
  const [show, setShow] = useState(false);
  const [scrollDir, setScrollDir] = useState(true);
  const [hideModal, setHideModal] = useState(true);
  const [cartDailyFoodId, setCartDailyFoodId] = useState();
  const [orderDailyFoodId, setOrderDailyFoodId] = useState();
  const [weekly] = useAtom(weekAtom);
  const [weeklyService, setWeeklyService] = useAtom(weekServiceAtom);
  const {data: isOrderMeal, refetch: orderMealRefetch} = useGetOrderMeal(
    formattedWeekDate(weekly[0][0]),
    formattedWeekDate(
      weekly[weekly.length - 1][weekly[weekly.length - 1].length - 1],
    ),
  );
  const timeData = [
    {id: 0, value: '11:00'},
    {id: 1, value: '11:30'},
    {id: 2, value: '12:00'},
    {id: 3, value: '12:30'},
    {id: 4, value: '01:00'},
    {id: 5, value: '01:30'},
  ];
  const {
    readableAtom: {userRole},
  } = useAuth();

  const {
    isDiningTypes,
    isMorningFood,
    isLunchFood,
    isDinnerFood,
    setMorning,
    setLunch,
    setDinner,
    setDiningTypes,
    isDailyFoodLoading,
  } = useFoodDaily();

  // const {
  //   // addMeal,
  //   // isLoadMeal,
  //   // isAddMeal,
  // } = useShoppingBasket();
  const {data: isLoadMeal} = useGetShoppingBasket();
  const {mutateAsync: addMeal, isLoading: isAddMeal} = useAddShoppingBasket();
  const {balloonEvent, BalloonWrap} = Balloon();
  const {isUserInfo} = useUserInfo();
  const fadeAnim = useRef(new Animated.Value(32)).current;
  const timeRef = useRef(null);
  const handlePress = anim => {
    Animated.timing(fadeAnim, {
      toValue: !anim ? 0 : 32,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setScrollDir(prev => !prev);
  };
  const DININGTYPE = ['아침', '점심', '저녁'];

  const [date, setDate] = useState(
    params?.refundDate ? params?.refundDate : formattedWeekDate(new Date()),
  ); // 오늘

  // 식사일정 -> 식사 선택하기 올때 선택된 날짜 가져오기, date 에 초기값 등록시키기

  useEffect(() => {
    if (params?.date) {
      setDate(params.date);
      dailyfoodRefetch();
    }
  }, [dailyfoodRefetch, params]);
  useEffect(() => {
    setWeeklyService(
      weekly
        .map(week => {
          const data = week.filter(day => {
            return (
              dailyfoodData?.data?.serviceDays?.lunchServiceDays?.includes(
                format(day, 'EEE', {locale: ko}),
              ) ||
              dailyfoodData?.data?.serviceDays?.morningServiceDays?.includes(
                format(day, 'EEE', {locale: ko}),
              ) ||
              dailyfoodData?.data?.serviceDays?.dinnerServiceDays?.includes(
                format(day, 'EEE', {locale: ko}),
              )
            );
          });
          return data;
        })
        .reduce(function (acc, cur) {
          return acc.concat(cur);
        }),
    );
  }, [
    dailyfoodData?.data?.serviceDays?.dinnerServiceDays,
    dailyfoodData?.data?.serviceDays?.lunchServiceDays,
    dailyfoodData?.data?.serviceDays?.morningServiceDays,
    setWeeklyService,
    weekly,
  ]);
  // 첫 렌더링때만 dailyFood 불러오게 하기

  // isMount처리가 없을 떄: 오늘 날짜, 선택된 날짜꺼 까지 둘다 받아버림
  // isMount처리가 있을 떄: 선택된 날짜꺼만 받는다 그래서 더 효율적이다

  // 일일 식사지원금
  const [supportPrices] = useAtom(supportPriceAtom);
  const [supportPrice, setSupportPrice] = useState(0);
  const [whenSupportPriceKor, setWhenSupportPriceKor] = useState(false);

  const [showSupportPrice, setShowSupportPrice] = useState(false);

  useEffect(() => {
    if (parseInt(supportPrice) || supportPrice === '0') {
      // 숫자이면
      if (parseInt(supportPrice) >= 0) {
        setShowSupportPrice(true);
        setWhenSupportPriceKor(false);
      } else {
        setShowSupportPrice(false);
      }
    } else {
      // 널 이냐 한국어이냐
      if (typeof supportPrice === 'string') {
        // 한국어 일때
        setWhenSupportPriceKor(true);
        setShowSupportPrice(true);
      } else {
        // null일떄
        setShowSupportPrice(false);
      }
    }
  }, [supportPrice]);
  useEffect(() => {
    const cart = isLoadMeal?.data?.spotCarts
      .map(data => {
        return data.cartDailyFoodDtoList
          .map(el => el.cartDailyFoods.map(c => c.dailyFoodId).flat())
          .flat();
      })
      .flat();
    setCartDailyFoodId(cart);
    // console.log(cart, 'cart');
  }, [isLoadMeal?.data?.spotCarts]);
  useEffect(() => {
    const orderMealData = isOrderMeal?.data
      .map(meal => {
        return meal.orderItemDtoList
          .map(data => {
            return data.dailyFoodId;
          })
          .flat();
      })
      .flat();
    setOrderDailyFoodId(orderMealData);
    console.log(orderMealData, 'orderMealData');
  }, [isOrderMeal?.data]);
  const daily = true;

  // const todayMeal = mealInfo?.filter((m) => m.date === date);
  // const selectDate = mealInfo?.filter((m) => m.date === touchDate);
  const spotId = userRole === 'ROLE_GUEST' ? 1 : isUserInfo?.spotId;
  // const spotId = 1;
  const [chk, setChk] = useState(0);
  const {
    data: dailyfoodData,
    refetch: dailyfoodRefetch,
    isFetching: dailyFetching,
  } = useGetDailyfood(spotId, params?.date ? params.date : date);
  const onPageScroll2 = e => {
    const {position} = e.nativeEvent;
    setChk(position);
  };
  const onPageScrollAndroid = e => {
    const {position, offset} = e.nativeEvent;
    navigation.setParams({
      date: null,
    });
    const result = weeklyService.findIndex(day => {
      return formattedWeekDate(date) === formattedWeekDate(day);
    });
    if (offset !== 0) {
      if (position === 2) {
        const currentDate = formattedWeekDate(new Date());
        const nextDate = new Date(
          weeklyService[result === weeklyService?.length ? result : result + 1],
        );

        const week = weekly.map(w => {
          const find = w.findIndex(v => {
            return (
              formattedWeekDate(v) === formattedWeekDate(new Date(nextDate))
            );
          });
          return find !== -1;
        });
        if (week.includes(true)) {
          setDate(
            formattedWeekDate(
              new Date(
                weeklyService[
                  result === weeklyService?.length ? result : result + 1
                ],
              ),
            ),
          );
          const dateIndex = weekly.map(v => {
            return v.map(s => {
              return formattedWeekDate(s);
            });
          });
          const index = dateIndex.findIndex(v => {
            return v.includes(
              formattedWeekDate(
                new Date(
                  weeklyService[
                    result === weeklyService?.length ? result : result + 1
                  ],
                ),
              ),
            );
          });
          setChk(index);
          pager.current.setPage(index);
          return setNowPage(0);
        }
      }
      if (position === -1) {
        const currentDate = formattedWeekDate(new Date());
        const nextDate = new Date(
          weeklyService[result === 0 ? result : result - 1],
        );
        const week = weekly.map(w => {
          const find = w.findIndex(v => {
            return (
              formattedWeekDate(v) === formattedWeekDate(new Date(nextDate))
            );
          });
          return find !== -1;
        });

        if (week.includes(true)) {
          const prevDate2 = new Date(nextDate);
          const todayDate2 = new Date(date);
          const nowDates = new Date().setDate(new Date().getDate() - 1);
          const nowDate = new Date(nowDates);
          const utc =
            todayDate2.getTime() + todayDate2.getTimezoneOffset() * 60 * 1000;
          const utc2 =
            prevDate2.getTime() + prevDate2.getTimezoneOffset() * 60 * 1000;
          const utc3 =
            nowDate.getTime() + nowDate.getTimezoneOffset() * 60 * 1000;

          // 3. UTC to KST (UTC + 9시간)
          const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
          const kr_curr = new Date(utc + KR_TIME_DIFF);
          const kr_curr2 = new Date(utc2 + KR_TIME_DIFF);
          const kr_curr3 = new Date(utc3 + KR_TIME_DIFF);
          if (
            new Date(formattedWeekDate(kr_curr)) >
              new Date(formattedWeekDate(kr_curr2)) &&
            new Date(formattedWeekDate(kr_curr3)) <
              new Date(formattedWeekDate(kr_curr2))
          ) {
            setDate(
              formattedWeekDate(
                new Date(weeklyService[result === 0 ? result : result - 1]),
              ),
            );
            const dateIndex = weekly.map(v => {
              return v.map(s => {
                return formattedWeekDate(s);
              });
            });
            const index = dateIndex.findIndex(v => {
              return v.includes(
                formattedWeekDate(
                  new Date(weeklyService[result === 0 ? result : result - 1]),
                ),
              );
            });
            setChk(index);
            pager.current.setPage(index);
            return setNowPage(2);
          }
        }

        if (position === -1) {
          setNowPage(0);
        } else {
          setNowPage(position);
        }
      }
    }
  };
  const onPageScroll3 = e => {
    navigation.setParams({
      date: null,
    });
    const {position, offset} = e.nativeEvent;
    const result = weeklyService.findIndex(day => {
      return formattedWeekDate(date) === formattedWeekDate(day);
    });
    if (offset === 0) {
      if (nowPage === position) {
        if (position === 2) {
          const currentDate = formattedWeekDate(new Date());
          const nextDate = new Date(
            weeklyService[
              result === weeklyService?.length ? result : result + 1
            ],
          );

          const week = weekly.map(w => {
            const find = w.findIndex(v => {
              return (
                formattedWeekDate(v) === formattedWeekDate(new Date(nextDate))
              );
            });
            return find !== -1;
          });
          if (week.includes(true)) {
            setDate(
              formattedWeekDate(
                new Date(
                  weeklyService[
                    result === weeklyService?.length ? result : result + 1
                  ],
                ),
              ),
            );
            const dateIndex = weekly.map(v => {
              return v.map(s => {
                return formattedWeekDate(s);
              });
            });
            const index = dateIndex.findIndex(v => {
              return v.includes(
                formattedWeekDate(
                  new Date(
                    weeklyService[
                      result === weeklyService?.length ? result : result + 1
                    ],
                  ),
                ),
              );
            });
            setChk(index);
            pager.current.setPage(index);
            return setNowPage(isDiningTypes[0] - 1);
          }
        }
        if (position === 0) {
          const currentDate = formattedWeekDate(new Date());
          const nextDate = new Date(
            weeklyService[result === 0 ? result : result - 1],
          );
          const week = weekly.map(w => {
            const find = w.findIndex(v => {
              return (
                formattedWeekDate(v) === formattedWeekDate(new Date(nextDate))
              );
            });
            return find !== -1;
          });

          if (week.includes(true)) {
            const prevDate2 = new Date(nextDate);
            const todayDate2 = new Date(date);
            const nowDates = new Date().setDate(new Date().getDate() - 1);
            const nowDate = new Date(nowDates);
            const utc =
              todayDate2.getTime() + todayDate2.getTimezoneOffset() * 60 * 1000;
            const utc2 =
              prevDate2.getTime() + prevDate2.getTimezoneOffset() * 60 * 1000;
            const utc3 =
              nowDate.getTime() + nowDate.getTimezoneOffset() * 60 * 1000;

            // 3. UTC to KST (UTC + 9시간)
            const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
            const kr_curr = new Date(utc + KR_TIME_DIFF);
            const kr_curr2 = new Date(utc2 + KR_TIME_DIFF);
            const kr_curr3 = new Date(utc3 + KR_TIME_DIFF);
            if (
              new Date(formattedWeekDate(kr_curr)) >
                new Date(formattedWeekDate(kr_curr2)) &&
              new Date(formattedWeekDate(kr_curr3)) <
                new Date(formattedWeekDate(kr_curr2))
            ) {
              setDate(
                formattedWeekDate(
                  new Date(weeklyService[result === 0 ? result : result - 1]),
                ),
              );
              const dateIndex = weekly.map(v => {
                return v.map(s => {
                  return formattedWeekDate(s);
                });
              });
              const index = dateIndex.findIndex(v => {
                return v.includes(
                  formattedWeekDate(
                    new Date(weeklyService[result === 0 ? result : result - 1]),
                  ),
                );
              });
              setChk(index);
              pager.current.setPage(index);
              return setNowPage(isDiningTypes[isDiningTypes.length - 1] - 1);
            }
          }
        }
      }
      setNowPage(position);
    }
  };
  const onPageScroll = e => {
    navigation.setParams({
      date: null,
    });
    const {position} = e.nativeEvent;
    if (
      isDiningTypes?.length > 0 &&
      isDiningTypes[0] &&
      ((isMorningFood.length === 0 && position === 0) ||
        (isLunchFood.length === 0 && position === 1) ||
        (isDinnerFood.length === 0 && position === 2))
    ) {
      const page =
        position === 0
          ? isDiningTypes?.includes(1)
            ? 0
            : isDiningTypes?.includes(2)
            ? 1
            : isDiningTypes?.includes(3)
            ? 2
            : 0
          : position === 1
          ? isDiningTypes?.includes(2)
            ? 1
            : isDiningTypes?.includes(3)
            ? 2
            : isDiningTypes?.includes(1)
            ? 0
            : 1
          : position === 2 && isDiningTypes?.includes(3)
          ? 2
          : isDiningTypes?.includes(2)
          ? 1
          : isDiningTypes?.includes(1)
          ? 0
          : 2;
      const result = weeklyService.findIndex(day => {
        return formattedWeekDate(date) === formattedWeekDate(day);
      });
      if (page !== position) {
        if (position === 2) {
          const currentDate = formattedWeekDate(new Date());
          const nextDate = new Date(
            weeklyService[
              result === weeklyService?.length ? result : result + 1
            ],
          );

          const week = weekly.map(w => {
            const find = w.findIndex(v => {
              return (
                formattedWeekDate(v) === formattedWeekDate(new Date(nextDate))
              );
            });
            return find !== -1;
          });
          if (week.includes(true)) {
            setDate(
              formattedWeekDate(
                new Date(
                  weeklyService[
                    result === weeklyService?.length ? result : result + 1
                  ],
                ),
              ),
            );
            const dateIndex = weekly.map(v => {
              return v.map(s => {
                return formattedWeekDate(s);
              });
            });
            const index = dateIndex.findIndex(v => {
              return v.includes(
                formattedWeekDate(
                  new Date(
                    weeklyService[
                      result === weeklyService?.length ? result : result + 1
                    ],
                  ),
                ),
              );
            });
            setChk(index);
            pager.current.setPage(index);
          }
        }
        if (position === 0) {
          const currentDate = formattedWeekDate(new Date());
          const nextDate = new Date(
            weeklyService[result === 0 ? result : result - 1],
          );
          const week = weekly.map(w => {
            const find = w.findIndex(v => {
              return (
                formattedWeekDate(v) === formattedWeekDate(new Date(nextDate))
              );
            });
            return find !== -1;
          });

          if (week.includes(true)) {
            const prevDate2 = new Date(nextDate);
            const todayDate2 = new Date(date);
            const nowDates = new Date().setDate(new Date().getDate() - 1);
            const nowDate = new Date(nowDates);
            const utc =
              todayDate2.getTime() + todayDate2.getTimezoneOffset() * 60 * 1000;
            const utc2 =
              prevDate2.getTime() + prevDate2.getTimezoneOffset() * 60 * 1000;
            const utc3 =
              nowDate.getTime() + nowDate.getTimezoneOffset() * 60 * 1000;

            // 3. UTC to KST (UTC + 9시간)
            const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
            const kr_curr = new Date(utc + KR_TIME_DIFF);
            const kr_curr2 = new Date(utc2 + KR_TIME_DIFF);
            const kr_curr3 = new Date(utc3 + KR_TIME_DIFF);
            if (
              new Date(formattedWeekDate(kr_curr)) >
                new Date(formattedWeekDate(kr_curr2)) &&
              new Date(formattedWeekDate(kr_curr3)) <
                new Date(formattedWeekDate(kr_curr2))
            ) {
              setDate(
                formattedWeekDate(
                  new Date(weeklyService[result === 0 ? result : result - 1]),
                ),
              );
              const dateIndex = weekly.map(v => {
                return v.map(s => {
                  return formattedWeekDate(s);
                });
              });
              const index = dateIndex.findIndex(v => {
                return v.includes(
                  formattedWeekDate(
                    new Date(weeklyService[result === 0 ? result : result - 1]),
                  ),
                );
              });
              setChk(index);
              pager.current.setPage(index);
            }
          }
        }
        diningRef.current.setPage(page);
        setSliderValue(page);
      } else {
        setSliderValue(page);
      }
    } else {
      setSliderValue(position);
    }
    MorningRef?.current?.scrollTo({x: 0, y: 0, animated: false});
    LunchRef?.current?.scrollTo({x: 0, y: 0, animated: false});
    DinnerRef?.current?.scrollTo({x: 0, y: 0, animated: false});
    setScrollDir(true);
    handlePress(true);
  };

  const dayPress = async selectedDate => {
    try {
      if (params?.date) {
        navigation.setParams({
          date: null,
        });
      }

      setDate(selectedDate);
      // dailyFood(spotId,selectedDate);
    } catch (err) {
      Alert.alert('날짜 선택', err?.toString()?.replace('error: ', ''));
    }
  };
  // const isDiningType = (type)=>{
  //     return type === '아침' ? 1 : type === '점심' ? 2 : 3;
  // }
  const openModal = async diningType => {
    // console.log(modalVisible,
    //     modalVisible2,
    //     modalVisible3,)

    if (diningType === 1) {
      return setModalVisible(true);
    }
    if (diningType === 2) {
      return setModalVisible2(true);
    }
    if (diningType === 3) {
      return setModalVisible3(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalVisible2(false);
    setModalVisible3(false);
  };

  // useFocusEffect(
  //     useCallback(()=>{
  //         loadMeal();
  //     },[])
  // )
  useEffect(() => {
    if (date) dailyfoodRefetch();
  }, [dailyfoodRefetch, date]);
  useEffect(() => {
    let price = null;
    if (dailyfoodData?.data.supportPrice) {
      switch (sliderValue) {
        case 0:
          price = dailyfoodData?.data.supportPrice.morningSupportPrice;
          break;
        case 1:
          price = dailyfoodData?.data.supportPrice.lunchSupportPrice;
          break;
        case 2:
          price = dailyfoodData?.data.supportPrice.dinnerSupportPrice;
          break;
      }

      setSupportPrice(price);
    }
  }, [sliderValue, dailyfoodData?.data, date]);
  useEffect(() => {
    setMorning(
      dailyfoodData?.data.dailyFoodDtos.filter(x => x.diningType === 1),
    );
    setLunch(dailyfoodData?.data.dailyFoodDtos.filter(x => x.diningType === 2));
    setDinner(
      dailyfoodData?.data.dailyFoodDtos.filter(x => x.diningType === 3),
    );
    setDiningTypes(dailyfoodData?.data.diningTypes);
  }, [dailyfoodData?.data]);
  const addCartPress = async (id, day, type, m) => {
    const diningType = type;
    const duplication = isLoadMeal?.data?.spotCarts
      ?.map(v =>
        v.cartDailyFoodDtoList.map(el =>
          el.cartDailyFoods.some(c => c.dailyFoodId === id),
        ),
      )
      .flat();

    if (duplication?.includes(true)) {
      await openModal(diningType);
      setSelectFood({
        id: id,
      });
    } else {
      await addToCart(id, m);
    }
  };
  const quantityArr = isLoadMeal?.data?.spotCarts?.map(el =>
    el.cartDailyFoodDtoList.map(v =>
      v.cartDailyFoods.map(c => {
        return {
          dailyFoodId: c.dailyFoodId,
          count: c.count,
          cartItemId: c.id,
        };
      }),
    ),
  );
  const quantity = quantityArr?.reduce((acc, val) => [...acc, ...val], []);
  const modifyQty = quantity?.reduce((acc, cur) => [...acc, ...cur], []);
  const addToCart = async id => {
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
    try {
      await addMeal([
        {
          dailyFoodId: id,
          count: 1,
          spotId: isUserInfo?.spotId,
        },
      ]);
      setShow(true);
      balloonEvent();
      setTimeout(() => {
        setShow(false);
      }, 3000);
    } catch (err) {
      Alert.alert('장바구니 담기', err?.toString()?.replace('error: ', ''));
    }
    closeModal();
  };

  const BuyMeal = diningFood => {
    const setModal = type => {
      if (type === isMorningFood) {
        return setModalVisible;
      }
      if (type === isLunchFood) {
        return setModalVisible2;
      }
      if (type === isDinnerFood) {
        return setModalVisible3;
      }
    };
    const modal = type => {
      if (type === isMorningFood) {
        // console.log("1",modalVisible)
        return modalVisible;
      }
      if (type === isLunchFood) {
        // console.log("2",modalVisible2)
        return modalVisible2;
      }
      if (type === isDinnerFood) {
        // console.log("3",modalVisible3)
        return modalVisible3;
      }
    };
    const refType = type => {
      if (type === isMorningFood) {
        return MorningRef;
      }
      if (type === isLunchFood) {
        return LunchRef;
      }
      if (type === isDinnerFood) {
        return DinnerRef;
      }
    };

    const onScrollStart = e => {
      const {
        contentOffset: {y},
      } = e.nativeEvent;
      setStartScroll(y);
    };
    const onScrollEnd = e => {
      const {
        contentOffset: {y},
      } = e.nativeEvent;
      if (y < 20) {
        handlePress(true);
      } else {
        handlePress(startScroll > y ? true : false);
      }
    };
    return (
      <ScrollView
        ref={refType(diningFood)}
        onScrollBeginDrag={onScrollStart}
        onScrollEndDrag={onScrollEnd}
        showsVerticalScrollIndicator={false}
        scrollEnabled={
          !(diningFood?.length === 0 && spotId !== null) || !spotId === null
        }>
        <FoodContainer isFood={diningFood?.length === 0 && spotId !== null}>
          {diningFood?.length === 0 && spotId !== null && (
            <NoServieceView
              status={hideModal}
              isMembership={isUserInfo?.isMembership}>
              <NoServiceText>서비스 운영일이 아니에요</NoServiceText>
            </NoServieceView>
          )}
          {spotId === null && (
            <NoSpotView
              status={hideModal}
              isMembership={isUserInfo?.isMembership}>
              <NoServiceText>메뉴는 스팟 선택 또는 </NoServiceText>
              <NoServiceText>
                스팟 개설 신청 승인후 확인할 수 있어요
              </NoServiceText>
            </NoSpotView>
          )}

          {diningFood?.map(m => {
            const realToTalDiscountRate =
              100 -
              (100 - m.membershipDiscountRate) *
                0.01 *
                ((100 - m.makersDiscountRate) * 0.01) *
                ((100 - m.periodDiscountRate) * 0.01) *
                100;
            // console.log(m.discountedPrice, 'test');
            const totalDiscount =
              m.membershipDiscountPrice +
              m.makersDiscountPrice +
              m.periodDiscountPrice;

            return (
              <Contents
                key={m.id}
                spicy={m.spicy}
                vegan={m.vegan}
                disabled={
                  m.status === 2 ||
                  m.status === 6 ||
                  isAddMeal ||
                  m.status === 5
                }
                onPress={e => {
                  navigation.navigate(MealDetailPageName, {dailyFoodId: m.id});
                  e.stopPropagation();
                }}>
                <ContentsText>
                  <MakersName soldOut={m.status}>{m.makersName}</MakersName>
                  <MealName
                    soldOut={m.status}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {m.foodName}
                  </MealName>
                  <MealDsc
                    soldOut={m.status}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {m.description}
                  </MealDsc>
                  <PriceWrap>
                    {realToTalDiscountRate !== 0 && (
                      <PercentText soldOut={m.status}>
                        {Math.round(realToTalDiscountRate * 100) / 100}%
                      </PercentText>
                    )}
                    <Price soldOut={m.status}>
                      {withCommas(m.price - totalDiscount)}원
                    </Price>
                    {realToTalDiscountRate !== 0 && (
                      <OriginPrice>{withCommas(m.price)}원</OriginPrice>
                    )}
                  </PriceWrap>
                  {m.spicy !== null && (
                    <LabelWrap>
                      {m.status === 2 || m.status === 6 ? (
                        <Label label={`${m.spicy}`} type={'soldOut'} />
                      ) : (
                        <Label label={`${m.spicy}`} />
                      )}
                    </LabelWrap>
                  )}
                  {m.vegan && m.vegan !== null && (
                    <LabelWrap>
                      {m.status === 2 || m.status === 6 ? (
                        <Label label={`${m.vegan}`} type={'soldOut'} />
                      ) : (
                        <Label label={`${m.vegan}`} type={'vegan'} />
                      )}
                    </LabelWrap>
                  )}
                </ContentsText>
                <MealImage
                  status={m.status}
                  image={m.image}
                  dailyFoodId={m.id}
                  orderFoodList={orderDailyFoodId}
                  cartFoodList={cartDailyFoodId}
                  onPressEvent={() => {
                    addCartPress(m.id, m.serviceDate, m.diningType, m);
                  }}
                  isAddMeal={isAddMeal}
                  rank={m.rank}
                />

                {m.status === 2 && (
                  <SoldOut soldOut={m.status} rank={m.rank}>
                    품절됐어요
                  </SoldOut>
                )}
                {m.status === 6 && (
                  <SoldOut soldOut={m.status} rank={m.rank}>
                    마감됐어요
                  </SoldOut>
                )}
              </Contents>
            );
          })}
          <BottomModal
            modalVisible={modal(diningFood)}
            setModalVisible={setModal(diningFood)}
            title={`장바구니에 ${'\n'}동일 날짜/시간의 메뉴가 있어요.`}
            description={'그래도 추가하시겠어요?'}
            buttonTitle1={'아니요'}
            buttonType1="grey7"
            buttonTitle2={'추가'}
            buttonType2="yellow"
            onPressEvent1={closeModal}
            onPressEvent2={() => addToCart(selectFood.id)}
          />
          <View style={{height: 120}} />
        </FoodContainer>
      </ScrollView>
    );
  };

  return (
    <SafeView>
      {/* <Animated.View style={{height: fadeAnim, overflow: 'hidden'}}>
        <CalendarButton pager={pager} daily chk={chk} />
      </Animated.View> */}
      <CalendarWrap>
        <BuyCalendar2
          BooleanValue={false}
          type={'grey2'}
          color={'white'}
          size={'Body05R'}
          onPressEvent2={dayPress}
          daily={daily}
          // selectDate={date}
          selectDate={date}
          margin={'0px 28px'}
          scrollDir
          pagerRef={pager}
          onPageScroll2={onPageScroll2}
          sliderValue={sliderValue}
          isServiceDays={dailyfoodData?.data.serviceDays}
        />
      </CalendarWrap>
      <PagerViewWrap isMembership={isUserInfo?.isMembership}>
        {!isDailyFoodLoading && (
          <StatusWrap>
            <ProgressWrap>
              <Progress>
                {DININGTYPE.map((btn, i) => {
                  const type = btn === '아침' ? 1 : btn === '점심' ? 2 : 3;
                  const typeBoolean = isDiningTypes?.includes(type);
                  return (
                    <DiningPress
                      key={i}
                      disabled={!typeBoolean && true}
                      onPress={() => {
                        diningRef.current.setPage(i);
                        setSliderValue(i);
                      }}>
                      <ProgressText type={typeBoolean} index={i}>
                        {btn}
                      </ProgressText>
                    </DiningPress>
                  );
                })}
              </Progress>
              <View style={{position: 'relative', top: -10}}>
                <Slider
                  value={sliderValue}
                  onValueChange={e => setSliderValue(...e)}
                  minimumValue={0}
                  maximumValue={2}
                  maximumTrackTintColor="#fff"
                  minimumTrackTintColor="#fff"
                  onSlidingComplete={e => {
                    diningRef.current.setPage(...e);
                  }}
                  step={1}
                  trackStyle={styles.trackStyle}
                  thumbStyle={styles.thumbStyle}
                />
              </View>
            </ProgressWrap>
            <HeaderWrap
              colors={[
                'rgba(255, 255, 255, 0.0)',
                'rgba(255, 255, 255, 0.2)',
                'rgba(255, 255, 255, 0.5)',
                'rgba(255, 255, 255, 0.7)',
                'rgba(255, 255, 255, 0.8)',
                'rgba(255, 255, 255, 0.9)',
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 1)',
              ]}
              useAngle={true}
              angle={90}
            />
            <TimeWrap
              ref={timeRef}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={timeData}
              renderItem={({item, index}) => {
                if (timeData?.length - 1 === index) {
                  return (
                    <TimeBoxlast
                      isSelect={time === item.value}
                      onPress={() => {
                        setTime(item.value);
                        timeRef.current.scrollToIndex({
                          animated: true,
                          index: index,
                        });
                      }}>
                      <Typography
                        text={time === item.value ? 'Body06SB' : 'Body06R'}
                        textColor={
                          time === item.value
                            ? themeApp.colors.grey[0]
                            : themeApp.colors.grey[4]
                        }>
                        {item.value}
                      </Typography>
                    </TimeBoxlast>
                  );
                }
                return (
                  <TimeBox
                    isSelect={time === item.value}
                    onPress={() => {
                      setTime(item.value);
                      timeRef.current.scrollToIndex({
                        animated: true,
                        index: index,
                      });
                    }}>
                    <Typography
                      text={time === item.value ? 'Body06SB' : 'Body06R'}
                      textColor={
                        time === item.value
                          ? themeApp.colors.grey[0]
                          : themeApp.colors.grey[4]
                      }>
                      {item.value}
                    </Typography>
                  </TimeBox>
                );
              }}
              keyExtractor={item => item.id}
            />
            {/* <TimeWrap showsHorizontalScrollIndicator={false} horizontal={true}>
              <TimeBox
                isSelect={time === '11:30'}
                onPress={() => {
                  setTime('11:30');
                  timeRef.current.scrollToIndex(1);
                }}>
                <Typography
                  text={time === '11:30' ? 'Body06SB' : 'Body06R'}
                  textColor={
                    time === '11:30'
                      ? themeApp.colors.grey[0]
                      : themeApp.colors.grey[4]
                  }>
                  11:30
                </Typography>
              </TimeBox>
              <TimeBox
                isSelect={time === '12:00'}
                onPress={() => {
                  setTime('12:00');
                }}>
                <Typography
                  text={time === '12:00' ? 'Body06SB' : 'Body06R'}
                  textColor={
                    time === '12:00'
                      ? themeApp.colors.grey[0]
                      : themeApp.colors.grey[4]
                  }>
                  12:00
                </Typography>
              </TimeBox>
              <TimeBox
                isSelect={time === '12:30'}
                onPress={() => {
                  setTime('12:30');
                }}>
                <Typography
                  text={time === '12:30' ? 'Bdy06SB' : 'Body06R'}
                  textColor={
                    time === '12:30'
                      ? themeApp.colors.grey[0]
                      : themeApp.colors.grey[4]
                  }>
                  12:30
                </Typography>
              </TimeBox>
              <TimeBox
                isSelect={time === '01:00'}
                onPress={() => {
                  setTime('01:00');
                }}>
                <Typography
                  text={time === '01:00' ? 'Body06SB' : 'Body06R'}
                  textColor={
                    time === '01:00'
                      ? themeApp.colors.grey[0]
                      : themeApp.colors.grey[4]
                  }>
                  01:00
                </Typography>
              </TimeBox>
              <TimeBox
                isSelect={time === '01:30'}
                onPress={() => {
                  setTime('01:30');
                }}>
                <Typography
                  text={time === '01:30' ? 'Body06SB' : 'Body06R'}
                  textColor={
                    time === '01:30'
                      ? themeApp.colors.grey[0]
                      : themeApp.colors.grey[4]
                  }>
                  01:30
                </Typography>
              </TimeBox>
              <View style={{width: 50, height: 24}} />
            </TimeWrap> */}
          </StatusWrap>
        )}
        {showSupportPrice && (
          <MiniWrap
            onPress={() => {
              setModalVisible4(true);
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Typography2>일일 식사지원금</Typography2>
              <QuestionPressable>
                <QuestionCircleMonoIcon />
              </QuestionPressable>
            </View>
            {whenSupportPriceKor ? (
              <Typography4>{supportPrice}</Typography4>
            ) : (
              <Typography3> {supportPrice}원</Typography3>
            )}
          </MiniWrap>
        )}
        {!isUserInfo?.isMembership && (
          <View>
            <Modal hideModal={hideModal} setHideModal={setHideModal} />
          </View>
        )}
        {dailyFetching ? (
          <LoadingPage>
            <ActivityIndicator size={'large'} />
          </LoadingPage>
        ) : (
          <Pager
            ref={diningRef}
            overdrag={true}
            initialPage={nowPage}
            overScrollMode={'always'}
            onPageScroll={
              Platform.OS === 'android' ? onPageScroll3 : onPageScrollAndroid
            }
            onPageSelected={e => {
              onPageScroll(e);
            }}>
            {BuyMeal(isMorningFood)}
            {BuyMeal(isLunchFood)}
            {BuyMeal(isDinnerFood)}
          </Pager>
        )}
      </PagerViewWrap>

      {show && (
        <BalloonWrap
          message={'장바구니에 담았어요'}
          horizontal={'right'}
          size={'B'}
          location={{top: '8px', right: '16px'}}
        />
      )}
      <ButtonWrap
        colors={[
          'rgba(255, 255, 255, 0.0)',
          'rgba(255, 255, 255, 0.0)',
          'rgba(255, 255, 255, 0.0)',
          'rgba(255, 255, 255, 0.5)',
          'rgba(255, 255, 255, 0.7)',
          'rgba(255, 255, 255, 0.9)',
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)',
        ]}
        useAngle={true}
        angle={180}>
        <Button
          label={'장바구니 보기'}
          type={'yellow'}
          onPressEvent={() => {
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
            navigation.navigate(MealCartPageName);
          }}
        />
      </ButtonWrap>
      <BottomModal
        modalVisible={modalVisible4}
        setModalVisible={setModalVisible4}
        title={'지원금이란?'}
        description={
          '고객님의 스팟에서 지원하는 지원금입니다. \n결제시 사용 가능한 최대 금액으로 자동 적용됩니다.'
        }
        buttonTitle1={'확인했어요'}
        buttonType1="grey7"
        onPressEvent1={() => {
          setModalVisible4(false);
        }}
      />
    </SafeView>
  );
};
const styles = StyleSheet.create({
  trackStyle: {
    backgroundColor: 'white',
    width: 102,
    height: 2,
  },
  thumbStyle: {
    width: 16,
    height: 1.5,
    borderRadius: 10,
    backgroundColor: '#343337',
  },
});

export default Pages;

const FoodContainer = styled.View`
  ${({isFood}) => {
    if (isFood)
      return css`
        height: ${screenHeight}px;
      `;
  }}
  padding-bottom:24px;
`;
const SafeView = styled.View`
  background-color: ${props => props.theme.colors.grey[0]};
  flex: 1;
`;

const CalendarWrap = styled.View`
  height: 72px;
  border-bottom-color: ${props => props.theme.colors.grey[8]};
  border-bottom-width: 1px;
  width: 100%;
`;
const LoadingPage = styled.View`
  background-color: white;
  opacity: 0.5;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 100%;
  flex: 1;
  padding-bottom: 150px;
`;
const PagerViewWrap = styled.View`
  flex: 1;
`;
const StatusWrap = styled.View`
  width: 100%;
  flex-direction: row;
`;
const ProgressWrap = styled.View`
  flex-direction: column;
  align-items: center;
  padding-top: 13px;
  height: 48px;
  width: 142px;
  /* padding: 0px 24px; */
  /* justify-content: space-between; */
`;

const TimeWrap = styled.FlatList`
  flex-direction: row;
  overflow: hidden;
  flex: 1;
  padding: 13px 0px;
`;
const TimeBox = styled.Pressable`
  padding: 1px 8px;
  margin-right: 8px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme, isSelect}) =>
    isSelect ? theme.colors.grey[2] : theme.colors.grey[8]};
`;
const TimeBoxlast = styled.Pressable`
  padding: 1px 8px;
  margin-right: 100px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme, isSelect}) =>
    isSelect ? theme.colors.grey[2] : theme.colors.grey[8]};
`;
const MiniWrap = styled.Pressable`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
  height: 48px;
  border: 0.5px solid ${({theme}) => theme.colors.grey[8]};
  border-bottom-width: 6px;
  border-radius: 7px;
`;

const QuestionPressable = styled.Pressable`
  margin-right: 3px;
`;

const Typography2 = styled(Typography).attrs({text: 'Body06R'})`
  margin-right: 4px;
  color: ${({theme}) => theme.colors.grey[2]};
`;

const Typography3 = styled(Typography).attrs({text: 'Body05SB'})`
  margin-right: 4px;
  color: ${({theme}) => theme.colors.grey[2]};

  font-weight: 600;
`;

const Progress = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 120px;
`;

const Pager = styled(AnimatedPagerView)`
  flex: 1;
`;

const Contents = styled.Pressable`
  padding: ${({spicy, vegan}) =>
    spicy || vegan ? '18px 0px 28px 0px' : '18px 0px 28px 0px'};
  margin: 0px 28px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-color: ${props => props.theme.colors.grey[8]};
  border-bottom-width: 1px;
  align-items: center;
  min-height: 160px;
`;

const LabelWrap = styled.View`
  margin-top: 6px;
`;

const ContentsText = styled.View`
  width: 60%;
`;

const PriceWrap = styled.View`
  flex-direction: row;
  margin-top: 4px;
  margin-bottom: 6px;
`;

const SoldOut = styled(Typography).attrs({text: 'Title04SB'})`
  position: absolute;
  right: ${({rank}) => (rank === 1 ? '17px' : '15px')};
  top: ${({rank}) => (rank === 1 ? '60%' : '55%')};
  color: ${props => props.theme.colors.grey[4]};
  z-index: 1000;
`;
const ButtonWrap = styled(LinearGradient)`
  position: absolute;
  bottom: 0;
  padding: 0px 48px;
  padding-top: 20px;
  width: 100%;
  height: 100px;
  justify-content: flex-start;
`;
const HeaderWrap = styled(LinearGradient)`
  position: absolute;
  top: 0px;
  right: 0px;
  height: 48px;
  width: 48px;
  z-index: 1;
`;
export const MakersName = styled(Typography).attrs({text: 'SmallLabel'})`
  color: ${({theme, soldOut}) =>
    soldOut === 2 || soldOut === 6
      ? theme.colors.grey[6]
      : theme.colors.grey[4]};
`;

export const MealName = styled(Typography).attrs({text: 'Body05SB'})`
  white-space: nowrap;
  word-break: nowrap;
  text-overflow: ellipsis;
  color: ${({theme, soldOut}) =>
    soldOut === 2 || soldOut === 6
      ? theme.colors.grey[6]
      : theme.colors.grey[2]};
`;

const Price = styled(Typography).attrs({text: 'Body05R'})`
  color: ${({theme, soldOut}) =>
    soldOut === 2 || soldOut === 6
      ? theme.colors.grey[6]
      : theme.colors.grey[2]};
`;

const MealDsc = styled(Typography).attrs({text: 'MealDes'})`
  color: ${({theme, soldOut}) =>
    soldOut === 2 || soldOut === 6
      ? theme.colors.grey[6]
      : theme.colors.grey[4]};
  margin-top: 6px;
`;

const ProgressText = styled(Typography).attrs({text: 'Title04SB'})`
  color: ${({theme, type}) =>
    type ? theme.colors.grey[2] : theme.colors.grey[7]};
`;

const PercentText = styled(Typography).attrs({text: 'Body05R'})`
  color: ${({theme, soldOut}) =>
    soldOut === 2 || soldOut === 6 ? theme.colors.grey[6] : '#DD5257'};
  margin-right: 4px;
`;

const OriginPrice = styled(Typography).attrs({text: 'Body06R'})`
  color: ${({theme, soldOut}) =>
    soldOut === 2 || soldOut === 6
      ? theme.colors.grey[6]
      : theme.colors.grey[5]};
  text-decoration: line-through;
  text-decoration-color: ${({theme, soldOut}) =>
    soldOut === 2 || soldOut === 6
      ? theme.colors.grey[6]
      : theme.colors.grey[5]};
  margin-left: 6px;
`;

const NoServiceText = styled(Typography).attrs({text: 'Body05R'})`
  color: ${({theme}) => theme.colors.grey[5]};
`;
const Typography4 = styled(Typography).attrs({text: 'Body05SB'})`
  margin-right: 4px;
  color: ${({theme}) => theme.colors.grey[2]};
  font-size: 14px;
  font-weight: 600;
`;
const NoServieceView = styled.View`
  position: absolute;
  top: ${({status, isMembership}) => (status && !isMembership ? '10%' : '30%')};
  left: 29%;
`;

const NoSpotView = styled(NoServieceView)`
  justify-content: center;
  align-items: center;
  left: 18%;
`;

const DiningPress = styled.Pressable``;

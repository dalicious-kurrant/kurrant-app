/* eslint-disable react-hooks/rules-of-hooks */
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import {ko} from 'date-fns/locale';
import {useAtom, useAtomValue} from 'jotai';
import React, {useEffect, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useTheme} from 'styled-components';
import styled, {css} from 'styled-components/native';

// import {getFontStyle} from './style';
import {weekAtom, weekServiceAtom} from '~biz/useBanner/store';
import {calculateSelectDatePosition} from '~biz/useDailyFood/logic';
import {useGetOrderMeal} from '~hook/useOrder';

import {formattedDate, formattedWeekDate} from '~utils/dateFormatter';
import Button from '~components/CalendarButton';
import Typography from '~components/Typography';

import {
  calcDate,
  stringDateToJavascriptDate,
} from '../../../../../utils/dateFormatter';
import {getFontStyle} from '../../../../../components/BuyCalendar2/style';
import {
  makeDietRepoCalendarDateArr,
  makeDietRepoCalendarDateArr7,
} from './logic';

/**
 *
 * @param {} props
 * @param { 'grey2' | 'grey7' } props.type
 * @param { 'grey2' | 'white' } props.color
 * @param { 'Body05R' | 'Body06R'} props.size
 * @returns
 */

const DietRepoCalendarNew = ({
  initialDate,
  BooleanValue,
  type = 'grey7',
  color = 'grey2',
  size = 'Body06R',
  disableTemporarly,
  onPressEvent2,

  onPageScroll2,
  selectDate,

  pagerRef,
  margin = '0px',
  sliderValue,
  isServiceDays,
}) => {
  const pager = pagerRef ? pagerRef : useRef();
  const today = new Date();
  const weekly = useAtomValue(weekAtom);
  const themeApp = useTheme();
  // const {isOrderMeal, orderMeal} = useOrderMeal();
  const {data: isOrderMeal, refetch: orderMealRefetch} = useGetOrderMeal(
    formattedWeekDate(weekly[0][0]),
    formattedWeekDate(
      weekly[weekly.length - 1][weekly[weekly.length - 1].length - 1],
    ),
  );
  const [currentPress, setCurrentPress] = useState(selectDate);
  const [chk, setChk] = useState(0);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const morningServiceDays = isServiceDays?.morningServiceDays;
  const lunchServiceDays = isServiceDays?.lunchServiceDays;
  const dinnerServiceDays = isServiceDays?.dinnerServiceDays;

  const selectedPress = day => {
    setCurrentPress(day);
  };

  ///// 여기부터 재신 코드
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      /// initialDate 가 존재할 경우

      if (initialDate) {
        // console.log('이니셜데이트 ok');
        // console.log(initialDate);
        // console.log(stringDateToJavascriptDate(initialDate, '-'));
        setCalendarDate(stringDateToJavascriptDate(initialDate, '-'));
        setCurrentPress(initialDate);
      } else {
        console.log('이니셜데이트 없음');
      }

      pager.current.setPage(3);
      setChk(3);
      setIsMount(false);
    }, 100);
  }, []);

  return (
    <React.Fragment>
      {BooleanValue ? <Button pager={pager} daily chk={chk} /> : <></>}

      <PagerViewWrap
        ref={pager}
        initialPage={3}
        pageMargin={22}
        onPageScroll={e => {
          //   if (onPageScroll2) onPageScroll2(e);
          //   onPageScroll(e);
        }}
        onPageSelected={e => {
          const {position} = e.nativeEvent;
          // console.log('스크롤 중임 ' + position);

          // 뒤로 가기 , 앞으로 가기

          if (isMount) return false;

          if (chk > position) {
            //뒤로가기

            setCalendarDate(calcDate(-7, calendarDate));
            pager.current.setPageWithoutAnimation(3);
            setChk(3);
          } else if (chk < position) {
            // 앞으로 가기

            setCalendarDate(calcDate(7, calendarDate));
            pager.current.setPageWithoutAnimation(3);
            setChk(3);
          } else {
          }
        }}
        margins={margin}>
        {[...makeDietRepoCalendarDateArr7(calendarDate)].map((week, i) => {
          return (
            <View key={i}>
              <Wrap>
                {week.map((day, idx) => {
                  const txt = format(day, 'EEE', {locale: ko});
                  const now = formattedDate(day) === formattedDate(today);
                  const pressDay = formattedDate(day);
                  const propsDay = formattedWeekDate(day);
                  const lastDay =
                    formattedDate(day, '/') > formattedDate(today, '/');
                  const order = isOrderMeal?.data?.filter(
                    x => x.serviceDate === propsDay,
                  );
                  const isMorning = order?.filter(f => f.diningType === '아침');
                  const isLunch = order?.filter(f => f.diningType === '점심');
                  const isDinner = order?.filter(f => f.diningType === '저녁');
                  const set = new Set(order?.map(x => x.diningType));
                  const orderCount = [...set].length;

                  // 서비스일
                  const morning =
                    (sliderValue === 0 && morningServiceDays?.includes(txt)) ||
                    morningServiceDays?.includes(txt);
                  const lunch =
                    (sliderValue === 1 && lunchServiceDays?.includes(txt)) ||
                    lunchServiceDays?.includes(txt);
                  const dinner =
                    (sliderValue === 2 && dinnerServiceDays?.includes(txt)) ||
                    dinnerServiceDays?.includes(txt);

                  const events = () => {
                    // console.log('날짜 누름');
                    // console.log(day);
                    // console.log(propsDay);
                    selectedPress(day);
                    onPressEvent2(propsDay);
                  };
                  const getDates = () => {
                    // if (day.getDate().toString().length > 1) {
                    //   return day.getDate();
                    // }
                    if (day.getDate() === 1) {
                      return day.getMonth() + '.' + day.getDate();
                    }
                    // if(Platform.OS === 'android')
                    return day.getDate();
                  };
                  return (
                    <DaysWrap
                      key={day}
                      idx={idx}
                      disabled={
                        (lastDay && true) ||
                        morning === false ||
                        lunch === false ||
                        dinner === false
                      }
                      onPress={() => {
                        events();
                      }}>
                      {order ? (
                        <DotWrap>
                          {isMorning?.length > 0 && (
                            <Morning>
                              <OrderDining textColor={themeApp.colors.grey[0]}>
                                아
                              </OrderDining>
                            </Morning>
                          )}
                          {isLunch?.length > 0 && (
                            <Lunch>
                              <OrderDining textColor={themeApp.colors.grey[0]}>
                                점
                              </OrderDining>
                            </Lunch>
                          )}
                          {isDinner?.length > 0 && (
                            <Dinner>
                              <OrderDining textColor={themeApp.colors.grey[0]}>
                                저
                              </OrderDining>
                            </Dinner>
                          )}
                        </DotWrap>
                      ) : (
                        <DotWrap />
                      )}
                      <DayWeek
                        lastDay={lastDay}
                        color={color}
                        size={size}
                        currentPress={currentPress}
                        day={day}
                        morning={morning}
                        lunch={lunch}
                        now={now}
                        dinner={dinner}>
                        {now ? '오늘' : txt}
                      </DayWeek>
                      <TodayCircle
                        now={now}
                        type={type}
                        currentPress={currentPress}
                        day={day}>
                        {(lastDay || !(morning || lunch || dinner)) && (
                          <MidLineBox>
                            <MidLine />
                          </MidLineBox>
                        )}
                        <Day
                          morning={morning}
                          lunch={lunch}
                          dinner={dinner}
                          color={color}
                          lastDay={lastDay}
                          day={day}
                          now={now}
                          currentPress={currentPress}
                          size={size}>
                          {getDates()}
                        </Day>
                      </TodayCircle>
                      {formattedDate(currentPress) === formattedDate(day) ? (
                        <SelectLine />
                      ) : (
                        <SelectDisabledLine />
                      )}
                    </DaysWrap>
                  );
                })}
              </Wrap>
            </View>
          );
        })}
      </PagerViewWrap>
    </React.Fragment>
  );
};

export default DietRepoCalendarNew;

const PagerViewWrap = styled(PagerView)`
  flex: 1;
  margin: ${({margins}) => margins && margins};
`;

const Wrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DaysWrap = styled.Pressable`
  /* padding-left: 10px;
padding-right: 10px; */
  align-items: center;
  justify-content: center;
`;
const SelectLine = styled.View`
  width: 16px;
  height: 1.5px;
  justify-self: center;
  align-self: center;
  margin-top: 5.5px;
  background-color: ${({theme}) => theme.colors.grey[2]};
`;
const SelectDisabledLine = styled.View`
  width: 16px;
  height: 1.5px;
  justify-self: center;
  align-self: center;
  margin-top: 5.5px;
`;
const TodayCircle = styled.View`
  overflow: hidden;
  height: 24px;
  margin-top: 3px;
  align-items: center;
  justify-content: center;
`;
const MidLineBox = styled.View`
  position: absolute;
  z-index: 1;
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const MidLine = styled.View`
  background-color: ${({theme}) => theme.colors.grey[6]};
  height: 1px;
  width: 16px;
`;
const DotWrap = styled.View`
  flex-direction: row;
  justify-content: center;
  height: 11px;
  margin-bottom: 4px;
`;

const Dot = styled.View`
  width: 5px;
  height: 5px;
  border-radius: 50px;
  background-color: ${({theme, lastDay}) =>
    lastDay ? theme.colors.grey[5] : theme.colors.grey[2]};
  margin: 4px 2px 0px 2px;
`;

const Day = styled(Typography)`
  color: ${({lastDay, theme, morning, lunch, dinner, now}) =>
    lastDay
      ? theme.colors.grey[5]
      : morning || lunch || dinner
      ? theme.colors.grey[2]
      : theme.colors.grey[5]};

  ${({currentPress, day, size}) => {
    if (formattedDate(currentPress) === formattedDate(day)) {
      return getFontStyle('Body05SB');
    }
    return getFontStyle(size);
  }}
  min-width: 40px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
const DayWeek = styled(Typography)`
  color: ${({theme}) => theme.colors.grey[2]};
  ${({currentPress, day, size}) => {
    if (formattedDate(currentPress) === formattedDate(day)) {
      return getFontStyle('Body05SB');
    }
    return getFontStyle(size);
  }}
`;
const OrderDining = styled(Typography)`
  font-size: 10px;
  font-weight: 400;
  position: absolute;
  font-family: 'Pretendard-Regular';
  width: 9px;
`;
const Morning = styled.View`
  background-color: #add691;
  align-items: center;
  justify-content: center;
  border-radius: 1px;
  box-sizing: border-box;
  width: 11px;
  height: 11px;
  padding: 0px;
  margin-right: 1px;
`;
const Lunch = styled.View`
  background-color: #ecac87;
  align-items: center;
  justify-content: center;
  border-radius: 1px;
  box-sizing: border-box;
  width: 11px;
  height: 11px;
  padding: 0px;
  margin-right: 1px;
`;
const Dinner = styled.View`
  background-color: #8ccee3;
  align-items: center;
  justify-content: center;
  border-radius: 1px;
  box-sizing: border-box;
  width: 11px;
  height: 11px;
  padding: 0px;
`;
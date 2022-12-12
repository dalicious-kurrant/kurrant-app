import React, { useRef,useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import styled from "styled-components";

import QuestionIcon from '../../../../../assets/icons/MealCart/question.svg';
import Button from '../../../../../components/Button';
import Count from "../../../../../components/Count";
import KeyboardAvoiding from "../../../../../components/KeyboardAvoiding";
import Typography from "../../../../../components/Typography";
import {PAGE_NAME as PaymentPageName} from '../../Payment/Main';

export const PAGE_NAME = 'MEAL_CART_PAGE';
const Pages = ({navigation}) => {
    const [focus,setFocus] = useState(false);
    const [count, setCount] = useState(1);
    const bodyRef = useRef();

    const increasePress = () => {
        setCount(prev => Number(prev) + 1);
      };
    const decreasePress = () => {
        setCount(prev => (prev <= 1 ? 1 : prev - 1));
      };

    const focusPress = () => {
        setFocus(true);
      };
    const blurPress = () => {
        setFocus(false);
      };

    const changeText = number => {
        setCount(number);
      };

    return (
        <SafeView>
            <ScrollViewWrap showsVerticalScrollIndicator={false}>
                <Wrap>
                    <View>
                        <DiningName>4월 21일(월) 점심</DiningName>
                    </View>
                    <ContentWrap>
                        <MealImage source={{uri:'https://cdn.mindgil.com/news/photo/202004/69068_2873_1455.jpg'}}/>
                            <View>
                                <MealName>[폴어스] 리코타 치즈 샐러드</MealName>
                                <SalePriceWrap>
                                    <PointBoldText>20%</PointBoldText>
                                    <Price>8,500원</Price>
                                </SalePriceWrap>
                                <SalePrice>8,500원</SalePrice>
                            </View>
                            <CountWrap>
                                <Count
                                    onPressEvent={() => {bodyRef.current.focus(); focusPress()}} 
                                    count={count} 
                                    increasePress={increasePress}
                                    decreasePress={decreasePress}
                                />
                            </CountWrap>
                            
                    </ContentWrap>
                </Wrap>
                <Wrap>
                    <View>
                        <DiningName>4월 21일(월) 점심</DiningName>
                    </View>
                    <ContentWrap>
                        <MealImage source={{uri:'https://cdn.mindgil.com/news/photo/202004/69068_2873_1455.jpg'}}/>
                            <View>
                                <MealName>[폴어스] 리코타 치즈 샐러드</MealName>
                                <SalePriceWrap>
                                    <PointBoldText>20%</PointBoldText>
                                    <Price>8,500원</Price>
                                </SalePriceWrap>
                                <SalePrice>8,500원</SalePrice>
                            </View>
                            <CountWrap>
                            <Count
                                onPressEvent={() => {bodyRef.current.focus(); focusPress()}} 
                                count={count} 
                                increasePress={increasePress}
                                decreasePress={decreasePress}
                                />
                            </CountWrap>
                    </ContentWrap>
                </Wrap>
                <PaymentWrap>
                    <PaymentView>
                        <PaymentText>총 상품금액</PaymentText>
                        <PaymentText>10,000 원</PaymentText>
                    </PaymentView>
                    <PaymentView>
                        <PaymentText>회사 지원금 사용 금액
                            <QuestionIcon/>
                         </PaymentText>
                         <PaymentText>10,000 원</PaymentText>
                    </PaymentView>
                    <PaymentView>
                        <PaymentText>구독 할인 금액</PaymentText>
                        <PaymentText><PointText>20,000</PointText> 원</PaymentText>
                    </PaymentView>
                    <PaymentView>
                        <PaymentText>배송비</PaymentText>
                        <PaymentText>0 원</PaymentText>
                    </PaymentView>
                    <PaymentView>
                        <PaymentText>포인트 사용금액
                            <QuestionIcon/>
                        </PaymentText>
                    </PaymentView>
                    <PaymentView>
                        
                        <TotalPriceTitle>총 결제금액</TotalPriceTitle>
                        <TotalPrice>10,000 원</TotalPrice>
                    </PaymentView>
                </PaymentWrap>
            </ScrollViewWrap>
            <KeyboardAvoiding
                blurPress={blurPress}
                focus={focus}
                increasePress={increasePress}
                decreasePress={decreasePress}
                bodyRef={bodyRef}
                changeText={changeText}
                count={count}
                value={count.toString()}
            />
            <ButtonWrap>
                <Button label={'총 21개 결제하기'} type={'yellow'} onPressEvent={()=>{navigation.navigate(PaymentPageName)}}/>
            </ButtonWrap>
        </SafeView>
    )

}

export default Pages;

const SafeView = styled.SafeAreaView`
background-color:${props => props.theme.colors.grey[0]};
flex:1;
`;
const ScrollViewWrap = styled.ScrollView`
  //margin:0px 28px;
`;

const Wrap = styled.View`
flex:1;
padding:24px 0px;
border-bottom-color: ${props => props.theme.colors.grey[8]};
border-bottom-width: 1px;
position:relative;
margin:0px 28px;
`;

const MealImage = styled.Image`
width:45px;
height:45px;
border-radius:7px;
margin-right:12px;
`;

const PointBoldText = styled(Typography).attrs({text:'Body05SB'})`
color: ${props => props.theme.colors.green[500]};
padding-right:4px;
`;

const ContentWrap = styled.View`
flex-direction:row;


`;

const Price = styled(Typography).attrs({text:'Body05R'})`
color:${props => props.theme.colors.grey[4]};
`;
const SalePrice = styled(Typography).attrs({text:'Body06R'})`
text-decoration:line-through;
text-decoration-color:${props => props.theme.colors.grey[5]};
color:${props => props.theme.colors.grey[5]};
`;

const SalePriceWrap = styled.View`
flex-direction:row;
`;

const CountWrap = styled.View`
position:absolute;
right:0;
bottom:0;
`;

const ButtonWrap = styled.View`
position:absolute;
bottom:35px;
`;

const PaymentWrap = styled.View`
border-top-color: ${props => props.theme.colors.grey[8]};
border-top-width: 6px;
padding-top:24px;

`;
export const PaymentView = styled.View`
flex-direction:row;
justify-content:space-between;
margin:0px 28px;
`;

const DiningName = styled(Typography).attrs({text:'CaptionR'})`
color:${props => props.theme.colors.grey[2]};
padding-bottom:12px;
`;
const MealName = styled(Typography).attrs({text:'Body05SB'})`
color:${props => props.theme.colors.grey[2]};
`;

export const PaymentText = styled(Typography).attrs({text:'Body05R'})`
color:${props => props.theme.colors.grey[4]};
padding-bottom:16px;
`;

export const PointText = styled(Typography).attrs({text:'Body05R'})`
color: ${props => props.theme.colors.green[500]};
`;

export const TotalPriceTitle = styled(Typography).attrs({text:'Title03SB'})`
color: ${props => props.theme.colors.grey[4]};
`;
export const TotalPrice = styled(Typography).attrs({text:'Title03SB'})`
color: ${props => props.theme.colors.grey[2]};
`;
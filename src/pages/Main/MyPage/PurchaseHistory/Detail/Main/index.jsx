import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { Linking, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import usePurchaseHistory from "../../../../../../biz/usePurchaseHistory";
import Typography from "../../../../../../components/Typography";
import Wrapper from "../../../../../../components/Wrapper";
import { formattedDateAndDay } from "../../../../../../utils/dateFormatter";
import withCommas from "../../../../../../utils/withCommas";
import OrderItem from "./components/orderItem";

export const PAGE_NAME = 'P_MAIN__PURCHASE_DETAIL';

const Pages = ({route}) => {
  const {id} = route.params;
  const navigation = useNavigation();
  const themeApp = useTheme();
  const {getPurchaseDetail,readAbleAtom:{purchaseDetail}} = usePurchaseHistory();
  useEffect(()=>{
    const getData = async()=>{
      const req = {
        purchaseId:id
      }
      const data = await getPurchaseDetail(req);
    }
    getData();
    console.log(purchaseDetail)
  },[])
  
  return (
    <SafeView>
      <ScrollView>
        <Wrapper paddingTop={14}>
          <CodeBlock>
            <Typography text="CaptionR" textColor={themeApp.colors.grey[4]}>{purchaseDetail.code}</Typography>
            <Typography text="CaptionR" textColor={themeApp.colors.grey[4]}>{formattedDateAndDay(purchaseDetail.orderDate)}</Typography>
          </CodeBlock>
          <PurchaseInfoBox>
            <PurchaseInfoList>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[4]}>상품 타입</Typography>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[2]}>{purchaseDetail?.orderType}</Typography>
            </PurchaseInfoList>
            <PurchaseInfoList>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[4]}>주문자</Typography>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[2]}>{purchaseDetail?.userName}</Typography>
            </PurchaseInfoList>
            <PurchaseInfoList>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[4]}>그룹/스팟</Typography>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[2]}>{purchaseDetail?.groupName} / {purchaseDetail?.spotName}</Typography>
            </PurchaseInfoList>
            <PurchaseInfoList>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[4]}>세부 주소</Typography>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[2]}>{purchaseDetail?.ho || "-"}</Typography>
            </PurchaseInfoList>
            <PurchaseInfoList>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[4]}>배송지</Typography>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[2]}>{purchaseDetail?.address}</Typography>
            </PurchaseInfoList>
          </PurchaseInfoBox>
          <OrderItemBox>
            <OrderTitleBox>
              <Typography text="Body05SB" textColor={themeApp.colors.grey[2]}>주문한 제품</Typography>
            </OrderTitleBox>
            {purchaseDetail?.orderItems?.map((v)=>{
              console.log(v);
              return <OrderItem key={v.id} orderItem={v}/>
            })}
            
          </OrderItemBox>
          <PaymentsBox>
            <PaymentsTitle>
              <Typography text="Body05SB" textColor={themeApp.colors.grey[2]}>최종 결제금액</Typography>
            </PaymentsTitle>
            <PaymentsList>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>총 상품금액</Typography>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>{withCommas(purchaseDetail?.defaultPrice)} 원</Typography>
            </PaymentsList>
            <PaymentsList>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>회사 지원금 사용금액</Typography>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>- {withCommas(purchaseDetail?.supportPrice)} 원</Typography>
            </PaymentsList>
            <PaymentsList>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>총 할인금액</Typography>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>- {withCommas(purchaseDetail?.discountPrice)} 원</Typography>
            </PaymentsList>
            <SaleContainer>
              <DateBarBox>
                <DateBar />
              </DateBarBox>
              <SaleBox>
                <SaleItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>멤버십 할인금액</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.membershipDiscountPrice)} 원</Typography>
                </SaleItem>
                <SaleCenterItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>판매자 할인 금액</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.makersDiscountPrice)} 원</Typography>
                </SaleCenterItem>
                <SaleItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>기간 할인 금액</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.periodDiscountPrice)} 원</Typography>
                </SaleItem>
              </SaleBox>
            </SaleContainer>
            <PaymentsList>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>배송비</Typography>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>{withCommas(purchaseDetail?.deliveryFee)} 원</Typography>
            </PaymentsList>
            <PaymentsList>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>포인트 사용금액</Typography>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>- {withCommas(purchaseDetail?.point)} P</Typography>
            </PaymentsList>
            <TotalPriceBox>
              <Typography text="Title03SB" textColor={themeApp.colors.grey[4]}>총 결제금액</Typography>
              <Typography text="Title03SB" textColor={themeApp.colors.grey[2]}>{withCommas(purchaseDetail?.totalPrice)} 원</Typography>
            </TotalPriceBox>
          </PaymentsBox>
          {purchaseDetail?.refundDto && <LineBar />}
          {purchaseDetail?.refundDto && 
          <PaymentsBox>
            <PaymentsTitle>
              <Typography text="Body05SB" textColor={themeApp.colors.grey[2]}>최종 환불금액</Typography>
            </PaymentsTitle>
            <PaymentsList>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>추가 결제금</Typography>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>{withCommas(purchaseDetail?.refundDto?.refundPayPrice)} 원</Typography>
            </PaymentsList>
            <SaleContainer>
              <DateBarBox>
                <DateBar />
              </DateBarBox>
              <SaleBox>
                <SaleItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>상품 금액</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.refundDto?.refundItemPrice)} 원</Typography>
                </SaleItem>           
                <SaleItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>회사 지원금</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.refundDto?.refundSupportPrice)} 원</Typography>
                </SaleItem>                 
              </SaleBox>
            </SaleContainer>
            <PaymentsList>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>배송비</Typography>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>{withCommas(purchaseDetail?.refundDto?.refundDeliveryFee)} 원</Typography>
            </PaymentsList>            
            <SaleContainer>
              <DateBarBox>
                <DateBar />
              </DateBarBox>
              <SaleBox>
                <SaleItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>배송비</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.refundDto?.refundSupportPrice)} 원</Typography>
                </SaleItem>
                <SaleItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>배송비 지원금</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.refundDto?.refundSupportPrice)} 원</Typography>
                </SaleItem>
              </SaleBox>
            </SaleContainer>
            <PaymentsList>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>환불 차감</Typography>
              <Typography text="Body05R" textColor={themeApp.colors.grey[4]}>{withCommas(purchaseDetail?.refundDto?.refundDeduction)} P</Typography>
            </PaymentsList>
            <SaleContainer>
              <DateBarBox>
                <DateBar />
              </DateBarBox>
              <SaleBox>
                <SaleItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>취소/반품 비용 차감</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.refundDto?.refundDeduction)} 원</Typography>
                </SaleItem>
              </SaleBox>
            </SaleContainer>
            <TotalPriceBox>
              <Typography text="Title03SB" textColor={themeApp.colors.grey[4]}>총 환불 금액</Typography>
              <Typography text="Title03SB" textColor={themeApp.colors.grey[2]}>{withCommas(purchaseDetail?.refundDto?.refundTotalPrice)} 원</Typography>
            </TotalPriceBox>
            <SaleContainer>
              <DateBarBox>
                <DateBar />
              </DateBarBox>
              <SaleBox>
                <SaleItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>카드 환불</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.refundDto?.refundCardPrice)} 원</Typography>
                </SaleItem>
                <SaleItem>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>환불 포인트</Typography>
                  <Typography text="CaptionR" textColor={themeApp.colors.grey[5]}>{withCommas(purchaseDetail?.refundDto?.refundTotalPoint)} 원</Typography>
                </SaleItem>
              </SaleBox>
            </SaleContainer>
           
          </PaymentsBox>}
          <PaymentsMethodBox>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[4]}>결제수단</Typography>
              <ReceiptBox>
              <Typography text="CaptionR" textColor={themeApp.colors.grey[2]}>{purchaseDetail?.cardCompany}카드</Typography>
              {purchaseDetail?.receiptUrl ? <ReceiptTouch onPress={()=>Linking.openURL(purchaseDetail?.receiptUrl)}>
                  <ReceiptText text="CaptionR" textColor={themeApp.colors.grey[5]}>(영수증)</ReceiptText>
                </ReceiptTouch> : <Typography text="CaptionR" textColor={themeApp.colors.grey[2]}>({purchaseDetail?.cardNumber})</Typography>}
              </ReceiptBox>
          </PaymentsMethodBox>
          <CancelBox>
            <CancelButton>
              <Typography text="Body05SB" textColor={themeApp.colors.grey[3]}>전체 주문 취소</Typography>
            </CancelButton>
          </CancelBox> 
        </Wrapper>
      </ScrollView>
    </SafeView>
  )
}

export default Pages;

const SafeView = styled.SafeAreaView`
  flex: 1;
`

const CodeBlock = styled.View`
  padding: 18px 24px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const PurchaseInfoBox = styled.View`
  border-bottom-width: 6px;
  border-bottom-color: ${({theme})=> theme.colors.grey[8]};
  border-top-width: 6px;
  border-top-color: ${({theme})=> theme.colors.grey[8]};
  padding: 10px 24px;
`
const PurchaseInfoList = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0px;
`
const OrderItemBox =styled.View`
  border-bottom-width: 6px;
  border-bottom-color: ${({theme})=> theme.colors.grey[8]};
`
const OrderTitleBox = styled.View`
  padding: 17px 24px;
`

const PaymentsBox = styled.View`
  padding: 24px;
`

const PaymentsTitle = styled.View`
  margin-bottom: 16px;
`
const LineBar = styled.View`
  height: 6px;
  width: 100%;
  background-color: ${({theme})=> theme.colors.grey[8]};
`
const PaymentsList = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0px;
`
const TotalPriceBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
`
const PaymentsMethodBox  =styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 6px;
  border-bottom-color: ${({theme})=> theme.colors.grey[8]};
  border-top-width: 6px;
  border-top-color: ${({theme})=> theme.colors.grey[8]};
  padding: 16px 24px;
`
const CancelBox = styled.View`
  padding: 24px;
  padding-bottom: 35px;
`
const CancelButton = styled.Pressable`
  border: 1px solid ${({theme})=> theme.colors.grey[7]};
  border-radius: 7px;
  justify-content: center;
  align-items: center;
  padding: 16px;
`
const SaleContainer  =styled.View`
  flex-direction: row;
  padding-left: 8px;
  padding-bottom: 8px;
`
const DateBarBox = styled.View`
  width: 3px;
  height: 100%;
  padding-top: 4px;
  padding-bottom: 4px;
`
const DateBar = styled.View`
  flex: 1;
  width: 3px;
  background-color: ${({theme})=> theme.colors.grey[7]};
`
const SaleBox  =styled.View`
  width: 100%;
  padding-left: 12px;
`
const SaleItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const SaleCenterItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0px;
`
const ReceiptText = styled(Typography)`
  justify-content: center;
  align-items: center;
  text-align: center;
  text-decoration-line: underline;
`
const ReceiptTouch = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  text-align: center;
`
const ReceiptBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
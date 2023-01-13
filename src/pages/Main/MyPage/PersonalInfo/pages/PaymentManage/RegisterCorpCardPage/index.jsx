import { useFocusEffect, useNavigation } from '@react-navigation/native';
import cardValidator from 'card-validator';
import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import Button from '~components/Button';
import RefTextInput from '~components/RefTextInput';
import Typography from '~components/Typography';
import Wrapper from "~components/Wrapper";
import useKeyboardEvent from '~hook/useKeyboardEvent';

import { PAGE_NAME as PaymentManagePage } from '..';
import { checkCorporateRegiNumber, isValidCardNumber } from '../../../../../../../utils/cardFormatter';
export const PAGE_NAME = "P__MY_PAGE__PAYMENT_MANAGE__REGISTER_CORP_CARD";

const Pages = ()=>{
    const themeApp = useTheme();
    const form = useForm({
        mode:'all'
    });
    const [modalVisible, setModalVisible]=useState(false);

    const card = form.watch('cardNumber')
    const keyboardEvent = useKeyboardEvent();
    const navigation = useNavigation();
    const onSubmit=(data)=>{
      console.log(data);
      navigation.navigate(PaymentManagePage)
    }
    useFocusEffect(
      useCallback(() => {
          navigation.setOptions({
              tabBarLabelStyle:{fontSize:15,lineHeight:21,fontFamily:'Pretendard-SemiBold',}
          })
        return () => {
          navigation.setOptions({
              tabBarLabelStyle:{fontSize:15,lineHeight:21,fontFamily: 'Pretendard-Regular',}
          })
      }
      }, [])
    );
    return(
      <Wrapper paddingTop={24} paddingHorizontal={24} >
          
      <FormProvider {...form} >
      <ScrollView>
      <CardRegisteredBox>
          <RegisteredTitleBox>
              <Typography text='Title03SB' textColor={themeApp.colors.grey[2]}>카드 정보</Typography>
          </RegisteredTitleBox>
          <RegiteredView>
              <RefTextInput
                  label="카드번호"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  keyboardType="numeric"
                  // value={isApplicant.phone}
                  rules={
                      {
                        required: '필수 입력 항목 입니다.',
                        validate: {
                          isValid: (value) => {
                            return (
                              isValidCardNumber(value.replace(/\W/gi, '')) ||
                              '유효한 카드번호를 입력해주세요'
                            );
                          },
                        },
                      }
                    }
              />
          </RegiteredView>
          <RegiteredView>
              <RefTextInput
                  label="유효기간"
                  name="cardExpDate"
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  // value={isApplicant.phone}
                  rules={
                      {
                        required: '필수 입력 항목 입니다.',
                        validate: {
                          isValid: (value) => {
                            return (
                              cardValidator.expirationDate(value).isValid ||
                              '올바른 유효기간을 입력해주세요'
                            );
                          },
                        },
                      }
                    }
              />
          </RegiteredView>
          <RegiteredView>
              <RefTextInput
                  label="CVC(보안코드)"
                  name="cardSecret"
                  placeholder="카드 뒷면 세자리"
                  keyboardType="numeric"
                  // value={isApplicant.phone}
                  rules={
                      {
                        required: '필수 입력 항목 입니다.',
                        validate: {
                          isValid: (value) => {
                            const {card:{type}}= cardValidator.number(card.replace(/\W/gi, ''))
                            if(type ==="american-express"){
                              return (
                                cardValidator.cvv(value,4).isValid ||
                                '올바른 보안코드를 입력해주세요'
                              );
                            }
                            return (
                              cardValidator.cvv(value).isValid ||
                              '올바른 보안코드를 입력해주세요'
                            );
                          },
                        },
                      }
                    }
              />
          </RegiteredView>
          <RegiteredView>
              <RefTextInput
                  label="사업자등록번호"
                  name="cardCorpNumber"
                  placeholder="0000000000"
                  keyboardType="numeric"
                  // value={isApplicant.phone}
                  rules={
                      {
                        required: '필수 입력 항목 입니다.',
                        validate: {
                          isValid: (value) => {
                              console.log(value)
                            return (
                              checkCorporateRegiNumber(value) ||
                              '유효한 사업자등록번호를 입력해주세요'
                            );
                          },
                        },
                      }
                    }
              />
          </RegiteredView>
          <RegiteredView>
              <RefTextInput
                  label="비밀번호"
                  name="cardPass"
                  placeholder="앞에 두자리"
                  keyboardType="numeric"
                  isPassword={true}                  
                  rules={
                      {
                        required: '필수 입력 항목 입니다.',
                        maxLength:{
                          value:2,
                          message:"올바른 비밀번호를 입력해주세요"
                        }
                      }
                    }
              />
          </RegiteredView>
      </CardRegisteredBox>
      </ScrollView>
      <ButtonBox>
      {!keyboardEvent.isKeyboardActivate && <Button
      label='등록하기' 
      onPressEvent={form.handleSubmit(onSubmit)}
      />}
      </ButtonBox>        
      </FormProvider>   
      
  </Wrapper>
    )
}

export default Pages;

const CardRegisteredBox = styled.View`
`
const RegisteredTitleBox = styled.View`
    flex-direction: row;
    margin-bottom: 28px;
`
const RegiteredView = styled.View`
    margin-top: 12px;
    margin-bottom: 12px;
`
const ButtonBox = styled.View`
    position: absolute;
    bottom:35px;
    align-items: center;
    justify-content: center;
    left: 24px;
`
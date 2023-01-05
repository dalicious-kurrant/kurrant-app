import Postcode from '@actbase/react-daum-postcode';
import { useNavigation } from '@react-navigation/native';
import { useAtom } from 'jotai';
import React from "react";
import { SafeAreaView, Text } from "react-native";
import styled from "styled-components";

import { isCorpFullAddressAtom, isCorpSendAddressInfoAtom } from '../../../../../../biz/useCorporationApplication/store';




export const PAGE_NAME = 'CORPORATION__APPLICATION__INFORMAION_POSTCODE';
const Pages = () =>{

    const navigation = useNavigation();
    const [,setCorpFullAddress] = useAtom(isCorpFullAddressAtom); //TextInput 에 보여줄 주소
    const [,setSendAddress] = useAtom(isCorpSendAddressInfoAtom); // body에 담을 주소

    const handleAddress = (data) => {
        let fullAddress = data.address;
        let extraAddress = ''; 
        const zipcode = data.zonecode;
        const zibunAddress = data.jibunAddress;
        const roadAddress = data.query;
        
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        
        setCorpFullAddress(fullAddress);
        setSendAddress({
          'zipCode' : Number(zipcode),
          'address1' : zibunAddress,
          'address2' : roadAddress,
          
        })
      }
    
    return (
        <ModalWrap>
            <PostCodeView 
            onSelected={(data) => {
                handleAddress(data);
                
                navigation.goBack()
            }} 
            />      
        </ModalWrap>
        
    )
}

export default Pages;

const PostCodeView = styled(Postcode)`
width:100%;
height:100%;
`;

const ModalWrap = styled.SafeAreaView`
flex:1;
justify-content:center;
align-items:center;
`;
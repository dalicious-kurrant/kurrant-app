import { useNavigation } from "@react-navigation/native";
import React, {  } from "react";
import styled, { useTheme } from "styled-components/native";

import Wrapper from "~components/Wrapper";

import HTML , { defaultSystemFonts }from 'react-native-render-html'
import { Dimensions, ScrollView } from "react-native";
export const PAGE_NAME = "P__MY_PAGE__NOTICE_DETAIL"

const Pages =  ()=>{
    const systemFonts = [...defaultSystemFonts, 'Pretendard-Regular', 'Pretendard-SemiBold'];
    const themeApp = useTheme();
    const navigation = useNavigation();
    const content= `<div>
    디에이치 반포 라클라스 주민여러분 반갑습니다. ^^
    </br>
    </br>
    11월 08일부터 </br>
    조식서비스로 제공되고 있던 코끼리 샐러드의 메뉴가 
    식재료 비용 및 부자재 비용의 증가로
    판매가가 조정될 예정입니다.
    </br>
    <div style ="text-align:center";>
        <img width="200" src="data:image/jpeg;base64,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">
    </div>
    </br>
    <div style ="text-align:center";>
        <img width="200" src="data:image/jpeg;base64,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">
    </div>
    </br>
    더불어, 샐러드 신메뉴도 추가되었습니다.
    주문 시 참고 부탁드립니다 :)
    </br>
    </br>
    감사합니다.
    </div>
    `;
    const source = {
        html: `<div style='padding-left:24px; padding-right:20px; '> 
        <div style="margin:0; padding: 0 ; width:100%; font-weight: 600; fontFamily:'Pretendard-SemiBold'; font-size:20px; line-height:26px; color:${themeApp.colors.grey[2]}">신규 기능 안내 - 코끼리 샐러드 판매가조정 공지사항</div>
        <div style="margin:0; padding: 0 ; margin-top:4px; font-weight: 400; fontFamily:'Pretendard-Regular'; font-size:13px; line-height:19px; color:${themeApp.colors.grey[4]}">2022.12.05</div>
        <div style="width:100%; height:1px; margin:24px 0px; background-color:${themeApp.colors.grey[8]}"></div>
        ${content}
        </div>`
      };

    return(
        <Wrapper paddingTop={24}>
            <ScrollView>
            <HTML 
                contentWidth={Dimensions.get('window').width}
                source={source}
                systemFonts={systemFonts}
            />
            </ScrollView>
        </Wrapper>
    )
}


export default Pages;

const TitleBox = styled.View`
    margin-bottom: 24px;
`
const TitleBtnBox = styled.View`
    min-width: 106px;
    max-width: 110px;
    margin-left: 82px;
    align-items: center;
    text-align: center;
    justify-content: center;
`
const DescriptionBox = styled.View`
    margin: 24px;
    margin-top: 33px;
`
const Line = styled.View`
    width: 100%;
    height: 12px;
    background-color: ${({theme})=> theme.colors.grey[8]};
`
const FAQBox = styled.View`
    padding: 16px 24px;
`
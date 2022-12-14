import { CommonActions, useNavigation } from "@react-navigation/native";
import React from "react"
import styled from "styled-components";
import { useTheme } from "styled-components/native";

import { SignUpComplate } from "../../../../../assets"
import Button from "../../../../../components/Button";
import Image from '../../../../../components/Image';
import Typography from "../../../../../components/Typography";
import { SCREEN_NAME } from "../../../../../screens/Main/Bnb";
import { PAGE_NAME as LoginPage } from "../../EmailLogin";
import { PAGE_NAME as LoginMain } from "../../Login/LoginMain";
export const PAGE_NAME = 'P_SIGN_UP__MODAL__SIGN_UP_COMPLATE';

const Pages = () => {
    const themeApp = useTheme();
    const navigation = useNavigation();
    return (
        <Conotainer>
            <Image imagePath={SignUpComplate} scale={1.0}/>
            <Title textColor={themeApp.colors.grey[2]}>김달리님, 환영합니다!</Title>
            <CaptionText textColor={themeApp.colors.grey[4]}>커런트 가입을 축하드려요. {'\n'}이제 맛있는 식사를 주문해볼까요?</CaptionText>
            <ButtonContainer>
                <Button
                    type='yellow'
                    label={"시작하기"}
                    onPressEvent={() => {
                        // navigation.popToTop()
                        // navigation.navigate(LoginPage)
                        navigation.reset({
                            index: 0,
                            routes: [
                              {
                                name: SCREEN_NAME,
                              },
                            ],
                          })
                    }}
                />
            </ButtonContainer>
        </Conotainer>
    )
}

export default Pages;

const Conotainer = styled.View`
    background-color: white;
    flex: 1;
    align-items: center;
    padding-top: 100px;
`
const Title = styled(Typography).attrs({text:'LargeTitle'})`
    margin-top: 10px;
    text-align: center;
`

const CaptionText= styled(Typography).attrs({text:'Body05R'})`
    margin-top: 10px;
    text-align: center;
`

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 22px;
  margin-bottom: 24px;
`;
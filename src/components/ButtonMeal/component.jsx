import React from "react";
import styled from "styled-components";

import Typography from "../Typography";


const Component = ({
    label,
    onPressEvent = () => {console.log('dddd')}

}) => {
    return (
        <Wrap onPress={onPressEvent}>
            <Label>{label}</Label>
        </Wrap>
    )

}

export default Component ;

const Wrap = styled.Pressable`
width:77px;
height:32px;
border:1px solid ${props => props.theme.colors.grey[7]}; 
border-radius:100px;
background-color:${props => props.theme.colors.grey[0]};
align-items:center;
justify-content:center;
margin-left:6px;
`;

const Label = styled(Typography).attrs({text:'Button10SB'})`
color:${props => props.theme.colors.grey[3]};
`;
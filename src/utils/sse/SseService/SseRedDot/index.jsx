import React from 'react';

import styled from 'styled-components/native';

/**
 * @param { object} props
 * @param { string } props.name useFormContext_name
 * @param { string } props.title 버튼의 타이틀
 * @param { object } props.contents 배열 안에 객체 반복
 
 * @returns
 */

const Component = ({children}) => {
  return (
    <Container>
      <RedDot />
      {children}
    </Container>
  );
};

export default Component;

const Container = styled.View``;

const RedDot = styled.View`
  position: relative;
  right: -20px;
  top: 6px;
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${({theme}) => theme.colors.red[500]};
`;

// const TitleWrap = styled.View`
//   margin-bottom: 4px;
// `;
// const Title = styled(Typography).attrs({ variant: 'h500', weight: 'R' })`
//   color: ${({ theme }) => theme.colors.neutral[700]};
// `;

// const ItemWrap = styled.View`
//   flex-direction: row;
//   align-items: flex-start;
// `;
// const Wrapper = styled.Pressable`
//   margin-right: 8px;
//   padding: 9px 16px;
//   border-radius: 6px;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   ${({ checked }) => getBorderColor(checked)};
//   ${({ checked }) => getBackgroundColor(checked)};
// `;
// const IconWrap = styled.View`
//   margin-right: 2px;
// `;

// const LabelWrap = styled.View``;

// const Label = styled(Typography).attrs({ variant: 'h500', weight: 'B' })`
//   ${({ checked }) => getTextColor(checked)};
// `;

import React from 'react';
import {Path, Svg} from 'react-native-svg';
import styled from 'styled-components';

import IconWrapper from '../component';
/**
 *
 * @param {object} props
 * @param {'arrow-down'} props.name
 * @param {number} props.size
 * @param {string} props.color
 * @Reference https://oblador.github.io/react-native-vector-icons/
 * @returns
 */
const Component = ({
  width = '32px',
  height = '32px',
  size = 20,
  color = '#FDC800',
  style = 'white',
}) => {
  return (
    <Wrapper width={width} height={height}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.5403 28.701C15.4283 29.2876 16.5736 29.2876 17.4603 28.701C20.2803 26.8396 26.4203 22.3903 29.0656 17.4116C32.5523 10.8436 28.4576 4.29297 23.0443 4.29297C19.959 4.29297 18.103 5.90497 17.0763 7.2903C16.953 7.45997 16.7913 7.59806 16.6044 7.69327C16.4175 7.78848 16.2107 7.83811 16.001 7.83811C15.7912 7.83811 15.5844 7.78848 15.3975 7.69327C15.2107 7.59806 15.0489 7.45997 14.9256 7.2903C13.899 5.90497 12.043 4.29297 8.95763 4.29297C3.54429 4.29297 -0.550372 10.8436 2.93763 17.4116C5.58029 22.3903 11.723 26.8396 14.5403 28.701Z"
          fill="#E4E3E7"
        />
      </Svg>
    </Wrapper>
  );
};

export default Component;

const Wrapper = styled.View`
  width: ${({width}) => width};
  height: ${({height}) => height};
`;

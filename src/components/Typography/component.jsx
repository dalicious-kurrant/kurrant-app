import React from 'react';
import styled, {css} from 'styled-components/native';

import {variantStyles, optionStyles, weightStyles} from './styles';

/**
 * @param {object} props
 * @param {'h300' | 'h400' | 'h500' | 'h600'| 'h700'| 'h800'| 'h900'| 'h300'} props.variant
 * @param {'R' | 'M' | 'B' } props.weight
 * @param {'right' | 'center' | 'left' } props.align
 * @param {'longform' | 'underline' } props.option
 * @param {string} props.textColor
 * @returns
 */
const Component = ({
  children,
  variant,
  weight,
  align,
  option,
  textColor,
  ...rest
}) => {
  return (
    <Typography
      weight={weight}
      align={align}
      variant={variant}
      option={option}
      textColor={textColor}
      {...rest}>
      {children}
    </Typography>
  );
};

const Typography = styled.Text`
  font-style: normal;
  font-family: ${({theme}) => theme.font.fontFamily};

  ${({variant}) => variant && variantStyles[variant]};
  ${({option}) => option && optionStyles[option]}
  ${({weight}) => weight && weightStyles[weight]};

  ${({align}) =>
    align &&
    css`
      text-align: ${align};
    `};

  ${({theme, textColor}) => {
    if (!textColor) return null;

    const isNeedNotProperty = Array.isArray(textColor);
    return isNeedNotProperty
      ? css`
          ${textColor}
        `
      : css`
          color: ${textColor};
        `;
  }};
  background-color: transparent;
`;

export default Component;

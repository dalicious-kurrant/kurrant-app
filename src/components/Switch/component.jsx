import React, { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

import {
  getToggleBackgroundColor,
  getToggleWrapSize,
  getToggleSize,
  getToggleTop,
} from './style';

/**
 *
 * @param { object } props
 * @param { string } props.name
 * @param { 'sm' | 'md' } props.size
 * @param { boolean } props.agree
 * @returns
 */

const Component = ({ name, size = 'md', agree = true }) => {
  const translation = useRef(new Animated.Value(0)).current;

  const { control, watch } = useFormContext();
  const [toggle, setToggle] = useState(agree);

  const watching = watch('toggleChecked');

  const switchOnOff = () => {
    agree
      ? !toggle
        ? (Animated.spring(translation, {
          toValue: 0,
          useNativeDriver: true,
        }).start(),
          setToggle(!toggle))
        : size === 'sm'
          ? (Animated.spring(translation, {
            toValue: 11,
            useNativeDriver: true,
          }).start(),
            setToggle(!toggle))
          : (Animated.spring(translation, {
            toValue: 20,
            useNativeDriver: true,
          }).start(),
            setToggle(!toggle))
      : toggle
        ? (Animated.spring(translation, {
          toValue: 0,
          useNativeDriver: true,
        }).start(),
          setToggle(!toggle))
        : size === 'sm'
          ? (Animated.spring(translation, {
            toValue: -11,
            useNativeDriver: true,
          }).start(),
            setToggle(!toggle))
          : (Animated.spring(translation, {
            toValue: -20,
            useNativeDriver: true,
          }).start(),
            setToggle(!toggle));
  };

  return (
    <Wrap>
      <Controller
        control={control}
        name={name}
        defaultValue={agree}
        render={({ field: { onChange, value } }) => {
          const pressEvent = value => {
            onChange(!value), switchOnOff();
          };
          return (
            <ToggleWrap
              toggle={toggle}
              size={size}
              onPress={() => pressEvent(value)}>
              <Toggle
                toggle={agree}
                size={size}
                style={{ transform: [{ translateX: translation }] }}
              />
            </ToggleWrap>
          );
        }}
      />
    </Wrap>
  );
};

export default Component;

const Wrap = styled.View``;

const ToggleWrap = styled.Pressable`
  ${({ size }) => getToggleWrapSize(size)};
  ${({ toggle }) => getToggleBackgroundColor(toggle)};
  border-radius: 20px;
  position: relative;
`;
const Toggle = styled(Animated.View)`
  ${({ size }) => getToggleSize(size)};
  ${({ size, toggle }) => getToggleTop(size, toggle)};
  background-color: ${({ theme }) => theme.colors.neutral[0]};
  border-radius: 20px;
  position: absolute;
`;

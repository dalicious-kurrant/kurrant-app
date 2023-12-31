import React, {useRef, useState} from 'react';
import {useEffect} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {Animated} from 'react-native';
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

const Component = ({
  name,
  size = 'md',
  agree = true,
  toggleEvent = () => {},
}) => {
  const translation = useRef(new Animated.Value(0)).current;

  const {control} = useFormContext();
  const [toggles, setToggles] = useState(agree);

  const switchOnOff = agr => {
    !toggles
      ? agr
        ? Animated.spring(translation, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        : size === 'sm'
        ? Animated.spring(translation, {
            toValue: -6,
            useNativeDriver: true,
          }).start()
        : Animated.spring(translation, {
            toValue: -9,
            useNativeDriver: true,
          }).start()
      : !agr
      ? Animated.spring(translation, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
      : size === 'sm'
      ? Animated.spring(translation, {
          toValue: 6,
          useNativeDriver: true,
        }).start()
      : Animated.spring(translation, {
          toValue: 10,
          useNativeDriver: true,
        }).start();
  };
  useEffect(() => {
    // setToggle(agree);
    switchOnOff(agree);
  }, [toggles]);
  useEffect(() => {
    setToggles(agree);
    // switchOnOff(agree)
  }, [agree]);
  return (
    <Wrap>
      <Controller
        control={control}
        name={name}
        value={agree}
        defaultValue={agree}
        render={({field: {onChange, value}}) => {
          const pressEvent = () => {
            onChange(!value);
            // switchOnOff();
            toggleEvent(name);
          };
          return (
            <ToggleWrap toggle={agree} size={size} onPress={pressEvent}>
              <Toggle
                toggle={agree}
                size={size}
                style={{transform: [{translateX: translation}]}}
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
  ${({size}) => getToggleWrapSize(size)};
  ${({toggle}) => getToggleBackgroundColor(toggle)};
  border-radius: 20px;
  position: relative;
`;
const Toggle = styled(Animated.View)`
  ${({size}) => getToggleSize(size)};
  ${({size, toggle}) => getToggleTop(size, toggle)};
  background-color: ${({theme}) => theme.colors.grey[0]};
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  position: absolute;
`;

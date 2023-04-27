import React, {useEffect, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {Platform, Text, TextInput, View} from 'react-native';
import styled, {css} from 'styled-components';
import Typography from '../../../../../../components/Typography';
import {useTheme} from 'styled-components/native';

const ReviewInput = ({
  editContentInput,
  charLength,
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const {
    control,
    formState: {errors},
  } = useFormContext();
  const themeApp = useTheme();
  const textInputProps = {
    // placeholder,
    autoComplete: 'off',
    editable: true,
    autoCapitalize: 'none',
  };

  const [editContent, setEditContent] = useState(undefined);

  useEffect(() => {
    if (editContentInput) {
      setEditContent(editContentInput);
    }
  }, [editContentInput]);

  return (
    <>
      <Controller
        control={control}
        name="review"
        rules={{
          minLength: {value: 10, message: '최소 10자 이상 입력해주세요'},
          maxLength: {value: 500, message: '최대 500자 까지 입력해주세요'},
        }}
        render={({field: {value, onChange}, fieldState: {error}}) => (
          <ViewWrap>
            <Input
              style={{
                textAlignVertical: 'top',
              }}
              isAndroid={Platform.OS === 'android'}
              placeholderTextColor={themeApp.colors.grey[5]}
              {...textInputProps}
              defaultValue={editContent ? editContent : undefined}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              multiline
              numberOfLines={20}
              placeholder={'최소 10자 이상 입력해주세요'}
            />

            <ViewView>
              {/* {error && (
                <Typography textColor={themeApp.colors.red[500]} style={{alignSelf: 'stretch'}}>
                  {error.message}
                </Typography>
              )} */}
            </ViewView>
          </ViewWrap>
        )}
      />
    </>
  );
};

export default ReviewInput;

const Input = styled.TextInput`
  border: 1px solid ${props => props.theme.colors.grey[7]};
  padding: 17px 20px;
  height: 168px;
  border-radius: 14px;
  font-weight: 400;
  font-size: 16px;
  font-family: 'Pretendard-Regular';

  ${({isAndroid}) => {
    if (isAndroid) {
      return css`
        /* font-size: 16px;
        padding: 17px 14px; */
      `;
    }
  }}
`;

const ViewWrap = styled.View``;

const ViewView = styled.View`
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
`;

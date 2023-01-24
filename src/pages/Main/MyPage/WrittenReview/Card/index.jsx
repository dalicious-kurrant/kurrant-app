import React from 'react';
import {Dimensions} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import styled from 'styled-components';
import Typography from '../../../../../components/Typography';
import ArrowRight from '../../../../../assets/icons/Arrow/arrowRight.svg';

export const pathFind = 'yo';

const Component = () => {
  return (
    <Container>
      <TopWrap>
        <TitleWrap>
          <RestaurentNameText>
            {' '}
            {'['}
            폴어스
            {']'}
            리코타 치즈 샐러드
          </RestaurentNameText>
          <ArrowRight />
        </TitleWrap>

        <EditWrap>
          <Pressable>
            <EditText>수정</EditText>
          </Pressable>
          <Pressable>
            <DeleteText>삭제</DeleteText>
          </Pressable>
        </EditWrap>
      </TopWrap>
      <RowWrap>
        <StarsWrap>{}</StarsWrap>

        <PostDateText>2022. 02. 11 작성</PostDateText>
      </RowWrap>
      <ImagesWrap>
        <ImageWrap>
          <MealImage
            source={{
              uri: 'https://cdn.mindgil.com/news/photo/202004/69068_2873_1455.jpg',
            }}
          />
        </ImageWrap>
        <ImageWrap>
          <MealImage
            source={{
              uri: 'https://cdn.mindgil.com/news/photo/202004/69068_2873_1455.jpg',
            }}
          />
        </ImageWrap>
        <ImageWrap>
          <MealImage
            source={{
              uri: 'https://cdn.mindgil.com/news/photo/202004/69068_2873_1455.jpg',
            }}
          />
        </ImageWrap>
        <ImageWrap>
          <MealImage
            source={{
              uri: 'https://cdn.mindgil.com/news/photo/202004/69068_2873_1455.jpg',
            }}
          />
        </ImageWrap>
        <ImageWrap>
          <MealImage
            source={{
              uri: 'https://cdn.mindgil.com/news/photo/202004/69068_2873_1455.jpg',
            }}
          />
        </ImageWrap>
        <ImageWrap>
          <MealImage
            source={{
              uri: 'https://cdn.mindgil.com/news/photo/202004/69068_2873_1455.jpg',
            }}
          />
        </ImageWrap>
      </ImagesWrap>
      <ReviewWrap></ReviewWrap>
      <CommentWrap></CommentWrap>
    </Container>
  );
};

export default Component;

const Container = styled.View`
  width: 100%;
  height: 60px;
  background-color: azure;
  margin: 24px 0;
`;

const TopWrap = styled.View`
  flex-direction: row;

  justify-content: space-between;
`;
const TitleWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RestaurentNameText = styled(Typography).attrs({text: 'Body05SB'})`
  color: ${props => props.theme.colors.grey[2]};
  margin-right: 4px;
`;

const EditWrap = styled.View`
  flex-direction: row;
`;

const EditText = styled(Typography).attrs({text: 'Body05R'})`
  color: ${props => props.theme.colors.blue[500]};
  margin-right: 6px;
`;
const DeleteText = styled(Typography).attrs({text: 'Body05R'})`
  color: ${props => props.theme.colors.grey[4]};
  margin-left: 6px;
`;

const RowWrap = styled.View`
  flex-direction: row;
`;
const StarsWrap = styled.View`
  flex-direction: row;
`;

const PostDateText = styled.Text``;

const ImagesWrap = styled.View`
  flex-direction: row;
`;

const ImageWrap = styled.View`
  ${() => {
    const widthyo = (Dimensions.get('screen').width - 48) / 6;

    return `
      width:  ${widthyo}px;
      height: ${widthyo}px;
    `;
  }}
  padding: 2px;
`;

const MealImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 7.5px;
`;

const ReviewWrap = styled.View``;
const CommentWrap = styled.View``;

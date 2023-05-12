import {Text} from 'react-native';
import styled from 'styled-components';
import LineChart from '../Chart/LineChart';

export const PAGE_NAME = 'P_MAIN__DIET_REPO__HISTORY';

const Pages = () => {
  return (
    <Container>
      <Text>다이어트 레포</Text>
      <LineChart />
    </Container>
  );
};
export default Pages;

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  align-items: center;
`;

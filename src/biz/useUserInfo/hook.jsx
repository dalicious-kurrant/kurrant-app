import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useAtom} from 'jotai';
import {Alert} from 'react-native';
import {PAGE_NAME as LoginPageName} from '~pages/Main/Login/Login';

import * as Fetch from './Fetch';
import {isUserInfoAtom, isUserInfoLoadingAtom} from './store';
import {userRoleAtom} from '../useAuth/store';
const useUserInfo = () => {
  const [isUserInfo, setUserInfo] = useAtom(isUserInfoAtom);
  const [isUserInfoLoading, setUserInfoLoading] = useAtom(
    isUserInfoLoadingAtom,
  );

  const {userRole} = useAtom(userRoleAtom);

  const navigation = useNavigation();
  const userInfo = async () => {
    try {
      setUserInfoLoading(true);
      const res = await Fetch.userInfomation();
      // console.log(res.data);
      setUserInfo(res.data);
      return res.data;
    } catch (err) {
      if (err.toString()?.replace('Error:', '').trim() === '403') {
        AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [
            {
              name: LoginPageName,
              params: {
                token: 'end',
              },
            },
          ],
        });
      }
    } finally {
      setUserInfoLoading(false);
    }
  };

  return {
    userInfo,
    isUserInfo,
    isUserInfoLoading,
  };
};

export default useUserInfo;

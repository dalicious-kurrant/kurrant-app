import { useAtom } from 'jotai';
import mSleep from '../../helpers/mSleep';
import { getStorage } from '../../utils/asyncStorage';
import { fetchJson } from "../../utils/fetch";
import useAuth from '../useAuth';
import { userRoleAtom } from '../useAuth/store';

export async function userInfomation() {


  const fetchRes = await fetchJson(`/users/me/userInfo`, 'GET');

  return fetchRes
  if (userRole === "ROLE_GUEST") {
    await mSleep(100);
    return {
      "data": {
        "name": "테스트",
        "phone": "01000000000",
        "email": "test.daliciouos.com",
        "isMembership": false,
        "groupId": 1,
        "group": "위시티자이아파트",
        "spotType": 0,
        "spotId": 1,
        "spot": "스팟1",
        "point": 0,
        "membershipUsingPeriod": 0,
        "userRoel": true
      },
    }
  }
}
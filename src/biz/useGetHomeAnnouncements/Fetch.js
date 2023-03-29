import {fetchJson} from '../../utils/fetch';

// 프라이빗 스팟 신청내역 조회
export async function getAnnouncements(id) {
  const fetchRes = await fetchJson(`/boards/notices?type=${id}`, 'GET');

  return fetchRes;
}

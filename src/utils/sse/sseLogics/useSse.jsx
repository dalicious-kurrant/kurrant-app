import {useAtom} from 'jotai';
import {useEffect} from 'react';
import {useQuery, useMutation} from 'react-query';

import * as sseAtoms from './store';
import {fetchJson} from '../../fetch';

const useSse = () => {
  const [sseType1, setSseType1] = useAtom(sseAtoms.sseType1Atom);
  const [sseType2, setSseType2] = useAtom(sseAtoms.sseType2Atom);
  const [sseType3, setSseType3] = useAtom(sseAtoms.sseType3Atom);
  const [sseType4, setSseType4] = useAtom(sseAtoms.sseType4Atom);
  const [sseType5, setSseType5] = useAtom(sseAtoms.sseType5Atom);
  const [sseType6, setSseType6] = useAtom(sseAtoms.sseType6Atom);
  const [sseType7, setSseType7] = useAtom(sseAtoms.sseType7Atom);
  const [sseType8, setSseType8] = useAtom(sseAtoms.sseType8Atom);

  // sse 메세지 이력 받아오기
  const {data: sseHistory, refetch: sseHistoryRefetch} = useQuery(
    ['sse', 'notification'],
    async ({queryKey}) => {
      const response = await fetchJson(
        `/notification`,

        'GET',
      );

      return response?.data;
    },
    {
      // enabled: false,
    },
  );

  // sse 알림 읽었다고 서버에 보내주기
  const {mutate: confirmSseIsRead} = useMutation(
    async data => {
      const response = await fetchJson('/notification/read', 'PUT', {
        body: JSON.stringify(data),
      });

      return [response, data?.type];
    },
    {
      onSuccess: data => {
        const messageType = data[1];

        switch (messageType) {
          case 1:
            // type: 1 전체공지 (구현중)
            console.log('sse 알림읽기 성공 message type 1 (전체공지)');
            setSseType1({});
            sseHistoryRefetch();
            break;
          case 2:
            // type: 2 스팟공지 (프론트 구현중)
            console.log('sse 알림읽기 성공 message type 2 (스팟공지)');
            setSseType2({});
            sseHistoryRefetch();
            break;
          case 3:
            // type: 3 구매후기 (완료)
            console.log('sse 알림읽기 성공 message type 3 (구매후기)');
            setSseType3({});
            sseHistoryRefetch();

            break;
          case 4:
            // type: 4 마감시간
            console.log('sse 알림읽기 성공 message type 4 (마감시간)');
            setSseType4({});
            sseHistoryRefetch();
            break;
          case 5:
            // type: 5 다음주 식사 구매하셨나요? (완료)
            console.log(
              'sse 알림읽기 성공 message type 5 (다음주 식사 구매하셨나요?)',
            );

            setSseType5({});
            sseHistoryRefetch();
            break;
          case 6:
            // type: 6 알림관련 (완료)
            console.log('sse 알림읽기 성공 message type 6 (알림관련)');

            setSseType6({});
            sseHistoryRefetch();
            break;
          case 7:
            // type: 7 그룹 스팟공지 (완료)
            console.log('sse 알림읽기 성공 message type 7 (그룹)');

            setSseType7({});
            sseHistoryRefetch();
            break;
          case 8:
            // type: 8 댓글 (완료)
            console.log('sse 알림읽기 성공 message type 8 (댓글)');

            setSseType8({});
            sseHistoryRefetch();
            break;
          default:
            break;
        }
      },
      onError: err => {
        console.log('confirmSseIsRead(sse읽음확인 api)에 error가 났습니다');
        console.log(err);
      },
    },
  );

  return {
    sseType1,
    sseType2,
    sseType3,
    sseType4,
    sseType5,
    sseType6,
    sseType7,
    sseType8,
    confirmSseIsRead,

    sseHistory,
    sseHistoryRefetch,
  };
};

export default useSse;

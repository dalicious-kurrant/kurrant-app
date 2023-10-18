import {useMutation, useQuery, useQueryClient} from 'react-query';

import {recommendMakersApis} from '../api/recommendMakers';

// 메이커스 추천 생성
export function useSendRecommend() {
  const queryClient = useQueryClient();
  return useMutation(data => recommendMakersApis.postRecommend(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('recommendMakers');
    },
  });
}

// 메이커스 추천 조회
export function useGetRecommend(id) {
  return useQuery('recommendMakers', () => {
    return recommendMakersApis.getRecommend(id);
  });
}

// 메이커스 추천 취소
export function useCancelRecommend() {
  const queryClient = useQueryClient();
  return useMutation(data => recommendMakersApis.cancelRecommend(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('recommendMakers');
    },
  });
}

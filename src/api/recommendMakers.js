import {fetchJson} from '../utils/fetch';

export const recommendMakersApis = {
  postRecommend: async data =>
    await fetchJson('/application-forms/makers', 'POST', {
      body: JSON.stringify(data),
    }),
  getRecommend: async id => await fetchJson(`/application-forms/makers/${id}`),
  cancelRecommend: async data =>
    await fetchJson('/application-forms/makers', 'PATCH', {
      body: JSON.stringify(data),
    }),
};

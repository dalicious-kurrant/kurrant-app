import {fetchJson} from '../utils/fetch';

export const qrApis = {
  getQr: async id => await fetchJson(`/users/me/orders/qr/${id}`),
};

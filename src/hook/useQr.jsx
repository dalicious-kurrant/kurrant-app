import {useQuery} from 'react-query';

import {qrApis} from '../api/qr';

export function useGetQR(id, modal) {
  return useQuery(
    'qrData',
    () => {
      return qrApis.getQr(id);
    },
    {
      enabled: modal && !!id,
      retry: false,
    },
  );
}

import { topologyApi } from '../../../api/api';
import storage from '../../../utils/storage';

export const toplogyLoader = async ({ request }: { request: Request }) => {
  const formData = new FormData();
  formData.append('providers', 'digital_ocean');
  const res = await topologyApi.getTopologyGraph({
    headers: {
      authorization: `Bearer ${storage.getAuth().access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
    method: 'POST',
  });
  console.log('res', res);
  return {};
};

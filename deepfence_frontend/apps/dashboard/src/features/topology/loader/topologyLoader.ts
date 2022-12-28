import { topologyApi } from '../../../api/api';
import storage from '../../../utils/storage';

export const toplogyLoader = async ({ request }: { request: Request }) => {
  const formData = new FormData();
  formData.append('providers', 'digital_ocean');
  const res = await topologyApi.getTopologyGraph({
    reportersTopologyFilters: {
      region_filter: ['blr1'],
      cloud_filter: ['digital_ocean'],
    },
  });
  console.log('res', res);
  return {};
};

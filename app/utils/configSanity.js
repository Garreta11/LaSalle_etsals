import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: 'wu8boxdv',
  dataset: 'production',
  apiVersion: 'v2022-03-07',
  useCdn: false,
});

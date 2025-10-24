import { CyberSourceAuthUtil } from './utils/cybersource-auth.util';

const authHeaders = CyberSourceAuthUtil.generateAuthHeaders({
  merchantId: 'test_merchant',
  apiKey: 'test-key',
  sharedSecretKey: Buffer.from('test-secret').toString('base64'),
  method: 'POST',
  path: '/tms/v1/recurringbillingplans',
  body: JSON.stringify({ test: 'data' }),
  host: 'apitest.cybersource.com',
});

console.log('Generated headers:');
console.log(JSON.stringify(authHeaders, null, 2));
console.log('\nHeader keys:');
console.log(Object.keys(authHeaders));

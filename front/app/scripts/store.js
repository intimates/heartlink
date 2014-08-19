// Front.ApplicationAdapter = DS.FixtureAdapter;

Front.ApplicationAdapter = DS.RESTAdapter.extend({
  // host: 'http://pigeon.ngrok.com',
  host: 'http://localhost:3000',
  namespace: 'api/v1',
});

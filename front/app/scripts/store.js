// Front.ApplicationAdapter = DS.FixtureAdapter;

Front.ApplicationAdapter = DS.RESTAdapter.extend({
  host: 'http://pigeon.ngrok.com',
  namespace: 'api/v1',
});

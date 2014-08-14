// Front.ApplicationAdapter = DS.FixtureAdapter;

Front.ApplicationAdapter = DS.RESTAdapter.extend({
  host: 'http://localhost:3000',
  namespace: 'api/v1',
  headers: {
    // TODO: use valid token (now it's my uid)
    'Authorization': 'Token token=688784467878364'
  }
});

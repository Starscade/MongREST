# MongREST

A RESTful Deno server for MongoDB. POST an aggregation pipeline and receive the query result as a JSON response.

URL path is parsed as `/<database>/<collection>`. So, a request to `/foo/bar` will query the `bar` collection in the `foo` database.

> **CAUTION**: MongREST was a stop-gap solution for an emergency scenario at work. No security mechanisms are implemented. **DO NOT USE THIS IN PRODUCTION.** My intention for releasing it to the public is to foster experimentation and provide a foundation upon which to build a more robust RESTful interface.

> **NOTE**: MongREST was deprecated in early 2026. No further maintenance is planned, although you might see the occasional patch here and there.

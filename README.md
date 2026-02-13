# MongREST

An EJSON parsing server that mimics the behaviour of PostgREST. MongoDB
aggregation pipes may be fed into it in the form of serialized EJSON strings. The
result is then returned as JSON.

Incoming URL is parsed as `/<database>/<collection>`. So, a POST request
to `/mongodb-recycle-service/droppedbags` will query the `droppedbags`
collection in the `mongodb-recycle-service` database, using the JSON body of the
request as an Aggregation Pipe.

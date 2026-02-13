import { MongoClient } from 'https://deno.land/x/mongo@v0.32.0/mod.ts'
import { stringify } from 'https://deno.land/std/csv/mod.ts'
import { EJSON } from 'npm:bson'

/*
 * Mongo clients above v0.32.0 are subject to
 * BSON Deserialization Errors.
 *
 * The above import should NOT be upgraded
 * if running MongoDB 7.0.21 or earlier.
 *
 */

const MONGO = new MongoClient()

const USER = Deno.env.get('MONGO_USER')
const PASS = Deno.env.get('MONGO_PASS')
const URI = Deno.env.get('MONGO_URI')

if (!USER) {
	console.error('Missing variable: "MONGO_USER"!')
	Deno.exit(1)
}

if (!PASS) {
	console.error('Missing variable: "MONGO_PASS"!')
	Deno.exit(1)
}

if (!URI) {
	console.error('Missing variable: "MONGO_URI"!')
	Deno.exit(1)
}

await MONGO.connect(
	`mongodb+srv://${USER}:${PASS}@${URI}`,
)

const HOST = Deno.env.get('DENO_HOST') ?? '127.0.0.1'
const PORT = Deno.env.get('DENO_PORT') ?? 32717

Deno.serve(
	{
		hostname: HOST,
		port: Number(PORT),
	}, async (incoming_request) => {
	if (incoming_request.method !== 'POST') {
		return new Response(
			null, { status: 405 },
		)
	}
	const uri_path = new URL(incoming_request.url).pathname
	const [database, collection] = uri_path.slice(1).split('/')
	const DB = MONGO.database(database)
	const COLLECTION = DB.collection(collection)
	const JSON_BODY = await incoming_request.text()
	let BSON = []
	try {
		BSON = EJSON.parse(JSON_BODY)
	} catch (err) {
		console.error(err)
		return new Response(
			JSON.stringify({
				ok: 0,
				errmsg: 'Invalid JSON.',
				code: null,
				codeName: null,
			}), {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 400
			},
		)
	}
	let RESULTS
	try {
		RESULTS = await COLLECTION.aggregate(BSON).toArray()
	} catch (err) {
		console.error(err)
		return new Response(
			JSON.stringify(err), {
				headers: {
					'Content-Type': 'application/json',
				},
				status: 422
			},
		)
	}
	return new Response(
		JSON.stringify(RESULTS),
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)
})

/**
 * Created by J<jiulong78@gmail.com> on 2017/4/17.
 * updated 2018/4/1  for mongodb driver 3.x
 */


const {
    Store
} = require("koa-session2");
const mongod = require("mongodb");
const log = console.log;

class MongoStore extends Store {
    constructor(opts) {
        super();
        this.init(opts);
    }

    async init({
        url,
        dbName,
        options,
        collName = "__session",
        maxAge = 2 * 24 * 3600
    }) {
        try {
            this.client = await mongod.MongoClient.connect(url, options);
            let rs = await this.client.db(dbName).collections({
                name: collName
            });

            if (rs.findIndex(c => c.s.name === collName) < 0) {
                this.coll = await this.client.db(dbName).createCollection(collName);
                this.coll.createIndex({
                    "lastAccess": 1
                }, {
                    name: "access__idx",
                    expireAfterSeconds: maxAge
                });
            } else {
                this.coll = await this.client.db(dbName).collection(collName);
            }
            log(`koa-session2 mongodb store is ok, db "${dbName}" collection "${collName}"`);
        } catch (e) {
            log("koa-session2 mongodb store init error")
            log(e);
        }
    }

    async get(sid) {
        try {
            let doc = await this.coll.findOne({
                sid: sid
            });
            return doc ? doc.session : undefined;
        } catch (e) {
            log("koa-session2 mongodb store session find error")
            log(e);
        }
    }

    async set(session, {
        sid = this.getID(24)
    }) {
        try {
            await this.coll.updateOne({
                "sid": sid
            }, {
                "$set": {
                    "session": session,
                    "lastAccess": new Date().getTime()
                }
            }, {
                upsert: true
            });

        } catch (e) {
            log("koa-session2 mongodb store session upsert error")
            log(e);
        }
        return sid;
    }

    async destroy(sid) {
        try {
            await this.coll.deleteOne({
                sid: sid
            });
            log(`session ${sid} destory`)
        } catch (e) {
            log("koa-session2 mongodb store session destroy error")
            log(e);
        }
    }
}

module.exports = MongoStore;
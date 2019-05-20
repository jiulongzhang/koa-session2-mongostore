# koa-session2-mongostore
mongodb store for koa-session2 


## Require

node v7.x +


mongodb native driver v3.x

## Install
```
npm install koa-session2-mongostore

```

## Usage
```js
const Koa = require("koa");
const session = require("koa-session2");
const MongoStore = require("koa-session2-mongostore");
const app = new Koa();
app.use(session({     
    store: new MongoStore({
        url:"mongodb://127.0.0.1:9008",
        dbName:"mydb"
    })
}));

```

## Options
- `url`:  required, db url   
- `dbName`:  required, db name   
- `collName`: optional, db session collection name,default  "mongod__session"
- `maxAge`: optional, expire time, default 10 \* 24 \* 3600 seconds
- `options`: optional, db options

## other

fetch (ajax) api, please with cookies

```js
fetch(url, { credentials: 'include'}).then()
            
```

## Using mongoose
index.mongoose.js implement the features of koa-session2-mongostore by mongoose
It's constuctor accept one arguemnt, that is, the collection name you want to use to store sessions.
You should use mongoose.connect() to connect to database before use it

```js
    const session = require("koa-session2");
    const Store = require('./index.mongoose.js');  
    app.use(session({ store : new Store('user_session') }))
```
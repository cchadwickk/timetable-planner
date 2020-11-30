var MongoClient = require('mongodb').MongoClient;
var MongoUrl = "mongodb://admin:ece9065@lab2.ece9065.tk:27017/ece9065_project?authSource=admin";

const Timetable = "course_data"
const Schedule = "course_lists"

async function Find(collection, query, projection){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).find( query, { projection: projection }).toArray());
    client.close();
    return mongoRes;
}

async function InsertOne(collection, query){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).insertOne( query));
    client.close();
    return mongoRes;
}

async function UpdateOne(collection, query, actionQuery){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).updateOne( query, actionQuery));
    client.close();
    return mongoRes;
}

async function DeleteOne(collection, query){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).deleteOne( query));
    client.close();
    return mongoRes;
}

async function DeleteMany(collection, query){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).deleteMany( query));
    client.close();
    return mongoRes;
}

module.exports = {Find, InsertOne, UpdateOne, DeleteOne, DeleteMany, Timetable, Schedule}
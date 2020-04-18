const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = 'media';
const colName = 'video_games';

// Database Settings
const settings = { useUnifiedTopology: true }

// Article Validator Function (Title & Link required, Link needs proper formatting)
const invalidVideoGame = (videoGame) => {
    let result;
    if (!videoGame.title) {
        result = 'Game requires a Title';
    } else if (!videoGame.console) {
        result = 'Game requires at least one Console';
    }
    return result;
}

const getVideoGames = () => {
    const iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                // assert.equal(null, err);
                reject(err);
            } else {
                console.log("Connected successfully to server to GET Video Games");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.find({}).toArray(function (err, docs) {
                    if (err) {
                        // assert.equal(null, err);
                        reject(err);
                    } else {
                        console.log("Found the following Video Games");
                        console.log(docs);
                        resolve(docs);
                        client.close();
                    }
                });
            }
        });
    });
    return iou;
}

const addVideoGames = (videoGames) => {
    const iou = new Promise((resolve, reject) => {
        if (!Array.isArray(videoGames)) {
            reject({ error: 'Need to send an Array of Video Games' });
        } else {
            const invalidVideoGames = videoGames.filter((videoGame) => {
                const check = invalidVideoGame(videoGame);
                if (check) {
                    videoGame.invalid = check;
                }
                return videoGame.invalid;
            });
            if (invalidVideoGames.length > 0) {
                reject({
                    error: 'Some Video Games were invalid',
                    data: invalidVideoGames
                });
            } else {
                MongoClient.connect(url, settings, async function (err, client) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("Connected successfully to server to POST Video Games");
                        const db = client.db(dbName);
                        const collection = db.collection(colName);
                        videoGames.forEach((videoGame) => {
                            videoGame.dateAdded = new Date(Date.now()).toUTCString();
                        });
                        const results = await collection.insertMany(videoGames);
                        resolve(results.ops);
                    }
                })
            }
        }
    });
    return iou;
}

const updateVideoGame = (id, videoGame) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected successfully to server to PATCH a Video Game");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                try {
                    const _id = new ObjectID(id);
                    collection.updateOne({ _id },
                        { $set: { ...videoGame } },
                        function (err, data) {
                            if (err) {
                                reject(err);
                            } else {
                                if (data.result.n > 0) {
                                    collection.find({ _id }).toArray(
                                        function (err, docs) {
                                            if (err) {
                                                reject(err);
                                            } else {
                                                resolve(docs[0]);
                                            }
                                        }
                                    )
                                } else {
                                    resolve({ error: "Nothing Updated" });
                                }
                            }
                        });
                } catch (err) {
                    console.log(err);
                    reject({ error: "ID has to be in ObjectID Format" });
                }
            }
        });
    });
    return iou;
}

const deleteVideoGame = (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function (err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected successfully to server to DELETE a Video Game");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                try {
                    const _id = new ObjectID(id);
                    collection.findOneAndDelete({ _id }, function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            if (data.lastErrorObject.n > 0) {
                                resolve(data.value);
                            } else {
                                resolve({ error: "ID doesn't exist" });
                            }
                        }
                    });
                } catch (err) {
                    console.log(err);
                    reject({ error: "ID has to be in ObjectID Format" });
                }

            }
        })
    });
    return iou;
}

module.exports = {
    getVideoGames,
    addVideoGames,
    updateVideoGame,
    deleteVideoGame
}
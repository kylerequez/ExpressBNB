const mongoose = require('mongoose');
const Listing = require('./src/models/listing');

mongoose.connect('mongodb://localhost:27017/expressBNB')
    .then(() => {
        console.log("Connection open...");
    }).catch((err) => {
        console.log("Something went wrong...");
        console.log(err)
    });

const seedDB = async() => {
    await Listing.deleteMany({});
    await Listing.create({
        name: "Laguna, Beach",
        username: "1234",
        image: "img/url",
        description: "Very good description",
        address: "Laguna",
        reviews: [
            { rating: 5.0, username: "kpr", review: "review" }
        ]
    });
};

const test = async() => {
    // await Listing.deleteMany({});
    await Listing.findOneAndUpdate({
        _id: '63611572a693bc945c39226d'
    }, {
        $push: {
            reviews: { rating: 5.0, username: "test", review: "goods" }
        }
    });
};

seedDB();
test();
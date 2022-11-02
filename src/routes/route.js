const express = require("express");
const route = express.Router();
const path = require("path");
const Account = require("../models/account");
const Listing = require("../models/listing");

let user = null;
let listings = {};

// index page
route.get("/", (req, res) => {
    // console.log(Account);
    res.render("index", {
        title: "Home",
        user,
        listings
    });
});

// listings page
route.get("/listings", async(req, res) => {
    listings = await Listing.find();
    res.render("listings", {
        title: "Listings",
        user,
        listings
    });
});

// login page
route.get("/login", (req, res) => {
    if (user != null) {
        res.redirect('/');
    }
    res.render("login", {
        title: "Login",
        user
    });
});

route.post("/login/user", async(req, res) => {
    if (user != null) {
        res.redirect('/');
    } else {
        const { username, password } = req.body;
        user = await Account.findOne({ username: username, password: password }).exec();
        if (user == null) {
            res.redirect("/login")
        } else {
            res.redirect("/");
        }
    }
});

// register page
route.get("/register", (req, res) => {
    res.render("register", {
        title: "Sign-Up",
        user,
    });
});

// register page
route.post("/register/user", async(req, res) => {
    const { username, password } = req.body;
    const newAccount = await new Account(req.body);
    await newAccount.save()
        .then(() => {
            res.redirect('/login');
        }).catch(() => {
            res.redirect('/register');
        });
});

// logout
route.get("/logout", (req, res) => {
    user = null;
    res.redirect('/login');
});

// listing display
route.get("/listing/:_id", async(req, res) => {
    const { _id } = req.params;
    listing = await Listing.findOne({ _id: _id }).exec()
        .then((r) => {
            return r;
        }).catch((err) => {
            return null;
        });
    if (listing == null) {
        res.redirect('/listings');
    } else {
        res.render('listing', {
            title: listing.name,
            listing,
            user
        });
    }
});

// user listing display
route.get("/:username/listings", async(req, res) => {
    if (user == null) {
        res.redirect('/login');
    } else {
        const { username } = req.params;
        listings = await Listing.find({ username: username }).exec()
            .then((r) => {
                return r;
            }).catch((err) => {
                return null;
            });
        res.render('user_listings', {
            title: `${user.username}'s Listings`,
            listings,
            user
        });
    }
});

// listing add
route.post("/listings/add", async(req, res) => {
    if (user == null) {
        res.redirect('/login');
    } else {
        const { name, image, description, address } = req.body;
        listing = new Listing({
            name: name,
            username: user.username,
            image: image,
            description: description,
            address: address
        });
        listing.save()
            .then(() => {
                console.log("Success on add!");
                res.redirect(`/listing/${listing._id}`);
            }).catch((err) => {
                console.log("Error on add!");
                res.redirect(`/${user.username}/listings`);
            });
    }
});


// listing edit
route.patch('/listings/:_id/edit', async(req, res) => {
    if (user == null) {
        res.redirect('/login');
    } else {
        const { _id } = req.params;
        const { name, image, description, address } = req.body;
        await Listing.findOneAndUpdate({
                _id: _id
            }, {
                name: name,
                image: image,
                description: description,
                address: address
            })
            .then((r) => {
                console.log("Success on edit!");
                res.redirect(`/listing/${ _id }`);
            }).catch((err) => {
                console.log("Error on edit");
                res.redirect(`/listing/${ _id }`);
            });
    }
});

// listing delete
route.delete('/listings/:_id/delete', async(req, res) => {
    if (user == null) {
        res.redirect('/login');
    } else {
        const { _id } = req.params;
        await Listing.findOneAndDelete({
                _id: _id
            })
            .then((r) => {
                console.log("Success on delete");
                res.redirect(`/${user.username}/listings`);
            }).catch((err) => {
                console.log("Error on delete!");
                res.redirect(`/${user.username}/listings`);
            });
    }
});

// add review
route.post("/listings/:_id/review/add", async(req, res) => {
    if (user == null) {
        res.redirect('/login');
    } else {
        const { _id } = req.params;
        const { rating, review } = req.body;
        await Listing.findOneAndUpdate({
                _id: _id
            }, {
                $push: {
                    reviews: { rating: rating, username: user.username, review: review }
                }
            })
            .then((r) => {
                console.log("Success on adding review!");
                res.redirect(`/listing/${ _id }`);
            }).catch((err) => {
                console.log("Error on adding review!");
                res.redirect(`/listing/${ _id }`);
            });
    }
});

module.exports = route;
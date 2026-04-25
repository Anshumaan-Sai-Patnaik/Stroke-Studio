const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/user");
const Painting = require('../models/list');

const {faker} = require("@faker-js/faker");

async function getCartItems() {
    let cartItemsCount = Math.floor(Math.random() * 4);

    if (cartItemsCount === 0) return [];
    const data = await Painting.aggregate([
        { $sample: { size: cartItemsCount } },
        { $project: { _id: 1 } }
    ]);
    return data.map(p => p._id);
}

async function getWishList() {
    let wishListCount = Math.floor(Math.random() * 6);

    if (wishListCount === 0) return [];
    const data = await Painting.aggregate([
        { $sample: { size: wishListCount } },
        { $project: { _id: 1 } }
    ]);
    return data.map(p => p._id);
}

async function getPurchased() {
    const data = await Painting.aggregate([
        { $sample: { size: Math.floor(Math.random() * (6 - 3 + 1)) + 3 } },
        { $project: { _id: 1 } }
    ]);
    return data.map(p => p._id);
}

const TOTAL_USERS = 34;
let savedCount = 0;

async function getRandomUser() {
    const cartItems = await getCartItems();
    const wishList = await getWishList();
    const purchased = await getPurchased();

    return {
        userID: faker.string.uuid(),
        username: faker.internet.username(),
        emailID: faker.internet.email(),
        password: faker.internet.password(),
        cartItems,
        wishList,
        purchased
    };
};

async function seedUsers() {
    await connectDB();
    console.log("Seeding Users...");
    while(true){
        const userData = await getRandomUser();
        await new User(userData).save();
        savedCount++;
        if (savedCount === TOTAL_USERS) break;
    }
    console.log(`Saved ${TOTAL_USERS} Users`);
    console.log("Seeding complete");
    await mongoose.disconnect();
}
seedUsers();
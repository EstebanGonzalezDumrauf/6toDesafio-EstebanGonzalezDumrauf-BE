import mongoose from "mongoose";

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    rol: { /////PROBAR CON UN REGISTER
        type: String,
        default: "usuario"
    },
});

export const userModel = mongoose.model(collection, schema)
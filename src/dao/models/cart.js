//FUNCIONABA OK, PROBANDO POPULATIONS
// import mongoose from 'mongoose';

// const cartCollection = 'carts';

// const cartSchema = new mongoose.Schema({
//     arrayCart: [{ product: String, quantity: Number }]
// });


// export const cartModel = mongoose.model(cartCollection, cartSchema);


import mongoose from 'mongoose';
import {
    productModel
} from './product.js';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    arrayCart: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    default: 1
                },
            }
        ],
        default: []
    }
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
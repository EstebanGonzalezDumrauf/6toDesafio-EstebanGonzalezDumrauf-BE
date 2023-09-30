import {
    Router
} from 'express';
import {
    cartModel
} from '../dao/models/cart.js';
import {
    productModel
} from '../dao/models/product.js';
import mongoose from 'mongoose';


const router = Router();

router.get('/', async (req, res) => {
    try {
        let carrito = await cartModel.find();
        res.send({
            result: 'sucess',
            payload: carrito
        });
    } catch (error) {
        console.log(error);
    }
})

router.post('/', async (req, res) => {
    try {
        const { arrayCart } = req.body;

        // console.log('Datos recibidos:', req.body);
        // console.log('arrayCart:', arrayCart);

        let result = await cartModel.create({arrayCart});

        console.log('Resultado de la creación del carrito:', result);

        res.send({
            result: 'sucess',
            payload: result
        });
    } catch (error) {
        console.error('Error:', error);
        res.send({
            status: "Error",
            error: 'Se produjo un error fatal'
        });
    }
});



router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        // console.log('Datos recibidos:', req.params);
        // console.log('Datos transformados:', cid, pid);
        const productId = new mongoose.Types.ObjectId(pid);

        // Buscar el carrito por su ID
        const cartExistente = await cartModel.findById(cid);

        // Verifica si el producto ya está en el carrito
        if (cartExistente && Array.isArray(cartExistente.arrayCart)) {
            const productoEnCarrito = cartExistente.arrayCart.find(elto => elto.product.equals(productId)); // Comparar utilizando .equals()

            if (productoEnCarrito) {
                // Si ya existe, agregar la cantidad proporcionada en el cuerpo
                productoEnCarrito.quantity = quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo con la cantidad proporcionada en el cuerpo
                cartExistente.arrayCart.push({ product: productId, quantity: quantity });
            }

            // Guardar el carrito actualizado
            await cartExistente.save();

            res.status(200).json({
                result: 'success',
                message: 'Producto agregado al carrito con éxito'
            });
        } else {
            res.status(404).json({
                result: 'error',
                message: 'El carrito no existe o no tiene la propiedad "products" definida correctamente'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor'
        });
    }
});


router.put('/:cid', async (req, res) => {
    try {
        let arrayCart = req.body;
        let {
            cid
        } = req.params;

        console.log('Datos recibidos:', req.body);

        let result = await cartModel.updateOne({ //RECORDAR QUE ESTE UPDATE NO AGREGA PRODUCTOS A LOS YA EXISTENTES
            _id: cid                               //PISA EL LISTADO DE PRODUCTOS CON UNO NUEVO
        }, arrayCart);

        res.send({
            result: 'sucess',
            payload: result
        });
    } catch (error) {
        res.send({
            status: "Error",
            error: 'Se produjo un error fatal'
        });
    }

})

router.delete('/:cid', async (req, res) => {

    //ESTO FUNCIONABA Y BORRABA EL CART COMPLETO
    // let {
    //     pid
    // } = req.params;

    // let result = await cartModel.deleteOne({
    //     _id: pid
    // });

    // res.send({
    //     result: 'sucess',
    //     payload: result
    // });

    //AHORA EL DELETE DEBE VACIAR EL CART
    let {
        cid
    } = req.params;

    const result = await cartModel.updateOne(
        { _id: cid },
        { $set: { arrayCart: [] } }
    );

    res.send({
        result: 'sucess',
        payload: result
    });
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { pid, cid } = req.params;

        const result = await cartModel.updateOne(
            { _id: cid },
            { $pull: { arrayCart: { product: pid } } } //RECORDAR QUE ESTE PID ES EL ID DEL PRODUCT DE NUESTRO ESQUEMA
        );                                              //NO ES EL ID GENERADO POR MONGO

        res.send({
            result: 'success',
            payload: result
        });
    } catch (error) {
        console.error('Error:', error);
        res.send({
            status: 'Error',
            error: 'Se produjo un error fatal'
        });
    }
});



export default router;
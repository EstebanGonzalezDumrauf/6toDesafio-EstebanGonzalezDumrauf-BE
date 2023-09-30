import log from 'console';
import fs from 'fs';

// const { log } = require('console');
// const fs = require('fs');

class cartManager {

    constructor(path) {
        this.carts = [];
        this.path = path;
    };

    carritosAlmacenados = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                if (data.length === 0) {
                    return [];
                } else {
                    const listadoCarritos = JSON.parse(data);
                    return listadoCarritos;
                }
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error.message);
            return []; // En caso de error, puedes retornar un array vacío o null
        }
    }

    addCart = async (arrayCart) => {
        const carrito = {
            arrayCart
        }

        const valorrecuperado = await this.carritosAlmacenados();
        //console.log(valorrecuperado);

        if (valorrecuperado.length === 0) {
            carrito.cid = 1;
        } else {
            carrito.cid = valorrecuperado[valorrecuperado.length - 1].cid + 1;
        }

        if (arrayCart === "" || arrayCart === undefined) {
            console.error("Error. El campo Stock no tiene informacion.");
            return -1;
        }

        valorrecuperado.push(carrito);
        await fs.promises.writeFile(this.path, JSON.stringify(valorrecuperado))
    };

    addProductToCart = async (cid, pid, quantity) => {
        let listadoCartsID = [];
        let listadoProducts = [];
    
        let productoNuevo = {
            product: pid,
            quantity: quantity
        }
    
        try {
            if (fs.existsSync(this.path)) {
                const byCIDdata = await fs.promises.readFile(this.path, 'utf-8');
                listadoCartsID = JSON.parse(byCIDdata);
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error.message);
            return -1;
        }
    
        const codeIndex = listadoCartsID.findIndex(e => e.cid === cid);
        if (codeIndex === -1) {
            return -2;
        } else {
            //listadoProducts = JSON.parse(listadoCartsID[codeIndex].arrayCart);
            listadoProducts = listadoCartsID[codeIndex].arrayCart;
            //listadoProducts = [{product:1,quantity:10}, {product:3,quantity:7}, {product:5,quantity:1}]; //listadoCartsID[codeIndex].arrayCart; listadoProducts = listadoCartsID[codeIndex].arrayCart;
    
            const codeProduIndex = listadoProducts.findIndex(i => i.product === pid);
    
            if (codeProduIndex === -1) {
                productoNuevo.product = pid;
                productoNuevo.quantity = quantity;
    
                listadoProducts.push(productoNuevo);
            } else {
                listadoProducts[codeProduIndex].quantity += 1;
            }
    
            await fs.promises.writeFile(this.path, JSON.stringify(listadoCartsID));
        }
    };
    


    // addProductToCart = async (cid, pid, quantity) => { //// POR AHORA QUANTITY ES SIEMPRE DE VALOR 1 !!!!!!!!!!!!
    //     let listadoCartsID = [];
    //     let listadoProducts = [];

    //     let productoNuevo = {
    //         product,
    //         quantity
    //     }

    //     try {
    //         if (fs.existsSync(this.path)) {
    //             const byCIDdata = await fs.promises.readFile(this.path, 'utf-8');
    //             listadoCartsID = JSON.parse(byCIDdata);
    //         }
    //     } catch (error) {
    //         //console.error('Error al leer el archivo:', error.message);
    //         return -1; 
    //     }

    //     const codeIndex = listadoCartsID.findIndex(e => e.cid === cid);
    //     if (codeIndex === -1) {
    //         return -2; //("Producto con ID:" + id + " no encontrado!!!");
    //     } else {

    //         listadoProducts = [{product:1,quantity:10}, {product:3,quantity:7}, {product:5,quantity:1}]; //listadoCartsID[codeIndex].arrayCart;

    //         const codeProduIndex = listadoProducts.findIndex(i => i.product === pid);

    //         if (codeProduIndex ===-1) {
    //             productoNuevo.product = pid;
    //             productoNuevo.quantity = quantity;

    //             listadoProducts.push(productoNuevo);
    //         } else {
    //             listadoProducts[codeProduIndex].quantity += 1;
    //         }

    //         await fs.promises.writeFile(this.path, JSON.stringify(listadoProducts))
    //         //return listadoCartsID[codeIndex];
    //     }
    // };

    getCartByCId = async (cid) => {
        let listadoCartsID = [];
        try {
            if (fs.existsSync(this.path)) {
                const byCIDdata = await fs.promises.readFile(this.path, 'utf-8');
                listadoCartsID = JSON.parse(byCIDdata);
            }
        } catch (error) {
            //console.error('Error al leer el archivo:', error.message);
            return -1; 
        }
        const codeIndex = listadoCartsID.findIndex(e => e.cid === cid);
        if (codeIndex === -1) {
            return -2; //("Producto con ID:" + id + " no encontrado!!!");
        } else {
            return listadoCartsID[codeIndex];
        }
    };

}

export default cartManager;
//module.exports = cartManager;
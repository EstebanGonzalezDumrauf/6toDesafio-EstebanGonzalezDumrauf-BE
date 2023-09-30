// const { log } = require('console');
// const fs = require('fs');


import log from 'console';
import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    };

    productosAlmacenados = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                if (data.length === 0) {
                    return [];
                } else {
                    const listadoProductos = JSON.parse(data);
                    return listadoProductos;
                }
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error.message);
            return []; // En caso de error, puedes retornar un array vacío o null
        }
    }

    addProduct = async (title, description, price, status, thumbnail, code, stock) => {
        const producto = {
            title,
            description,
            price,
            status,
            thumbnail,
            code,
            stock
        }

        const valorrecuperado = await this.productosAlmacenados();
        console.log(valorrecuperado);

        if (valorrecuperado.length === 0) {
            producto.id = 1;
        } else {
            producto.id = valorrecuperado[valorrecuperado.length - 1].id + 1;
        }

        if (title === "" || title === undefined) {
            console.error("Error. El campo titulo no tiene informacion.");
            return -1;
        }

        if (description === "" || description === undefined) {
            console.error("Error. El campo descripción no tiene informacion.");
            return -1;
        }

        if (price === "" || price === undefined) {
            console.error("Error. El campo precio no tiene informacion.");
            return -1;
        }

        if (status === "" || status === undefined) {
            console.error("Error. El campo status no tiene informacion.");
            return -1;
        }

        if (thumbnail === "") {
            console.error("Error. El campo ruta de la Imagen no tiene informacion.");
            return -1;
        }

        if (stock === "" || stock === undefined) {
            console.error("Error. El campo Stock no tiene informacion.");
            return -1;
        }

        const codeIndex = valorrecuperado.findIndex(e => e.code === code);
        if (codeIndex !== -1) {
            console.error("Codigo Ya existente");
            return -1;
        }

        valorrecuperado.push(producto);
        await fs.promises.writeFile(this.path, JSON.stringify(valorrecuperado))
    };


    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                if (data.length === 0) {
                    return [];
                } else {
                    const listadoProductos = JSON.parse(data);
                    return listadoProductos;
                }
            } else {
                return []; // Si el archivo no existe, retornar un array vacío o null
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error.message);
            return []; // En caso de error, puedes retornar un array vacío o null
        }
    };

    getProductById = async (id) => {
        let listadoProductosID = [];
        try {
            if (fs.existsSync(this.path)) {
                const byIDdata = await fs.promises.readFile(this.path, 'utf-8');
                listadoProductosID = JSON.parse(byIDdata);
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error.message);
            return []; // En caso de error, puedes retornar un array vacío o null
        }
        const codeIndex = listadoProductosID.findIndex(e => e.id === id);
        if (codeIndex === -1) {
            return ("Producto con ID:" + id + " no encontrado!!!");
        } else {
            return listadoProductosID[codeIndex];
        }
    };


    updateProduct = async (id, newTitle, newDescription, newPrice, newStatus, newThumbnail, newCode, newStock) => {
        let listadoProductos = [];
        try {
            if (fs.existsSync(this.path)) {
                const byIDdata = await fs.promises.readFile(this.path, 'utf-8');
                listadoProductos = JSON.parse(byIDdata);
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error.message);
            return -3; // En caso de error, puedes retornar un array vacío o null
        }

        const codeIndex = listadoProductos.findIndex(e => e.id == id);
        if (codeIndex === -1) {
            return -2;
        } else {
            if (newTitle !== '' && newTitle !== undefined) {
                listadoProductos[codeIndex].title = newTitle;
            } else {
                listadoProductos[codeIndex].title;
            }
            if (newDescription !== '' && newDescription !== undefined) {
                listadoProductos[codeIndex].description = newDescription;
            }
            if (newPrice !== '' && newPrice !== undefined) {
                listadoProductos[codeIndex].price = newPrice;
            }
            if (newStatus !== '' && newStatus !== undefined) {
                listadoProductos[codeIndex].status = newStatus;
            }
            if (newThumbnail !== '') {
                listadoProductos[codeIndex].thumbnail = newThumbnail;
            }
            if (newCode !== '' && newCode !== undefined) {
                const codeExisIndex = listadoProductos.findIndex(ex => ex.code === newCode);
                if (codeExisIndex !== -1) {
                    console.error("Codigo Ya existente");
                    return -1;
                }
                listadoProductos[codeIndex].code = newCode;
            }
            if (newStock !== '' && newStock !== undefined) {
                listadoProductos[codeIndex].stock = newStock;
            }
            await fs.promises.writeFile(this.path, JSON.stringify(listadoProductos))
        }
        return;
    }

    deleteProduct = async (id) => {
        let listadoProductos = [];
        try {
            if (fs.existsSync(this.path)) {
                const byIDdata = await fs.promises.readFile(this.path, 'utf-8');
                listadoProductos = JSON.parse(byIDdata);
            }
        } catch (error) {
            console.error('Error al leer el archivo:', error.message);
            return -2; // En caso de error, puedes retornar un array vacío o null
        }

        const codeIndexDelete = listadoProductos.findIndex(e => e.id === id);
        if (codeIndexDelete === -1) {
            return -1;
        } else {
            listadoProductos.splice(codeIndexDelete, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(listadoProductos))
        }
        return;
    }
}

export default ProductManager;
//module.exports = ProductManager;
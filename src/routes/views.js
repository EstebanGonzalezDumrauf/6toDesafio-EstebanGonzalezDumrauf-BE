import { Router } from "express";
import {
    productModel
} from '../dao/models/product.js';
import {
    cartModel
} from '../dao/models/cart.js';
import { authToken } from "../utils.js";

const router = Router();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    next();
}

router.get('/', publicAccess, (req, res)=> {
    res.render('login');
})

router.get('/register', publicAccess, (req, res)=> {
    res.render('register')
})

router.get('/profile', privateAccess, (req, res)=> {
    res.render('profile', {
        user: req.session.user,
    })
})

router.get('/resetPassword', publicAccess, (req, res)=> {
    res.render('reset')
})

router.get('/products', privateAccess, async (req, res) => {
//router.get('/products', authToken, async (req, res) => {
    const {
        page = 1
    } = req.query;

    const {
        docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    } = await productModel.paginate({}, {
        limit: 5,
        page
    })

    const prevLink = hasPrevPage ? `/products?page=${prevPage}` : null;
    const nextLink = hasNextPage ? `/products?page=${nextPage}` : null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);


    // Verifica que el usuario está autenticado antes de mostrar la página de productos
    if (req.session.user) {
        const { username, isAdmin } = req.session.user;
    } else {
        // Si el usuario no está autenticado, redirige a la página de loggin
        return res.redirect('/');
    }

    res.render('index', {
        docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        prevLink,
        nextLink,
        pageNumbers, 
        user: req.session.user
    });
})

router.get('/api/products/:pid', privateAccess, async (req, res) => {
    try {
        //console.log('Datos recibidos:', pid);
        const productId = req.params.pid;
        const producto = await productModel.findById(productId);

        const productoLimpiado = {
            title: producto.title,
            description: producto.description,
            price: producto.price,
            thumbnail: producto.thumbnail,
        };

        if (!producto) {
            return res.status(404).json({
                result: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.render('detail', {
            product: productoLimpiado,
            cartUrl: '/cart',
            user: req.session.user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: 'error',
            message: 'Hubo un error en el servidor',
        });
    }
});

export default router;
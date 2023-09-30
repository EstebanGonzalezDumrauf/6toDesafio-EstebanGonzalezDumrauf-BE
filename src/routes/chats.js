import {
    Router
} from 'express';
import {
    chatModel
} from '../dao/models/chat.js';

router.post('/', async (req, res) => {

    try {
        let {
            user,
            message
        } = req.body;

        let result = await chatModel.create({
            user,
            message
        });

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
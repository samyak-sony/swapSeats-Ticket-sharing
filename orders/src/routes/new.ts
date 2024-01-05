import mongoose from 'mongoose';
import express,{Request,Response} from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth,validateRequest } from '@swapseats/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/orders',requireAuth,
[
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input:string)=> mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
],validateRequest,async (req:Request,res:Response) => {
    const {ticketId} = req.body;

    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
        throw new NotFoundError();
    }


    // Below code looks at all the orders and finds an order 
    //where the ticket is the ticket we just found and if not canceeled then it means it is reserved

    const isReserved = await ticket.isReserved();

    if(isReserved) {
        throw new BadRequestError('Ticket already reserved');
    }
    
    
    res.send({});

});

export {router as newOrderRouter};
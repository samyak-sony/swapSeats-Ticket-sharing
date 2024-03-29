import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('fetches the order',async ()=>{
    //create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 29
    });
    await ticket.save();

    const user = global.signin();
    // make a request to build an order with this ticket
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket.id})
        .expect(201);
    // make a req to fetch the order
    const {body:fetchOrder}=await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(200);
    expect(fetchOrder.id).toEqual(order.id);

});

it('returns an error if one user tries to fetch another users orders',async ()=>{
    //create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 29
    });
    await ticket.save();

    const user = global.signin();
    // make a request to build an order with this ticket
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket.id})
        .expect(201);
    // make a req to fetch the order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',global.signin())
        .send()
        .expect(401);
    

});
import mongoose, { set } from "mongoose";
import { Order, OrderStatus } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Ticket } from "../../../models/ticket";
import { ExpirationCompleteEvent } from "@swapseats/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    });
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdkf',
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    //@ts-ignore
    const msg: Message = {
        ack:jest.fn()
    }

    return {listener,ticket, order,data,msg};
};

it('updates the order status to cancelled',async () => {
    const {listener,ticket, order,data,msg} = await setup();

    await listener.onMessage(data,msg);
    
    // status property updated to cancelled

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);


});

it('emit an order cancelled event',async () => {
    const {listener,ticket, order,data,msg} = await setup();

    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // make sure the natswrapper mock client function was called

    //mock.calls = an array of all the different times, all the different arguments this thing has been provided over time
    // the first argument is the subject or channel name we are publishing this event to
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id);

});

it('ack the message',async ()=>{
    const {listener,ticket, order,data,msg} = await setup();

    await listener.onMessage(data,msg);

    // take a look at our msg and see if the ack() function has been invoked
    expect(msg.ack).toHaveBeenCalled();

})
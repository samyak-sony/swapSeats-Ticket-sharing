import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@swapseats/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () =>{
    const listener = new OrderCreatedListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 90,
        userId: 'alsdjkfh'
    });
    await ticket.save();

    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'asdfj',
        expiresAt: 'asdlf',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    // create fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return {listener,ticket,data,msg};
}

it('sets the userId of the ticket',async()=>{
    const {listener,ticket,data,msg} = await setup();
    await listener.onMessage(data,msg);
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);

});

it('acks the message', async()=>{
    const {listener,data,ticket,msg}= await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event",async ()=>{
    const {listener,ticket,data,msg} = await setup();
    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
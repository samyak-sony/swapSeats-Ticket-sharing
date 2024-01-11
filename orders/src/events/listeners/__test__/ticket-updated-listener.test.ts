import mongoose from "mongoose";
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedEvent } from "@swapseats/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    //create a save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await  ticket.save();

    //create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version : ticket.version + 1,
        title: 'new concert',
        price: 99,
        userId: 'asbdfkjh'
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {msg,data,listener,ticket};
};

it('find,updates, and saves a ticket',async ()=> {
    const {msg,data,listener,ticket} = await setup();
    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);
 
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message',async () => {
    const {msg,data,ticket,listener} = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipper version number',async()=>{
    const {msg,data,ticket,listener} = await setup();
    data.version = 10;
    
    try{
        await listener.onMessage(data,msg);
    }catch(err){

    }
    expect(msg.ack).not.toHaveBeenCalled();
})
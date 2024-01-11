import { Subjects,Listener,OrderCreatedEvent } from "@swapseats/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName= queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'],msg:Message){
        //Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
        //if no ticket then throw error
        if(!ticket) {
            throw new Error("Ticket not found");
        }
        // Mark the ticket as being reserved by setting its orderid property
        ticket.set({
            orderId: data.id
        });
        //save the ticket
        await ticket.save();
        //ack the msg
        msg.ack();
    }

}
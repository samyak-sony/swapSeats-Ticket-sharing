import { Publisher,Subjects, TicketUpdatedEvent } from "@swapseats/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;

} 


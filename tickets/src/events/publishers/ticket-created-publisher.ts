import { Publisher,Subjects, TicketCreatedEvent } from "@swapseats/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;

}


import { Subjects, Publisher,PaymentCreatedEvent } from "@swapseats/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}
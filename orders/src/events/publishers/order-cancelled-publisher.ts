import { Publisher,OrderCancelledEvent,Subjects } from "@swapseats/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject= Subjects.OrderCancelled;
    
}
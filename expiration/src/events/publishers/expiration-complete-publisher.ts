import { Subjects,Publisher,ExpirationCompleteEvent } from "@swapseats/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
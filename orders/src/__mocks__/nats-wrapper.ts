export const natsWrapper = {
    client: {
        publish: jest.fn().mockImplementation(
            (subject:string,data:string,callback:()=>void)=>{
                callback();
        })
    }
};


/* 
//Built a mock file which jest uses when it sees an import statement of the actual file.
//When tests are executed in the test enviornment, our new.ts Route handlesr is going to import the FAKE
or the mock wrapper file. The new router handler will get the fake object we created above.
now inside the new route handler TicketCreatedPublisher() will take the Nats wrapper object and it will pull off
the FAKE client property.
Now inside of the base publisher the fake object will show up as the client

*/
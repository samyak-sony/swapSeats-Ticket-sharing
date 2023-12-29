import mongoose from "mongoose";

//attributes a ticket should have

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// properties a ticketdocument has (ticketAttr + its own)

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

//Ts type checking 
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    } 

},{
   toJSON: {
    transform(doc,ret) {
        ret.id = ret._id;
        delete ret._id;
    }
   } 
});

ticketSchema.statics.build =(attr: TicketAttrs)=>{
    return new Ticket(attr);
};

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema);

export {Ticket};
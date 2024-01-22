import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@swapseats/common";

// list of properties we have to provide when building an order
interface OrderAttrs {
    id: string,
    version: number,
    price: number,
    userId: string,
    status: OrderStatus
}

// list of properties an order has
interface OrderDoc extends mongoose.Document {
    version: number,
    price: number,
    userId: string,
    status: OrderStatus
}

// list of properties that the model itself contains. This will list out any custom methods we add to the collection
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs:OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    }
},{
    toJSON:{
        transform(doc,ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs)=>{
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status 
    })
}

const Order = mongoose.model<OrderDoc,OrderModel>('Order',orderSchema);

export {Order};
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
    var signin:()=> string[]; 
    
}

// creating an instance of mongomeoryserver before all of ourt test set up
// beforeAll() is a hook function. Whatever we pass inside 
//here is going to run before all of our tests start to be executed
jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async()=>{
    jest.clearAllMocks();
     mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri,{});
});

// function that's going to run before each of our tests.
// before each test starts we're going to delete or essentially reset all the data inside there


beforeEach(async ()=>{
    process.env.JWT_KEY = 'asdfasdf';
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async()=>{
    if(mongo){
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin= ()=>{
    //Build a JWT PAYLOAD .{id,email}
    const payload = {
        id:new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    //Create a JWT
    const token = jwt.sign(payload,process.env.JWT_KEY!);

    //Build session Object
    const session =  {jwt:token};

    //Turn that session into json
    const sessionJSON = JSON.stringify(session);

    //Take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //return a strong thats the cookie with the encoded data
    return [`session=${base64}`];;
    
     
} 
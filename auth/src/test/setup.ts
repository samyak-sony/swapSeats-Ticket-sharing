import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
    var signin:()=> Promise<string[]>; 
    
}

// creating an instance of mongomeoryserver before all of ourt test set up
// beforeAll() is a hook function. Whatever we pass inside 
//here is going to run before all of our tests start to be executed

let mongo: any;
beforeAll(async()=>{
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

global.signin= async()=>{
    const email = 'test@test.com';
    const password = 'password';
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,password
        })
        .expect(201);
    const cookie = response.get('Set-Cookie');
    return cookie
     
}
import request from "supertest";
import { app } from "../../app";

it('returns a 201 on successful signup',async ()=>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns a 400 with an invalid email',async()=>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email:'asdjklhf',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 with an invalid password',async()=>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password: 'e'
        })
        .expect(400);
});

it('returns a 400 with missing email and password',async()=>{
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com'
        })
        .expect(400);
    
    await request(app)
        .post('/api/users/signup')
        .send({
            password:'askdffd'
        })
        .expect(400);
});

it('disallows duplicate emails',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'asfkghf'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'asfkghf'
    })
    .expect(400);
});

it('sets a cookie after succesful signup ',async()=>{
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
        // the get() method allows us to look up any of the headers that hve been set up in the response
    expect(response.get('Set-Cookie')).toBeDefined();

});
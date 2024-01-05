import express = require('express');
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession = require('cookie-session');
import { errorHandler,currentUser, NotFoundError } from "@swapseats/common"; 
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes/index';
import { showOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';
const app = express();
 
app.set('trust proxy',true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
    
}));

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);

app.all('*',async(req,res)=>{
    throw new NotFoundError
})

app.use(errorHandler);

export {app};
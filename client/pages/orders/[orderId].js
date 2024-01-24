import { useEffect,useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";
import StripeCheckout from 'react-stripe-checkout';


const OrderShow = ({order,currentUser}) =>{
    const [timeLeft, setTimeLeft] = useState(0);
    const {doRequest,errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders'),
    })

    // when component first renders we want to call this function (inside the useEffect) only one time.
    // we want to setup the setInterval only once
    useEffect(()=>{
        const findTimeLeft = () =>{
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        /* 
            setInterval is going to run for the first time 1 sec into the future. In other words, when we 
            call setInterval it's going to wait 1000ms of time before calling findTimeLeft function.
            So essentially we have to wait 1 sec when this component is first rendered before we see any time here

            Thus we manually invoke the findTimeLeft() immediealty 

            Now whenever we call setinterval it will set up an interval that's going to run forever unless we stop it
            Even if we navigate away from this component the time will still go on running.
            Thus we setup a timeId 
        */


        findTimeLeft();
        const timerId = setInterval(findTimeLeft,1000);
        return () =>{
            clearInterval(timerId); 
        };
    }, [order]);

    if(timeLeft < 0) {
        return <div> Order Expired</div>;
    }

    return(
        <div> 
            Time left to pay: {timeLeft} seconds
            <StripeCheckout 
                token={({ id })=>doRequest({ token:id })}
                stripeKey="pk_test_51OaNawSExzMdZTc8dSnqothyfI3j2WgskURu62c7YsVy6Q2C9yFI18BoxLCl6JrNOxawDnznPtFPDcb1t74n4s9R00C4BhXbce"
                amount={order.ticket.price * 100} 
                email= {currentUser.email}
            />
            {errors}
        </div>
    )
};

OrderShow.getInitialProps = async (context,client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return {order: data};
}



export default OrderShow;
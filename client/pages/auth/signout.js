import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

const SignOut=()=>{
    const {doRequest} = useRequest({
        url: '/api/users/signout',
        methods: 'post',
        body: {},
        onSuccess: ()=> Router.push('/')
    });

    useEffect(()=>{
        doRequest();
    },[]);

    return(
        <div>
            Signing you out...
        </div>

    );
}

export default SignOut;
import React, { useEffect } from 'react';
import { useParams } from 'react-router';

const Payment = () => {
    const {appointmentId} = useParams();
     useEffect(() => {
        const url = `http://localhost:5000/appointment/${appointmentId}` ;
        fetch(url)
         .then(res => res.json())
         .then(data => console.log(data))
     }, [appointmentId])
    
    return (
        <div>
            <h1>Payment Page</h1>
            <h3>payment for : {appointmentId} </h3>
        </div>
    );
};

export default Payment;
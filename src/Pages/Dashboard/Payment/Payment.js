import { Elements } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CheckOutForm from './CheckoutForm';
import {loadStripe} from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51JxTqkHSKMP1mmnIKuKaUp2nbCzfaSnUlPnJB166VmzhJF4CkVmXewU1ipz3eO8wDLBB1C2B2nsbRwbOlxiQxPdQ00DR3mWoQJ');

const Payment = () => {
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState({})
    useEffect(() => {
        const url = `http://localhost:5000/appointment/${appointmentId}`;
        fetch(url)
            .then(res => res.json())
            .then(data => setAppointment(data[0]))
    }, [appointmentId])

    console.log(appointment)


    return (
        <div>
            <h1>Payment Page</h1>
            <h2>{appointmentId}</h2>
            <h3>payment for : {appointment?.patientName} With : {appointment?.serviceName} Price : {appointment?.price} </h3>


            {appointment?.price && <Elements stripe={stripePromise}>
                <CheckOutForm 
                appointment={appointment}
                />
            </Elements>}
        </div>
    );
};

export default Payment;
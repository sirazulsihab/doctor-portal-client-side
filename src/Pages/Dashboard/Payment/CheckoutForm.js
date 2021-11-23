import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';

const CheckOutForm = ({ appointment }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const {price, patientName, _id} = appointment;
    const {user} = useAuth();
    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState('')

    useEffect(() => {
        fetch('http://localhost:5000/create-payment-intent', {
            method: 'POST',
            headers: {
                'content-type':'application/json'
            },
            body:JSON.stringify({price})
        })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret))
    }, [price])

    const handleSubmit = async (e) => {

        if (!stripe || !elements) {
            return;
        }
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }
        e.preventDefault();

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setError(error.message)
        } else {
            setError('');
            // setSuccess(paymentMethod);
            // console.log('[PaymentMethod]', paymentMethod);
        }

        // Payment Intent
        const {paymentIntent, error : intentError} = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: card,
                billing_details: {
                  name: patientName,
                  email : user.email
                },
              },
            },
          );
          if(intentError){
              setError(intentError.message);
              setSuccess('')
          }else{
              setError('');
              setSuccess('Your Payment Procced Succefully')
            //   update to DB
            const payment = {
                amount:paymentIntent.amount,
                created:paymentIntent.created,
                last4:paymentMethod.card.last4,
                transaction:paymentIntent.client_secret.slice('_secret')[0]

            }
            fetch(`http://localhost:5000/appointment/${_id}`, {
                method:'PUT',
                headers : {
                    'content-type':'application/json'
                },
                body:JSON.stringify(payment)
            })
            .then(res => res.json())
            .then(data => console.log(data))
          }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <button type="submit" disabled={!stripe}>
                    Pay ${price}
                </button>
                {error && <p style={{color:'red'}}>{error}</p>}
                
                {success && <p style={{color:'green'}}>{success}</p>}

            </form>
        </div >
    );
};

export default CheckOutForm;
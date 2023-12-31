import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, } from 'react-bootstrap';
import { FormContainer, CheckoutSteps } from '../components';
import { saveShippingAddress } from '../redux/slices/cartSlice';


const ShippingScreen = () => {

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress?.address || ''); //Checking to know if an address is already present in the local storage
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const navigate = useNavigate();
    const dispatch = useDispatch();




    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(saveShippingAddress({
            address, city,
            postalCode, country
        }));
        navigate('/payment');
    }



    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />

            <h1>Shipping</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address' className='my-2'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId='city' className='my-2'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId='postalCode' className='my-2'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter PostalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId='country' className='my-2'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button type='submit' variant='primary' className='my-2'
                >
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
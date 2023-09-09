import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FormContainer, Loader, LoaderButton } from '../components';
import { useRegisterMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, { isLoading }] = useRegisterMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';


    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate]);

    const registrationHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Password do not match');
            return;
        } else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res, }));
                navigate(redirect);
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    return (
        <FormContainer>
            <h1>Sign Up</h1>

            <Form onSubmit={registrationHandler}>
                <Form.Group controlId="name" className='my-3'>
                    <Form.Label>Full Name</Form.Label>

                    <Form.Control
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="email" className='my-3'>
                    <Form.Label>Email Address</Form.Label>

                    <Form.Control
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="password" className='my-3'>
                    <Form.Label>Password</Form.Label>

                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="confirmPassword" className='my-3'>
                    <Form.Label>Confirm Password</Form.Label>

                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>

                <Button type='submit' variant="primary" className="mt-2"
                    disabled={isLoading}>
                    {isLoading ? <LoaderButton /> : "Register"}
                </Button>
                {/* {isLoading && <Loader />} */}
            </Form>

            <Row className="py-3">
                <Col>
                    Already have an Account ?
                    <Link to={redirect ?
                        `/login?redirect=${redirect}`
                        :
                        '/login'}>login</Link>
                </Col>
            </Row>
        </FormContainer >
    )
}

export default RegisterScreen;
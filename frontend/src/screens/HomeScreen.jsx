import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Product, Loader, Message, ProductCarousel, Meta } from '../components';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { Paginate } from '../components';





const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();
    //after coverting to pages of product, the product is now inside the data
    // const { data: products, isLoading, error } = useGetProductsQuery();
    const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });


    return (
        <>

            {/* {keyword && (
                <Link to="/" className="btn btn-light mb-4">
                    Go Back
                </Link>
            )} */}
            {!keyword ? <ProductCarousel /> : (
                <Link to="/" className="btn btn-light mb-4">
                    Go Back
                </Link>
            )}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error.data?.message || error.error}
                </Message>) : (
                <>
                    {/* <Meta /> */}
                    <h1>Latest products</h1 >

                    <Row>
                        {data.products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>

                    <Paginate
                        pages={data.pages}
                        page={data.page}
                        keyword={keyword ? keyword : ""}
                    />
                </>
            )}

        </>
    )
}

export default HomeScreen
import React from 'react';
import { useParams } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { Loader, LoaderButton, Message } from '../../components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
} from '../../redux/slices/productsApiSlice';
import { toast } from 'react-toastify';
import { Paginate } from '../../components';


const ProductListScreen = () => {
    const { pageNumber } = useParams();

    // we did this because of the page pagination done
    // const { data: products, isLoading, error, refetch } = useGetProductsQuery();
    const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });
    // console.log(products);

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure')) {
            try {
                await deleteProduct(id);
                refetch();
                toast.success('Product Deleted Successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const createProductHandler = async () => {

        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                refetch();
                toast.success('Product Created Successfully')
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-end">
                    <Button className="btn-sm m-3"
                        onClick={createProductHandler}
                    >
                        {loadingCreate ? <LoaderButton /> : <span><FaEdit /> Create Product</span>}
                    </Button>
                </Col>
            </Row>

            {isLoading ? <Loader /> : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <Table striped hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button className='btn-sm mx-2' variant='light'>
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>

                                        <Button
                                            variant="danger"
                                            className="btn-sm"
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            {loadingDelete ? <LoaderButton /> : <FaTrash style={{ color: "white" }} />}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={data.pages} page={data.page} isAdmin={true} />
                </>
            )}
        </>
    )
}

export default ProductListScreen
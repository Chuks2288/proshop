import { Spinner } from "react-bootstrap";


const Loader = () => {
    return (
        <div className="loader">
            <Spinner
                animation="border"
                role="status"
                style={{
                    width: "50px",
                    height: "50px",
                    margin: "auto",
                    display: "block"
                }}
            />
        </div>
    )
}

export default Loader
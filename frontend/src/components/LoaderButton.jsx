import { Spinner } from "react-bootstrap";


const LoaderButton = () => {
    return (
        <div className="loader__button">
            <Spinner
                animation="border"
                role="status"
                style={{
                    width: "10px",
                    height: "10px",
                    margin: "auto",
                    display: "block"
                }}
            />
        </div>
    )
}

export default LoaderButton
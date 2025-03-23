import "../styles/Form.css";

const FormContainer = ({ children }) => {
    return (
        <div
            style={{
                margin: "0",
                padding: "0",
                boxSizing: "border-box",
                fontFamily: "Montserrat, sans-serif",
                background: "linear-gradient(to right, #e2e2e2, #c9d6ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100vh",
            }}>
            {children}
        </div>
    );
};

export default FormContainer;

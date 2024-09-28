import React, { useState, useEffect } from "react";

function App() {
  const [pincode, setPincode] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const resData = await res.json();
      console.log(resData);
      if (resData[0].Status === "Error" || resData[0].Status === "404") {
        setError("No data found for the entered pincode");
        setData([]);
        setFilteredData([]);
        return;
      }
      setError("");
      setData(resData[0].PostOffice);
      setFilteredData(resData[0].PostOffice);
    } catch (err) {
      setError("No data found for the entered pincode");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    // Pincode validation for exactly 6 digits
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }
    fetchData();
  };

  const inputFilterInputChange = (e) => {
    const code = e.target.value;
    setFilterInput(code);
    if (code === "") {
      setFilteredData(data);
    }
  };

  useEffect(() => {
    const items = filteredData.filter((item) =>
      item.Name.toLowerCase().includes(filterInput.toLowerCase())
    );
    setFilteredData(items);
  }, [filterInput]);

  return (
    <div style={appStyles.container}>
      <div style={appStyles.inputSection}>
        <p style={appStyles.label}>Enter Pincode</p>
        <input
          style={appStyles.input}
          type="text"
          placeholder="Pincode"
          onChange={(e) => setPincode(e.target.value)}
        />
        <button onClick={handleClick} style={appStyles.button}>
          Lookup
        </button>
      </div>

      {loading && (
        <div style={appStyles.loaderContainer}>
          <div className="spinner" style={appStyles.loader}></div>
        </div>
      )}

      {!loading && data?.length > 1 && (
        <div style={appStyles.resultSection}>
          <p>
            Pincode: <span style={appStyles.highlight}>{pincode}</span>
          </p>
          <p>
            Message: Number of pincode(s) found:{" "}
            <span style={appStyles.highlight}>{filteredData?.length}</span>
          </p>
          <input
            type="text"
            placeholder="Filter by Name"
            style={appStyles.filterInput}
            onChange={(e) => inputFilterInputChange(e)}
          />
        </div>
      )}

      {!loading && !error && (
        <div style={appStyles.grid}>
          {filteredData &&
            filteredData?.map((item) => {
              return <Pincodes item={item} key={item.Name} />;
            })}
        </div>
      )}
      {error && <h1>{error}</h1>}
    </div>
  );
}

export default App;

const Pincodes = ({ item }) => {
  return (
    <div style={pincodeStyles.card}>
      <p style={pincodeStyles.text}>
        <strong>Name:</strong> {item.Name}
      </p>
      <p style={pincodeStyles.text}>
        <strong>Branch Type:</strong> {item.BranchType}
      </p>
      <p style={pincodeStyles.text}>
        <strong>Delivery Status:</strong> {item.DeliveryStatus}
      </p>
      <p style={pincodeStyles.text}>
        <strong>District:</strong> {item.District}
      </p>
      <p style={pincodeStyles.text}>
        <strong>Division:</strong> {item.Division}
      </p>
    </div>
  );
};

// Styling
const appStyles = {
  container: {
    width: "60%",
    margin: "2rem auto",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  label: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "2px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
    outline: "none",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "150px",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
  },
  resultSection: {
    marginBottom: "20px",
  },
  highlight: {
    color: "#007bff",
    fontWeight: "bold",
  },
  filterInput: {
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "100%",
    marginBottom: "20px",
    outline: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  loader: {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderLeftColor: "#007bff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
  },
};

const pincodeStyles = {
  card: {
    border: "1px solid #007bff",
    borderRadius: "10px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  text: {
    marginBottom: "5px",
    fontSize: "16px",
  },
};

// CSS for loader animation
const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleTag);

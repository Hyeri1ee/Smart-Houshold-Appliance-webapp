import Dropdown from "../components/generic/Dropdown";
import LargeButton from "../components/generic/LargeButton";

const options = [
  { value: "mono-si", title: "mono-si" },
  { value: "poly-si", title: "poly-si" },
  { value: "tf", title: "tf" },
  { value: "as", title: "as" },
  { value: "cdte", title: "cdte" }
];

const redirect = () => {
  console.log("cum");
  window.location.href = "/";
}

const PanelsInfoPage = () => {
  return (
    <div style={styles.container}>
      <h4 style={styles.smallHeading}>Almost there!</h4>
      <h1 style={styles.bigHeading}>Panels Information</h1>
      <form style={styles.form}>
        <label style={styles.label} htmlFor="panelType">Panel Type:</label>
        <Dropdown title="Select a type" options={options} />

        <label style={styles.label} htmlFor="number-panels">Nr. of panels:</label>
        <input style={styles.input} type="number" id="number-panels" name="number-panels" placeholder="20" />

        <label style={styles.label} htmlFor="latitude">Latitude:</label>
        <div style={styles.inputContainer}>
          <input style={styles.input} type="number" id="latitude" name="latitude" placeholder="40" />
          <p style={styles.measurement}>deg.</p>
        </div>

        <label style={styles.label} htmlFor="longitude">Longitude:</label>
        <div style={styles.inputContainer}>
          <input style={styles.input} type="number" id="longitude" name="longitude" placeholder="-105" />
          <p style={styles.measurement}>deg.</p>
        </div>

        <label style={styles.label} htmlFor="tilt">Tilt:</label>
        <div style={styles.inputContainer}>
          <input style={styles.input} type="number" id="tilt" name="tilt" placeholder="30" />
          <p style={styles.measurement}>deg.</p>
        </div>

        <label style={styles.label} htmlFor="azimuth">Azimuth:</label>
        <div style={styles.inputContainer}>
          <input style={styles.input} type="number" id="azimuth" name="azimuth" placeholder="180" />
          <p style={styles.measurement}>deg.</p>
        </div>

        <label style={styles.label} htmlFor="peak-power">Peak power:</label>
        <div style={styles.inputContainer}>
          <input style={styles.input} type="number" id="peak-power" name="peak-power" placeholder="5000" />
          <p style={styles.measurement}>kW</p>
        </div>

        <label style={styles.label} htmlFor="panelWidth">Panel Size:</label>
        <div style={styles.sizeInputContainer}>
          <input style={styles.sizeInput} type="number" id="panelWidth" name="panelWidth" />
          <span style={styles.separator}>x</span>
          <input style={styles.sizeInput} type="number" id="panelHeight" name="panelHeight" />
          <p style={styles.measurement}>cm</p>
        </div>

        <span style={styles.bottomSeparator}></span>
        <div style={styles.buttonContainer}>
          <LargeButton onClick={redirect}>Confirm</LargeButton>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    height: "100vh",
    justifyContent: "center"
  },
  smallHeading: {
    textAlign: "center",
    margin: "6px auto 12px auto"
  },
  bigHeading: {
    textAlign: "center",
    marginBottom: "30px"
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "repeat(8, auto) 1fr",
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px"
  },
  label: {
    textAlign: "left",
    paddingRight: "10px"
  },
  input: {
    width: "100%",
    padding: "5px",
    backgroundColor: "white",
    border: "2px solid var(--primary-color)",
    borderRadius: "4px",
    color: "black"
  },
  inputContainer: {
    display: "flex",
    alignItems: "center"
  },
  sizeInputContainer: {
    display: "flex",
    alignItems: "center"
  },
  sizeInput: {
    width: "calc(50% - 10px)",
    padding: "5px",
    backgroundColor: "white",
    border: "2px solid var(--primary-color)",
    borderRadius: "4px",
    color: "black"
  },
  separator: {
    margin: "0 5px"
  },
  bottomSeparator: {
    gridColumn: "span 2",
    margin: "2px 0"
  },
  buttonContainer: {
    gridColumn: "span 2",
    display: "flex",
    justifyContent: "center",
    width: "calc(100% - 20px)",
    padding: "0 10px"
  },
  measurement: {
    marginLeft: "5px"
  }
};

export default PanelsInfoPage;
import React, { useState } from 'react';
import { FiUpload, FiBarChart2, FiDownload, FiShoppingCart, FiGrid, FiFolder, FiUser, FiImage } from 'react-icons/fi';
import './App.css';
import resultImage from './assets/results.png';
import logoImage from './assets/ImagoAI.png';
// import SampleImage from './sample-image.png'; // No longer needed

const GALAXIA_MODELS = [
  { name: 'GALAXIA-1', desc: 'Clean Dry Producer Only', conditions: { moisture: 'Normal Moisture - Upto 15%', damage: 'Low Damage - Upto 5%', bcfm: 'Low BCFM - Upto 3%', particleSize: 'Fine : 90% pass through a 20-mesh sieve', color: 'Yellow', sampleType: 'Producer' } },
  { name: 'GALAXIA-2', desc: 'Clean Dry Producer or Composite', conditions: { moisture: 'Normal Moisture - Upto 15%', damage: 'Low Damage - Upto 5%', bcfm: 'Low BCFM - Upto 3%', particleSize: 'Fine : 90% pass through a 20-mesh sieve', color: 'Yellow and White', sampleType: 'Producer and Composite' } },
  { name: 'GALAXIA-3', desc: 'Clean Moist Producer or Composite', conditions: { moisture: 'Elevated Moisture - Upto 18%', damage: 'Low Damage - Upto 5%', bcfm: 'Low BCFM - Upto 3%', particleSize: 'Fine : 90% pass through a 20-mesh sieve', color: 'Yellow and White', sampleType: 'Producer and Composite' } },
  { name: 'GALAXIA-3.5', desc: 'Moist, Higher Damage', conditions: { moisture: 'Elevated Moisture - Upto 18%', damage: 'High Damage - Upto 10%', bcfm: 'Low BCFM - Upto 3%', particleSize: 'Fine : 90% pass through a 20-mesh sieve', color: 'Yellow and White', sampleType: 'Producer and Composite' } },
  { name: 'GALAXIA-4', desc: 'High Moisture, Higher Damage', conditions: { moisture: 'High Moisture - >18% ( Greater than 18% )', damage: 'High Damage - Upto 10%', bcfm: 'High BCFM - Greater than 3%', particleSize: 'Fine : 90% pass through a 20-mesh sieve', color: 'Yellow and White', sampleType: 'Producer and Composite' } },
  { name: 'GALAXIA-40', desc: 'High Moisture, Extreme Damage', conditions: { moisture: 'High Moisture - >18% ( Greater than 18% )', damage: 'High Damage - Greater than 10%', bcfm: 'High BCFM - Greater than 3%', particleSize: 'Higher Fine : ', color: 'Yellow and White', sampleType: 'Producer and Composite' } },
  { name: 'GALAXIA-5', desc: 'Moldy, Higher fines', conditions: { moisture: 'High Moisture - >18% ( Greater than 18% )', damage: 'High Damage - Greater than 10%', bcfm: 'High BCFM - Greater than 3%', particleSize: 'Higher Fine : ', color: 'Yellow and White', sampleType: 'Producer,Composite and Moldy samples' } },
  { name: 'GALAXIA-5-Turbo', desc: 'Moldy, Higher Fines, Reference Material', conditions: { moisture: 'High Moisture - >18% ( Greater than 18% )', damage: 'High Damage - Greater than 10%', bcfm: 'High BCFM - Greater than 3%', particleSize: 'Higher Fine : ', color: 'Yellow and White', sampleType: 'Producer,Composite, Moldy samples, Reference Material' } },
  { name: 'GALAXIA-6', desc: 'All Types Supported', conditions: { moisture: 'High Moisture - >18% ( Greater than 18% )', damage: 'High Damage - Greater than 10%', bcfm: 'High BCFM - Greater than 3%', particleSize: 'Higher Fine : ', color: 'Yellow,White and Blue', sampleType: 'Producer,Composite, Moldy samples, Reference Material' } },
];

const PRODUCT_OPTIONS = [
  'WHEAT',
  'CORN',
  'CGM',
  'DDGS',
  'CORN MYCOTOXIN QUANT',
];

const PARAMETER_OPTIONS = [
  'AFLA', 'FUM', 'HT2', 'OTA', 'T2', 'T2HT2', 'DON', 'ZEA'
];

function App() {
  const [showParamDropdown, setShowParamDropdown] = useState(false);
  const [selectedParams, setSelectedParams] = useState([]);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [selectedModel, setSelectedModel] = useState(GALAXIA_MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [suppliers, setSuppliers] = useState(["Supplier A", "Supplier B"]);
  const [supplierInput, setSupplierInput] = useState("");
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const [seenModels, setSeenModels] = useState(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleParamDropdown = () => setShowParamDropdown((v) => !v);
  
  const handleParamChange = (param) => {
    setSelectedParams(prev => 
      prev.includes(param) 
        ? prev.filter(p => p !== param) 
        : [...prev, param]
    );
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
    if (!seenModels.has(model.name)) {
      setShowConditionsModal(true);
      setSeenModels(prev => new Set(prev).add(model.name));
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowProductDropdown(false);
  };

  const handleAnalyze = () => {
    if (selectedModel) {
      setAnalysisResult({
        quantitative: 'AFLA < RL ppb',
        image: resultImage,
      });
    }
  };

  const filteredSuppliers = suppliers.filter(s => s.toLowerCase().includes(supplierInput.toLowerCase()));
  const supplierExists = suppliers.some(s => s.toLowerCase() === supplierInput.toLowerCase());

  return (
    <div className="main-container">
      {showModelInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">GALAXIA Specifications for CORN</span>
              <button className="modal-close" onClick={() => setShowModelInfo(false)}>×</button>
            </div>
            <table className="model-spec-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Moisture</th>
                  <th>Total Damage</th>
                  <th>BCFM ( Broken Corn Foreign Material )</th>
                  <th>Particle Size</th>
                  <th>Color</th>
                  <th>Sample Type</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>GALAXIA-1</td><td>≤15%</td><td>≤5%</td><td>≤3%</td><td>90% pass 20-mesh</td><td>Yellow</td><td>Producer</td></tr>
                <tr><td>GALAXIA-2</td><td>≤15%</td><td>≤5%</td><td>≤3%</td><td>90% pass 20-mesh</td><td>Yellow & White</td><td>Producer & Composite</td></tr>
                <tr><td>GALAXIA-3</td><td>≤18%</td><td>≤5%</td><td>≤3%</td><td>90% pass 20-mesh</td><td>Yellow & White</td><td>Producer & Composite</td></tr>
                <tr><td>GALAXIA-3.5</td><td>≤18%</td><td>≤10%</td><td>≤3%</td><td>90% pass 20-mesh</td><td>Yellow & White</td><td>Producer & Composite</td></tr>
                <tr><td>GALAXIA-4</td><td>&gt;18%</td><td>≤10%</td><td>&gt;3%</td><td>90% pass 20-mesh</td><td>Yellow & White</td><td>Producer & Composite</td></tr>
                <tr><td>GALAXIA-40</td><td>&gt;18%</td><td>&gt;10%</td><td>&gt;3%</td><td>Higher Fine</td><td>Yellow & White</td><td>Producer & Composite</td></tr>
                <tr><td>GALAXIA-5</td><td>&gt;18%</td><td>&gt;10%</td><td>&gt;3%</td><td>Higher Fine</td><td>Yellow & White</td><td>Producer, Composite & Moldy</td></tr>
                <tr><td>GALAXIA-5-Turbo</td><td>&gt;18%</td><td>&gt;10%</td><td>&gt;3%</td><td>Higher Fine</td><td>Yellow & White</td><td>Producer, Composite, Moldy & Reference</td></tr>
                <tr><td>GALAXIA-6</td><td>&gt;18%</td><td>&gt;10%</td><td>&gt;3%</td><td>Higher Fine</td><td>Yellow, White & Blue</td><td>Producer, Composite, Moldy & Reference</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showConditionsModal && selectedModel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">STANDARD OPERATING CONDITIONS</span>
              <button className="modal-close" onClick={() => setShowConditionsModal(false)}>×</button>
            </div>
            <div className="conditions-content">
              <div className="conditions-model-title">{selectedModel.name} for CORN</div>
              <table className="conditions-table">
                <tbody>
                  <tr><td>Moisture</td><td>{selectedModel.conditions?.moisture}</td></tr>
                  <tr><td>Total Damage</td><td>{selectedModel.conditions?.damage}</td></tr>
                  <tr><td>BCFM ( Broken Corn Foreign Material )</td><td>{selectedModel.conditions?.bcfm}</td></tr>
                  <tr><td>Particle Size</td><td>{selectedModel.conditions?.particleSize}</td></tr>
                  <tr><td>Color</td><td>{selectedModel.conditions?.color}</td></tr>
                  <tr><td>Sample Type</td><td>{selectedModel.conditions?.sampleType}</td></tr>
                </tbody>
              </table>
              <div className="disclaimer">
                <div className="disclaimer-title">Disclaimer</div>
                <p>Samples must be at normal room temperature and thoroughly homogenized prior to testing. Improper mixing, such as hand-blending, may result in uneven distribution of mycotoxins and inaccurate results. Galaxy test outcomes may vary if the above standard operating conditions are not met.</p>
                <p>*Galaxy is not designed for use with certified reference materials, and results may not be valid if such materials are tested.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <header className="header">
    <img src={logoImage} alt="ImagoAI Logo" className="logo" />
        <div className="header-buttons">
          <button className="header-btn order-btn">
            Order Tests
            <FiShoppingCart className="header-icon" />
          </button>
          <div className="admin-toggle">
            <span className="admin-label">Admin</span>
            <label className="admin-switch">
              <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(v => !v)} />
              <span className="admin-slider"></span>
            </label>
          </div>
          <div className="user-menu" onBlur={() => setShowUserMenu(false)} tabIndex={0}>
            <button className="header-btn user-btn" onClick={() => setShowUserMenu(v => !v)}>
              imagoai_tech
              <FiGrid className="header-icon" />
            </button>
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <a href="#about" className="user-menu-item">About</a>
                <a href="#api-plugins" className="user-menu-item">API Plugins</a>
                <a href="#alert-notification" className="user-menu-item">Alert Notification</a>
                <a href="#update-password" className="user-menu-item">Update Password</a>
                <a href="#logout" className="user-menu-item">Logout</a>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="content-grid">
        <div className="left-panel">
          <div className="panel-container">
            <section className="panel galaxy-model">
          <div className="panel-title">Galaxia Model</div>
              <div className="dropdown-row">
                <div className="custom-model-dropdown" tabIndex={0} onBlur={() => setTimeout(() => setShowModelDropdown(false), 150)}>
                  <button className="custom-model-btn" type="button" onClick={()=>setShowModelDropdown(v=>!v)}>MODEL</button>
                  {showModelDropdown && (
                    <div className="custom-model-dropdown-content">
                      <div className="model-dropdown-header">Models <span className="model-info" onMouseDown={() => setShowModelInfo(true)}>i</span></div>
                      {GALAXIA_MODELS.map((model) => (
                        <div className="model-option" key={model.name} onMouseDown={()=>handleModelSelect(model)}>
                          <div className="model-name">{model.name}</div>
                          <div className="model-desc">{model.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="model-chip">{selectedModel ? selectedModel.name : 'DEFAULT'}</span>
              </div>
            </section>
          </div>
          <div className="panel-container">
            <section className="panel parameters">
              <div className="panel-title">Parameters</div>
              <div className="dropdown-row">
                <div className="custom-dropdown" tabIndex={0} onBlur={()=>setShowProductDropdown(false)}>
                  <button className="custom-dropdown-btn" type="button" onClick={()=>setShowProductDropdown(v=>!v)}>PRODUCT</button>
                  {showProductDropdown && (
                    <div className="custom-dropdown-content">
                      {PRODUCT_OPTIONS.map((productName) => (
                        <div className="model-option" key={productName} onMouseDown={()=>handleProductSelect(productName)}>
                          <div className="model-name">{productName}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="model-chip">{selectedProduct || 'DEFAULT'}</span>
              </div>
              <div className="dropdown-row parameters-dropdown-row">
                <div className="custom-dropdown" tabIndex={0} onBlur={() => setTimeout(() => setShowParamDropdown(false), 150)}>
                  <button
                    className="custom-dropdown-btn"
                    style={{height: '40px'}}
                    onClick={handleParamDropdown}
                    type="button"
                  >
                    PARAMETERS
                  </button>
                  {showParamDropdown && (
                    <div className="custom-dropdown-content">
                      {PARAMETER_OPTIONS.map(param => (
                        <label className="checkbox-label" key={param}>
                          <input 
                            type="checkbox" 
                            checked={selectedParams.includes(param)} 
                            onChange={() => handleParamChange(param)} 
                          /> {param}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  className="parameters-input"
                  type="text"
                  placeholder="Select Parameters"
                  value={selectedParams.join(', ')}
                  readOnly
                  style={{height: '40px'}}
                />
              </div>
            </section>
          </div>
          <div className="panel-container">
            <section className="panel analyze">
              <div className="panel-title">Analyze</div>
              <div className="analyze-row">
                <div className="analyze-label-group">
                  <FiFolder className="analyze-icon" />
                  <span className="analyze-label">IMAGE PATH</span>
                </div>
                <span className="analyze-link">{`HSI\\${selectedProduct ? selectedProduct.replace(/ /g, '_') : 'local'}`}</span>
              </div>
              <div className="analyze-row">
                <div className="analyze-label-group">
                  <FiImage className="analyze-icon" />
                  <span className="analyze-label">SAMPLE ID</span>
                </div>
                <input className="analyze-input" type="text" placeholder="Click to autofill the last scan" />
              </div>
              <div className="analyze-row" style={{position: 'relative'}}>
                <div className="analyze-label-group">
                  <FiUser className="analyze-icon" />
                  <span className="analyze-label">SUPPLIER NAME</span>
                </div>
                <input
                  className="analyze-input"
                  type="text"
                  placeholder="Enter Supplier Name"
                  value={supplierInput}
                  onChange={e => {
                    setSupplierInput(e.target.value);
                    setShowSupplierDropdown(true);
                  }}
                  onFocus={() => setShowSupplierDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSupplierDropdown(false), 150)}
                  autoComplete="off"
                />
                {showSupplierDropdown && (
                  <div className="supplier-dropdown-list">
                    {filteredSuppliers.map(s => (
                      <div
                        className="supplier-dropdown-item"
                        key={s}
                        onMouseDown={() => {
                          setSupplierInput(s);
                          setShowSupplierDropdown(false);
                        }}
                      >
                        {s}
                      </div>
                    ))}
                    {!supplierExists && supplierInput.trim() && (
                      <div
                        className="supplier-dropdown-item add-supplier"
                        onMouseDown={() => {
                          setSuppliers([...suppliers, supplierInput.trim()]);
                          setSupplierInput(supplierInput.trim());
                          setShowSupplierDropdown(false);
                        }}
                      >
                        Add as Supplier
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
          <div className="panel-container">
            <section className="panel upload">
              <div className="panel-title">Upload</div>
              <div className="upload-options">
                <span>HSI Image</span>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
                <span>Calibration file</span>
              </div>
              <div className="analyze-row">
                <div className="analyze-label-group">
                  <FiImage className="analyze-icon" />
                  <span className="analyze-label">EXCEL FILE</span>
                </div>
                <input className="analyze-input" type="text" placeholder="CalibrationFile.xlsx" />
              </div>
            </section>
          </div>
        </div>
        <div className="center-panel">
          <div className="co2-box">
            <div className="co2-title">CO2</div>
            <div className="co2-value">23.5kg</div>
            <div className="time-title">Time Saved</div>
            <div className="time-value">53.2hrs</div>
          </div>
        </div>
        <div className="right-panel">
          <div className="results-card">
            <div className="results-title">
              {analysisResult ? (
                <>
                  <span>Results</span>
                  <span className="model-info" onClick={() => setShowConditionsModal(true)}>i</span>
                </>
              ) : (
                <span>Results</span>
              )}
            </div>
            {analysisResult && (
              <div className="results-content">
                <div className="quantitative-result">{analysisResult.quantitative}</div>
              </div>
            )}
          </div>
        </div>
        <div className="bottom-panel">
          <div className="results-box">
            {analysisResult && <img src={analysisResult.image} alt="Analysis Result" className="result-image" />}
          </div>
        </div>
      </div>
      <footer className="footer">
        <button className="footer-btn upload-btn">
          <FiUpload className="footer-icon" />
          Upload
        </button>
        <button className="footer-btn analyze-btn" onClick={handleAnalyze}>
          <FiBarChart2 className="footer-icon" />
          Analyze
        </button>
        <button className="footer-btn export-btn">
          <FiDownload className="footer-icon" />
          Export
        </button>
      </footer>
    </div>
  );
}

export default App;

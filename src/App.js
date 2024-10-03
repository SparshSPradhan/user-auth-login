import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/auth/login', { username, password });
      setToken(response.data.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      alert('Login failed!');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFileType(file.type);
    setPreviewUrl(URL.createObjectURL(file)); // Preview the file before upload
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadUrl(response.data.url); // Set the uploaded image URL
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <h2>Upload File</h2>
          <input type="file" onChange={handleFileChange} />
          {previewUrl && (
            <div>
              <h4>Preview:</h4>
              {fileType.startsWith('image') && <img src={previewUrl} alt="Preview" width="200px" />}
              {fileType.startsWith('audio') && <audio controls src={previewUrl} />}
              {fileType.startsWith('video') && <video controls width="200px" src={previewUrl} />}
              {fileType === 'application/pdf' && <iframe title="PDF" src={previewUrl} width="200px" height="200px"></iframe>}
            </div>
          )}
          <button onClick={handleUpload}>Upload</button>
          {uploadUrl && (
            <div>
              <h4>Uploaded Image:</h4>
              <img src={uploadUrl} alt="Uploaded" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

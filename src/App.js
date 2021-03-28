import './App.css';
import React, { Component } from "react";
import axios from "axios";
import Search from "./components/Search/Search";
import firebase from "firebase";
import Logo from "./assets/logo.png";
import Folder from "./components/Folder/Folder";
import grey from "./assets/images.jpg";
import loadingImg from "./assets/loading.gif";
import download from "./assets/download.png";

const files = React.lazy(() => import("./download.zip"))

// Sets up connection to python server
const pyServer = axios.create({baseURL: "https://9d1c6e9c563b.ngrok.io"});

// Sets up connection to firebase storage
var config = {
  "apiKey": "AIzaSyDbEnhgLOOOUlnC32fUNpPBICs7wkndO3k",
  "authDomain": "imagemodelsai.firebaseapp.com",
  "databaseURL": "https://imagemodelsai-default-rtdb.firebaseio.com",
  "projectId": "imagemodelsai",
  "storageBucket": "imagemodelsai.appspot.com",
  "messagingSenderId": "735222779032",
  "appId": "1:735222779032:web:89067b160b0f3efe6d94ed",
  "measurementId": "G-M0TEM10TWM"
}

firebase.initializeApp(config);

var storage = firebase.storage();
var storageRef = storage.ref();
var directory = [];

class App extends Component {
  state = {
    searchLoading: false,
    num: 1,
    query: "",
    usedQueries: [],
    active: grey,
    training: false,
    download: false
  }

getImages = () => {
  this.setState({searchLoading: true});
  var query = this.state.query;
  pyServer.get("download_images/" + this.state.query + "/" + this.state.num).then((res) => {
    console.log(res);
    var usedQueries = [...this.state.usedQueries];
    usedQueries.push(query);
    this.setState((prevState) => ({
      searchLoading: false,
      usedQueries: usedQueries 
  }), () => this.updateDirectory());
  }
  )
}

updateQuery = (event) => {
  this.setState({
    query: event.target.value
  })
}

updateNum = (event) => {
/*   storageRef.child("images/masked person/picture" + this.state.num + ".png").getDownloadURL().then((url) => {
    this.setState({
      num: event.target.value,
      pic: url
    });
  }) */
  
  this.setState({num: event.target.value})
}

updateDirectory = () => {
  directory = [];
  this.state.usedQueries.map(folderName => {
    storageRef.child("images/" + folderName).listAll().then(folder => {
      directory.push(<Folder name={folderName} files={folder.items} setActive={this.setActive} active={this.state.active} />);
      console.log(directory);
  }).then(() => {
    this.setState({directory: directory});
  })
})
}

setActive = (url) => {
  this.setState({active: url});
}

trainModel = () => {
  this.setState({training: true})
  pyServer.get("/train_model").then(() =>{
    this.setState({training: false});
    this.downloadSetup();
  }
  );
}

downloadSetup = () => {
  pyServer.get("/download").then(this.setState({download: true}));
}

  render() {  
    return (
      <div className="App">
          <img src={Logo} style={{height: "200px", width: "250px"}} alt="Logo"/>
          <div style={{width: "800px", marginLeft: "825px"}}>
            <Search updateQuery={this.updateQuery} updateNum={this.updateNum} getImages={this.getImages} loading={this.state.searchLoading}></Search>
            {this.state.pic == null ? null : <img src ={this.state.pic}></img>}
            <div style={{display: "flex"}}>
              <div style={{display: "block"}}>
                {this.state.directory != null ? this.state.directory.map(folder => {return folder}): null}
              </div>
              <div>
                <img src={this.state.active} style={{height: "200px", width: "200px"}}></img>
                <div style={{display: "flex", marginLeft: "40px"}}>
                  {this.state.training ?  <div><img src={loadingImg} style={{height: "25px", width: "25px"}} /></div> : <button onClick={this.trainModel} style={{borderRadius: "10px", cursor: "pointer"}} >Train Model</button> }
                  <a href={this.state.download ? "./download.zip" : "javascript:void(0);"} download><input type="image" src={download} title="Download Model" style={{height: "25px", width: "30px", marginLeft: "5px", borderRadius: "10px"}} onClick={this.download}/></a>
                </div>
              </div>
            </div>
            </div>
      </div>
    );
  }
}

export default App;

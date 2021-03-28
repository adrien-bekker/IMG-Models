import React from "react";
import searchImg from "../../assets/search.png";
import loadingImg from "../../assets/loading.gif";

const search = (props) => {
    var img = props.loading ? loadingImg : searchImg;  
    return (
    <div style={{display: "flex"}}>
        <input style={inputStyle} placeholder="Search" onChange={props.updateQuery} ></input>
        <input style={{...inputStyle, width:"40px"}} type="number" min="1" onChange={props.updateNum}></input>
    <div>
        <input type="image" src={img} alt="Search" style={{height:"22px", width:"22px", marginLeft: "5px", marginTop: "2px", borderRadius: "5px"}} onClick={props.getImages} title="Search"></input>
    </div>
</div>
);
}

const inputStyle = {height:"20px", borderRadius: "10px", textAlign: "center", margin: "0 5px"};

export default search;
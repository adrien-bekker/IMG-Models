import React, {Component} from "react";

class File extends Component {
    update = () => {
        this.forceUpdate();
        console.log(this.props.active);
        console.log(this.props.url);
        console.log("test");
    }
    render() {
        var style = {cursor: "pointer", borderRadius: "10px", color: "white"};
        return (
                <h5 style={style} onClick={() => this.props.setActive(this.props.url)} currentActive={this.props.active}>&nbsp;&nbsp;&nbsp;&nbsp;Picture{this.props.id}</h5> 
        );
    }
}


export default File;
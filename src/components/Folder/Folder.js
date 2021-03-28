import File from "./File/File";
import React, {Component} from "react";

class Folder extends Component {
    componentDidMount() {
        var urls = [];
        this.props.files.forEach( file => {
            file.getDownloadURL().then((url) => {
                /* folder.push(<File url={currentURL} />) */
                urls.push(url)
            }).then(() => {
                this.setState({urls: urls});
            })
        }
        )
    }

    state = {
        urls: []
    }

    render() {
        return (
            <div>
                <h3 style={{textTransform: "capitalize", color: "white"}}>{this.props.name}</h3>
                {this.state.urls.map((url, id) => {
                    return <File url={url} id={id+1} setActive={this.props.setActive} active={this.props.active} />
                })}
            </div>
        );
    }
}

export default Folder;
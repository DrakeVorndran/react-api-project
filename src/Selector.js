import React, { Component } from 'react';

class Selector extends Component {

    // constructor (props) {
    //     super(props)
    // }

    render() {
        

        return(
            <button className={this.props.value? "" : "selected"} onClick={this.props.onClick}>{this.props.text}</button>
        )
    }
}


export default Selector
import React, { Component } from 'react'
import { Typography } from 'antd'

export default class Profile extends Component {
    constructor(props) {
        super(props);
    }
    state = { // TODO replace with requests
        name: "Santiago",
        email: "santiagogregoryl@gmail.com",
        id: 9503234759
    }
    render() {
        return (
            <div>
                <Typography>{this.state.name}</Typography>
            </div>
        )
    }
}

import React from 'react'

import { API_URL } from '../../config';

class VideoGameForm extends React.Component {
    constructor(props){
        super(props);
        if(props.type === 'create'){
            this.state = {
                verb: 'POST',
                title: '',
                console: '',
                desc: ''
            }
        } else if (props.type === 'modify'){
            this.state = {
                verb: 'PATCH',
                title: props.game.title,
                console: props.game.console,
                desc: props.game.desc
            }
        }
    }
    clearForm = () => {
        this.setState({
            title: '',
            console: '',
            desc: ''
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {verb, ...rest} = this.state; 
        fetch(`${API_URL}/api/videogames`, {
            method: verb,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{...rest}])
        }).then(response => response.json())
        .then(data => console.log(data))
        .then(this.props.refresher)
        .then(this.clearForm)
        .catch(console.log)
    }

    handleChange = (event) => {
        const name = event.target.name;
        this.setState({ [name]: event.target.value }, 
            () => console.log(name, this.state[name]));
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="videogame-form">
                <input 
                    name="title"
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.title}
                    placeholder="Game Title"
                />
                {this.renderConsoles()}
                <textarea
                    name="desc"
                    onChange={this.handleChange}
                    value={this.state.desc}
                    placeholder="Description"
                ></textarea>
                <div className="btn" onClick={this.handleSubmit}>Submit</div>
            </form>
        );
    }

    renderConsoles = () => {
        return (
            <>
                <label>
                    <select name="console" value={this.state.value} onChange={this.handleChange}>
                        <option value="">Select a Console</option>
                        <option value="xbox">Xbox</option>
                        <option value="xbox360">Xbox 360</option>
                        <option value="xboxone">Xbox One</option>
                        <option value="n64">N64</option>
                        <option value="gamecube">GameCube</option>
                        <option value="wii">Wii</option>
                        <option value="switch">Switch</option>
                        <option value="playstation2">PlayStation 2</option>
                        <option value="playstation3">PlayStation 3</option>
                        <option value="playstation4">PlayStation 4</option>
                    </select>
                </label>
            </>
        );
    }
}

export default VideoGameForm;
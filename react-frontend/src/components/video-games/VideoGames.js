import React from 'react'

import './videogames.css';
import { API_URL } from '../../config';
import VideoGame from './VideoGame';
import VideoGameForm from './VideoGameForm';

class VideoGames extends React.Component {
    state = {
        videogames: [],
        isCreate: true,
        updateID: ''
    }

    getVideoGames = () => {
        fetch(`${API_URL}/api/videogames`)
            .then(response => response.json())
            .then(videogames => this.setState({ videogames }))
            .catch(console.log)
    }
    deleteVideoGame = id => {
        fetch(`${API_URL}/api/videogames/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(this.getVideoGames)
            .then(console.log)
            .catch(console.log)
    }
    updateVideoGame = id => {
        this.setState({
            updateID: id,
            isCreate: false
        })
    }

    componentDidMount(){
        this.getVideoGames();
    }
    render(){
        const displayGames = this.state.videogames.map(
            game => 
                <VideoGame key={game._id}
                    game={game} 
                    deleteVideoGame={this.deleteVideoGame} 
                    updateVideoGame={this.updateVideoGame}
                />
        )
        let type;
        let game;
        if(this.state.isCreate){
            type = 'create'
        } else {
            game = this.state.videogames.filter(game => game._id === this.state.updateID)[0];
            type = 'modify'; 
        }
        let displayForm = <VideoGameForm type={type} refresher={this.getVideoGames} game={game}/>;
        return (
            <>
                {displayForm}
                <div className="cardbox">
                    {displayGames}
                </div>
            </>
        )
    }
}   

export default VideoGames
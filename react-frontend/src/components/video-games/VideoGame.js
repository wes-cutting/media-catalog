import React from 'react'

const VideoGame = ({game, deleteVideoGame, updateVideoGame}) => {
    return (
        <div className="card"> 
            <h2>{game.title}</h2>
            <span>
                <span className="btn" onClick={() => deleteVideoGame(game._id)}>
                    Delete
                </span>
                <span className="btn" onClick={() => updateVideoGame(game._id)}>
                    Update
                </span>
            </span>
        </div>
    )
}

export default VideoGame;
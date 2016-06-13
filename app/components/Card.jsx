import React from "react"

const images = "http://pokeapi.co/media/img/"

export default class Card extends React.Component
{
    constructor()
    {
        super(...arguments)
    }

    render()
    {
        let {pkdx_id, name} = this.props
        let image = `${images}/${pkdx_id}.png`

        return <div>
            <img src={image} alt={name} />
            <h1>{name} #{pkdx_id}</h1>
        </div>
    }
}

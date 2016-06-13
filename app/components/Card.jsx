import React from "react"

const url = "http://pokeapi.co"

export default class Card extends React.Component
{
    constructor()
    {
        super(...arguments)
    }

    render()
    {
        let {pkdx_id, name} = this.props
        let image = `${url}/media/img/${pkdx_id}.png`
        let types = this.props.types.map(({name}) =>
            <li key={name}>{name}</li>
        )

        return <div>
            <img src={image} alt={name} />
            <h1>{name} #{pkdx_id}</h1>
            <ul>{types}</ul>
        </div>
    }
}

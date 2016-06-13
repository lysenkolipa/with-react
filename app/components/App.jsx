import React from "react"
import Card from "./Card"

const api = "http://pokeapi.co"

export default class App extends React.Component
{
    constructor()
    {
        super(...arguments)

        this.loadPokemons = this.loadPokemons.bind(this)
        this.state =
        {
            pokemons: [],
            next: "/api/v1/pokemon/?limit=12"
        }
    }

    loadPokemons()
    {
        let {next, pokemons} = this.state
        this.setState({ loading: true })

        fetch(api + next)
            .then(response => response.json())
            .then(json =>
            {
                let {meta: {next}, objects} = json

                pokemons.push(...objects)
                this.setState({ next, loading: false })
            })
    }

    render()
    {
        let {pokemons, loading} = this.state
        let cards = pokemons.map(data =>
            <Card {...data} key={data.pkdx_id} />
        )

        return <div>
            <ul>{cards}</ul>
            <button onClick={this.loadPokemons}>
                <progress hidden={!loading} />
                Load more
            </button>
        </div>
    }
}

import React from "react"
import Card from "./Card"

const api = "http://pokeapi.co/api/v1"
const limit = 12

const dedupe = array => [ ...new Set(array) ]
const flatten = array => [].concat(...array)

export default class App extends React.Component
{
    constructor()
    {
        super(...arguments)

        this.filterPokemons = this.filterPokemons.bind(this)
        this.loadPokemons = this.loadPokemons.bind(this)

        this.state =
        {
            loading: false,
            next: `/pokemon/?limit=${limit}`,
            pokemons: [],
            filter: new Set
        }
    }

    filterPokemons(event)
    {
        let {checked, name} = event.target
        let {filter} = this.state

        if (checked) filter.add(name)
        else filter.delete(name)

        this.setState({ filter })
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
        let {loading, pokemons, filter} = this.state
        let types = dedupe(flatten(pokemons
                .map(data => data.types)
            )
            .map(type => type.name)
        )

        let filters = types.map(type =>
            <label key={type}>
                <input onChange={this.filterPokemons} name={type} type="checkbox" />
                {type}
            </label>
        )

        let cards = pokemons.filter(data => filter.size
            ? data.types.some(type => filter.has(type.name))
            : true
        )
        .map(data =>
            <Card {...data} key={data.pkdx_id} />
        )

        return <div>
            <ul>{filters}</ul>
            <ul>{cards}</ul>
            <button onClick={this.loadPokemons}>
                <progress hidden={!loading} />
                Load more
            </button>
        </div>
    }
}

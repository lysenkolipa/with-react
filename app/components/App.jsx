import React from "react"
import Card from "./Card"

const api = "http://pokeapi.co"
const limit = 12

const dedupe = array => [ ...new Set(array) ]
const flatten = array => [].concat(...array)

export default class App extends React.Component
{
    constructor()
    {
        super(...arguments)

        this.filterMethod = this.filterMethod.bind(this)
        this.filterType = this.filterType.bind(this)
        this.loadPokemons = this.loadPokemons.bind(this)

        this.state =
        {
            loading: false,
            next: `/api/v1/pokemon/?limit=${limit}`,
            pokemons: [],
            filter: new Set,
            method: "some"
        }
    }

    get filter()
    {
        let {filter, method} = this.state
        if (!filter.size) return () => true

        return ({types}) => types[method](type =>
            filter.has(type.name)
        )
    }

    filterType(event)
    {
        let {checked, name} = event.target
        let {filter} = this.state

        if (checked) filter.add(name)
        else filter.delete(name)

        this.setState({ filter })
    }

    filterMethod(event)
    {
        let {method} = event.target.dataset

        this.setState({ method })
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
        let {loading, pokemons, method} = this.state
        let types = dedupe(flatten(pokemons
                .map(data => data.types)
            )
            .map(type => type.name)
        )

        let filters = types.map(type =>
            <label key={type}>
                <input onChange={this.filterType} name={type} type="checkbox" />
                {type}
            </label>
        )

        let cards = pokemons.filter(this.filter).map(data =>
            <Card {...data} key={data.pkdx_id} />
        )

        return <div>
            <div hidden={!cards.length}>
                <ul>
                    <li>
                        <label>
                            <input onChange={this.filterMethod} checked={method == "every"} type="radio" name="method" data-method="every" />Every
                        </label>
                    </li>
                    <li>
                        <label>
                            <input onChange={this.filterMethod} checked={method == "some"} type="radio" name="method" data-method="some" />Some
                        </label>
                    </li>
                </ul>

                <ul>{filters}</ul>
            </div>
            <ul>{cards}</ul>
            <button onClick={this.loadPokemons}>
                <progress hidden={!loading} />
                Load more
            </button>
        </div>
    }
}

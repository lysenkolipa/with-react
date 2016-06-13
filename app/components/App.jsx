import React from "react"
import Card from "./Card"

const api = "http://pokeapi.co"
const limit = 12

const dedupe = array => [ ...new Set(array) ]
const flatten = array => [].concat(...array)

const filters =
{
    only()
    {
        return () => true
    },
    some()
    {
        return () => true
    },
    every()
    {
        return () => true
    }
}

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

    get filterFn()
    {
        let {filter, method} = this.state
        if (!filter.size) return () => true

        return ({types}) => types[method](type =>
            filter.has(type.name)
        )
    }

    get methods()
    {
        let {method} = this.state

        return Object.keys(filters).map(filter =>
            <li key={filter}>
                <label>
                    <input onChange={this.filterMethod}
                        checked={filter == method}
                        type="radio"
                        name="method"
                        data-method={filter}
                    />
                {filter}
                </label>
            </li>
        )
    }

    get types()
    {
        let {pokemons} = this.state
        let types = dedupe(flatten(pokemons.map(data =>
                data.types
            ))
            .map(type => type.name)
        )

        return types.map(type =>
            <li key={type}>
                <label>
                    <input onChange={this.filterType}
                        name={type} type="checkbox" />
                    {type}
                </label>
            </li>
        )
    }

    render()
    {
        let {loading, pokemons} = this.state
        let cards = pokemons.filter(this.filterFn).map(data =>
            <li key={data.pkdx_id}><Card {...data} /></li>
        )

        return <div>
            <div hidden={!cards.length}>
                <ul>{this.methods}</ul>
                <ul>{this.types}</ul>
            </div>
            <ul>{cards}</ul>
            <button onClick={this.loadPokemons}>
                <progress hidden={!loading} />
                Load more
            </button>
        </div>
    }
}

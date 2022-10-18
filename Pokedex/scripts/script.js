
//Global variable
let pokemonUrl = "https://pokeapi.co/api/v2/pokemon/"
let pokemons = []


//Util functions
const upperCasePokemon = (name) => {
    return name.split('')[0].toUpperCase() + name.slice(1)
}


// Step 1: Display pokemons

//1.1 Select pokemon card templates and containers

const pokemonCardTemplate = document.querySelector("[data-pokemon-template]")
const pokemonCardContainer = document.querySelector("[data-pokemon-cards-container]")

//1.2 Fetch pokemon data
const fetchPokemonData = (url) => {
    fetch(url)
        .then(res => res.json())
        .then(data =>
            processPokemonData(data))
}
//1.3 Sort data by pokemon name alphabetically
const processPokemonData = (data) => {
    const processedData = data.results.sort((a, b) => a.name.localeCompare(b.name))
    displayPokemon(processedData)
}

//1.4 Display pokemon 
const displayPokemon = (data) => {
    console.log(data)
    //Create a div with Bootstrap .row class
    const divRow = document.createElement("div")
    divRow.classList.add("row")

    //For each pokemon, create a pokemon card and 
    pokemons = data.map(pokemon => {
        //First create html element for the card
        const divCol = document.createElement("div")
        divCol.classList.add("col-4", "col-lg-2", "pb-4")

        const card = pokemonCardTemplate.content.cloneNode(true).children[0]

        const name = card.querySelector("[data-pokemon-name]")

        name.textContent = upperCasePokemon(pokemon.name)

        setPokemonIdAndImage(pokemon.url, card)

        divCol.append(card)
        divRow.append(divCol)
        pokemonCardContainer.append(divRow)

        addEventListenerToCard(card)

        return { name: pokemon.name, element: divCol }

    })

}

function setPokemonIdAndImage(pokemonUrl, card) {
    const id = card.querySelector("[data-pokemon-id")
    const image = card.querySelector("[data-pokemon-image]")

    fetch(`${pokemonUrl}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            id.textContent = `#${data.id}`
            image.src = data.sprites.other.home.front_default
            setPokemonColor(data.id, card, id)
        })
}

function setPokemonColor(pokemonId, card, id) {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        .then(res => res.json())
        .then(data => {
            color = data.color.name
            if (color === "white") {
                color = "grey"
            }
            card.style.borderColor = color
            id.style.color = color
            card.querySelector("[data-card-body]").style.backgroundColor = color
        })
}


function addEventListenerToCard(card) {
    card.addEventListener('click', function (event) {
        //hide the card and show pokemon info
        pokemonCardContainer.classList.add('d-none')
        showPokemonInfo(card)
    })
}



//Step 2 Setup the search box
const searchInput = document.querySelector("[data-search]")
searchInput.addEventListener("input", (e) => {
    const value = e.target.value
    pokemons.forEach(pokemon => {
        const isVisible = pokemon.name.includes(value)
        if (!isVisible) {
            pokemon.element.classList.add("d-none")
        }
        else {
            pokemon.element.classList.remove("d-none")
        }
    })
})






//Evoke the fetch call function
fetchPokemonData(pokemonUrl)

const generationSelect = document.querySelector(".generationSelect");
const searchTab = document.querySelector('.searchBar');
const typeSelect = document.querySelector(".typeSelect")


let generations = [
    { limit: 151, offset: 0 },
    { limit: 100, offset: 151 },
    { limit: 135, offset: 251 },
    { limit: 107, offset: 386 },
    { limit: 156, offset: 493 },
    { limit: 72, offset: 649 },
    { limit: 88, offset: 721 },
    { limit: 96, offset: 809 },
    { limit: 110, offset: 905 },
];

const infoList = (data) => {
    document.querySelector('.pokemonsImage').innerHTML = data.map((item) => {
        return `<div class = 'pokeCards'>
        <img src="${item.sprites.other["official-artwork"].front_default}"/>
        <p>Name: ${item.name} <br>Type: ${item.types[0].type.name} </p></div>`
    }).join('')

}

const apiLink = 'https://pokeapi.co/api/v2/pokemon';
let pokeData = [];

generationSelect.addEventListener('change', () => {
    const selectedGeneration = generationSelect.value;
    
    if (selectedGeneration === "0") {
        fetchAllpokemon();
    }
    else {
        const generationData = generations[selectedGeneration];
        if(generationData){
            fetchPokemonByGeneration(generationData.limit, generationData.offset)
        } else {
            console.error()
        }
    }
});

function fetchAllpokemon() {
    fetch(`${apiLink}?limit=${limit}&offset=${offset}`)
        .then((response) => response.json())
        .then((json) => {
            const fetches = json.results.map((i)=> {
                return fetch(i.url).then((response) => response.json())
            });

            Promise.all(fetches).then((response) => {
                pokeData = response;
                infoList(pokeData)
            })
        })
}

function fetchPokemonByGeneration(limit, offset) {
    fetch(`${apiLink}?limit=${limit}&offset=${offset}`)
        .then((response) => response.json())
        .then((json) => {
            const fetches = json.results.map((i)=> {
                return fetch(i.url).then((response) => response.json())
            });

            Promise.all(fetches).then((response) => {
                pokeData = response;
                infoList(pokeData);
            });
        });

}


typeSelect.addEventListener('change', ()=>{
    const selectedType = typeSelect.value;

    if (selectedType === "all") {
        infoList(pokeData)
    } else {
        filterPokemonByType(selectedType)
    }
})

function filterPokemonByType(selectedType) {
    if (Array.isArray(pokeData)) {
        const typeData = pokeData.filter((item) => {
            return item.types.some((type) => type.type.name === selectedType);
        });
        infoList(typeData);
    }
}


function searchPokemon() {
    let input = searchTab.value.toLowerCase();
    let cards = document.querySelectorAll('.pokeCards');

    cards.forEach(card => {
        let cardText = card.textContent.toLowerCase();
        if(cardText.includes(input)) {
            card.style.display = "list-item"
        } else {
            card.style.display = "none"
        }
    })
}


searchTab.addEventListener('input', searchPokemon);
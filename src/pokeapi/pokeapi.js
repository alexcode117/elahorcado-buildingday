export async function getRamdonNamePokemon({ minLength }) {
  let namePokemon = "";

  try {
    const res = await fetch("https://pokeapi.co/api/v2/generation/1");

    const data = await res.json();

    const pokemons = data.pokemon_species;

    while (namePokemon.length < minLength) {
      const randomIndex = Math.floor(Math.random() * pokemons.length);
      const randomPokemon = pokemons[randomIndex];
      namePokemon = randomPokemon.name;
    }

    return namePokemon;
  } catch (e) {
    console.error(e);
  }
}

// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState(null)
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) return

    setState({...state, status: 'pending', error: null, pokemon: null})
    // With async (option 1)
    // async function getPokemon(pokeName) {
    //   const pokemon = await fetchPokemon(pokeName)
    //   setPokemon(pokemon)
    //   // do something with the result
    // }
    // getPokemon(pokemonName)

    // With then (option 2)
    fetchPokemon(pokemonName)
      .then(pokemon =>
        setState({
          state,
          pokemon: pokemon,
          error: null,
          status: 'resolved',
        }),
      )
      .catch(error =>
        setState({
          state,
          pokemon: null,
          error: error,
          status: 'rejected',
        }),
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonName])

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // If there is an error, throw the object needed.
  // In the ErrorFallbackComponent will be mapped as error.
  if (state.status === 'rejected') {
    throw state.error
  }

  return (
    <>
      {state.status === 'idle' && <>Submit a pokemon</>}{' '}
      {state.status === 'pending' && <PokemonInfoFallback name={pokemonName} />}
      {state.status === 'resolved' && (
        <PokemonDataView pokemon={state.pokemon} />
      )}
    </>
  )
}

// Custom component to catch the error with ErrorBoundary
const ErrorFallbackComponent = ({error, resetErrorBoundary}) => (
  <div role="alert">
    Holy shit, there was an error:{' '}
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Ok</button>
  </div>
)

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  // Custom function to reset the name when person clicks 'Ok' in the error
  const handleResetError = () => {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          onReset={handleResetError} // The function set here is mapped to resetErrorBoundary in ErrorFallbackComponent
          FallbackComponent={ErrorFallbackComponent} // Set here the component to manage/show the error
          resetKeys={[pokemonName]} // Set the arrays of keys that you want to have. If the key change then boundary is reset
        >
          {/*This component has to throw the error in the corresponding case, to be captured by ErrorBoundary */}
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

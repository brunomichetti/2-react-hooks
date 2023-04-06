// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = initialName => {
  const [name, setName] = React.useState(
    () => window.localStorage.getItem('name') ?? initialName,
    // changing -- window.localStorage.getItem('name') ?? initialName -- by
    // -- () => window.localStorage.getItem('name') ?? initialName -- is to do it only once on initial render
    // this is called lazy initiation
  )

  React.useEffect(() => {
    window.localStorage.setItem('name', name)
  }, [name]) // Dependency array added to run only when name changes

  return {name, setName}
}

function Greeting({initialName = ''}) {
  const {name, setName} = useLocalStorageState(initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App

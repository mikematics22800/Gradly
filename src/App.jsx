import { useState, useEffect } from "react"
import searchSchools from "./api/searchSchools"
import { Button, CircularProgress} from "@mui/material"

function App() {
  const [query, setQuery] = useState('')
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    searchSchools(query)
      .then(data => {
        setSchools(data)
        setLoading(false)
      })
  };

  useEffect(() => {
    console.log(schools)
  }, [schools])

  return (
    <div className="w-screen h-screen">
      <nav className="bg-blue-300 fixed top-0 w-full h-20 flex items-center px-10">
        <form className="flex items-center gap-5 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search for a school"
            className="w-full max-w-[500px] p-2 border border-gray-300 rounded"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button className="!font-bold px-5" variant="contained" color="primary" type="submit">Search</Button>
        </form>
      </nav>
      <main className="px-10 mt-28 w-full h-full">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress size={100}/>
          </div>
        ) : 
        (<ul className="flex flex-col gap-5">
          {schools?.map(school => (
            <li key={school.orgId} className="border border-gray-300 p-5">
              <h2 className="text-lg font-bold">{school.name}</h2>
              <p>{school.city}, {school.state} {school.zipCode}</p>
            </li>
          ))}
        </ul>)}
      </main>
    </div>
  )
}

export default App

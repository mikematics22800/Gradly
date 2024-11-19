import { useState, useEffect, useRef } from "react"
import getSchools from "./api/getSchools"
import { Button, CircularProgress, minor} from "@mui/material"
import { Autocomplete } from "@react-google-maps/api"

function App() {
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(false)
  const autocompleteRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    console.log(state, city)
    getSchools({state, city})
      .then(data => {
        setSchools(data.results)
        console.log(data.results)
        setLoading(false)
      })
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.address_components) {
      const cityComponent = place.address_components.find(component => component.types.includes("locality"));
      const stateComponent = place.address_components.find(component => component.types.includes("administrative_area_level_1"));
      if (cityComponent) setCity(cityComponent.long_name);
      if (stateComponent) setState(stateComponent.short_name);
    }
  };

  useEffect(() => {
    console.log(schools)
  }, [schools])

  const renderPrograms = (programs) => {
    return (
        Object.keys(programs)
          .filter(program => programs[program] === 1)
          .map(program => program.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))
          .join(', ')
    );
  }

  return (
    <div className="w-screen h-screen">
      <nav className="bg-blue-300 fixed top-0 w-full h-20 flex items-center px-10">
        <form className="flex items-center gap-5 w-full" onSubmit={handleSubmit}>
          <Autocomplete 
            onLoad={ref => (autocompleteRef.current = ref)}
            onPlaceChanged={onPlaceChanged}
            types={['(cities)']}
            componentRestrictions={{ country: "us" }}
          >
            <input
              type="text"
              placeholder="School Location"
              className="w-[400px] p-2 border border-gray-300 rounded"
            />
          </Autocomplete>
          <Button className="!font-bold !px-5" variant="contained" color="primary" type="submit">Search</Button>
        </form>
      </nav>
      <main className="px-10 mt-28 w-full h-full">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress size={100}/>
          </div>
        ) : 
        (<ul className="flex flex-col gap-5">
          {schools?.map(school => {
            const data = school.school
            const latest = school.latest
            const minority = data.minority_serving
            return (
              <li className="border border-gray-300 p-5" key={school.id}>
                <h2 className="text-lg font-bold">{data.name}</h2>
                  <p>{data.address}, {data.city}, {data.state}, {data.zip}</p>
                  <p>Official Website: <a href={`http://${data.school_url}`} target="_blank" rel="noopener noreferrer">{data.school_url}</a></p>
                  <p>Associate Programs: {latest.academics.program_available.assoc ? renderPrograms(latest.academics.program.assoc) : 'None'}</p>
                  <p>Bachelor Programs: {latest.academics.program_available.bachelors ? renderPrograms(latest.academics.program.bachelors): 'None'}</p>
                  <p>Accreditor: {data.accreditor} ({data.accreditor_code})</p>
                  <p>Main Campus: {data.main_campus === 0 ? 'No' : 'Yes'}</p>
                  {data.online_only === 1 && <p>Online Only</p>}
                  <p>Price Calculator: <a href={`http://${data.price_calculator_url}`} target="_blank" rel="noopener noreferrer">{data.price_calculator_url}</a></p>
                  {data.men_only === 1 && <p>Men Only</p>}
                  {data.women_only === 1 && <p>Women Only</p>}
                  <p>Minority Serving: {Object.values(minority).every(value => value === 0) && 'No'}</p>
                  <ul className="list-disc pl-10">
                    {minority.aanipi === 0 ? ('') : (
                      <li>Asian American and Native American Pacific Islander</li>
                    )}
                    {minority.annh === 0 ? ('') : (
                      <li>Alaska Native and Native Hawaiian</li>
                    )}
                    {minority.hispanic === 0 ? ('') : (
                      <li>Hispanic</li>
                    )}
                    {minority.historically_black === 0 ? ('') : (
                      <li>Historically Black</li>
                    )}
                    {minority.nant === 0 ? ('') : (
                      <li>Native American Nontribal</li>
                    )}
                    {minority.predominantly_black === 0 ? ('') : (
                      <li>Predominantly Black</li>
                    )}
                    {minority.tribal === 0 ? ('') : (
                      <li>Tribal</li>
                    )}
                  </ul>
                  {data.under_investigation === 0 ? ('') : (
                    <p>Under Investigation:</p>
                  )}
              </li>
            )
          })}
        </ul>)}
      </main>
    </div>
  )
}

export default App
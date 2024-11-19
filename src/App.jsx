import { useState, useEffect, useRef } from "react"
import getSchools from "./api/getSchools"
import { Button, CircularProgress} from "@mui/material"
import { Autocomplete } from "@react-google-maps/api"

function App() {
  const [name, setName] = useState(null)
  const [state, setState] = useState(null)
  const [city, setCity] = useState(null)
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(false)
  const autocompleteRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    console.log(name, state, city)
    getSchools({state, city})
      .then(data => {
        name ? setSchools(data.results.filter(school => school.school.name.toLowerCase().includes(name.toLowerCase()))) :
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

  const minorityLabels = {
    aanipi: 'Asian American and Native American Pacific Islander',
    annh: 'Alaska Native and Native Hawaiian',
    hispanic: 'Hispanic',
    historically_black: 'Historically Black',
    nant: 'Native American Nontribal',
    predominantly_black: 'Predominantly Black',
    tribal: 'Tribal'
  };

  return (
    <div className="w-screen h-screen">
      <nav className="bg-blue-300 fixed top-0 w-full h-20 flex items-center px-10">
        <form className="flex items-center gap-5 w-full" onSubmit={handleSubmit}>
          <input
              type="text"
              placeholder="School Name"
              className="w-[400px] p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          <Autocomplete 
            onLoad={ref => (autocompleteRef.current = ref)}
            onPlaceChanged={onPlaceChanged}
            types={['(regions)']}
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
              <li className="school-list-item" key={school.id}>
                <h2 className="text-2xl font-bold mb-5">{data.name}</h2>
                <p><span>Address:</span> {data.address}, {data.city}, {data.state}, {data.zip}</p>
                <p><span>Official Website:</span> <a href={`http://${data.school_url}`} target="_blank" rel="noopener noreferrer">{data.school_url}</a></p>
                <p><span>Main Campus:</span> {data.main_campus === 0 ? 'No' : 'Yes'}</p>
                <p><span>Associate Programs:</span> {latest.academics.program_available.assoc ? renderPrograms(latest.academics.program.assoc) : 'None'}</p>
                <p><span>Bachelor Programs:</span> {latest.academics.program_available.bachelors ? renderPrograms(latest.academics.program.bachelors): 'None'}</p>
                {data.online_only === 1 && <p>Online Only</p>}
                <p><span>Price Calculator:</span> <a href={`http://${data.price_calculator_url}`} target="_blank" rel="noopener noreferrer">{data.price_calculator_url}</a></p>
                {data.men_only === 1 && <span>Men Only</span>}
                {data.women_only === 1 && <span>Women Only</span>}
                <p>
                  <span>Minority Serving: </span> 
                  {Object.values(minority).every(value => value === 0) ? 'No' : 
                    Object.keys(minorityLabels)
                      .filter(key => minority[key] === 1)
                      .map(key => minorityLabels[key])
                      .join(', ')
                  }
                </p>
                {data.accreditor && <p><span>Accreditor:</span> {data.accreditor} ({data.accreditor_code})</p>}
                {data.under_investigation === 1 && <span className="text-red-600">Under Investigation:</span>}
              </li>
            )
          })}
        </ul>)}
      </main>
    </div>
  )
}

export default App
import { useState, useEffect, useRef } from "react"
import getSchools from "./api/getSchools"
import { Button, CircularProgress} from "@mui/material"
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
            return (
              <li className="border border-gray-300 p-5" key={school.id}>
                <h2 className="text-lg font-bold">{data.name}</h2>
                  <p>{data.address}, {data.city}, {data.state}, {data.zip}</p>
                  <p>School URL: <a href={`http://${data.school_url}`} target="_blank" rel="noopener noreferrer">{data.school_url}</a></p>
                  <p>Accreditor: {data.accreditor} ({data.accreditor_code})</p>
                  <p>Branches: {data.branches}</p>
                  <p>Carnegie Basic: {data.carnegie_basic}</p>
                  <p>Carnegie Size Setting: {data.carnegie_size_setting}</p>
                  <p>Carnegie Undergrad: {data.carnegie_undergrad}</p>
                  <p>Degrees Awarded: Highest - {data.degrees_awarded.highest}, Predominant - {data.degrees_awarded.predominant}, Predominant Recoded - {data.degrees_awarded.predominant_recoded}</p>
                  <p>Endowment: Begin - {data.endowment.begin}, End - {data.endowment.end}</p>
                  <p>Faculty Salary: {data.faculty_salary}</p>
                  <p>FT Faculty Rate: {data.ft_faculty_rate}</p>
                  <p>Institutional Characteristics Level: {data.institutional_characteristics.level}</p>
                  <p>Instructional Expenditure per FTE: {data.instructional_expenditure_per_fte}</p>
                  <p>Locale: {data.locale}</p>
                  <p>Main Campus: {data.main_campus}</p>
                  <p>Men Only: {data.men_only}</p>
                  <p>Minority Serving: ANNH - {data.minority_serving.annh}, NANT - {data.minority_serving.nant}, AANIPI - {data.minority_serving.aanipi}, Tribal - {data.minority_serving.tribal}, Hispanic - {data.minority_serving.hispanic}</p>
                  <p>Online Only: {data.online_only}</p>
                  <p>Open Admissions Policy: {data.open_admissions_policy}</p>
                  <p>Operating: {data.operating}</p>
                  <p>Ownership: {data.ownership}</p>
                  <p>Ownership PEPS: {data.ownership_peps}</p>
                  <p>Price Calculator URL: <a href={`http://${data.price_calculator_url}`} target="_blank" rel="noopener noreferrer">{data.price_calculator_url}</a></p>
                  <p>Region ID: {data.region_id}</p>
                  <p>Religious Affiliation: {data.religious_affiliation}</p>
                  <p>Title IV: Approval Date - {data.title_iv.approval_date}, Eligibility Type - {data.title_iv.eligibility_type}</p>
                  <p>Tuition Revenue per FTE: {data.tuition_revenue_per_fte}</p>
                  <p>Under Investigation: {data.under_investigation}</p>
                  <p>Women Only: {data.women_only}</p>
                  <p>Degree Urbanization: {data.degree_urbanization}</p>
              </li>
            )
          })}
        </ul>)}
      </main>
    </div>
  )
}

export default App
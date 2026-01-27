import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all=good+neutral+bad;

  return (
    <div>
       <h1>give feedback</h1>
       <button onClick={()=>setGood(good+1)}>good</button>
       <button onClick={()=>setNeutral(neutral+1)}>neutral</button>
       <button onClick={()=>setBad(bad+1)}>bad</button>
       <h1>staticstics</h1>
       <p>good {good}</p>
       <p>neutral {neutral}</p>
       <p>bad {bad}</p>
       <p>all {all}</p>
       <p>average {(good-bad)/all}</p>
       <p>percentage {good/all*100}</p>
    </div>
  )
}

export default App
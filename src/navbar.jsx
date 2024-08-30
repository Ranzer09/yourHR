import {Link} from 'react-router-dom'

const navbar=()=>{
return(
    <header>
        <div className="navcontainer">
        <Link to='/login'>
            <h1 className='header'>
            YourHR
            </h1>
            </Link>
        </div>
    </header>
)
}

export default navbar
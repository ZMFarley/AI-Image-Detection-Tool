import loadingSpinner from "./loading_spinner.svg"
 
export default function LoadingPanel () {
    /*Loading screen to prevent additional inputs while the client is waiting for response*/
    return (
                <div className="page">
                    {/*SVG sourced from https://magecdn.com/tools/svg-loaders/pacman/*/}
                    <div className="container">
                        <img alt="loading spinner" src={loadingSpinner} width="1000" height="1000"/>
                    </div>
                    <p className= "subtitle">Loading...</p>
                </div> 
            );
}
import { useState, type ChangeEvent, useRef } from 'react'
import axios from 'axios';
import LoadingPanel from './LoadingPanel';
/* Type to hold prediction from model from API request */
type Prediction = {
    result: number;
    probReal: number;
    probAI: number;
};

export default function ImageDetectionTool() {
    /* Use State Section */
    const [file, setFile] = useState<File | null>(null); /* State to hold image file */
    const [image, setImage] = useState<string | null>(null); /* State to hold image file */
    const [page, setPage] = useState<"submit" | "loading" | "analysis">("submit"); /* State to hold current active page for display*/
    const [response, setResponse] = useState<Prediction | null>(null); /* State to hold output of classifier from API request */
    const imageRef = useRef<HTMLInputElement>(null);

    /* Image Handling Function Section */
    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        //Accepts image from file explorer, stores its url for later use
        if(e.target.files){
            setFile(e.target.files[0]);
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    /* Delete Image */ 
    function handleDeleteImage() {
        if(image){
            URL.revokeObjectURL(image);
        }

        if(imageRef.current){
            imageRef.current.value = "";
        }
        setFile(null);
        setImage(null);

    }
    
    /* API POST request to send image and recieve prediction */
    async function uploadImage(){
        //Update page to prevent reinput of image
        setPage("loading")
        if (file){
            const formData = new FormData();
            formData.append("file", file);
            const response = await axios.post("http://localhost:8000/predict", formData,
                { headers: {"Content-Type": "multipart/form-data"}}
            )
            // Adjust api response for proper intake and display 
            setResponse({result: response.data.result, probReal: response.data.probability_real, probAI: response.data.probability_ai});
            //Update page after analyization and prevent image from remaining upon return to original screen
            setPage("analysis");
            setImage(null);
        }
    }   

    return (
        <div>
            {/*Section for image input and submission to model*/}
            {page === "submit" && (
                <div className="page">
                    <header>
                        <h1 className="title">AI Image Detection Tool</h1>
                        <h2 className="subtitle">This tool will intake whatever image desired, and determine if it is AI generated or not!</h2>
                    </header>
                    {/*Input section for image*/}
                    <main className="container">
                        <section className="left">
                        {/*Prompt user to input image, and display it on the screen*/}
                        <input ref={imageRef} type="file" accept = "image/*" onChange={handleImageChange}/>
        
                        </section>
                        <div className="dividing-line"></div>   
                        <section className="right">
                            {image ? 
                                (<img alt="Preview image" src={image} width="500" height="auto"/>)
                                :
                                (<h1 className= "subtitle">No Image Selected</h1>)
                            }
                        </section>
                    </main>
                    <div className="button-container">
                        <button className="delete-button" onClick={handleDeleteImage} disabled={!file}>Delete Image</button>
                        <button className="transition-button" onClick={uploadImage} disabled={!file}>Click To Submit to the detector</button>
                    </div>
                </div> )}

                {/*Loading screen to prevent additional inputs while the client is waiting for response*/}
                {page === "loading" && <LoadingPanel/>}
                
                {/*Section for model prediction output*/}
                {page === "analysis"  && (
                <div className="page">
                    <h1 className="title">Results</h1>
                    {/*Output section for results*/}
                    <div className="results">
                        {/*Conditionals to output model predictions*/}
                        {response?.result === 0  && 
                            <>
                                <h2>The model has predicted this image is NOT AI Generated</h2> 
                                <h3>with {(response?.probReal * 100).toFixed(2)}% certainty</h3>
                            </>}
                        {response?.result === 1  && 
                            <>
                                <h2>The model has predicted this image is AI Generated</h2>
                                <h3>with {(response?.probAI * 100).toFixed(2)}% certainty</h3>
                            </>}
                    </div>  
                    <div className="button-container">      
                        <button className="transition-button" onClick={() =>  {handleDeleteImage(); setPage("submit");}}>Click to test another image!</button>
                    </div>
                </div> )}

        </div>
    );
    
}
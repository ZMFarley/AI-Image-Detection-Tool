import { useState } from 'react'
import axios from 'axios';
import UploadPanel from './UploadPanel';
import LoadingPanel from './LoadingPanel';
import AnalysisPanel from './AnalysisPanel';

/* Type to hold prediction from model from API request */
export type Prediction = {
    result: number;
    probReal: number;
    probAI: number;
};

/* Type for Api Response Conversion*/
type ApiResponse = {
     result: number;
     probability_real: number;
     probability_ai: number;
}
export default function ImageDetectionTool() {
    /* Use State Section */
    const [files, setFile] = useState<File[]>([]); /* State to hold image file */
    const [images, setImage] = useState<string[]>([]); /* State to hold image url for browswer rendering for file based images*/
    const [page, setPage] = useState<"submit" | "loading" | "analysis">("submit"); /* State to hold current active page for display*/
    const [responses, setResponses] = useState<Prediction[]>([]); /* State to hold output of classifier from API request */
    const [imageURL, setImageURL] = useState<string | null>(null); /* State to hold onlien gathered url for browswer rendering */

    /* Image Handling Function Section */
    function handleImageChange(files: File[]) {
        //Accepts image from file explorer, stores its url for later use
        if(files){
            setFile(prevFiles => [...prevFiles, ...files]);
            setImage(prevImages => [...prevImages, ...files.map(file => URL.createObjectURL(file))]);
        }
    }

    /* function to handle Singular URL attachments */
    function handleImageURL(url: string) {
        //Accepts image from file explorer, stores its url for later use
        if(url){
            setImageURL(url);
        }
    }
    
    /* Delete all Images */ 
    function handleDeleteImage() {
        if(images){
            images.map(image => URL.revokeObjectURL(image));
        }
        setFile([]);
        setImage([]);
        setImageURL("");
    }
    

    /* Reset page to remove old image */
    function handleReset(){
        handleDeleteImage();
        setPage("submit");
        setResponses([]);
    }
    


    /* API POST request to send image and recieve prediction */
    async function handleUploadImage(){
        //Update page to prevent reinput of image
        setPage("loading")
        if (files.length){
            const formData = new FormData();
            for (const image of files){
                formData.append("files", image);
            }
            const apiResponse = await axios.post("http://localhost:8000/predict", formData,
                { headers: {"Content-Type": "multipart/form-data"}}
            )

            // Adjust api response for proper intake and display 
            setResponses([{result: apiResponse.data.result, probReal: apiResponse.data.probability_real, probAI: apiResponse.data.probability_ai}]);
            //Update page after analyization and prevent image from remaining upon return to original screen
            setPage("analysis");
            setImage([]);
        }
        
        // Temporary repeat code to prove workable url pasting, will change into combined payload later on.
        else if (imageURL){
            const apiResponse = await axios.post("http://localhost:8000/predictURL", imageURL);
            // Adjust api response for proper intake and display 
            const mappedResponses = apiResponse.data.map((response: ApiResponse) => ({
                result: response.result,
                probReal: response.probability_real,
                probAI: response.probability_ai}));
            setResponses(mappedResponses);
            //Update page after analyization and prevent image from remaining upon return to original screen
            setPage("analysis");
            setImage([]);
        }
    }   

    return (
        <div>
            {/*Section for image input and submission to model*/}
            {page === "submit" && <UploadPanel files={files} images = {images} imageURL = {imageURL}
                                   onImageChange={handleImageChange} onDeleteImage={handleDeleteImage} onUploadImage={handleUploadImage} onImageURL={handleImageURL}/>}
            {/*Loading screen to prevent additional inputs while the client is waiting for response*/}
            {page === "loading" && <LoadingPanel/>}
            {/*Section for model prediction output*/}
            {page === "analysis"  && <AnalysisPanel responses={responses} onReset={handleReset}/>}
    </div>
    );
    
}

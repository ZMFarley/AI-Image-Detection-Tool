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

export type ImageInput = 
    |{
        kind: "file";
        file: File;
        preview: string;
    }
    |{
        kind: "url";
        url: string;
        preview: string;
    };
export default function ImageDetectionTool() {
    /* Use State Section */
    const [imageQueue, setImageQueue] = useState<ImageInput[]>([]);
    const [page, setPage] = useState<"submit" | "loading" | "analysis">("submit"); /* State to hold current active page for display*/
    const [responses, setResponses] = useState<Prediction[]>([]); /* State to hold output of classifier from API request */

    /* Image Handling Function Section */
    function handleImageUpload(input: File[] | string) {
        let images: ImageInput[];
        if(input){
            //If input is an Url, assign proper state 
            if (typeof input === "string"){
                images =  [{
                    kind:  "url",
                    url: input,
                    preview: input
                }];
            }
            //Else if input is a file, assign proper state and generate relevant preview
            else{
                images = input.map(element => ({
                    kind: "file",
                    file: element,
                    preview: URL.createObjectURL(element)
                }));
            }

            // Modify the state to update the Image Queue.
            setImageQueue(prevImages => [...prevImages, ...images]);
        }
        
    }
    
    /* Delete all Images */ 
    function handleDeleteAllImages() {
        return
    }
    

    /* Reset page to remove old image */
    function handleReset(){
        handleDeleteAllImage();
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
             const mappedResponses = apiResponse.data.map((response: ApiResponse) => ({
                result: response.result,
                probReal: response.probability_real,
                probAI: response.probability_ai}));
            setResponses(mappedResponses);
            //Update page after analyization and prevent image from remaining upon return to original screen
            setPage("analysis");
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
        }
    }   

    return (
        <div>
            {/*Section for image input and submission to model*/}
            {page === "submit" && <UploadPanel files={files} images = {images} imageURL = {imageURL}
                                   onImageChange={handleImageUpload} onDeleteImage={handleDeleteImage} onUploadImage={handleUploadImage} onImageURL={handleImageURL}/>}
            {/*Loading screen to prevent additional inputs while the client is waiting for response*/}
            {page === "loading" && <LoadingPanel/>}
            {/*Section for model prediction output*/}
            {page === "analysis"  && <AnalysisPanel  images={images} responses={responses} onReset={handleReset}/>}
    </div>
    );
    
}

import type { Prediction } from "./ImageDetectionTool";
import { useState } from 'react';
type AnalysisPanelProps = {
    images: string[];
    responses: Prediction[];
    onReset: () => void;
};

export default function AnalysisPanel ({images, responses, onReset }: AnalysisPanelProps) {
    /*Loading screen to prevent additional inputs while the client is waiting for responses*/
    const [previewedImage, setPreviewedImage] = useState<number>(0); /* State to set what image is currently being previewed*/
    const displayedResponse = responses[previewedImage]; /* Displays results for currently displayed image */
    /*Loading screen to prevent additional inputs while the client is waiting for response*/
    return (
                <div className="page">
                    <header>
                        <h1 className="title">Results</h1>
                    </header>
                    {/*Input section for image*/}
                    <main className="container">
                        <section className="left">
                            <h1 className="subtitle">Image Analysis</h1>
                            <div className="results">
                            {/*Conditionals to output model predictions*/}
                            {displayedResponse?.result === 0  && 
                                <>
                                    <h1 className="result-real">Real Image Detected</h1>
                                    <h2>The model has predicted this image is NOT AI Generated</h2> 
                                    <h3>with {(displayedResponse?.probReal * 100).toFixed(2)}% certainty</h3>
                                </>}
                            {displayedResponse?.result === 1  && 
                                <>
                                    <h1 className="result-ai">AI-Generated Image Detected</h1>
                                    <h2>The model has predicted this image is AI Generated</h2>
                                    <h3>with {(displayedResponse?.probAI * 100).toFixed(2)}% certainty</h3>
                            </>}
                            </div>  
                            <div className="button-container">      
                                <button className="transition-button" onClick={onReset}>Click to test another image!</button>
                            </div>
                        </section>
                        <div className="dividing-line"></div>   
                        <section className="right">
                            <div className="preview-section">
                                <img className="preview-image" alt="Preview image" src={images[previewedImage]} width="500" height="auto"/>
                            </div>
                            {images.length > 0 && (
                            <div className="thumbnail-section">
                                {images.map((image, index) => (
                                    <button key={image} className="thumbnail-button" type="button" onClick={() => setPreviewedImage(index)}>
                                        <img className="thumbnail-image" alt={`Image ${index + 1}`} src = {image}/>
                                    </button>
                                ))}
                            </div>
                            )}
                        </section>
                    </main>
                </div> 
    );
}
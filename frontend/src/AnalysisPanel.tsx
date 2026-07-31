import type { Prediction } from "./ImageDetectionTool";
import type { ImageInput } from "./ImageDetectionTool";
import ConfidenceGauge from "./ConfidenceGauge";
import PreviewPanel from './PreviewPanel';
import { useState } from 'react';
type AnalysisPanelProps = {
    imageQueue: ImageInput[];
    responses: Prediction[];
    onReset: () => void;
};

export default function AnalysisPanel ({imageQueue, responses, onReset }: AnalysisPanelProps) {
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
                        <section className="analysis left">
                            <h1 className="subtitle">Image Analysis</h1>
                            <div className="results">
                            {/*Conditionals to output model predictions*/}
                            {displayedResponse?.result === 0 ? 
                                <h1 className="result-real">Likely Real </h1> : 
                                <h1 className="result-ai">Likely AI Generated</h1>}
                            <ConfidenceGauge probReal={(displayedResponse?.probReal * 100)} probAI={(displayedResponse?.probAI * 100)} ></ConfidenceGauge>

                            </div>  
                            <div className="button-container">      
                                <button className="transition-button" onClick={onReset}>Click to test another image!</button>
                            </div>
                        </section>
                        <div className="dividing-line"></div>   
                        <section className="right">
                            <PreviewPanel imageQueue={imageQueue} previewedImage={previewedImage} onPreviewedImageChange={setPreviewedImage}/>
                        </section>
                    </main>
                </div> 
    );
}
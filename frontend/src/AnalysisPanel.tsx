import type { Prediction } from "./ImageDetectionTool";

type AnalysisPanelProps = {
    response: Prediction | null;
    onReset: () => void;
};

export default function AnalysisPanel ({ response, onReset }: AnalysisPanelProps) {
    /*Loading screen to prevent additional inputs while the client is waiting for response*/
    return (
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
                        <button className="transition-button" onClick={onReset}>Click to test another image!</button>
                    </div>
                </div>
            );
}
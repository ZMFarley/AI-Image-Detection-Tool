import type { ImageInput } from "./ImageDetectionTool";

// Type to handle moving previewed image via arrows 
type Direction = "next" | "previous";

// Relevant props to operate Panel
type PreviewPanelProps = {
    imageQueue: ImageInput[];
    previewedImage: number;
    onPreviewedImageChange: (previewedImage: number) => void;
}


export default function PreviewPanel ({imageQueue, previewedImage, onPreviewedImageChange}: PreviewPanelProps) {
    /* Use State Section */
    function handleMovePreview(previewedImage: number, queueLength: number, direction: Direction){
       //Handle empty queues 
       if (!queueLength){
          return;   
       }

       //Determine increment or decrement to Previewed Image
       const change = (direction === "next") ? 1 : -1

       //Update previewed image, accounting for each edge case via wrap around
       onPreviewedImageChange(((previewedImage + change + queueLength)) % queueLength); 
    }

    return (
          <>
            <div className='preview-row'>
                    {imageQueue.length > 0 && (<button className='preview-button' onClick={() => handleMovePreview(previewedImage,imageQueue.length, "previous")}>{"<"}</button>)}
                    <div className="preview-section">
                        {imageQueue.length ? 
                            (<img className="preview-image" alt="Preview image" src={imageQueue[previewedImage].preview} width="500" height="auto"/>)
                            :
                            (<h1 className= "subtitle">No Image Selected</h1>)
                        }
                    </div>
                    {imageQueue.length > 0 && (<button className='preview-button' onClick={() => handleMovePreview(previewedImage,imageQueue.length, "next")}>{">"}</button>)}
                </div>
                {imageQueue.length > 0 && (
                <div className="thumbnail-section">
                    {imageQueue.map((image, index) => (
                        <button key={image.preview} className="thumbnail-button" type="button" onClick={() => onPreviewedImageChange(index)}>
                            <img className="thumbnail-image" alt={`Image ${index + 1}`} src = {image.preview}/>
                        </button>
                    ))}
                </div>
                )}
            </>
    );
}

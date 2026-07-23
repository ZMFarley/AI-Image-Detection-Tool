import { useDropzone } from 'react-dropzone';
import type { ImageInput } from "./ImageDetectionTool";
import { useState } from 'react'
import upload_icon from "./upload_icon.svg"
type UploadPanelProps = {
    imageQueue: ImageInput[];
    onImageChange: (images: File[] | string) => void;
    onDeleteImage: () => void;
    onImagePrediction: () => Promise<void>;
};

export default function UploadPanel ({imageQueue, onImageChange, onDeleteImage, onImagePrediction}: UploadPanelProps) {
    /* Use State Section */
    const [url, setURL] = useState<string>(""); /* State to hold image file */
    const [previewedImage, setPreviewedImage] = useState<number>(0); /* State to set what image is currently being previewed*/
    /*Loading screen to prevent additional inputs while the client is waiting for response*/
    const {getRootProps, getInputProps, isDragActive} = useDropzone({ accept: {"image/*": []}, multiple: true, onDrop: (acceptedFiles) => onImageChange(acceptedFiles)})
    return (
                <div className="page">
                    <header>
                        <h1 className="title">AI Image Detection Tool</h1>
                        <h2 className="subtitle">This tool will intake whatever image desired, and determine if it is AI generated or not!</h2>
                    </header>
                    {/*Input section for image*/}
                    <main className="container">
                        <section className="left">
                        {/*Prompt user to input image, and display it on the screen*/}
                            <div{...getRootProps()} className="dropzone">
                                <input {...getInputProps()}/>
                                {
                                    isDragActive ?
                                    <p>Drop the files here...</p> :
                                    <>
                                    {/* Image taken from https://www.svgrepo.com/svg/432027/upload-2 */}
                                    <img alt="upload_icon" src={upload_icon} width="100" height="100"/>
                                    <p>Drop files here, or click to browse</p>
                                    </>
                                } 
                            </div>
                            <p className="upload-panel-text">OR</p>
                            <section className="url-catcher-container">
                                <p>Paste a link to an image below:</p>
                                <input name="url-catcher" className ="url-catcher" type="text" value={url} onChange={(e) => setURL(e.target.value)} />
                                <button className = "url-submitter" onClick={() => {onImageChange(url); setURL("");}} disabled={!url}>Submit</button>
                            </section>
                            <div className="button-container">
                                <button className="transition-button" onClick={onImagePrediction} disabled={imageQueue.length == 0}>Click To Submit to the detector</button>
                            </div>
                        </section>
                        <div className="dividing-line"></div>   
                        <section className="right">
                            <div className="preview-section">
                                {imageQueue.length ? 
                                    (<img className="preview-image" alt="Preview image" src={imageQueue[previewedImage].preview} width="500" height="auto"/>)
                                    :
                                    (<h1 className= "subtitle">No Image Selected</h1>)
                                }
                            </div>
                            {imageQueue.length > 0 && (
                            <div className="thumbnail-section">
                                {imageQueue.map((image, index) => (
                                    <button key={image.preview} className="thumbnail-button" type="button" onClick={() => setPreviewedImage(index)}>
                                        <img className="thumbnail-image" alt={`Image ${index + 1}`} src = {image.preview}/>
                                    </button>
                                ))}
                            </div>
                            )}
                            {(imageQueue.length > 0) && (
                                <div className="button-container">
                                    <button className="delete-button" onClick={onDeleteImage} disabled={imageQueue.length == 0}>Delete All</button>
                                </div>
                            )}
                        </section>
                    </main>
                </div> 
    );
}
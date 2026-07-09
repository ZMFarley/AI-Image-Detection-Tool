import { useDropzone } from 'react-dropzone';
import { useState } from 'react'
import upload_icon from "./upload_icon.svg"
type UploadPanelProps = {
    files: File[];
    images: string[];
    imageURL: string | null;
    onImageChange: (files: File[]) => void;
    onDeleteImage: () => void;
    onUploadImage: () => Promise<void>;
    onImageURL: (url: string) => void;
};

export default function UploadPanel ({files, images, imageURL, onImageChange, onDeleteImage, onUploadImage, onImageURL}: UploadPanelProps) {
    /* Use State Section */
    const [url, setURL] = useState<string>(""); /* State to hold image file */
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
                                <button className = "url-submitter" onClick={() => {onImageURL(url); setURL("");}} disabled={!url}>Submit</button>
                            </section>
                            <div className="button-container">
                                <button className="delete-button" onClick={onDeleteImage} disabled={files.length == 0 && !imageURL}>Delete Image</button>
                                <button className="transition-button" onClick={onUploadImage} disabled={files.length == 0 && !imageURL}>Click To Submit to the detector</button>
                            </div>
                        </section>
                        <div className="dividing-line"></div>   
                        <section className="right">
                            <div className="preview-section">
                                {images.length ? 
                                    (<img className="preview-image" alt="Preview image" src={images[0]} width="500" height="auto"/>)
                                    :
                                    imageURL ?
                                    (<img className="preview-image" alt="Preview image" src={imageURL} width="500" height="auto"/>)
                                    :
                                    (<h1 className= "subtitle">No Image Selected</h1>)
                                }
                            </div>
                        </section>
                    </main>
                </div> 
    );
}
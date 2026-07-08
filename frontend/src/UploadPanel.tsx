import { useDropzone } from 'react-dropzone';
import { useState } from 'react'
import upload_icon from "./upload_icon.svg"
type UploadPanelProps = {
    file: File | null;
    image: string | null;
    imageURL: string | null;
    onImageChange: (file: File) => void;
    onDeleteImage: () => void;
    onUploadImage: () => Promise<void>;
    onImageURL: (url: string) => void;
};

export default function UploadPanel ({file, image, imageURL, onImageChange, onDeleteImage, onUploadImage, onImageURL}: UploadPanelProps) {
    /* Use State Section */
    const [url, setURL] = useState<string>(""); /* State to hold image file */
    /*Loading screen to prevent additional inputs while the client is waiting for response*/
    const {getRootProps, getInputProps, isDragActive} = useDropzone({ accept: {"image/*": []}, multiple: false, onDrop: (acceptedFiles) => onImageChange(acceptedFiles[0])})
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
                                <button className = "url-submitter" onClick={() => onImageURL(url)} disabled={!url}>Submit</button>
                            </section>
                            <div className="button-container">
                                <button className="delete-button" onClick={onDeleteImage} disabled={!file}>Delete Image</button>
                                <button className="transition-button" onClick={onUploadImage} disabled={!file}>Click To Submit to the detector</button>
                            </div>
                        </section>
                        <div className="dividing-line"></div>   
                        <section className="right">
                            {image ? 
                                (<img alt="Preview image" src={image} width="500" height="auto"/>)
                                :
                                imageURL ?
                                (<img alt="Preview image" src={imageURL} width="500" height="auto"/>)
                                :
                                (<h1 className= "subtitle">No Image Selected</h1>)
                            }
                        </section>
                    </main>
                </div> 
    );
}
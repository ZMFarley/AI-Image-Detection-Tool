import {type ChangeEvent} from 'react'

type UploadPanelProps = {
    file: File | null;
    image: string | null;
    imageRef: React.RefObject<HTMLInputElement | null>
    onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDeleteImage: () => void;
    onUploadImage: () => void;
};

export default function UploadPanel ({file, image, imageRef, onImageChange, onDeleteImage, onUploadImage}: UploadPanelProps) {
    /*Loading screen to prevent additional inputs while the client is waiting for response*/
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
                        <input ref={imageRef} type="file" accept = "image/*" onChange={onImageChange}/>
        
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
                        <button className="delete-button" onClick={onDeleteImage} disabled={!file}>Delete Image</button>
                        <button className="transition-button" onClick={onUploadImage} disabled={!file}>Click To Submit to the detector</button>
                    </div>
                </div> 
    );
}
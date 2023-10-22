import React from 'react';
import "./carosoule.scss";

const Gallery = () => {
  return (
    <div>
      <button onClick={() => {
        const el = document.querySelector('body');
        el.requestFullscreen();
      }}>
       
      </button>
      <div className="wrapper-images">
      <div className="images-line">
      <div className="line chib-image"> {/* Apply the CSS class here */}
            <div className="img chib-image"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image2"> {/* Apply the CSS class here */}
            <div className="img chib-image2"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image3"> {/* Apply the CSS class here */}
            <div className="img chib-image3"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image4"> {/* Apply the CSS class here */}
            <div className="img chib-image4"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image5"> {/* Apply the CSS class here */}
            <div className="img chib-image5"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image6"> {/* Apply the CSS class here */}
            <div className="img chib-image6"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image7"> {/* Apply the CSS class here */}
            <div className="img chib-image7"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image8"> {/* Apply the CSS class here */}
            <div className="img chib-image8"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image9"> {/* Apply the CSS class here */}
            <div className="img chib-image9"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image10"> {/* Apply the CSS class here */}
            <div className="img chib-image"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image10"> {/* Apply the CSS class here */}
            <div className="img chib-image"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image11"> {/* Apply the CSS class here */}
            <div className="img chib-image"></div> {/* Apply the CSS class here */}
          </div>
          <div className="line chib-image11"> {/* Apply the CSS class here */}
            <div className="img chib-image"></div> {/* Apply the CSS class here */}
          </div>
           
          {/* Add more images here */}
        </div>
      </div>
    </div>
  );
}

export default Gallery;

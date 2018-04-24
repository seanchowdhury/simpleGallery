import React from 'react';
import Gallery from './gallery';
import ImageShow from './imageShow';
import Cookie from 'js-cookie';

class Showcase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      letter: "",
      curatedImages: []
    };

    this.setState = this.setState.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
    fetch('/welcome', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authToken': Cookie.get('authToken')
      },
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        letter: res.letter,
        curatedImages: res.curatedImages
      });
    });
  }

  displayImage(idx) {
    this.disableScroll();
    const props = {
      images: this.state.curatedImages,
      currentImageIndex: idx,
      closeModal: this.closeModal
    };
    this.setState({
      currentImage: <ImageShow {...props}/>
    });
  }

  closeModal() {
    this.enableScroll();
    this.setState({currentImage: null});
  }

  render() {
    const curatedImages = this.state.curatedImages.map((image, idx) => {
      return <div key={idx} className='curated-item-container'><img onClick={() => this.displayImage(idx)} className="curated-item" alt="" src={image.imageURL} /></div>;
    });
    let imageModal;
    if(this.state.currentImage) {
      imageModal = this.state.currentImage;
    }
    return(
      <div>
        {imageModal}
        <div id="curated-show">
          <div id='curated-letter'><h2>{this.state.letter}</h2></div>
          <div id='curated-images'>{curatedImages}</div>
        </div>
        <Gallery />
      </div>
    );
  }

  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
  }

  preventDefaultForScrollKeys(e) {
    const keys = {37: 1, 38: 1, 39: 1, 40: 1};
    if (keys[e.keyCode]) {
      e.preventDefault();
      return false;
    }
  }

  disableScroll() {
    window.onwheel = this.preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
    window.ontouchmove  = this.preventDefault; // mobile
    document.onkeydown  = this.preventDefaultForScrollKeys;
  }

  enableScroll() {
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
  }
}

export default Showcase;

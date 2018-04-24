import React from 'react';
import ImageShow from './imageShow';
import Footer from './footer';

class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      lastEvaluatedKey: null,
      currentImage: null
    };

    this.setState = this.setState.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
    fetch('/gallery', {
      headers: {
        'LastEvaluatedKey': this.state.lastEvaluatedKey
      },
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      const images = this.state.images.concat(res.images);
      this.setState({
        images,
        lastEvaluatedKey: res.lastEvaluatedKey
      });
    });
  }

  displayImage(idx) {
    this.disableScroll();
    const props = {
      images: this.state.images,
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
    const gallery = this.state.images.map((image, idx) => {
      return (
        <img onClick={() => this.displayImage(idx)} className="gallery-item" alt="" key={idx} src={image.imageURL} />
      );
    });
    let imageModal;
    if(this.state.currentImage) {
      imageModal = this.state.currentImage;
    }
    return(
      <div>
        <h1 id='title'>looksLikeArt</h1>
        <div id='gallery-container'>{gallery}</div>
        {imageModal}
        <Footer />
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

export default Gallery;

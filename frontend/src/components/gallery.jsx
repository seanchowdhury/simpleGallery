import React from 'react';
import ImageShow from './imageShow';

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

  displayImage(image) {
    const props = {
      imageProperties: image,
      closeModal: this.closeModal
    };
    this.setState({
      currentImage: <ImageShow {...props}/>
    });
  }

  closeModal() {
    this.setState({currentImage: null});
  }

  render() {
    const gallery = this.state.images.map((image, idx) => {
      return (
        <img onClick={() => this.displayImage(image)} className="gallery-item" alt="" key={idx} src={image.imageURL.S} />
      );
    });
    let imageModal;
    if(this.state.currentImage) {
      imageModal = this.state.currentImage;
    }
    return(
      <div>
        <h1 id='title'>itlookslikeart</h1>
        <div id='gallery-container'>{gallery}</div>
        {imageModal}
      </div>
    );
  }
}

export default Gallery;

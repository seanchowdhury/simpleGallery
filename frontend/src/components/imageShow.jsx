import React from 'react';

class ImageShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImageIndex: null
    };
  }

  componentWillMount() {
    this.setState({
      currentImageIndex: this.props.currentImageIndex
    });
  }

  openImage(e) {
    e.stopPropagation();
    window.open(this.props.images[this.state.currentImageIndex].imageURL.S);
  }

  previousImage(e) {
    e.stopPropagation();
    if(this.state.currentImageIndex !== 0) {
      const currentImageIndex = this.state.currentImageIndex - 1;
      this.setState({
        currentImageIndex
      });
    }
  }

  nextImage(e) {
    e.stopPropagation();
    if(!(this.state.currentImageIndex === this.props.images.length - 1)) {
      const currentImageIndex = this.state.currentImageIndex + 1;
      this.setState({
        currentImageIndex
      });
    }
  }

  render() {
    const currentImage = this.props.images[this.state.currentImageIndex];
    let title;
    if(currentImage.title){
      title = currentImage.title.S;
    }
    let description;
    if(currentImage.description){
      description = currentImage.description.S;
    }
    let image = <img src={currentImage.imageURL.S} onClick={(e) => this.openImage(e)}/>;
    return (
      <div id='outer-modal' onClick={() => this.props.closeModal()}>
        <button onClick={(e) => this.previousImage(e)}>BACK</button>
        <div max-width={image.clientWidth} id='inner-modal'>
          {image}
          <h2 onClick={(e) => e.stopPropagation()}>{title}</h2>
          <p onClick={(e) => e.stopPropagation()}>{description}</p>
        </div>
        <button onClick={(e) => this.nextImage(e)}>FORWARD</button>
      </div>
    );
  }
}

export default ImageShow;

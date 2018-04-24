import React from 'react';

class ImageShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImageIndex: null
    };
  }

  componentWillMount() {
    console.log("hello?");
    document.addEventListener('keyup', (e) => {
      console.log(e);
      switch(e.key) {
        case "ArrowLeft":
          this.previousImage(e);
          break;
        case "ArrowRight":
          this.nextImage(e);
          break;
        case "Escape":
          this.props.closeModal();
          break;
        default:
          break;
      }
    });
    this.setState({
      currentImageIndex: this.props.currentImageIndex
    });
  }

  openImage(e) {
    e.stopPropagation();
    window.open(this.props.images[this.state.currentImageIndex].imageURL);
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
      title = currentImage.title;
    }
    let description;
    if(currentImage.description){
      description = currentImage.description;
    }
    const image = <img alt="" src={currentImage.imageURL} onClick={(e) => this.openImage(e)}/>;
    let previousImage;
    if(this.state.currentImageIndex !== 0) {
      previousImage = <i onClick={(e) => this.previousImage(e)} className="fas fa-angle-left"></i>;
    }
    let nextImage;
    if(!(this.state.currentImageIndex === this.props.images.length -1)) {
      nextImage = <i onClick={(e) => this.nextImage(e)} className="fas fa-angle-right"></i>;
    }
    return (
      <div id='outer-modal' onClick={() => this.props.closeModal()}>
        {previousImage}
        <div max-width={image.clientWidth} id='inner-modal'>
          {image}
          <h2 onClick={(e) => e.stopPropagation()}>{title}</h2>
          <p onClick={(e) => e.stopPropagation()}>{description}</p>
        </div>
        {nextImage}
      </div>
    );
  }
}

export default ImageShow;

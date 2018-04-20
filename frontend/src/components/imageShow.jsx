import React from 'react';

class ImageShow extends React.Component {
  openImage(e) {
    e.stopPropagation();
    window.open(this.props.imageProperties.imageURL.S);
  }

  render() {
    let title;
    if(this.props.imageProperties.title){
      title = this.props.imageProperties.title.S;
    }
    let description;
    if(this.props.imageProperties.description){
      description = this.props.imageProperties.description.S;
    }
    let image = <img src={this.props.imageProperties.imageURL.S} onClick={(e) => this.openImage(e)}/>;
    return (
      <div id='outer-modal' onClick={() => this.props.closeModal()}>
        <div max-width={image.clientWidth} id='inner-modal'>
          {image}
          <h2 onClick={(e) => e.stopPropagation()}>{title}</h2>
          <p onClick={(e) => e.stopPropagation()}>{description}</p>
        </div>
      </div>
    );
  }
}

export default ImageShow;

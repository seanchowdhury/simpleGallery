import React from 'react';
import Gallery from './gallery';

class ShowcaseCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      lastEvaluatedKey: null,
      letter: "",
      curatedImages: []
    };

    this.selectImage = this.selectImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  selectImage(image) {
    const curatedImages = this.state.curatedImages;
    curatedImages.push(image);
    this.setState({curatedImages});
  }

  deselectImage(image) {
    const curatedImages = this.state.curatedImages.filter((el) => {
      return el !== image;
    });
    this.setState({curatedImages});
  }

  handleSubmit() {
    fetch('/curate', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        letter: this.state.letter,
        curatedImages: this.state.curatedImages,
      }),
      method: 'POST'
    })
    .then(res => res.json())
    .then(res => this.setState({ url: `localhost:3000/${res}` }))
  }

  render() {
    const gallery = this.state.images.map((image, idx) => {
        let imageContainer;
        if(this.state.curatedImages.includes(image)) {
          imageContainer = <img onClick={() => this.deselectImage(image)} className="gallery-item selected-image" alt="" key={idx} src={image.imageURL} />;
        } else {
          imageContainer = <img onClick={() => this.selectImage(image)} className="gallery-item" alt="" key={idx} src={image.imageURL} />;
        }
      return imageContainer;
    });
    return (
      <div>
        {this.state.url}
        <input type="text-field"
          value={this.state.letter}
          onChange={(e) => this.setState({letter: e.currentTarget.value})}
          placeholder="write something nice"
          className="letter-form"/>
        <button onClick={this.handleSubmit} className="curate-submit">Create</button>
        <div id="gallery-container">{gallery}</div>
      </div>
    );
  }
}

export default ShowcaseCreate;

import React from 'react';
import Gallery from './gallery';
import Cookie from 'js-cookie';

class Showcase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      letter: "",
      curatedImages: []
    };
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

  render() {
    const curatedImages = this.state.curatedImages.map((image, idx) => {
      return <img alt="" key={idx} src={image.imageURL} />;
    });
    return(
      <div>
        {this.state.letter}
        {curatedImages}
        <Gallery />
      </div>
    );
  }
}

export default Showcase;

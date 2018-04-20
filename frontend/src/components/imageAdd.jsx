import React from 'react';

class ImageAdd extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  handleUpload({ file }) {
    console.log(file);
  }

  render() {
    return(
      <div>
        <input type='file' onChange={this.handleUpload}/>
      </div>
    );
  }
}

export default ImageAdd;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';

class VideoUpload extends Component {
  state = { file: null };
  onFileChange(event) {
    this.setState({ file: event.target.files[0] });
    console.log(event.target.files);
  }

  render() {
    return (
      <div>
        <h5> upload your video </h5>
        <input
          onChange={this.onFileChange.bind(this)}
          type="file"
          accept="video/*"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { formValues: state.form.blogForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(BlogFormReview));

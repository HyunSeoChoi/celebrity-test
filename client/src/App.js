import React, { Component } from "react";
import { post } from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { file: "", fileName: "", similar: "", percent: "" };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
  }

  handleFormSubmit(e) {
    e.preventDefault();

    this.handleFetch().then(response => {
      this.setState({
        similar: response.data.faces[0].celebrity.value,
        percent: response.data.faces[0].celebrity.confidence * 100
      });
    });
  }

  handleFetch() {
    const url = "/face";

    const formData = new FormData();

    formData.append("image", this.state.file);

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    return post(url, formData, config);
  }

  handleFileChange(e) {
    this.setState({
      file: e.target.files[0],

      fileName: e.target.value
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <h1>닮은꼴</h1>
          <input
            type="file"
            name="file"
            file={this.state.file}
            value={this.state.fileName}
            onChange={this.handleFileChange}
          />

          <button type="submit">보기</button>
        </form>
        {this.state.similar
          ? this.state.similar +
            "(이)라고 " +
            this.state.percent +
            "% 확신해요!"
          : null}
      </div>
    );
  }
}

export default App;

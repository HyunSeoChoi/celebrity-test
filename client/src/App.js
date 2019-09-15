import React, { Component } from "react";
import { post } from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      similar: "",
      percent: "",
      nobody: false
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
  }

  handleFormSubmit(e) {
    e.preventDefault();

    if (this.state.file !== "") {
      this.handleFetch()
        .then(response => {
          if (response.data.info.faceCount === 0) {
            this.setState({
              nobody: true,
              similar: ""
            });
          } else {
            this.setState({
              similar: response.data.faces[0].celebrity.value,
              percent: response.data.faces[0].celebrity.confidence * 100
            });
          }
        })
        .catch(error => {
          alert(error.response.data.errorMessage);
        });
    }
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
    if (typeof e.target.files[0] !== "undefined") {
      if (e.target.files[0].size > 1024 * 1024 * 2) {
        // 용량 초과시 경고후 해당 파일의 용량도 보여줌
        alert(
          "2MB 이하 파일만 등록할 수 있습니다.\n\n" +
            "현재파일 용량 : " +
            Math.round((e.target.files[0].size / 1024 / 1024) * 100) / 100 +
            "MB"
        );
      } else {
        this.setState({
          file: e.target.files[0]
        });
      }
    } else {
      this.setState({
        file: ""
      });
    }
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
            onChange={this.handleFileChange}
          />
          {this.state.file !== "" ? <button type="submit">보기</button> : null}
        </form>
        {this.state.nobody ? "닮은 사람이 없네요" : null}
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

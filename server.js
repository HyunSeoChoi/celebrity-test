const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const multer = require("multer");
const upload = multer({
  dest: "upload/",
  limits: { fileSize: 2 * 1024 * 1024 }
});
const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync("./config.json");
const conf = JSON.parse(data);

app.post("/face", upload.single("image"), (req, res) => {
  //console.log(req);
  var api_url = "https://openapi.naver.com/v1/vision/celebrity"; // 유명인 인식
  //var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

  var _formData = {
    image: "image",
    image: fs.createReadStream(__dirname + "/upload/" + req.file.filename) // FILE 이름
  };
  var _req = request
    .post({
      url: api_url,
      formData: _formData,
      headers: {
        "X-Naver-Client-Id": conf.client_id,
        "X-Naver-Client-Secret": conf.client_secret
      }
    })
    .on("response", function(response) {
      console.log(response.statusCode); // 200
      console.log(response.headers["content-type"]);
    });

  _req.pipe(res); // 브라우저로 출력
});

app.listen(port, () => console.log(`Listening on port ${port}`));

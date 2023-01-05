import React, { useState } from "react";
import { Button, Form, Input, Icon } from "antd";
import TextArea from "antd/lib/input/TextArea";
import DropZone from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage() {
  const user = useSelector((state) => state.user);

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");

  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.target.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onPrivateChange = (e) => {
    setPrivate(e.target.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();

    // const config = {
    //   header: { "content-type": "multipart/form-data" },
    // };

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    formData.append("file", files[0]);

    axios.post("/api/video/uploads", formData, config).then((response) => {
      if (response.data.success) {
        console.log(response.data);

        setFilePath(response.data.url);
      } else {
        alert("비디오 업로드를 실패했습니다.");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filepath: FilePath,
      category: Category,
    };

    axios.post("/api/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data);
      } else {
        alert("비디오 업로드를 실패했습니다.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1>Upload Video</h1>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Drop Zone */}
          <DropZone onDrop={onDrop} mutiple={false} maxSize={100000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </DropZone>

          {/* Thumbnail */}
          <div>
            <img />
          </div>
        </div>

        <br />
        <br />

        <label>Title</label>
        {/* <Input value={VideoTitle} /> */}
        <Input value={VideoTitle} onChange={onTitleChange} />

        <br />
        <br />

        <label>Description</label>
        {/* <TextArea value={Description} /> */}
        <TextArea value={Description} onChange={onDescriptionChange} />

        <br />
        <br />

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />

        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;

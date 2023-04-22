import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import Asset from "../../components/Asset";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function PostCreateForm() {
  const [errors, setErrors] = useState({});

  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [instructionInput, setInstructionInput] = useState('');

  const [postData, setPostData] = useState({
    title: "",
    image: "",
  });
  const { title, content, image } = postData;

  const imageInput = useRef(null);
  const history = useHistory();

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleAddIngredient = () => {
    let updatedIngredients = [...ingredients, ingredientInput];
    setIngredients(updatedIngredients);
  }

  const handleDeleteIngredient = (value) => {
    setIngredients((prevIngredients) => {
      return prevIngredients.filter(ingredient => ingredient !== value)
    })
  }

  const handleAddInstruction = () => {
    let updatedInstructions = [...instructions, instructionInput];
    setInstructions(updatedInstructions);
  }

  const handleDeleteInstruction = (value) => {
    setInstructions((prevInstructions) => {
      return prevInstructions.filter(instruction => instruction !== value)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("content", content);
    formData.append("instructions", instructions);
    formData.append("image", imageInput.current.files[0]);

    try {
      const { data } = await axiosReq.post("/posts/", formData);
      history.push(`/posts/${data.id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <div>
          <ul>{ingredients?.map((ingredient, index) => {
            return <li key={index} onClick={(e) => handleDeleteIngredient(ingredient)}>{ingredient}</li>
          })}
          </ul>
        </div>
        <Form.Label>Ingredients</Form.Label>
        <Form.Control
          type="text"
          name="ingredients-input"
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
        />
        <button onClick={handleAddIngredient}>Add</button>
      </Form.Group>
      <Form.Group>
        <div>
          <ul>{instructions?.map((instruction, index) => {
            return <li key={index} onClick={(e) => handleDeleteInstruction(instruction)}>{instruction}</li>
          })}
          </ul>
        </div>
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          type="text"
          name="ingredients-input"
          value={instructionInput}
          onChange={(e) => setInstructionInput(e.target.value)}
        />
        <button onClick={handleAddInstruction}>Add</button>
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        create
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={5} lg={6}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset
                    src={Upload}
                    message="Click or tap to upload an image"
                  />
                </Form.Label>
              )}

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostCreateForm;
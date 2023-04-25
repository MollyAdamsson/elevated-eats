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

  const handleAddIngredient = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let updatedIngredients = [...ingredients, ingredientInput];
    setIngredients(updatedIngredients);
    setIngredientInput("");
  }

  const handleDeleteIngredient = (e, value) => {
    e.stopPropagation();
    setIngredients((prevIngredients) => {
      return prevIngredients.filter(ingredient => ingredient !== value)
    });
  }

  const handleAddInstruction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let updatedInstructions = [...instructions, instructionInput];
    setInstructions(updatedInstructions);
    setInstructionInput("");
  }

  const handleDeleteInstruction = (e, value) => {
    e.stopPropagation();
    setInstructions((prevInstructions) => {
      return prevInstructions.filter(instruction => instruction !== value)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("ingredients", ingredients.join(';'));
    formData.append("content", content);
    formData.append("instructions", instructions.join(';'));
    formData.append("image", imageInput.current.files[0]);

    try {
      const { data } = await axiosReq.post("/posts/", formData);
      history.push(`/posts/${data.id}`);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
    return false;
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
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          name="content"
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group className="my-3">
        <div>
          <div className={styles.list}>
            {ingredients?.map((ingredient, index) => {
              return (
                <div className={styles.listItem}>
                  <span>{ingredient}</span>
                  <div tabIndex={-1} className={styles.listItemButton} onClick={(e) => handleDeleteIngredient(e, ingredient)}>X</div>
                </div>
                );
            })}
          </div>
        </div>
        <Form.Label>Ingredients</Form.Label>
        <Form.Control
          type="text"
          name="ingredients-input"
          className="my-3"
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
        />
        <button className={`${btnStyles.Button} ${btnStyles.Blue}`} onClick={(e) => handleAddIngredient(e)}>Add</button>
      </Form.Group>
      <Form.Group className="my-3">
        <div>
          <ul>{instructions?.map((instruction, index) => {
            return <li key={index} onClick={(e) => handleDeleteInstruction(e, instruction)}>{instruction}</li>
          })}
          </ul>
        </div>
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          type="text"
          name="ingredients-input"
          className="my-3"
          value={instructionInput}
          onChange={(e) => setInstructionInput(e.target.value)}
        />
        <button className={`${btnStyles.Button} ${btnStyles.Blue}`} onClick={(e) => handleAddInstruction(e)}>Add</button>
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
        <Col className="py-2 p-0 p-md-2" md={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 1 }}>
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
// import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
// import { CurrentUserProvider } from "../../contexts/CurrentUserContext";
import NavBar from "../NavBar";

test("renders NavBar", () => {
    render(
      <Router>
        <NavBar />
      </Router>,)
})
import {describe, it, expect} from "vitest";
import { render, screen } from "@testing-library/react";

import App from "../src/App";

describe('App', () => {

  it('App renders', () => {
    render(<App title='Shopping Cart'/>);

    expect(screen.getByRole('heading').textContent).toMatch('Shopping Cart')
  })



})
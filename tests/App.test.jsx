import {describe, it, expect, beforeAll, vi} from "vitest";
import { render, screen } from "@testing-library/react";

import {useRoutes, Routes, Route ,Switch, RouterProvider, MemoryRouter, LocationProvider, createMemory, createMemoryRouter, useNavigate, createBrowserRouter } from 'react-router-dom'
import App from "../src/components/App";
import Header from "../src/components/Header";
import router, { routesArr } from "../src/components/router";
import HomePage from "../src/components/FrontPage";
import { act } from "react";
import { pageLoader } from "../src/utilities/DataFetch";

describe('App tests', () => {
  
  it ('renders App', async () => {
    const testRouter = createMemoryRouter(routesArr);

    render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
        <Route path="/" element={<App />}> 
          <Route path="home" element={<HomePage />} loader={pageLoader}/>
        </Route>
        </Routes>
      </MemoryRouter>
      // <RouterProvider router={testRouter} />
    )

    screen.debug()

    const offers = await screen.findByText('SPECIAL OFFERS');
    expect(offers).toBeInTheDocument();
  })

  

})
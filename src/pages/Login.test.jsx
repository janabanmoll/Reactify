import {render,screen,fireEvent} from "@testing-library/react";
import Login from "./Login";

jest.mock("react-router-dom",()=>({
  useNavigate:()=>jest.fn()
}));

jest.mock("react-i18next",()=>({
  useTranslation:()=>({
    t:(key)=>key
  })
}));

jest.mock("../context/NotificationContext",()=>({
  useNotification:()=>({
    showNotification:jest.fn()
  })
}));

test("renders login form",()=>{
  render(<Login/>);
  expect(screen.getByRole("button",{name:"login"})).toBeInTheDocument();
});

test("shows required error when login form is submitted empty",()=>{
  render(<Login/>);
  fireEvent.click(screen.getByRole("button",{name:"login"}));
  expect(screen.getByText("usernameRequired")).toBeInTheDocument();
});
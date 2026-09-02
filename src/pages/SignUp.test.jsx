import {render,screen,fireEvent} from "@testing-library/react";
import SignUp from "./SignUp";

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

test("renders signup page",()=>{
  render(<SignUp/>);
  expect(screen.getByRole("heading",{name:"signUp"})).toBeInTheDocument();
});

test("shows required errors when signup form is submitted empty",()=>{
  render(<SignUp/>);
  fireEvent.click(screen.getByRole("button",{name:"signUp"}));
  expect(screen.getByText("usernameRequired")).toBeInTheDocument();
});
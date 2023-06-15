import React, { createContext, useContext, useReducer } from "react";
import { Children } from "./common";
// Define the state type
type UserState = {
  userID: string | null;
};

// Define the actions
type UserAction =
  | { type: "SET_USER_ID"; payload: string }
  | { type: "CLEAR_USER_ID" };

// Define the initial state
const initialState: UserState = {
  userID: localStorage.getItem("userID"),
};

// Define the reducer function
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER_ID":
      localStorage.setItem("userID", action.payload);
      return {
        ...state,
        userID: action.payload,
      };
    case "CLEAR_USER_ID":
      return {
        ...state,
        userID: null,
      };
    default:
      return state;
  }
};

// Create the context
const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

// Create the provider component
const UserProvider = ({ children }: { children: Children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user context
const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};

// // Example usage in a component
// const ExampleComponent: React.FC = () => {
//   const { state, dispatch } = useUserContext();

//   const getUserID = () => {
//     return state.userID;
//   };

//   const setUserID = (userID: string) => {
//     dispatch({ type: 'SET_USER_ID', payload: userID });
//   };

//   return (
//     <div>
//       <h1>User ID: {getUserID()}</h1>
//       <button onClick={() => setUserID('exampleID')}>Set User ID</button>
//     </div>
//   );
// };

export { UserProvider, useUserContext };

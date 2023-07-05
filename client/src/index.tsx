import ReactDOM from "react-dom/client";
import { AppProvider } from "./context/appContext";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import "./index.css";
import App from "./App";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

let httpLink = createHttpLink({
  uri: "https://twilio-sms-flax.vercel.app/graphql",
});
const authLink = setContext(() => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

httpLink = authLink.concat(httpLink);

const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://twilio-sms-flax.vercel.app/graphql",
    connectionParams: {
      reconnect: true,
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ApolloProvider>
  </>
);

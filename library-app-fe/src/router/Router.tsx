import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../layouts/HomePage/HomePage";
import { SearchBooksPage } from "../layouts/SearchBooksPage/SearchBooksPage";
import { BookCheckoutPage } from "../layouts/BookCheckoutPage/BookCheckoutPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'home', element: <HomePage /> },
            { path: 'search', element: <SearchBooksPage /> },
            { path: 'checkout/:bookId', element: <BookCheckoutPage /> },
        ]
    },
])
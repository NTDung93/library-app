import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./components/CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./components/LastestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>()
    const [isLoading, setIsLoading] = useState(true)
    const [httpError, setHttpError] = useState<string>()

    //Review State
    const [reviews, setReviews] = useState<ReviewModel[]>()
    const [totalStars, setTotalStars] = useState<number>(0)
    const [isLoadingReview, setIsLoadingReview] = useState(true)

    const [isReviewLeft, setIsReviewLeft] = useState<boolean>(false)
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true)

    //Loan count state
    const [currentLoanCount, setCurrentLoanCount] = useState<number>(0)
    const [isLoadingCurrentLoanCount, setIsLoadingCurrentLoanCount] = useState(true)

    //Is book check out
    const [isCheckedOut, setIsCheckedOut] = useState<boolean>(false)
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true)

    const bookId = window.location.pathname.split('/')[2]

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedBooks: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(loadedBooks);
            setIsLoading(false);
        }

        fetchBook().catch((err) => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchReviews = async () => {
            const baseUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.reviews;
            const loadedReviews: ReviewModel[] = []

            let weightedStarReviews: number = 0

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].book_id,
                    reviewDescription: responseData[key].reviewDescription,
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1)
                setTotalStars(Number(round))
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        }

        fetchReviews().catch((err) => {
            setIsLoadingReview(false);
            setHttpError(err.message);
        });
    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserReview = async () => {
            if (authState && authState?.isAuthenticated) {
                const baseUrl: string = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const userReviewResponse = await fetch(baseUrl, requestOptions);
                if (!userReviewResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const userReviewResponseJson = await userReviewResponse.json();
                setIsReviewLeft(userReviewResponseJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReview().catch((err) => {
            setIsLoadingUserReview(false);
            setHttpError(err.message);
        });
    }, [authState]);

    useEffect(() => {
        const fetchUserCurrentLoanCount = async () => {
            if (authState && authState?.isAuthenticated) {
                const baseUrl: string = `http://localhost:8080/api/books/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const currentLoanCountResponse = await fetch(baseUrl, requestOptions);
                if (!currentLoanCountResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const currentLoanCountResponseJson = await currentLoanCountResponse.json();
                setCurrentLoanCount(currentLoanCountResponseJson);
            }
            setIsLoadingCurrentLoanCount(false);
        }
        fetchUserCurrentLoanCount().catch((err) => {
            setIsLoadingCurrentLoanCount(false);
            setHttpError(err.message);
        });
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState?.isAuthenticated) {
                const baseUrl: string = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const bookCheckedOutResponse = await fetch(baseUrl, requestOptions);
                if (!bookCheckedOutResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const bookCheckedOutResponseJson = await bookCheckedOutResponse.json();
                setIsCheckedOut(bookCheckedOutResponseJson);
            }
            setIsLoadingBookCheckedOut(false);
        }
        fetchUserCheckedOutBook().catch((err) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(err.message);
        });
    }, [authState]);

    if (isLoading || isLoadingReview || isLoadingCurrentLoanCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutBook() {
        const baseUrl: string = `http://localhost:8080/api/books/secure/checkout?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        const checkoutResponse = await fetch(baseUrl, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCheckedOut(true);
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = 'http://localhost:8080/api/reviews/secure';
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        }
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoanCount}
                        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft} submitReview={submitReview} />
                </div>
                <hr />
                <LatestReviews reviews={reviews!} bookId={book?.id} mobile={false} />
            </div>
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center alighn-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoanCount}
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                    isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                <hr />
                <LatestReviews reviews={reviews!} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}
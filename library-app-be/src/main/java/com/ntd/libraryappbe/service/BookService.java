package com.ntd.libraryappbe.service;

import com.ntd.libraryappbe.dao.BookRepository;
import com.ntd.libraryappbe.dao.CheckoutRepository;
import com.ntd.libraryappbe.dao.HistoryRepository;
import com.ntd.libraryappbe.dao.PaymentRepository;
import com.ntd.libraryappbe.entity.Book;
import com.ntd.libraryappbe.entity.Checkout;
import com.ntd.libraryappbe.entity.History;
import com.ntd.libraryappbe.entity.Payment;
import com.ntd.libraryappbe.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {
    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
    private HistoryRepository historyRepository;
    private PaymentRepository paymentRepository;

    @Autowired
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository,
                       HistoryRepository historyRepository, PaymentRepository paymentRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book does not exist or already checked out");
        }

        List<Checkout> currentBooksCheckedOut = checkoutRepository.findBooksCheckedOutByUserEmail(userEmail);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        boolean bookNeedsReturned = false;

        for (Checkout checkout : currentBooksCheckedOut) {
            Date d1 = sdf.parse(checkout.getReturnDate());
            Date d2 = sdf.parse(LocalDate.now().toString());

            if (d1.compareTo(d2) < 0) {
                bookNeedsReturned = true;
                break;
            }
        }

        Payment userPayment = paymentRepository.findByUserEmail(userEmail);

        if ((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && bookNeedsReturned)) {
            throw new Exception("Outstanding userPayment or book needs returned");
        }

        if (userPayment == null) {
            Payment newPayment = new Payment();
            newPayment.setUserEmail(userEmail);
            newPayment.setAmount(0);
            paymentRepository.save(newPayment);
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                bookId
        );

        checkoutRepository.save(checkout);

        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail, Long bookId) throws Exception {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndAndBookId(userEmail, bookId);

        if (validateCheckout != null) {
            return true;
        } else {
            return false;
        }
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksCheckedOutByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        //all checkout made by user
        List<Checkout> checkoutList = checkoutRepository.findBooksCheckedOutByUserEmail(userEmail);

        //list ids of books checked out by user
        List<Long> bookIdsList = new ArrayList<>();
        for (Checkout checkout : checkoutList) {
            bookIdsList.add(checkout.getBookId());
        }

        //books checked out by user
        List<Book> books = bookRepository.findBooksByBookIds(bookIdsList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book : books) {
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(c -> c.getBookId() == book.getId()).findFirst();

            if (checkout.isPresent()) {
                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit timeUnit = TimeUnit.DAYS;
                long diff = timeUnit.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) diff));
            }
        }

        return shelfCurrentLoansResponses;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;

        double diff = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

        if (diff < 0){
            Payment userPayment = paymentRepository.findByUserEmail(userEmail);
            userPayment.setAmount(userPayment.getAmount() + Math.abs(diff));
            paymentRepository.save(userPayment);
        }

        checkoutRepository.delete(validateCheckout);

        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg()
        );

        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndAndBookId(userEmail, bookId);

        if (validateCheckout == null) {
            throw new Exception("Book does not exist or already checked out");
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }
}

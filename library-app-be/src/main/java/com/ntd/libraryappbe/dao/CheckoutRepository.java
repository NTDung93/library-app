package com.ntd.libraryappbe.dao;

import com.ntd.libraryappbe.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Checkout findByUserEmailAndAndBookId(String userEmail, Long bookId);

    List<Checkout> findBooksCheckedOutByUserEmail(String userEmail);

    @Modifying
    @Query("delete from Checkout where bookId in :book_id")
    void deleteAllByBookId (@Param("book_id") Long bookId);
}

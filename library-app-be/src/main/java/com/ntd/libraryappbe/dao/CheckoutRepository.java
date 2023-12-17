package com.ntd.libraryappbe.dao;

import com.ntd.libraryappbe.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Checkout findByUserEmailAndAndBookId(String userEmail, Long bookId);

    List<Checkout> findBooksCheckedOutByUserEmail(String userEmail);
}

package com.ntd.libraryappbe.dao;

import com.ntd.libraryappbe.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByUserEmail(@RequestParam("userEmail") String userEmail);
}

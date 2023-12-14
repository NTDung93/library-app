package com.ntd.libraryappbe.dao;

import com.ntd.libraryappbe.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}

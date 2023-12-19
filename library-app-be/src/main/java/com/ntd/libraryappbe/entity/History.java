package com.ntd.libraryappbe.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@Table(name = "history")
@NoArgsConstructor
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "checkout_date")
    private String checkoutDate;

    @Column(name = "returned_date")
    private String returnedDate;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "description")
    private String description;

    @Column(name = "img")
    private String img;

    public History(String userEmail, String checkoutDate, String returnDate, String title, String author, String description, String img) {
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnDate;
        this.title = title;
        this.author = author;
        this.description = description;
        this.img = img;
    }
}

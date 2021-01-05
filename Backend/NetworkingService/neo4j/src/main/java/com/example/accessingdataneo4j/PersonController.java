package com.example.accessingdataneo4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping (value = "/neo4j")
public class PersonController {
    GraphDBTransactions transaction = new GraphDBTransactions();

    @GetMapping("/allPersons")
    public List<Person> getPersons(){
        return transaction.getAllPersons();
    }

    @GetMapping("/{id}")
    public Person getPersonById(@PathVariable int id){
        return transaction.getPersonById(id);
    }

    @PostMapping("/createPerson/{1}/{2}")
    public ResponseEntity createPerson(@PathVariable("1") final int id, @PathVariable("2") final String name){
        transaction.create(id, name);
        return ResponseEntity.ok(transaction.getPersonById(id));
    }

    @DeleteMapping("/deletePerson/{1}")
    public ResponseEntity deletePerson(@PathVariable("1") final int id){
        transaction.delete(id);
        if(!transaction.personExists(id)) return ResponseEntity.ok("ID " + id + " deleted.");
        return getBadRequestResponseEntity(id);
    }

    @DeleteMapping("/emptyDB")
    public ResponseEntity deleteAllEntries(){
        transaction.emptyDB();
        if(transaction.getLastId() == -1) return ResponseEntity.ok("All entries were deleted.");
        return ResponseEntity.badRequest().build();
    }

    private ResponseEntity getBadRequestResponseEntity(final int id) {
        return new ResponseEntity(
                HttpStatus.BAD_REQUEST + " - " + id,
                HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/follow/{1}/{2}")
    public ResponseEntity follow(@PathVariable("1") int id1, @PathVariable("2") int id2){
        transaction.follows(id1, id2);
        return ResponseEntity.ok(transaction.getPersonById(id1));
    }

    @DeleteMapping("/deleteFollow/{1}/{2}")
    public ResponseEntity deleteFollow(@PathVariable("1") int id1, @PathVariable("2") int id2){
        transaction.deleteFollows(id1, id2);
        return ResponseEntity.ok(transaction.getPersonById(id1));
    }
}
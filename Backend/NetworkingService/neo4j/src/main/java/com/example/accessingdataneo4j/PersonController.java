package com.example.accessingdataneo4j;

import com.fasterxml.jackson.databind.JsonNode;
import org.json.JSONException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping (value = "/neo4j")
public class PersonController {
    GraphDBTransactions transaction = new GraphDBTransactions();

    /**
     * example payload create
     *
     *{ "delete person":
     *     [
     *         {"id":"50",
     *         "name":"Testuser"}
     *     ]
     * }
     *
     */
    @PostMapping("/createPerson")
    public ResponseEntity createPerson(@RequestBody JsonNode payload) throws JSONException {
        transaction.create(payload);
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/createPerson/{1}/{2}")
    public ResponseEntity createPerson(@PathVariable("1") final int id, @PathVariable("2") final String name){
        transaction.create(id, name);
        return ResponseEntity.ok(transaction.getPersonById(id));
    }



    /**
     * example payload follow
     *
     * { "following":
     *     [
     *         {"id_from":"5",
     *         "name_from":"Franz",
     *         "id_to":"6",
     *         "name_to":"Sepp"}
     *     ]
     * }
     *
     */
    @PostMapping("/follow")
    public ResponseEntity follow(@RequestBody JsonNode payload) throws JSONException {
        transaction.follow(payload);
        return ResponseEntity.ok("Following generated.");
    }

    @PostMapping("/followById/{1}/{2}")
    public ResponseEntity follow(@PathVariable("1") int id1, @PathVariable("2") int id2) {
        transaction.follow(id1, id2);
        return ResponseEntity.ok("{}");
    }



    /**
     * example payload unfollow
     *
     * { "unfollowing":
     *     [
     *         {"id_from":"5",
     *         "name_from":"Franz",
     *         "id_to":"6",
     *         "name_to":"Sepp"}
     *     ]
     * }
     *
     */
    @DeleteMapping("/unfollow")
    public ResponseEntity unfollow(@RequestBody JsonNode payload) throws JSONException {
        transaction.unfollow(payload);
        return ResponseEntity.ok("Unfollowing done.");
    }

    @DeleteMapping("/unfollowById/{1}/{2}")
    public ResponseEntity unfollow(@PathVariable("1") int id1, @PathVariable("2") int id2){
        transaction.unfollow(id1, id2);
        return ResponseEntity.ok(transaction.getPersonById(id1));
    }



    /**
     * example payload delete
     *
     *{ "delete person":
     *     [
     *         {"id":"50",
     *         "name":"Testuser"}
     *     ]
     * }
     *
     */
    @DeleteMapping("/deletePerson")
    public ResponseEntity deletePerson(@RequestBody JsonNode payload) throws JSONException {
        transaction.delete(payload);
        return ResponseEntity.ok(payload);
    }

    @DeleteMapping("/deletePersonById/{1}")
    public ResponseEntity deletePersonById(@PathVariable("1") final int id){
        transaction.delete(id);
        if(!transaction.personExists(id)) return ResponseEntity.ok("{}");
        return getBadRequestResponseEntity(id);
    }



    @DeleteMapping("/emptyDB")
    public ResponseEntity deleteAllEntries(){
        transaction.emptyDB();
        if(transaction.getLastId() == -1) return ResponseEntity.ok("All entries were deleted.");
        return ResponseEntity.badRequest().build();
    }



    @GetMapping("/allPersons")
    public List<Person> getPersons(){
        return transaction.getAllPersons();
    }



    @GetMapping("/{id}")
    public Person getPersonById(@PathVariable int id){
        return transaction.getPersonById(id);
    }



    private ResponseEntity getBadRequestResponseEntity(final int id) {
        return new ResponseEntity(
                HttpStatus.BAD_REQUEST + " - " + id,
                HttpStatus.BAD_REQUEST);
    }
}
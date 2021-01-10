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
     * example payload create person
     *
     *{ "createPerson":
     *     [
     *         {"id":"50",
     *         "name":"Testuser"}
     *     ]
     * }
     *
     */

    /**
     * example payload create HASHTAG
     *
     *{ "createPerson":
     *     [
     *         {"id":"50",
     *         "name":"#testhashtag"}
     *     ]
     * }
     *
     */
    @PostMapping("/createPerson")
    public ResponseEntity createPerson(@RequestBody JsonNode payload) throws JSONException {
        if(transaction.isHashtag(payload)){
            if(transaction.hashtagExists(transaction.getNameOfHashtag(payload)) || transaction.personExists(transaction.getIdOfPayload(payload))){
                return getBadRequestResponseEntity("{\"message\":\"ID or Hashtag already exist.\"}");
            }else{
                transaction.create(payload);
                return ResponseEntity.ok("{ \"message\": \" Hashtag "+ transaction.getNameOfHashtag(payload) +" created\"}");
            }
        }

        if(!transaction.personExists(transaction.getIdOfPayload(payload))){
            transaction.create(payload);
            return ResponseEntity.ok("{ \"message\": \" user "+ transaction.getIdOfPayload(payload) +" created\"}");
        }
        return getBadRequestResponseEntity("{\"message\":\"ID already exists.\"}");
    }

    @PostMapping("/createPerson/{1}/{2}")
    public ResponseEntity createPerson(@PathVariable("1") final int id, @PathVariable("2") final String name){
        transaction.create(id, name);
        return ResponseEntity.ok(transaction.getPersonById(id));
    }



    /**
     * example payload follow
     *
     * { ".follow":
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
        if(transaction.personExists(transaction.getIdOfPayload(payload))){
            transaction.follow(payload);
            return ResponseEntity.ok("{ Following generated " + payload +"}");
        }
        return getBadRequestResponseEntity("{\"message\":\"One of these IDs does not exist.\"}");
    }

    @PostMapping("/followById/{1}/{2}")
    public ResponseEntity follow(@PathVariable("1") int id1, @PathVariable("2") int id2) {
        transaction.follow(id1, id2);
        return ResponseEntity.ok("{ \"message\": \""+id1 + " follows " + id2 + "\"}");
    }



    /**
     * example payload unfollow
     *
     * { ".unfollow":
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
        if(transaction.personExists(transaction.getIdOfPayload(payload))){
            transaction.unfollow(payload);
            return ResponseEntity.ok("{\"message\":\"Unfollowing done.\"}");
        }
        return getBadRequestResponseEntity("{\"message\":\"One of these IDs does not exist.\"}");
    }

    @DeleteMapping("/unfollowById/{1}/{2}")
    public ResponseEntity unfollow(@PathVariable("1") int id1, @PathVariable("2") int id2){
        transaction.unfollow(id1, id2);
        return ResponseEntity.ok(transaction.getPersonById(id1));
    }



    /**
     * example payload update
     *
     * { "updateperson":
     *     [
     *         {"id_pre":"5",
     *         "name_pre":"Franz",
     *         "name_post":"Franzi"}
     *     ]
     * }
     *
     */
    @PatchMapping("/updatePerson")
    public ResponseEntity update(@RequestBody JsonNode payload) throws JSONException {
        if(transaction.personExists(transaction.getIdOfPayload(payload))){
            transaction.update(payload);
            return ResponseEntity.ok("UPDATED: " + payload);
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }



    /**
     * example payload delete
     *
     *{ "deleteperson":
     *     [
     *         {"id":"50",
     *         "name":"Testuser"}
     *     ]
     * }
     *
     */
    @DeleteMapping("/deletePerson")
    public ResponseEntity deletePerson(@RequestBody JsonNode payload) throws JSONException {
        if(transaction.personExists(transaction.getIdOfPayload(payload))){
            transaction.delete(payload);
            return ResponseEntity.ok("DELETED: " + payload);
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }

    @DeleteMapping("/deletePersonById/{1}")
    public ResponseEntity deletePersonById(@PathVariable("1") final int id){
        transaction.delete(id);
        if(!transaction.personExists(id)) return ResponseEntity.ok("{\"message\": \"ID " + id + "\" deleted.\"}");
        return getBadRequestResponseEntity("");
    }

    /**
     * example payload subscriptions
     *
     *{ "subscriptions":
     *     [
     *         {"id":"50",
     *         "name":"Testuser"}
     *     ]
     * }
     *
     */
    @GetMapping("/subscriptions")
    public ResponseEntity getMySubs(@RequestBody JsonNode payload) throws JSONException {
        if(transaction.personExists(transaction.getIdOfPayload(payload))){
            if(transaction.getSubscriptions(transaction.getIdOfPayload(payload)).isEmpty()){
                return getBadRequestResponseEntity("{[]}");
            }
            return ResponseEntity.ok("My subscriptions: " +
                    transaction.getSubscriptions(transaction.getIdOfPayload(payload)).toString());
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }

    @GetMapping("/subscriptions/{1}")
    public ResponseEntity getMySubsById(@PathVariable("1") final int id){
        if(transaction.personExists(id)){
            if(transaction.getSubscriptions(id).isEmpty()){
                return getBadRequestResponseEntity("{[]}");
            }
            return ResponseEntity.ok("My subscriptions: " +
                    transaction.getSubscriptions(id).toString());
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }



    /**
     * example payload follower
     *
     *{ "follower":
     *     [
     *         {"id":"50",
     *         "name":"Testuser"}
     *     ]
     * }
     *
     */
    @GetMapping("/follower")
    public ResponseEntity getMyFollower(@RequestBody JsonNode payload) throws JSONException {
        if(transaction.personExists(transaction.getIdOfPayload(payload))){
            if(transaction.getFollowers(transaction.getIdOfPayload(payload)).isEmpty()){
                return getBadRequestResponseEntity("{[]}");
            }
            return ResponseEntity.ok("{ My followers: " +
                    transaction.getFollowers(transaction.getIdOfPayload(payload)).toString() + "}");
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }

    @GetMapping("/follower/{1}")
    public ResponseEntity getMyFollower(@PathVariable("1") final int id){
        if(transaction.personExists(id)){
            if(transaction.getFollowers(id).isEmpty()){
                return getBadRequestResponseEntity("{[]}");
            }
            return ResponseEntity.ok("{ My followers: " +
                    transaction.getFollowers(id).toString() + "}");
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }


    @DeleteMapping("/emptyDB")
    public ResponseEntity deleteAllEntries(){
        transaction.emptyDB();
        if(transaction.getLastId() == -1) return ResponseEntity.ok("{\"message\":\"All entries were deleted.\"}");
        return ResponseEntity.badRequest().build();
    }



    @GetMapping("/allPersons")
    public List<Person> getPersons(){
        return transaction.getAllPersons();
    }


    @GetMapping("/{id}")
    public ResponseEntity getPersonById(@PathVariable int id){
        if(transaction.personExists(id)) {
            return ResponseEntity.ok(transaction.getPersonById(id));
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }

    private ResponseEntity getBadRequestResponseEntity(final String errorMessage) {
        return new ResponseEntity(
                HttpStatus.BAD_REQUEST + " - " + errorMessage,
                HttpStatus.BAD_REQUEST);
    }
}
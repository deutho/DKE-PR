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
     *         "name":"test user"}
     *     ]
     * }
     *
     */
    @PostMapping("/createPerson")
    public ResponseEntity createPerson(@RequestBody JsonNode payload) throws JSONException {

        //optional kann hier auch ein hashtag erstellt werden mit dieser methode
        //allerdings erscheinen diese dann auch in der Farbe der Personen in der neo4j database
        //besser man erstellt hashtags über createHashtag, falls es nicht zu viel aufwand bedeutet

        if(transaction.isHashtag(payload)){
            if(transaction.hashtagExists(transaction.getNameOfHashtag(payload)) || transaction.personExists(transaction.getIdOfPayload(payload))){
                return getBadRequestResponseEntity("{\"message\":\"ID already exist.\"}");
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
        if(transaction.personExists(id)){
            return getBadRequestResponseEntity("{\"message\":\"ID already exists.\"}");
        }
        transaction.create(id, name);
        return ResponseEntity.ok("{ \"message\": \" user "+ id +" created\"}");
    }

    /**
     * example payload create hashtag
     *
     *{ "createHashtag":
     *     [
     *         {"id":"#testhashtag"}
     *     ]
     * }
     *
     */
    //muss ohne dem Hashtag-Symbol (#) erstellt werden, da eine URI kein #-Symbol
    // beinhalten darf, das bei followHashtag notwendig ist
    @PostMapping("/createHashtag")
    public ResponseEntity createHashtag(@RequestBody JsonNode payload) throws JSONException {
//        if(!transaction.isHashtag(payload)){
//            return getBadRequestResponseEntity("{\"message\":\"No # detected.\"}");
//        }else{
            if(transaction.hashtagExists(transaction.getHashtagId(payload))){
                return ResponseEntity.ok("{\"message\":\"Hashtag already exist.\"}");
            }else{
                transaction.createHashtag(payload);
                return ResponseEntity.ok("{ \"message\": \" Hashtag "+ transaction.getHashtagId(payload) +" created\"}");
            }
//        }
    }

    @PostMapping("/createHashtag/{1}")
    public ResponseEntity createHashtag(@PathVariable("1") final String id) {
        if(transaction.hashtagExists(id)) {
            return ResponseEntity.ok("{\"message\":\"Hashtag already exist.\"}");
        }
            transaction.createHashtag(id);
            return ResponseEntity.ok("{ \"message\": \" Hashtag " + id + " created\"}");
    }


    /**
     * example payload follow
     *
     * { ".follow":
     *     [
     *         {"id_from":"5",
     *         "id_to":"6"}
     *     ]
     * }
     *
     */
    @PostMapping("/follow")
    public ResponseEntity followPerson(@RequestBody JsonNode payload) throws JSONException {
        if(!transaction.personExists(transaction.getIdOfPayload(payload))){
            return getBadRequestResponseEntity("{\"message\":\"One of these IDs does not exist.\"}");
        }
        transaction.follow(payload);
        return ResponseEntity.ok("{ Following generated " + payload +"}");
    }

    @PostMapping("/followById/{1}/{2}")
    public ResponseEntity followPersonById(@PathVariable("1") int id1, @PathVariable("2") int id2) {
        if(!transaction.personExists(id1)){
            return getBadRequestResponseEntity("{\"message\":\"ID " + id1 + " does not exist.\"}");
        }
        if(!transaction.personExists(id2)){
            return getBadRequestResponseEntity("{\"message\":\"ID " + id2 + " does not exist.\"}");
        }

        transaction.followPerson(id1, id2);
        return ResponseEntity.ok("{ \"message\": \""+id1 + " follows " + id2 + "\"}");
    }


    /**
     * example follow hashtag http://localhost:8083/neo4j/followById/5/austria
     */
    @PostMapping("/followHashtag/{1}/{2}")
    public ResponseEntity followHashtagById(@PathVariable("1") int id1, @PathVariable("2") String id2) {
        if(!transaction.personExists(id1)){
            return getBadRequestResponseEntity("{\"message\":\"ID " + id1 + " does not exist.\"}");
        }
        if(!transaction.hashtagExists(id2)){
            return getBadRequestResponseEntity("{\"message\":\"ID " + id2 + " does not exist.\"}");
        }

        transaction.followHashtag(id1, id2);
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
        if(!transaction.personExists(id1)){
            return getBadRequestResponseEntity("{\"message\":\"ID " + id1 + " does not exist.\"}");
        }
        if(!transaction.personExists(id2)){
            return getBadRequestResponseEntity("{\"message\":\"ID " + id2 + " does not exist.\"}");
        }

        transaction.unfollowPerson(id1, id2);
        return ResponseEntity.ok("{\"message\":\"Unfollowing done.\"}");
    }

    @DeleteMapping("/unfollowHashtag/{1}/{2}")
    public ResponseEntity unfollow(@PathVariable("1") int id1, @PathVariable("2") String id2){
        if(!transaction.personExists(id1)){
            return getBadRequestResponseEntity("{\"message\":\"ID " + id1 + " does not exist.\"}");
        }
        if(!transaction.hashtagExists(id2)){
            return getBadRequestResponseEntity("{\"message\":\"ID " + id2 + " does not exist.\"}");
        }

        transaction.unfollowHashtag(id1, id2);
        return ResponseEntity.ok("{\"message\":\"Unfollowing done.\"}");
    }



    /**
     * example payload update
     *
     * { "updatePerson":
     *     [
     *         {"id_pre":"5",
     *         "new_name":"Franzerl"}
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
     *{ "deletePerson":
     *     [
     *         {"id":"50"}
     *     ]
     * }
     *
     */
    @DeleteMapping("/deletePerson")
    public ResponseEntity deletePerson(@RequestBody JsonNode payload) throws JSONException {
        if(transaction.personExists(transaction.getIdOfPayload(payload))){
            transaction.delete(payload);
            return ResponseEntity.ok("{\"message\":\"" + payload + " deleted.\"}");
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }

    @DeleteMapping("/deletePersonById/{1}")
    public ResponseEntity deletePersonById(@PathVariable("1") final int id){
        if(transaction.personExists(id)){
            transaction.delete(id);
            return ResponseEntity.ok("{\"message\":\" id " + id + " deleted.\"}");
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
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
                return ResponseEntity.ok("{\"subscriptions\": [] }");
            }
            return ResponseEntity.ok("{\"subscriptions\": " +
                            transaction.getSubscriptions(transaction.getIdOfPayload(payload)).toString() + "}");
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }

    @GetMapping("/subscriptions/{1}")
    public ResponseEntity getMySubsById(@PathVariable("1") final int id){
        if(transaction.personExists(id)){
            if(transaction.getSubscriptions(id).isEmpty()){
                return ResponseEntity.ok("{\"subscriptions\": [] }");
            }
            return ResponseEntity.ok("{\"subscriptions\": " +
                    transaction.getSubscriptions(id).toString() + "}");
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }

    @GetMapping("/subscribedHashtags/{1}")
    public ResponseEntity getMySubscribedHashtags(@PathVariable("1") final int id){
        if(transaction.personExists(id)){
            if(transaction.getSubscribedHashtags(id).isEmpty()){
                return ResponseEntity.ok("{\"subscriptions\": [] }");
            }
            return ResponseEntity.ok("{\"subscriptions\": " +
                    transaction.getSubscribedHashtags(id).toString() + "}");
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }



    /**
     * example payload follower
     *
     *{ "follower":
     *     [
     *         {"id":"5"}
     *     ]
     * }
     *
     */
    @GetMapping("/follower")
    public ResponseEntity getMyFollower(@RequestBody JsonNode payload) throws JSONException {
        if(transaction.personExists(transaction.getIdOfPayload(payload))){
            if(transaction.getFollowers(transaction.getIdOfPayload(payload)).isEmpty()){
                return ResponseEntity.ok("{[]}");
            }
            return ResponseEntity.ok("{\"followers\": " +
                    transaction.getFollowers(transaction.getIdOfPayload(payload)).toString() + "\"}");
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }

    @GetMapping("/follower/{1}")
    public ResponseEntity getMyFollower(@PathVariable("1") final int id){
        if(transaction.personExists(id)){
            if(transaction.getFollowers(id).isEmpty()){
                return ResponseEntity.ok("{\"followers\": []}");
            }
            return ResponseEntity.ok("{\"followers\": " +
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

    @GetMapping("/allHashtags")
    public List<Hashtag> getHashtags(){
        return transaction.getAllHashtags();
    }

    @GetMapping("/{id}")
    public ResponseEntity getPersonById(@PathVariable int id){
        if(transaction.personExists(id)) {
            return ResponseEntity.ok(transaction.getPersonById(id));
        }
        return getBadRequestResponseEntity("{\"message\":\"ID does not exist.\"}");
    }

    private ResponseEntity getBadRequestResponseEntity(final String errorMessage) {
        return new ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST);
    }
}
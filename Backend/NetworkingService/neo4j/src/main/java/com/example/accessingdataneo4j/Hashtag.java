package com.example.accessingdataneo4j;

public class Hashtag {

    private String id_hashtag;

    Hashtag() {
        // Empty constructor required as of Neo4j API 2.0.5
    };

    public Hashtag(String id_hashtag){
        this.id_hashtag = id_hashtag;
    }

    public String getId_hashtag() {
        return id_hashtag;
    }
}

package com.example.accessingdataneo4j;

import com.fasterxml.jackson.databind.JsonNode;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.neo4j.driver.*;

import java.util.ArrayList;
import java.util.List;
import static org.neo4j.driver.Values.parameters;

public class GraphDBTransactions implements AutoCloseable{

    private static final String URI = "bolt://localhost:7687";
    private static final String USER = "neo4j";
    private static final String PASSWORD = "secret";
    private final Driver driver = GraphDatabase.driver( URI, AuthTokens.basic( USER, PASSWORD ) );

    @Override
    public void close() {
        driver.close();
    }

    //CREATE TRANSACTIONS
    //===================================================================================================
    // CREATE a new person by json input
    public Person create(JsonNode json) throws JSONException {
        String jsonStr = json.toString();
        JSONObject obj = new JSONObject(jsonStr);
        JSONArray arr = obj.getJSONArray("create person");

        int id = -1;
        String name = "";
        for (int i = 0; i < arr.length(); i++) {
            id = arr.getJSONObject(i).getInt("id");
            name = arr.getJSONObject(i).getString("name");
        }
        Person p;
        try ( Session session = driver.session() )
        {
            String finalName = name;
            int finalId = id;
            p = session.writeTransaction(new TransactionWork<Person>()
            {
                @Override
                public Person execute( Transaction tx )
                {
                    Result result = tx.run( "CREATE (a:Person) " +
                                    "SET a.id = $id, a.name = $name " +
                                    "RETURN a.id, a.name + ', from node ' + id(a)",
                            parameters( "name", finalName, "id", finalId) );
                    return (new Person(finalId, finalName, null));
                }
            });
        }
        return p;
    }

    // CREATE a new person by id and name as input parameters
    public Person create(int id, String name)
    {
        Person p;
        try ( Session session = driver.session() )
        {
            p = session.writeTransaction( new TransactionWork<Person>()
            {
                @Override
                public Person execute( Transaction tx )
                {
                    Result result = tx.run( "CREATE (a:Person) " +
                                    "SET a.id = $id, a.name = $name " +
                                    "RETURN a.id, a.name + ', from node ' + id(a)",
                            parameters( "name", name , "id", id) );
                    return (new Person(id, name, null));
                }
            });
        }
        return p;
    }

    //FOLLOW TRANSACTIONS
    //=================================================================================================
    // FOLLOWING by json input
    public void follow(JsonNode json) throws JSONException {
        String jsonStr = json.toString();
        JSONObject obj = new JSONObject(jsonStr);
        JSONArray arr = obj.getJSONArray(".follow");

        int id_from = -1;
        int id_to = -1;
        for (int i = 0; i < arr.length(); i++) {
            id_from = arr.getJSONObject(i).getInt("id_from");
            id_to = arr.getJSONObject(i).getInt("id_to");
        }

        try ( Session session = driver.session()){
            int finalId_from = id_from;
            int finalId_to = id_to;
            String person = session.writeTransaction(new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (a:Person {id: $id_from}) " +
                                    "MATCH (b:Person {id: $id_to}) " +
                                    "MERGE (a)-[:FOLLOWS]->(b)",
                            parameters( "id_from", finalId_from, "id_to", finalId_to) );
                    return "ok";
                }
            } );
        }
    }

    // FOLLOWING by their IDs as input
    public void follow(int id1, int id2)
    {
        try ( Session session = driver.session() )
        {
            String person = session.writeTransaction( new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (a:Person {id: $id1}) " +
                                    "MATCH (b:Person {id: $id2}) " +
                                    "MERGE (a)-[:FOLLOWS]->(b)",
                            parameters( "id1", id1, "id2", id2 ) );
                    return "ok";
                }
            } );
            System.out.println(id1 + " follows " + id2);
        }
    }

    // UNFOLLOWING by json input
    public void unfollow(JsonNode json) throws JSONException {
        String jsonStr = json.toString();
        JSONObject obj = new JSONObject(jsonStr);
        JSONArray arr = obj.getJSONArray(".unfollow");

        int id_from = -1;
        int id_to = -1;
        for (int i = 0; i < arr.length(); i++) {
            id_from = arr.getJSONObject(i).getInt("id_from");
            id_to = arr.getJSONObject(i).getInt("id_to");
        }

        try ( Session session = driver.session() )
        {
            int finalId_from = id_from;
            int finalId_to = id_to;
            String person = session.writeTransaction(new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (a:Person {id: $id_from})-[f:FOLLOWS]-(b:Person {id: $id_to})" +
                                    "DELETE f",
                            parameters( "id_from", finalId_from, "id_to", finalId_to) );
                    return "ok";
                }
            } );
        }
    }

    // UNFOLLOWING by IDs as input
    public void unfollow(int id1, int id2)
    {
        try ( Session session = driver.session() )
        {
            String person = session.writeTransaction( new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (a:Person {id: $id1})-[f:FOLLOWS]-(b:Person {id: $id2})" +
                                    "DELETE f",
                            parameters( "id1", id1, "id2", id2 ) );
                    return "ok";
                }
            } );
        }
    }

    //READ TRANSACTIONS
    //======================================================================================================
    //GET all persons of database
    public List<Person> getAllPersons(){
        Session session = driver.session();
        List<Person> allPersons = new ArrayList<>();
        allPersons = session.readTransaction(new TransactionWork<List<Person>>(){
                @Override
                public List<Person> execute(Transaction tx)
                {
                    List<Person> persons = new ArrayList<Person>();
                    Result result = tx.run(  "MATCH (p:Person)" +
                                                    "OPTIONAL MATCH (p)-[r:FOLLOWS]->(p2:Person)" +
                                                    "RETURN p.id, p.name, collect(p2.id) as follows");
                        while (result.hasNext()){
                            Record r = result.next();
                            int id = r.get("p.id").asInt();
                            String name = r.get("p.name").asString();
                            List follows = r.get("follows").asList();
                            ArrayList<String> followsPerson = new ArrayList<>();

                            for(Object f : follows){
                                followsPerson.add(follows.toString());
                            }
                            persons.add(new Person(id, name, follows));
                         }
                        return persons;
                 }
        });
        return allPersons;
    }

    //GET a person by id
    public Person getPersonById(int id){
        Session session = driver.session();
        Person personById;
        personById = session.readTransaction(new TransactionWork<Person>(){
            @Override
            public Person execute(Transaction tx)
            {
                Result result = tx.run(  "MATCH (p:Person { id: $id })" +
                        "OPTIONAL MATCH (p)-[r:FOLLOWS]->(p2:Person)" +
                        "RETURN p.id, p.name, collect(p2.id) as follows",
                parameters( "id", id));

                Record r = result.next();
                int id;
                String name;
                List follows = null;

                if(r.size()==0){
                    id = -1;
                    name = "null";
                }else{
                    id = r.get("p.id").asInt();
                    name = r.get("p.name").asString();
                    follows = r.get("follows").asList();
                    ArrayList<String> followsPerson = new ArrayList<>();

                    for(Object f : follows){
                        followsPerson.add(follows.toString());
                    }
                }
                return (new Person(id, name, follows));
            }
        });
        return personById;
    }

    //GET true/false if person exists in database
    public boolean personExists(int id){
        Session session = driver.session();
        boolean exist;
        exist = session.readTransaction(new TransactionWork<Boolean>(){
            @Override
            public Boolean execute(Transaction tx)
            {
                Result result = tx.run(  "MATCH (p:Person { id: $id })" +
                                "OPTIONAL MATCH (p)-[r:FOLLOWS]->(p2:Person)" +
                                "RETURN p.id, p.name, collect(p2.id) as follows",
                        parameters( "id", id));

                boolean exist;
               if(!result.hasNext()){
                   exist = false;
               }else{
                   exist = true;
               }
                return exist;
            }
        });
        return exist;
    }

    //GET the last Id of the database
    public Integer getLastId(){
        int id;
        try ( Session session = driver.session() )
        {
            id = session.readTransaction( new TransactionWork<Integer>()
            {
                @Override
                public Integer execute(Transaction tx )
                {
                    Result result = tx.run( " MATCH (n:Person) RETURN n.id ORDER BY n.id DESC LIMIT 1");

                    if(result.hasNext()){
                        Record r = result.single();
                        return r.get("n.id").asInt();
                    }
                    return -1;
                }
            } );
        }
        return id;
    }

    //GET all subscriptions of a person (all persons who were followed by this person)
    public List<String> getSubscriptions(int id){
        Session session = driver.session();
        List<String> allPersons;
        allPersons = session.readTransaction(new TransactionWork<List<String>>(){
            @Override
            public List<String> execute(Transaction tx)
            {
                ArrayList<String> followsPerson = new ArrayList<>();
                Result result = tx.run(  "MATCH (p:Person { id: $id })" +
                        "OPTIONAL MATCH (p)-[r:FOLLOWS]->(p2:Person)" +
                        "RETURN p.id, p.name, collect(p2.id) as follows",
                        parameters("id", id));
                List follows = null;
                while (result.hasNext()){
                    Record r = result.next();
                     follows = r.get("follows").asList();
                }
                return follows;
            }
        });
        return allPersons;
    }


    //GET all followers of a person (all persons who were following this person)
    public List<String> getFollowers(int id){
        Session session = driver.session();
        List<String> allPersons;
        allPersons = session.readTransaction(new TransactionWork<List<String>>(){
            @Override
            public List<String> execute(Transaction tx)
            {
                ArrayList<String> followsPerson = new ArrayList<>();
                Result result = tx.run(  "MATCH (p:Person { id: 6 }) " +
                                                "OPTIONAL MATCH (p2)-[r:FOLLOWS]->(p:Person) " +
                                                "RETURN collect(p2.id) as follows",
                        parameters("id", id));
                List follows = null;
                while (result.hasNext()){
                    Record r = result.next();
                    follows = r.get("follows").asList();
                }
                return follows;
            }
        });
        return allPersons;
    }

    //UPDATE TRANSACTIONS
    //================================================================================================
    //UPDATES the name of a person by json input
    public Person update(JsonNode json) throws JSONException {
        String jsonStr = json.toString();
        JSONObject obj = new JSONObject(jsonStr);
        JSONArray arr = obj.getJSONArray("update person");

        int id = -1;
        String name_post = "";
        for (int i = 0; i < arr.length(); i++) {
            id = arr.getJSONObject(i).getInt("id");
            name_post = arr.getJSONObject(i).getString("name_post");
        }
        Person p = null;
        //check if person already exists in database
        if (personExists(id)) {
            try (Session session = driver.session()) {
                String finalName = name_post;
                int finalId = id;
                p = session.writeTransaction(new TransactionWork<Person>() {
                    @Override
                    public Person execute(Transaction tx) {
                        Result result = tx.run("MATCH (p:Person {id: $id }) " +
                                                      "SET p.name = $name_post " +
                                                      "RETURN p",
                                parameters("id", finalId, "name_post", finalName));
                        return (new Person(finalId, finalName, getSubscriptions(finalId)));
                    }
                });
            }
        }
        return p;
    }

    //UPDATES the name of a person by ID input
    public Person update(int id, String name_post) {
        Person p = null;
        //check if person already exists in database
        if (personExists(id)) {
            try (Session session = driver.session()) {
                p = session.writeTransaction(new TransactionWork<Person>() {
                    @Override
                    public Person execute(Transaction tx) {
                        Result result = tx.run("MATCH (p:Person {id: $id }) " +
                                                      "SET p.name = $name_post " +
                                                      "RETURN p",
                                parameters("id", id, "name_post", name_post));
                        return (new Person(id, name_post, getSubscriptions(id)));
                    }
                });
            }
        }
        return p;
    }

    //DELETE TRANSACTIONS
    //=================================================================================================
    //DELETES a node and all relationships of it by json input
    public void delete(JsonNode json) throws JSONException {
        String jsonStr = json.toString();
        JSONObject obj = new JSONObject(jsonStr);
        JSONArray arr = obj.getJSONArray("delete person");

        int id = -1;

        for (int i = 0; i < arr.length(); i++) {
            id = arr.getJSONObject(i).getInt("id");
        }

        try ( Session session = driver.session() )
        {
            int finalId = id;
            String person = session.writeTransaction(new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (n:Person { id: $id })" +
                                    "DETACH DELETE n",
                            parameters( "id", finalId) );
                    return "deleted";
                }
            } );
        }
    }

    //DELETES a node and all relationships of it by ID input
    public void delete(int id)
    {
        try ( Session session = driver.session() )
        {
            String person = session.writeTransaction( new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (n:Person { id: $id })" +
                                    "DETACH DELETE n",
                            parameters( "id", id ) );
                    return "deleted";
                }
            } );
        }
    }

    //DELETE all nodes
    public void emptyDB(){
        try ( Session session = driver.session() )
        {
            String person = session.writeTransaction( new TransactionWork<String>()
            {
                @Override
                public String execute( Transaction tx )
                {
                    Result result = tx.run( "MATCH (n) DETACH DELETE n");
                    return "ok";
                }
            } );
        }
    }

    public int getIdOfPayload(JsonNode json) throws JSONException {
        String jsonStr = json.toString();
        JSONObject obj = new JSONObject(jsonStr);
        int id = -1;

        if(jsonStr.contains("create person")){
            JSONArray arr = obj.getJSONArray("create person");
            for (int j = 0; j < arr.length(); j++) {
                id = arr.getJSONObject(j).getInt("id");
            }
        }

        if(jsonStr.contains("update person")){
            JSONArray arr = obj.getJSONArray("update person");
            for (int j = 0; j < arr.length(); j++) {
                id = arr.getJSONObject(j).getInt("id");
            }
        }

        if(jsonStr.contains("delete person")){
            JSONArray arr = obj.getJSONArray("delete person");
            for (int j = 0; j < arr.length(); j++) {
                id = arr.getJSONObject(j).getInt("id");
            }
        }

        if(jsonStr.contains(".follow")){
            int id_from = -1;
            int id_to = -1;
            JSONArray arr = obj.getJSONArray(".follow");
            for (int j = 0; j < arr.length(); j++) {
                id_from = arr.getJSONObject(j).getInt("id_from");
                id_to = arr.getJSONObject(j).getInt("id_to");
            }
            if(!personExists(id_from)  || !personExists(id_to)){ id = -1; }
            else{ id = id_from; }
        }

        if(jsonStr.contains(".unfollow")){
            int id_from = -1;
            int id_to = -1;
            JSONArray arr = obj.getJSONArray(".unfollow");
            for (int j = 0; j < arr.length(); j++) {
                id_from = arr.getJSONObject(j).getInt("id_from");
                id_to = arr.getJSONObject(j).getInt("id_to");
            }
            if(!personExists(id_from)  || !personExists(id_to)){ id = -1; }
            else{ id = id_from; }
        }

        if(jsonStr.contains("subscriptions")){
            JSONArray arr = obj.getJSONArray("subscriptions");
            for (int j = 0; j < arr.length(); j++) {
                id = arr.getJSONObject(j).getInt("id");
            }
        }

        if(jsonStr.contains("follower")){
            JSONArray arr = obj.getJSONArray("follower");
            for (int j = 0; j < arr.length(); j++) {
                id = arr.getJSONObject(j).getInt("id");
            }
        }
        return id;
    }
}